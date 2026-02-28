const Course = require('../models/course');
const Student = require('../models/student');
const Grade = require('../models/grade');

exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Assigner des étudiants à des cours
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ error: 'Course or Student not found' });
    }

    if (course.students.includes(studentId)) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    course.students.push(studentId);
    student.courses.push(courseId);

    await course.save();
    await student.save();

    res.json({ message: 'Student enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Lister les étudiants inscrits à un cours spécifique
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course.students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add grade for student in course
exports.addGrade = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const { score } = req.body;

    const grade = await Grade.findOneAndUpdate(
      { student: studentId, course: courseId },
      { score },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(grade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
