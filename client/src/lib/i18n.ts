import { useState, useEffect } from 'react';

// Language type
export type Language = 'en' | 'sw';

// Translation interface
export interface Translations {
  [key: string]: string | Translations;
}

// English translations
const englishTranslations: Translations = {
  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    agentManagement: 'Agent Management',
    searchSubscriber: 'Search Subscriber',
    subscriberView: 'Subscriber View',
    subscriptionPurchase: 'Subscription Purchase',
    subscriptionRenewal: 'Subscription Renewal',
    planChange: 'Plan Change',
    addAddonPacks: 'Add Addon Packs',
    customerSuspension: 'Customer Suspension',
    customerRegistration: 'Customer Registration',
    consolidatedSubscriptions: 'Consolidated Subscriptions',
    logout: 'Logout'
  },
  
  // Common UI elements
  common: {
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    add: 'Add',
    update: 'Update',
    submit: 'Submit',
    close: 'Close',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    filter: 'Filter',
    export: 'Export',
    clear: 'Clear',
    refresh: 'Refresh',
    showAll: 'Show All',
    profile: 'Profile',
    settings: 'Settings',
    searchHistory: 'Search History',
    popularSearches: 'Popular Searches'
  },

  // Dashboard
  dashboard: {
    title: 'AZAM TV Agent Portal',
    subtitle: 'Comprehensive management system for field agents',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    statistics: 'Statistics',
    totalSubscribers: 'Total Subscribers',
    activeSubscribers: 'Active Subscribers',
    totalAgents: 'Total Agents',
    monthlyRevenue: 'Monthly Revenue'
  },

  // Search Subscriber
  searchSubscriber: {
    title: 'Search Subscriber',
    subtitle: 'Find and view subscriber information directly',
    searchTerm: 'Search Term',
    searchType: 'Search Type',
    allFields: 'All Fields',
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    smartCardNumber: 'Smart Card Number',
    sapBpId: 'SAP BP ID',
    findAndView: 'Find & View Subscriber',
    searchTips: 'Search Tips',
    searchTipsText: 'Use partial matches for names, enter complete numbers for phone/smart card searches. Search will take you directly to the subscriber\'s profile.',
    noSubscriberFound: 'No subscriber found matching your search criteria. Please try different search terms.',
    enterSearchTerm: 'Please enter a search term',
    placeholder: 'Enter name, phone, email, smart card number, or SAP BP ID...'
  },

  // Subscriber View
  subscriberView: {
    title: 'Subscriber Profile',
    overview: 'Overview',
    subscriptions: 'Subscriptions',
    hardware: 'Hardware',
    history: 'History',
    billing: 'Billing',
    customerInfo: 'Customer Information',
    accountDetails: 'Account Details',
    subscriptionInfo: 'Subscription Information',
    currentPlan: 'Current Plan',
    status: 'Status',
    endDate: 'End Date',
    walletBalance: 'Wallet Balance',
    viewDetails: 'View Details',
    active: 'Active',
    suspended: 'Suspended',
    disconnected: 'Disconnected',
    terminated: 'Terminated'
  },

  // Agent Management
  agentManagement: {
    title: 'Agent Management',
    subtitle: 'Manage field agents and their performance',
    addAgent: 'Add New Agent',
    agentList: 'Agent List',
    agentName: 'Agent Name',
    email: 'Email',
    phone: 'Phone',
    region: 'Region',
    performance: 'Performance',
    actions: 'Actions'
  },

  // Customer Registration
  customerRegistration: {
    title: 'Customer Registration',
    subtitle: 'Register new customers',
    personalInfo: 'Personal Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    region: 'Region',
    customerType: 'Customer Type',
    prepaid: 'Prepaid',
    postpaid: 'Postpaid',
    registerCustomer: 'Register Customer'
  },

  // Subscription Management
  subscription: {
    purchase: 'Purchase Subscription',
    renewal: 'Renew Subscription',
    planChange: 'Change Plan',
    addAddon: 'Add Addon Pack',
    suspension: 'Suspend Customer',
    planName: 'Plan Name',
    amount: 'Amount',
    duration: 'Duration',
    features: 'Features',
    selectPlan: 'Select Plan',
    paymentMethod: 'Payment Method',
    wallet: 'Wallet',
    mobileMoney: 'Mobile Money',
    bankTransfer: 'Bank Transfer'
  },

  // Statistics
  stats: {
    total: 'Total',
    active: 'Active',
    suspended: 'Suspended',
    disconnected: 'Disconnected',
    subscribers: 'Subscribers',
    agents: 'Agents',
    revenue: 'Revenue',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    growth: 'Growth'
  },

  // Time and dates
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
    ago: 'ago'
  },

  // Navigation
  nav: {
    home: 'Home',
    onboarding: 'Onboarding',
    inventory: 'Inventory',
    payments: 'Payments',
    subscriptions: 'Subscriptions',
    adjustment: 'Adjustment',
    serviceTicketing: 'Service Ticketing',
    bulkProvision: 'Bulk Provision',
    agentCommission: 'Agent Commission',
    provisioning: 'Provisioning',
    dashboard: 'Dashboard',
    reports: 'Reports'
  },

  // Home page
  home: {
    title: 'AZAM TV Portal',
    subtitle: 'Choose a service module to get started',
    welcomeMessage: 'Welcome to AZAM TV Agent Management System',
    modules: 'Service Modules',
    getStarted: 'Get Started',
    quickActions: 'Quick Actions',
    coreModules: 'Core Modules',
    analyticsModules: 'Analytics & Reports',
    operationsModules: 'Operations',
    newAgent: 'New Agent',
    newAgentDesc: 'Register a new agent',
    newCustomer: 'New Customer',
    newCustomerDesc: 'Register a new customer',
    updateInventory: 'Update Inventory',
    updateInventoryDesc: 'Add or update inventory items',
    processPayment: 'Process Payment',
    processPaymentDesc: 'Record a new payment',
    agentManagement: 'Agent Management',
    agentManagementDesc: 'Manage agent onboarding and profiles',
    customerManagement: 'Customer Management', 
    customerManagementDesc: 'Register new customers and manage accounts',
    inventoryManagement: 'Inventory Management',
    inventoryManagementDesc: 'Track set-top boxes and smart cards',
    paymentProcessing: 'Payment Processing',
    paymentProcessingDesc: 'Handle hardware and subscription payments',
    subscriptionManagement: 'Subscription Management',
    subscriptionManagementDesc: 'Manage TV packages and subscriptions',
    reportsAnalytics: 'Reports & Analytics',
    reportsAnalyticsDesc: 'View performance metrics and reports',
    adjustment: 'Adjustment',
    adjustmentDesc: 'Account and billing adjustments',
    serviceTicketing: 'Service Ticketing',
    serviceTicketingDesc: 'Customer service ticket management',
    bulkProvision: 'Bulk Provision',
    bulkProvisionDesc: 'Mass provisioning operations',
    agentCommission: 'Agent Commission',
    agentCommissionDesc: 'Commission management and tracking'
  },

  // Forms and validation
  forms: {
    required: 'This field is required',
    invalid: 'Invalid input',
    emailInvalid: 'Please enter a valid email address',
    phoneInvalid: 'Please enter a valid phone number',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMismatch: 'Passwords do not match',
    selectOption: 'Please select an option'
  },

  // Service operations
  services: {
    suspension: 'Suspension',
    suspensionDesc: 'Suspend subscriber services',
    reconnection: 'Reconnection', 
    reconnectionDesc: 'Reconnect suspended services',
    disconnection: 'Disconnection',
    disconnectionDesc: 'Disconnect subscriber services',
    termination: 'Termination',
    terminationDesc: 'Terminate subscriber accounts',
    retrack: 'Retrack',
    retrackDesc: 'Retrack service connections',
    replacement: 'Replacement',
    replacementDesc: 'Replace equipment and services',
    paymentTransactions: 'Payment Transactions',
    paymentTransactionsDesc: 'View and manage payment records',
    serviceTransactions: 'Service Transactions',
    serviceTransactionsDesc: 'Track service transaction history'
  },

  // Subscription Modules
  subscriptionModule: {
    title: 'Subscription Management',
    subtitle: '19 Modules Available', 
    searchSubscriber: 'Search Subscriber',
    searchSubscriberDesc: 'Find customer subscription details',
    subscriberView: 'Subscriber View',
    subscriberViewDesc: 'View complete subscriber profile',
    subscriberManagement: 'Subscriber Management',
    subscriptionOperations: 'Subscription Operations',
    serviceManagement: 'Service Management',
    transactionManagement: 'Transaction Management',
    billingInvoicing: 'Billing & Invoicing',
    quickActions: 'Quick Actions'
  },

  // Inventory
  inventory: {
    title: 'Inventory Management',
    subtitle: 'Manage hardware inventory and tracking',
    stockOverview: 'Stock Overview',
    stockRequest: 'Stock Request',
    stockApproval: 'Stock Approval',
    stockTransfer: 'Stock Transfer',
    trackSerial: 'Track Serial',
    casIdChange: 'CAS ID Change',
    stbScPairing: 'STB-SC Pairing',
    warehouseTransfer: 'Warehouse Transfer',
    blockUnblockAgent: 'Block/Unblock Agent',
    blockUnblockCenter: 'Block/Unblock Center',
    pogrnUpdate: 'PO/GRN Update',
    poView: 'PO View',
    customerHardwareReturn: 'Customer Hardware Return',
    agentReplacement: 'Agent Replacement',
    agentFaultyRepair: 'Agent Faulty Repair',
    agentPaymentHW: 'Agent Payment HW',
    agentHardwareSale: 'Agent Hardware Sale',
    customerHardwareSale: 'Customer Hardware Sale',
    customerPaymentHW: 'Customer Payment HW'
  },

  // Hardware and technical
  hardware: {
    stbModel: 'STB Model',
    stbSerial: 'STB Serial Number',
    smartCard: 'Smart Card',
    smartCardNumber: 'Smart Card Number',
    warrantyStatus: 'Warranty Status',
    condition: 'Condition',
    working: 'Working',
    faulty: 'Faulty',
    damaged: 'Damaged',
    purchaseDate: 'Purchase Date',
    warrantyEnd: 'Warranty End Date'
  },

  // Login and authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    rememberMe: 'Remember Me',
    invalidCredentials: 'Invalid username or password',
    sessionExpired: 'Your session has expired',
    welcomeBack: 'Welcome back',
    pleaseSignIn: 'Please sign in to continue'
  }
};

