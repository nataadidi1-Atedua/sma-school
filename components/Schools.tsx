
import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, GraduationCap, Edit2, X, Globe, Trash2, 
  Phone, FileText, LayoutList, Building, CheckCircle2, Layers, Key, Landmark, 
  Mail, ShieldCheck, Zap, UserCheck, Shield, ClipboardList, Target, 
  History, UserPlus, Fingerprint, FileSearch, Notebook, Coins, Eye, 
  Camera, AlertCircle, TrendingUp, Calendar, Filter, ArrowRight, Save,
  MapPin, UserSquare2, ListChecks, Database, Activity, ShieldAlert,
  Users, BarChart3, Microscope, BookOpen, Briefcase, Settings, Check,
  Lock, Unlock, ShieldQuestion, QrCode, Printer, Share2,
  Wallet, UsersRound, FilePlus2, UserPlus2, IdCard
} from 'lucide-react';
import { School, SchoolFunction, PendingEnrollment, UserRole, SchoolStaff } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import AcademicManagementSystem from './AcademicManagementSystem';
import EnrollmentManager from './EnrollmentManager';
import CardIssuer from './CardIssuer';

const STORAGE_KEY = 'sm_academy_schools_v6';

const generateId = () => Math.random().toString(36).substr(2, 9);

function GET_COMPLETE_FUNCTIONS(): SchoolFunction[] {
  const functions: SchoolFunction[] = [];
  
  const dirEscolar = [
    "Representação Legal", "Gestão do Pessoal", "Orçamento", "Plano de Expansão", "Compliance Normativo",
    "Relações Institucionais", "Liderança de Equipes", "Gestão de Ativos", "Auditoria Interna", "Segurança Escolar",
    "Manutenção Predial", "Marketing Educacional", "Retenção de Alunos", "Captação de Investimentos",
    "Cultura Organizacional", "Gestão de Crises", "Parcerias Estratégicas", "Acompanhamento de Obras",
    "Digitalização de Processos", "Sustentabilidade Financeira", "Eventos Oficiais", "Contratação de Terceiros",
    "Gestão de Suprimentos", "Ética Institucional", "Relatórios à Administração", "Ouvidoria Geral",
    "Inovação Tecnológica", "Políticas de Descontos", "Plano de Carreira RH", "Monitoramento de KPIs", "Visão 2030"
  ];
  
  dirEscolar.forEach(title => {
    functions.push({ 
      id: `f-de-${generateId()}`, 
      title, 
      description: 'Gestão estratégica e administrativa.', 
      category: 'Estratégico', 
      role: 'DIRECTOR_ESCOLAR',
      allowedRoles: ['SUPER_ADMIN', 'MANAGER'] 
    });
  });

  const dirPedag = [
    "Classes & Turmas", "Para Matricular", "Alunos Matriculados", "Pagamentos", 
    "Espaço do Corpo de Direção", "Espaço do Pessoal de Secretaria", "Espaço da Finança",
    "Coordenação Curricular", "Formações", "Professores", "Avaliação de Rendimento",
    "Projetos STEAM", "Acompanhamento Pedagógico", "Inclusão Escolar", "Seleção de Manuais", "Planos de Aula IA",
    "Conselhos de Classe", "Olimpíadas de Conhecimento", "Psicopedagogia", "Relação Escola-Família",
    "Inovação no Ensino", "Tutoria de Alunos", "Laboratórios Práticos", "Calendário Académico",
    "Metodologias Ativas", "Certificações", "Saídas de Campo", "Gala de Mérito"
  ];
  dirPedag.forEach(title => {
    functions.push({ 
      id: `f-dp-${generateId()}`, 
      title, 
      description: 'Supervisão da excelência acadêmica.', 
      category: 'Pedagógico', 
      role: 'DIRECTOR_PEDAGOGICO',
      allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'TEACHER']
    });
  });

  const secretaria = [
    "Gestão de Matrículas", "Dossiê do Aluno", "Emitir Cartões", "Arquivo Digital", "Emissão de Diplomas & Boletim de Nota", "Atendimento ao Público",
    "Controle de Assiduidade", "Processos de Transferência", "Certidões de Habilitação",
    "Apoio a Exames", "Logística de Correspondência", "Cadastro SIGE/Governo", "Gestão de Vagas",
    "Protocolo de Documentos", "Organização de Listas", "Histórico Escolar"
  ];
  secretaria.forEach(title => {
    functions.push({ 
      id: `f-sec-${generateId()}`, 
      title, 
      description: 'Operações administrativas diárias.', 
      category: 'Administrativo', 
      role: 'SECRETARIA',
      allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'SECRETARY']
    });
  });

  return functions;
}

