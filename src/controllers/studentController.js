const Student = require('../models/student');
const Grade = require('../models/grade');
const Course = require('../models/course');

// 1. Ajouter un étudiant
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Modifier un étudiant
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un étudiant
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Cleanup grades associated with student
    await Grade.deleteMany({ student: req.params.id });

    // Remove student from all courses
    await Course.updateMany(
      { students: req.params.id },
      { $pull: { students: req.params.id } }
    );

    res.json({ message: 'Student and their records deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to escape regex characters to prevent ReDoS/regex injection
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 4. Rechercher un étudiant par nom ou email
exports.searchStudents = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const escapedQuery = escapeRegExp(query);
    const students = await Student.find({
      $or: [
        { firstName: new RegExp(escapedQuery, 'i') },
        { lastName: new RegExp(escapedQuery, 'i') },
        { email: new RegExp(escapedQuery, 'i') }
      ]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Générer un bulletin avec la moyenne des notes par étudiant
exports.getStudentReportCard = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const grades = await Grade.find({ student: studentId }).populate('course');

    if (grades.length === 0) {
      return res.json({ student, average: 0, grades: [] });
    }

    const total = grades.reduce((acc, curr) => acc + curr.score, 0);
    const average = total / grades.length;

    res.json({
      student,
      average,
      grades
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
