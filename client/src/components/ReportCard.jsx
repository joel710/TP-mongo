import React, { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { GraduationCap, ArrowLeft, Printer, Award } from 'lucide-react';

const ReportCard = ({ studentId, onBack }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchReport();
    }
  }, [studentId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await studentService.getReport(studentId);
      setReport(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const printReport = () => window.print();

  if (loading) return <div className="text-center py-20 text-univ-green animate-pulse">Chargement du bulletin...</div>;
  if (!report) return <div className="text-center py-20 text-red-500">Erreur lors du chargement.</div>;

  const { student, average, grades } = report;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center no-print">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={20} /> Retour
        </button>
        <button onClick={printReport} className="btn-primary flex items-center gap-2 bg-univ-green-dark">
          <Printer size={20} /> Imprimer
        </button>
      </div>

      <div className="card shadow-xl border-t-8 border-univ-green relative overflow-hidden">
        {/* Background Design */}
        <div className="absolute top-0 right-0 -m-12 opacity-5 pointer-events-none">
          <GraduationCap size={240} className="text-univ-green-dark" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-univ-green-dark uppercase tracking-tight">Bulletin Académique</h1>
            <p className="text-gray-500">Année Universitaire 2023 - 2024</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <h2 className="text-xl font-bold">{student.firstName} {student.lastName}</h2>
            <p className="text-sm text-univ-green">{student.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Cours</th>
                  <th className="py-4 font-bold text-gray-400 text-xs uppercase tracking-widest text-right">Code</th>
                  <th className="py-4 font-bold text-gray-400 text-xs uppercase tracking-widest text-right">Note / 100</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g._id} className="border-b border-gray-50">
                    <td className="py-4 font-semibold text-univ-green-dark">{g.course.title}</td>
                    <td className="py-4 text-gray-500 text-right">{g.course.code}</td>
                    <td className="py-4 font-mono font-bold text-right">{g.score}</td>
                  </tr>
                ))}
                {grades.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-gray-400 italic">Aucune note enregistrée pour cet étudiant.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-univ-green-light/50 p-8 rounded-2xl flex flex-col items-center justify-center border-2 border-univ-green/10">
            <Award size={48} className="text-univ-green mb-2" />
            <h3 className="text-sm font-bold text-univ-green-dark uppercase tracking-wider mb-2">Moyenne Générale</h3>
            <div className={`text-6xl font-black ${average >= 50 ? 'text-univ-green-dark' : 'text-red-500'}`}>
              {average.toFixed(1)}
            </div>
            <div className="text-xs font-bold text-gray-400 mt-2 uppercase">Points</div>
          </div>
        </div>

        <div className="border-t pt-8 grid grid-cols-2 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          <div>Signature de la Scolarité</div>
          <div>Cachet de l'Université</div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
