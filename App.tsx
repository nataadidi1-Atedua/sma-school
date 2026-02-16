
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Wallet, 
  BookOpen, 
  BarChart3, 
  Bot, 
  LogOut, 
  Bell, 
  Search,
  Settings as SettingsIcon,
  Languages,
  Menu,
  Building2,
  LogIn,
  UserPlus,
  Sparkles,
  CalendarDays,
  GraduationCap,
  Mic,
  ShieldCheck,
  FileText,
  ShieldAlert,
  BrainCircuit,
  ChevronDown,
  Globe,
  UserCheck,
  X,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { ViewType, Language, UserSettings, AccessControl, Student, School, StaffMember, InternalMessage } from './types';
import Dashboard from './components/Dashboard';
import Schools from './components/Schools';
import Students from './components/Students';
import Staff from './components/Staff';
import Finance from './components/Finance';
import AI_Assistant from './components/AI_Assistant';
import Classes from './components/Classes';
import Grades from './components/Grades';
import Login from './components/Login';
import SettingsView from './components/Settings';
import Managers from './components/Managers';
import Secretary from './components/Secretary';
import SecuritySettings from './components/SecuritySettings';
import Academics from './components/Academics';
import AccessGate from './components/AccessGate';
import MessagingSystem from './components/MessagingSystem';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const SESSION_KEY = 'sm_academy_session';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStudioAdmin, setIsStudioAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Unread Messages State
  const [unreadCount, setUnreadCount] = useState(0);

  // Verificar sessão ao carregar
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      const user = JSON.parse(savedSession);
      setIsAuthenticated(true);
      setIsStudioAdmin(user.role === 'SUPER_ADMIN');
    }

    const checkMessages = () => {
      const msgs: InternalMessage[] = JSON.parse(localStorage.getItem('sm_internal_messages') || '[]');
      const count = msgs.filter(m => !m.read && m.recipientId === 'current-user').length;
      setUnreadCount(count);
    };

    checkMessages();
    const interval = setInterval(checkMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Security State
  const [securityConfig, setSecurityConfig] = useState<AccessControl | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingView, setPendingView] = useState<ViewType | null>(null);
  const [unlockedViews, setUnlockedViews] = useState<Set<ViewType>>(new Set([ViewType.DASHBOARD]));

  useEffect(() => {
    const saved = localStorage.getItem('sm_academy_security');
    if (saved) setSecurityConfig(JSON.parse(saved));
  }, []);

  // Appearance State
  const [uiSettings, setUiSettings] = useState<UserSettings>({
    theme: 'light',
    accentColor: 'blue',
    fontSize: 100,
    fontFamily: 'Inter',
    backgroundColor: 'bg-slate-50'
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (uiSettings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.fontFamily = `'${uiSettings.fontFamily}', sans-serif`;
    const finalSize = (16 * uiSettings.fontSize) / 100;
    root.style.fontSize = `${finalSize}px`;
  }, [uiSettings]);

  // Unified Search Logic
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return { students: [], schools: [], staff: [] };
    const query = globalSearch.toLowerCase();

    const allStudents: Student[] = JSON.parse(localStorage.getItem('sm_academy_students_db') || '[]');
    const allSchools: School[] = JSON.parse(localStorage.getItem('sm_academy_schools_v6') || '[]');
    const allStaff: StaffMember[] = JSON.parse(localStorage.getItem('sm_academy_staff_db') || '[]');

    return {
      students: allStudents.filter(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)).slice(0, 5),
      schools: allSchools.filter(s => s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)).slice(0, 5),
      staff: allStaff.filter(s => s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query)).slice(0, 5),
    };
  }, [globalSearch]);

  const navItems = [
    { id: ViewType.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: ViewType.SCHOOLS, label: t('nav.schools'), icon: Building2 },
    { id: ViewType.SECRETARY, label: t('nav.secretary'), icon: FileText },
    { id: ViewType.STAFF, label: t('nav.staff'), icon: UserSquare2 },
    { id: ViewType.ACADEMICS, label: t('nav.academics'), icon: BrainCircuit },
    { id: ViewType.MANAGERS, label: t('nav.schoolDirector'), icon: ShieldCheck }, 
    { id: ViewType.MESSAGES, label: 'Mensagens', icon: MessageSquare, badge: unreadCount },
    { id: ViewType.FINANCE, label: t('nav.finance'), icon: Wallet },
    { id: ViewType.AI_ASSISTANT, label: t('nav.ai'), icon: Bot, highlight: true },
    { id: ViewType.SECURITY, label: 'Segurança', icon: ShieldAlert, adminOnly: true },
  ];

  const handleNavClick = (viewId: ViewType) => {
    if (isStudioAdmin) {
      setCurrentView(viewId);
      return;
    }
    if (viewId === ViewType.DASHBOARD) {
      setCurrentView(viewId);
      return;
    }
    if (unlockedViews.has(viewId)) {
      setCurrentView(viewId);
      return;
    }
    setPendingView(viewId);
    setIsGateOpen(true);
  };

  const onGateSuccess = () => {
    if (pendingView) {
      setUnlockedViews(prev => new Set(prev).add(pendingView));
      setCurrentView(pendingView);
    }
    setIsGateOpen(false);
    setPendingView(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setIsStudioAdmin(false);
    setCurrentView(ViewType.DASHBOARD);
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ${uiSettings.theme === 'dark' ? 'bg-slate-950 text-slate-100' : `${uiSettings.backgroundColor} text-slate-900`}`}>
      <AccessGate 
        isOpen={isGateOpen} 
        onClose={() => setIsGateOpen(false)} 
        onSuccess={onGateSuccess}
        title={`Acessando módulo: ${pendingView?.replace('_', ' ')}`}
        expectedPassword={securityConfig?.passwords.admin || 'admin123'}
      />

      <aside className={`bg-slate-900 text-white transition-all duration-500 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'} flex flex-col shrink-0 overflow-hidden relative z-50 shadow-2xl shadow-slate-900/50`}>
        <div className="p-4 flex items-center justify-center border-b border-slate-800">
          <img src="input_file_0.png" alt="SM@ Logo" className={`transition-all duration-300 ${isSidebarOpen ? 'h-16' : 'h-10'}`} />
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${currentView === item.id ? 'bg-blue-600 text-white shadow-xl' : item.highlight ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={20} />
              {(isSidebarOpen || (window.innerWidth < 1024)) && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-bold text-sm">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{item.badge}</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button onClick={() => handleNavClick(ViewType.SETTINGS)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${currentView === ViewType.SETTINGS ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
            <SettingsIcon size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Configurações</span>}
          </button>
          {isAuthenticated && (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl">
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-sm font-bold">Sair</span>}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-[100] ${uiSettings.theme === 'dark' ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-all hover:scale-105"><Menu size={20} /></button>
            
            {/* Unified Search Header Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t('header.search')} 
                value={globalSearch}
                onChange={(e) => { setGlobalSearch(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-12 pr-4 py-2.5 rounded-2xl w-full bg-slate-100/50 dark:bg-slate-800 outline-none text-sm border border-transparent focus:border-blue-500/30 transition-all shadow-sm" 
              />
              
              {/* Search Results Dropdown Overlay */}
              {isSearchOpen && globalSearch.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[200] animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resultados da Busca Global</span>
                    <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-rose-500"><X size={16} /></button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {/* Alunos Section */}
                    {searchResults.students.length > 0 && (
                      <div className="mb-4">
                        <p className="px-4 py-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">Estudantes</p>
                        {searchResults.students.map(s => (
                          <button key={s.id} onClick={() => { setCurrentView(ViewType.SECRETARY); setIsSearchOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                              <img src={s.avatar} className="w-8 h-8 rounded-lg" />
                              <div><p className="text-xs font-black">{s.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{s.id} • {s.grade}</p></div>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Escolas Section */}
                    {searchResults.schools.length > 0 && (
                      <div className="mb-4">
                        <p className="px-4 py-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">Escolas</p>
                        {searchResults.schools.map(s => (
                          <button key={s.id} onClick={() => { setCurrentView(ViewType.SCHOOLS); setIsSearchOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Building2 size={16} /></div>
                              <div><p className="text-xs font-black">{s.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{s.location}</p></div>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Professores Section */}
                    {searchResults.staff.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest">Equipe & Professores</p>
                        {searchResults.staff.map(s => (
                          <button key={s.id} onClick={() => { setCurrentView(ViewType.STAFF); setIsSearchOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                              <img src={s.avatar} className="w-8 h-8 rounded-lg" />
                              <div><p className="text-xs font-black">{s.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase">{s.role}</p></div>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.students.length === 0 && searchResults.schools.length === 0 && searchResults.staff.length === 0 && (
                      <div className="p-12 text-center text-slate-400 font-bold text-xs italic">Nenhum resultado encontrado para "{globalSearch}"</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative" ref={langMenuRef}>
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100/50 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all">
                <Globe size={18} className="text-blue-500" /><span className="text-xs font-black uppercase">{language}</span><ChevronDown size={14} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 rounded-[2rem] shadow-2xl z-[200] py-3 animate-in fade-in">
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2 space-y-1">
                    {[{ id: 'pt', label: 'Português', flag: '🇵🇹' }, { id: 'en', label: 'English', flag: '🇺🇸' }].map((l) => (
                      <button key={l.id} onClick={() => { setLanguage(l.id as Language); setIsLangOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${language === l.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3"><span className="text-lg">{l.flag}</span><span className="text-xs font-bold">{l.label}</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 cursor-pointer">
                <img src="https://picsum.photos/seed/admin/40/40" className="w-10 h-10 rounded-xl border-2 border-blue-100" alt="Profile" />
                <div className="text-right hidden md:block"><p className="text-sm font-black leading-none">{t('header.admin')}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Status: Master</p></div>
              </div>
            ) : <button onClick={() => setShowAuthScreen(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm">Entrar</button>}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {showAuthScreen && !isAuthenticated ? (
            <Login onLogin={(isStudio) => { setIsAuthenticated(true); setIsStudioAdmin(isStudio); setShowAuthScreen(false); }} />
          ) : (
            currentView === ViewType.DASHBOARD ? <Dashboard /> :
            currentView === ViewType.SCHOOLS ? <Schools /> :
            currentView === ViewType.SECRETARY ? <Secretary /> :
            currentView === ViewType.STAFF ? <Staff /> :
            currentView === ViewType.ACADEMICS ? <Academics /> :
            currentView === ViewType.MANAGERS ? <Managers /> :
            currentView === ViewType.FINANCE ? <Finance /> :
            currentView === ViewType.AI_ASSISTANT ? <AI_Assistant /> :
            currentView === ViewType.SETTINGS ? <SettingsView settings={uiSettings} onUpdate={setUiSettings} /> :
            currentView === ViewType.SECURITY ? <SecuritySettings /> : 
            currentView === ViewType.MESSAGES ? <MessagingSystem /> : <Dashboard />
          )}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (<LanguageProvider><AppContent /></LanguageProvider>);
export default App;
