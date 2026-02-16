
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  ChevronRight,
  Lock,
  Check,
  X,
  AlertCircle,
  Building,
  Eye,
  Edit3,
  Trash2,
  UserSquare2,
  Shield,
  Save,
  Crown,
  Fingerprint,
  KeyRound,
  UserCog
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole, ViewType, RolePermission, School, SchoolStaff } from '../types';

const MODULES_LIST: ViewType[] = [
  ViewType.DASHBOARD,
  ViewType.SCHOOLS,
  ViewType.ACADEMICS,
  ViewType.FINANCE,
  ViewType.STUDENTS,
  ViewType.STAFF,
  ViewType.SECRETARY,
  ViewType.AI_ASSISTANT
];

const ROLES_LIST: { id: UserRole; label: string }[] = [
  { id: 'MANAGER', label: 'Gestor Executivo' },
  { id: 'SECRETARY', label: 'Secretário Acadêmico' },
  { id: 'TEACHER', label: 'Professor / Coordenador' },
  { id: 'STAFF', label: 'Equipe de Apoio' },
  { id: 'IT_ADMIN', label: 'Administrador de TI' }
];

const OWNERS_DATA = [
  { id: 1, name: 'Dr. Augusto Veríssimo', role: 'Sócio Fundador & Chairman', equity: '45%', investment: 'USD 2.5M', since: '2010', avatar: 'https://picsum.photos/seed/augusto/150' },
  { id: 2, name: 'Dra. Beatriz Menezes', role: 'Co-Fundadora & Diretora de Expansão', equity: '35%', investment: 'USD 1.8M', since: '2012', avatar: 'https://picsum.photos/seed/beatriz/150' },
];

