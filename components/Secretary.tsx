
import React, { useState } from 'react';
import { 
  FileText, 
  UserPlus, 
  ClipboardCheck, 
  Search, 
  MoreHorizontal, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Users,
  UserSquare2,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  UserRoundCog,
  UserRound,
  Info,
  Coins,
  UsersRound,
  Fingerprint,
  ArrowUpRight,
  X,
  ArrowLeft,
  Filter,
  CreditCard,
  History,
  ShieldCheck
} from 'lucide-react';
import Students from './Students';
import Staff from './Staff';
import Classes from './Classes';
import Grades from './Grades';
import { useLanguage } from '../contexts/LanguageContext';

const RECENT_REQUESTS = [
  { id: 'SMST2401A1', student: 'Alice Thompson', document: 'Enrollment Certificate', date: '2024-03-20', status: 'Pending' },
  { id: 'SMST2401B2', student: 'David Wilson', document: 'Transcript of Records', date: '2024-03-19', status: 'Completed' },
];

const STUDENT_FINANCE_DATA = [
  { id: 'E2400112MA', name: 'Alice Thompson', classe: '12ª Classe', turma: 'A', turno: 'Manhã', dividas: '5.200,00 KZ', pendentes: 2 },
  { id: 'E2300511TB', name: 'Benjamin Carter', classe: '11ª Classe', turma: 'B', turno: 'Tarde', dividas: '0,00 KZ', pendentes: 0 },
];

const RoleCard: React.FC<{ title: string; subtitle: string; icon: any; color: string; onClick: () => void; isActive?: boolean }> = ({
  title, subtitle, icon: Icon, color, onClick, isActive
}) => (
  <button 
    onClick={onClick}
    className={`group relative bg-white dark:bg-slate-900 p-3 rounded-2xl border transition-all flex flex-col items-start text-left overflow-hidden w-full ${
      isActive ? 'border-blue-500 ring-2 ring-blue-500/5 shadow-md' : 'border-slate-100 dark:border-slate-800 shadow-sm'
    }`}
  >
    <div className="flex items-center gap-3 w-full">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
        <Icon className="text-white" size={18} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{title}</h4>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{subtitle}</p>
      </div>
    </div>
  </button>
);

const FinancialSecretaryView: React.FC = () => {
  return (
    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Financeiro Académico</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ID Automatizado SM@</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">ID Aluno</th>
                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Dívidas</th>
                <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {STUDENT_FINANCE_DATA.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 font-mono text-[9px] font-black text-blue-600 dark:text-blue-400">{student.id}</td>
                  <td className="px-4 py-2 text-[10px] font-black text-slate-900 dark:text-white">{student.name}</td>
                  <td className="px-4 py-2 text-[10px] font-black text-rose-600">{student.dividas}</td>
                  <td className="px-4 py-2">
                    <button className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-all"><CreditCard size={10} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SecretaryDashboard: React.FC = () => {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  
  const generateYYMM = () => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${yy}${mm}`;
  };

  const generateSecretaryId = () => {
    const yymm = generateYYMM();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l = letters.charAt(Math.floor(Math.random() * letters.length));
    const n = Math.floor(Math.random() * 10);
    // SMST (4) + YYMM (4) + # (1) + # (1) = 10 chars
    return `SMST${yymm}${l}${n}`;
  };

  const generateManagerId = () => {
    const yyyy = new Date().getFullYear().toString();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l = letters.charAt(Math.floor(Math.random() * letters.length));
    const n = Math.floor(Math.random() * 10);
    // SMSG (4) + YYYY (4) + # (1) + # (1) = 10 chars
    return `SMSG${yyyy}${l}${n}`;
  };

  const generateInfoStaffId = () => {
    const yymm = generateYYMM();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l = letters.charAt(Math.floor(Math.random() * letters.length));
    const n = Math.floor(Math.random() * 10);
    // SMIF (4) + YYMM (4) + # (1) + # (1) = 10 chars
    return `SMIF${yymm}${l}${n}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Operações de Secretaria</h1>
          <p className="text-slate-500 text-[10px] font-bold">IDs de acesso com conformidade de 10 caracteres</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        <RoleCard 
          title="Secretário Financeiro" 
          subtitle={`ID: ${generateSecretaryId()}`} 
          icon={Coins} 
          color="bg-emerald-600" 
          isActive={activeRole === 'finance'}
          onClick={() => setActiveRole(activeRole === 'finance' ? null : 'finance')}
        />
        <RoleCard 
          title="Gestor Executivo" 
          subtitle={`ID: ${generateManagerId()}`} 
          icon={UsersRound} 
          color="bg-rose-600" 
          isActive={activeRole === 'hr'}
          onClick={() => setActiveRole(activeRole === 'hr' ? null : 'hr')}
        />
        <RoleCard 
          title="Pessoal de Informações" 
          subtitle={`ID: ${generateInfoStaffId()}`} 
          icon={Info} 
          color="bg-indigo-600" 
          isActive={activeRole === 'info'}
          onClick={() => setActiveRole(activeRole === 'info' ? null : 'info')}
        />
      </div>

      {activeRole === 'finance' ? <FinancialSecretaryView /> : (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-4 shadow-sm">
           <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Fingerprint size={32} className="text-slate-300" />
           </div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Selecione uma função acima para gerenciar os dados</p>
           {activeRole === 'info' && (
             <div className="pt-4 animate-in zoom-in-95 duration-300">
               <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">Painel de Atendimento Iniciado</span>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const Secretary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'students' | 'staff' | 'classes' | 'grades'>('home');
  const { t } = useLanguage();

  const subTabs = [
    { id: 'home', label: 'Início', icon: LayoutDashboard },
    { id: 'students', label: t('nav.students'), icon: Users },
    { id: 'staff', label: t('nav.staff'), icon: UserSquare2 },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'home': return <SecretaryDashboard />;
      case 'students': return <Students />;
      case 'staff': return <Staff />;
      default: return <SecretaryDashboard />;
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800 pb-0.5">
        {subTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeSubTab === tab.id ? 'text-blue-600 bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800' : 'text-slate-400'}`}>
            <tab.icon size={12} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{renderContent()}</div>
    </div>
  );
};

export default Secretary;
