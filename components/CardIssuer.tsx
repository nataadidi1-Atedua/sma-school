
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ArrowLeft, Filter, GraduationCap, Laptop, Sun, 
  IdCard, Camera, Edit2, CheckCircle, X, Download, Printer,
  User, Check, AlertCircle, QrCode, MapPin
} from 'lucide-react';
import { Enrollment } from './EnrollmentManager';

interface CardIssuerProps {
  schoolId: string;
  onClose: () => void;
}

const CardIssuer: React.FC<CardIssuerProps> = ({ schoolId, onClose }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchId, setSearchId] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterTurno, setFilterTurno] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState<Enrollment | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`sm_enrollments_${schoolId}`);
    if (saved) setEnrollments(JSON.parse(saved));
  }, [schoolId]);

  const filteredList = useMemo(() => {
    return enrollments.filter(en => {
      const matchGrade = !filterGrade || en.grade.toUpperCase().includes(filterGrade.toUpperCase());
      const matchTurma = !filterTurma || en.grade.toUpperCase().includes(filterTurma.toUpperCase());
      const matchTurno = !filterTurno || en.shift === filterTurno;
      const matchId = !searchId || en.id.toLowerCase().includes(searchId.toLowerCase());
      return matchGrade && matchTurma && matchTurno && matchId;
    });
  }, [enrollments, filterGrade, filterTurma, filterTurno, searchId]);

  const handleUpdatePhoto = (studentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        const updated = enrollments.map(en => en.id === studentId ? { ...en, photo: photoData } : en);
        setEnrollments(updated);
        localStorage.setItem(`sm_enrollments_${schoolId}`, JSON.stringify(updated));
        if (selectedStudent?.id === studentId) setSelectedStudent({ ...selectedStudent, photo: photoData });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCard = (student: Enrollment) => {
    setSelectedStudent(student);
    setIsConfirming(true);
  };

  return (
    <div className="fixed inset-0 z-[450] bg-[#050b18] flex flex-col animate-in fade-in duration-300 overflow-hidden font-['Inter']">
      {/* HEADER */}
      <header className="px-10 py-8 border-b border-slate-800 bg-[#0b1221] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Emissão de Cartões</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Dossiê de Identificação Estudantil</p>
          </div>
        </div>
      </header>

      {/* FILTROS E BUSCA */}
      <div className="px-10 py-8 bg-[#0b1221]/50 border-b border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">1. Selecionar Classe</label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              value={filterGrade}
              onChange={e => setFilterGrade(e.target.value)}
              placeholder="Ex: 12ª Classe" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">2. Selecionar Turma</label>
          <div className="relative">
            <Laptop className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              value={filterTurma}
              onChange={e => setFilterTurma(e.target.value)}
              placeholder="Ex: Turma A" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">3. Selecionar Turno</label>
          <div className="relative">
            <Sun className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select 
              value={filterTurno}
              onChange={e => setFilterTurno(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none"
            >
              <option value="">Todos</option>
              <option value="Manhã">Manhã</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">4. Buscar com ID</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
            <input 
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Digite o Código..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-blue-500/30 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" 
            />
          </div>
        </div>
      </div>

      {/* LISTA DE RESULTADOS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#050b18]">
        <div className="max-w-7xl mx-auto space-y-6">
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredList.map((en) => (
                <div key={en.id} className="bg-[#111928] rounded-3xl p-6 border border-slate-800 flex items-center gap-8 group hover:border-slate-600 transition-all">
                  <div className="relative w-20 h-20 bg-slate-900 rounded-2xl overflow-hidden shrink-0">
                    {en.photo ? <img src={en.photo} className="w-full h-full object-cover" alt="" /> : <User size={40} className="m-auto text-slate-700 h-full w-full p-4" />}
                    <button 
                      onClick={() => { setSelectedStudent(en); photoInputRef.current?.click(); }}
                      className="absolute inset-0 bg-blue-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Camera size={20} />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-white uppercase truncate">{en.studentName}</h3>
                      <span className="px-3 py-1 bg-slate-800 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{en.id}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">
                      {en.grade} • {en.shift} • {en.academicYear}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => generateCard(en)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/10 active:scale-95 transition-all flex items-center gap-2">
                      <IdCard size={18} /> Gerar Cartão
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20 text-slate-500">
               <AlertCircle size={80} className="mb-6" />
               <p className="text-xl font-black uppercase tracking-[0.3em]">Nenhum estudante encontrado</p>
            </div>
          )}
        </div>
      </div>

      <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={(e) => selectedStudent && handleUpdatePhoto(selectedStudent.id, e)} />

      {/* MODAL DE EMISSÃO DE CARTÃO */}
      {isConfirming && selectedStudent && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-white w-[500px] rounded-[3rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
               <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={selectedStudent.photo || `https://ui-avatars.com/api/?name=${selectedStudent.studentName}&background=0D8ABC&color=fff`} 
                    className="w-full h-full object-cover rounded-[2rem] border-4 border-white shadow-2xl" 
                    alt="" 
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white"><Check size={16} /></div>
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Confirmar Emissão</h2>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-3">Cartão Estudantil • ID {selectedStudent.id}</p>
               </div>
               
               {/* Card Preview */}
               <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white text-left relative overflow-hidden shadow-2xl shadow-blue-900/40">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">School Manager ID</span>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><QrCode size={20} /></div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black uppercase leading-tight tracking-tight">{selectedStudent.studentName}</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div><p className="text-[8px] font-black uppercase opacity-40 mb-0.5">Classe</p><p className="text-xs font-bold">{selectedStudent.grade}</p></div>
                       <div><p className="text-[8px] font-black uppercase opacity-40 mb-0.5">Turno</p><p className="text-xs font-bold">{selectedStudent.shift}</p></div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between items-end border-t border-white/10 pt-4">
                     <div><p className="text-[7px] font-black uppercase opacity-40 mb-0.5">Válido até</p><p className="text-[10px] font-black uppercase">Dez/2026</p></div>
                     <span className="text-[14px] font-black font-mono">SM@{selectedStudent.id.split('-')[1]}</span>
                  </div>
               </div>
            </div>

            <div className="p-8 flex justify-between bg-slate-50 mt-auto">
               <button 
                onClick={() => setIsConfirming(false)}
                className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-rose-500 rounded-2xl transition-all"
               >
                 Cancelar
               </button>
               <button 
                onClick={() => { setIsConfirming(false); alert('Cartão enviado para fila de impressão!'); }}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
               >
                 Confirmar <Check size={18} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardIssuer;
