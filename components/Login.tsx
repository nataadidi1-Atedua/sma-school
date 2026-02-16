
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Languages, Building2, ArrowRight, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

interface LoginProps {
  onLogin: (isStudioAdmin?: boolean) => void;
}

const USERS_STORAGE_KEY = 'sm_academy_auth_users';
const SESSION_KEY = 'sm_academy_session';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [error, setError] = useState('');

  // Inicializar usuário padrão se não existir nenhum
  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!savedUsers) {
      const defaultUser = {
        email: 'admin@sm.edu',
        password: 'admin123',
        schoolName: 'SM@ Academy Principal',
        role: 'SUPER_ADMIN'
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultUser]));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    if (isRegistering) {
      // Lógica de Registro
      if (savedUsers.find((u: any) => u.email === email)) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      const newUser = { email, password, schoolName, role: 'MANAGER' };
      const updatedUsers = [...savedUsers, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // Auto-login após registro
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      onLogin(false);
    } else {
      // Lógica de Login
      const user = savedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        onLogin(user.role === 'SUPER_ADMIN');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    }
  };

  const handleStudioLogin = () => {
    // Login rápido de estúdio para demonstração
    onLogin(true);
  };

  const langs: { id: Language; label: string }[] = [
    { id: 'pt', label: 'Português' },
    { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' },
    { id: 'es', label: 'Español' },
    { id: 'ru', label: 'Русский' },
    { id: 'zh', label: '中文' },
    { id: 'de', label: 'Deutsch' },
    { id: 'ja', label: '日本語' },
    { id: 'it', label: 'Italiano' },
    { id: 'ar', label: 'العربية' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-indigo-50">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
        
        {/* Left Branding Panel */}
        <div className="lg:w-[45%] relative p-12 text-white flex flex-col justify-between overflow-hidden">
          <img src="input_file_4.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <img src="input_file_0.png" alt="Logo" className="h-16 shadow-2xl" />
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">
              {isRegistering ? t('login.register') : t('login.welcome')}
            </h2>
            <p className="text-blue-100/70 text-lg font-light leading-relaxed">
              {t('login.subtitle')}
            </p>
          </div>
          
          <div className="mt-12 space-y-4 relative z-10">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Acesso Rápido de Teste</p>
              <p className="text-xs text-white/60 font-mono">User: admin@sm.edu</p>
              <p className="text-xs text-white/60 font-mono">Pass: admin123</p>
            </div>
            <button 
              onClick={handleStudioLogin}
              className="w-full p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center gap-4 text-left hover:bg-white/20 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white">{t('login.studioLogin')}</h4>
                <p className="text-blue-100/60 text-xs">{t('login.studioDesc')}</p>
              </div>
              <ArrowRight className="ml-auto text-blue-200 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" size={20} />
            </button>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-12 relative">
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                <Languages size={14} />
                <span className="uppercase">{language}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                  {langs.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { setLanguage(l.id); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors ${language === l.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-sm mx-auto h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in shake duration-300">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {isRegistering && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase ml-1">{t('login.schoolName')}</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Ex: Global Institute"
                      required={isRegistering}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">{t('login.email')}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sm.edu"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">{t('login.password')}</label>
                  {!isRegistering && (
                    <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">{t('login.forgot')}</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                {isRegistering ? t('login.signup') : t('login.signin')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 text-center">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                {isRegistering ? (
                  <><LogIn size={18} /> {t('login.signin')}</>
                ) : (
                  <><UserPlus size={18} /> {t('login.register')}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
