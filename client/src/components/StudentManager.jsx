import React, { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { UserPlus, Search, Trash2, Edit2, FileText } from 'lucide-react';

const StudentManager = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll();
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return fetchStudents();
    try {
      const res = await studentService.search(searchQuery);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await studentService.update(editingId, form);
      } else {
        await studentService.create(form);
      }
      setForm({ firstName: '', lastName: '', email: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (student) => {
    setForm({ firstName: student.firstName, lastName: student.lastName, email: student.email });
    setEditingId(student._id);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-univ-green-dark mb-4 flex items-center gap-2">
            <UserPlus size={24} />
            {editingId ? 'Modifier l\'Étudiant' : 'Ajouter un Étudiant'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="input-field"
                placeholder="Prénom"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <input
                className="input-field"
                placeholder="Nom"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <input
              className="input-field"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setForm({firstName:'', lastName:'', email:''})}} className="btn-secondary">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-univ-green-dark mb-4 flex items-center gap-2">
            <Search size={24} />
            Rechercher un Étudiant
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              className="input-field"
              placeholder="Nom ou Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary">Chercher</button>
          </form>
          <div className="mt-4 text-sm text-gray-500">
            {students.length} étudiant(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 font-bold text-univ-green-dark">Nom Complet</th>
              <th className="py-3 px-4 font-bold text-univ-green-dark">Email</th>
              <th className="py-3 px-4 font-bold text-univ-green-dark text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="py-8 text-center text-gray-400">Chargement...</td></tr>
            ) : students.map(student => (
              <tr key={student._id} className="border-b border-gray-50 hover:bg-univ-green-light/30 transition-colors">
                <td className="py-3 px-4">{student.firstName} {student.lastName}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4 text-right flex justify-end gap-2">
                  <button onClick={() => onSelectStudent(student._id)} title="Voir Bulletin" className="p-2 text-univ-green hover:bg-univ-green/10 rounded-full">
                    <FileText size={18} />
                  </button>
                  <button onClick={() => startEdit(student)} title="Modifier" className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(student._id)} title="Supprimer" className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManager;