// Swahili translations
const swahiliTranslations: Translations = {
  // Navigation
  navigation: {
    dashboard: 'Dashibodi',
    agentManagement: 'Usimamizi wa Mawakala',
    searchSubscriber: 'Tafuta Mteja',
    subscriberView: 'Muelekeo wa Mteja',
    subscriptionPurchase: 'Ununuzi wa Usajili',
    subscriptionRenewal: 'Upyaji wa Usajili',
    planChange: 'Badiliko la Mpango',
    addAddonPacks: 'Ongeza Vifurushi vya Ziada',
    customerSuspension: 'Kusimamishwa kwa Mteja',
    customerRegistration: 'Usajili wa Wateja',
    consolidatedSubscriptions: 'Usajili Uliounganishwa',
    logout: 'Ondoka'
  },

  // Common UI elements
  common: {
    search: 'Tafuta',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    delete: 'Futa',
    edit: 'Hariri',
    view: 'Ona',
    add: 'Ongeza',
    update: 'Sasisha',
    submit: 'Wasilisha',
    close: 'Funga',
    loading: 'Inapakia...',
    noData: 'Hakuna data',
    error: 'Hitilafu',
    success: 'Mafanikio',
    warning: 'Onyo',
    info: 'Taarifa',
    confirm: 'Thibitisha',
    yes: 'Ndio',
    no: 'Hapana',
    back: 'Nyuma',
    next: 'Ifuatayo',
    previous: 'Iliyotangulia',
    filter: 'Chuja',
    export: 'Hamisha',
    clear: 'Safisha',
    refresh: 'Onyesha upya',
    showAll: 'Onyesha Zote',
    profile: 'Wasifu',
    settings: 'Mipangilio',
    searchHistory: 'Historia ya Utafutaji',
    popularSearches: 'Utafutaji Maarufu'
  },

  // Dashboard
  dashboard: {
    title: 'Uwanja wa AZAM TV',
    subtitle: 'Mfumo mkuu wa usimamizi kwa mawakala wa uwandani',
    quickActions: 'Vitendo vya Haraka',
    recentActivity: 'Shughuli za Hivi Karibuni',
    statistics: 'Takwimu',
    totalSubscribers: 'Jumla ya Walanjiwa',
    activeSubscribers: 'Walanjiwa Hai',
    totalAgents: 'Jumla ya Mawakala',
    monthlyRevenue: 'Mapato ya Kila Mwezi'
  },

  // Search Subscriber
  searchSubscriber: {
    title: 'Tafuta Mteja',
    subtitle: 'Tafuta na uone taarifa za mteja moja kwa moja',
    searchTerm: 'Neno la Utafutaji',
    searchType: 'Aina ya Utafutaji',
    allFields: 'Sehemu Zote',
    customerName: 'Jina la Mteja',
    phoneNumber: 'Nambari ya Simu',
    emailAddress: 'Anwani ya Barua Pepe',
    smartCardNumber: 'Nambari ya Kadi Mahiri',
    sapBpId: 'Kitambulisho cha SAP BP',
    findAndView: 'Tafuta na Uone Mteja',
    searchTips: 'Vidokezo vya Utafutaji',
    searchTipsText: 'Tumia sehemu za majina, ingiza nambari kamili za simu/kadi mahiri. Utafutaji utakupeleka moja kwa moja kwenye wasifu wa mteja.',
    noSubscriberFound: 'Hakuna mteja aliyepatikana kulingana na vigezo vyako vya utafutaji. Jaribu kutumia maneno mengine ya utafutaji.',
    enterSearchTerm: 'Tafadhali ingiza neno la utafutaji',
    placeholder: 'Ingiza jina, simu, barua pepe, nambari ya kadi mahiri, au kitambulisho cha SAP BP...'
  },

  // Subscriber View
  subscriberView: {
    title: 'Wasifu wa Mteja',
    overview: 'Maelezo',
    subscriptions: 'Usajili',
    hardware: 'Vifaa',
    history: 'Historia',
    billing: 'Malipo',
    customerInfo: 'Taarifa za Mteja',
    accountDetails: 'Maelezo ya Akaunti',
    subscriptionInfo: 'Taarifa za Usajili',
    currentPlan: 'Mpango wa Sasa',
    status: 'Hali',
    endDate: 'Tarehe ya Mwisho',
    walletBalance: 'Mizani ya Mkoba',
    viewDetails: 'Ona Maelezo',
    active: 'Hai',
    suspended: 'Kusimamishwa',
    disconnected: 'Kukatwa',
    terminated: 'Kukomesha'
  },

  // Agent Management
  agentManagement: {
    title: 'Usimamizi wa Mawakala',
    subtitle: 'Simamia mawakala wa uwandani na utendaji wao',
    addAgent: 'Ongeza Wakala Mpya',
    agentList: 'Orodha ya Mawakala',
    agentName: 'Jina la Wakala',
    email: 'Barua Pepe',
    phone: 'Simu',
    region: 'Mkoa',
    performance: 'Utendaji',
    actions: 'Vitendo'
  },

  // Customer Registration
  customerRegistration: {
    title: 'Usajili wa Wateja',
    subtitle: 'Sajili wateja wapya',
    personalInfo: 'Taarifa za Kibinafsi',
    firstName: 'Jina la Kwanza',
    lastName: 'Jina la Mwisho',
    email: 'Anwani ya Barua Pepe',
    phone: 'Nambari ya Simu',
    address: 'Anwani',
    city: 'Jiji',
    region: 'Mkoa',
    customerType: 'Aina ya Mteja',
    prepaid: 'Kulipa Awali',
    postpaid: 'Kulipa Baadaye',
    registerCustomer: 'Sajili Mteja'
  },

  // Subscription Management
  subscription: {
    purchase: 'Nunua Usajili',
    renewal: 'Pya Usajili',
    planChange: 'Badilisha Mpango',
    addAddon: 'Ongeza Kifurushi cha Ziada',
    suspension: 'Simamisha Mteja',
    planName: 'Jina la Mpango',
    amount: 'Kiasi',
    duration: 'Muda',
    features: 'Vipengele',
    selectPlan: 'Chagua Mpango',
    paymentMethod: 'Njia ya Malipo',
    wallet: 'Mkoba',
    mobileMoney: 'Pesa za Simu',
    bankTransfer: 'Uhamishaji wa Benki'
  },

  // Statistics
  stats: {
    total: 'Jumla',
    active: 'Hai',
    suspended: 'Kusimamishwa',
    disconnected: 'Kukatwa',
    subscribers: 'Walanjiwa',
    agents: 'Mawakala',
    revenue: 'Mapato',
    thisMonth: 'Mwezi Huu',
    lastMonth: 'Mwezi Uliopita',
    growth: 'Ukuaji'
  },

  // Time and dates
  time: {
    today: 'Leo',
    yesterday: 'Jana',
    lastWeek: 'Wiki Iliyopita',
    lastMonth: 'Mwezi Uliopita',
    thisYear: 'Mwaka Huu',
    minutes: 'dakika',
    hours: 'masaa',
    days: 'siku',
    weeks: 'wiki',
    months: 'miezi',
    years: 'miaka',
    ago: 'iliyopita'
  },

  // Navigation
  nav: {
    home: 'Nyumbani',
    onboarding: 'Ujumuishaji',
    inventory: 'Hesabu',
    payments: 'Malipo',
    subscriptions: 'Michango',
    adjustment: 'Marekebisho',
    serviceTicketing: 'Tiketi za Huduma',
    bulkProvision: 'Utayarishaji wa Wingi',
    agentCommission: 'Kodi ya Wakala',
    provisioning: 'Utayarishaji',
    dashboard: 'Uwanja wa Kazi',
    reports: 'Ripoti'
  },

  // Home page
  home: {
    title: 'Tovuti ya AZAM TV',
    subtitle: 'Chagua moduli ya huduma ili kuanza',
    welcomeMessage: 'Karibu kwenye Mfumo wa Usimamizi wa Mawakala wa AZAM TV',
    modules: 'Moduli za Huduma',
    getStarted: 'Anza',
    quickActions: 'Vitendo vya Haraka',
    coreModules: 'Moduli za Msingi',
    analyticsModules: 'Uchanganuzi na Ripoti',
    operationsModules: 'Shughuli',
    newAgent: 'Wakala Mpya',
    newAgentDesc: 'Sajili wakala mpya',
    newCustomer: 'Mteja Mpya',
    newCustomerDesc: 'Sajili mteja mpya',
    updateInventory: 'Sasisha Hesabu',
    updateInventoryDesc: 'Ongeza au sasisha vipengee vya hesabu',
    processPayment: 'Sindika Malipo',
    processPaymentDesc: 'Rekodi malipo mapya',
    agentManagement: 'Usimamizi wa Mawakala',
    agentManagementDesc: 'Simamia ujumuishaji na maelezo ya mawakala',
    customerManagement: 'Usimamizi wa Wateja', 
    customerManagementDesc: 'Sajili wateja wapya na simamia akaunti',
    inventoryManagement: 'Usimamizi wa Hesabu',
    inventoryManagementDesc: 'Fuatilia visanduku vya juu na kadi mahiri',
    paymentProcessing: 'Usindikaji wa Malipo',
    paymentProcessingDesc: 'Shughulikia malipo ya vifaa na michango',
    subscriptionManagement: 'Usimamizi wa Michango',
    subscriptionManagementDesc: 'Simamia mifuko ya TV na michango',
    reportsAnalytics: 'Ripoti na Uchanganuzi',
    reportsAnalyticsDesc: 'Ona vipimo vya utendaji na ripoti',
    adjustment: 'Marekebisho',
    adjustmentDesc: 'Marekebisho ya akaunti na malipo',
    serviceTicketing: 'Tiketi za Huduma',
    serviceTicketingDesc: 'Usimamizi wa tiketi za huduma kwa wateja',
    bulkProvision: 'Utayarishaji wa Wingi',
    bulkProvisionDesc: 'Shughuli za utayarishaji wa wingi',
    agentCommission: 'Kodi ya Wakala',
    agentCommissionDesc: 'Usimamizi na ufuatiliaji wa kodi'
  },

  // Forms and validation
  forms: {
    required: 'Uga huu unahitajika',
    invalid: 'Uingizaji batili',
    emailInvalid: 'Tafadhali ingiza barua pepe sahihi',
    phoneInvalid: 'Tafadhali ingiza nambari sahihi ya simu',
    passwordTooShort: 'Nenosiri lazima liwe na angalau herufi 8',
    passwordMismatch: 'Maneno ya siri hayafanani',
    selectOption: 'Tafadhali chagua chaguo'
  },

  // Service operations
  services: {
    suspension: 'Kusimamisha',
    suspensionDesc: 'Simamisha huduma za mteja',
    reconnection: 'Kuunganisha Tena', 
    reconnectionDesc: 'Unganisha tena huduma zilizosimamishwa',
    disconnection: 'Kukatisha',
    disconnectionDesc: 'Katisha huduma za mteja',
    termination: 'Kukomesha',
    terminationDesc: 'Komesha akaunti za wateja',
    retrack: 'Kufuatilia Tena',
    retrackDesc: 'Fuatilia tena miunganisho ya huduma',
    replacement: 'Kubadilisha',
    replacementDesc: 'Badilisha vifaa na huduma',
    paymentTransactions: 'Shughuli za Malipo',
    paymentTransactionsDesc: 'Ona na simamia rekodi za malipo',
    serviceTransactions: 'Shughuli za Huduma',
    serviceTransactionsDesc: 'Fuatilia historia ya shughuli za huduma'
  },

  // Subscription Modules
  subscriptionModule: {
    title: 'Usimamizi wa Michango',
    subtitle: 'Moduli 19 Zinapatikana', 
    searchSubscriber: 'Tafuta Mlanjiwa',
    searchSubscriberDesc: 'Tafuta maelezo ya usajili wa mteja',
    subscriberView: 'Muelekeo wa Mlanjiwa',
    subscriberViewDesc: 'Ona wasifu kamili wa mlanjiwa',
    subscriberManagement: 'Usimamizi wa Walanjiwa',
    subscriptionOperations: 'Shughuli za Usajili',
    serviceManagement: 'Usimamizi wa Huduma',
    transactionManagement: 'Usimamizi wa Muamala',
    billingInvoicing: 'Malipo na Bili',
    quickActions: 'Vitendo vya Haraka'
  },

  // Inventory
  inventory: {
    title: 'Usimamizi wa Hesabu',
    subtitle: 'Simamia hesabu ya vifaa na ufuatiliaji',
    stockOverview: 'Muhtasari wa Hisa',
    stockRequest: 'Ombi la Hisa',
    stockApproval: 'Idhini ya Hisa',
    stockTransfer: 'Uhamisho wa Hisa',
    trackSerial: 'Fuatilia Nambari ya Mtandao',
    casIdChange: 'Mabadiliko ya CAS ID',
    stbScPairing: 'Uunganishaji wa STB-SC',
    warehouseTransfer: 'Uhamisho wa Ghala',
    blockUnblockAgent: 'Zuia/Fungua Wakala',
    blockUnblockCenter: 'Zuia/Fungua Kituo',
    pogrnUpdate: 'Sasisha PO/GRN',
    poView: 'Ona PO',
    customerHardwareReturn: 'Kurudisha Vifaa vya Mteja',
    agentReplacement: 'Ubadilishaji wa Wakala',
    agentFaultyRepair: 'Ukarabati wa Wakala Ulioharibika',
    agentPaymentHW: 'Malipo ya Vifaa ya Wakala',
    agentHardwareSale: 'Uuzaji wa Vifaa vya Wakala',
    customerHardwareSale: 'Uuzaji wa Vifaa vya Mteja',
    customerPaymentHW: 'Malipo ya Vifaa ya Mteja'
  },

  // Hardware and technical
  hardware: {
    stbModel: 'Muundo wa STB',
    stbSerial: 'Nambari ya Mtandao wa STB',
    smartCard: 'Kadi Mahiri',
    smartCardNumber: 'Nambari ya Kadi Mahiri',
    warrantyStatus: 'Hali ya Dhamana',
    condition: 'Hali',
    working: 'Inafanya Kazi',
    faulty: 'Imeharibika',
    damaged: 'Imeharibiwa',
    purchaseDate: 'Tarehe ya Ununuzi',
    warrantyEnd: 'Tarehe ya Mwisho wa Dhamana'
  },

  // Login and authentication
  auth: {
    login: 'Ingia',
    logout: 'Toka',
    username: 'Jina la Mtumiaji',
    password: 'Nenosiri',
    forgotPassword: 'Umesahau Nenosiri',
    signIn: 'Ingia',
    signOut: 'Toka',
    rememberMe: 'Nikumbuke',
    invalidCredentials: 'Jina la mtumiaji au nenosiri si sahihi',
    sessionExpired: 'Kipindi chako kimeisha',
    welcomeBack: 'Karibu tena',
    pleaseSignIn: 'Tafadhali ingia ili kuendelea'
  }
};

