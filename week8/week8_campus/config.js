class SecureConfig {
  constructor() {
    // Central storage keys used for local development mode.
    this.storageKeys = {
      openWeather: "openweather_api_key",
      rapidApi: "rapidapi_api_key",
      settings: "dashboard_settings"
    };
    this.defaults = {
      app: {
        name: "UH Maui Campus Dashboard",
        defaultCity: "Kahului",
        cacheDuration: 600000,
        apiTimeout: 5000,
        refreshInterval: 600000,
        debugMode: true,
        logLevel: "info"
      },
      apis: {
        openWeather: {
          baseUrl: "https://api.openweathermap.org/data/2.5",
          endpoints: { current: "/weather" },
          rateLimit: { requests: 60, period: 60000 },
          timeout: 5000
        },
        rapidApi: {
          baseUrl: "https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com",
          host: "matchilling-chuck-norris-jokes-v1.p.rapidapi.com",
          endpoints: { random: "/jokes/random" },
          rateLimit: { requests: 100, period: 60000 },
          timeout: 5000
        },
        jokeApi: {
          baseUrl: "https://sv443.net/jokeapi/v2",
          endpoints: { randomProgramming: "/joke/Programming" },
          rateLimit: { requests: 120, period: 60000 },
          timeout: 5000
        }
      }
    };
    this.config = this.loadConfiguration();
  }

  loadConfiguration() {
    // Merge persisted user settings into defaults so app restarts keep preferences.
    const userSettings = this.getSettings();
    return {
      app: { ...this.defaults.app, ...userSettings },
      apis: {
        ...this.defaults.apis,
        openWeather: {
          ...this.defaults.apis.openWeather,
          key: this.getApiKey("openWeather")
        },
        rapidApi: {
          ...this.defaults.apis.rapidApi,
          key: this.getApiKey("rapidApi")
        }
      }
    };
  }

  getApiKey(service) {
    const storageKey = this.storageKeys[service];
    if (!storageKey) {
      return "";
    }
    return localStorage.getItem(storageKey) || "";
  }

  setApiKeys({ openWeather, rapidApi }) {
    if (typeof openWeather === "string" && openWeather.trim()) {
      localStorage.setItem(this.storageKeys.openWeather, openWeather.trim());
    }
    if (typeof rapidApi === "string" && rapidApi.trim()) {
      localStorage.setItem(this.storageKeys.rapidApi, rapidApi.trim());
    }
    this.config = this.loadConfiguration();
    return this.validateApiKeys();
  }

  validateApiKeys() {
    // Validation is intentionally presence-based for local testing.
    // Functional key validity is confirmed during real API requests.
    const openWeather = this.getApiKey("openWeather");
    const rapidApi = this.getApiKey("rapidApi");
    return {
      openWeatherConfigured: Boolean(openWeather),
      rapidApiConfigured: Boolean(rapidApi),
      allConfigured: Boolean(openWeather && rapidApi)
    };
  }

  getSettings() {
    try {
      const raw = localStorage.getItem(this.storageKeys.settings);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  updateSettings(newSettings) {
    // Settings are persisted client-side to support assignment UX requirements.
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(this.storageKeys.settings, JSON.stringify(merged));
    this.config = this.loadConfiguration();
    return merged;
  }

  getApiConfig(service) {
    return this.config.apis[service];
  }

  getAppConfig() {
    return this.config.app;
  }
}

const appConfig = new SecureConfig();
