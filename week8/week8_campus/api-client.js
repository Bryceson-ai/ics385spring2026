class UnifiedApiClient {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
    this.rateLimiter = new Map();
    this.initializeRateLimiter();
  }

  initializeRateLimiter() {
    // Build independent rate-limit trackers per API service.
    Object.keys(this.config.config.apis).forEach((service) => {
      const api = this.config.config.apis[service];
      this.rateLimiter.set(service, {
        requests: [],
        limit: api.rateLimit.requests,
        period: api.rateLimit.period
      });
    });
  }

  isAllowed(service) {
    // Sliding-window limiter: keep only request timestamps still in current period.
    const limiter = this.rateLimiter.get(service);
    const now = Date.now();
    limiter.requests = limiter.requests.filter((time) => now - time < limiter.period);
    if (limiter.requests.length >= limiter.limit) {
      return false;
    }
    limiter.requests.push(now);
    return true;
  }

  getCacheKey(service, endpoint, params) {
    return `${service}:${endpoint}:${JSON.stringify(params || {})}`;
  }

  getCached(key) {
    // Cache expiration prevents stale API data from persisting indefinitely.
    const app = this.config.getAppConfig();
    if (!this.cache.has(key)) {
      return null;
    }
    const entry = this.cache.get(key);
    if (Date.now() - entry.timestamp > app.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  setCached(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async requestWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  async makeRequest(service, endpoint, params = {}, options = {}) {
    const api = this.config.getApiConfig(service);

    if (!this.isAllowed(service)) {
      // Graceful degradation when user or app exceeds service quota.
      return this.getFallback(service, "Rate limit reached. Serving fallback data.");
    }

    const cacheKey = this.getCacheKey(service, endpoint, params);
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { ...cached, _meta: { cached: true } };
    }

    try {
      const request = this.buildRequest(service, endpoint, params, options);
      const response = await this.requestWithTimeout(request.url, request.options, api.timeout);
      if (!response.ok) {
        throw new Error(`${service} API error (${response.status})`);
      }
      const data = await response.json();
      this.setCached(cacheKey, data);
      return { ...data, _meta: { cached: false } };
    } catch (error) {
      // Centralized fallback ensures dashboard remains functional during outages.
      return this.getFallback(service, error.message || "Request failed");
    }
  }

  buildRequest(service, endpoint, params, options) {
    const api = this.config.getApiConfig(service);
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    let url = `${api.baseUrl}${endpoint}`;

    if (service === "openWeather") {
      const query = new URLSearchParams({
        ...params,
        appid: api.key,
        units: "imperial"
      });
      url += `?${query.toString()}`;
    }

    if (service === "rapidApi") {
      headers["X-RapidAPI-Key"] = api.key;
      headers["X-RapidAPI-Host"] = api.host;
      headers.Accept = "application/json";
    }

    if (service === "jokeApi" && Object.keys(params).length > 0) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    return {
      url,
      options: {
        method: "GET",
        ...options,
        headers
      }
    };
  }

  getFallback(service, message) {
    if (service === "openWeather") {
      return {
        name: "Kahului",
        main: { temp: 78, humidity: 65 },
        weather: [{ description: "partly cloudy" }],
        wind: { speed: 10 },
        error: true,
        message
      };
    }

    if (service === "rapidApi") {
      return {
        value: "Chuck Norris can initialize state without rerendering.",
        error: true,
        message
      };
    }

    return {
      joke: "Why do programmers hate nature? It has too many bugs.",
      error: true,
      message
    };
  }

  async getWeather(city = "Kahului") {
    return this.makeRequest("openWeather", "/weather", { q: `${city},US` });
  }

  async getChuckNorrisJoke() {
    return this.makeRequest("rapidApi", "/jokes/random");
  }

  async getProgrammingJoke() {
    return this.makeRequest("jokeApi", "/joke/Programming", { type: "single" });
  }

  async getAllJokes() {
    const [chuck, programming] = await Promise.allSettled([
      this.getChuckNorrisJoke(),
      this.getProgrammingJoke()
    ]);

    return {
      chuck: chuck.status === "fulfilled" ? chuck.value : this.getFallback("rapidApi", "Unavailable"),
      programming:
        programming.status === "fulfilled"
          ? programming.value
          : this.getFallback("jokeApi", "Unavailable")
    };
  }
}
