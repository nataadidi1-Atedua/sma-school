
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, UserPlus, Search, Edit2, Trash2, Save, User, 
  Calendar, CreditCard, ClipboardList, ArrowLeft, 
  CheckCircle2, AlertCircle, FileText, Filter,
  Users, GraduationCap, Briefcase, MapPin, Phone, Mail,
  Camera, Upload, FileUp, Paperclip, ChevronRight, IdCard
} from 'lucide-react';
import CardIssuer from './CardIssuer';

export interface Enrollment {
  id: string;
  studentName: string;
  gender: 'M' | 'F';
  birthDate: string;
  fatherName: string;
  motherName: string;
  idNumber: string;
  grade: string;
  shift: string;
  academicYear: string;
  status: 'Ativo' | 'Pendente' | 'Cancelado';
  enrollmentDate: string;
  address: string;
  phone: string;
  email: string;
  photo?: string;
  documents?: string[];
}

interface EnrollmentManagerProps {
  schoolId: string;
  onClose: () => void;
}

const STORAGE_KEY_PREFIX = 'sm_enrollments_';

const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ schoolId, onClose }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCardIssuerOpen, setIsCardIssuerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Omit<Enrollment, 'id' | 'enrollmentDate'>>({
    studentName: '',
    gender: 'M',
    birthDate: '',
    fatherName: '',
    motherName: '',
    idNumber: '',
    grade: '',
    shift: 'Manhã',
    academicYear: '2025/2026',
    status: 'Ativo',
    address: '',
    phone: '',
    email: '',
    photo: '',
    documents: []
  });

  const storageKey = `${STORAGE_KEY_PREFIX}${schoolId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setEnrollments(JSON.parse(saved));
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [storageKey]);

  const saveToStorage = (data: Enrollment[]) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map((f: File) => f.name);
      setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), ...newDocs] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = enrollments.map(en => 
        en.id === editingId ? { ...en, ...formData } : en
      );
      setEnrollments(updated);
      saveToStorage(updated);
    } else {
      const newEnrollment: Enrollment = {
        ...formData,
        id: `MAT-${Math.floor(10000 + Math.random() * 90000)}`,
        enrollmentDate: new Date().toISOString().split('T')[0]
      };
      const updated = [newEnrollment, ...enrollments];
      setEnrollments(updated);
      saveToStorage(updated);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      studentName: '', gender: 'M', birthDate: '', fatherName: '', motherName: '',
      idNumber: '', grade: '', shift: 'Manhã', academicYear: '2025/2026',
      status: 'Ativo', address: '', phone: '', email: '', photo: '', documents: []
    });
  };

  const handleEdit = (en: Enrollment) => {
    setEditingId(en.id);
    setFormData({
      studentName: en.studentName, gender: en.gender, birthDate: en.birthDate,
      fatherName: en.fatherName, motherName: en.motherName, idNumber: en.idNumber,
      grade: en.grade, shift: en.shift, academicYear: en.academicYear,
      status: en.status, address: en.address || '', phone: en.phone || '',
      email: en.email || '', photo: en.photo || '', documents: en.documents || []
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente apagar esta matrícula?')) {
      const updated = enrollments.filter(en => en.id !== id);
      setEnrollments(updated);
      saveToStorage(updated);
    }
  };

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return enrollments.filter(en => 
      en.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [enrollments, searchTerm]);

  const filteredEnrollments = useMemo(() => {
    if (!searchTerm.trim()) return enrollments;
    return enrollments.filter(en => 
      en.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enrollments, searchTerm]);

  if (isCardIssuerOpen) {
    return <CardIssuer schoolId={schoolId} onClose={() => setIsCardIssuerOpen(false)} />;
  }

  return (
    <div className="fixed inset-0 z-[400] bg-[#050b18] flex flex-col animate-in fade-in duration-300 overflow-hidden font-['Inter']">
      {/* HEADER */}
      <header className="px-10 py-8 border-b border-slate-800 bg-[#0b1221] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Dossiê do Aluno</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Controle Central de Registros e Ingressos</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCardIssuerOpen(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <IdCard size={18} /> Emitir Cartões
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <UserPlus size={18} /> Nova Matrícula
          </button>
        </div>
      </header>

      {/* SEARCH AND SUGGESTIONS BAR */}
      <div className="px-10 py-6 bg-[#0b1221]/50 border-b border-slate-800 flex items-center gap-6 shrink-0">
        <div className="relative flex-1 max-w-xl" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, ID ou BI do aluno..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
          />
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
              {suggestions.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => { setSearchTerm(s.studentName); setShowSuggestions(false); }}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-800 border-b border-slate-800 last:border-0 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center overflow-hidden shrink-0">
                    {s.photo ? <img src={s.photo} className="w-full h-full object-cover" alt="" /> : <User size={16} className="text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white uppercase truncate">{s.studentName}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{s.id} • BI: {s.idNumber}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-3 bg-slate-800/50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Total: {enrollments.length} Registros
           </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#050b18]">
        <div className="max-w-7xl mx-auto">
          {filteredEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEnrollments.map((en) => (
                <div key={en.id} className="bg-[#111928] rounded-[2.5rem] p-8 border border-slate-800 hover:border-slate-600 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <GraduationCap size={120} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center overflow-hidden font-black text-xl shadow-inner uppercase">
                        {en.photo ? <img src={en.photo} className="w-full h-full object-cover" alt="" /> : en.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{en.id}</p>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight truncate max-w-[200px]">{en.studentName}</h3>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      en.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' : 
                      en.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {en.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Classe / Turma</p>
                      <p className="text-xs font-bold text-slate-200 uppercase">{en.grade || '---'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Turno</p>
                      <p className="text-xs font-bold text-slate-200 uppercase">{en.shift}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BI / Documento</p>
                      <p className="text-xs font-bold text-slate-200 uppercase">{en.idNumber || '---'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Documentos</p>
                      <p className="text-xs font-bold text-emerald-500">{en.documents?.length || 0} Anexos</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Phone size={12} className="text-blue-500" /> {en.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 truncate">
                      <MapPin size={12} className="text-emerald-500" /> {en.address || 'N/A'}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-6 border-t border-slate-800">
                    <button onClick={() => handleEdit(en)} className="flex-1 py-3 bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Edit2 size={12} /> Editar
                    </button>
                    <button onClick={() => handleDelete(en.id)} className="p-3 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20 text-slate-500">
               <ClipboardList size={100} className="mb-6" />
               <p className="text-2xl font-black uppercase tracking-[0.3em]">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* ENROLLMENT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-[#111928] w-full max-w-4xl rounded-[4rem] border border-slate-800 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-800 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600/10 text-blue-500 rounded-[2rem]"><UserPlus size={32} /></div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{editingId ? 'Editar Matrícula' : 'Ficha de Matrícula'}</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Preencha todos os campos obrigatórios</p>
                  </div>
               </div>
               <button onClick={closeForm} className="p-4 bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white rounded-3xl transition-all"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
               
               {/* Secção Foto e Documentos */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="flex flex-col items-center gap-4">
                     <div className="relative w-40 h-40 bg-slate-900 border-2 border-dashed border-slate-700 rounded-3xl overflow-hidden group">
                        {formData.photo ? (
                          <img src={formData.photo} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                             <Camera size={32} className="mb-2" />
                             <p className="text-[9px] font-black uppercase">Foto 3x4</p>
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="absolute inset-0 bg-blue-600/60 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1"
                        >
                           <Upload size={20} />
                           <span className="text-[9px] font-black uppercase">Carregar</span>
                        </button>
                        <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identificação Visual</p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                     <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                           <FileUp size={18} />
                           <h4 className="text-xs font-black uppercase tracking-widest">Documentação Anexa</h4>
                        </div>
                        <button 
                          type="button"
                          onClick={() => document.getElementById('docs-input')?.click()}
                          className="px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                        >
                           Adicionar Arquivos
                        </button>
                        <input id="docs-input" type="file" multiple className="hidden" onChange={handleFileUpload} />
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                        {formData.documents?.map((doc, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl group">
                              <Paperclip size={14} className="text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-300 truncate flex-1">{doc}</span>
                              <button 
                                type="button" 
                                onClick={() => setFormData(prev => ({ ...prev, documents: prev.documents?.filter((_, idx) => idx !== i) }))}
                                className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Secção Aluno */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-blue-500 border-b border-slate-800 pb-3">
                     <User size={20} />
                     <h4 className="text-xs font-black uppercase tracking-[0.2em]">Dados do Aluno</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome Completo</label>
                        <input required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500" placeholder="Insira o nome completo do estudante" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Género</label>
                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'M' | 'F'})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 appearance-none">
                           <option value="M">Masculino</option>
                           <option value="F">Feminino</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Data de Nascimento</label>
                        <input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 uppercase" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nº BI / Passaporte</label>
                        <input required value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 uppercase" placeholder="000000000LA000" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Status Inicial</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 appearance-none">
                           <option value="Ativo">Ativo</option>
                           <option value="Pendente">Pendente</option>
                           <option value="Cancelado">Cancelado</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Secção Localização e Contacto */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-emerald-500 border-b border-slate-800 pb-3">
                     <MapPin size={20} />
                     <h4 className="text-xs font-black uppercase tracking-[0.2em]">Localização e Contacto</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Endereço de Residência</label>
                        <div className="relative">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                           <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="Ex: Luanda, Talatona, Rua..." />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Telefone</label>
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="9XX XXX XXX" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">E-mail de Contacto</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="exemplo@email.com" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Secção Filiação */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-indigo-500 border-b border-slate-800 pb-3">
                     <Users size={20} />
                     <h4 className="text-xs font-black uppercase tracking-[0.2em]">Filiação / Responsáveis</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome do Pai</label>
                        <input required value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500" placeholder="Nome completo do pai" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome da Mãe</label>
                        <input required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500" placeholder="Nome completo da mãe" />
                     </div>
                  </div>
               </div>

               {/* Secção Académica */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-amber-500 border-b border-slate-800 pb-3">
                     <GraduationCap size={20} />
                     <h4 className="text-xs font-black uppercase tracking-[0.2em]">Configuração Académica</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Classe / Nível</label>
                        <input required value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 uppercase" placeholder="Ex: 12ª Classe" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Turno</label>
                        <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 appearance-none">
                           <option value="Manhã">Manhã</option>
                           <option value="Vespertino">Vespertino</option>
                           <option value="Noite">Noite</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Ano Lectivo</label>
                        <input required value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500" placeholder="2025/2026" />
                     </div>
                  </div>
               </div>
            </form>

            <div className="p-10 border-t border-slate-800 bg-slate-900/50 flex gap-4 shrink-0">
               <button type="button" onClick={closeForm} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-800 rounded-2xl transition-all">Cancelar</button>
               <button onClick={handleSubmit} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                 <Save size={18} /> {editingId ? 'Confirmar Atualização' : 'Finalizar Matrícula'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManager;
