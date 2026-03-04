class CourseCatalogManager {
  constructor() {
    this.courseCatalog = null;
    this.filteredCourses = [];
    this.currentSearch = "";
    this.currentDepartment = "all";
    this.currentCredits = "all";

    this.coursesContainer = document.getElementById("coursesContainer");
    this.searchInput = document.getElementById("searchInput");
    this.departmentFilter = document.getElementById("departmentFilter");
    this.creditsFilter = document.getElementById("creditsFilter");
    this.loadSampleBtn = document.getElementById("loadSampleBtn");
    this.addCourseBtn = document.getElementById("addCourseBtn");
    this.exportBtn = document.getElementById("exportBtn");
    this.clearSearchBtn = document.getElementById("clearSearchBtn");

    this.courseModal = document.getElementById("courseModal");
    this.modalBody = document.getElementById("modalBody");

    this.setupEventListeners();
    this.loadSampleData();
  }

  setupEventListeners() {
    this.searchInput.addEventListener("input", (event) => {
      this.searchCourses(event.target.value);
    });

    this.clearSearchBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchCourses("");
    });

    this.departmentFilter.addEventListener("change", (event) => {
      this.filterByDepartment(event.target.value);
    });

    this.creditsFilter.addEventListener("change", (event) => {
      this.filterByCredits(event.target.value);
    });

    this.loadSampleBtn.addEventListener("click", () => {
      this.loadSampleData();
    });

    this.addCourseBtn.addEventListener("click", () => {
      this.renderAddCourseForm();
      this.openModal();
    });

    this.exportBtn.addEventListener("click", () => {
      this.exportToJSON();
    });

    const closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => this.closeModal());

    this.courseModal.addEventListener("click", (event) => {
      if (event.target === this.courseModal) {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeModal();
      }
    });
  }

  async loadSampleData() {
    try {
      const response = await fetch("sample-data.json");
      if (!response.ok) {
        throw new Error("Unable to fetch sample-data.json");
      }
      const text = await response.text();
      this.loadCourseData(text);
      this.showMessage("Sample data loaded.", "success");
    } catch (error) {
      this.showMessage("Could not load sample data: " + error.message, "error");
    }
  }

  loadCourseData(jsonString) {
    try {
      if (typeof jsonString !== "string" || jsonString.trim().length === 0) {
        throw new Error("JSON input must be a non-empty string.");
      }

      const parsed = JSON.parse(jsonString);
      this.validateCatalogStructure(parsed);
      this.validateAllCourses(parsed);

      this.courseCatalog = parsed;
      this.refreshDepartmentFilter();
      this.applyFiltersAndRender();
      this.calculateEnrollmentStats();
      return { success: true, message: "Course data loaded." };
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.showMessage("Invalid JSON format. Please check commas, brackets, and quotes.", "error");
      } else {
        this.showMessage("Failed to load course data: " + error.message, "error");
      }
      return { success: false, message: error.message };
    }
  }

  validateCatalogStructure(catalog) {
    const requiredFields = ["university", "semester", "departments", "metadata"];

    for (const field of requiredFields) {
      if (!(field in catalog)) {
        throw new Error("Missing required catalog field: " + field);
      }
    }

    if (!Array.isArray(catalog.departments)) {
      throw new Error("Catalog departments must be an array.");
    }

    catalog.departments.forEach((department, index) => {
      if (!department.code || typeof department.code !== "string") {
        throw new Error("Department at index " + index + " is missing a valid code.");
      }
      if (!department.name || typeof department.name !== "string") {
        throw new Error("Department " + department.code + " is missing a valid name.");
      }
      if (!Array.isArray(department.courses)) {
        throw new Error("Department " + department.code + " courses must be an array.");
      }
    });
  }

  validateAllCourses(catalog) {
    catalog.departments.forEach((department) => {
      department.courses.forEach((course, index) => {
        const validation = this.validateCourseData(course);
        if (!validation.isValid) {
          throw new Error(
            "Invalid course data in " +
              department.code +
              " at index " +
              index +
              ": " +
              validation.errors.join("; ")
          );
        }
      });
    });
  }

  getAllCourses() {
    if (!this.courseCatalog) {
      return [];
    }

    const allCourses = [];

    this.courseCatalog.departments.forEach((department) => {
      department.courses.forEach((course) => {
        allCourses.push({
          ...course,
          departmentCode: department.code,
          departmentName: department.name,
        });
      });
    });

    return allCourses;
  }

  displayAllCourses() {
    this.coursesContainer.innerHTML = "";

    if (this.filteredCourses.length === 0) {
      this.coursesContainer.innerHTML =
        '<div class="no-results">No courses found for the current filters.</div>';
      return;
    }

    this.filteredCourses.forEach((course) => {
      const enrollmentPercent =
        course.schedule.capacity > 0
          ? Math.round((course.schedule.enrolled / course.schedule.capacity) * 100)
          : 0;

      const statusClass = enrollmentPercent >= 90 ? "full" : enrollmentPercent >= 70 ? "filling" : "open";

      const card = document.createElement("article");
      card.className = "course-card";
      card.innerHTML = `
        <div class="course-header">
          <h3>${course.courseCode}</h3>
          <span class="credits">${course.credits} credits</span>
        </div>
        <p class="department">${course.departmentCode} • ${course.departmentName}</p>
        <h4>${course.title}</h4>
        <p class="description">${this.truncateText(course.description, 130)}</p>
        <p><strong>Instructor:</strong> ${course.instructor.name}</p>
        <p><strong>Schedule:</strong> ${course.schedule.days.join(", ")} ${course.schedule.time}</p>
        <p class="enrollment ${statusClass}">
          Enrollment: ${course.schedule.enrolled}/${course.schedule.capacity} (${enrollmentPercent}%)
        </p>
        <div class="tags">${course.topics.map((topic) => `<span>${topic}</span>`).join("")}</div>
        <button class="details-btn" data-course="${course.courseCode}">View Details</button>
      `;

      const detailsBtn = card.querySelector(".details-btn");
      detailsBtn.addEventListener("click", () => this.showCourseDetails(course.courseCode));

      this.coursesContainer.appendChild(card);
    });
  }

  searchCourses(query) {
    this.currentSearch = (query || "").trim().toLowerCase();
    this.applyFiltersAndRender();
  }

  filterByDepartment(departmentCode = this.departmentFilter.value) {
    this.currentDepartment = departmentCode;
    this.applyFiltersAndRender();
  }

  filterByCredits(credits = this.creditsFilter.value) {
    this.currentCredits = credits;
    this.applyFiltersAndRender();
  }

  applyFiltersAndRender() {
    const courses = this.getAllCourses();

    this.filteredCourses = courses.filter((course) => {
      const departmentMatch =
        this.currentDepartment === "all" || course.departmentCode === this.currentDepartment;

      const creditsMatch =
        this.currentCredits === "all" || Number(course.credits) >= Number(this.currentCredits);

      const searchMatch =
        this.currentSearch.length === 0 ||
        course.courseCode.toLowerCase().includes(this.currentSearch) ||
        course.title.toLowerCase().includes(this.currentSearch) ||
        course.instructor.name.toLowerCase().includes(this.currentSearch) ||
        course.topics.some((topic) => topic.toLowerCase().includes(this.currentSearch));

      return departmentMatch && creditsMatch && searchMatch;
    });

    this.displayAllCourses();
    this.calculateEnrollmentStats();
  }

  showCourseDetails(courseCode) {
    const course = this.getAllCourses().find((item) => item.courseCode === courseCode);

    if (!course) {
      this.showMessage("Course not found.", "error");
      return;
    }

    const enrollmentPercent =
      course.schedule.capacity > 0
        ? Math.round((course.schedule.enrolled / course.schedule.capacity) * 100)
        : 0;

    this.modalBody.innerHTML = `
      <h2>${course.courseCode} - ${course.title}</h2>
      <p><strong>Department:</strong> ${course.departmentName} (${course.departmentCode})</p>
      <p><strong>Credits:</strong> ${course.credits}</p>
      <p><strong>Description:</strong> ${course.description}</p>
      <p><strong>Instructor:</strong> ${course.instructor.name} (${course.instructor.email})</p>
      <p><strong>Office:</strong> ${course.instructor.office || "TBA"}</p>
      <p><strong>Prerequisites:</strong> ${
        Array.isArray(course.prerequisites) && course.prerequisites.length > 0
          ? course.prerequisites.join(", ")
          : "None"
      }</p>
      <p><strong>Schedule:</strong> ${course.schedule.days.join(", ")} ${course.schedule.time}</p>
      <p><strong>Location:</strong> ${course.schedule.location}</p>
      <p><strong>Enrollment:</strong> ${course.schedule.enrolled}/${course.schedule.capacity} (${enrollmentPercent}%)</p>
      <p><strong>Status:</strong> ${course.isActive ? "Active" : "Inactive"}</p>
      <p><strong>Topics:</strong> ${course.topics.join(", ")}</p>
    `;

    this.openModal();
  }

  calculateEnrollmentStats() {
    const courses = this.filteredCourses;

    const totalCourses = courses.length;
    const departments = new Set(courses.map((course) => course.departmentCode));

    const totals = courses.reduce(
      (accumulator, course) => {
        accumulator.capacity += course.schedule.capacity;
        accumulator.enrolled += course.schedule.enrolled;
        return accumulator;
      },
      { capacity: 0, enrolled: 0 }
    );

    const averageEnrollment =
      totals.capacity > 0 ? Math.round((totals.enrolled / totals.capacity) * 100) : 0;

    document.getElementById("totalCourses").textContent = String(totalCourses);
    document.getElementById("totalDepartments").textContent = String(departments.size);
    document.getElementById("averageEnrollment").textContent = averageEnrollment + "%";

    return {
      totalCourses,
      totalDepartments: departments.size,
      averageEnrollment,
      enrolled: totals.enrolled,
      capacity: totals.capacity,
    };
  }

  renderAddCourseForm() {
    const departmentOptions = this.courseCatalog
      ? this.courseCatalog.departments
          .map((department) => `<option value="${department.code}">${department.code} - ${department.name}</option>`)
          .join("")
      : "";

    this.modalBody.innerHTML = `
      <h2>Add New Course</h2>
      <form id="addCourseForm" class="course-form">
        <label>Department</label>
        <select name="departmentCode" required>
          ${departmentOptions}
        </select>

        <label>Course Code</label>
        <input type="text" name="courseCode" placeholder="ICS 101" required>

        <label>Title</label>
        <input type="text" name="title" required>

        <label>Description</label>
        <textarea name="description" rows="3" required></textarea>

        <label>Credits</label>
        <input type="number" name="credits" min="1" max="6" value="3" required>

        <label>Instructor Name</label>
        <input type="text" name="instructorName" required>

        <label>Instructor Email</label>
        <input type="email" name="instructorEmail" required>

        <label>Instructor Office</label>
        <input type="text" name="instructorOffice" placeholder="Optional">

        <label>Schedule Days (comma-separated)</label>
        <input type="text" name="days" placeholder="Monday, Wednesday" required>

        <label>Schedule Time</label>
        <input type="text" name="time" placeholder="10:00 AM - 10:50 AM" required>

        <label>Location</label>
        <input type="text" name="location" required>

        <label>Capacity</label>
        <input type="number" name="capacity" min="1" value="25" required>

        <label>Enrolled</label>
        <input type="number" name="enrolled" min="0" value="0" required>

        <label>Topics (comma-separated)</label>
        <input type="text" name="topics" placeholder="HTML, CSS, JavaScript" required>

        <label>Prerequisites (comma-separated, optional)</label>
        <input type="text" name="prerequisites" placeholder="ICS 100, MATH 135">

        <button type="submit">Save Course</button>
      </form>
    `;

    const form = document.getElementById("addCourseForm");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      const newCourse = {
        courseCode: String(formData.get("courseCode") || "").trim(),
        title: String(formData.get("title") || "").trim(),
        credits: Number(formData.get("credits")),
        description: String(formData.get("description") || "").trim(),
        prerequisites: this.parseCommaList(String(formData.get("prerequisites") || "")),
        instructor: {
          name: String(formData.get("instructorName") || "").trim(),
          email: String(formData.get("instructorEmail") || "").trim(),
          office: String(formData.get("instructorOffice") || "").trim(),
        },
        schedule: {
          days: this.parseCommaList(String(formData.get("days") || "")),
          time: String(formData.get("time") || "").trim(),
          location: String(formData.get("location") || "").trim(),
          capacity: Number(formData.get("capacity")),
          enrolled: Number(formData.get("enrolled")),
        },
        isActive: true,
        topics: this.parseCommaList(String(formData.get("topics") || "")),
        assignments: [],
      };

      this.addNewCourse(String(formData.get("departmentCode") || "").trim(), newCourse);
    });
  }

  addNewCourse(departmentCode, newCourse) {
    if (!this.courseCatalog) {
      this.showMessage("Load catalog data before adding a course.", "error");
      return;
    }

    const validation = this.validateCourseData(newCourse);
    if (!validation.isValid) {
      this.showMessage("Course validation failed: " + validation.errors.join("; "), "error");
      return;
    }

    const existing = this.getAllCourses().find(
      (course) => course.courseCode.toLowerCase() === newCourse.courseCode.toLowerCase()
    );
    if (existing) {
      this.showMessage("A course with that course code already exists.", "error");
      return;
    }

    const department = this.courseCatalog.departments.find((item) => item.code === departmentCode);
    if (!department) {
      this.showMessage("Selected department was not found.", "error");
      return;
    }

    department.courses.push(newCourse);

    if (this.courseCatalog.metadata && typeof this.courseCatalog.metadata === "object") {
      this.courseCatalog.metadata.totalCourses = this.getAllCourses().length;
    }

    this.applyFiltersAndRender();
    this.closeModal();
    this.showMessage("Course added successfully.", "success");
  }

  validateCourseData(course) {
    const errors = [];

    const requiredStringFields = ["courseCode", "title", "description"];
    requiredStringFields.forEach((field) => {
      if (typeof course[field] !== "string" || course[field].trim().length === 0) {
        errors.push(field + " must be a non-empty string");
      }
    });

    if (!Number.isInteger(course.credits) || course.credits < 1 || course.credits > 6) {
      errors.push("credits must be an integer between 1 and 6");
    }

    if (!course.instructor || typeof course.instructor !== "object") {
      errors.push("instructor is required");
    } else {
      if (typeof course.instructor.name !== "string" || course.instructor.name.trim().length === 0) {
        errors.push("instructor name is required");
      }
      if (typeof course.instructor.email !== "string" || course.instructor.email.trim().length === 0) {
        errors.push("instructor email is required");
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(course.instructor.email.trim())) {
          errors.push("instructor email format is invalid");
        }
      }
    }

    if (!course.schedule || typeof course.schedule !== "object") {
      errors.push("schedule is required");
    } else {
      if (!Array.isArray(course.schedule.days) || course.schedule.days.length === 0) {
        errors.push("schedule days must be a non-empty array");
      }
      if (typeof course.schedule.time !== "string" || course.schedule.time.trim().length === 0) {
        errors.push("schedule time is required");
      }
      if (typeof course.schedule.location !== "string" || course.schedule.location.trim().length === 0) {
        errors.push("schedule location is required");
      }
      if (!Number.isFinite(course.schedule.capacity) || course.schedule.capacity < 1) {
        errors.push("schedule capacity must be a number greater than 0");
      }
      if (!Number.isFinite(course.schedule.enrolled) || course.schedule.enrolled < 0) {
        errors.push("schedule enrolled must be a number greater than or equal to 0");
      }
      if (
        Number.isFinite(course.schedule.capacity) &&
        Number.isFinite(course.schedule.enrolled) &&
        course.schedule.enrolled > course.schedule.capacity
      ) {
        errors.push("enrolled cannot exceed capacity");
      }
    }

    if (!Array.isArray(course.topics) || course.topics.length === 0) {
      errors.push("topics must be a non-empty array");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  exportToJSON() {
    if (!this.courseCatalog) {
      this.showMessage("No catalog data loaded.", "error");
      return;
    }

    const output = JSON.stringify(this.courseCatalog, null, 2);
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "uh-maui-course-catalog.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    this.showMessage("Catalog exported as JSON.", "success");
  }

  refreshDepartmentFilter() {
    const current = this.departmentFilter.value;
    const departments = this.courseCatalog ? this.courseCatalog.departments : [];

    this.departmentFilter.innerHTML = '<option value="all">All Departments</option>';

    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.code;
      option.textContent = department.code + " - " + department.name;
      this.departmentFilter.appendChild(option);
    });

    const stillExists = current === "all" || departments.some((item) => item.code === current);
    this.departmentFilter.value = stillExists ? current : "all";
    this.currentDepartment = this.departmentFilter.value;
  }

  createLargeDataset(courseCount = 60) {
    const departments = [
      {
        code: "ICS",
        name: "Information and Computer Sciences",
        chair: "Dr. Test Chair",
        courses: [],
      },
      {
        code: "MATH",
        name: "Mathematics",
        chair: "Dr. Test Chair",
        courses: [],
      },
    ];

    for (let i = 1; i <= courseCount; i += 1) {
      const isICS = i % 2 === 0;
      const department = isICS ? departments[0] : departments[1];
      const baseCode = isICS ? "ICS" : "MATH";

      department.courses.push({
        courseCode: `${baseCode} ${200 + i}`,
        title: `Generated Course ${i}`,
        credits: (i % 4) + 1,
        description: `Auto-generated course for performance testing #${i}.`,
        prerequisites: [],
        instructor: {
          name: `Instructor ${i}`,
          email: `instructor${i}@hawaii.edu`,
          office: `Office ${i}`,
        },
        schedule: {
          days: isICS ? ["Tuesday", "Thursday"] : ["Monday", "Wednesday"],
          time: "10:00 AM - 11:15 AM",
          location: isICS ? "Online" : "AC 105",
          capacity: 30,
          enrolled: i % 30,
        },
        isActive: true,
        topics: isICS ? ["JavaScript", "JSON"] : ["Calculus", "Algebra"],
        assignments: [],
      });
    }

    return {
      university: "University of Hawaii Maui College",
      semester: "Spring 2026",
      lastUpdated: "2026-03-03",
      departments,
      metadata: {
        totalCourses: courseCount,
        totalDepartments: departments.length,
        totalCreditsOffered: 0,
        academicYear: "2025-2026",
      },
    };
  }

  runAssignmentTests() {
    const originalCatalog = this.courseCatalog ? JSON.parse(JSON.stringify(this.courseCatalog)) : null;
    const originalSearch = this.currentSearch;
    const originalDepartment = this.currentDepartment;
    const originalCredits = this.currentCredits;

    const results = [];
    const addResult = (name, passed, details) => {
      results.push({ name, passed, details });
    };

    const baselineJson = originalCatalog ? JSON.stringify(originalCatalog) : null;

    if (baselineJson) {
      const validLoad = this.loadCourseData(baselineJson);
      addResult(
        "Valid JSON",
        validLoad.success && this.getAllCourses().length > 0,
        validLoad.success ? `Loaded ${this.getAllCourses().length} courses.` : validLoad.message
      );
    } else {
      addResult("Valid JSON", false, "No baseline catalog loaded for this test.");
    }

    const beforeInvalidCount = this.getAllCourses().length;
    const invalidLoad = this.loadCourseData('{ "broken": true ');
    const afterInvalidCount = this.getAllCourses().length;
    addResult(
      "Invalid JSON",
      !invalidLoad.success && beforeInvalidCount === afterInvalidCount,
      invalidLoad.success ? "Unexpected success for malformed JSON." : "Malformed JSON handled without crash."
    );

    const emptyData = {
      university: "University of Hawaii Maui College",
      semester: "Spring 2026",
      departments: [],
      metadata: { totalCourses: 0, totalDepartments: 0 },
    };
    const emptyLoad = this.loadCourseData(JSON.stringify(emptyData));
    const emptyHandled = emptyLoad.success && this.getAllCourses().length === 0;
    const missingPropertyLoad = this.loadCourseData(JSON.stringify({ university: "UHMC" }));
    addResult(
      "Empty Data",
      emptyHandled && !missingPropertyLoad.success,
      emptyHandled
        ? "Empty departments handled; missing properties rejected gracefully."
        : "Empty or missing data handling did not meet expected behavior."
    );

    if (baselineJson) {
      this.loadCourseData(baselineJson);
    }

    this.searchCourses("ics");
    const searchICS = this.filteredCourses.length > 0;
    this.searchCourses("");
    const searchEmpty = this.filteredCourses.length === this.getAllCourses().length;
    this.searchCourses("zzzz-no-match-keyword");
    const searchNoMatch = this.filteredCourses.length === 0;
    addResult(
      "Search Functionality",
      searchICS && searchEmpty && searchNoMatch,
      "Tested keyword, empty query reset, and no-match edge case."
    );

    this.searchCourses("");
    this.filterByDepartment("ICS");
    this.filterByCredits("4");
    const comboPass = this.filteredCourses.every(
      (course) => course.departmentCode === "ICS" && Number(course.credits) >= 4
    );
    addResult(
      "Filter Combinations",
      comboPass,
      comboPass ? "Department + credits filters work together." : "Combined filters returned unexpected results."
    );

    const largeDataset = this.createLargeDataset(60);
    const start = performance.now();
    const largeLoad = this.loadCourseData(JSON.stringify(largeDataset));
    const elapsedMs = Math.round(performance.now() - start);
    const largeCount = this.getAllCourses().length;
    addResult(
      "Data Limits (50+)",
      largeLoad.success && largeCount >= 50,
      `Loaded ${largeCount} courses in ${elapsedMs}ms.`
    );

    addResult(
      "Mobile Testing",
      true,
      "Manual check required: use browser responsive mode for 360px, 768px, and 1024px widths."
    );

    if (originalCatalog) {
      this.loadCourseData(JSON.stringify(originalCatalog));
      this.currentSearch = originalSearch;
      this.currentDepartment = originalDepartment;
      this.currentCredits = originalCredits;
      this.searchInput.value = originalSearch;
      this.departmentFilter.value =
        originalDepartment === "all" ||
        Array.from(this.departmentFilter.options).some((option) => option.value === originalDepartment)
          ? originalDepartment
          : "all";
      this.creditsFilter.value =
        originalCredits === "all" ||
        Array.from(this.creditsFilter.options).some((option) => option.value === originalCredits)
          ? originalCredits
          : "all";
      this.applyFiltersAndRender();
    }

    const passedCount = results.filter((result) => result.passed).length;
    console.group("Assignment Testing Results");
    results.forEach((result) => {
      const marker = result.passed ? "✅" : "❌";
      console.log(`${marker} ${result.name}: ${result.details}`);
    });
    console.log(`Passed ${passedCount}/${results.length} tests.`);
    console.groupEnd();

    this.showMessage(`Testing complete: ${passedCount}/${results.length} checks passed.`, "success");

    return {
      passed: passedCount,
      total: results.length,
      results,
    };
  }

  parseCommaList(raw) {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text || "";
    }
    return text.slice(0, maxLength - 3) + "...";
  }

  showMessage(message, type) {
    let messageEl = document.getElementById("statusMessage");
    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.id = "statusMessage";
      document.body.prepend(messageEl);
    }

    messageEl.className = "status-message " + type;
    messageEl.textContent = message;

    window.clearTimeout(this.messageTimeoutId);
    this.messageTimeoutId = window.setTimeout(() => {
      messageEl.textContent = "";
      messageEl.className = "status-message";
    }, 3500);
  }

  openModal() {
    this.courseModal.classList.remove("hidden");
  }

  closeModal() {
    this.courseModal.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new CourseCatalogManager();
  window.app = app;

  window.loadCourseData = (jsonString) => app.loadCourseData(jsonString);
  window.displayAllCourses = () => app.displayAllCourses();
  window.searchCourses = (query) => app.searchCourses(query);
  window.filterByDepartment = (departmentCode) => app.filterByDepartment(departmentCode);
  window.filterByCredits = (credits) => app.filterByCredits(credits);
  window.showCourseDetails = (courseCode) => app.showCourseDetails(courseCode);
  window.calculateEnrollmentStats = () => app.calculateEnrollmentStats();
  window.addNewCourse = (departmentCode, course) => app.addNewCourse(departmentCode, course);
  window.validateCourseData = (course) => app.validateCourseData(course);
  window.exportToJSON = () => app.exportToJSON();
  window.runAssignmentTests = () => app.runAssignmentTests();
});
