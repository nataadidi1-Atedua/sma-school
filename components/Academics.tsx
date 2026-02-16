
import React, { useState } from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  Users, 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  BarChart3, 
  BookOpen, 
  ChevronRight,
  Target,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { aiService } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const ACADEMIC_DATA = [
  { subject: 'Math', avg: 82, trend: '+5%' },
  { subject: 'Science', avg: 75, trend: '-2%' },
  { subject: 'History', avg: 88, trend: '+8%' },
  { subject: 'English', avg: 85, trend: '+1%' },
  { subject: 'Physics', avg: 68, trend: '-4%' },
  { subject: 'Arts', avg: 94, trend: '+2%' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

const Academics: React.FC = () => {
  const { language, t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    
    const performanceContext = `
      Academic Performance Data:
      ${ACADEMIC_DATA.map(d => `${d.subject}: Average Score ${d.avg}%, Trend ${d.trend}`).join('\n')}
      
      Tasks:
      1. Analyze these scores.
      2. Identify the weakest subject and propose 3 specific intervention strategies.
      3. Identify the strongest area and suggest how to leverage this excellence.
      4. Provide a general pedagogical outlook.
    `;

    try {
      const result = await aiService.getAcademicInsight(performanceContext, language);
      setAiInsight(result);
    } catch (error) {
      setAiInsight("Unable to generate analysis at this moment. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Gestão Acadêmica</h1>
          <p className="text-slate-500 font-medium mt-2">Monitoramento de performance institucional e insights pedagógicos via IA.</p>
        </div>
        <button 
          onClick={generateAIAnalysis}
          disabled={isAnalyzing}
          className={`px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2rem] font-black text-sm flex items-center gap-3 shadow-2xl transition-all active:scale-95 ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <Zap className="animate-pulse" size={18} /> Analisando Dados...
            </div>
          ) : (
            <>
              <BrainCircuit size={18} /> Gerar Análise IA Genius
            </>
          )}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Média Global', value: '81.4%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Taxa de Aprovação', value: '94.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Alunos Engajados', value: '1,204', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Risco de Evasão', value: '2.1%', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.bg} dark:bg-slate-800 ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Performance por Disciplina</h3>
              <p className="text-sm text-slate-500 font-medium">Médias ponderadas do último semestre letivo.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <BarChart3 size={20} className="text-slate-400" />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACADEMIC_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="subject" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 900}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }} 
                />
                <Bar 
                  dataKey="avg" 
                  radius={[12, 12, 12, 12]} 
                  barSize={40} 
                >
                  {ACADEMIC_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Metrics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={18} /> Top Performers
            </h3>
            <div className="space-y-4">
              {[
                { name: 'História Contemporânea', score: '88%' },
                { name: 'Artes Visuais', score: '94%' },
                { name: 'Língua Inglesa', score: '85%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-sm font-bold text-blue-100">{item.name}</span>
                  <span className="text-sm font-black">{item.score}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 mt-6 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Ver Ranking Completo
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Próximos Marcos</h3>
            <div className="space-y-6">
              {[
                { title: 'Exames Finais Q3', date: '22 Abr', color: 'bg-amber-500' },
                { title: 'Feira de Ciências', date: '10 Mai', color: 'bg-emerald-500' },
                { title: 'Conselho Pedagógico', date: '15 Jun', color: 'bg-blue-500' },
              ].map((milestone, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 ${milestone.color} rounded-full`}></div>
                    <div className="w-[2px] h-8 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black dark:text-white uppercase leading-none">{milestone.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      {(isAnalyzing || aiInsight) && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-indigo-100 dark:border-indigo-900/50 p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
            
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 space-y-6">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-xl">
                  <BrainCircuit size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Análise Pedagógica IA</h2>
                  <p className="text-slate-500 font-medium mt-2">Relatório gerado em tempo real com base nos indicadores de performance das turmas.</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Analista: Gemini-3</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Status: Integrado</span>
                </div>
              </div>

              <div className="lg:w-2/3">
                {isAnalyzing ? (
                  <div className="space-y-4 py-10">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse delay-75"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-5/6 animate-pulse delay-150"></div>
                    <p className="text-center text-xs font-black text-indigo-500 uppercase tracking-widest pt-8 animate-bounce">A IA está processando padrões educacionais...</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                        {aiInsight}
                      </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Zap size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validado pelo Protocolo SM@ Genius</p>
                      </div>
                      <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">
                        Arquivar Insight <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
