export type Language = "pt" | "en";

export interface Translations {
  // App
  appName: string;
  appTagline: string;
  loading: string;
  error: string;
  retry: string;
  cancel: string;
  confirm: string;
  close: string;
  save: string;
  back: string;
  next: string;
  done: string;
  seeAll: string;
  submit: string;
  search: string;
  searchPlaceholder: string;
  yes: string;
  no: string;
  optional: string;

  // Auth
  authWelcome: string;
  authTagline: string;
  authPhone: string;
  authPhonePlaceholder: string;
  authBiNumber: string;
  authBiNumberPlaceholder: string;
  authFullName: string;
  authFullNamePlaceholder: string;
  authLogin: string;
  authRegister: string;
  authNoAccount: string;
  authHaveAccount: string;
  authOtpSent: (phone: string) => string;
  authOtpEnter: string;
  authOtpVerify: string;
  authOtpResend: string;
  authWard: string;
  authSelectWard: string;

  // Tabs
  tabHome: string;
  tabMap: string;
  tabReport: string;
  tabServices: string;
  tabProfile: string;

  // Home
  homeGreeting: (name: string) => string;
  homeMyCity: string;
  homeReportIssue: string;
  homeViewMap: string;
  homeMyReports: string;
  homeServices: string;
  homeRecentActivity: string;
  homeOpenIssues: string;
  homeResolvedToday: string;
  homeActiveReports: string;
  homeNewsTitle: string;
  homeQuickActions: string;

  // Report Categories
  catRoads: string;
  catLighting: string;
  catWater: string;
  catWaste: string;
  catSafety: string;
  catOther: string;

  // Report statuses
  statusSubmitted: string;
  statusUnderReview: string;
  statusInProgress: string;
  statusResolved: string;
  statusClosed: string;
  statusRejected: string;

  // Submit Report
  reportTitle: string;
  reportSelectCategory: string;
  reportCategory: string;
  reportIssueName: string;
  reportIssueNamePlaceholder: string;
  reportDescription: string;
  reportDescriptionPlaceholder: string;
  reportAddPhoto: string;
  reportTakePhoto: string;
  reportChoosePhoto: string;
  reportLocation: string;
  reportUseMyLocation: string;
  reportSelectOnMap: string;
  reportAddress: string;
  reportAddressPlaceholder: string;
  reportSubmitBtn: string;
  reportSuccess: string;
  reportSuccessDesc: string;
  reportRefNumber: string;

  // My Reports
  myReportsTitle: string;
  myReportsEmpty: string;
  myReportsEmptyDesc: string;
  myReportsSubmitFirst: string;
  myReportsUpdatedOn: string;
  myReportsTimeline: string;

  // Map
  mapTitle: string;
  mapFilterAll: string;
  mapIssuesNearby: (n: number) => string;
  mapViewReport: string;
  mapLegend: string;

  // Services
  servicesTitle: string;
  servicesDesc: string;
  servicesPayFee: string;
  servicesRequestDoc: string;
  servicesDirectory: string;
  servicesIdWallet: string;
  servicesElections: string;
  servicesContactUs: string;
  servicesPayTitle: string;
  servicesPayAmount: string;
  servicesPayReference: string;
  servicesPaySuccess: string;
  servicesDocRequest: string;
  servicesDocType: string;
  servicesDocSubmit: string;

  // Elections
  electionsTitle: string;
  electionsDesc: string;
  electionsCurrentCycle: string;
  electionsDate: string;
  electionsType: string;
  electionsCandidates: string;
  electionsPollingStation: string;
  electionsHowToVote: string;
  electionsRegistered: string;

  // Digital ID
  idTitle: string;
  idDesc: string;
  idBiNumber: string;
  idFullName: string;
  idDateOfBirth: string;
  idIssueDate: string;
  idExpiry: string;
  idWard: string;
  idDownload: string;
  idShare: string;

  // Profile
  profileTitle: string;
  profilePersonal: string;
  profileLanguage: string;
  profileLanguageDesc: string;
  profileNotifications: string;
  profileSecurity: string;
  profileAbout: string;
  profileVersion: string;
  profileLogout: string;
  profileLogoutConfirm: string;
  profilePrivacy: string;
  profileTerms: string;
  profileSupport: string;
  profileTotalReports: string;
  profileResolvedReports: string;
  profileMemberSince: string;

