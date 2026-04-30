# UH Maui College Course Catalog (ICS 385 - Week 8)

## Assignment Purpose
This project demonstrates JSON fundamentals using a course catalog app before API integration work.
It includes JSON parsing, validation, searching, filtering, dynamic rendering, enrollment statistics, course creation, and JSON export.

## Project Files
- `index.html` - Main app structure and UI sections
- `styles.css` - Responsive, accessible styling and visual states
- `course-catalog.js` - Core catalog logic and required functions
- `sample-data.json` - Example catalog data source

## Setup Instructions
1. Open this folder in VS Code.
2. Run with a local web server (recommended) so `fetch("sample-data.json")` works:
   - VS Code Live Server extension, or
   - Python: `python -m http.server 5500`
3. Open `index.html` through the local server URL:
  - Live Server (typical): `http://127.0.0.1:5500/index.html`
  - Python server on port 5500: `http://127.0.0.1:5500/index.html`
  - Equivalent localhost URL: `http://localhost:5500/index.html`
4. Click **Load Sample Data** if data is not already loaded.

## Required Features Implemented
### 1) `loadCourseData(jsonString)`
- Parses JSON string input with error handling.
- Validates required catalog structure.
- Validates all course objects before rendering.

### 2) `displayAllCourses()`
- Renders all filtered courses as cards.
- Uses responsive grid layout and data hierarchy.

### 3) `searchCourses(query)`
- Searches by:
  - Course code
  - Title
  - Instructor name
  - Topics

### 4) `filterByDepartment()`
- Filters cards by selected department.

### 5) `filterByCredits()`
- Filters cards by credit threshold (`1`, `2`, `3`, `4+`).

### 6) `showCourseDetails()`
- Opens modal with complete course information.

### 7) `calculateEnrollmentStats()`
- Computes and displays:
  - Total courses
  - Number of departments in view
  - Average enrollment percentage

### 8) `addNewCourse()`
- Uses modal form to create new course records.
- Performs duplicate code checks and catalog insertion.

### 9) `validateCourseData()`
- Verifies required fields and data types.
- Validates nested objects and email format.
- Ensures enrollment does not exceed capacity.

### 10) `exportToJSON()`
- Downloads modified catalog as formatted `.json` file.

## CSS Styling Requirements Coverage
- **Responsive Grid Layout**: 1-column mobile, 2-column tablet, 3-column desktop.
- **Course Card Design**: Clear hierarchy with title, credits, instructor, schedule, and tags.
- **Color-Coded Enrollment**: Green (`open`), yellow (`filling`), red (`full`).
- **Interactive Elements**: Hover transitions, active states, and disabled styles.
- **Modal Design**: Centered, scrollable, high-contrast detail panel.
- **Accessibility (WCAG 2.1 AA focus)**:
  - High-contrast text/background pairings
  - Visible `:focus-visible` indicators
  - Touch targets at least ~44px for controls
- **Typography**: Scaled headings and readable body line-height.
- **Mobile Optimization**: Flexible controls and comfortable spacing for small screens.

## Notes for Grading
- Required functions are implemented in `course-catalog.js` and also exposed on `window` for easy testing.
- Sample data is loaded from `sample-data.json`.

## Testing Requirements Coverage

### Quick Test Runner
1. Open the app in the browser.
2. Open Developer Tools Console.
3. Run:
  - `runAssignmentTests()`
4. Review pass/fail output in the console.

### What the Test Runner Verifies
- **Valid JSON**: Loads correctly formatted catalog JSON.
- **Invalid JSON**: Confirms malformed JSON is handled without app crash.
- **Empty Data**: Confirms empty departments are handled and missing properties are rejected gracefully.
- **Search Functionality**: Tests keyword match, empty query reset, and no-match edge case.
- **Filter Combinations**: Tests department + credits filtering together.
- **Data Limits**: Generates and loads 60 courses to verify 50+ course handling and logs load time.
- **Mobile Testing**: Includes manual checklist guidance in output.

### Manual Mobile Testing Steps
Use browser responsive mode and verify at each width:
- **360px** (small phone): 1-column course cards, touch-friendly controls.
- **768px** (tablet): 2-column course cards.
- **1024px+** (desktop): 3-column course cards.

Confirm:
- Buttons and form controls remain easy to tap.
- Text remains readable.
- Modal remains usable with scrolling.
- Focus outlines are visible when tabbing through controls.
