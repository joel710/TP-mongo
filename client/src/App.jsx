import React, { useState } from 'react';
import StudentManager from './components/StudentManager';
import CourseManager from './components/CourseManager';
import ReportCard from './components/ReportCard';
import { GraduationCap, Users, BookOpen, LayoutDashboard } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const renderContent = () => {
    if (selectedStudentId) {
      return <ReportCard studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
    }

    switch (activeTab) {
      case 'students':
        return <StudentManager onSelectStudent={setSelectedStudentId} />;
      case 'courses':
        return <CourseManager />;
      default:
        return <StudentManager onSelectStudent={setSelectedStudentId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-univ-green-dark text-white p-6 md:fixed md:h-full z-10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-white p-2 rounded-xl text-univ-green-dark">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">UnivPortal</h1>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => { setActiveTab('students'); setSelectedStudentId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'students' && !selectedStudentId ? 'bg-univ-green text-white shadow-lg' : 'hover:bg-univ-green-light/10 text-univ-green-light/70 hover:text-white'}`}
          >
            <Users size={20} className={`transition-transform duration-200 ${activeTab === 'students' ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="font-semibold">Étudiants</span>
          </button>

          <button
            onClick={() => { setActiveTab('courses'); setSelectedStudentId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'courses' ? 'bg-univ-green text-white shadow-lg' : 'hover:bg-univ-green-light/10 text-univ-green-light/70 hover:text-white'}`}
          >
            <BookOpen size={20} className={`transition-transform duration-200 ${activeTab === 'courses' ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="font-semibold">Cours</span>
          </button>
        </nav>

        <div className="mt-auto pt-20 hidden md:block">
          <div className="p-4 bg-univ-green-light/5 rounded-2xl border border-univ-green-light/10">
            <p className="text-xs text-univ-green-light/50 font-bold uppercase tracking-widest mb-1">Status Base de données</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-univ-green rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Connecté à MongoDB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-center mb-8 no-print">
          <div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-univ-green" />
              {selectedStudentId ? 'Bulletin Académique' : activeTab === 'students' ? 'Gestion des Étudiants' : 'Gestion des Cours'}
            </h2>
            <p className="text-gray-400 font-medium">Système de gestion universitaire TP MongoDB</p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
