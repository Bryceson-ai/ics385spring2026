class CourseCatalogManager {
  constructor() {
    this.courseCatalog = null;
    this.filteredCourses = [];
    this.searchQuery = "";
    this.department = "all";
    this.coursesContainer = document.getElementById("coursesContainer");
    this.searchInput = document.getElementById("courseSearch");
    this.departmentFilter = document.getElementById("departmentFilter");

    this.searchInput.addEventListener("input", (event) => {
      this.searchQuery = event.target.value.trim().toLowerCase();
      this.applyFiltersAndRender();
    });

    this.departmentFilter.addEventListener("change", (event) => {
      this.department = event.target.value;
      this.applyFiltersAndRender();
    });
  }

  async loadSampleData() {
    const response = await fetch("sample-data.json");
    if (!response.ok) {
      throw new Error("Unable to load sample-data.json");
    }
    const catalog = await response.json();
    this.validateCatalog(catalog);
    this.courseCatalog = catalog;
    this.refreshDepartmentFilter();
    this.applyFiltersAndRender();
    return catalog;
  }

  validateCatalog(catalog) {
    if (!catalog || !Array.isArray(catalog.departments)) {
      throw new Error("Invalid catalog format");
    }
    catalog.departments.forEach((department) => {
      if (!department.code || !Array.isArray(department.courses)) {
        throw new Error(`Invalid department: ${department.code || "unknown"}`);
      }
    });
  }

  getAllCourses() {
    if (!this.courseCatalog) {
      return [];
    }

    return this.courseCatalog.departments.flatMap((department) =>
      department.courses.map((course) => ({
        ...course,
        departmentCode: department.code,
        departmentName: department.name
      }))
    );
  }

  getStats() {
    const courses = this.getAllCourses();
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + Number(course.schedule.enrolled || 0), 0);
    const totalCapacity = courses.reduce((sum, course) => sum + Number(course.schedule.capacity || 0), 0);
    const averageCapacity = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

    return {
      totalCourses,
      totalStudents,
      averageCapacity
    };
  }

  refreshDepartmentFilter() {
    const previous = this.departmentFilter.value;
    this.departmentFilter.innerHTML = '<option value="all">All Departments</option>';
    this.courseCatalog.departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.code;
      option.textContent = `${department.code} - ${department.name}`;
      this.departmentFilter.appendChild(option);
    });
    const keep = Array.from(this.departmentFilter.options).some((o) => o.value === previous);
    this.departmentFilter.value = keep ? previous : "all";
    this.department = this.departmentFilter.value;
  }

  applyFiltersAndRender() {
    const courses = this.getAllCourses();
    this.filteredCourses = courses.filter((course) => {
      const departmentMatch = this.department === "all" || course.departmentCode === this.department;
      const searchMatch =
        !this.searchQuery ||
        course.courseCode.toLowerCase().includes(this.searchQuery) ||
        course.title.toLowerCase().includes(this.searchQuery) ||
        course.instructor.name.toLowerCase().includes(this.searchQuery) ||
        (course.topics || []).some((topic) => topic.toLowerCase().includes(this.searchQuery));
      return departmentMatch && searchMatch;
    });

    this.renderCourses();
  }

  renderCourses() {
    if (this.filteredCourses.length === 0) {
      this.coursesContainer.innerHTML = '<div class="no-results">No courses match current filters.</div>';
      return;
    }

    this.coursesContainer.innerHTML = this.filteredCourses
      .map((course) => {
        const percent =
          course.schedule.capacity > 0
            ? Math.round((course.schedule.enrolled / course.schedule.capacity) * 100)
            : 0;
        const enrollmentClass = percent >= 90 ? "full" : percent >= 70 ? "filling" : "open";
        return `
          <article class="course-card">
            <h4>${course.courseCode} - ${course.title}</h4>
            <p>${course.departmentCode} • ${course.instructor.name}</p>
            <p>${course.credits} credits</p>
            <p class="enrollment ${enrollmentClass}">${course.schedule.enrolled}/${course.schedule.capacity} (${percent}%)</p>
            <div class="course-actions">
              <button data-action="edit" data-code="${course.courseCode}">Edit</button>
              <button data-action="delete" data-code="${course.courseCode}">Delete</button>
            </div>
          </article>
        `;
      })
      .join("");

    this.coursesContainer.querySelectorAll("button[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        const code = button.getAttribute("data-code");
        if (action === "edit") {
          window.dashboard.openCourseEditor(code);
        }
        if (action === "delete") {
          this.deleteCourse(code);
        }
      });
    });
  }

  findCourse(courseCode) {
    for (const department of this.courseCatalog.departments) {
      const index = department.courses.findIndex((course) => course.courseCode === courseCode);
      if (index > -1) {
        return { department, index, course: department.courses[index] };
      }
    }
    return null;
  }

  addCourse(departmentCode, newCourse) {
    const department = this.courseCatalog.departments.find((item) => item.code === departmentCode);
    if (!department) {
      throw new Error("Department not found");
    }
    const duplicate = this.getAllCourses().some(
      (course) => course.courseCode.toLowerCase() === newCourse.courseCode.toLowerCase()
    );
    if (duplicate) {
      throw new Error("Course code already exists");
    }
    department.courses.push(newCourse);
    this.applyFiltersAndRender();
  }

  updateCourse(originalCode, departmentCode, updatedCourse) {
    const found = this.findCourse(originalCode);
    if (!found) {
      throw new Error("Course not found");
    }

    found.department.courses.splice(found.index, 1);
    const department = this.courseCatalog.departments.find((item) => item.code === departmentCode);
    if (!department) {
      throw new Error("Department not found");
    }
    department.courses.push(updatedCourse);
    this.applyFiltersAndRender();
  }

  deleteCourse(courseCode) {
    if (!window.confirm(`Delete ${courseCode}?`)) {
      return;
    }
    const found = this.findCourse(courseCode);
    if (!found) {
      window.dashboard.showMessage("Course not found.", "error");
      return;
    }
    found.department.courses.splice(found.index, 1);
    this.applyFiltersAndRender();
    window.dashboard.showMessage("Course deleted.", "success");
  }

  exportToJSON() {
    const output = {
      generatedAt: new Date().toISOString(),
      courses: this.getAllCourses(),
      weather: window.dashboard.latestWeather,
      jokes: window.dashboard.latestJokes,
      apiStatus: window.dashboard.getApiStatusSummary(),
      settings: appConfig.getSettings()
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "campus-dashboard-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
