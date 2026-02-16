
import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface AccessGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  expectedPassword?: string;
  adminPassword?: string;
}

const AccessGate: React.FC<AccessGateProps> = ({ isOpen, onClose, onSuccess, title, expectedPassword, adminPassword }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === expectedPassword || password === adminPassword || password === 'admin123') { // admin123 fallback inicial
      setError(false);
      onSuccess();
      setPassword('');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
            <Lock className="text-white" size={32} />
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Área Restrita</h2>
            <p className="text-slate-500 font-medium mt-2">{title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                autoFocus
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Insira a senha de acesso"
                className={`w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-800 border-2 rounded-2xl outline-none transition-all font-bold ${
                  error ? 'border-rose-500 shake' : 'border-transparent focus:border-blue-500 dark:text-white'
                }`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                Senha incorreta. Tente novamente.
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-slate-500 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Desbloquear <ChevronRight size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
            <ShieldAlert size={14} />
            Administrador tem acesso total
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessGate;
