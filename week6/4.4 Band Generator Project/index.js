import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const courseIds = ["ICS 320", "ICS 169", "ICS 385"];
const courseNames = [
  "Database Design",
  "System Analysis",
  "Introduction to Computer Science",
];

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const randomCourseId = courseIds[Math.floor(Math.random() * courseIds.length)];
  const randomCourseName =
    courseNames[Math.floor(Math.random() * courseNames.length)];

  res.render("index.ejs", {
    courseId: randomCourseId,
    courseName: randomCourseName,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
