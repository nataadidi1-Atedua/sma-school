
import React from 'react';
import { 
  Moon, 
  Sun, 
  Type, 
  Palette, 
  ALargeSmall, 
  Check, 
  Eye, 
  Sparkles
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  
  // Lista de 10 cores conforme solicitado
  const colors = [
    { id: 'bg-slate-50', name: 'Slate Light' },
    { id: 'bg-blue-50', name: 'Azul Suave' },
    { id: 'bg-emerald-50', name: 'Esmeralda Suave' },
    { id: 'bg-amber-50', name: 'Âmbar Suave' },
    { id: 'bg-rose-50', name: 'Rosa Suave' },
    { id: 'bg-indigo-50', name: 'Índigo Suave' },
    { id: 'bg-violet-50', name: 'Violeta Suave' },
    { id: 'bg-teal-50', name: 'Verde Mar' },
    { id: 'bg-cyan-50', name: 'Ciano Suave' },
    { id: 'bg-neutral-50', name: 'Neutro' },
  ];

  const fonts = [
    'Inter', 'Poppins', 'Montserrat', 'Quicksand', 'Playfair Display', 'Merriweather', 'Fira Code', 'Roboto Mono', 'Lora', 'Oswald',
    'Roboto', 'Open Sans', 'Lato', 'Raleway', 'Ubuntu', 'Nunito', 'PT Sans', 'Arvo', 'Josefin Sans', 'Inconsolata',
    'Georgia', 'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Space Grotesk'
  ];

  const update = (patch: Partial<UserSettings>) => {
    onUpdate({ ...settings, ...patch });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Personalização de Sistema</h1>
          <p className="text-slate-500 font-medium">Controle total sobre a aparência e legibilidade.</p>
        </div>
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl animate-pulse">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Theme & Background */}
        <section className={`p-8 rounded-[2.5rem] border shadow-sm space-y-8 transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Palette size={20} /></div>
            <h3 className="text-lg font-bold">Cores de Fundo (10 Opções)</h3>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Modo de Exibição</label>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button 
                onClick={() => update({ theme: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${settings.theme === 'light' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500'}`}
              >
                <Sun size={18} /> Claro
              </button>
              <button 
                onClick={() => update({ theme: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${settings.theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-lg' : 'text-slate-500'}`}
              >
                <Moon size={18} /> Escuro
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cor de Fundo da Interface</label>
            <div className="grid grid-cols-5 gap-3 p-1">
              {colors.map((c) => (
                <button 
                  key={c.id}
                  onClick={() => update({ backgroundColor: c.id, theme: 'light' })}
                  className={`relative group h-12 rounded-xl transition-all border-2 ${c.id} flex items-center justify-center shadow-sm hover:scale-105 ${settings.backgroundColor === c.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}`}
                  title={c.name}
                >
                  {settings.backgroundColor === c.id && <Check className="text-blue-600" size={16} />}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-bold italic">Selecione uma cor soft para personalizar seu ambiente de trabalho.</p>
          </div>
        </section>

        {/* Typography */}
        <section className={`p-8 rounded-[2.5rem] border shadow-sm space-y-8 transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Type size={20} /></div>
            <h3 className="text-lg font-bold">Tipografia & Escala</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tamanho da Letra ({settings.fontSize}%)</label>
              <ALargeSmall size={18} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="1"
                value={settings.fontSize}
                onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-700"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo de Fonte</label>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar border rounded-2xl p-2 bg-slate-50 dark:bg-slate-800/50">
              {fonts.map((font) => (
                <button 
                  key={font}
                  onClick={() => update({ fontFamily: font })}
                  style={{ fontFamily: font }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border flex items-center justify-between group ${
                    settings.fontFamily === font 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{font}</span>
                  {settings.fontFamily === font && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Preview Card */}
      <section className={`p-12 rounded-[3.5rem] border shadow-2xl overflow-hidden relative transition-all ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : `${settings.backgroundColor} border-slate-200`}`}>
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
         <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl animate-bounce">
              <Eye size={56} />
            </div>
            <div className="text-center md:text-left flex-1 space-y-4">
              <h2 className="text-4xl font-black tracking-tight" style={{ fontFamily: settings.fontFamily }}>Visualização de Layout</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                Esta é uma amostra do sistema com a fonte <strong className="text-blue-600">{settings.fontFamily}</strong> e escala de <strong className="text-blue-600">{settings.fontSize}%</strong>. 
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl">Botão Ativo</button>
                <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-sm">Botão Secundário</button>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default SettingsView;
