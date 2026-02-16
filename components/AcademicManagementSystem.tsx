
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, Printer, FileOutput, GraduationCap, Laptop, Sun, 
  Calendar, Check, X, MoreHorizontal, LayoutGrid, Users, FileText,
  IdCard, BarChart3, ListChecks, ChevronUp, Save, Search, TrendingUp, AlertCircle,
  Award, BookOpen, CalendarDays, Edit2, Plus, User, Briefcase, GraduationCap as DegreeIcon,
  CheckCircle2, XCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

interface AcademicManagementSystemProps {
  schoolId: string;
  onClose: () => void;
}

type AttendanceStatus = 'P' | 'F' | null;

const trimesterMonths: Record<string, string[]> = {
  '1º Trimestre': ['SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'],
  '2º Trimestre': ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL'],
  '3º Trimestre': ['ABRIL', 'MAIO', 'JUNHO', 'JULHO'],
  'PAUTA FINAL': ['RESULTADOS ANUAIS', 'ESTATÍSTICA FINAL']
};

const DEFAULT_SUBJECTS = ['Matemática', 'Língua Portuguesa', 'Física', 'Química', 'Biologia', 'Inglês', 'História', 'Geografia'];
const PRIMARY_SUBJECTS = ['Língua Portuguesa', 'Matemática', 'Estudo do Meio', 'Expressão Plástica', 'Educação Musical', 'Educação Física'];
const MODULO_SUBJECTS = ['Área 1', 'Área 2'];

const ENSINO_MEDIO_CURSOS = [
  'Informática', 'Informática de Gestão', 'Eletricidade', 'Mecânica', 'Construção Civil', 'Contabilidade e Gestão',
  'Enfermagem', 'Análises Clínicas', 'Farmácia', 'Agronomia', 'Veterinária', 'Hotelaria e Turismo',
  'Comunicação Social', 'Direito', 'Educação Física', 'Design Gráfico', 'Energias Renováveis', 'Logística',
  'Gestão de Redes', 'Metalomecânica', 'Petroquímica', 'Eletrónica e Telecomunicações'
];

const ENSINO_SUPERIOR_CURSOS = [
  'Engenharia Informática', 'Medicina Geral', 'Direito', 'Economia', 'Gestão de Empresas', 'Arquitetura',
  'Engenharia Civil', 'Engenharia Eletrotécnica', 'Engenharia Mecânica', 'Psicologia Clínica', 'Sociologia',
  'Relações Internacionais', 'Enfermagem Superior', 'Farmácia Superior', 'Odontologia', 'Medicina Veterinária',
  'Agronomia', 'Biologia', 'Geologia', 'Matemática Aplicada', 'Física Pura', 'Química Industrial',
  'Pedagogia', 'Comunicação Multimédia', 'Contabilidade e Auditoria', 'Gestão de Recursos Humanos', 'Ciência Política'
];

const GRAUS_ACADEMICOS = ['Bacharelato', 'Licenciatura', 'Pós-Graduação', 'Mestrado', 'Doutoramento'];

interface StudentData {
  no: number;
  id: string;
  nome: string;
  genero?: 'M' | 'F';
  idade?: number;
}

