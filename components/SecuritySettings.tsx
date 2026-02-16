
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Lock, Users, Save, RefreshCw, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { ViewType, UserRole, AccessControl, School } from '../types';

const SECURITY_STORAGE_KEY = 'sm_academy_security';

const SecuritySettings: React.FC = () => {
  const [config, setConfig] = useState<AccessControl>({
    passwords: {
      admin: 'admin123',
      secretary: 'sec123',
      schools: {},
      managers: { '1': 'jane123', '2': 'mark123', '3': 'sarah123', '4': 'robert123' }
    },
    restrictions: {
      [ViewType.DASHBOARD]: ['SUPER_ADMIN', 'MANAGER', 'SECRETARY', 'STAFF', 'GUEST'],
      [ViewType.SCHOOLS]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.SCHOOL_DIRECTOR]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.PEDAGOGICAL_DIRECTOR]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.MANAGERS]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.SECRETARY]: ['SUPER_ADMIN', 'SECRETARY'],
      [ViewType.FINANCE]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.SETTINGS]: ['SUPER_ADMIN'],
      [ViewType.AI_ASSISTANT]: ['SUPER_ADMIN', 'MANAGER'],
      [ViewType.SECURITY]: ['SUPER_ADMIN'],
      [ViewType.STUDENTS]: ['SUPER_ADMIN', 'SECRETARY'],
      [ViewType.STAFF]: ['SUPER_ADMIN', 'SECRETARY', 'TEACHER'],
      [ViewType.CLASSES]: ['SUPER_ADMIN', 'SECRETARY'],
      [ViewType.GRADES]: ['SUPER_ADMIN', 'SECRETARY'],
      [ViewType.ACADEMICS]: ['SUPER_ADMIN', 'SECRETARY'],
      [ViewType.REPORTS]: ['SUPER_ADMIN', 'MANAGER']
    },
    granularPermissions: []
  });

  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (saved) setConfig(JSON.parse(saved));

    const savedSchools = localStorage.getItem('sm_academy_schools');
    if (savedSchools) setSchools(JSON.parse(savedSchools));
  }, []);

  const saveSecurity = () => {
    localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(config));
    alert('Configurações de segurança salvas com sucesso!');
  };

  const updatePassword = (key: keyof typeof config.passwords, value: string, subKey?: string) => {
    setConfig(prev => {
      const newPasswords = { ...prev.passwords };
      if (subKey) {
        (newPasswords[key] as any)[subKey] = value;
      } else {
        (newPasswords[key] as any) = value;
      }
      return { ...prev, passwords: newPasswords };
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Centro de Segurança</h1>
          <p className="text-slate-500 font-medium">Gestão centralizada de senhas, permissões e restrições de acesso.</p>
        </div>
        <button 
          onClick={saveSecurity}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2"
        >
          <Save size={18} /> Salvar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Passwords */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Lock size={20} /></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Senhas Mestras</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha Administrador (Acesso Total)</label>
              <input 
                type="text" 
                value={config.passwords.admin}
                onChange={e => updatePassword('admin', e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Senha Área da Secretaria</label>
              <input 
                type="text" 
                value={config.passwords.secretary}
                onChange={e => updatePassword('secretary', e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl font-bold"
              />
            </div>
          </div>
        </section>

        {/* School Passwords */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Key size={20} /></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Senhas por Escola</h3>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {schools.map(school => (
              <div key={school.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 shadow-sm">
                  {school.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{school.name}</p>
                </div>
                <input 
                  type="text"
                  placeholder="Definir senha"
                  value={config.passwords.schools[school.id] || ''}
                  onChange={e => updatePassword('schools', e.target.value, school.id)}
                  className="w-32 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Role Management */}
      <section className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Users size={20} /></div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Matriz de Permissões</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="pb-6 text-xs font-black text-slate-400 uppercase tracking-widest">Módulo / Área</th>
                {(['SUPER_ADMIN', 'MANAGER', 'SECRETARY', 'STAFF', 'GUEST'] as UserRole[]).map(role => (
                  <th key={role} className="pb-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {role.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {Object.keys(config.restrictions).map(v => {
                const view = v as ViewType;
                return (
                  <tr key={view} className="group">
                    <td className="py-5 font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                      {view.replace('_', ' ')}
                    </td>
                    {(['SUPER_ADMIN', 'MANAGER', 'SECRETARY', 'STAFF', 'GUEST'] as UserRole[]).map(role => (
                      <td key={role} className="py-5 text-center">
                        <input 
                          type="checkbox"
                          disabled={role === 'SUPER_ADMIN'}
                          checked={config.restrictions[view].includes(role)}
                          onChange={() => {
                            setConfig(prev => {
                              const newRes = { ...prev.restrictions };
                              if (newRes[view].includes(role)) {
                                newRes[view] = newRes[view].filter(r => r !== role);
                              } else {
                                newRes[view] = [...newRes[view], role];
                              }
                              return { ...prev, restrictions: newRes };
                            });
                          }}
                          className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[3rem] border border-amber-100 dark:border-amber-800/50 flex items-start gap-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-black text-amber-900 dark:text-amber-400">Atenção ao Administrador</h4>
          <p className="text-amber-800/70 dark:text-amber-400/70 text-sm mt-1 font-medium leading-relaxed">
            Alterar senhas e permissões afeta imediatamente todos os usuários conectados. 
            A senha "admin123" é a chave de emergência padrão do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