const Managers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'owners' | 'permissions'>('permissions');
  const [selectedRole, setSelectedRole] = useState<UserRole>('MANAGER');
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('sm_academy_security');
    if (saved) {
      const config = JSON.parse(saved);
      setPermissions(config.granularPermissions || []);
    }

    const savedSchools = localStorage.getItem('sm_academy_schools_v6');
    if (savedSchools) {
      setSchools(JSON.parse(savedSchools));
    }
  }, []);

  const getRolePermission = (role: UserRole): RolePermission => {
    return permissions.find(p => p.role === role) || {
      role,
      schoolIds: [],
      modules: MODULES_LIST.reduce((acc, mod) => ({
        ...acc,
        [mod]: { view: false, edit: false, delete: false }
      }), {} as Record<ViewType, any>)
    };
  };

  const saveToStorage = (newPermissions: RolePermission[]) => {
    setIsSaving(true);
    const security = JSON.parse(localStorage.getItem('sm_academy_security') || '{}');
    security.granularPermissions = newPermissions;
    localStorage.setItem('sm_academy_security', JSON.stringify(security));
    setTimeout(() => setIsSaving(false), 800);
  };

  const updatePermission = (role: UserRole, module: ViewType, field: 'view' | 'edit' | 'delete', value: boolean) => {
    setPermissions(prev => {
      const existing = prev.find(p => p.role === role);
      let updated: RolePermission;
      if (existing) {
        updated = {
          ...existing,
          modules: { ...existing.modules, [module]: { ...existing.modules[module], [field]: value } }
        };
      } else {
        const base = getRolePermission(role);
        updated = {
          ...base,
          modules: { ...base.modules, [module]: { ...base.modules[module], [field]: value } }
        };
      }
      const filtered = prev.filter(p => p.role !== role);
      const newPermissions = [...filtered, updated];
      saveToStorage(newPermissions);
      return newPermissions;
    });
  };

  const toggleSchoolAccess = (role: UserRole, schoolId: string) => {
    setPermissions(prev => {
      const existing = getRolePermission(role);
      const hasSchool = existing.schoolIds.includes(schoolId);
      const newSchools = hasSchool ? existing.schoolIds.filter(id => id !== schoolId) : [...existing.schoolIds, schoolId];
      const updated = { ...existing, schoolIds: newSchools };
      const filtered = prev.filter(p => p.role !== role);
      const newPermissions = [...filtered, updated];
      saveToStorage(newPermissions);
      return newPermissions;
    });
  };

  const currentPerms = getRolePermission(selectedRole);

  // Filtra todos os funcionários do cargo selecionado em todas as escolas
  const filteredStaffList = useMemo(() => {
    const list: SchoolStaff[] = [];
    schools.forEach(school => {
      if (school.staff) {
        school.staff.forEach(member => {
          if (member.role === selectedRole) {
            list.push({ ...member, schoolName: school.name });
          }
        });
      }
    });
    return list;
  }, [schools, selectedRole]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-20 overflow-hidden">
      
      {/* HEADER SUPERIOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
            Controle de Acessos
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">
            Gestão de permissões granulares para funcionários por escola e módulo.
          </p>
        </div>

        <div className="flex p-1 bg-slate-900 dark:bg-slate-900 rounded-full border border-slate-800">
          <button onClick={() => setActiveTab('owners')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'owners' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>PROPRIETÁRIOS</button>
          <button onClick={() => setActiveTab('board')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'board' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>CONSELHO</button>
          <button onClick={() => setActiveTab('permissions')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'permissions' ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30' : 'text-slate-500'}`}>PERMISSÕES</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden">
        
        {/* SIDEBAR DE CARGOS */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Selecione o Cargo</h3>
          {ROLES_LIST.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-6 rounded-[2rem] text-left transition-all flex items-center justify-between group border ${
                selectedRole === role.id 
                  ? 'bg-[#3b82f6] text-white border-transparent shadow-2xl shadow-blue-600/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${selectedRole === role.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                  {role.id === 'IT_ADMIN' ? <UserCog size={20} /> : <UserSquare2 size={20} />}
                </div>
                <span className="text-xs font-black uppercase tracking-tight">{role.label}</span>
              </div>
              {selectedRole === role.id && <ChevronRight size={18} />}
            </button>
          ))}

          <div className="mt-10 p-8 bg-orange-950/20 rounded-[2.5rem] border border-orange-500/10 space-y-4">
             <div className="flex items-center gap-2 text-orange-500">
                <AlertCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Aviso de Segurança</span>
             </div>
             <p className="text-[10px] text-orange-200/50 font-bold leading-relaxed">
               Alterações de permissão entram em vigor no próximo login do colaborador. Cargos mestre (Super Admin) ignoram estas regras.
             </p>
          </div>
        </div>

        {/* PAINEL CENTRAL DINÂMICO */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2 pb-10">
          
          {/* LISTA DE COLABORADORES DO CARGO SELECIONADO (NOVO) */}
          <div className="bg-[#0f172a] rounded-[3.5rem] border border-slate-800/60 p-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-none uppercase">Colaboradores: {ROLES_LIST.find(r => r.id === selectedRole)?.label}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Lista oficial de todos os funcionários deste nível na rede</p>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-800">
                         <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Escola</th>
                         <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</th>
                         <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Senha</th>
                         <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Sistema</th>
                         <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Código Pessoal</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                      {filteredStaffList.length > 0 ? filteredStaffList.map((staff) => (
                        <tr key={staff.id} className="group hover:bg-slate-800/30 transition-colors">
                           <td className="py-6"><span className="text-[10px] font-black text-blue-400 uppercase">{staff.schoolName}</span></td>
                           <td className="py-6"><span className="text-xs font-black text-slate-100">{staff.name}</span></td>
                           <td className="py-6">
                              <div className="flex items-center gap-2 group/pass">
                                 <span className="text-[10px] font-mono text-slate-500 group-hover/pass:text-white transition-colors">{staff.password}</span>
                                 <KeyRound size={12} className="text-slate-700" />
                              </div>
                           </td>
                           <td className="py-6"><span className="text-[10px] font-mono text-emerald-500">{staff.id}</span></td>
                           <td className="py-6 text-right"><span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{staff.personalCode}</span></td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="py-20 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-20">
                                 <Fingerprint size={48} className="text-slate-500" />
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum registro encontrado para este cargo</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          {/* ESCOPO DE ATUAÇÃO */}
          <div className="bg-[#0f172a] rounded-[3.5rem] border border-slate-800/60 p-10 shadow-sm">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20"><Building size={22} /></div>
                <div>
                  <h3 className="text-xl font-black text-white leading-none uppercase">Escopo de Atuação</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Unidades que este cargo pode gerenciar</p>
                </div>
             </div>
             <div className="flex flex-wrap gap-4">
                {schools.map((school) => (
                  <button key={school.id} onClick={() => toggleSchoolAccess(selectedRole, school.id)} className={`px-8 py-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${currentPerms.schoolIds.includes(school.id) ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentPerms.schoolIds.includes(school.id) ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                      {currentPerms.schoolIds.includes(school.id) ? <Check size={16} strokeWidth={4} /> : <X size={16} />}
                    </div>
                    <span className={`text-[11px] font-black uppercase ${currentPerms.schoolIds.includes(school.id) ? 'text-emerald-400' : 'text-slate-500'}`}>{school.name}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* ACESSO POR MÓDULO */}
          <div className="bg-[#0f172a] rounded-[4rem] border border-slate-800/60 p-12 shadow-sm">
             <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20"><Shield size={22} /></div>
                <div>
                  <h3 className="text-xl font-black text-white leading-none uppercase">Acesso por Módulo</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Nível de interatividade com cada área do sistema</p>
                </div>
                {isSaving && <div className="ml-auto flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase animate-pulse"><Save size={14} /> Sincronizando...</div>}
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-slate-800">
                     <th className="pb-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Módulo SM@</th>
                     <th className="pb-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Visualizar</th>
                     <th className="pb-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Editar</th>
                     <th className="pb-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Excluir</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                   {MODULES_LIST.map((module) => (
                     <tr key={module} className="group hover:bg-slate-800/30 transition-colors">
                       <td className="py-8 pr-10">
                         <div className="flex items-center gap-4">
                           <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] group-hover:scale-150 transition-transform"></div>
                           <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest">{module.replace('_', ' ')}</span>
                         </div>
                       </td>
                       <td className="py-8 text-center">
                         <button onClick={() => updatePermission(selectedRole, module, 'view', !currentPerms.modules[module]?.view)} className={`p-4 rounded-[1.2rem] border transition-all ${currentPerms.modules[module]?.view ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-600'}`}><Eye size={20} /></button>
                       </td>
                       <td className="py-8 text-center">
                         <button onClick={() => updatePermission(selectedRole, module, 'edit', !currentPerms.modules[module]?.edit)} className={`p-4 rounded-[1.2rem] border transition-all ${currentPerms.modules[module]?.edit ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-slate-900 border-slate-800 text-slate-600'}`}><Edit3 size={20} /></button>
                       </td>
                       <td className="py-8 text-center">
                         <button onClick={() => updatePermission(selectedRole, module, 'delete', !currentPerms.modules[module]?.delete)} className={`p-4 rounded-[1.2rem] border transition-all ${currentPerms.modules[module]?.delete ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-900 border-slate-800 text-slate-600'}`}><Trash2 size={20} /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Managers;
