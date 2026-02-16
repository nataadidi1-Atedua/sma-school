
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ImageIcon
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const revenueData = [
  { day: 'Mon', amount: 4500 },
  { day: 'Tue', amount: 5200 },
  { day: 'Wed', amount: 3800 },
  { day: 'Thu', amount: 6100 },
  { day: 'Fri', amount: 5800 },
  { day: 'Sat', amount: 2000 },
  { day: 'Sun', amount: 1500 },
];

const SCHOOL_PHOTOS = [
  'input_file_1.png',
  'input_file_2.png',
  'input_file_3.png',
  'input_file_4.png',
  'input_file_5.png',
  'input_file_6.png',
  'input_file_7.png'
];

const StatCard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean; icon: any; color: string }> = ({
  title, value, trend, isPositive, icon: Icon, color
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % SCHOOL_PHOTOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % SCHOOL_PHOTOS.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + SCHOOL_PHOTOS.length) % SCHOOL_PHOTOS.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.overview')}</h1>
          <p className="text-slate-500">{t('dashboard.welcome')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span>Ano Lectivo 2024/25</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Dynamic Slideshow */}
      <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
        {SCHOOL_PHOTOS.map((photo, idx) => (
          <img 
            key={photo}
            src={photo} 
            alt={`School Scene ${idx}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentPhotoIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
          />
        ))}
        
        {/* Overlay Branding */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-12">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] animate-in slide-in-from-left-4 duration-700">
              <Sparkles size={14} className="animate-pulse" />
              Sua Escola no Topo da Tecnologia
            </div>
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
              SM@ Academy: Gestão Escolar Moderna e Eficiente
            </h2>
            <p className="text-slate-200 text-lg font-medium leading-relaxed max-w-xl opacity-90">
              Transforme a experiência pedagógica e administrativa com inteligência artificial de ponta e painéis holográficos de última geração.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                Explorar Hub
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">
                Galeria 2025
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 right-12 flex gap-2">
          {SCHOOL_PHOTOS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentPhotoIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${idx === currentPhotoIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>

        {/* Carousel Controls */}
        <button onClick={prevPhoto} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextPhoto} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('nav.students')} value="1,284" trend="+12%" isPositive={true} icon={Users} color="bg-blue-500" />
        <StatCard title="Média Global" value="A-" trend="+4.2%" isPositive={true} icon={GraduationCap} color="bg-purple-500" />
        <StatCard title="Receita Prevista" value="42M Kz" trend="-2.1%" isPositive={false} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Assiduidade" value="94%" trend="+0.5%" isPositive={true} icon={TrendingUp} color="bg-orange-500" />
      </div>

      {/* Ecosystem Photos Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ImageIcon size={20} /></div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">O Ecossistema SM@ em Acção</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {SCHOOL_PHOTOS.map((photo, i) => (
            <div key={photo} className="group relative h-40 rounded-3xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl transition-all">
              <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Sparkles className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Análise de Rendimento Mensal</h3>
            <p className="text-sm text-slate-500 font-medium">Relatório automatizado de performance financeira e acadêmica.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
            <button className="px-5 py-2 text-xs font-black bg-white text-blue-600 shadow-md rounded-xl uppercase tracking-widest transition-all">Semanal</button>
            <button className="px-5 py-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-all">Mensal</button>
          </div>
        </div>
        
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 900}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '16px' }} 
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                radius={[12, 12, 0, 0]} 
                barSize={45} 
                animationBegin={200}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
