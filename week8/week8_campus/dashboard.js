class CampusDashboard {
  constructor() {
    this.config = appConfig;
    this.apiClient = new UnifiedApiClient(this.config);
    this.catalog = new CourseCatalogManager();
    this.lastUpdated = { weather: null, jokes: null };
    this.latestWeather = null;
    this.latestJokes = null;
    this.refreshTimer = null;

    this.bindEvents();
    this.initialize();
  }

  bindEvents() {
    document.getElementById("refreshAllBtn").addEventListener("click", () => this.refreshAll());
    document.getElementById("settingsBtn").addEventListener("click", () => this.openSettings());
    document.getElementById("addCourseBtn").addEventListener("click", () => this.openCourseCreator());
    document.getElementById("exportBtn").addEventListener("click", () => this.exportData());
    document.getElementById("refreshWeatherBtn").addEventListener("click", () => this.refreshWeather());
    document.getElementById("refreshHumorBtn").addEventListener("click", () => this.refreshHumor());

    document.getElementById("saveApiKeysBtn").addEventListener("click", () => this.saveApiKeys());
    document.getElementById("skipApiKeysBtn").addEventListener("click", () => this.hideApiModal());

    document.getElementById("courseForm").addEventListener("submit", (event) => this.saveCourseForm(event));
    document.getElementById("cancelCourseBtn").addEventListener("click", () => this.hideCourseModal());
  }

  async initialize() {
    this.ensureApiSetup();
    try {
      // Local catalog is loaded first so dashboard has useful data even if APIs fail.
      await this.catalog.loadSampleData();
      await this.refreshAll();
      this.startAutoRefresh();
      this.showMessage("Dashboard ready.", "success");
    } catch (error) {
      this.showMessage(error.message || "Initialization failed", "error");
    }
  }

  ensureApiSetup() {
    const status = this.config.validateApiKeys();
    if (!status.allConfigured) {
      document.getElementById("apiKeyModal").classList.remove("hidden");
    }
  }

  hideApiModal() {
    document.getElementById("apiKeyModal").classList.add("hidden");
  }

  saveApiKeys() {
    const openWeather = document.getElementById("openWeatherKey").value;
    const rapidApi = document.getElementById("rapidApiKey").value;
    const result = this.config.setApiKeys({ openWeather, rapidApi });

    if (result.openWeatherConfigured || result.rapidApiConfigured) {
      this.hideApiModal();
      this.showMessage("API keys saved.", "success");
      this.refreshAll();
      return;
    }
    this.showMessage("No API keys entered. Fallback data will be used.", "error");
  }

  async refreshAll() {
    // Execute API calls in parallel to reduce perceived refresh time.
    await Promise.allSettled([this.refreshWeather(), this.refreshHumor()]);
    this.updateStats();
  }

  async refreshWeather() {
    const city = this.config.getAppConfig().defaultCity;
    const weather = await this.apiClient.getWeather(city);
    this.latestWeather = weather;
    this.lastUpdated.weather = Date.now();
    this.renderWeather(weather);
    this.updateStats();
  }

  async refreshHumor() {
    const jokes = await this.apiClient.getAllJokes();
    this.latestJokes = jokes;
    this.lastUpdated.jokes = Date.now();
    this.renderHumor(jokes);
  }

  renderWeather(data) {
    const weather = document.getElementById("weather-widget");
    const updated = this.formatLastUpdated(this.lastUpdated.weather);
    weather.innerHTML = `
      <div class="widget-header">
        <h3>Campus Weather</h3>
        <p>${updated}</p>
      </div>
      <div class="weather-content">
        <div><strong>${data.name}</strong></div>
        <div>${Math.round(data.main.temp)}°F • ${data.weather[0].description}</div>
        <div>Humidity: ${data.main.humidity}% • Wind: ${data.wind.speed} mph</div>
        ${data.error ? `<div class="enrollment full">${data.message}</div>` : ""}
      </div>
    `;
  }

  renderHumor(jokes) {
    const humor = document.getElementById("humor-widget");
    const chuck = jokes.chuck.value || jokes.chuck.joke || "Unavailable";
    const programming =
      jokes.programming.joke || `${jokes.programming.setup || ""} ${jokes.programming.delivery || ""}`.trim();

    humor.innerHTML = `
      <div class="widget-header">
        <h3>Campus Humor</h3>
        <p>${this.formatLastUpdated(this.lastUpdated.jokes)}</p>
      </div>
      <div class="humor-content">
        <div class="joke-section">
          <h4>Chuck Norris Fact</h4>
          <p>${chuck}</p>
        </div>
        <div class="joke-section">
          <h4>Programming Joke</h4>
          <p>${programming || "Unavailable"}</p>
        </div>
      </div>
    `;
  }

  updateStats() {
    const stats = this.catalog.getStats();
    document.getElementById("total-courses").textContent = String(stats.totalCourses);
    document.getElementById("total-students").textContent = String(stats.totalStudents);
    document.getElementById("avg-capacity").textContent = `${stats.averageCapacity}%`;
    document.getElementById("api-status").textContent = this.getApiStatusSummary();
  }

  getApiStatusSummary() {
    const weatherReady = this.lastUpdated.weather ? "Weather" : "No Weather";
    const jokesReady = this.lastUpdated.jokes ? "Jokes" : "No Jokes";
    return `${weatherReady}, ${jokesReady}`;
  }

  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    const refreshInterval = Number(this.config.getAppConfig().refreshInterval || 600000);
    // Requirement: weather updates automatically; humor refresh stays user-driven.
    this.refreshTimer = setInterval(() => {
      this.refreshWeather();
    }, refreshInterval);
  }

  openSettings() {
    const current = this.config.getAppConfig();
    const value = window.prompt(
      "Set weather refresh interval in minutes (current: " + Math.round(current.refreshInterval / 60000) + ")",
      String(Math.round(current.refreshInterval / 60000))
    );
    if (!value) {
      return;
    }
    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes < 1) {
      this.showMessage("Invalid interval.", "error");
      return;
    }
    this.config.updateSettings({ refreshInterval: minutes * 60000 });
    this.startAutoRefresh();
    this.showMessage("Settings updated.", "success");
  }

  openCourseCreator() {
    this.openCourseModal();
    document.getElementById("courseModalTitle").textContent = "Add Course";
    document.getElementById("courseEditId").value = "";
    this.populateDepartmentOptions();
    document.getElementById("courseForm").reset();
  }

  openCourseEditor(courseCode) {
    const course = this.catalog.getAllCourses().find((item) => item.courseCode === courseCode);
    if (!course) {
      this.showMessage("Course not found.", "error");
      return;
    }

    this.openCourseModal();
    document.getElementById("courseModalTitle").textContent = "Edit Course";
    document.getElementById("courseEditId").value = course.courseCode;
    this.populateDepartmentOptions(course.departmentCode);
    document.getElementById("courseCode").value = course.courseCode;
    document.getElementById("courseTitle").value = course.title;
    document.getElementById("courseCredits").value = course.credits;
    document.getElementById("courseInstructor").value = course.instructor.name;
    document.getElementById("courseEmail").value = course.instructor.email;
    document.getElementById("courseCapacity").value = course.schedule.capacity;
    document.getElementById("courseEnrolled").value = course.schedule.enrolled;
    document.getElementById("courseTopics").value = (course.topics || []).join(", ");
    document.getElementById("courseDescription").value = course.description;
  }

  populateDepartmentOptions(selectedCode) {
    const select = document.getElementById("courseDepartment");
    select.innerHTML = this.catalog.courseCatalog.departments
      .map((department) => `<option value="${department.code}">${department.code} - ${department.name}</option>`)
      .join("");
    if (selectedCode) {
      select.value = selectedCode;
    }
  }

  saveCourseForm(event) {
    event.preventDefault();

    const editId = document.getElementById("courseEditId").value;
    const departmentCode = document.getElementById("courseDepartment").value;
    const course = {
      courseCode: document.getElementById("courseCode").value.trim(),
      title: document.getElementById("courseTitle").value.trim(),
      credits: Number(document.getElementById("courseCredits").value),
      description: document.getElementById("courseDescription").value.trim(),
      prerequisites: [],
      instructor: {
        name: document.getElementById("courseInstructor").value.trim(),
        email: document.getElementById("courseEmail").value.trim(),
        office: "TBA"
      },
      schedule: {
        days: ["Tuesday", "Thursday"],
        time: "TBA",
        location: "TBA",
        capacity: Number(document.getElementById("courseCapacity").value),
        enrolled: Number(document.getElementById("courseEnrolled").value)
      },
      isActive: true,
      topics: document
        .getElementById("courseTopics")
        .value.split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      assignments: []
    };

    try {
      if (editId) {
        this.catalog.updateCourse(editId, departmentCode, course);
        this.showMessage("Course updated.", "success");
      } else {
        this.catalog.addCourse(departmentCode, course);
        this.showMessage("Course added.", "success");
      }
      this.hideCourseModal();
      this.updateStats();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  openCourseModal() {
    document.getElementById("courseModal").classList.remove("hidden");
  }

  hideCourseModal() {
    document.getElementById("courseModal").classList.add("hidden");
  }

  exportData() {
    // Export includes integrated local + live data for assignment deliverable.
    this.catalog.exportToJSON();
    this.showMessage("Dashboard data exported.", "success");
  }

  formatLastUpdated(timestamp) {
    if (!timestamp) {
      return "Never updated";
    }
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff <= 0) {
      return "Updated just now";
    }
    return `Updated ${diff} min ago`;
  }

  showMessage(message, type) {
    let node = document.getElementById("statusMessage");
    if (!node) {
      node = document.createElement("div");
      node.id = "statusMessage";
      document.body.prepend(node);
    }
    node.className = `status-message ${type}`;
    node.textContent = message;
    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      node.textContent = "";
      node.className = "status-message";
    }, 3500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new CampusDashboard();
});