  // Districts / Wards
  wardMaianga: string;
  wardIngombota: string;
  wardSambizanga: string;
  wardRangel: string;
  wardKilamba: string;
  wardCazenga: string;
  wardViana: string;
  wardBelas: string;

  // Language
  langPortuguese: string;
  langEnglish: string;
}

export const pt: Translations = {
  appName: "LuandaGov",
  appTagline: "A sua cidade, a sua voz",
  loading: "A carregar...",
  error: "Ocorreu um erro",
  retry: "Tentar novamente",
  cancel: "Cancelar",
  confirm: "Confirmar",
  close: "Fechar",
  save: "Guardar",
  back: "Voltar",
  next: "Seguinte",
  done: "Concluído",
  seeAll: "Ver tudo",
  submit: "Enviar",
  search: "Pesquisar",
  searchPlaceholder: "Pesquisar serviços...",
  yes: "Sim",
  no: "Não",
  optional: "opcional",

  authWelcome: "Bem-vindo ao LuandaGov",
  authTagline: "Serviços municipais na sua mão",
  authPhone: "Número de Telefone",
  authPhonePlaceholder: "+244 9XX XXX XXX",
  authBiNumber: "Número do BI",
  authBiNumberPlaceholder: "000000000LA000",
  authFullName: "Nome Completo",
  authFullNamePlaceholder: "Como aparece no BI",
  authLogin: "Entrar",
  authRegister: "Criar Conta",
  authNoAccount: "Não tem conta?",
  authHaveAccount: "Já tem conta?",
  authOtpSent: (phone) => `Código enviado para ${phone}`,
  authOtpEnter: "Introduza o código de 6 dígitos",
  authOtpVerify: "Verificar",
  authOtpResend: "Reenviar código",
  authWard: "Município",
  authSelectWard: "Selecionar município",

  tabHome: "Início",
  tabMap: "Mapa",
  tabReport: "Reportar",
  tabServices: "Serviços",
  tabProfile: "Perfil",

  homeGreeting: (name) => `Olá, ${name}`,
  homeMyCity: "A minha cidade",
  homeReportIssue: "Reportar problema",
  homeViewMap: "Ver mapa",
  homeMyReports: "Os meus reportes",
  homeServices: "Serviços",
  homeRecentActivity: "Actividade recente",
  homeOpenIssues: "Problemas abertos",
  homeResolvedToday: "Resolvidos hoje",
  homeActiveReports: "Reportes activos",
  homeNewsTitle: "Notícias municipais",
  homeQuickActions: "Acções rápidas",

  catRoads: "Estradas",
  catLighting: "Iluminação",
  catWater: "Água",
  catWaste: "Lixo",
  catSafety: "Segurança",
  catOther: "Outros",

  statusSubmitted: "Submetido",
  statusUnderReview: "Em análise",
  statusInProgress: "Em curso",
  statusResolved: "Resolvido",
  statusClosed: "Encerrado",
  statusRejected: "Rejeitado",

  reportTitle: "Reportar Problema",
  reportSelectCategory: "Selecionar categoria",
  reportCategory: "Categoria",
  reportIssueName: "Título do problema",
  reportIssueNamePlaceholder: "Ex: Buraco na Av. 4 de Fevereiro",
  reportDescription: "Descrição",
  reportDescriptionPlaceholder: "Descreva o problema em detalhe...",
  reportAddPhoto: "Adicionar foto",
  reportTakePhoto: "Tirar foto",
  reportChoosePhoto: "Escolher da galeria",
  reportLocation: "Localização",
  reportUseMyLocation: "Usar a minha localização",
  reportSelectOnMap: "Seleccionar no mapa",
  reportAddress: "Endereço",
  reportAddressPlaceholder: "Ex: Av. Lenine, Maianga",
  reportSubmitBtn: "Submeter Reporte",
  reportSuccess: "Reporte Submetido!",
  reportSuccessDesc: "O seu reporte foi recebido e será analisado em breve.",
  reportRefNumber: "Número de referência",

  myReportsTitle: "Os Meus Reportes",
  myReportsEmpty: "Nenhum reporte ainda",
  myReportsEmptyDesc: "Os seus reportes de problemas aparecerão aqui",
  myReportsSubmitFirst: "Submeter primeiro reporte",
  myReportsUpdatedOn: "Actualizado em",
  myReportsTimeline: "Histórico",

  mapTitle: "Mapa de Problemas",
  mapFilterAll: "Todos",
  mapIssuesNearby: (n) => `${n} problemas na sua área`,
  mapViewReport: "Ver reporte",
  mapLegend: "Legenda",

  servicesTitle: "Serviços Municipais",
  servicesDesc: "Acesso digital aos serviços da Câmara de Luanda",
  servicesPayFee: "Pagar Taxa",
  servicesRequestDoc: "Pedir Documento",
  servicesDirectory: "Directório",
  servicesIdWallet: "BI Digital",
  servicesElections: "Eleições",
  servicesContactUs: "Contacte-nos",
  servicesPayTitle: "Pagamento de Taxa",
  servicesPayAmount: "Valor",
  servicesPayReference: "Referência",
  servicesPaySuccess: "Pagamento efectuado!",
  servicesDocRequest: "Pedido de Documento",
  servicesDocType: "Tipo de documento",
  servicesDocSubmit: "Submeter pedido",

  electionsTitle: "Informação Eleitoral",
  electionsDesc: "Informação sobre eleições e candidatos",
  electionsCurrentCycle: "Eleições em curso",
  electionsDate: "Data",
  electionsType: "Tipo",
  electionsCandidates: "Candidatos",
  electionsPollingStation: "Local de voto",
  electionsHowToVote: "Como votar",
  electionsRegistered: "Recenseado",

  idTitle: "BI Digital",
  idDesc: "O seu Bilhete de Identidade digital",
  idBiNumber: "Nº do BI",
  idFullName: "Nome Completo",
  idDateOfBirth: "Data de nascimento",
  idIssueDate: "Data de emissão",
  idExpiry: "Validade",
  idWard: "Município",
  idDownload: "Descarregar",
  idShare: "Partilhar",

  profileTitle: "Perfil",
  profilePersonal: "Informações pessoais",
  profileLanguage: "Idioma",
  profileLanguageDesc: "Escolha o idioma da aplicação",
  profileNotifications: "Notificações",
  profileSecurity: "Segurança",
  profileAbout: "Sobre",
  profileVersion: "Versão",
  profileLogout: "Terminar Sessão",
  profileLogoutConfirm: "Tem a certeza que quer sair?",
  profilePrivacy: "Privacidade",
  profileTerms: "Termos",
  profileSupport: "Suporte",
  profileTotalReports: "Total de reportes",
  profileResolvedReports: "Resolvidos",
  profileMemberSince: "Membro desde",

  wardMaianga: "Maianga",
  wardIngombota: "Ingombota",
  wardSambizanga: "Sambizanga",
  wardRangel: "Rangel",
  wardKilamba: "Kilamba Kiaxi",
  wardCazenga: "Cazenga",
  wardViana: "Viana",
  wardBelas: "Belas",

  langPortuguese: "Português",
  langEnglish: "Inglês",
};