// All translations
const translations: Record<Language, Translations> = {
  en: englishTranslations,
  sw: swahiliTranslations
};

// Language context
class LanguageService {
  private currentLanguage: Language = 'en';
  private listeners: ((language: Language) => void)[] = [];

  constructor() {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('azam-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sw')) {
      this.currentLanguage = savedLanguage;
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('azam-language', language);
    this.listeners.forEach(listener => listener(language));
  }

  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  translate(key: string, language?: Language): string {
    const lang = language || this.currentLanguage;
    const langTranslations = translations[lang];
    
    const keys = key.split('.');
    let value: any = langTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        const englishTranslations = translations.en;
        let englishValue: any = englishTranslations;
        for (const ek of keys) {
          if (englishValue && typeof englishValue === 'object' && ek in englishValue) {
            englishValue = englishValue[ek];
          } else {
            return key; // Return key if no translation found
          }
        }
        return typeof englishValue === 'string' ? englishValue : key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }
}

// Export singleton instance
export const languageService = new LanguageService();

// React hook for using translations
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languageService.getCurrentLanguage());

  useEffect(() => {
    return languageService.subscribe(setCurrentLanguage);
  }, []);

  const t = (key: string): string => {
    return languageService.translate(key);
  };

  const changeLanguage = (language: Language): void => {
    languageService.setLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage
  };
}

// Helper function for getting translation without hook
export const t = (key: string, language?: Language): string => {
  return languageService.translate(key, language);
};