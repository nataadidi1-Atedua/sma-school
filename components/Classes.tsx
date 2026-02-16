
import React, { useState } from 'react';
import { Clock, MapPin, User, Search, Plus, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ClassSchedule } from '../types';
import ClassesDetailedView from './ClassesDetailedView';

const MOCK_SCHEDULE: ClassSchedule[] = [
  { id: '1', subject: 'Matemática Avançada', teacher: 'Dr. James Wilson', room: 'Edifício A - Sala 102', day: 'Monday', time: '08:00 - 09:30', color: 'bg-blue-500' },
  { id: '2', subject: 'Física Quântica', teacher: 'Prof. Sarah Mitchell', room: 'Laboratório 2', day: 'Monday', time: '10:00 - 11:30', color: 'bg-indigo-500' },
  { id: '3', subject: 'História Global', teacher: 'Maria Garcia', room: 'Edifício B - Sala 205', day: 'Tuesday', time: '09:00 - 10:30', color: 'bg-amber-500' },
  { id: '4', subject: 'Escrita Criativa', teacher: 'Lisa Ray', room: 'Anexo Biblioteca', day: 'Wednesday', time: '14:00 - 15:30', color: 'bg-purple-500' },
  { id: '5', subject: 'Ciência da Computação', teacher: 'Thomas Cook', room: 'Laboratório de TI 1', day: 'Thursday', time: '11:00 - 12:30', color: 'bg-emerald-500' },
];

const Classes: React.FC = () => {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);

  const days = [
    { id: 'Monday', label: 'Segunda-feira' },
    { id: 'Tuesday', label: 'Terça-feira' },
    { id: 'Wednesday', label: 'Quarta-feira' },
    { id: 'Thursday', label: 'Quinta-feira' },
    { id: 'Friday', label: 'Sexta-feira' },
    { id: 'Saturday', label: 'Sábado' },
    { id: 'Sunday', label: 'Domingo' }
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {selectedClass && (
        <ClassesDetailedView 
          schedule={selectedClass} 
          onClose={() => setSelectedClass(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('classes.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('classes.subtitle')}</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none">
          <Plus size={18} />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day.id} className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              {day.label}
            </h3>
            <div className="space-y-3">
              {MOCK_SCHEDULE.filter(s => s.day === day.id).map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setSelectedClass(item)}
                  className="w-full p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
                >
                  <div className={`w-10 h-1.5 ${item.color} rounded-full mb-4`}></div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.subject}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-wider">
                      <Clock size={12} className="text-slate-400" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-wider">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="truncate">{item.room}</span>
                    </div>
                  </div>
                </button>
              ))}
              {MOCK_SCHEDULE.filter(s => s.day === day.id).length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center justify-center opacity-40">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sem Aulas</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
