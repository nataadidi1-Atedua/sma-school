
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  User,
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  ClipboardCheck,
  TrendingUp,
  Download, 
  Filter,
  ArrowLeft,
  Save,
  Check,
  Info,
  Mail,
  Send,
  Zap
} from 'lucide-react';
import { ClassSchedule, Student } from '../types';
import { aiService } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface ClassesDetailedViewProps {
  schedule: ClassSchedule;
  onClose: () => void;
}

interface StudentWithAttendance extends Student {
  attendance: boolean[];
}

const MOCK_STUDENTS: StudentWithAttendance[] = [
  { id: 'E24001', name: 'Alice Thompson', email: 'alice.t@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2024-01-20', avatar: 'https://i.pravatar.cc/150?u=E24001', attendance: [true, true, true, false, true, true, true], schoolName: 'SM@ Academy' },
  { id: 'E24002', name: 'Benjamin Carter', email: 'ben.c@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2023-05-12', avatar: 'https://i.pravatar.cc/150?u=E24002', attendance: [true, false, true, true, true, false, true], schoolName: 'SM@ Academy' },
  { id: 'E24003', name: 'Chloe Miller', email: 'chloe.m@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2023-08-15', avatar: 'https://i.pravatar.cc/150?u=E24003', attendance: [true, true, false, true, true, true, false], schoolName: 'SM@ Academy' },
  { id: 'E24004', name: 'Daniel Wilson', email: 'daniel.w@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2023-11-02', avatar: 'https://i.pravatar.cc/150?u=E24004', attendance: [false, true, true, false, true, true, true], schoolName: 'SM@ Academy' },
  { id: 'E24005', name: 'Emily Davis', email: 'emily.d@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2024-01-05', avatar: 'https://i.pravatar.cc/150?u=E24005', attendance: [true, true, true, true, true, true, true], schoolName: 'SM@ Academy' },
  { id: 'E24006', name: 'Frank Moore', email: 'frank.m@school.edu', grade: '12-A', status: 'Active', enrollmentDate: '2023-06-20', avatar: 'https://i.pravatar.cc/150?u=E24006', attendance: [false, false, true, true, false, true, true], schoolName: 'SM@ Academy' },
];

const DATES = ['15 Mar', '16 Mar', '17 Mar', '18 Mar', '19 Mar', '20 Mar', '21 Mar'];

