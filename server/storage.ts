import { 
  User, Agent, Customer, InventoryItem, InventoryRequest, 
  Payment, Subscription, SystemIncident, SystemIncidentNote, SystemIncidentAudit,
  CustomerTransfer, CustomerTransferRequest, Adjustment, AdjustmentRequest, CustomerDetails,
  DailyReport, TRAReport, TCRAReport, ReportAuditLog,
  type AgentReplacement, type AgentFaultyRepair,
  type AgentHardwarePayment, type AgentHardwareSale, type CustomerHardwareSale,
  type AddOnPack, type AddOnPurchase, type AddOnRenewal, type AddOnRemoval
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;

  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgentById(id: number): Promise<Agent | null>;
  createAgent(agent: Omit<Agent, "id">): Promise<Agent>;
  updateAgent(id: number, agent: Partial<Agent>): Promise<Agent | null>;
  deleteAgent(id: number): Promise<boolean>;

  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | null>;
  createCustomer(customer: Omit<Customer, "id">): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | null>;
  deleteCustomer(id: number): Promise<boolean>;

  // Inventory operations
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | null>;
  createInventoryItem(item: Omit<InventoryItem, "id">): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | null>;
  deleteInventoryItem(id: number): Promise<boolean>;

  // Inventory request operations
  getInventoryRequests(): Promise<InventoryRequest[]>;
  getInventoryRequestById(id: number): Promise<InventoryRequest | null>;
  createInventoryRequest(request: Omit<InventoryRequest, "id">): Promise<InventoryRequest>;
  updateInventoryRequest(id: number, request: Partial<InventoryRequest>): Promise<InventoryRequest | null>;
  deleteInventoryRequest(id: number): Promise<boolean>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPaymentById(id: number): Promise<Payment | null>;
  createPayment(payment: Omit<Payment, "id">): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | null>;
  deletePayment(id: number): Promise<boolean>;

  // Subscription operations
  getSubscriptions(): Promise<Subscription[]>;
  getSubscriptionById(id: number): Promise<Subscription | null>;
  createSubscription(subscription: Omit<Subscription, "id">): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | null>;
  deleteSubscription(id: number): Promise<boolean>;

  // System Incident operations
  getSystemIncidents(): Promise<SystemIncident[]>;
  getSystemIncidentById(id: number): Promise<SystemIncident | null>;
  getSystemIncidentByIncidentId(incidentId: string): Promise<SystemIncident | null>;
  createSystemIncident(incident: Omit<SystemIncident, "id" | "incidentId" | "createdAt" | "updatedAt">): Promise<SystemIncident>;
  updateSystemIncident(id: number, incident: Partial<SystemIncident>): Promise<SystemIncident | null>;
  deleteSystemIncident(id: number): Promise<boolean>;

  // System Incident note operations
  getSystemIncidentNotes(incidentId: number): Promise<SystemIncidentNote[]>;
  createSystemIncidentNote(note: Omit<SystemIncidentNote, "id" | "createdAt">): Promise<SystemIncidentNote>;

  // System Incident audit operations
  getSystemIncidentAudit(incidentId: number): Promise<SystemIncidentAudit[]>;
  createSystemIncidentAudit(audit: Omit<SystemIncidentAudit, "id" | "createdAt">): Promise<SystemIncidentAudit>;

  // Receipt Cancellation operations
  getEligibleReceiptsForCancellation(filters: {
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
    agentId?: string;
    paymentMode?: string;
    page: number;
    limit: number;
  }): Promise<any[]>;
  getReceiptForCancellation(payId: string): Promise<any | null>;
  isReceiptEligibleForCancellation(payId: string): Promise<{ eligible: boolean; reason?: string; currentStatus?: string }>;
  cancelReceipt(cancellation: {
    payId: string;
    cancellationReason: string;
    cancelledBy: string;
    cancellationDate: Date;
    originalStatus: string;
  }): Promise<{ success: boolean; data?: any; error?: string }>;
  updateCancellationCMStatus(payId: string, cmUpdate: {
    cmRequestId?: string;
    cmStatus?: string;
    cmStatusMsg?: string;
    ficaStatus?: string;
    ficaStatusMsg?: string;
  }): Promise<void>;
  adjustWalletForCancellation(customerId: string, amount: number): Promise<any>;
  getCancellationAuditTrail(payId: string): Promise<any | null>;
  getCancellationStatus(payId: string): Promise<any | null>;

  // Customer Transfer operations
  getCustomerTransfers(): Promise<CustomerTransfer[]>;
  getCustomerTransferById(id: number): Promise<CustomerTransfer | null>;
  createCustomerTransfer(transfer: Omit<CustomerTransfer, "id" | "createDt" | "createTs">): Promise<CustomerTransfer>;
  updateCustomerTransfer(id: number, transfer: Partial<CustomerTransfer>): Promise<CustomerTransfer | null>;
  validateTransferEligibility(sourceCustomerId: number, targetCustomerId: number, amount: number): Promise<{ 
    eligible: boolean; 
    reason?: string;
    sourceCustomer?: Customer;
    targetCustomer?: Customer;
    availablePayments?: Payment[];
  }>;
  checkInvoiceStatus(invoiceNumber: string): Promise<{
    status: 'CLEARED' | 'PENDING';
    requiresManualIntervention: boolean;
  }>;
  updateTransferCMStatus(transferId: number, cmUpdate: {
    cmStatus?: string;
    cmStatusMessage?: string;
    ficaStatus?: string;
    ficaStatusMessage?: string;
    somStatus?: string;
    somStatusMessage?: string;
    requestId?: string;
  }): Promise<void>;

  // Adjustment operations
  getAdjustments(): Promise<Adjustment[]>;
  getAdjustmentById(id: number): Promise<Adjustment | null>;
  createAdjustment(adjustment: Omit<Adjustment, "id" | "requestedAt">): Promise<Adjustment>;
  updateAdjustment(id: number, adjustment: Partial<Adjustment>): Promise<Adjustment | null>;
  approveAdjustment(id: number, approvedBy: string): Promise<Adjustment | null>;
  rejectAdjustment(id: number, rejectedBy: string, rejectionReason: string): Promise<Adjustment | null>;
  getCustomerDetailsByBpId(bpId: string): Promise<CustomerDetails | null>;
  getCustomerDetailsByScId(scId: string): Promise<CustomerDetails | null>;
  getPendingAdjustments(): Promise<Adjustment[]>;
  getProcessedAdjustments(): Promise<Adjustment[]>;

  // Report operations
  getDailyReports(dateFrom?: string, dateTo?: string, region?: string): Promise<DailyReport[]>;
  getDailyReportById(id: number): Promise<DailyReport | null>;
  generateDailyReport(reportDate: Date, reportType: string, region?: string): Promise<DailyReport>;
  
  getTRAReports(dateFrom?: string, dateTo?: string): Promise<TRAReport[]>;
  getTRAReportById(id: number): Promise<TRAReport | null>;
  generateTRAReport(reportDate: Date, reportType: string): Promise<TRAReport>;
  
  getTCRAReports(dateFrom?: string, dateTo?: string, region?: string): Promise<TCRAReport[]>;
  getTCRAReportById(id: number): Promise<TCRAReport | null>;
  generateTCRAReport(reportDate: Date, reportType: string, region?: string): Promise<TCRAReport>;
  
  getReportAuditLogs(reportType?: string, reportId?: number): Promise<ReportAuditLog[]>;
  createReportAuditLog(auditLog: Omit<ReportAuditLog, "id" | "performedAt">): Promise<ReportAuditLog>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@azamtv.co.tz",
      role: "admin",
      createdAt: new Date()
    },
    {
      id: 2,
      username: "agent",
      firstName: "Field",
      lastName: "Agent", 
      email: "agent@azamtv.co.tz",
      role: "agent",
      createdAt: new Date()
    },
    {
      id: 3,
      username: "manager",
      firstName: "Regional",
      lastName: "Manager",
      email: "manager@azamtv.co.tz", 
      role: "manager",
      createdAt: new Date()
    }
  ];

  private agents: Agent[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Mwangi',
      email: 'john.mwangi@azamtv.co.tz',
      phone: '+255712345678',
      mobile: '+255712345678',
      type: 'Individual',
      country: 'Tanzania',
      region: 'Dar es Salaam',
      city: 'Dar es Salaam',
      district: 'Kinondoni',
      ward: 'Msasani',
      address1: 'Plot 123, Msasani Road',
      tinNumber: '123456789',
      vrnNumber: '987654321',
      currency: 'TSH',
      role: 'Agent',
      status: 'approved',
      statusMessage: 'KYC approved - SAP Business Partner created',
      commission: 5.0,
      creditLimit: 1000000,
      sapBpId: 'BP001',
      sapCaId: 'CA001',
      onboardingRefNo: 'AZAM-2024-000001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  private customers: Customer[] = [
    {
      id: 1,
      firstName: 'Amina',
      lastName: 'Hassan',
      phone: '+255712987654',
      mobile: '+255712987654',
      email: 'amina.hassan@example.com',
      customerType: 'prepaid',
      serviceType: 'DTT',
      accountClass: 'individual',
      connectionType: 'single',
      addressType: 'residential',
      country: 'Tanzania',
      region: 'Dar es Salaam',
      city: 'Dar es Salaam',
      district: 'Kinondoni',
      ward: 'Msasani',
      address1: 'Plot 456, Msasani Peninsula',
      currency: 'TSH',
      onboardingRefNo: 'CUST-2024-000001',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 2,
      firstName: 'Joseph',
      lastName: 'Mwamba',
      phone: '+255713456789',
      mobile: '+255713456789',
      email: 'joseph.mwamba@example.com',
      customerType: 'postpaid',
      serviceType: 'DTT',
      accountClass: 'individual',
      connectionType: 'single',
      addressType: 'residential',
      country: 'Tanzania',
      region: 'Mwanza',
      city: 'Mwanza',
      district: 'Nyamagana',
      ward: 'Nyamagana',
      address1: 'Block 12, Nyamagana',
      currency: 'TSH',
      onboardingRefNo: 'CUST-2024-000002',
      createdAt: new Date('2024-01-25')
    },
    {
      id: 3,
      firstName: 'Grace',
      lastName: 'Mollel',
      phone: '+255714567890',
      mobile: '+255714567890',
      email: 'grace.mollel@example.com',
      customerType: 'prepaid',
      serviceType: 'DTT',
      accountClass: 'individual',
      connectionType: 'single',
      addressType: 'residential',
      country: 'Tanzania',
      region: 'Arusha',
      city: 'Arusha',
      district: 'Arusha Urban',
      ward: 'Kaloleni',
      address1: 'Street 5, Kaloleni',
      currency: 'TSH',
      onboardingRefNo: 'CUST-2024-000003',
      createdAt: new Date('2024-02-01')
    }
  ];

  private inventoryItems: InventoryItem[] = [
    {
      id: 1,
      materialCode: 'STB001',
      materialName: 'Digital Set-Top Box Model A',
      materialType: 'STB',
      serialNumber: 'STB123456789',
      casId: 'CAS001',
      state: 'available',
      status: 'new',
      owner: 'Warehouse-DSM',
      createId: 'system',
      createDt: new Date('2024-01-10'),
      createTs: new Date('2024-01-10')
    },
    {
      id: 2,
      materialCode: 'STB001',
      materialName: 'Digital Set-Top Box Model A',
      materialType: 'STB',
      serialNumber: 'STB123456790',
      casId: 'CAS002',
      state: 'allocated',
      status: 'used',
      owner: 'Agent-001',
      createId: 'system',
      createDt: new Date('2024-01-10'),
      createTs: new Date('2024-01-10'),
      updateId: 'agent',
      updateDt: new Date('2024-01-20'),
      updateTs: new Date('2024-01-20')
    },
    {
      id: 3,
      materialCode: 'REM001',
      materialName: 'Remote Control Universal',
      materialType: 'Remote',
      serialNumber: 'REM987654321',
      state: 'available',
      status: 'new',
      owner: 'Warehouse-MWZ',
      createId: 'system',
      createDt: new Date('2024-01-15'),
      createTs: new Date('2024-01-15')
    },
    {
      id: 4,
      materialCode: 'CAB001',
      materialName: 'HDMI Cable 2m',
      materialType: 'Cable',
      serialNumber: 'CAB456789123',
      state: 'available',
      status: 'new',
      owner: 'Warehouse-DSM',
      createId: 'system',
      createDt: new Date('2024-01-12'),
      createTs: new Date('2024-01-12')
    },
    {
      id: 5,
      materialCode: 'STB001',
      materialName: 'Digital Set-Top Box Model A',
      materialType: 'STB',
      serialNumber: 'STB123456791',
      casId: 'CAS003',
      state: 'faulty',
      status: 'damaged',
      owner: 'Service-Center-DSM',
      createId: 'system',
      createDt: new Date('2024-01-10'),
      createTs: new Date('2024-01-10'),
      updateId: 'technician',
      updateDt: new Date('2024-02-05'),
      updateTs: new Date('2024-02-05')
    }
  ];

  private inventoryRequests: InventoryRequest[] = [
    {
      id: 1,
      sapBpId: 'BP001',
      sapCaId: 'CA001',
      module: 'inventory',
      salesOrg: 'TZ01',
      division: '01',
      requestType: 'stock_request',
      requestId: 'REQ-2024-0001',
      itemType: 'STB',
      itemQty: '10',
      itemAmount: 450000,
      totalAmount: 450000,
      vatAmount: 81000,
      status: 'pending',
      createId: 'agent-001',
      createDt: new Date('2024-02-01'),
      createTs: new Date('2024-02-01')
    },
    {
      id: 2,
      sapBpId: 'BP002',
      sapCaId: 'CA002',
      module: 'inventory',
      salesOrg: 'TZ01',
      division: '01',
      requestType: 'transfer_request',
      requestId: 'REQ-2024-0002',
      itemType: 'Remote',
      itemQty: '25',
      itemAmount: 125000,
      totalAmount: 125000,
      vatAmount: 22500,
      transferFrom: 'Warehouse-DSM',
      transferTo: 'Warehouse-MWZ',
      status: 'approved',
      createId: 'manager-001',
      createDt: new Date('2024-01-28'),
      createTs: new Date('2024-01-28'),
      updateDt: new Date('2024-01-30'),
      updateTs: new Date('2024-01-30'),
      updateId: 'warehouse-manager'
    },
    {
      id: 3,
      sapBpId: 'BP001',
      sapCaId: 'CA001',
      module: 'inventory',
      salesOrg: 'TZ01',
      division: '01',
      requestType: 'return_request',
      requestId: 'REQ-2024-0003',
      itemType: 'STB',
      itemQty: '3',
      itemAmount: 135000,
      totalAmount: 135000,
      vatAmount: 24300,
      itemSerialNo: 'STB123456791,STB123456792,STB123456793',
      status: 'completed',
      createId: 'agent-001',
      createDt: new Date('2024-01-25'),
      createTs: new Date('2024-01-25'),
      updateDt: new Date('2024-02-02'),
      updateTs: new Date('2024-02-02'),
      updateId: 'technical-lead',
      cmStatus: 'SUCCESS',
      cmStatusMsg: 'Return processed successfully',
      sapSoId: 'SO-2024-0003'
    }
  ];

  private payments: Payment[] = [
    {
      id: 1,
      customerId: 1,
      amount: 45000,
      currency: 'TSH',
      paymentMode: 'cash',
      type: 'hardware_sale',
      status: 'completed',
      referenceNumber: 'TXN123456789',
      receiptNumber: 'RCP-2024-0001',
      createdAt: new Date('2024-02-05')
    },
    {
      id: 2,
      customerId: 2,
      amount: 19000,
      currency: 'TSH',
      paymentMode: 'mobile_money',
      type: 'subscription',
      status: 'completed',
      referenceNumber: 'TXN123456790',
      receiptNumber: 'RCP-2024-0002',
      createdAt: new Date('2024-02-03')
    },
    {
      id: 3,
      customerId: 3,
      amount: 12000,
      currency: 'TSH',
      paymentMode: 'bank_transfer',
      type: 'subscription',
      status: 'pending',
      referenceNumber: 'TXN123456791',
      createdAt: new Date('2024-02-06')
    }
  ];

  private subscriptions: Subscription[] = [
    {
      id: 1,
      customerId: 1,
      smartCardNumber: 'SC123456789',
      plan: 'AZAM_LITE_1M',
      amount: 12000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      activationType: 'agent_activation',
      status: 'active',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 2,
      customerId: 2,
      smartCardNumber: 'SC123456790',
      plan: 'AZAM_PLAY_1M',
      amount: 19000,
      startDate: new Date('2024-02-03'),
      endDate: new Date('2024-03-03'),
      activationType: 'agent_activation',
      status: 'active',
      createdAt: new Date('2024-02-03')
    },
    {
      id: 3,
      customerId: 3,
      smartCardNumber: 'SC123456791',
      plan: 'AZAM_PREM_1M',
      amount: 35000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      activationType: 'agent_activation',
      status: 'suspended',
      createdAt: new Date('2024-01-15')
    }
  ];
  private systemIncidents: SystemIncident[] = [];
  private systemIncidentNotes: SystemIncidentNote[] = [];
  private systemIncidentAudits: SystemIncidentAudit[] = [];

  private nextId = {
    users: 4,
    agents: 2,
    customers: 4,
    inventoryItems: 6,
    inventoryRequests: 4,
    payments: 4,
    subscriptions: 4,
    systemIncidents: 3,
    incidentComments: 1,
    incidentSLAs: 1,
    incidentWorkflows: 1
  };

  constructor() {
    this.initializeSampleSystemIncidentData();
  }

  private initializeSampleSystemIncidentData() {
    // Sample system incidents
    const now = new Date();
    this.systemIncidents = [
      {
        id: 1,
        incidentId: 'SYS-2025-001',
        title: 'Portal Authentication Service Down',
        affectedSystem: 'Portal',
        severity: 'Critical',
        description: 'Users unable to login to portal due to authentication service failure. Error 503 being returned.',
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        endTime: undefined,
        impactedCustomers: 500,
        rootCause: 'Database connection pool exhausted',
        resolutionSteps: 'Restarting authentication service, increasing connection pool size',
        status: 'Investigating',
        assignedOwner: 'John Doe',
        ownerTeam: 'Technical',
        attachments: [],
        notificationSettings: {
          emailAlerts: true,
          smsAlerts: true,
          stakeholders: ['admin@azamtv.co.tz', 'ops@azamtv.co.tz']
        },
        linkedServiceTickets: [1, 2],
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 30 * 60 * 1000)
      },
      {
        id: 2,
        incidentId: 'SYS-2025-002',
        title: 'CM System Performance Degradation',
        affectedSystem: 'CM',
        severity: 'Major',
        description: 'Customer management system experiencing slow response times. API calls taking >10 seconds.',
        startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        endTime: undefined,
        impactedCustomers: 200,
        rootCause: '',
        resolutionSteps: '',
        status: 'Open',
        assignedOwner: 'Jane Smith',
        ownerTeam: 'Operations',
        attachments: [],
        notificationSettings: {
          emailAlerts: true,
          smsAlerts: false,
          stakeholders: ['ops@azamtv.co.tz']
        },
        linkedServiceTickets: [],
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      }
    ];

    // Update next IDs
    this.nextId.systemIncidents = 3;
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.nextId.users++,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return [...this.agents];
  }

  async getAgentById(id: number): Promise<Agent | null> {
    return this.agents.find(agent => agent.id === id) || null;
  }

  async createAgent(agent: Omit<Agent, "id">): Promise<Agent> {
    const newAgent: Agent = {
      ...agent,
      id: this.nextId.agents++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.agents.push(newAgent);
    return newAgent;
  }

  async updateAgent(id: number, agent: Partial<Agent>): Promise<Agent | null> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.agents[index] = { 
      ...this.agents[index], 
      ...agent, 
      updatedAt: new Date() 
    };
    return this.agents[index];
  }

  async deleteAgent(id: number): Promise<boolean> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.agents.splice(index, 1);
    return true;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return this.customers.find(customer => customer.id === id) || null;
  }

  async createCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: this.nextId.customers++
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | null> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.customers[index] = { ...this.customers[index], ...customer };
    return this.customers[index];
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.customers.splice(index, 1);
    return true;
  }

  // Inventory operations
  async getInventoryItems(): Promise<InventoryItem[]> {
    return [...this.inventoryItems];
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | null> {
    return this.inventoryItems.find(item => item.id === id) || null;
  }

  async createInventoryItem(item: Omit<InventoryItem, "id">): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: this.nextId.inventoryItems++
    };
    this.inventoryItems.push(newItem);
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const index = this.inventoryItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    this.inventoryItems[index] = { ...this.inventoryItems[index], ...item };
    return this.inventoryItems[index];
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const index = this.inventoryItems.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.inventoryItems.splice(index, 1);
    return true;
  }

  // Inventory request operations
  async getInventoryRequests(): Promise<InventoryRequest[]> {
    return [...this.inventoryRequests];
  }

  async getInventoryRequestById(id: number): Promise<InventoryRequest | null> {
    return this.inventoryRequests.find(request => request.id === id) || null;
  }

  async createInventoryRequest(request: Omit<InventoryRequest, "id">): Promise<InventoryRequest> {
    const newRequest: InventoryRequest = {
      ...request,
      id: this.nextId.inventoryRequests++
    };
    this.inventoryRequests.push(newRequest);
    return newRequest;
  }

  async updateInventoryRequest(id: number, request: Partial<InventoryRequest>): Promise<InventoryRequest | null> {
    const index = this.inventoryRequests.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.inventoryRequests[index] = { ...this.inventoryRequests[index], ...request };
    return this.inventoryRequests[index];
  }

  async deleteInventoryRequest(id: number): Promise<boolean> {
    const index = this.inventoryRequests.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.inventoryRequests.splice(index, 1);
    return true;
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    return [...this.payments];
  }

  async getPaymentById(id: number): Promise<Payment | null> {
    return this.payments.find(payment => payment.id === id) || null;
  }

  async createPayment(payment: Omit<Payment, "id">): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: this.nextId.payments++
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  async updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | null> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.payments[index] = { ...this.payments[index], ...payment };
    return this.payments[index];
  }

  async deletePayment(id: number): Promise<boolean> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.payments.splice(index, 1);
    return true;
  }

  // Subscription operations
  async getSubscriptions(): Promise<Subscription[]> {
    return [...this.subscriptions];
  }

  async getSubscriptionById(id: number): Promise<Subscription | null> {
    return this.subscriptions.find(subscription => subscription.id === id) || null;
  }

  async createSubscription(subscription: Omit<Subscription, "id">): Promise<Subscription> {
    const newSubscription: Subscription = {
      ...subscription,
      id: this.nextId.subscriptions++
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  async updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | null> {
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.subscriptions[index] = { ...this.subscriptions[index], ...subscription };
    return this.subscriptions[index];
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    this.subscriptions.splice(index, 1);
    return true;
  }

  // System Incident operations
  async getSystemIncidents(): Promise<SystemIncident[]> {
    return [...this.systemIncidents];
  }

  async getSystemIncidentById(id: number): Promise<SystemIncident | null> {
    return this.systemIncidents.find(incident => incident.id === id) || null;
  }

  async getSystemIncidentByIncidentId(incidentId: string): Promise<SystemIncident | null> {
    return this.systemIncidents.find(incident => incident.incidentId === incidentId) || null;
  }

  async createSystemIncident(incident: Omit<SystemIncident, "id" | "incidentId" | "createdAt" | "updatedAt">): Promise<SystemIncident> {
    const incidentId = `SYS-${new Date().getFullYear()}-${String(this.nextId.systemIncidents).padStart(3, '0')}`;
    
    const newIncident: SystemIncident = {
      ...incident,
      id: this.nextId.systemIncidents++,
      incidentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.systemIncidents.push(newIncident);
    return newIncident;
  }

  async updateSystemIncident(id: number, incident: Partial<SystemIncident>): Promise<SystemIncident | null> {
    const index = this.systemIncidents.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    this.systemIncidents[index] = { 
      ...this.systemIncidents[index], 
      ...incident, 
      updatedAt: new Date() 
    };
    return this.systemIncidents[index];
  }

  async deleteSystemIncident(id: number): Promise<boolean> {
    const index = this.systemIncidents.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    this.systemIncidents.splice(index, 1);
    return true;
  }

  // System Incident note operations
  async getSystemIncidentNotes(incidentId: number): Promise<SystemIncidentNote[]> {
    return this.systemIncidentNotes.filter(note => note.incidentId === incidentId);
  }

  async createSystemIncidentNote(note: Omit<SystemIncidentNote, "id" | "createdAt">): Promise<SystemIncidentNote> {
    const newNote: SystemIncidentNote = {
      ...note,
      id: this.nextId.systemIncidents++,
      createdAt: new Date()
    };
    this.systemIncidentNotes.push(newNote);
    return newNote;
  }

  // System Incident audit operations
  async getSystemIncidentAudit(incidentId: number): Promise<SystemIncidentAudit[]> {
    return this.systemIncidentAudits.filter(audit => audit.incidentId === incidentId);
  }

  async createSystemIncidentAudit(audit: Omit<SystemIncidentAudit, "id" | "createdAt">): Promise<SystemIncidentAudit> {
    const newAudit: SystemIncidentAudit = {
      ...audit,
      id: this.nextId.systemIncidents++,
      createdAt: new Date()
    };
    this.systemIncidentAudits.push(newAudit);
    return newAudit;
  }

  // Mock data for receipt cancellation
  private paymentDetails: any[] = [
    {
      payId: "PAY_001",
      sapBpId: "BP001",
      sapCaId: "CA001",
      customerId: "CUST001",
      customerName: "Amina Hassan",
      customerType: "PREPAID",
      payType: "Subscription",
      payAmount: 45000,
      vatAmount: 8100,
      totalAmount: 53100,
      payMode: "MOBILE_MONEY",
      status: "COMPLETED",
      transId: "TXN_001",
      collectedBy: "AGT001",
      collectionCenter: "DSM_CENTER_001",
      description: "Monthly subscription payment",
      receiptNo: "RCP_001",
      mobileRef: "MM123456789",
      createId: "agent001",
      createDt: new Date('2024-01-15'),
      createTs: new Date('2024-01-15'),
      cmStatus: "PROCESSED",
      cmStatusMsg: "Payment processed successfully",
      ficaStatus: "POSTED",
      ficaStatusMsg: "Posted to FICA successfully"
    },
    {
      payId: "PAY_002",
      sapBpId: "BP002",
      sapCaId: "CA002",
      customerId: "CUST002",
      customerName: "Joseph Mwamba",
      customerType: "POSTPAID",
      payType: "Hardware",
      payAmount: 150000,
      vatAmount: 27000,
      totalAmount: 177000,
      payMode: "CASH",
      status: "COMPLETED",
      transId: "TXN_002",
      collectedBy: "AGT001",
      collectionCenter: "DSM_CENTER_001",
      description: "Set-top box purchase",
      receiptNo: "RCP_002",
      createId: "agent001",
      createDt: new Date('2024-01-20'),
      createTs: new Date('2024-01-20'),
      cmStatus: "PROCESSED",
      cmStatusMsg: "Payment processed successfully",
      ficaStatus: "POSTED",
      ficaStatusMsg: "Posted to FICA successfully"
    }
  ];

  private receiptCancellations: any[] = [];

  // Receipt Cancellation operations implementation
  async getEligibleReceiptsForCancellation(filters: {
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
    agentId?: string;
    paymentMode?: string;
    page: number;
    limit: number;
  }): Promise<any[]> {
    let eligibleReceipts = this.paymentDetails.filter(payment => {
      // Only allow cancellation for completed payments
      if (payment.status !== 'COMPLETED') return false;
      
      // Check if already cancelled
      const existingCancellation = this.receiptCancellations.find(c => c.payId === payment.payId);
      if (existingCancellation) return false;

      // Check FI period (mock: allow cancellation within 30 days)
      const daysSincePayment = Math.floor((Date.now() - new Date(payment.createDt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSincePayment > 30) return false;

      // Apply filters
      if (filters.dateFrom && new Date(payment.createDt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(payment.createDt) > new Date(filters.dateTo)) return false;
      if (filters.customerId && payment.customerId !== filters.customerId) return false;
      if (filters.agentId && payment.collectedBy !== filters.agentId) return false;
      if (filters.paymentMode && payment.payMode !== filters.paymentMode) return false;

      return true;
    });

    // Pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    
    return eligibleReceipts.slice(startIndex, endIndex);
  }

  async getReceiptForCancellation(payId: string): Promise<any | null> {
    return this.paymentDetails.find(p => p.payId === payId) || null;
  }

  async isReceiptEligibleForCancellation(payId: string): Promise<{ eligible: boolean; reason?: string; currentStatus?: string }> {
    const payment = this.paymentDetails.find(p => p.payId === payId);
    if (!payment) {
      return { eligible: false, reason: "Receipt not found" };
    }

    if (payment.status !== 'COMPLETED') {
      return { eligible: false, reason: "Only completed payments can be cancelled", currentStatus: payment.status };
    }

    const existingCancellation = this.receiptCancellations.find(c => c.payId === payId);
    if (existingCancellation) {
      return { eligible: false, reason: "Receipt already cancelled", currentStatus: payment.status };
    }

    // Check FI period (mock: 30 days)
    const daysSincePayment = Math.floor((Date.now() - new Date(payment.createDt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSincePayment > 30) {
      return { eligible: false, reason: "FI period has closed for this payment", currentStatus: payment.status };
    }

    return { eligible: true, currentStatus: payment.status };
  }

  async cancelReceipt(cancellation: {
    payId: string;
    cancellationReason: string;
    cancelledBy: string;
    cancellationDate: Date;
    originalStatus: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const payment = this.paymentDetails.find(p => p.payId === cancellation.payId);
      if (!payment) {
        return { success: false, error: "Payment not found" };
      }

      // Update payment status
      payment.status = "CANCELLED";
      payment.updateId = cancellation.cancelledBy;
      payment.updateDt = cancellation.cancellationDate;
      payment.updateTs = cancellation.cancellationDate;

      // Create cancellation record
      const cancellationRecord = {
        payId: cancellation.payId,
        cancellationReason: cancellation.cancellationReason,
        cancelledBy: cancellation.cancelledBy,
        cancellationDate: cancellation.cancellationDate,
        originalStatus: cancellation.originalStatus,
        cmStatus: "PENDING",
        cmStatusMsg: "Cancellation initiated",
        ficaStatus: "PENDING",
        ficaStatusMsg: "Awaiting reversal processing"
      };

      this.receiptCancellations.push(cancellationRecord);

      return { 
        success: true, 
        data: { 
          cancellation: cancellationRecord,
          paymentDetails: payment
        }
      };
    } catch (error) {
      return { success: false, error: "Failed to process cancellation" };
    }
  }

  async updateCancellationCMStatus(payId: string, cmUpdate: {
    cmRequestId?: string;
    cmStatus?: string;
    cmStatusMsg?: string;
    ficaStatus?: string;
    ficaStatusMsg?: string;
  }): Promise<void> {
    const cancellation = this.receiptCancellations.find(c => c.payId === payId);
    if (cancellation) {
      Object.assign(cancellation, cmUpdate);
    }
  }

  async adjustWalletForCancellation(customerId: string, amount: number): Promise<any> {
    // Mock wallet adjustment - in real implementation, this would update customer wallet
    return {
      customerId,
      adjustmentAmount: amount,
      adjustmentType: "CREDIT",
      adjustmentReason: "Receipt cancellation refund",
      newBalance: 150000 + amount, // Mock previous balance + adjustment
      adjustmentDate: new Date()
    };
  }

  async getCancellationAuditTrail(payId: string): Promise<any | null> {
    const cancellation = this.receiptCancellations.find(c => c.payId === payId);
    if (!cancellation) return null;

    return {
      payId,
      auditTrail: [
        {
          action: "CANCELLATION_INITIATED",
          performedBy: cancellation.cancelledBy,
          timestamp: cancellation.cancellationDate,
          details: `Cancellation initiated: ${cancellation.cancellationReason}`
        },
        {
          action: "CM_STATUS_UPDATE",
          performedBy: "SYSTEM",
          timestamp: new Date(),
          details: `CM Status: ${cancellation.cmStatus} - ${cancellation.cmStatusMsg}`
        },
        {
          action: "FICA_STATUS_UPDATE", 
          performedBy: "SYSTEM",
          timestamp: new Date(),
          details: `FICA Status: ${cancellation.ficaStatus} - ${cancellation.ficaStatusMsg}`
        }
      ]
    };
  }

  async getCancellationStatus(payId: string): Promise<any | null> {
    const cancellation = this.receiptCancellations.find(c => c.payId === payId);
    if (!cancellation) return null;

    return {
      payId,
      cancellationStatus: "PROCESSING",
      cmStatus: cancellation.cmStatus,
      cmStatusMsg: cancellation.cmStatusMsg,
      ficaStatus: cancellation.ficaStatus,
      ficaStatusMsg: cancellation.ficaStatusMsg,
      lastUpdated: new Date()
    };
  }

  // Customer Transfer operations
  private customerTransfers: CustomerTransfer[] = [];
  private nextCustomerTransferId = 1;

  async getCustomerTransfers(): Promise<CustomerTransfer[]> {
    return this.customerTransfers;
  }

  async getCustomerTransferById(id: number): Promise<CustomerTransfer | null> {
    return this.customerTransfers.find(t => t.id === id) || null;
  }

  async createCustomerTransfer(transfer: Omit<CustomerTransfer, "id" | "createDt" | "createTs">): Promise<CustomerTransfer> {
    const now = new Date();
    const newTransfer: CustomerTransfer = {
      ...transfer,
      id: this.nextCustomerTransferId++,
      createDt: now,
      createTs: now
    };
    this.customerTransfers.push(newTransfer);
    return newTransfer;
  }

  async updateCustomerTransfer(id: number, transfer: Partial<CustomerTransfer>): Promise<CustomerTransfer | null> {
    const index = this.customerTransfers.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTransfer = {
      ...this.customerTransfers[index],
      ...transfer,
      updateDt: new Date(),
      updateTs: new Date()
    };
    this.customerTransfers[index] = updatedTransfer;
    return updatedTransfer;
  }

  async validateTransferEligibility(sourceCustomerId: number, targetCustomerId: number, amount: number): Promise<{ 
    eligible: boolean; 
    reason?: string;
    sourceCustomer?: Customer;
    targetCustomer?: Customer;
    availablePayments?: Payment[];
  }> {
    const sourceCustomer = await this.getCustomerById(sourceCustomerId);
    const targetCustomer = await this.getCustomerById(targetCustomerId);

    if (!sourceCustomer) {
      return { eligible: false, reason: "Source customer not found" };
    }

    if (!targetCustomer) {
      return { eligible: false, reason: "Target customer not found" };
    }

    if (sourceCustomerId === targetCustomerId) {
      return { eligible: false, reason: "Cannot transfer payment to the same customer" };
    }

    // Check for available payments for the source customer
    const availablePayments = this.payments.filter(p => 
      p.customerId === sourceCustomerId && 
      p.status === 'COMPLETED' &&
      p.amount >= amount
    );

    if (availablePayments.length === 0) {
      return { 
        eligible: false, 
        reason: "No eligible payments found for the source customer",
        sourceCustomer,
        targetCustomer
      };
    }

    return {
      eligible: true,
      sourceCustomer,
      targetCustomer,
      availablePayments
    };
  }

  async checkInvoiceStatus(invoiceNumber: string): Promise<{
    status: 'CLEARED' | 'PENDING';
    requiresManualIntervention: boolean;
  }> {
    // Mock invoice status check - in real implementation, this would query SAP FICA
    const isCleared = Math.random() > 0.7; // 30% chance invoice is already cleared
    
    return {
      status: isCleared ? 'CLEARED' : 'PENDING',
      requiresManualIntervention: isCleared
    };
  }

  async updateTransferCMStatus(transferId: number, cmUpdate: {
    cmStatus?: string;
    cmStatusMessage?: string;
    ficaStatus?: string;
    ficaStatusMessage?: string;
    somStatus?: string;
    somStatusMessage?: string;
    requestId?: string;
  }): Promise<void> {
    const transfer = this.customerTransfers.find(t => t.id === transferId);
    if (transfer) {
      Object.assign(transfer, cmUpdate, {
        updateDt: new Date(),
        updateTs: new Date()
      });
    }
  }

  // Adjustment operations
  private adjustments: Adjustment[] = [
    {
      id: 1,
      bpId: "BP10001",
      scId: "SC20001",
      customerName: "John Doe",
      type: "CREDIT",
      invoiceNumber: "INV-12345",
      reason: "Overcharge Correction",
      comments: "Customer complaint regarding duplicate charge",
      amount: 50000,
      currency: "TZS",
      walletType: "SUBSCRIPTION",
      vatType: "VAT",
      status: "PENDING",
      requestedBy: "admin",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      bpId: "BP10002",
      scId: "SC20002",
      customerName: "Jane Smith",
      type: "DEBIT",
      invoiceNumber: "INV-54321",
      reason: "Service Fee Adjustment",
      comments: "Additional service charges",
      amount: 25000,
      currency: "TZS",
      walletType: "HW",
      vatType: "NO_VAT",
      status: "APPROVED",
      requestedBy: "agent",
      requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      approvedBy: "manager",
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      cmStatus: "PROCESSED",
      cmStatusMessage: "Successfully posted to CM",
      ficaStatus: "COMPLETED",
      ficaStatusMessage: "Amount adjusted in customer account"
    },
    {
      id: 3,
      bpId: "BP10003",
      customerName: "Bob Johnson",
      type: "CREDIT",
      reason: "Refund Processing",
      comments: "Service cancellation refund",
      amount: 75000,
      currency: "TZS",
      walletType: "PREPAID",
      vatType: "VAT",
      status: "PROCESSED",
      requestedBy: "admin",
      requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      approvedBy: "admin",
      approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      cmStatus: "COMPLETED",
      cmStatusMessage: "Refund processed successfully",
      ficaStatus: "COMPLETED",
      ficaStatusMessage: "Customer wallet credited"
    }
  ];
  private nextAdjustmentId = 4;

  async getAdjustments(): Promise<Adjustment[]> {
    return this.adjustments;
  }

  async getAdjustmentById(id: number): Promise<Adjustment | null> {
    return this.adjustments.find(adj => adj.id === id) || null;
  }

  async createAdjustment(adjustment: Omit<Adjustment, "id" | "requestedAt">): Promise<Adjustment> {
    const newAdjustment: Adjustment = {
      ...adjustment,
      id: this.nextAdjustmentId++,
      requestedAt: new Date()
    };
    this.adjustments.push(newAdjustment);
    return newAdjustment;
  }

  async updateAdjustment(id: number, adjustment: Partial<Adjustment>): Promise<Adjustment | null> {
    const index = this.adjustments.findIndex(adj => adj.id === id);
    if (index === -1) return null;

    this.adjustments[index] = { ...this.adjustments[index], ...adjustment };
    return this.adjustments[index];
  }

  async approveAdjustment(id: number, approvedBy: string): Promise<Adjustment | null> {
    const adjustment = await this.getAdjustmentById(id);
    if (!adjustment) return null;

    const updatedAdjustment = await this.updateAdjustment(id, {
      status: 'APPROVED',
      approvedBy,
      approvedAt: new Date(),
      cmStatus: 'PROCESSING',
      cmStatusMessage: 'Adjustment approved and being processed'
    });

    // Simulate CM processing
    setTimeout(async () => {
      await this.updateAdjustment(id, {
        status: 'PROCESSED',
        processedAt: new Date(),
        cmStatus: 'COMPLETED',
        cmStatusMessage: 'Adjustment successfully posted to CM',
        ficaStatus: 'COMPLETED',
        ficaStatusMessage: 'Customer account updated'
      });
    }, 3000);

    return updatedAdjustment;
  }

  async rejectAdjustment(id: number, rejectedBy: string, rejectionReason: string): Promise<Adjustment | null> {
    return this.updateAdjustment(id, {
      status: 'REJECTED',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason
    });
  }

  async getCustomerDetailsByBpId(bpId: string): Promise<CustomerDetails | null> {
    // Mock customer data lookup
    const mockCustomers: { [key: string]: CustomerDetails } = {
      "BP10001": {
        bpId: "BP10001",
        scId: "SC20001",
        name: "John Doe",
        customerType: "Individual",
        accountType: "Prepaid",
        balance: 120000,
        currency: "TZS",
        subscription: "Active Premium",
        status: "Active",
        phone: "+255712345678",
        email: "john.doe@example.com"
      },
      "BP10002": {
        bpId: "BP10002",
        scId: "SC20002",
        name: "Jane Smith",
        customerType: "Corporate",
        accountType: "Postpaid",
        balance: 250000,
        currency: "TZS",
        subscription: "Active Business",
        status: "Active",
        phone: "+255712345679",
        email: "jane.smith@company.com"
      },
      "BP10003": {
        bpId: "BP10003",
        name: "Bob Johnson",
        customerType: "Individual",
        accountType: "Agent",
        balance: 500000,
        currency: "TZS",
        subscription: "Agent Account",
        status: "Active",
        phone: "+255712345680",
        email: "bob.johnson@example.com"
      }
    };

    return mockCustomers[bpId] || null;
  }

  async getCustomerDetailsByScId(scId: string): Promise<CustomerDetails | null> {
    // Find customer by SC ID
    const mockCustomers = await this.getCustomerDetailsByBpId("BP10001");
    if (mockCustomers?.scId === scId) return mockCustomers;
    
    const customer2 = await this.getCustomerDetailsByBpId("BP10002");
    if (customer2?.scId === scId) return customer2;
    
    return null;
  }

  async getPendingAdjustments(): Promise<Adjustment[]> {
    return this.adjustments.filter(adj => adj.status === 'PENDING');
  }

  async getProcessedAdjustments(): Promise<Adjustment[]> {
    return this.adjustments.filter(adj => adj.status === 'PROCESSED');
  }

  // Mock data for reports
  private dailyReports: DailyReport[] = [];
  private traReports: TRAReport[] = [];
  private tcraReports: TCRAReport[] = [];
  private reportAuditLogs: ReportAuditLog[] = [];

  // Report operations implementation
  async getDailyReports(dateFrom?: string, dateTo?: string, region?: string): Promise<DailyReport[]> {
    let reports = this.dailyReports;
    
    if (dateFrom) {
      reports = reports.filter(r => r.reportDate >= new Date(dateFrom));
    }
    if (dateTo) {
      reports = reports.filter(r => r.reportDate <= new Date(dateTo));
    }
    if (region) {
      reports = reports.filter(r => r.region === region);
    }
    
    return reports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }

  async getDailyReportById(id: number): Promise<DailyReport | null> {
    return this.dailyReports.find(r => r.id === id) || null;
  }

  async generateDailyReport(reportDate: Date, reportType: string, region?: string): Promise<DailyReport> {
    const id = this.dailyReports.length + 1;
    
    // Generate mock data based on actual data
    const paymentsToday = this.payments.filter(p => 
      p.createdAt && new Date(p.createdAt).toDateString() === reportDate.toDateString()
    );
    
    const subscriptionsToday = this.subscriptions.filter(s => 
      s.createdAt && new Date(s.createdAt).toDateString() === reportDate.toDateString()
    );

    const report: DailyReport = {
      id,
      reportDate,
      reportType: reportType as any,
      totalTransactions: paymentsToday.length + subscriptionsToday.length,
      totalPayments: paymentsToday.reduce((sum, p) => sum + p.amount, 0),
      totalSubscriptions: subscriptionsToday.length,
      totalHardwareSales: paymentsToday.filter(p => p.type === 'hardware_sale').length,
      totalVAT: paymentsToday.reduce((sum, p) => sum + (p.amount * 0.18), 0),
      totalRevenue: paymentsToday.reduce((sum, p) => sum + p.amount, 0),
      activeAgents: this.agents.filter(a => a.status === 'approved').length,
      agentTransactions: Math.floor(Math.random() * 50) + 10,
      otcTransactions: Math.floor(Math.random() * 30) + 5,
      customerTransactions: Math.floor(Math.random() * 100) + 20,
      reconciliationStatus: 'COMPLETED',
      generatedBy: 'system',
      generatedAt: new Date(),
      region: region || 'All Regions',
      currency: 'TSH'
    };

    this.dailyReports.push(report);
    return report;
  }

  async getTRAReports(dateFrom?: string, dateTo?: string): Promise<TRAReport[]> {
    let reports = this.traReports;
    
    if (dateFrom) {
      reports = reports.filter(r => r.reportDate >= new Date(dateFrom));
    }
    if (dateTo) {
      reports = reports.filter(r => r.reportDate <= new Date(dateTo));
    }
    
    return reports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }

  async getTRAReportById(id: number): Promise<TRAReport | null> {
    return this.traReports.find(r => r.id === id) || null;
  }

  async generateTRAReport(reportDate: Date, reportType: string): Promise<TRAReport> {
    const id = this.traReports.length + 1;
    
    const totalRevenue = this.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalVAT = totalRevenue * 0.18;

    const report: TRAReport = {
      id,
      reportDate,
      reportType: reportType as any,
      vatableAmount: totalRevenue,
      vatExemptAmount: 0,
      totalVAT,
      vatRate: 18,
      totalInvoices: this.payments.length,
      subscriptionInvoices: this.payments.filter(p => p.type === 'subscription').length,
      hardwareInvoices: this.payments.filter(p => p.type === 'hardware_sale').length,
      invoiceAmountTotal: totalRevenue,
      traApiStatus: 'SUCCESS',
      traApiRequestId: `TRA_${Date.now()}`,
      traApiResponseCode: '200',
      traApiMessage: 'Successfully submitted to TRA',
      taxableTransactions: this.payments.filter(p => p.amount > 0).length,
      exemptTransactions: 0,
      generatedBy: 'system',
      generatedAt: new Date(),
      submittedToTRA: true,
      submissionDate: new Date(),
      currency: 'TSH'
    };

    this.traReports.push(report);
    return report;
  }

  async getTCRAReports(dateFrom?: string, dateTo?: string, region?: string): Promise<TCRAReport[]> {
    let reports = this.tcraReports;
    
    if (dateFrom) {
      reports = reports.filter(r => r.reportDate >= new Date(dateFrom));
    }
    if (dateTo) {
      reports = reports.filter(r => r.reportDate <= new Date(dateTo));
    }
    if (region) {
      reports = reports.filter(r => r.region === region);
    }
    
    return reports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }

  async getTCRAReportById(id: number): Promise<TCRAReport | null> {
    return this.tcraReports.find(r => r.id === id) || null;
  }

  async generateTCRAReport(reportDate: Date, reportType: string, region?: string): Promise<TCRAReport> {
    const id = this.tcraReports.length + 1;
    
    const activeSubscriptions = this.subscriptions.filter(s => s.status === 'active');

    const report: TCRAReport = {
      id,
      reportDate,
      reportType: reportType as any,
      newActivations: Math.floor(Math.random() * 20) + 5,
      renewals: Math.floor(Math.random() * 50) + 10,
      suspensions: Math.floor(Math.random() * 5) + 1,
      disconnections: Math.floor(Math.random() * 3) + 1,
      planChanges: Math.floor(Math.random() * 15) + 2,
      nagraProvisioningSuccess: Math.floor(Math.random() * 60) + 40,
      nagraProvisioningFailed: Math.floor(Math.random() * 5) + 1,
      nagraApiCalls: Math.floor(Math.random() * 100) + 50,
      tcraApiStatus: 'SUCCESS',
      tcraApiRequestId: `TCRA_${Date.now()}`,
      tcraApiResponseCode: '200',
      tcraApiMessage: 'Successfully submitted to TCRA',
      totalActiveSubscribers: activeSubscriptions.length,
      newSubscribers: Math.floor(Math.random() * 25) + 10,
      churnedSubscribers: Math.floor(Math.random() * 8) + 2,
      generatedBy: 'system',
      generatedAt: new Date(),
      submittedToTCRA: true,
      submissionDate: new Date(),
      region: region || 'All Regions'
    };

    this.tcraReports.push(report);
    return report;
  }

  async getReportAuditLogs(reportType?: string, reportId?: number): Promise<ReportAuditLog[]> {
    let logs = this.reportAuditLogs;
    
    if (reportType) {
      logs = logs.filter(l => l.reportType === reportType);
    }
    if (reportId) {
      logs = logs.filter(l => l.reportId === reportId);
    }
    
    return logs.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
  }

  async createReportAuditLog(auditLog: Omit<ReportAuditLog, "id" | "performedAt">): Promise<ReportAuditLog> {
    const id = this.reportAuditLogs.length + 1;
    const log: ReportAuditLog = {
      ...auditLog,
      id,
      performedAt: new Date()
    };

    this.reportAuditLogs.push(log);
    return log;
  }
}

// Export storage instance
export const storage = new MemStorage();