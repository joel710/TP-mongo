import React, { useState, useEffect } from 'react';
import { courseService, studentService } from '../services/api';
import { BookOpen, UserPlus, Users, Send } from 'lucide-react';

const StudentGradeRow = ({ student, courseId, onUpdate }) => {
  const [score, setScore] = useState('');

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!score) return;
    try {
      await courseService.addGrade(courseId, student._id, score);
      setScore('');
      alert(`Note enregistrée pour ${student.firstName} !`);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'ajout de la note');
    }
  };

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-50 hover:bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium">{student.firstName} {student.lastName}</div>
        <div className="text-xs text-gray-400">{student.email}</div>
      </div>

      <form onSubmit={handleAddGrade} className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Note"
          className="w-16 p-1 text-sm border rounded outline-none focus:ring-1 focus:ring-univ-green"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          min="0"
          max="100"
          required
        />
        <button type="submit" className="p-1 text-univ-green hover:bg-univ-green/10 rounded">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', code: '', description: '' });
  const [enrollForm, setEnrollForm] = useState({ courseId: '', studentId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        courseService.getAll(),
        studentService.getAll()
      ]);
      setCourses(coursesRes.data);
      setStudents(studentsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseService.create(newCourse);
      setNewCourse({ title: '', code: '', description: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating course');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await courseService.enroll(enrollForm.courseId, enrollForm.studentId);
      setEnrollForm({ ...enrollForm, studentId: '' });
      if (selectedCourse?._id === enrollForm.courseId) {
        fetchCourseStudents(selectedCourse._id);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error enrolling student');
    }
  };

  const fetchCourseStudents = async (id) => {
    try {
      const res = await courseService.getStudents(id);
      setEnrolledStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    fetchCourseStudents(course._id);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Creation Form */}
        <div className="card">
          <h2 className="text-xl font-bold text-univ-green-dark mb-4 flex items-center gap-2">
            <BookOpen size={24} />
            Créer un Cours
          </h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <input
              className="input-field"
              placeholder="Titre du cours (ex: Algorithmique)"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Code du cours (ex: CS101)"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              required
            />
            <textarea
              className="input-field"
              placeholder="Description..."
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full">Créer le cours</button>
          </form>
        </div>

        {/* Enrollment Form */}
        <div className="card">
          <h2 className="text-xl font-bold text-univ-green-dark mb-4 flex items-center gap-2">
            <UserPlus size={24} />
            Inscrire un Étudiant
          </h2>
          <form onSubmit={handleEnroll} className="space-y-4">
            <select
              className="input-field"
              value={enrollForm.courseId}
              onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}
              required
            >
              <option value="">Sélectionner un cours</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
            </select>
            <select
              className="input-field"
              value={enrollForm.studentId}
              onChange={(e) => setEnrollForm({ ...enrollForm, studentId: e.target.value })}
              required
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
            </select>
            <button type="submit" className="btn-primary w-full">Inscrire</button>
          </form>
        </div>
      </div>

      {/* Course List & Students */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card md:col-span-1 h-96 overflow-y-auto">
          <h3 className="font-bold text-univ-green-dark mb-4 border-b pb-2">Liste des Cours</h3>
          <ul className="space-y-2">
            {courses.map(course => (
              <li
                key={course._id}
                onClick={() => handleSelectCourse(course)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCourse?._id === course._id ? 'bg-univ-green text-white shadow-md' : 'hover:bg-univ-green-light border border-gray-100'}`}
              >
                <div className="font-bold">{course.code}</div>
                <div className="text-sm">{course.title}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card md:col-span-2 min-h-96">
          {selectedCourse ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-univ-green-dark flex items-center gap-2">
                  <Users size={20} />
                  Inscrits à : {selectedCourse.title}
                </h3>
                <span className="bg-univ-green-light text-univ-green px-3 py-1 rounded-full text-sm font-bold border border-univ-green/20">
                  {enrolledStudents.length} étudiants
                </span>
              </div>

              <div className="space-y-4">
                {enrolledStudents.map(student => (
                  <StudentGradeRow
                    key={student._id}
                    student={student}
                    courseId={selectedCourse._id}
                    onUpdate={() => fetchCourseStudents(selectedCourse._id)}
                  />
                ))}
                {enrolledStudents.length === 0 && (
                  <div className="text-center py-12 text-gray-400">Aucun étudiant inscrit à ce cours.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>Sélectionnez un cours pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManager;