const ClassesDetailedView: React.FC<ClassesDetailedViewProps> = ({ schedule, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'comm'>('attendance');
  const [studentsData, setStudentsData] = useState<StudentWithAttendance[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Email state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const storageKey = `sm_attendance_${schedule.id}`;

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setStudentsData(JSON.parse(savedData));
    } else {
      setStudentsData(MOCK_STUDENTS);
    }
  }, [schedule.id]);

  const toggleAttendance = (studentId: string, dateIndex: number) => {
    setStudentsData(prev => prev.map(student => {
      if (student.id === studentId) {
        const newAttendance = [...student.attendance];
        newAttendance[dateIndex] = !newAttendance[dateIndex];
        return { ...student, attendance: newAttendance };
      }
      return student;
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(storageKey, JSON.stringify(studentsData));
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    }, 600);
  };

  const attendanceMetrics = DATES.map((_, dateIdx) => {
    if (studentsData.length === 0) return { presentCount: 0, isMajority: false };
    const presentCount = studentsData.filter(s => s.attendance[dateIdx]).length;
    const isMajority = presentCount > studentsData.length / 2;
    return { presentCount, isMajority };
  });

  const handleDraftScheduleChangeEmail = async () => {
    setIsDrafting(true);
    setEmailModalOpen(true);
    setEmailSubject(`Alteração de Horário - ${schedule.subject}`);
    const draft = await aiService.draftEmailNotification(
      `Mudança de Horário: ${schedule.subject}`,
      `A próxima aula foi alterada para às 11:30. Atenciosamente, Secretaria SM@ Academy.`,
      language
    );
    setEmailDraft(draft);
    setIsDrafting(false);
  };

  const sendBroadcast = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setEmailModalOpen(false);
      alert(`${studentsData.length} e-mails enviados com sucesso para a turma de ${schedule.subject}!`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in slide-in-from-right-10 duration-500">
      
      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Mail size={20} /></div>
                <h3 className="text-xl font-black">Comunicado da Unidade</h3>
              </div>
              <button onClick={() => setEmailModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assunto</label>
                <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensagem (Gerada por IA)</label>
                <textarea 
                  rows={8} 
                  value={emailDraft} 
                  onChange={e => setEmailDraft(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-blue-500 resize-none custom-scrollbar"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={sendBroadcast}
                  disabled={isSending || isDrafting}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {isSending ? <Zap size={18} className="animate-spin" /> : <Send size={18} />}
                  {isSending ? 'Enviando...' : `Disparar para ${studentsData.length} Alunos`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <header className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">{schedule.subject}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><User size={10} /> {schedule.teacher}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1"><MapPin size={10} /> {schedule.room}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {schedule.subject === 'Ciência da Computação' && (
            <button 
              onClick={handleDraftScheduleChangeEmail}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all"
            >
              <Mail size={14} /> Notificar Mudança (11:30)
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              showSavedFeedback 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
            ) : showSavedFeedback ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}
            {showSavedFeedback ? 'Salvo!' : isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="flex gap-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: ClipboardCheck },
            { id: 'students', label: 'Estudantes', icon: Users },
            { id: 'attendance', label: 'Lista de Presença', icon: Calendar },
            { id: 'comm', label: 'Comunicados', icon: Mail },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Scrolável */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {activeTab === 'attendance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Registro de Frequência</h3>
                <p className="text-sm text-slate-500 font-medium">Clique nos ícones para alternar entre presença e falta.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/80">
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 min-w-[250px] sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">Estudante</th>
                      {DATES.map((date, idx) => (
                        <th 
                          key={date} 
                          className={`px-4 py-5 text-center text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 transition-colors ${
                            attendanceMetrics[idx].isMajority ? 'bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{date}</span>
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">% Geral</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {studentsData.map((student) => {
                      const totalPresent = student.attendance.filter(a => a).length;
                      const percentage = Math.round((totalPresent / DATES.length) * 100);
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4 sticky left-0 bg-white dark:bg-slate-900 z-10 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                              <img src={student.avatar} className="w-9 h-9 rounded-xl shadow-sm border border-slate-100" />
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{student.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{student.id}</p>
                              </div>
                            </div>
                          </td>
                          {student.attendance.map((isPresent, idx) => (
                            <td 
                              key={idx} 
                              className={`px-4 py-4 text-center border-x border-transparent transition-colors ${
                                attendanceMetrics[idx].isMajority ? 'bg-emerald-50/20 dark:bg-emerald-900/5' : ''
                              }`}
                            >
                              <button 
                                onClick={() => toggleAttendance(student.id, idx)}
                                className="flex items-center justify-center w-full group/btn"
                              >
                                {isPresent ? (
                                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300 hover:scale-110">
                                    <CheckCircle2 size={16} />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/30 text-rose-400 rounded-full flex items-center justify-center hover:scale-110">
                                    <XCircle size={16} />
                                  </div>
                                )}
                              </button>
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                              percentage >= 80 ? 'bg-blue-50 text-blue-600' : percentage >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comm' && (
          <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in slide-in-from-bottom-4">
             <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                   <Mail size={40} />
                </div>
                <h2 className="text-3xl font-black">Central de Comunicados</h2>
                <p className="text-slate-500 font-medium">Envie avisos rápidos ou comunicados formais para todos os alunos desta turma.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => { setEmailModalOpen(true); setEmailSubject(''); setEmailDraft(''); }}
                  className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
                >
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Send size={24} />
                   </div>
                   <h4 className="text-lg font-black mb-2">Novo Aviso</h4>
                   <p className="text-xs text-slate-500 font-medium">Escreva uma mensagem personalizada para a turma.</p>
                </button>

                <button 
                  onClick={handleDraftScheduleChangeEmail}
                  className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
                >
                   <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Clock size={24} />
                   </div>
                   <h4 className="text-lg font-black mb-2">Alteração de Horário</h4>
                   <p className="text-xs text-slate-500 font-medium">Use a IA para notificar mudanças no cronograma rapidamente.</p>
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesDetailedView;
