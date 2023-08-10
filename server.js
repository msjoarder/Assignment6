const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const collegeData = require("./modules/collegeData");
const bodyParser = require("body-parser");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = '/' + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, '') : route.replace(/\/(.*)/, ''));
  next();
});

// Handlebars setup with custom helpers
const hbs = exphbs.create({
  helpers: {
    navLink: function (url, options) {
      return `<li${url == app.locals.activeRoute ? ' class="nav-item active"' : ' class="nav-item"'}><a class="nav-link" href="${url}">${options.fn(this)}</a></li>`;
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
  },
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static("views")); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname)));

// Routes

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// About
app.get("/about", (req, res) => {
  res.render("about");
});

// HTML Demo
app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

// Students
app.get("/students", (req, res) => {
  collegeData
    .getAllStudents()
    .then((students) => {
      res.render("students", { students });
    })
    .catch((err) => {
      res.render("students", { message: "No results found." });
    });
});

app.get("/student/:studentNum", (req, res) => {
  let viewData = {};
  collegeData.getStudentByNum(req.params.studentNum)
    .then((student) => {
      viewData.student = student || null;
    })
    .catch(() => {
      viewData.student = null;
    })
    .then(collegeData.getCourses)
    .then((courses) => {
      viewData.courses = courses;
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = [];
    })
    .then(() => {
      if (viewData.student == null) {
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData });
      }
    });
});


// Courses
app.get("/courses", (req, res) => {
  collegeData
    .getCourses()
    .then((courses) => {
      res.render("courses", { courses });
    })
    .catch((err) => {
      res.render("courses", { message: "No courses found." });
    });
});

// Single Course
app.get("/course/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  collegeData
    .getCourseById(courseId)
    .then((course) => {
      if (!course) {
        res.status(404).send("Course Not Found");
      } else {
        res.render("course", { course });
      }
    })
    .catch((err) => {
      res.status(500).send("Error fetching course");
    });
});

// Add New Student Form
app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.get("/students/add", (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      res.render("addStudent", { courses });
    })
    .catch(() => {
      res.render("addStudent", { courses: [] });
    });
});

app.post("/students/add", (req, res) => {
  const studentData = req.body;

  collegeData
    .addStudent(studentData)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      console.error("Error adding student:", err);
      res.status(500).send("Error adding student");
    });
});

// Update Student
app.post("/student/update", (req, res) => {
  const studentData = req.body;
  collegeData
    .updateStudent(studentData)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      console.error("Error updating student:", err);
      res.status(500).send("Error updating student");
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  data.deleteStudentByNum(req.params.studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});

// Add New Course Form
app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

// Add New Course
app.post("/courses/add", (req, res) => {
  const courseData = req.body;
  collegeData
    .addCourse(courseData)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      console.error("Error adding course:", err);
      res.status(500).send("Error adding course");
    });
});

// Update Course
app.post("/course/update", (req, res) => {
  const courseData = req.body;
  collegeData
    .updateCourse(courseData)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      console.error("Error updating course:", err);
      res.status(500).send("Error updating course");
    });
});

// Delete Course
app.get("/course/delete/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  collegeData
    .deleteCourseById(courseId)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      console.error("Error deleting course:", err);
      res.status(500).send("Unable to Remove Course / Course not found");
    });
});

// Start the server
collegeData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });
