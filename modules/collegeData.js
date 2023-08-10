const Sequelize = require('sequelize');
const sequelize = new Sequelize('guzaewyh', 'guzaewyh', '6HpHLOXkCvfcO6JwFJ-bf2D8jjLodVP2', {
  host: 'drona.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING
});

const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

const initialize = () => {
  return sequelize.sync()
    .then(() => {
      console.log('Database and tables synced.');
    })
    .catch(err => {
      console.error('Unable to sync the database:', err);
      throw err;
    });
};

function getAllStudents() {
  return Student.findAll()
    .then(students => {
      if (students.length > 0) {
        return students;
      } else {
        throw new Error('No results returned');
      }
    })
    .catch(err => {
      console.error('Error fetching all students:', err);
      throw err;
    });
}

function getStudentsByCourse(courseId) {
  return Student.findAll({
    where: {
      course: courseId
    }
  })
    .then(students => {
      if (students.length > 0) {
        return students;
      } else {
        throw new Error('No results returned');
      }
    })
    .catch(err => {
      console.error('Error fetching students by course:', err);
      throw err;
    });
}

function getStudentByNum(studentNum) {
  return Student.findOne({
    where: {
      studentNum: studentNum
    }
  })
    .then(student => {
      if (student) {
        return student;
      } else {
        throw new Error('No results returned');
      }
    })
    .catch(err => {
      console.error('Error fetching student by studentNum:', err);
      throw err;
    });
}

function getCourses() {
  return Course.findAll()
    .then(courses => {
      if (courses.length > 0) {
        return courses;
      } else {
        throw new Error('No results returned');
      }
    })
    .catch(err => {
      console.error('Error fetching all courses:', err);
      throw err;
    });
}

function getCourseById(id) {
  return Course.findByPk(id)
    .then(course => {
      if (course) {
        return course;
      } else {
        throw new Error('No results returned');
      }
    })
    .catch(err => {
      console.error('Error fetching course by ID:', err);
      throw err;
    });
}

function addStudent(studentData) {
  studentData.TA = studentData.TA ? true : false;
  for (const key in studentData) {
    if (studentData[key] === '') {
      studentData[key] = null;
    }
  }
  
  return Student.create(studentData)
    .then(() => {
      console.log('Student added successfully.');
    })
    .catch(err => {
      console.error('Error adding student:', err);
      throw err;
    });
}

function updateStudent(studentData) {
  studentData.TA = studentData.TA ? true : false;
  for (const key in studentData) {
    if (studentData[key] === '') {
      studentData[key] = null;
    }
  }
  
  return Student.update(studentData, {
    where: {
      studentNum: studentData.studentNum
    }
  })
    .then(() => {
      console.log('Student updated successfully.');
    })
    .catch(err => {
      console.error('Error updating student:', err);
      throw err;
    });
}

function addCourse(courseData) {
  for (const key in courseData) {
    if (courseData[key] === '') {
      courseData[key] = null;
    }
  }
  
  return Course.create(courseData)
    .then(() => {
      console.log('Course added successfully.');
    })
    .catch(err => {
      console.error('Error adding course:', err);
      throw err;
    });
}

function updateCourse(courseData) {
  for (const key in courseData) {
    if (courseData[key] === '') {
      courseData[key] = null;
    }
  }
  
  return Course.update(courseData, {
    where: {
      courseId: courseData.courseId
    }
  })
    .then(() => {
      console.log('Course updated successfully.');
    })
    .catch(err => {
      console.error('Error updating course:', err);
      throw err;
    });
}

function deleteCourseById(id) {
  return Course.destroy({
    where: {
      courseId: id
    }
  })
    .then(() => {
      console.log('Course deleted successfully.');
    })
    .catch(err => {
      console.error('Error deleting course:', err);
      throw err;
    });
}
function deleteStudentByNum(studentNum) {
  return Student.destroy({
    where: {
      studentNum: studentNum
    }
  })
  .then(() => {
    console.log('Student deleted successfully.');
  })
  .catch(err => {
    console.error('Error deleting student:', err);
    throw err;
  });
}



module.exports = {
  initialize,
  getAllStudents,
  getStudentsByCourse,
  getStudentByNum,
  getCourses,
  getCourseById,
  addStudent,
  updateStudent,
  addCourse,
  updateCourse,
  deleteCourseById,
  deleteStudentByNum
};