const INITIAL_SCHOOL_TEMPLATE: Omit<School, 'id'> = {
  name: '', legalName: '', initials: '', type: 'Privada', taxId: '',
  location: '', address: '', foundationDate: '', legalRepresentative: '',
  pedagogicalDirector: '', secretaryGeneral: '',
  repContact: '', email: '', website: '', curriculum: 'Nacional',
  languages: 'Português', shifts: 'Manhã e Tarde', levels: 'I e II Ciclo',
  studentsCount: 0, staffCount: 0, accreditationNumber: '', accreditationStatus: 'Legalizada',
  description: '', status: 'Active', image: 'input_file_7.png', functions: [],
  classroomsCount: 0, labsCount: 0, contactPerson: '', phone: ''
};

const Schools: React.FC = () => {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'school_director' | 'pedagogical_director' | 'resources'>('overview');
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [schoolForm, setSchoolForm] = useState<Omit<School, 'id'>>(INITIAL_SCHOOL_TEMPLATE);
  
  const [editingFunctionId, setEditingFunctionId] = useState<string | null>(null);
  const [tempFunctionTitle, setTempFunctionTitle] = useState('');
  const [authorizingFunctionId, setAuthorizingFunctionId] = useState<string | null>(null);

  const [isAcademicManagerOpen, setIsAcademicManagerOpen] = useState(false);
  const [isEnrollmentManagerOpen, setIsEnrollmentManagerOpen] = useState(false);
  const [isCardIssuerOpen, setIsCardIssuerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSchools(JSON.parse(saved));
    } else {
      const initialSchools: School[] = [
        { 
          id: 'SAC-001', name: 'Escola Primária 7001', legalName: 'Sociedade Educativa Primária Lda', 
          initials: 'EP7001', type: 'Privada', taxId: '5400123456', location: 'Luanda', 
          address: 'Talatona, Via AL12', foundationDate: '2015-02-10', legalRepresentative: 'Dr. Joaquim Silva',
          pedagogicalDirector: 'Prof. Ana Martins', secretaryGeneral: 'Sílvia Santos',
          repContact: '923000000', email: 'geral@sm.edu', website: 'sm.edu', 
          curriculum: 'Nacional', languages: 'Português', shifts: 'Manhã, Tarde',
          levels: 'Ensino Primário', studentsCount: 1200, staffCount: 85, 
          accreditationNumber: 'AL-7001', accreditationStatus: 'Legalizada', 
          description: 'Polo Educacional de Referência.', status: 'Active', image: 'input_file_1.png',
          classroomsCount: 45, labsCount: 5, functions: GET_COMPLETE_FUNCTIONS(),
          staff: []
        }
      ];
      setSchools(initialSchools);
      setSelectedId(initialSchools[0].id);
    }
  }, []);

  useEffect(() => {
    if (schools.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
  }, [schools]);

  const selectedSchool = schools.find(s => s.id === selectedId);

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedId) {
      setSchools(prev => prev.map(s => s.id === selectedId ? { ...s, ...schoolForm } : s));
    } else {
      const newSchool: School = { ...schoolForm, id: generateId(), functions: GET_COMPLETE_FUNCTIONS(), staff: [] };
      setSchools([newSchool, ...schools]);
    }
    setIsFormOpen(false);
    setIsEditing(false);
    setSchoolForm(INITIAL_SCHOOL_TEMPLATE);
  };

  const handleFunctionClick = (f: SchoolFunction) => {
    if (f.title === 'Classes & Turmas') {
      setIsAcademicManagerOpen(true);
    } else if (f.title === 'Gestão de Matrículas' || f.title === 'Dossiê do Aluno') {
      setIsEnrollmentManagerOpen(true);
    } else if (f.title === 'Emitir Cartões') {
      setIsCardIssuerOpen(true);
    }
  };

  const handleEditFunctionTitle = (funcId: string, currentTitle: string) => {
    setEditingFunctionId(funcId);
    setTempFunctionTitle(currentTitle);
  };

  const saveFunctionTitle = (funcId: string) => {
    if (!selectedId) return;
    setSchools(prev => prev.map(s => {
      if (s.id === selectedId) {
        return {
          ...s,
          functions: s.functions?.map(f => f.id === funcId ? { ...f, title: tempFunctionTitle } : f)
        };
      }
      return s;
    }));
    setEditingFunctionId(null);
  };

  const toggleRoleAccess = (funcId: string, role: UserRole) => {
    if (!selectedId) return;
    setSchools(prev => prev.map(s => {
      if (s.id === selectedId) {
        return {
          ...s,
          functions: s.functions?.map(f => {
            if (f.id === funcId) {
              const currentRoles = f.allowedRoles || [];
              const newRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];
              return { ...f, allowedRoles: newRoles };
            }
            return f;
          })
        };
      }
      return s;
    }));
  };

  const renderFunctionButton = (f: SchoolFunction) => {
    const isEditingThis = editingFunctionId === f.id;
    const isAuthorizingThis = authorizingFunctionId === f.id;

    const getIcon = () => {
      if (f.title === 'Classes & Turmas') return <LayoutList size={16}/>;
      if (f.title === 'Pagamentos') return <Wallet size={16}/>;
      if (f.title === 'Espaço do Corpo de Direção') return <UsersRound size={16}/>;
      if (f.title === 'Espaço da Finança') return <Coins size={16}/>;
      if (f.title === 'Para Matricular' || f.title === 'Gestão de Matrículas') return <FilePlus2 size={16}/>;
      if (f.title === 'Alunos Matriculados' || f.title === 'Dossiê do Aluno') return <UserPlus2 size={16}/>;
      if (f.title === 'Emitir Cartões') return <IdCard size={16}/>;
      return f.role === 'DIRECTOR_ESCOLAR' ? <ShieldCheck size={16} /> : f.role === 'DIRECTOR_PEDAGOGICO' ? <GraduationCap size={16} /> : <FileText size={16} />;
    };

    const availableRoles: { id: UserRole; label: string }[] = [
      { id: 'MANAGER', label: 'Gestor' },
      { id: 'SECRETARY', label: 'Secretaria' },
      { id: 'TEACHER', label: 'Professor' },
      { id: 'STAFF', label: 'Equipe Apoio' }
    ];

    return (
      <div 
        key={f.id} 
        onClick={() => !isEditingThis && !isAuthorizingThis && handleFunctionClick(f)}
        className={`group relative bg-white dark:bg-slate-800 p-5 rounded-[2rem] border transition-all flex flex-col justify-between cursor-pointer ${
          authorizingFunctionId === f.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl' : 'border-slate-100 dark:border-slate-800 hover:shadow-xl hover:scale-[1.03]'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-xl flex items-center gap-2 ${f.role === 'DIRECTOR_ESCOLAR' ? 'bg-blue-50 text-blue-500' : f.role === 'DIRECTOR_PEDAGOGICO' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
            {getIcon()}
          </div>
          <div className="flex gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setAuthorizingFunctionId(isAuthorizingThis ? null : f.id); }}
              className={`p-2 rounded-lg transition-all ${isAuthorizingThis ? 'bg-indigo-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-indigo-600'}`}
              title="Permissões"
            >
              <ShieldCheck size={14} />
            </button>
            {!isEditingThis && !isAuthorizingThis && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleEditFunctionTitle(f.id, f.title); }}
                className="p-2 opacity-0 group-hover:opacity-100 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-blue-500 transition-all"
                title="Editar Nome"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>

        {isEditingThis ? (
          <div className="space-y-2">
            <input 
              autoFocus
              value={tempFunctionTitle}
              onChange={e => setTempFunctionTitle(e.target.value)}
              onBlur={() => saveFunctionTitle(f.id)}
              onKeyDown={e => e.key === 'Enter' && saveFunctionTitle(f.id)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-blue-500 rounded-lg px-2 py-1 text-[11px] font-black uppercase outline-none"
            />
            <button onClick={() => saveFunctionTitle(f.id)} className="text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1">
              <Check size={10} /> Salvar
            </button>
          </div>
        ) : isAuthorizingThis ? (
          <div className="space-y-3 animate-in fade-in zoom-in-95">
             <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-2">Permitir acesso para:</p>
             <div className="grid grid-cols-2 gap-2">
                {availableRoles.map(role => (
                  <button 
                    key={role.id} 
                    onClick={(e) => { e.stopPropagation(); toggleRoleAccess(f.id, role.id); }}
                    className={`px-2 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border flex items-center gap-1 transition-all ${
                      (f.allowedRoles || []).includes(role.id) 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                      : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {(f.allowedRoles || []).includes(role.id) ? <CheckCircle2 size={10} /> : <X size={8} />}
                    {role.label}
                  </button>
                ))}
             </div>
             <button onClick={(e) => { e.stopPropagation(); setAuthorizingFunctionId(null); }} className="w-full py-1.5 mt-2 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg">Finalizar</button>
          </div>
        ) : (
          <h5 className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-tight leading-tight mb-2">{f.title}</h5>
        )}
        
        {!isAuthorizingThis && (
          <div className="flex items-center justify-between mt-3">
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{f.category}</p>
             <div className="flex -space-x-1.5">
                {(f.allowedRoles || []).length > 0 ? (
                  (f.allowedRoles || []).map((r, i) => (
                    <div key={i} title={r} className="w-5 h-5 rounded-full bg-indigo-100 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[7px] font-black text-indigo-600 uppercase">
                       {r.charAt(0)}
                    </div>
                  ))
                ) : (
                  <div className="w-5 h-5 rounded-full bg-rose-50 border-2 border-white dark:border-slate-800 flex items-center justify-center" title="Acesso Restrito">
                     <Lock size={8} className="text-rose-400" />
                  </div>
                )}
             </div>
          </div>
        )}
        {!isEditingThis && !isAuthorizingThis && (
          <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Gerenciar <ArrowRight size={10} /></div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      
      {/* MODALS INTEGRATION */}
      {isAcademicManagerOpen && selectedSchool && (
        <AcademicManagementSystem 
          schoolId={selectedSchool.id} 
          onClose={() => setIsAcademicManagerOpen(false)} 
        />
      )}

      {isEnrollmentManagerOpen && selectedSchool && (
        <EnrollmentManager 
          schoolId={selectedSchool.id}
          onClose={() => setIsEnrollmentManagerOpen(false)}
        />
      )}

      {isCardIssuerOpen && selectedSchool && (
        <CardIssuer 
          schoolId={selectedSchool.id}
          onClose={() => setIsCardIssuerOpen(false)}
        />
      )}

      {/* SIDEBAR DA REDE */}
      <div className="w-full lg:w-80 flex flex-col gap-6 bg-white/50 dark:bg-slate-900/50 p-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden shrink-0">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">Rede Escolar</h2>
          <button onClick={() => { setSchoolForm(INITIAL_SCHOOL_TEMPLATE); setIsEditing(false); setIsFormOpen(true); }} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"><Plus size={20} /></button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar unidade..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl text-xs font-bold outline-none shadow-sm" />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar flex flex-col">
          {schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((school) => (
            <button key={school.id} onClick={() => setSelectedId(school.id)} className={`w-full p-5 rounded-[2.5rem] text-left transition-all flex items-center gap-4 group shrink-0 ${selectedId === school.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${selectedId === school.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-900 text-blue-500'}`}><Building2 size={24} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black truncate uppercase tracking-tight">{school.name}</p>
                <p className={`text-[9px] font-bold opacity-60 uppercase mt-1 ${selectedId === school.id ? 'text-white' : 'text-slate-400'}`}>{school.location}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AMBIENTE DA ESCOLA SELECIONADA */}
      <div className="flex-1 min-w-0 h-full">
        {selectedSchool ? (
          <div className="h-full bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
            
            <div className="h-60 relative shrink-0">
              <img src={selectedSchool.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">{selectedSchool.name}</h2>
                  <div className="flex items-center gap-3 mt-4">
                     <span className="px-4 py-1.5 bg-blue-600 rounded-xl text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-2"><Key size={12} /> {selectedSchool.initials}</span>
                     <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] text-white border border-white/20 font-black uppercase tracking-widest">{selectedSchool.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setSchoolForm(selectedSchool); setIsEditing(true); setIsFormOpen(true); }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all shadow-2xl flex items-center gap-2 group"
                >
                  <Edit2 size={16} /> Editar Dados da Escola
                </button>
              </div>
            </div>

            <div className="px-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex gap-8 shrink-0 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Dossiê Geral', icon: Landmark },
                { id: 'school_director', label: 'Director(a) Escolar', icon: Shield },
                { id: 'pedagogical_director', label: 'Director(a) Pedagógico', icon: GraduationCap },
                { id: 'resources', label: 'Secretaria & Recursos', icon: Layers },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 flex items-center gap-2 transition-all shrink-0 ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  <t.icon size={16} /> {t.label}
                </button>
              ))}
            </div>

            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-12 pb-20">
              {activeTab === 'overview' && (
                <div className="space-y-12 animate-in zoom-in-95 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Número de Contribuinte</p>
                           <p className="text-2xl font-black text-blue-600">{selectedSchool.taxId}</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Efetivo Alunos</p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedSchool.studentsCount}</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Diretor Geral</p>
                           <p className="text-xl font-black text-slate-900 dark:text-white truncate uppercase">{selectedSchool.legalRepresentative}</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Secretário Geral</p>
                           <p className="text-xl font-black text-slate-900 dark:text-white truncate uppercase">{selectedSchool.secretaryGeneral || 'Não definido'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="relative bg-white p-8 border-[3px] border-slate-900 rounded-sm w-72 h-[420px] flex flex-col items-center shadow-xl">
                          <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-slate-900"></div>
                          <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-slate-900"></div>
                          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-slate-900"></div>
                          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-slate-900"></div>

                          <div className="mt-8 mb-6">
                            <h4 className="text-center font-bold text-[#1e3a8a] text-lg tracking-[0.1em] uppercase">SCHOOL MANAGER</h4>
                          </div>

                          <div className="relative w-44 h-44 flex items-center justify-center">
                            <div className="absolute inset-0 border-[2px] border-slate-300 rounded-full"></div>
                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-slate-900"></div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-slate-900"></div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-slate-900"></div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-slate-900"></div>
                            
                            <div className="relative bg-white p-1">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=SMACADEMY_SCHOOL_${selectedSchool.id}&color=000000&bgcolor=ffffff`} 
                                className="w-36 h-36" 
                                alt="QR"
                              />
                            </div>
                          </div>

                          <div className="mt-10 text-center">
                            <p className="text-[#64748b] font-bold text-[10px] tracking-[0.2em] uppercase">MODERNA E EFICIENTE</p>
                          </div>
                          
                          <div className="mt-auto mb-4 px-4 py-1 bg-[#1e3a8a] text-white rounded-full">
                            <p className="text-[9px] font-black uppercase tracking-widest">{selectedSchool.initials}</p>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'school_director' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Shield size={24}/></div>
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-blue-600">Área do Director Escolar</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">30 Módulos de Gestão Estratégica e Decisória</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                     {(selectedSchool.functions || []).filter(f => f.role === 'DIRECTOR_ESCOLAR').map(renderFunctionButton)}
                   </div>
                </div>
              )}

              {activeTab === 'pedagogical_director' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><GraduationCap size={24}/></div>
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-indigo-600">Área do Director Pedagógico</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase">Coordenação de Ensino e Aprendizagem</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                     {(selectedSchool.functions || []).filter(f => f.role === 'DIRECTOR_PEDAGOGICO').map(renderFunctionButton)}
                   </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Layers size={24}/></div>
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-emerald-600">Secretaria & Recursos</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase">Apoio Administrativo e Logístico</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                     {(selectedSchool.functions || []).filter(f => f.role === 'SECRETARIA').map(renderFunctionButton)}
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[5rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
             <div className="text-center space-y-6">
                <div className="w-28 h-28 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-xl text-slate-200"><Building2 size={64} /></div>
                <p className="font-black text-slate-300 uppercase tracking-[0.4em] text-sm italic">Selecione uma Escola na Rede</p>
             </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-10 border border-slate-100 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black uppercase tracking-tight">{isEditing ? 'Editar Unidade' : 'Adicionar Nova Unidade'}</h2>
                 <button onClick={() => setIsFormOpen(false)}><X /></button>
              </div>
              <form onSubmit={handleSaveSchool} className="space-y-4">
                 <input placeholder="Nome da Escola" value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" required />
                 <input placeholder="Localização (Cidade)" value={schoolForm.location} onChange={e => setSchoolForm({...schoolForm, location: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" required />
                 <input placeholder="NIF" value={schoolForm.taxId} onChange={e => setSchoolForm({...schoolForm, taxId: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" />
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Salvar Unidade</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Schools;