const studentDatabase: Record<string, StudentData[]> = {
  'MÓDULO 3-Única': [
    { no: 1, id: 'AL-M3-01', nome: 'Adão Afonso José Fula', genero: 'M', idade: 15 },
    { no: 2, id: 'AL-M3-02', nome: 'Afonso Sebastião Isalino', genero: 'M', idade: 15 },
    { no: 3, id: 'AL-M3-03', nome: 'Ana Baltazar Gongo Machado', genero: 'F' },
    { no: 4, id: 'AL-M3-04', nome: 'Armando Firmino Manuel', genero: 'M', idade: 16 },
    { no: 5, id: 'AL-M3-05', nome: 'Celma Simão Gonsalves', genero: 'F' },
    { no: 6, id: 'AL-M3-06', nome: 'Constantino Domingos Eduardo', genero: 'M', idade: 17 },
    { no: 7, id: 'AL-M3-07', nome: 'Francisco Kileba Satchiluapo', genero: 'M' },
    { no: 8, id: 'AL-M3-08', nome: 'Francisco Tomás Guilherme Quissanga', genero: 'M', idade: 15 },
    { no: 9, id: 'AL-M3-09', nome: 'Germano Manuel Solo', genero: 'M' },
    { no: 10, id: 'AL-M3-10', nome: 'Gervasio Augusto Armando', genero: 'M' },
    { no: 11, id: 'AL-M3-11', nome: 'Helena Guilhermina Quileba', genero: 'F' },
    { no: 12, id: 'AL-M3-12', nome: 'Indira Baltazar Simão', genero: 'F', idade: 15 },
    { no: 13, id: 'AL-M3-13', nome: 'Isabel Jacinto Augusto Capemba', genero: 'F', idade: 16 },
    { no: 14, id: 'AL-M3-14', nome: 'Isabel Simão Faustino', genero: 'F' },
    { no: 15, id: 'AL-M3-15', nome: 'Isaura Coceição Augusto', genero: 'F', idade: 16 },
    { no: 16, id: 'AL-M3-16', nome: 'Joaquim Manuel Solo', genero: 'M', idade: 19 },
    { no: 17, id: 'AL-M3-17', nome: 'José Bumba Sahombo', genero: 'M' },
    { no: 18, id: 'AL-M3-18', nome: 'Julieta Venancio Miguel Pinto', genero: 'F', idade: 17 },
    { no: 19, id: 'AL-M3-19', nome: 'Justino Gondo Alexandre', genero: 'M', idade: 16 },
    { no: 20, id: 'AL-M3-20', nome: 'Laurinda António Fragoso', genero: 'F', idade: 15 },
    { no: 21, id: 'AL-M3-21', nome: 'Maria Domingos Simão', genero: 'F', idade: 15 },
    { no: 22, id: 'AL-M3-22', nome: 'Maria Ndonana Ussaço', genero: 'F', idade: 15 },
    { no: 23, id: 'AL-M3-23', nome: 'Marinela Esperança Lima', genero: 'F' },
    { no: 24, id: 'AL-M3-24', nome: 'Natália Cabuço Quizembe', genero: 'F' },
  ],
  '10ª Classe-Turma A': [
    { no: 1, id: 'AL-10A-01', nome: 'Baltazar Gongo' },
  ]
};

