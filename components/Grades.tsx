
import React, { useState } from 'react';
import { GraduationCap, Search, FileText, CheckCircle2, Save, X, Printer, Download, Sparkles, Plus, BookOpen, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Student } from '../types';

// Fixed: Added missing required property 'schoolName' to satisfy the Student interface
const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Thompson', email: 'alice.t@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2021-09-01', avatar: 'https://picsum.photos/seed/alice/100', scores: { Math: 92, Science: 88, History: 95, English: 90 }, schoolName: 'SM@ Academy Principal' },
  { id: '2', name: 'Benjamin Carter', email: 'ben.c@school.edu', grade: '11-B', status: 'Active', enrollmentDate: '2022-09-01', avatar: 'https://picsum.photos/seed/ben/100', scores: { Math: 75, Science: 82, History: 78, English: 80 }, schoolName: 'SM@ Academy Principal' },
];

const Grades: React.FC = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState<{ [studentId: string]: { name: string, score: string } }>({});

  const handleScoreChange = (studentId: string, subject: string, val: string) => {
    const num = parseInt(val) || 0;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, scores: { ...s.scores, [subject]: num } };
      }
      return s;
    }));
  };

  const handleAddGrade = (studentId: string) => {
    const input = newSubjectInput[studentId];
    if (!input || !input.name.trim()) return;

    const scoreNum = parseInt(input.score) || 0;
    
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { 
          ...s, 
          scores: { 
            ...(s.scores || {}), 
            [input.name.trim()]: scoreNum 
          } 
        };
      }
      return s;
    }));

    // Reset input
    setNewSubjectInput(prev => ({
      ...prev,
      [studentId]: { name: '', score: '' }
    }));
  };

  const removeSubject = (studentId: string, subject: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId && s.scores) {
        const newScores = { ...s.scores };
        delete newScores[subject];
        return { ...s, scores: newScores };
      }
      return s;
    }));
  };

  const getAverage = (scores?: Record<string, number>) => {
    if (!scores || Object.keys(scores).length === 0) return 0;
    const vals = Object.values(scores);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const handleInputChange = (studentId: string, field: 'name' | 'score', value: string) => {
    setNewSubjectInput(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { name: '', score: '' }),
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-20">
      {/* Report Modal */}
      {isReportOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-12 relative print:p-0">
             <button onClick={() => setIsReportOpen(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 print:hidden">
                <X size={24} />
             </button>
             
             {/* Formal Report Header */}
             <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl mb-4">SM@</div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">School Manager Academy</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Official Academic Record • 2024/25</p>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b border-slate-100">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</h4>
                  <p className="text-lg font-bold text-slate-900">{selectedStudent.name}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade Level</h4>
                  <p className="text-lg font-bold text-slate-900">{selectedStudent.grade}</p>
                </div>
             </div>

             <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-3 text-left text-xs font-black uppercase tracking-widest">Subject</th>
                    <th className="py-3 text-right text-xs font-black uppercase tracking-widest">Score</th>
                    <th className="py-3 text-right text-xs font-black uppercase tracking-widest">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {Object.entries(selectedStudent.scores || {}).map(([subject, score]) => (
                     <tr key={subject}>
                        <td className="py-4 text-sm font-bold text-slate-700">{subject}</td>
                        <td className="py-4 text-right text-sm font-black text-slate-900">{score}%</td>
                        <td className="py-4 text-right">
                          <span className={`text-[10px] font-black px-2 py-1 rounded ${(score as number) >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {(score as number) >= 90 ? 'EXCELLENT' : (score as number) >= 70 ? 'GOOD' : 'RETAKE'}
                          </span>
                        </td>
                     </tr>
                   ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50">
                    <td className="py-4 px-4 text-sm font-black text-slate-900">FINAL AVERAGE</td>
                    <td className="py-4 text-right text-lg font-black text-blue-600">{getAverage(selectedStudent.scores)}%</td>
                    <td className="py-4 px-4 text-right text-xs font-bold text-slate-500 italic">Promoted</td>
                  </tr>
                </tfoot>
             </table>

             <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-100 print:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Sparkles size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Verified Credentials</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 transition-all">
                      <Printer size={16} /> PRINT
                   </button>
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                      <Download size={16} /> PDF
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('grades.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('grades.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {students.map(student => (
          <div key={student.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl transition-all flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <img src={student.avatar} className="w-20 h-20 rounded-[1.5rem] border-4 border-slate-50 dark:border-slate-800 object-cover shadow-lg" />
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">{student.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {student.grade}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                      ID: {student.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Média Ponderada</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{getAverage(student.scores)}</span>
                  <span className="text-sm font-black text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(student.scores || {}).map(([subject, score]) => (
                <div key={subject} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100/50 dark:border-slate-700/50 group relative">
                  <button 
                    onClick={() => removeSubject(student.id, subject)}
                    className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BookOpen size={12} /> {subject}
                  </p>
                  <div className="flex items-center justify-between">
                    <input 
                      type="number" 
                      value={score}
                      onChange={(e) => handleScoreChange(student.id, subject, e.target.value)}
                      className={`w-full bg-transparent text-2xl font-black focus:ring-0 outline-none transition-colors ${(score as number) >= 90 ? 'text-blue-600' : (score as number) < 70 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}
                      max="100"
                      min="0"
                    />
                    <span className="text-xs font-black text-slate-300">%</span>
                  </div>
                  <div className="mt-4 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${(score as number) >= 90 ? 'bg-blue-600' : (score as number) < 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Lançamento de Nova Nota (Quick Add) */}
              <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-[2rem] border-2 border-dashed border-blue-200 dark:border-blue-800/50 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Nova Disciplina..." 
                      value={newSubjectInput[student.id]?.name || ''}
                      onChange={(e) => handleInputChange(student.id, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-blue-100 dark:border-blue-900 focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="Nota (0-100)" 
                      value={newSubjectInput[student.id]?.score || ''}
                      onChange={(e) => handleInputChange(student.id, 'score', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-blue-100 dark:border-blue-900 focus:border-blue-500"
                      max="100"
                      min="0"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleAddGrade(student.id)}
                  disabled={!newSubjectInput[student.id]?.name.trim()}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  <Plus size={14} /> Lançar Nota
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button 
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl"
                >
                  <Save size={16} /> {t('grades.save')}
                </button>
                <button 
                  onClick={() => { setSelectedStudent(student); setIsReportOpen(true); }}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  <FileText size={16} /> {t('grades.report')}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;
