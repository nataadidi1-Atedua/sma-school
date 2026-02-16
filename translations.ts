
import { Language } from './types';

export const translations: Record<Language, any> = {
  en: {
    nav: { 
      dashboard: 'Dashboard', schools: 'My Schools', 
      schoolDirector: 'School Director', pedagogicalDirector: 'Pedagogical Director',
      students: 'Students', 
      staff: 'Staff & Teachers', managers: 'Managers', secretary: 'Secretary',
      finance: 'Finances', academics: 'Academics', 
      classes: 'Classes & Rooms', grades: 'Grade System', analytics: 'Analytics', 
      ai: 'AI Assistant', settings: 'Settings', logout: 'Logout' 
    },
    header: { search: 'Search everything...', admin: 'Administrator', login: 'Login', signup: 'Sign Up', studioAccess: 'Studio Authorized', voiceSearch: 'Speak command...' },
    login: { welcome: 'Welcome Back', register: 'Create Account', subtitle: 'Manage your academy with precision.', email: 'Email', password: 'Password', signin: 'Sign In', signup: 'Sign Up', forgot: 'Forgot password?', brand: 'School Manager Academy', schoolName: 'Institution Name', studioLogin: 'Login to AI Studio', studioDesc: 'Access flagship resources' },
    schools: { 
      title: 'Schools Directory', 
      subtitle: 'Manage your global network of educational institutions.', 
      add: 'Add New School', 
      searchPlaceholder: 'Search schools by name or location...', 
      manageResources: 'Manage Resources',
      editName: 'Rename Institution',
      save: 'Save Changes',
      cancel: 'Cancel'
    },
    grades: { title: 'Academic Grading', subtitle: 'Evaluation portal for faculty and students.', save: 'Update Grades', report: 'Gen Report' },
    classes: { title: 'Schedules & Rooms', subtitle: 'Manage weekly timetables and physical assets.' },
    ai_welcome: 'Hello! I am your assistant.'
  },
  pt: {
    nav: { 
      dashboard: 'Painel', schools: 'Minhas Escolas', 
      schoolDirector: 'Director Escolar', pedagogicalDirector: 'Director Pedagógico',
      students: 'Estudantes', 
      staff: 'Equipe e Professores', managers: 'Gestores', secretary: 'Secretaria',
      finance: 'Finanças', academics: 'Acadêmico', 
      classes: 'Turmas e Salas', grades: 'Sistema de Notas', analytics: 'Análises', 
      ai: 'Assistente IA', settings: 'Configurações', logout: 'Sair' 
    },
    header: { search: 'Buscar tudo (Alunos, Professores, Escolas)...', admin: 'Administrador', login: 'Entrar', signup: 'Cadastrar', studioAccess: 'Estúdio Autorizado', voiceSearch: 'Falar comando...' },
    login: { welcome: 'Bem-vindo de Volta', register: 'Criar Conta', subtitle: 'Gerencie sua academia com precisão.', email: 'E-mail', password: 'Senha', signin: 'Entrar', signup: 'Cadastrar-se', forgot: 'Esqueceu a senha?', brand: 'School Manager Academy', schoolName: 'Nome da Instituição', studioLogin: 'Login no Estúdio IA', studioDesc: 'Acesse recursos exclusivos' },
    schools: { 
      title: 'Diretório de Escolas', 
      subtitle: 'Gerencie sua rede global de instituições de ensino.', 
      add: 'Add Escola', 
      searchPlaceholder: 'Buscar escolas por nome ou localização...', 
      manageResources: 'Gerir Recursos',
      editName: 'Renombrar Instituição',
      save: 'Salvar',
      cancel: 'Cancelar'
    },
    grades: { title: 'Notas Acadêmicas', subtitle: 'Portal de avaliação para professores e alunos.', save: 'Atualizar Notas', report: 'Gerar Boletim' },
    classes: { title: 'Horários e Salas', subtitle: 'Gerencie o cronograma semanal e espaços físicos.' },
    ai_welcome: 'Olá! Eu sou seu assistente.'
  },
  es: {
    nav: { dashboard: 'Tablero', schools: 'Mis Escuelas', schoolDirector: 'Director Escolar', pedagogicalDirector: 'Director Pedagógico', students: 'Estudiantes', staff: 'Personal y Profesores', managers: 'Gestores', secretary: 'Secretaría', finance: 'Finanzas', academics: 'Académico', classes: 'Clases y Aulas', grades: 'Sistema de Notas', analytics: 'Analítica', ai: 'Asistente IA', settings: 'Configuración', logout: 'Cerrar Sesión' },
    header: { search: 'Buscar todo...', admin: 'Administrador', login: 'Entrar', signup: 'Registrarse', studioAccess: 'Estudio Autorizado', voiceSearch: 'Hablar comando...' },
    login: { welcome: 'Bienvenido de Nuevo', register: 'Crear Conta', subtitle: 'Administre su academia con precisión.', email: 'Correo', password: 'Contraseña', signin: 'Entrar', signup: 'Registrarse', forgot: '¿Olvidó su contraseña?', brand: 'School Manager Academy', schoolName: 'Nombre de la Institución', studioLogin: 'Login en AI Studio', studioDesc: 'Acceda a recursos exclusivos' },
    schools: { title: 'Directorio de Escolas', subtitle: 'Gestione su red global.', add: 'Añadir Escola', searchPlaceholder: 'Buscar...', manageResources: 'Gestionar', editName: 'Renombrar', save: 'Guardar', cancel: 'Cancelar' },
    grades: { title: 'Calificaciones', subtitle: 'Portal de evaluación.', save: 'Atualizar', report: 'Informe' },
    classes: { title: 'Horarios', subtitle: 'Gestione cronogramas.' },
    ai_welcome: '¡Hola! Soy tu asistente.'
  },
  fr: {
    nav: { dashboard: 'Tableau de bord', schools: 'Mes Écoles', schoolDirector: 'Directeur d\'école', pedagogicalDirector: 'Directeur pédagogique', students: 'Étudiants', staff: 'Personnel', managers: 'Gestionnaires', secretary: 'Secrétariat', finance: 'Finances', academics: 'Académique', classes: 'Classes', grades: 'Notes', analytics: 'Analytique', ai: 'Assistant IA', settings: 'Paramètres', logout: 'Déconnexion' },
    header: { search: 'Rechercher...', admin: 'Administrateur', login: 'Connexion', signup: 'Inscription', studioAccess: 'Studio Autorisé', voiceSearch: 'Commande vocale...' },
    login: { welcome: 'Bon retour', register: 'Créer un compte', subtitle: 'Gérez votre académie avec précision.', email: 'Email', password: 'Mot de passe', signin: 'Se connecter', signup: 'S\'inscrire', forgot: 'Mot de passe oublié ?', brand: 'School Manager Academy', schoolName: 'Nom de l\'établissement', studioLogin: 'Connexion AI Studio', studioDesc: 'Accéder aux ressources phares' },
    schools: { title: 'Répertoire des écoles', subtitle: 'Gérez votre réseau mondial.', add: 'Ajouter une école', searchPlaceholder: 'Rechercher...', manageResources: 'Gérer les ressources', editName: 'Renommer', save: 'Sauvegarder', cancel: 'Annuler' },
    grades: { title: 'Notes académiques', subtitle: 'Portail d\'évaluation.', save: 'Mettre à jour', report: 'Générer rapport' },
    classes: { title: 'Emplois du tempo', subtitle: 'Gérez les horaires.' },
    ai_welcome: 'Bonjour ! Je suis votre assistant.'
  },
  zh: {
    nav: { dashboard: '仪表板', schools: '我的学校', schoolDirector: '校长', pedagogicalDirector: '教学总监', students: '学生', staff: '教职员工', managers: '经理', secretary: '秘书处', finance: '财务', academics: '学术', classes: '课程与教室', grades: '评分系统', analytics: '分析', ai: 'AI 助手', settings: '设置', logout: '登出' },
    header: { search: '搜索...', admin: '管理员', login: '登录', signup: '注册', studioAccess: 'Studio 已授权', voiceSearch: '语音命令...' },
    login: { welcome: '欢迎回来', register: '创建账户', subtitle: '精准管理您的学院。', email: '电子邮箱', password: '密码', signin: '登录', signup: '注册', forgot: '忘记密码？', brand: 'School Manager Academy', schoolName: '机构名称', studioLogin: '登录 AI Studio', studioDesc: '访问旗舰资源' },
    schools: { title: '学校名录', subtitle: '管理您的全球教育网络。', add: '添加新学校', searchPlaceholder: '搜索学校...', manageResources: '管理资源', editName: '重命名机构', save: '保存', cancel: '取消' },
    grades: { title: '学术评分', subtitle: '评估门户。', save: '更新评分', report: '生成报告' },
    classes: { title: '日程与教室', subtitle: '管理每周时间表。' },
    ai_welcome: '你好！我是你的助手。'
  },
  ja: {
    nav: { dashboard: 'ダッシュボード', schools: '私の学校', schoolDirector: '校長', pedagogicalDirector: '教务部长', students: '学生', staff: 'スタッフと教師', managers: 'マネージャー', secretary: '事務局', finance: '財務', academics: '教務', classes: 'クラスと教室', grades: '成績システム', analytics: '分析', ai: 'AI アシスタント', settings: '設定', logout: 'ログアウト' },
    header: { search: 'すべてを検索...', admin: '管理者', login: 'ログイン', signup: 'サインアップ', studioAccess: 'Studio 承認済み', voiceSearch: '音声コマンド...' },
    login: { welcome: 'おかえりなさい', register: 'アカウント作成', subtitle: '精度高くアカデミーを管理します。', email: 'メール', password: 'パワード', signin: 'サインイン', signup: 'サインアップ', forgot: 'パドを忘れましたか？', brand: 'School Manager Academy', schoolName: '教育機関名', studioLogin: 'AI Studio ログイン', studioDesc: '主要リソースへのアクセス' },
    schools: { title: '学校ディレクトリ', subtitle: 'グローバルな教育ネットワークを管理します。', add: '新しい学校を追加', searchPlaceholder: '学校を検索...', manageResources: 'リソース管理', editName: '機関名を変更', save: '保存', cancel: 'キャンセル' },
    grades: { title: '成績管理', subtitle: '評価ポータル。', save: '成績を更新', report: 'レポート作成' },
    classes: { title: 'スケジュールと教室', subtitle: '週間時間割を管理します。' },
    ai_welcome: 'こんにちは！私はあなたのアシスタントです。'
  },
  ru: {
    nav: { dashboard: 'Панель управления', schools: 'Мои школы', schoolDirector: 'Директор школы', pedagogicalDirector: 'Педагогический директор', students: 'Студенты', staff: 'Персонал и учителя', managers: 'Менеджеры', secretary: 'Секретариат', finance: 'Финансы', academics: 'Академический', classes: 'Классы и комнаты', grades: 'Система оценок', analytics: 'Аналитика', ai: 'ИИ Помощник', settings: 'Настройки', logout: 'Выйти' },
    header: { search: 'Искать везде...', admin: 'Администратор', login: 'Вход', signup: 'Регистраcia', studioAccess: 'Студия авторизована', voiceSearch: 'Голосовая команда...' },
    login: { welcome: 'С возвращением', register: 'Создать аккаунт', subtitle: 'Управляйте своей академией с точностью.', email: 'Эл. почта', password: 'Пароль', signin: 'Войти', signup: 'Зарегистрироваться', forgot: 'Забыли пароль?', brand: 'School Manager Academy', schoolName: 'Название учреждения', studioLogin: 'Вход в AI Studio', studioDesc: 'Доступ к флагманским ресурсам' },
    schools: { title: 'Каталог школ', subtitle: 'Управляйте своей глобальной сетью.', add: 'Добавить школу', searchPlaceholder: 'Поиск школ...', manageResources: 'Управление ресурсами', editName: 'Переименовать', save: 'Сохранить', cancel: 'Отмена' },
    grades: { title: 'Академические оценки', subtitle: 'Портал оценки.', save: 'Обновить оценки', report: 'Отчет' },
    classes: { title: 'Расписание и комнаты', subtitle: 'Управление недельным графиком.' },
    ai_welcome: 'Привет! Я ваш помощник.'
  },
  de: {
    nav: { dashboard: 'Dashboard', schools: 'Meine Schulen', schoolDirector: 'Schuldirektor', pedagogicalDirector: 'Pädagogischer Leiter', students: 'Schüler', staff: 'Personal & Lehrer', managers: 'Manager', secretary: 'Sekretariat', finance: 'Finanzen', academics: 'Akademisch', classes: 'Klassen & Räume', grades: 'Notensystem', analytics: 'Analysen', ai: 'KI-Assistent', settings: 'Einstellungen', logout: 'Abmelden' },
    header: { search: 'Alles suchen...', admin: 'Administrator', login: 'Anmelden', signup: 'Registrieren', studioAccess: 'Studio autorisiert', voiceSearch: 'Sprachbefehl...' },
    login: { welcome: 'Willkommen zurück', register: 'Konto erstellen', subtitle: 'Verwalten Sie Ihre Akademie mit Präzision.', email: 'E-Mail', password: 'Passwort', signin: 'Anmelden', signup: 'Registrieren', forgot: 'Passwort vergessen?', brand: 'School Manager Academy', schoolName: 'Name der Institution', studioLogin: 'KI-Studio Login', studioDesc: 'Zugriff auf Flaggschiff-Ressourcen' },
    schools: { title: 'Schulverzeichnis', subtitle: 'Verwalten Sie Ihr globales Netzwerk.', add: 'Neue Schule hinzufügen', searchPlaceholder: 'Schulen suchen...', manageResources: 'Ressourcen verwalten', editName: 'Institution umbenennen', save: 'Änderungen speichern', cancel: 'Abbrechen' },
    grades: { title: 'Akademische Noten', subtitle: 'Bewertungsportal.', save: 'Noten aktualisieren', report: 'Bericht erstellen' },
    classes: { title: 'Zeitpläne & Räume', subtitle: 'Wochenpläne verwalten.' },
    ai_welcome: 'Hallo! Ich bin Ihr Assistent.'
  },
  it: {
    nav: { dashboard: 'Dashboard', schools: 'Le mie scuole', schoolDirector: 'Direttore Scolastico', pedagogicalDirector: 'Direttore Pedagogico', students: 'Studenti', staff: 'Personale e insegnanti', managers: 'Manager', secretary: 'Segreteria', finance: 'Finanze', academics: 'Accademico', classes: 'Classi e aule', grades: 'Sistema voti', analytics: 'Analisi', ai: 'Assistente IA', settings: 'Impostazioni', logout: 'Esci' },
    header: { search: 'Cerca tutto...', admin: 'Amministratore', login: 'Accedi', signup: 'Registrati', studioAccess: 'Studio autorizzato', voiceSearch: 'Comando vocale...' },
    login: { welcome: 'Bentornato', register: 'Crea account', subtitle: 'Gestisci la tua accademia con precisione.', email: 'Email', password: 'Password', signin: 'Accedi', signup: 'Registrati', forgot: 'Password dimenticata?', brand: 'School Manager Academy', schoolName: 'Nome istituto', studioLogin: 'Login AI Studio', studioDesc: 'Accedi alle risorse principali' },
    schools: { title: 'Elenco scuole', subtitle: 'Gestisci la tua rete globale.', add: 'Aggiungi scuola', searchPlaceholder: 'Cerca scuole...', manageResources: 'Gestisci risorse', editName: 'Rinomina istituto', save: 'Salva', cancel: 'Annulla' },
    grades: { title: 'Voti accademici', subtitle: 'Portale di valutazione.', save: 'Aggiorna voti', report: 'Genera report' },
    classes: { title: 'Orari e aule', subtitle: 'Gestisci gli orari.' },
    ai_welcome: 'Ciao! Sono il tuo assistente.'
  },
  ar: {
    nav: { dashboard: 'لوحة القيادة', schools: 'مدارسي', schoolDirector: 'مدير المدرسة', pedagogicalDirector: 'مدير تربوي', students: 'الطلاب', staff: 'الموظفين والمعلمين', managers: 'المدراء', secretary: 'السكرتارية', finance: 'المالية', academics: 'الأكاديمية', classes: 'الفصول والقاعات', grades: 'نظام الدرجات', analytics: 'التحليلات', ai: 'مساعد الذكاء الاصطناعي', settings: 'الإعدادات', logout: 'تسجيل الخروج' },
    header: { search: 'بحث في كل شيء...', admin: 'المدير', login: 'تسجيل الدخول', signup: 'إنشاء حساب', studioAccess: 'تم ترخيص الاستوديو', voiceSearch: 'أمر صوتio...' },
    login: { welcome: 'مرحباً بعودتك', register: 'إنشاء حساب', subtitle: 'إدارة أكاديميتك بدقة.', email: 'البريد الإلكتروني', password: 'كلمة المرور', signin: 'تسجيل الدخول', signup: 'اشتراك', forgot: 'نسيت كلمة المرور؟', brand: 'School Manager Academy', schoolName: 'اسم المؤسسة', studioLogin: 'دخول استوديو الذكاء الاصطناعي', studioDesc: 'الوصول إلى الموارد الرئيسية' },
    schools: { title: 'دليل المدارس', subtitle: 'إدارة شبكتك العالمية.', add: 'إضافة مدرسة', searchPlaceholder: 'بحث عن المدارس...', manageResources: 'إدارة الموارد', editName: 'تعديل الاسم', save: 'حفظ التغييرات', cancel: 'إلغاء' },
    grades: { title: 'الدرجات الأكاديمية', subtitle: 'بوابة التقييم.', save: 'تحديث الدرجات', report: 'تقرير' },
    classes: { title: 'الجداول والقاعات', subtitle: 'إدارة الجداول الأسبوعية.' },
    ai_welcome: 'مرحباً! أنا مساعدك.'
  }
};