const AcademicManagementSystem: React.FC<AcademicManagementSystemProps> = ({ schoolId, onClose }) => {
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [academicYears, setAcademicYears] = useState(['2020/2021', '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026', '2026/2027']);
  const [teacherName, setTeacherName] = useState('Adilson');

  const [selectedTrimestre, setSelectedTrimestre] = useState('1º Trimestre');
  const [selectedMonth, setSelectedMonth] = useState('SETEMBRO');
  const [selectedClasse, setSelectedClasse] = useState('MÓDULO 3');
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedGrau, setSelectedGrau] = useState('');
  const [selectedTurma, setSelectedTurma] = useState('Única');
  const [selectedTurno, setSelectedTurno] = useState('Vespertino');
  const [selectedDoc, setSelectedDoc] = useState({ label: 'Pauta Trimestral', icon: ListChecks });

  const [attendance, setAttendance] = useState<Record<string, Record<string, AttendanceStatus>>>({});
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const classes = useMemo(() => [
    "Dos 0 aos 3 Meses de Idade", "Dos 4 Meses aos 6 Meses de Idadede", "Dos 7 Meses de Idade a 1 Ano",
    "1 Ano", "2 Anos", "3 Anos", "4 Anos", "5 Anos", "6 Anos",
    "Iniciação", "1ª Classe", "2ª Classe", "3ª Classe", "4ª Classe", "5ª Classe", "6ª Classe",
    "7ª Classe", "8ª Classe", "9ª Classe", "10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe",
    "ETAPA 1", "ETAPA 2", "ETAPA 3", "MÓDULO 1", "MÓDULO 2", "MÓDULO 3", "Ensino Superior"
  ], []);

  const isHighSchool = useMemo(() => ["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(selectedClasse), [selectedClasse]);
  const isHigherEducation = useMemo(() => selectedClasse === "Ensino Superior", [selectedClasse]);

  const maxScore = useMemo(() => (isHighSchool || isHigherEducation) ? 20 : 10, [isHighSchool, isHigherEducation]);
  const minPassingScore = useMemo(() => (isHighSchool || isHigherEducation) ? 10 : 4.5, [isHighSchool, isHigherEducation]);

  const currentSubjects = useMemo(() => {
    if (selectedClasse.toUpperCase().includes('MÓDULO')) return MODULO_SUBJECTS;
    if (["1ª Classe", "2ª Classe", "3ª Classe", "4ª Classe", "5ª Classe", "6ª Classe"].includes(selectedClasse)) return PRIMARY_SUBJECTS;
    return DEFAULT_SUBJECTS;
  }, [selectedClasse]);

  const turmas = useMemo(() => ["Única", ...Array.from({ length: 26 }, (_, i) => `Turma ${String.fromCharCode(65 + i)}`)], []);
  const trimestres = ['1º Trimestre', '2º Trimestre', '3º Trimestre', 'PAUTA FINAL'];
  
  const documentos = [
    { label: 'Lista de Presença', icon: Calendar },
    { label: 'Pauta Trimestral', icon: ListChecks },
    { label: 'Boletim de Notas', icon: IdCard },
    { label: 'Estatísticas Gerais', icon: BarChart3 }
  ];

  const currentMonths = useMemo(() => trimesterMonths[selectedTrimestre] || [], [selectedTrimestre]);
  
  const isCompleteSelection = useMemo(() => {
    if (!selectedClasse || !selectedTurma) return false;
    if (isHighSchool && !selectedCurso) return false;
    if (isHigherEducation && (!selectedCurso || !selectedGrau)) return false;
    return true;
  }, [selectedClasse, selectedTurma, selectedCurso, selectedGrau, isHighSchool, isHigherEducation]);

  const alunos = useMemo(() => {
    if (!isCompleteSelection) return [];
    const key = `${selectedClasse.toUpperCase()}-${selectedTurma}`;
    return studentDatabase[key] || [];
  }, [selectedClasse, selectedTurma, isCompleteSelection]);
  
  const diasNoMes = useMemo(() => {
    const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const monthIdx = monthNames.indexOf(selectedMonth);
    const startYear = parseInt(selectedYear.split('/')[0]);
    const year = (monthIdx >= 8) ? startYear : startYear + 1;
    const daysCount = new Date(year, monthIdx + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [selectedMonth, selectedYear]);

  // Keys for Storage
  const storageKeyScores = useMemo(() => `sm_s_${schoolId}_${selectedYear}_${selectedClasse}_${selectedTurma}_${selectedTrimestre}`.replace(/\s+/g, '_'), [schoolId, selectedYear, selectedClasse, selectedTurma, selectedTrimestre]);
  const storageKeyAttendance = useMemo(() => `sm_att_${schoolId}_${selectedYear}_${selectedClasse}_${selectedTurma}_${selectedMonth}`.replace(/\s+/g, '_'), [schoolId, selectedYear, selectedClasse, selectedTurma, selectedMonth]);

  useEffect(() => {
    const savedScores = localStorage.getItem(storageKeyScores);
    setScores(savedScores ? JSON.parse(savedScores) : {});
  }, [storageKeyScores]);

  useEffect(() => {
    const savedAtt = localStorage.getItem(storageKeyAttendance);
    setAttendance(savedAtt ? JSON.parse(savedAtt) : {});
  }, [storageKeyAttendance]);

  const saveScores = (newData: Record<string, Record<string, number>>) => {
    setIsSaving(true);
    localStorage.setItem(storageKeyScores, JSON.stringify(newData));
    setTimeout(() => setIsSaving(false), 300);
  };

  const saveAttendance = (newData: Record<string, Record<string, AttendanceStatus>>) => {
    setIsSaving(true);
    localStorage.setItem(storageKeyAttendance, JSON.stringify(newData));
    setTimeout(() => setIsSaving(false), 300);
  };

  const toggleAttendance = (alunoId: string, dia: string) => {
    setAttendance(prev => {
      const alunoAtt = prev[alunoId] || {};
      const current = alunoAtt[dia];
      let next: AttendanceStatus = null;
      
      if (current === null) next = 'P';
      else if (current === 'P') next = 'F';
      else next = null;

      const updated = {
        ...prev,
        [alunoId]: { ...alunoAtt, [dia]: next }
      };
      saveAttendance(updated);
      return updated;
    });
  };

  const calculateAverage = (alunoId: string) => {
    const alunoScores = scores[alunoId] || {};
    const values = Object.values(alunoScores) as number[];
    if (values.length === 0) return 0;
    return (values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(1);
  };

  const getAttendanceStats = (alunoId: string) => {
    const alunoAtt = attendance[alunoId] || {};
    const values = Object.values(alunoAtt);
    return {
      presencas: values.filter(v => v === 'P').length,
      faltas: values.filter(v => v === 'F').length
    };
  };

  const statsData = useMemo(() => {
    const subjectStats = currentSubjects.map(sub => {
      let total = 0, count = 0;
      alunos.forEach(aluno => {
        const val = scores[aluno.id]?.[sub];
        if (typeof val === 'number') { total += val; count++; }
      });
      return { subject: sub, avg: count > 0 ? parseFloat((total / count).toFixed(1)) : 0 };
    });
    const passCount = alunos.filter(a => parseFloat(calculateAverage(a.id) as string) >= minPassingScore).length;
    const failCount = alunos.length - passCount;
    return { subjectStats, passCount, failCount };
  }, [alunos, scores, currentSubjects, minPassingScore]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleScoreChange = (alunoId: string, subject: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const boundedValue = Math.min(maxScore, Math.max(0, numValue));
    const newData = { ...scores, [alunoId]: { ...(scores[alunoId] || {}), [subject]: boundedValue } };
    setScores(newData);
    saveScores(newData);
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
    const headers = ["Nº", "ID", "Nome", ...currentSubjects, "Média"];
    const csvRows = alunos.map(aluno => {
      const values = [
        aluno.no, aluno.id, aluno.nome,
        ...currentSubjects.map(sub => scores[aluno.id]?.[sub] ?? '0'),
        calculateAverage(aluno.id)
      ];
      return values.join(',');
    });
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pauta_${selectedClasse}_${selectedTurma}.csv`;
    link.click();
  };

  const renderAttendance = () => (
    <div className="bg-[#111928] rounded-[4rem] border border-slate-800 shadow-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 print:bg-white print:text-black">
      {!isCompleteSelection ? (
        <div className="p-20 text-center opacity-40"><Search size={48} className="mx-auto mb-4" /><p className="text-sm font-black uppercase">Seleccione a Classe e a Turma para visualizar a lista</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 print:bg-slate-100">
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest w-16 sticky left-0 bg-[#111928] z-20">Nº</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[280px] sticky left-16 bg-[#111928] z-20">Nome Completo</th>
                {diasNoMes.map(d => (
                   <th key={d} className="px-1 py-6 text-[8px] font-black text-slate-500 uppercase text-center w-10 border-l border-slate-800/30">{d}</th>
                ))}
                <th className="px-3 py-6 text-[9px] font-black text-emerald-500 uppercase text-center w-14 border-l border-slate-800/30 sticky right-14 bg-[#111928] z-20">P</th>
                <th className="px-3 py-6 text-[9px] font-black text-rose-500 uppercase text-center w-14 border-l border-slate-800/30 sticky right-0 bg-[#111928] z-20">F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {alunos.map((aluno) => {
                const stats = getAttendanceStats(aluno.id);
                return (
                  <tr key={aluno.id} className="hover:bg-blue-600/5 transition-all group">
                    <td className="px-6 py-4 text-xs font-black text-slate-500 sticky left-0 bg-[#111928] z-10 group-hover:bg-slate-800">{aluno.no}</td>
                    <td className="px-6 py-4 text-xs font-black text-slate-200 uppercase sticky left-16 bg-[#111928] z-10 group-hover:bg-slate-800">{aluno.nome}</td>
                    {diasNoMes.map(d => {
                      const status = attendance[aluno.id]?.[d];
                      return (
                        <td key={d} className="px-0 py-2 border-l border-slate-800/30 text-center">
                          <button 
                            onClick={() => toggleAttendance(aluno.id, d)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${
                              status === 'P' ? 'bg-emerald-500 text-white shadow-lg' : 
                              status === 'F' ? 'bg-rose-500 text-white shadow-lg' : 
                              'bg-slate-800/20 text-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {status || <span className="text-[10px] opacity-10">.</span>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-4 border-l border-slate-800/30 text-center text-emerald-500 font-black text-[11px] bg-[#111928] sticky right-14 z-10 group-hover:bg-slate-800">{stats.presencas}</td>
                    <td className="px-3 py-4 border-l border-slate-800/30 text-center text-rose-500 font-black text-[11px] bg-[#111928] sticky right-0 z-10 group-hover:bg-slate-800">{stats.faltas}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPauta = () => (
    <div className="bg-[#111928] rounded-[4rem] border border-slate-800 shadow-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 print:bg-white print:text-black">
      {!isCompleteSelection ? (
        <div className="p-20 text-center opacity-40"><ListChecks size={48} className="mx-auto mb-4" /><p className="text-sm font-black uppercase">Seleccione a Classe e a Turma para visualizar a pauta</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 print:bg-slate-100">
                <th className="px-8 py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest w-20">Nº</th>
                <th className="px-8 py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest min-w-[280px]">Nome do Aluno</th>
                {currentSubjects.map(sub => <th key={sub} className="px-4 py-8 text-[10px] font-black text-slate-500 uppercase text-center border-l border-slate-800/30">{sub}</th>)}
                <th className="px-8 py-8 text-[11px] font-black text-blue-500 uppercase tracking-widest text-center border-l border-slate-800/30">Média</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {alunos.map((aluno) => {
                const avg = calculateAverage(aluno.id);
                return (
                  <tr key={aluno.id} className="hover:bg-blue-600/5 transition-all">
                    <td className="px-8 py-6 text-sm font-black text-slate-500">{aluno.no}</td>
                    <td className="px-8 py-6 text-base font-black text-slate-200 uppercase">{aluno.nome}</td>
                    {currentSubjects.map(sub => (
                      <td key={sub} className="px-2 py-6 border-l border-slate-800/30 text-center">
                        <input 
                          type="number" step="0.1" min="0" max={maxScore}
                          value={scores[aluno.id]?.[sub] ?? ''}
                          onChange={(e) => handleScoreChange(aluno.id, sub, e.target.value)}
                          className={`w-16 bg-slate-800/50 border border-slate-700 rounded-xl px-2 py-2 text-center text-sm font-black outline-none focus:border-blue-500 ${(scores[aluno.id]?.[sub] ?? 0) < minPassingScore ? 'text-rose-500' : 'text-emerald-500'}`}
                          placeholder="0.0"
                        />
                      </td>
                    ))}
                    <td className={`px-8 py-6 border-l border-slate-800/30 text-center text-lg font-black ${parseFloat(avg as string) >= minPassingScore ? 'text-blue-500' : 'text-rose-500'}`}>{avg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEstatisticas = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-[#111928] p-10 rounded-[4rem] border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-10 uppercase tracking-tight">Performance por Disciplina</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData.subjectStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
              <YAxis domain={[0, maxScore]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip contentStyle={{ backgroundColor: '#111928', border: '1px solid #1e293b', borderRadius: '12px' }} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                {statsData.subjectStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avg >= minPassingScore ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[#111928] p-10 rounded-[4rem] border border-slate-800 shadow-2xl flex flex-col items-center">
        <h3 className="text-xl font-black text-white mb-10 uppercase tracking-tight">Distribuição de Resultados</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: 'Aprovados', value: statsData.passCount }, { name: 'Reprovados', value: statsData.failCount }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#10b981" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111928', border: '1px solid #1e293b', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-10 mt-6">
           <div className="text-center"><p className="text-[10px] font-black text-slate-500 uppercase mb-1">Aprovados</p><p className="text-2xl font-black text-emerald-500">{statsData.passCount}</p></div>
           <div className="text-center"><p className="text-[10px] font-black text-slate-500 uppercase mb-1">Reprovados</p><p className="text-2xl font-black text-rose-500">{statsData.failCount}</p></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-[#050b18] flex flex-col animate-in fade-in duration-300 overflow-hidden font-['Inter'] text-slate-200 print:bg-white print:overflow-visible">
      <div className="px-10 py-8 space-y-6 shrink-0 relative z-[50] print:hidden">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative">
            <button onClick={() => toggleDropdown('year')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-4 min-w-[180px] hover:bg-[#232d41] transition-all">
              <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl"><CalendarDays size={20}/></div>
              <div className="flex-1 text-left"><p className="text-[9px] font-black text-slate-500 uppercase">Ano Lectivo</p><p className="text-sm font-black text-white uppercase">{selectedYear}</p></div>
              <ChevronDown size={18} className={`transition-transform ${openDropdown === 'year' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'year' && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-[#1a2333] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 max-h-[400px] flex flex-col z-[100]">
                {academicYears.map(year => <button key={year} onClick={() => { setSelectedYear(year); setOpenDropdown(null); }} className={`w-full text-left px-6 py-4 text-xs font-bold uppercase ${selectedYear === year ? 'bg-amber-600 text-white' : 'hover:bg-slate-800'}`}>{year}</button>)}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleDropdown('classe')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-4 min-w-[180px] hover:bg-[#232d41] transition-all">
              <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl"><GraduationCap size={20}/></div>
              <div className="flex-1 text-left"><p className="text-[9px] font-black text-slate-500 uppercase">Classe</p><p className="text-sm font-black text-white uppercase truncate max-w-[120px]">{selectedClasse || 'Seleccionar'}</p></div>
              <ChevronDown size={18} className={`transition-transform ${openDropdown === 'classe' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'classe' && (
              <div className="absolute top-full left-0 mt-3 w-72 bg-[#1a2333] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
                {classes.map(item => <button key={item} onClick={() => { setSelectedClasse(item); setSelectedCurso(''); setSelectedGrau(''); setOpenDropdown(null); }} className={`w-full text-left px-6 py-4 text-xs font-bold uppercase hover:bg-blue-600`}>{item}</button>)}
              </div>
            )}
          </div>

          {(isHighSchool || isHigherEducation) && (
            <div className="relative">
              <button onClick={() => toggleDropdown('curso')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-4 min-w-[200px] hover:bg-[#232d41] transition-all">
                <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-xl"><Briefcase size={20}/></div>
                <div className="flex-1 text-left"><p className="text-[9px] font-black text-slate-500 uppercase">Curso</p><p className="text-sm font-black text-white uppercase truncate max-w-[140px]">{selectedCurso || 'Seleccionar'}</p></div>
                <ChevronDown size={18} className={`transition-transform ${openDropdown === 'curso' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'curso' && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-[#1a2333] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
                  {(isHighSchool ? ENSINO_MEDIO_CURSOS : ENSINO_SUPERIOR_CURSOS).map(item => <button key={item} onClick={() => { setSelectedCurso(item); setOpenDropdown(null); }} className={`w-full text-left px-6 py-4 text-xs font-bold uppercase hover:bg-indigo-600`}>{item}</button>)}
                </div>
              )}
            </div>
          )}

          {isHigherEducation && (
            <div className="relative">
              <button onClick={() => toggleDropdown('grau')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-4 min-w-[180px] hover:bg-[#232d41] transition-all">
                <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl"><DegreeIcon size={20}/></div>
                <div className="flex-1 text-left"><p className="text-[9px] font-black text-slate-500 uppercase">Grau</p><p className="text-sm font-black text-white uppercase truncate max-w-[120px]">{selectedGrau || 'Seleccionar'}</p></div>
                <ChevronDown size={18} className={`transition-transform ${openDropdown === 'grau' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'grau' && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-[#1a2333] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                  {GRAUS_ACADEMICOS.map(item => <button key={item} onClick={() => { setSelectedGrau(item); setOpenDropdown(null); }} className={`w-full text-left px-6 py-4 text-xs font-bold uppercase hover:bg-emerald-600`}>{item}</button>)}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button onClick={() => toggleDropdown('turma')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-6 py-3 flex items-center gap-4 min-w-[160px] hover:bg-[#232d41] transition-all">
              <div className="bg-rose-500/20 text-rose-400 p-2 rounded-xl"><Laptop size={20}/></div>
              <div className="flex-1 text-left"><p className="text-[9px] font-black text-slate-500 uppercase">Turma</p><p className="text-sm font-black text-white uppercase">{selectedTurma || 'Seleccionar'}</p></div>
              <ChevronDown size={18} className={`transition-transform ${openDropdown === 'turma' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'turma' && (
              <div className="absolute top-full left-0 mt-3 w-48 bg-[#1a2333] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[300px] overflow-y-auto">
                {turmas.map(item => <button key={item} onClick={() => { setSelectedTurma(item); setOpenDropdown(null); }} className={`w-full text-left px-6 py-4 text-xs font-bold uppercase hover:bg-rose-600`}>{item}</button>)}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button onClick={onClose} className="p-4 bg-slate-800/50 hover:bg-rose-500 text-slate-400 hover:text-white rounded-2xl transition-all shadow-lg"><X size={24}/></button>
          </div>
        </div>

        <div className="bg-[#1a2333]/50 p-1.5 rounded-2xl flex gap-1 w-fit border border-slate-700/30">
          {trimestres.map(t => (
            <button key={t} onClick={() => setSelectedTrimestre(t)} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all ${selectedTrimestre === t ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-700/30'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-[#0b1221] p-10 overflow-y-auto custom-scrollbar border-t border-slate-800/50 print:bg-white print:p-0 print:border-none">
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20 print:pb-0">
          <div className="bg-[#111928] p-8 rounded-[3rem] border border-slate-800 flex flex-wrap items-center justify-between gap-6 shadow-2xl print:hidden">
            <div className="relative">
              <button onClick={() => toggleDropdown('doc')} className="bg-[#1a2333] border border-slate-700/50 rounded-2xl px-8 py-4 flex items-center gap-5 min-w-[320px] shadow-lg">
                <div className="text-blue-500"><selectedDoc.icon size={24}/></div>
                <div className="flex-1 text-left"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Documento Ativo</p><p className="text-base font-black text-white">{selectedDoc.label}</p></div>
                <ChevronDown size={22} className={`text-slate-500 transition-transform ${openDropdown === 'doc' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'doc' && (
                <div className="absolute top-full left-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] py-3">
                  {documentos.map((doc) => (
                    <button key={doc.label} onClick={() => { setSelectedDoc(doc); setOpenDropdown(null); }} className={`w-full flex items-center gap-4 px-8 py-5 text-left ${selectedDoc.label === doc.label ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <doc.icon size={20} /><span className="text-sm font-black">{doc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-5">
              <button onClick={handlePrint} className="flex items-center gap-3 px-10 py-4 bg-slate-800 text-slate-300 rounded-[1.5rem] text-xs font-black uppercase hover:bg-slate-700 border border-slate-700"><Printer size={20}/> Imprimir</button>
              <button onClick={handleExport} className="flex items-center gap-4 px-12 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase shadow-xl hover:bg-blue-700"><FileOutput size={20}/> Exportar CSV</button>
            </div>
          </div>

          {selectedDoc.label === 'Lista de Presença' && isCompleteSelection && (
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-left-4 print:hidden">
              {currentMonths.map(mes => <button key={mes} onClick={() => setSelectedMonth(mes)} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border-2 transition-all ${selectedMonth === mes ? 'bg-white text-[#050b18] border-white shadow-xl' : 'bg-[#111928] border-slate-800 text-slate-500 hover:text-slate-300'}`}>{mes}</button>)}
            </div>
          )}

          {selectedDoc.label === 'Lista de Presença' && renderAttendance()}
          {selectedDoc.label === 'Pauta Trimestral' && renderPauta()}
          {selectedDoc.label === 'Estatísticas Gerais' && isCompleteSelection && renderEstatisticas()}

          {isCompleteSelection && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
               <div className="bg-[#111928] p-10 rounded-[3rem] border border-slate-800 flex items-center gap-8 group">
                  <div className="p-5 bg-blue-500/10 text-blue-500 rounded-[1.5rem] shadow-inner"><Users size={32}/></div>
                  <div><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Turma Ativa</p><p className="text-3xl font-black text-white">{alunos.length} Alunos</p></div>
               </div>
               <div className="bg-[#111928] p-10 rounded-[3rem] border border-slate-800 flex items-center gap-8 group">
                  <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-[1.5rem] shadow-inner"><TrendingUp size={32}/></div>
                  <div><p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Aproveitamento Médio</p><p className="text-3xl font-black text-white">{alunos.length > 0 ? Math.round((statsData.passCount / alunos.length) * 100) : 0}%</p></div>
               </div>
               <div className="bg-blue-600 p-10 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform"></div>
                  <div className="relative z-10"><p className="text-[11px] font-black opacity-60 uppercase tracking-widest mb-2">Protocolo</p><p className="text-xl font-black uppercase tracking-tight">Criptografia SM@ Ativa</p></div>
                  <LayoutGrid size={48} className="relative z-10 opacity-30"/>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicManagementSystem;
