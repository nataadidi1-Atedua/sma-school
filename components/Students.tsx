
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, FileWarning, Star, TrendingDown, Users, Search, Trash2, X, 
  GraduationCap, Building, Mail, Calendar, ClipboardCheck, ArrowRight,
  ChevronRight, Award, FileText, CheckCircle2, AlertTriangle, Activity
} from 'lucide-react';
import { Student } from '../types';

const STORAGE_KEY = 'sm_academy_students_db';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', grade: '12', turno: 'M', classLetter: 'A', schoolName: '' });

  // Carregar dados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      const initial: Student[] = Array.from({ length: 80 }, (_, i) => ({
        id: `E${24000 + i}`,
        name: `Aluno ${i + 1}`,
        email: `aluno${i}@school.edu`,
        grade: '12-A',
        status: 'Active',
        enrollmentDate: '2024-01-20',
        avatar: `https://i.pravatar.cc/150?u=${i}`,
        schoolName: i % 2 === 0 ? 'SM@ Academy Principal' : 'Instituto Politécnico Sul',
        pendingDocumentsCount: Math.floor(Math.random() * 5),
        averageScore: 50 + Math.random() * 50,
        scores: { 'Matemática': 75 + Math.random() * 20, 'Português': 70 + Math.random() * 25, 'Física': 60 + Math.random() * 30 }
      }));
      setStudents(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  // Rankings
  const topPendingDocs = useMemo(() => 
    [...students]
      .filter(s => (s.pendingDocumentsCount || 0) > 0)
      .sort((a, b) => (b.pendingDocumentsCount || 0) - (a.pendingDocumentsCount || 0))
      .slice(0, 50)
  , [students]);

  const top20Students = useMemo(() => 
    [...students]
      .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
      .slice(0, 20)
  , [students]);

  const bottom10Students = useMemo(() => 
    [...students]
      .sort((a, b) => (a.averageScore || 0) - (b.averageScore || 0))
      .slice(0, 10)
  , [students]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `E${Math.floor(10000 + Math.random() * 90000)}`;
    const student: Student = {
      id,
      name: newStudent.name,
      email: newStudent.email,
      grade: `${newStudent.grade}-${newStudent.classLetter}`,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      schoolName: newStudent.schoolName || 'SM@ Academy',
      pendingDocumentsCount: 0,
      averageScore: 0
    };
    setStudents([student, ...students]);
    setIsModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evita abrir o modal ao deletar
    if (window.confirm('Excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const renderStudentRow = (student: Student, index: number, showScore = false, showDocs = false) => (
    <tr 
      key={student.id} 
      onClick={() => setSelectedStudent(student)}
      className="transition-all hover:bg-black/5 cursor-pointer group"
    >
      <td className="px-6 py-4">
        <span className="font-mono text-[10px] font-black opacity-60">#{index + 1}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={student.avatar} className="w-9 h-9 rounded-xl border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt="" />
          <div>
            <p className="text-xs font-black text-slate-900">{student.name}</p>
            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
              <Building size={10} /> {student.schoolName}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-black px-2 py-1 bg-white/50 rounded-lg uppercase tracking-widest">{student.grade}</span>
      </td>
      {showScore && (
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: `${student.averageScore}%` }} />
            </div>
            <span className="text-xs font-black text-slate-900">{student.averageScore?.toFixed(1)}%</span>
          </div>
        </td>
      )}
      {showDocs && (
        <td className="px-6 py-4">
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 w-fit ${student.pendingDocumentsCount && student.pendingDocumentsCount > 3 ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
            <AlertTriangle size={10} /> {student.pendingDocumentsCount} pendentes
          </span>
        </td>
      )}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 items-center">
          <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          <button onClick={(e) => handleDelete(e, student.id)} className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 1. Modal de Cadastro Rápido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
            <h2 className="text-2xl font-black dark:text-white mb-8 uppercase tracking-tight">Matrícula Direta</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input required placeholder="Nome Completo" onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-blue-500" />
              <input required type="email" placeholder="E-mail Académico" onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-blue-500" />
              <input required placeholder="Instituição de Origem" onChange={e => setNewStudent({...newStudent, schoolName: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-blue-500" />
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all">Confirmar Registro</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal de Detalhes do Aluno (Dossiê 360) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 relative">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all z-10">
              <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
              {/* Header do Perfil */}
              <div className="flex flex-col md:flex-row gap-10 items-center border-b border-slate-100 dark:border-slate-800 pb-12 mb-12">
                <div className="relative">
                  <img src={selectedStudent.avatar} className="w-40 h-40 rounded-[3.5rem] object-cover border-8 border-slate-50 dark:border-slate-800 shadow-2xl" alt="" />
                  <div className={`absolute -bottom-2 -right-2 p-4 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900 ${selectedStudent.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    <CheckCircle2 className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedStudent.name}</h2>
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">{selectedStudent.id}</span>
                  </div>
                  <p className="text-lg text-slate-500 font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
                    <Building className="text-blue-500" size={20} /> {selectedStudent.schoolName}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ano / Classe</p>
                      <p className="text-sm font-black dark:text-white uppercase">{selectedStudent.grade}</p>
                    </div>
                    <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Inscrição</p>
                      <p className="text-sm font-black dark:text-white">{selectedStudent.enrollmentDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Lado Esquerdo: Académico */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm"><Award size={20} /></div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Rendimento Académico</h3>
                  </div>

                  <div className="p-8 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100 dark:border-indigo-800/50 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black uppercase text-slate-400">Média Geral</span>
                      <span className="text-3xl font-black text-indigo-600">{selectedStudent.averageScore?.toFixed(1)}%</span>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(selectedStudent.scores || {}).map(([subject, score]) => (
                        <div key={subject}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest">{subject}</span>
                            <span className="text-xs font-black">{score}%</span>
                          </div>
                          <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Administrativo & Contato */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-sm"><FileText size={20} /></div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Situação Administrativa</h3>
                  </div>

                  <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                      <span className="text-xs font-black uppercase flex items-center gap-2"><ClipboardCheck size={16} /> Documentos Pendentes</span>
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${selectedStudent.pendingDocumentsCount ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {selectedStudent.pendingDocumentsCount || 0} ITEMS
                      </span>
                    </div>
                    
                    <ul className="space-y-3">
                       {['Cópia do BI', 'Certificado de Habilitações', 'Atestado Médico', 'Fotos de Passe'].slice(0, selectedStudent.pendingDocumentsCount).map((doc, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                           <AlertTriangle size={14} className="text-orange-500" /> {doc}
                         </li>
                       ))}
                       {(selectedStudent.pendingDocumentsCount || 0) === 0 && (
                         <li className="text-xs font-bold text-emerald-600 flex items-center gap-2"><CheckCircle2 size={16} /> Tudo Regularizado</li>
                       )}
                    </ul>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informação de Contato</p>
                      <button className="w-full p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-lg transition-all group">
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Mail size={20} /></div>
                         <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">E-mail Académico</p><p className="text-sm font-black">{selectedStudent.email}</p></div>
                         <ArrowRight className="ml-auto text-slate-200 group-hover:text-blue-600 transition-colors" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Activity className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Verificação SM@ Ativo</span>
               </div>
               <div className="flex gap-4">
                 <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Imprimir Dossiê</button>
                 <button onClick={() => setSelectedStudent(null)} className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest">Fechar</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Header de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 text-white rounded-[2rem] shadow-xl">
              <Users size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Estatísticas de Alunos</h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{students.length} Estudantes Geridos em Rede</p>
           </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl active:scale-95">
          <UserPlus size={18} /> Inscrição Direta
        </button>
      </div>

      {/* Rankings Dinâmicos */}
      <div className="grid grid-cols-1 gap-12">
        {/* TOP 50 PENDING DOCUMENTS */}
        {topPendingDocs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <FileWarning size={20} className="text-orange-500" />
                <h3 className="text-lg font-black text-orange-800 uppercase tracking-tight">Anomalias: Documentação Pendente (Top 50)</h3>
              </div>
            </div>
            <div className="bg-[#fff7ed] rounded-[3.5rem] border border-orange-100 shadow-sm overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-orange-100/50">
                      <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Pos</th>
                      <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Aluno / Unidade</th>
                      <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Classe</th>
                      <th className="px-6 py-4 text-[10px] font-black text-orange-600 uppercase tracking-widest">Items</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {topPendingDocs.map((s, i) => renderStudentRow(s, i, false, true))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TOP 20 OUTSTANDING */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-lime-600" />
            <h3 className="text-lg font-black text-lime-900 uppercase tracking-tight">Estudantes Destaques (Top 20 Académico)</h3>
          </div>
          <div className="bg-[#ccff00] rounded-[3.5rem] border border-lime-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-lime-400/20">
                  <th className="px-6 py-4 text-[10px] font-black text-lime-800 uppercase tracking-widest">Pos</th>
                  <th className="px-6 py-4 text-[10px] font-black text-lime-800 uppercase tracking-widest">Aluno / Unidade</th>
                  <th className="px-6 py-4 text-[10px] font-black text-lime-800 uppercase tracking-widest">Classe</th>
                  <th className="px-6 py-4 text-[10px] font-black text-lime-800 uppercase tracking-widest">Média</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lime-300/30">
                {top20Students.map((s, i) => renderStudentRow(s, i, true))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM 10 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingDown size={20} className="text-blue-500" />
            <h3 className="text-lg font-black text-blue-800 uppercase tracking-tight">Plano de Recuperação Necessário (Bottom 10)</h3>
          </div>
          <div className="bg-[#e0ffff] rounded-[3.5rem] border border-blue-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-200/50">
                  <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Pos</th>
                  <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Aluno / Unidade</th>
                  <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Classe</th>
                  <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Média</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200/50">
                {bottom10Students.map((s, i) => renderStudentRow(s, i, true))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