export const en: Translations = {
  appName: "LuandaGov",
  appTagline: "Your city, your voice",
  loading: "Loading...",
  error: "Something went wrong",
  retry: "Try again",
  cancel: "Cancel",
  confirm: "Confirm",
  close: "Close",
  save: "Save",
  back: "Back",
  next: "Next",
  done: "Done",
  seeAll: "See all",
  submit: "Submit",
  search: "Search",
  searchPlaceholder: "Search services...",
  yes: "Yes",
  no: "No",
  optional: "optional",

  authWelcome: "Welcome to LuandaGov",
  authTagline: "Municipal services in your hand",
  authPhone: "Phone Number",
  authPhonePlaceholder: "+244 9XX XXX XXX",
  authBiNumber: "BI Number",
  authBiNumberPlaceholder: "000000000LA000",
  authFullName: "Full Name",
  authFullNamePlaceholder: "As it appears on your BI",
  authLogin: "Sign In",
  authRegister: "Create Account",
  authNoAccount: "Don't have an account?",
  authHaveAccount: "Already have an account?",
  authOtpSent: (phone) => `Code sent to ${phone}`,
  authOtpEnter: "Enter the 6-digit code",
  authOtpVerify: "Verify",
  authOtpResend: "Resend code",
  authWard: "Municipality",
  authSelectWard: "Select municipality",

  tabHome: "Home",
  tabMap: "Map",
  tabReport: "Report",
  tabServices: "Services",
  tabProfile: "Profile",

  homeGreeting: (name) => `Hello, ${name}`,
  homeMyCity: "My City",
  homeReportIssue: "Report issue",
  homeViewMap: "View map",
  homeMyReports: "My reports",
  homeServices: "Services",
  homeRecentActivity: "Recent activity",
  homeOpenIssues: "Open issues",
  homeResolvedToday: "Resolved today",
  homeActiveReports: "Active reports",
  homeNewsTitle: "Municipal news",
  homeQuickActions: "Quick actions",

  catRoads: "Roads",
  catLighting: "Lighting",
  catWater: "Water",
  catWaste: "Waste",
  catSafety: "Safety",
  catOther: "Other",

  statusSubmitted: "Submitted",
  statusUnderReview: "Under Review",
  statusInProgress: "In Progress",
  statusResolved: "Resolved",
  statusClosed: "Closed",
  statusRejected: "Rejected",

  reportTitle: "Report Issue",
  reportSelectCategory: "Select category",
  reportCategory: "Category",
  reportIssueName: "Issue title",
  reportIssueNamePlaceholder: "e.g. Pothole on Av. 4 de Fevereiro",
  reportDescription: "Description",
  reportDescriptionPlaceholder: "Describe the problem in detail...",
  reportAddPhoto: "Add photo",
  reportTakePhoto: "Take photo",
  reportChoosePhoto: "Choose from gallery",
  reportLocation: "Location",
  reportUseMyLocation: "Use my location",
  reportSelectOnMap: "Select on map",
  reportAddress: "Address",
  reportAddressPlaceholder: "e.g. Av. Lenine, Maianga",
  reportSubmitBtn: "Submit Report",
  reportSuccess: "Report Submitted!",
  reportSuccessDesc: "Your report has been received and will be reviewed shortly.",
  reportRefNumber: "Reference number",

  myReportsTitle: "My Reports",
  myReportsEmpty: "No reports yet",
  myReportsEmptyDesc: "Your reported issues will appear here",
  myReportsSubmitFirst: "Submit first report",
  myReportsUpdatedOn: "Updated on",
  myReportsTimeline: "Timeline",

  mapTitle: "Issue Map",
  mapFilterAll: "All",
  mapIssuesNearby: (n) => `${n} issues in your area`,
  mapViewReport: "View report",
  mapLegend: "Legend",

  servicesTitle: "Municipal Services",
  servicesDesc: "Digital access to Luanda City Hall services",
  servicesPayFee: "Pay Fee",
  servicesRequestDoc: "Request Document",
  servicesDirectory: "Directory",
  servicesIdWallet: "Digital ID",
  servicesElections: "Elections",
  servicesContactUs: "Contact Us",
  servicesPayTitle: "Fee Payment",
  servicesPayAmount: "Amount",
  servicesPayReference: "Reference",
  servicesPaySuccess: "Payment successful!",
  servicesDocRequest: "Document Request",
  servicesDocType: "Document type",
  servicesDocSubmit: "Submit request",

  electionsTitle: "Election Information",
  electionsDesc: "Information about elections and candidates",
  electionsCurrentCycle: "Current election",
  electionsDate: "Date",
  electionsType: "Type",
  electionsCandidates: "Candidates",
  electionsPollingStation: "Polling station",
  electionsHowToVote: "How to vote",
  electionsRegistered: "Registered",

  idTitle: "Digital ID",
  idDesc: "Your digital Identity Card",
  idBiNumber: "BI Number",
  idFullName: "Full Name",
  idDateOfBirth: "Date of birth",
  idIssueDate: "Issue date",
  idExpiry: "Expiry",
  idWard: "Municipality",
  idDownload: "Download",
  idShare: "Share",

  profileTitle: "Profile",
  profilePersonal: "Personal information",
  profileLanguage: "Language",
  profileLanguageDesc: "Choose the app language",
  profileNotifications: "Notifications",
  profileSecurity: "Security",
  profileAbout: "About",
  profileVersion: "Version",
  profileLogout: "Sign Out",
  profileLogoutConfirm: "Are you sure you want to sign out?",
  profilePrivacy: "Privacy",
  profileTerms: "Terms",
  profileSupport: "Support",
  profileTotalReports: "Total reports",
  profileResolvedReports: "Resolved",
  profileMemberSince: "Member since",

  wardMaianga: "Maianga",
  wardIngombota: "Ingombota",
  wardSambizanga: "Sambizanga",
  wardRangel: "Rangel",
  wardKilamba: "Kilamba Kiaxi",
  wardCazenga: "Cazenga",
  wardViana: "Viana",
  wardBelas: "Belas",

  langPortuguese: "Portuguese",
  langEnglish: "English",
};

export const translations: Record<Language, Translations> = { pt, en };
