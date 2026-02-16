
import React, { useState, useEffect, useMemo } from 'react';
import { UserSquare2, Mail, Briefcase, Phone, MoreVertical, ShieldCheck, BadgeCheck, Trash2, Plus, X, GraduationCap, Table, LayoutGrid, Search, Building } from 'lucide-react';
import { StaffMember, School } from '../types';

const STORAGE_KEY = 'sm_academy_staff_db';

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '', email: '' });

  // Carregar dados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStaff(JSON.parse(saved));
    } else {
      const initial: StaffMember[] = [
        { id: 'SM240101PF', name: 'Dr. Sarah Mitchell', role: 'Diretora Escolar', department: 'Admin', email: 's.mitchell@school.edu', status: 'Active', avatar: 'https://picsum.photos/seed/sarah/150' },
        { id: 'SM230502PF', name: 'James Wilson', role: 'Professor de Matemática', department: 'Ciências', email: 'j.wilson@school.edu', status: 'Active', avatar: 'https://picsum.photos/seed/james/150' },
      ];
      setStaff(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }

    const savedSchools = localStorage.getItem('sm_academy_schools_v6');
    if (savedSchools) {
      setSchools(JSON.parse(savedSchools));
    }
  }, []);

  // Aggregated list of all teachers across the platform
  const allProfessors = useMemo(() => {
    const fromGlobal = staff.filter(s => s.role.toLowerCase().includes('prof') || s.role.toLowerCase().includes('docente'));
    
    // Aggregating from school-specific staff lists if any
    const fromSchools: any[] = [];
    schools.forEach(school => {
      if (school.staff) {
        school.staff.forEach(member => {
          if (member.role === 'TEACHER') {
            fromSchools.push({
              id: member.personalCode || member.id,
              name: member.name,
              role: 'Professor(a)',
              department: 'Pedagógico',
              email: '-',
              status: 'Active',
              avatar: `https://i.pravatar.cc/150?u=${member.id}`,
              schoolName: school.name
            });
          }
        });
      }
    });

    return [...fromGlobal, ...fromSchools].filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [staff, schools, searchTerm]);

  // Salvar dados
  useEffect(() => {
    if (staff.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    }
  }, [staff]);

  const generateYYMM = () => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${yy}${mm}`;
  };

  const generateTeacherId = () => {
    const yymm = generateYYMM();
    const num = Math.floor(1 + Math.random() * 99).toString().padStart(2, '0');
    return `SM${yymm}${num}PF`;
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateTeacherId();
    const member: StaffMember = {
      id,
      ...newMember,
      status: 'Active',
      avatar: `https://picsum.photos/seed/${id}/150`
    };
    setStaff([member, ...staff]);
    setIsModalOpen(false);
    setNewMember({ name: '', role: '', department: '', email: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remover colaborador permanentemente?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black dark:text-white">Novo Colaborador</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X /></button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo</label>
                <input required value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departamento</label>
                <input required value={newMember.department} onChange={e => setNewMember({...newMember, department: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all mt-4">Confirmar Contratação</button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl">
              <UserSquare2 size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Equipe & Professores</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Gestão Unificada de IDs Profissionais da Rede</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
             <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
             <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}><Table size={18}/></button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 flex items-center gap-2 active:scale-95 transition-all">
            <Plus size={18} /> Adicionar
          </button>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar professor pelo nome ou código..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {staff.map((member) => (
            <div key={member.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
              <button onClick={() => handleDelete(member.id)} className="absolute top-6 right-6 p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 z-10"><Trash2 size={18} /></button>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-lg" />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-xl shadow-xl border-2 border-white dark:border-slate-900">
                    <BadgeCheck size={16} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1.5">CÓDIGO PROFISSIONAL</span>
                  <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                    {member.id}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-none relative z-10 uppercase tracking-tight">{member.name}</h3>
              <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.15em] relative z-10">{member.role}</p>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-xs font-bold">
                  <Briefcase size={16} className="text-indigo-300" />
                  <span>Departamento de {member.department}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-xs font-bold">
                  <Mail size={16} className="text-indigo-300" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <button className="w-full mt-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                Aceder Perfil Completo
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in zoom-in-95">
           <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3"><GraduationCap className="text-indigo-600" /> Lista Mestra de Professores da Rede</h3>
              <span className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{allProfessors.length} Docentes</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Professor / Docente</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Escolar</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departamento</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {allProfessors.map((p) => (
                     <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-5">
                           <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">{p.id}</span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <img src={p.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                              <div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white leading-none uppercase">{p.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5">{p.role}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                              <Building size={14} className="text-slate-300" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{p.schoolName || 'Central'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 uppercase">{p.department}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><MoreVertical size={18}/></button>
                        </td>
                     </tr>
                   ))}
                   {allProfessors.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-20 text-center">
                           <div className="flex flex-col items-center gap-4 opacity-20">
                              <Search size={48} />
                              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum docente encontrado</p>
                           </div>
                        </td>
                     </tr>
                   )}
                </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
