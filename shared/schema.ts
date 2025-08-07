import { z } from "zod";

// === CORE TYPE DEFINITIONS ===
// Organized type definitions with better structure and validation

// === ENUMS FOR TYPE SAFETY ===
export const UserRole = {
  ADMIN: 'admin',
  AGENT: 'agent', 
  MANAGER: 'manager',
  KYC: 'kyc',
  USER: 'user'
} as const;

export const AgentType = {
  INDIVIDUAL: 'individual',
  CORPORATE: 'corporate'
} as const;

export const CustomerType = {
  PREPAID: 'prepaid',
  POSTPAID: 'postpaid'
} as const;

export const InventoryStatus = {
  AVAILABLE: 'available',
  ALLOCATED: 'allocated',
  SOLD: 'sold',
  FAULTY: 'faulty',
  RETURNED: 'returned'
} as const;

export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export const PaymentMode = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  BANK_DEPOSIT: 'BANK_DEPOSIT',
  POS: 'POS',
  MOBILE_MONEY: 'MOBILE_MONEY',
  AZAM_PAY: 'AZAM_PAY',
  DPO: 'DPO'
} as const;

export const PaymentType = {
  HARDWARE: 'Hardware',
  SUBSCRIPTION: 'Subscription'
} as const;

export const SubscriptionStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
} as const;

// === INCIDENT MANAGEMENT ENUMS ===
// === SERVICE TICKETING ENUMS ===
export const TicketType = {
  HARDWARE: 'Hardware',
  SUBSCRIPTION: 'Subscription',
  BILLING: 'Billing',
  TECHNICAL: 'Technical'
} as const;

export const TicketPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
} as const;

export const TicketStatus = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
} as const;

export const TicketChannel = {
  PORTAL: 'Portal',
  OTC: 'OTC',
  CALL_CENTER: 'Call Center'
} as const;

export const TicketAssignmentGroup = {
  TECHNICAL_SUPPORT: 'Technical Support',
  HARDWARE_TEAM: 'Hardware Team',
  BILLING_TEAM: 'Billing Team',
  SUBSCRIPTION_TEAM: 'Subscription Team',
  FIELD_OPERATIONS: 'Field Operations'
} as const;

// === INCIDENT MANAGEMENT ENUMS ===
export const IncidentSeverity = {
  CRITICAL: 'Critical',
  MAJOR: 'Major',
  MINOR: 'Minor'
} as const;

export const IncidentStatus = {
  OPEN: 'Open',
  INVESTIGATING: 'Investigating',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
} as const;

export const AffectedSystem = {
  PORTAL: 'Portal',
  CM: 'CM',
  SOM: 'SOM',
  CC: 'CC',
  CI: 'CI',
  NAGRA: 'NAGRA'
} as const;

// === BASE TYPES ===
export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  resetOtp?: string;
  otpExpiry?: Date;
  createdAt?: Date;
}

export interface Agent {
  id: number;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  fax?: string;
  type: string;
  country: string;
  region: string;
  city: string;
  district: string;
  ward: string;
  address1: string;
  address2?: string;
  postalCode?: string;
  tinNumber: string;
  vrnNumber?: string;
  currency: string;
  parentId?: string;
  creditLimit?: number;
  role: string;
  status: string;
  statusMessage?: string;
  kycDocuments?: any;
  kycDocId?: string;
  kycDocNo?: string;
  commission?: number;
  onboardingRefNo?: string;
  sapBpId?: string;
  sapCaId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  id: number;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: Date;
  race?: string;
  phone: string;
  altPhone?: string;
  mobile: string;
  email?: string;
  altEmail?: string;
  fax?: string;
  orgName?: string;
  customerType: string;
  serviceType: string;
  accountClass: string;
  connectionType: string;
  smsFlag?: boolean;
  addressType: string;
  country: string;
  region: string;
  city: string;
  district: string;
  ward: string;
  address1: string;
  address2?: string;
  postalCode?: string;
  parentCustomerId?: number;
  tinNumber?: string;
  vrnNumber?: string;
  currency: string;
  azamPayId?: string;
  azamMaxTvId?: string;
  sapBpId?: string;
  sapCaId?: string;
  kycDocuments?: any;
  onboardingRefNo?: string;
  createdAt?: Date;
}

export interface InventoryItem {
  id: number;
  materialCode: string;
  materialName: string;
  materialType: string;
  serialNumber: string;
  casId?: string;
  state: string;
  status: string;
  owner: string;
  createId: string;
  createDt?: Date;
  createTs?: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
}

export interface InventoryRequest {
  id: number;
  sapBpId?: string;
  sapCaId?: string;
  module: string;
  salesOrg?: string;
  division?: string;
  requestType: string;
  requestId: string;
  itemType: string;
  itemQty: string;
  itemSerialNo?: string;
  itemAmount?: number;
  totalAmount?: number;
  vatAmount?: number;
  transferFrom?: string;
  transferTo?: string;
  status: string;
  createId: string;
  createDt?: Date;
  createTs?: Date;
  updateDt?: Date;
  updateTs?: Date;
  updateId?: string;
  cmStatus?: string;
  cmStatusMsg?: string;
  sapSoId?: string;
}

export interface Payment {
  id: number;
  customerId: number;
  amount: number;
  currency: string;
  paymentMode: string;
  referenceNumber?: string;
  type: string;
  status: string;
  receiptNumber?: string;
  createdAt?: Date;
}

export interface CustomerTransfer {
  id: number;
  sourceBpId: string;
  targetBpId: string;
  sourceCustomerId: number;
  targetCustomerId: number;
  transferAmount: number;
  currency: string;
  transferReason: string;
  paymentType: string; // 'SUBSCRIPTION'
  paymentId?: number;
  invoiceNumber?: string;
  invoiceStatus?: 'CLEARED' | 'PENDING' | 'MANUAL_INTERVENTION_REQUIRED';
  manualInterventionRequired: boolean;
  status: 'INPROGRESS' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  cmStatus?: string;
  cmStatusMessage?: string;
  ficaStatus?: string;
  ficaStatusMessage?: string;
  somStatus?: string;
  somStatusMessage?: string;
  requestId?: string;
  createId: string;
  createDt: Date;
  createTs: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
}

export interface CustomerTransferRequest {
  sourceBpId: string;
  targetBpId: string;
  sourceCustomerId: number;
  targetCustomerId: number;
  transferAmount: number;
  currency: string;
  transferReason: string;
  paymentType: string;
  paymentId?: number;
  invoiceNumber?: string;
}

export interface Adjustment {
  id: number;
  bpId: string;
  scId?: string;
  customerName: string;
  type: 'CREDIT' | 'DEBIT';
  invoiceNumber?: string;
  reason: string;
  comments?: string;
  amount: number;
  currency: string;
  walletType: 'HW' | 'SUBSCRIPTION' | 'PREPAID';
  vatType: 'VAT' | 'NO_VAT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  cmRequestId?: string;
  cmStatus?: string;
  cmStatusMessage?: string;
  ficaStatus?: string;
  ficaStatusMessage?: string;
  processedAt?: Date;
}

export interface AdjustmentRequest {
  bpId: string;
  scId?: string;
  type: 'CREDIT' | 'DEBIT';
  invoiceNumber?: string;
  reason: string;
  comments?: string;
  amount: number;
  currency: string;
  walletType: 'HW' | 'SUBSCRIPTION' | 'PREPAID';
  vatType: 'VAT' | 'NO_VAT';
}

export interface CustomerDetails {
  bpId: string;
  scId?: string;
  name: string;
  customerType: string;
  accountType: string;
  balance: number;
  currency: string;
  subscription?: string;
  status: string;
  phone?: string;
  email?: string;
}

export interface Subscription {
  id: number;
  customerId: number;
  smartCardNumber: string;
  plan: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  activationType: string;
  status: string;
  createdAt?: Date;
}

export interface AddOnPack {
  id: string;
  name: string;
  type: string;
  description: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  duration: number; // in days
  channels: number;
  features: string[];
  category: string;
  isActive: boolean;
}

export interface CustomerAddOn {
  id: number;
  customerId: number;
  sapBpId: string;
  sapCaId: string;
  sapContractId: string;
  smartCardNumber: string;
  addOnPackId: string;
  addOnPackName: string;
  planAmount: number;
  vatAmount: number;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  autoRenewalFlag: boolean;
  status: string; // Active, Expired, Disconnected
  requestId?: string;
  cmStatus?: string;
  cmStatusMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddOnPurchaseRequest {
  customerId: number;
  smartCardNumber: string;
  addOnPackId: string;
  paymentMode: 'wallet' | 'online' | 'agent';
  prorationAmount: number;
  autoRenewal: boolean;
}

export interface CustomerTermination {
  id: number;
  customerId: number;
  sapBpId: string;
  sapCaId: string;
  sapContractId: string;
  smartCardNumber: string;
  actionType: string;
  actionSubtype: string;
  requestId: string;
  planType: string;
  planId: string;
  planName: string;
  bundleName?: string;
  division?: string;
  planRate: number;
  planAmount: number;
  vatAmount: number;
  startDate: Date;
  endDate: Date;
  status: string; // INPROGRESS/APPROVED/COMPLETED
  createId: string;
  createDt: Date;
  createTs: Date;
  updateDt?: Date;
  updateTs?: Date;
  updateId?: string;
  cmStatus?: string;
  cmStatusMessage?: string;
}

export interface TerminationRequest {
  customerId: number;
  smartCardNumber: string;
  terminationReason: string;
  notes?: string;
  actionType: 'TERMINATION';
  actionSubtype: 'PERMANENT_DISCONNECTION';
}

export interface CustomerReplacement {
  id: number;
  customerId: number;
  sapBpId: string;
  sapCaId: string;
  sapContractId: string;
  smartCardNumber: string;
  oldStbSerialNumber: string;
  newStbSerialNumber: string;
  oldSmartCardNumber?: string;
  newSmartCardNumber?: string;
  replacementType: 'OTC_IN_WARRANTY' | 'OTC_OUT_WARRANTY' | 'AGENT_IN_WARRANTY' | 'AGENT_OUT_WARRANTY';
  replacementReason: string;
  issuingCenter?: string;
  returnCenter?: string;
  warrantyStatus: 'IN_WARRANTY' | 'OUT_WARRANTY';
  chargeAmount: number;
  isFreeReplacement: boolean;
  subscriptionAdvanceMonths?: number;
  requestId: string;
  status: string; // PENDING/APPROVED/COMPLETED
  createId: string;
  createDt: Date;
  cmStatus?: string;
  cmStatusMessage?: string;
}

export interface ReplacementRequest {
  customerId: number;
  smartCardNumber: string;
  oldStbSerialNumber: string;
  newStbSerialNumber: string;
  replacementType: string;
  replacementReason: string;
  issuingCenter?: string;
  returnCenter?: string;
  subscriptionAdvanceMonths?: number;
  notes?: string;
}

export interface SubscriberDetails {
  customerId: string;
  sapBpId: string;
  sapCaId: string;
  sapContractId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  smartCardNumber: string;
  stbSerialNumber: string;
  customerType: 'PREPAID' | 'POSTPAID';
  accountClass: 'RESIDENTIAL' | 'COMMERCIAL' | 'CORPORATE';
  connectionDate: string;
  lastPaymentDate?: string;
  walletBalance: number;
  currentSubscription: {
    planId: string;
    planName: string;
    planType: 'PREPAID' | 'POSTPAID';
    amount: number;
    vatAmount: number;
    totalAmount: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'DISCONNECTED' | 'TERMINATED';
    autoRenewal: boolean;
  };
  addOns: Array<{
    id: string;
    name: string;
    amount: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED';
  }>;
  hardware: {
    stbModel: string;
    stbSerialNumber: string;
    smartCardNumber: string;
    purchaseDate: string;
    warrantyEndDate: string;
    condition: 'WORKING' | 'FAULTY' | 'REPLACED';
  };
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
}

export interface SubscriptionHistory {
  id: number;
  customerId: string;
  planId: string;
  planName: string;
  amount: number;
  transactionType: 'PURCHASE' | 'RENEWAL' | 'PLAN_CHANGE' | 'OFFER_CHANGE' | 'SUSPENSION' | 'RECONNECTION';
  paymentMethod: 'WALLET' | 'MOBILE_MONEY' | 'CASH' | 'CARD';
  transactionDate: string;
  startDate: string;
  endDate: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  notes?: string;
}

// === SERVICE TICKETING INTERFACES ===
export interface ServiceTicket {
  id: number;
  ticketId: string;
  ticketType: 'Hardware' | 'Subscription' | 'Billing' | 'Technical';
  smartCardNumber?: string;
  customerId?: string;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  channel: 'Portal' | 'OTC' | 'Call Center';
  attachments?: string[];
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  
  // Auto-filled Fields
  userInfo: string; // Auto-filled from current user
  userLocation: string; // Auto-filled from user location
  createdOn: Date; // Auto-filled timestamp
  
  // Assignment
  assignmentGroup?: string; // Dropdown for assignment group
  assignee?: string; // Individual assignee within group
  
  // Work Notes / Comments
  workNotes?: string; // Internal updates or agent remarks
  comments?: WorkNote[]; // Array of work notes with timestamps
  
  // Incident Linking
  linkedIncidentIds?: string[]; // IDs of related system incidents
  
  // Notification Settings
  notificationSettings?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    notifyOnUpdate: boolean;
    stakeholders?: string[]; // Email addresses for notifications
  };
  
  // Legacy fields (for backward compatibility)
  assignedGroup?: string;
  slaTimer?: Date;
  location?: string;
  timestamp: Date;
  resolutionNotes?: string;
  routingInfo?: {
    vendor?: string;
    approval?: boolean;
    rfi?: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkNote {
  id: string;
  ticketId: number;
  userId: string;
  userName: string;
  note: string;
  isInternal: boolean; // true for work notes, false for customer-facing comments
  createdAt: Date;
}

export interface ServiceTicketComment {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  comment: string;
  isInternal: boolean;
  createdAt: Date;
}

// === INCIDENT MANAGEMENT INTERFACES ===
export interface SystemIncident {
  id: number;
  incidentId: string;
  title: string;
  affectedSystem: 'Portal' | 'CM' | 'SOM' | 'CC' | 'CI' | 'NAGRA';
  severity: 'Critical' | 'Major' | 'Minor';
  description: string;
  startTime: Date;
  endTime?: Date;
  impactedCustomers?: number;
  rootCause?: string;
  resolutionSteps?: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  assignedOwner?: string;
  ownerTeam?: 'Technical' | 'Operations';
  // New fields for missing requirements
  attachments?: string[]; // For logs, screenshots, or error reports
  notificationSettings?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    stakeholders: string[]; // Email addresses of stakeholders
  };
  linkedServiceTickets?: number[]; // Array of related service ticket IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemIncidentNote {
  id: number;
  incidentId: number;
  userId: number;
  userName: string;
  note: string;
  isRCA: boolean; // Root Cause Analysis
  createdAt: Date;
}

export interface SystemIncidentAudit {
  id: number;
  incidentId: number;
  userId: number;
  userName: string;
  action: 'created' | 'updated' | 'status_changed' | 'assigned' | 'commented' | 'attached_file';
  oldValue?: string;
  newValue?: string;
  details?: string;
  createdAt: Date;
}

export interface PaymentHistory {
  id: number;
  customerId: string;
  amount: number;
  paymentType: 'HARDWARE' | 'SUBSCRIPTION' | 'ADD_ON';
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'WALLET';
  transactionDate: string;
  receiptNumber: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  description: string;
}

// === REPORTING INTERFACES ===

export interface DailyReport {
  id: number;
  reportDate: Date;
  reportType: 'daily_transactions' | 'agent_summary' | 'reconciliation';
  
  // Transaction Summary
  totalTransactions: number;
  totalPayments: number;
  totalSubscriptions: number;
  totalHardwareSales: number;
  totalVAT: number;
  totalRevenue: number;
  
  // Agent Activity
  activeAgents: number;
  agentTransactions: number;
  otcTransactions: number;
  customerTransactions: number;
  
  // Reconciliation Data
  reconciliationStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  reconciliationNotes?: string;
  
  // Metadata
  generatedBy: string;
  generatedAt: Date;
  region?: string;
  currency: string;
}

export interface TRAReport {
  id: number;
  reportDate: Date;
  reportType: 'vat_breakdown' | 'invoice_posting' | 'compliance';
  
  // VAT Information
  vatableAmount: number;
  vatExemptAmount: number;
  totalVAT: number;
  vatRate: number; // Usually 18%
  
  // Invoice Details
  totalInvoices: number;
  subscriptionInvoices: number;
  hardwareInvoices: number;
  invoiceAmountTotal: number;
  
  // TRA API Integration
  traApiStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  traApiRequestId?: string;
  traApiResponseCode?: string;
  traApiMessage?: string;
  
  // Compliance Data
  taxableTransactions: number;
  exemptTransactions: number;
  
  // Metadata
  generatedBy: string;
  generatedAt: Date;
  submittedToTRA: boolean;
  submissionDate?: Date;
  currency: string;
}

export interface TCRAReport {
  id: number;
  reportDate: Date;
  reportType: 'subscription_activations' | 'plan_changes' | 'provisioning_logs';
  
  // Subscription Activities
  newActivations: number;
  renewals: number;
  suspensions: number;
  disconnections: number;
  planChanges: number;
  
  // NAGRA Provisioning
  nagraProvisioningSuccess: number;
  nagraProvisioningFailed: number;
  nagraApiCalls: number;
  
  // TCRA API Integration
  tcraApiStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  tcraApiRequestId?: string;
  tcraApiResponseCode?: string;
  tcraApiMessage?: string;
  
  // Subscriber Data
  totalActiveSubscribers: number;
  newSubscribers: number;
  churnedSubscribers: number;
  
  // Metadata
  generatedBy: string;
  generatedAt: Date;
  submittedToTCRA: boolean;
  submissionDate?: Date;
  region?: string;
}

export interface ReportAuditLog {
  id: number;
  reportType: 'DAILY' | 'TRA' | 'TCRA';
  reportId: number;
  action: 'GENERATED' | 'VIEWED' | 'EXPORTED' | 'SUBMITTED';
  performedBy: string;
  performedAt: Date;
  userRole: string;
  ipAddress?: string;
  exportFormat?: 'PDF' | 'EXCEL';
  downloadPath?: string;
}

export interface AgentReplacement {
  id: number;
  sapBpId: string;
  sapCaId: string;
  requestType: string;
  requestId: string;
  itemType: string;
  itemQty: string;
  itemSerialNo: string;
  itemAmount: number;
  totalAmount: number;
  vatAmount: number;
  transferFrom: string;
  transferTo: string;
  status: string;
  createId: string;
  createDt: Date;
  createTs: Date;
  updateDt?: Date;
  updateTs?: Date;
  updateId?: string;
  cmStatus: string;
  cmStatusMsg?: string;
  sapSoId?: string;
  replacementCenter?: string;
  faultyReason?: string;
  replacementNotes?: string;
  agentName?: string;
  centerExecutive?: string;
  approvedBy?: string;
  approvedDate?: Date;
  completedDate?: Date;
}

export interface AgentFaultyRepair {
  id: number;
  itemId: number;
  materialCode: string;
  materialName: string;
  materialType: string;
  serialNumber: string;
  casId?: string;
  agentId: string;
  agentName: string;
  agentBpId: string;
  currentStatus: string;
  newStatus: string;
  faultyReason: string;
  repairNotes?: string;
  transferDate?: Date;
  repairCenter?: string;
  processedBy?: string;
  processedDate?: Date;
  createId: string;
  createDt: Date;
  createTs: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
}

export interface PaymentDetails {
  payId: number;
  sapBpId: string;
  sapCaId: string;
  module: string; // Agent / Customer / OTC
  payType: string; // Hardware / Subscription
  payAmount: number;
  vatAmount: number;
  payMode: string; // CASH / CHEQUE / AZAM PAY etc
  chequeNo?: string;
  bankName?: string;
  currency: string;
  onlPgId?: string; // Online Merchant Pay ID
  onlTransId?: string; // Online Portal Trans ID
  transId: string; // Portal Trans ID
  status: string; // Status of Payment
  description?: string;
  createId: string;
  createDt: Date;
  createTs: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
  approvedBy?: string;
  name: string; // Agent / Customer Name
  salesOrg: string; // SAP Sales Org
  division: string; // SAP Division
  cmStatus: string; // CM process status
  cmStatusMsg?: string; // CM status message
  collectedBy: string; // Payment Collected By
  collectionCenter: string; // Payment Collected Center
}

// Agent Payment Details for Subscription - Based on PAYMENT_DETAILS table
export interface AgentPaymentDetails {
  payId: string; // Primary Key - Payment ID
  sapBpId: string; // SAP Business Partner ID
  sapCaId: string; // SAP Customer Account ID
  customerId: string; // Customer ID
  customerName: string; // Customer Name
  payType: string; // Hardware/Subscription
  payAmount: number; // Payment Amount
  vatAmount: number; // VAT Amount (18%)
  totalAmount: number; // Total Amount (payAmount + vatAmount)
  payMode: string; // Payment Mode (CASH, CHEQUE, etc.)
  status: string; // Payment Status
  transId: string; // Transaction ID
  collectedBy: string; // Agent ID who collected payment
  collectionCenter: string; // Collection Center
  description?: string; // Payment Description
  receiptNo?: string; // Receipt Number
  chequeNo?: string; // Cheque Number (if applicable)
  bankRef?: string; // Bank Reference (if applicable)
  mobileRef?: string; // Mobile Money Reference (if applicable)
  createId: string;
  createDt: Date;
  createTs: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
  cmStatus?: string; // CM Integration Status
  cmStatusMsg?: string; // CM Status Message
  ficaStatus?: string; // FICA Integration Status
  ficaStatusMsg?: string; // FICA Status Message
}

// Receipt Cancellation Interface
export interface ReceiptCancellation {
  payId: string; // Payment ID being cancelled
  cancellationReason: string; // Reason for cancellation
  cancelledBy: string; // User ID who initiated cancellation
  cancellationDate: Date; // When cancellation was initiated
  cmRequestId?: string; // CM integration request ID
  cmStatus?: string; // CM cancellation status
  cmStatusMsg?: string; // CM status message
  ficaStatus?: string; // FICA reversal status
  ficaStatusMsg?: string; // FICA status message
  walletAdjustmentAmount?: number; // Amount credited to wallet
  originalStatus: string; // Original payment status before cancellation
}

export interface ReceiptCancellationRequest {
  payId: string;
  cancellationReason: string;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  role: z.string().default("user"),
  resetOtp: z.string().optional(),
  otpExpiry: z.date().optional(),
});

export const insertAgentSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  type: z.string().min(1),
  country: z.string().min(1),
  region: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  postalCode: z.string().optional(),
  tinNumber: z.string().min(1),
  vrnNumber: z.string().optional(),
  currency: z.string().default("TSH"),
  parentId: z.string().optional(),
  creditLimit: z.number().optional(),
  role: z.string().min(1),
  status: z.string().default("draft"),
  statusMessage: z.string().optional(),
  kycDocuments: z.any().optional(),
  kycDocId: z.string().optional(),
  kycDocNo: z.string().optional(),
  commission: z.number().default(5.00),
  onboardingRefNo: z.string().optional(),
  sapBpId: z.string().optional(),
  sapCaId: z.string().optional(),
});

export const insertCustomerSchema = z.object({
  title: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  gender: z.string().min(1),
  dateOfBirth: z.date().optional(),
  race: z.string().min(1),
  phone: z.string().min(1),
  altPhone: z.string().optional(),
  mobile: z.string().min(1),
  email: z.string().optional(),
  altEmail: z.string().optional(),
  fax: z.string().optional(),
  orgName: z.string().optional(),
  customerType: z.string().min(1),
  serviceType: z.string().min(1),
  accountClass: z.string().min(1),
  connectionType: z.string().min(1),
  smsFlag: z.boolean().default(true),
  addressType: z.string().min(1),
  country: z.string().min(1),
  region: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  postalCode: z.string().optional(),
  // Billing address fields
  billingAddressType: z.string().optional(),
  billingCountry: z.string().optional(),
  billingRegion: z.string().optional(),
  billingCity: z.string().optional(),
  billingDistrict: z.string().optional(),
  billingWard: z.string().optional(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingPostalCode: z.string().optional(),
  sameAsInstallation: z.boolean().default(false),
  parentCustomerId: z.number().optional(),
  newOrExisting: z.string().optional(),
  tinNumber: z.string().optional(),
  vrnNumber: z.string().optional(),
  currency: z.string().default("TSH"),
  azamPayId: z.string().optional(),
  azamMaxTvId: z.string().optional(),
  kycDocuments: z.any().optional(),
  onboardingRefNo: z.string().optional(),
});

export const insertInventoryItemSchema = z.object({
  materialCode: z.string().min(1),
  materialName: z.string().min(1),
  materialType: z.string().min(1),
  serialNumber: z.string().min(1),
  casId: z.string().optional(),
  state: z.string().default("FRESH"),
  status: z.string().default("AVAILABLE"),
  owner: z.string().min(1),
  createId: z.string().min(1),
  updateId: z.string().optional(),
  updateDt: z.date().optional(),
  updateTs: z.date().optional(),
});

export const insertInventoryRequestSchema = z.object({
  sapBpId: z.string().optional(),
  sapCaId: z.string().optional(),
  module: z.string().min(1),
  salesOrg: z.string().optional(),
  division: z.string().optional(),
  requestType: z.string().min(1),
  requestId: z.string().min(1),
  itemType: z.string().min(1),
  itemQty: z.string().min(1),
  itemSerialNo: z.string().optional(),
  itemAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  vatAmount: z.number().optional(),
  transferFrom: z.string().optional(),
  transferTo: z.string().optional(),
  status: z.string().default("INPROGRESS"),
  createId: z.string().min(1),
  updateDt: z.date().optional(),
  updateTs: z.date().optional(),
});

// Agent Payment Details Schema
export const insertAgentPaymentDetailsSchema = z.object({
  sapBpId: z.string().min(1),
  sapCaId: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  payType: z.enum(['Hardware', 'Subscription']),
  payAmount: z.number().positive(),
  vatAmount: z.number().min(0),
  totalAmount: z.number().positive(),
  payMode: z.enum(['CASH', 'CHEQUE', 'BANK_DEPOSIT', 'POS', 'MOBILE_MONEY', 'AZAM_PAY', 'DPO']),
  status: z.string().default('PENDING'),
  collectedBy: z.string().min(1),
  collectionCenter: z.string().min(1),
  description: z.string().optional(),
  receiptNo: z.string().optional(),
  chequeNo: z.string().optional(),
  bankRef: z.string().optional(),
  mobileRef: z.string().optional(),
  createId: z.string().min(1),
});

export type InsertAgentPaymentDetails = z.infer<typeof insertAgentPaymentDetailsSchema>;

// Receipt Cancellation Schema
export const insertReceiptCancellationSchema = z.object({
  payId: z.string().min(1),
  cancellationReason: z.string().min(1),
});

export type InsertReceiptCancellation = z.infer<typeof insertReceiptCancellationSchema>;

export const insertAgentReplacementSchema = z.object({
  sapBpId: z.string().min(1),
  sapCaId: z.string().min(1),
  requestType: z.string().default("AGENT_REPLACEMENT"),
  requestId: z.string().min(1),
  itemType: z.string().min(1),
  itemQty: z.string().min(1),
  itemSerialNo: z.string().min(1),
  itemAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  vatAmount: z.number().min(0),
  transferFrom: z.string().min(1),
  transferTo: z.string().min(1),
  status: z.string().default("PENDING"),
  createId: z.string().min(1),
  cmStatus: z.string().default("PENDING"),
  cmStatusMsg: z.string().optional(),
  sapSoId: z.string().optional(),
  replacementCenter: z.string().optional(),
  faultyReason: z.string().optional(),
  replacementNotes: z.string().optional(),
  agentName: z.string().optional(),
  centerExecutive: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedDate: z.date().optional(),
  completedDate: z.date().optional(),
});

export const insertAgentFaultyRepairSchema = z.object({
  itemId: z.number().min(1),
  materialCode: z.string().min(1),
  materialName: z.string().min(1),
  materialType: z.string().min(1),
  serialNumber: z.string().min(1),
  casId: z.string().optional(),
  agentId: z.string().min(1),
  agentName: z.string().min(1),
  agentBpId: z.string().min(1),
  currentStatus: z.string().min(1),
  newStatus: z.string().default("REPAIR"),
  faultyReason: z.string().min(1),
  repairNotes: z.string().optional(),
  transferDate: z.date().optional(),
  repairCenter: z.string().optional(),
  processedBy: z.string().optional(),
  processedDate: z.date().optional(),
  createId: z.string().min(1),
  updateId: z.string().optional(),
  updateDt: z.date().optional(),
  updateTs: z.date().optional(),
});

export const insertPaymentDetailsSchema = z.object({
  sapBpId: z.string().max(20).min(1),
  sapCaId: z.string().max(20).min(1),
  module: z.string().max(20).min(1), // Agent / Customer / OTC
  payType: z.string().max(20).min(1), // Hardware / Subscription
  payAmount: z.number().min(0),
  vatAmount: z.number().min(0),
  payMode: z.string().max(20).min(1), // CASH / CHEQUE / AZAM PAY etc
  chequeNo: z.string().max(20).optional(),
  bankName: z.string().max(50).optional(),
  currency: z.string().max(20).default("TSH"),
  onlPgId: z.string().max(50).optional(),
  onlTransId: z.string().max(50).optional(),
  transId: z.string().max(50).min(1),
  status: z.string().max(20).default("PENDING"),
  description: z.string().max(200).optional(),
  createId: z.string().max(50).min(1),
  approvedBy: z.string().max(50).optional(),
  name: z.string().max(100).min(1),
  salesOrg: z.string().max(50).min(1),
  division: z.string().max(50).min(1),
  cmStatus: z.string().max(50).default("PENDING"),
  cmStatusMsg: z.string().max(200).optional(),
  collectedBy: z.string().max(100).min(1),
  collectionCenter: z.string().max(50).min(1),
});

export const insertPaymentSchema = z.object({
  customerId: z.number(),
  amount: z.number().min(0),
  currency: z.string().default("TSH"),
  paymentMode: z.string().min(1),
  referenceNumber: z.string().optional(),
  type: z.string().min(1),
  status: z.string().default("pending"),
  receiptNumber: z.string().optional(),
});

export const insertSubscriptionSchema = z.object({
  customerId: z.number(),
  smartCardNumber: z.string().min(1),
  plan: z.string().min(1),
  amount: z.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
  activationType: z.string().min(1),
  status: z.string().default("active"),
});

// System Incident Schema
export const insertSystemIncidentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  affectedSystem: z.enum([
    AffectedSystem.PORTAL,
    AffectedSystem.CM,
    AffectedSystem.SOM,
    AffectedSystem.CC,
    AffectedSystem.CI,
    AffectedSystem.NAGRA,
  ] as [string, ...string[]]),
  severity: z.enum([
    IncidentSeverity.CRITICAL,
    IncidentSeverity.MAJOR,
    IncidentSeverity.MINOR,
  ] as [string, ...string[]]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startTime: z.date(),
  endTime: z.date().optional(),
  impactedCustomers: z.number().min(0).optional(),
  rootCause: z.string().optional(),
  resolutionSteps: z.string().optional(),
  status: z.enum([
    IncidentStatus.OPEN,
    IncidentStatus.INVESTIGATING,
    IncidentStatus.RESOLVED,
    IncidentStatus.CLOSED,
  ] as [string, ...string[]]).default(IncidentStatus.OPEN),
  assignedOwner: z.string().optional(),
  ownerTeam: z.enum(['Technical', 'Operations']).optional(),
  attachments: z.array(z.string()).optional(),
  notificationSettings: z.object({
    emailAlerts: z.boolean().default(true),
    smsAlerts: z.boolean().default(false),
    stakeholders: z.array(z.string().email()).optional(),
  }).optional(),
  linkedServiceTickets: z.array(z.number()).optional(),
});

export type InsertSystemIncident = z.infer<typeof insertSystemIncidentSchema>;

// Plan Change Schemas based on SERVICE_TRANS_DETAILS specification
export interface PlanChange {
  id: number;
  sapBpId: string;         // Business Partner ID - VARCHAR 10
  sapCaId: string;         // Contract Account ID - VARCHAR 12
  sapContractId: string;   // SAP Provider Contract ID - VARCHAR 30
  smartCardNumber: string; // STB Smart Card No - VARCHAR 30
  actionType: string;      // Action Type - VARCHAR 30
  actionSubtype: string;   // Action Sub Type - VARCHAR 30
  requestId: string;       // Unique auto generated id - VARCHAR 30
  planType: string;        // Plan Type - VARCHAR 20
  planId: string;          // SAP Plan code - VARCHAR 5
  planName: string;        // Plan Name - VARCHAR 50
  bundleName: string;      // Bundle Name - VARCHAR 50
  division: string;        // Division - VARCHAR 50
  planRate: number;        // Plan pricing - BIGINT 10,2
  planAmount: number;      // Total Amount - BIGINT 10,2
  vatAmount: number;       // VAT Amount - BIGINT 10,2
  startDate: Date;         // Plan Start Date
  endDate: Date;           // Plan end Date
  status: string;          // INPROGRESS/APPROVED/COMPLETED - VARCHAR 20
  createId: string;        // User Logged ID - VARCHAR 50
  createDt: Date;          // CREATION DATE
  createTs: Date;          // CREATION TIME
  updateDt?: Date;         // Update Date
  updateTs?: Date;         // Update Time
  updateId?: string;       // Updating User - VARCHAR 50
  cmStatus?: string;       // CM Wf status - VARCHAR 20
  cmStatusMsg?: string;    // CM Status Message - VARCHAR 100
  changeType: 'immediate' | 'scheduled'; // Type of plan change
  isWithinBufferPeriod?: boolean;        // Whether change is within buffer period
  scheduledExecutionDate?: Date;         // For scheduled changes
  oldPlanId: string;       // Previous plan ID
  oldPlanName: string;     // Previous plan name
  oldPlanAmount: number;   // Previous plan amount
  walletBalance: number;   // Customer wallet balance at time of change
  refundAmount?: number;   // Refund amount if within buffer period
  paymentRequired: number; // Additional payment required
}

export interface PlanChangeHistory {
  id: number;
  customerId: string;
  smartCardNumber: string;
  eventDate: Date;
  eventName: string;
  planName: string;
  planStartDate?: Date;
  planEndDate?: Date;
  amount: number;
  walletBalance: number;
  changeType: 'immediate' | 'scheduled' | 'auto_renewal' | 'cancellation';
  status: 'success' | 'failed' | 'pending';
}

export const insertPlanChangeSchema = z.object({
  sapBpId: z.string().max(10).min(1),
  sapCaId: z.string().max(12).min(1),
  sapContractId: z.string().max(30).min(1),
  smartCardNumber: z.string().max(30).min(1),
  actionType: z.string().max(30).default("PLAN_CHANGE"),
  actionSubtype: z.enum(["IMMEDIATE", "SCHEDULED"]),
  planType: z.string().max(20).min(1),
  planId: z.string().max(5).min(1),
  planName: z.string().max(50).min(1),
  bundleName: z.string().max(50).min(1),
  division: z.string().max(50).min(1),
  planRate: z.number().min(0),
  planAmount: z.number().min(0),
  vatAmount: z.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string().max(20).default("INPROGRESS"),
  createId: z.string().max(50).min(1),
  changeType: z.enum(["immediate", "scheduled"]),
  oldPlanId: z.string().max(5).min(1),
  oldPlanName: z.string().max(50).min(1),
  oldPlanAmount: z.number().min(0),
  walletBalance: z.number().min(0),
  refundAmount: z.number().min(0).optional(),
  paymentRequired: z.number().min(0),
  scheduledExecutionDate: z.date().optional(),
});

export type InsertPlanChange = z.infer<typeof insertPlanChangeSchema>;

// Add-On Pack Management interfaces based on SAP BRIM implementation (Updated)
export interface AddOnPackSAP {
  id: number;
  packId: string;
  packName: string;
  description?: string;
  price: number;
  currency: string;
  channels: number;
  category: string;
  validityDays: number;
  autoRenewalFlag: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddOnPurchase {
  id: number;
  customerId: string;
  customerName: string;
  smartCardNo: string;
  sapBpId?: string;
  sapCaId?: string;
  sapContractId?: string;
  addOnPackId: string;
  addOnPackName: string;
  baseplanEndDate: Date;
  proratedAmount: number;
  totalAmount: number;
  vatAmount: number;
  purchaseDate: Date;
  startDate: Date;
  endDate: Date;
  autoRenewalFlag: boolean;
  status: string;
  requestId: string;
  cmStatus?: string;
  cmStatusMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddOnRenewal {
  id: number;
  customerId: string;
  addOnPurchaseId: number;
  renewalType: 'manual' | 'auto';
  baseplanEndDate: Date;
  proratedAmount: number;
  totalAmount: number;
  vatAmount: number;
  renewalDate: Date;
  newEndDate: Date;
  status: string;
  requestId: string;
  cmStatus?: string;
  cmStatusMessage?: string;
  createdAt?: Date;
}

export interface AddOnRemoval {
  id: number;
  customerId: string;
  addOnPurchaseId: number;
  removalDate: Date;
  reason?: string;
  status: string;
  requestId: string;
  cmStatus?: string;
  cmStatusMessage?: string;
  createdAt?: Date;
}

// Add-On Pack Zod schemas for validation
export const insertAddOnPackSchema = z.object({
  packId: z.string().min(1),
  packName: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().min(1),
  channels: z.number().positive(),
  category: z.string().min(1),
  validityDays: z.number().positive(),
  autoRenewalFlag: z.boolean().default(true),
  status: z.string().default('active'),
});

export const insertAddOnPurchaseSchema = z.object({
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  smartCardNo: z.string().min(1),
  sapBpId: z.string().optional(),
  sapCaId: z.string().optional(),
  sapContractId: z.string().optional(),
  addOnPackId: z.string().min(1),
  addOnPackName: z.string().min(1),
  baseplanEndDate: z.string().transform((str) => new Date(str)),
  proratedAmount: z.number().positive(),
  totalAmount: z.number().positive(),
  vatAmount: z.number().nonnegative(),
  purchaseDate: z.string().transform((str) => new Date(str)).default(() => new Date().toISOString()),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  autoRenewalFlag: z.boolean().default(true),
  status: z.string().default('pending'),
});

export const insertAddOnRenewalSchema = z.object({
  customerId: z.string().min(1),
  addOnPurchaseId: z.number().positive(),
  renewalType: z.enum(['manual', 'auto']),
  baseplanEndDate: z.string().transform((str) => new Date(str)),
  proratedAmount: z.number().positive(),
  totalAmount: z.number().positive(),
  vatAmount: z.number().nonnegative(),
  renewalDate: z.string().transform((str) => new Date(str)).default(() => new Date().toISOString()),
  newEndDate: z.string().transform((str) => new Date(str)),
  status: z.string().default('pending'),
});

export const insertAddOnRemovalSchema = z.object({
  customerId: z.string().min(1),
  addOnPurchaseId: z.number().positive(),
  removalDate: z.string().transform((str) => new Date(str)).default(() => new Date().toISOString()),
  reason: z.string().optional(),
  status: z.string().default('pending'),
});

export type InsertAddOnPack = z.infer<typeof insertAddOnPackSchema>;
export type InsertAddOnPurchase = z.infer<typeof insertAddOnPurchaseSchema>;
export type InsertAddOnRenewal = z.infer<typeof insertAddOnRenewalSchema>;
export type InsertAddOnRemoval = z.infer<typeof insertAddOnRemovalSchema>;

export interface AgentHardwarePayment {
  id: number;
  payId: string;
  sapBpId: string;
  sapCaId: string;
  module: string;
  payType: string;
  payAmount: number;
  vatAmount: number;
  payMode: string;
  chequeNo?: string;
  bankName?: string;
  currency: string;
  onlPgId?: string;
  onlTransId?: string;
  transId: string;
  status: string;
  description?: string;
  createId: string;
  createDt: Date;
  createTs: Date;
  updateId?: string;
  updateDt?: Date;
  updateTs?: Date;
  approvedBy?: string;
  name: string;
  salesOrg: string;
  division: string;
  cmStatus?: string;
  cmStatusMsg?: string;
  collectedBy?: string;
  collectionCenter?: string;
  receiptNumber?: string;
  hardwareItems?: {
    materialCode: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export const insertAgentHardwarePaymentSchema = z.object({
  sapBpId: z.string().min(1),
  sapCaId: z.string().min(1),
  module: z.string().default("Agent"),
  payType: z.string().default("Hardware"),
  payAmount: z.number().min(0.01),
  vatAmount: z.number().min(0),
  payMode: z.enum(["CASH", "CHEQUE", "BANK_DEPOSIT", "POS", "MOBILE_MONEY"]),
  chequeNo: z.string().optional(),
  bankName: z.string().optional(),
  currency: z.string().default("TSH"),
  onlPgId: z.string().optional(),
  onlTransId: z.string().optional(),
  status: z.string().default("PENDING"),
  description: z.string().optional(),
  name: z.string().min(1),
  salesOrg: z.string().min(1),
  division: z.string().min(1),
  collectedBy: z.string().optional(),
  collectionCenter: z.string().optional(),
  hardwareItems: z.array(z.object({
    materialCode: z.string().min(1),
    materialName: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
  })).optional(),
  createId: z.string().min(1),
});

// Agent Hardware Sale Schema based on INVENTORY_REQUEST specification
export interface AgentHardwareSale {
  id: number;
  sapBpId: string;  // Business Partner ID - VARCHAR 20
  sapCaId: string;  // Contract Account ID - VARCHAR 20
  module: string;   // AGENT / CUSTOMER / OTC - VARCHAR 20
  salesOrg: string; // SAP SD SALES ORG - VARCHAR 20
  division: string; // SAP SD Division - VARCHAR 20
  requestType: string; // AGENT_SALE - VARCHAR 20
  requestId: string; // Unique auto generated id - VARCHAR 30
  plantId: string;  // Main warehouse/plant ID
  agentName: string; // Agent name
  agentBalance: number; // Current agent balance
  overridePrice?: number; // Price override by sales head
  priceType: string; // KIT or INDIVIDUAL
  items: AgentHardwareSaleItem[];
  totalAmount: number; // Total Amount - BIGINT 10,2
  vatAmount: number;  // VAT Amount - BIGINT 10,2
  transferFrom: string; // SOURCE Entity - VARCHAR 50
  transferTo: string;   // Receiving entity - VARCHAR 50
  status: string;       // INPROGRESS/APPROVED/COMPLETED - VARCHAR 20
  approvedBy?: string;
  rejectionReason?: string;
  deliveryNoteId?: string;
  invoiceId?: string;
  serialNumbersAssigned: boolean;
  assignedSerialNumbers?: string[]; // Bulk uploaded serial numbers
  createId: string;     // User Logged ID - VARCHAR 50
  createDt: Date;       // CREATION DATE
  createTs: Date;       // CREATION TIME
  updateDt?: Date;      // Update Date
  updateTs?: Date;      // Update Time
  updateId?: string;    // Updating User - VARCHAR 50
  cmStatus?: string;    // CM Wf status - VARCHAR 20
  cmStatusMsg?: string; // CM Status Message - VARCHAR 100
  sapSoId?: string;     // SD Order ID - VARCHAR 30
  exchangeRate?: number; // For multi-currency support
  currency: string;
}

export interface AgentHardwareSaleItem {
  id?: number;
  materialCode: string;
  materialName: string;
  materialType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  kitPrice?: number;
  individualPrice?: number;
  serialNumbers?: string[];
  isKitItem: boolean;
}

// Customer Hardware Sale Schema based on INVENTORY_REQUEST specification for OTC
export interface CustomerHardwareSale {
  id: number;
  sapBpId: string;  // Business Partner ID - VARCHAR 20
  sapCaId: string;  // Contract Account ID - VARCHAR 20
  module: string;   // CUSTOMER / OTC - VARCHAR 20
  salesOrg: string; // SAP SD SALES ORG - VARCHAR 20
  division: string; // SAP SD Division - VARCHAR 20
  requestType: string; // CUSTOMER_SALE - VARCHAR 20
  requestId: string; // Unique auto generated id - VARCHAR 30
  itemType: string; // Material Code/name - VARCHAR 20
  itemQty: number;  // Quantity - VARCHAR 5
  itemSerialNo?: string; // Item Serial No - VARCHAR 50
  itemAmount: number; // Item Price - BIGINT 10,2
  totalAmount: number; // Total Amount - BIGINT 10,2
  vatAmount: number;  // VAT Amount - BIGINT 10,2
  transferFrom: string; // SOURCE Entity - VARCHAR 50
  transferTo: string;   // Receiving entity - VARCHAR 50
  status: string;       // INPROGRESS/APPROVED/COMPLETED - VARCHAR 20
  customerName: string; // Customer name
  customerPhone: string; // Customer phone
  customerEmail?: string; // Customer email
  planSelected?: string; // Selected plan for pricing
  paymentStatus: string; // Payment status
  invoiceGenerated: boolean;
  traRequestPosted: boolean; // Tax Authority request posted
  items: CustomerHardwareSaleItem[];
  createId: string;     // User Logged ID - VARCHAR 50
  createDt: Date;       // CREATION DATE
  createTs: Date;       // CREATION TIME
  updateDt?: Date;      // Update Date
  updateTs?: Date;      // Update Time
  updateId?: string;    // Updating User - VARCHAR 50
  cmStatus?: string;    // CM Wf status - VARCHAR 20
  cmStatusMsg?: string; // CM Status Message - VARCHAR 100
  sapSoId?: string;     // SD Order ID - VARCHAR 30
  currency: string;
  exchangeRate?: number; // For multi-currency support
}

export interface CustomerHardwareSaleItem {
  id?: number;
  materialCode: string;
  materialName: string;
  materialType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  serialNumbers?: string[];
  make?: string;
  modelNo?: string;
  casId?: string;
}

export const insertCustomerHardwareSaleSchema = z.object({
  sapBpId: z.string().max(20).min(1),
  sapCaId: z.string().max(20).min(1),
  module: z.string().max(20).default("CUSTOMER"),
  salesOrg: z.string().max(20).min(1),
  division: z.string().max(20).min(1),
  requestType: z.string().max(20).default("CUSTOMER_SALE"),
  itemType: z.string().max(20).min(1),
  itemQty: z.number().min(1),
  itemSerialNo: z.string().max(50).optional(),
  itemAmount: z.number().min(0),
  totalAmount: z.number().min(0.01),
  vatAmount: z.number().min(0),
  transferFrom: z.string().max(50).min(1),
  transferTo: z.string().max(50).min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional(),
  planSelected: z.string().optional(),
  paymentStatus: z.string().default("PENDING"),
  invoiceGenerated: z.boolean().default(false),
  traRequestPosted: z.boolean().default(false),
  items: z.array(z.object({
    materialCode: z.string().min(1),
    materialName: z.string().min(1),
    materialType: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    make: z.string().optional(),
    modelNo: z.string().optional(),
    casId: z.string().optional(),
  })).min(1),
  currency: z.string().default("TSH"),
  exchangeRate: z.number().optional(),
  createId: z.string().max(50).min(1),
});

export const insertAgentHardwareSaleSchema = z.object({
  sapBpId: z.string().max(20).min(1),
  sapCaId: z.string().max(20).min(1),
  module: z.string().max(20).default("AGENT"),
  salesOrg: z.string().max(20).min(1),
  division: z.string().max(20).min(1),
  requestType: z.string().max(20).default("AGENT_SALE"),
  plantId: z.string().min(1),
  agentName: z.string().min(1),
  agentBalance: z.number().min(0),
  overridePrice: z.number().optional(),
  priceType: z.enum(["KIT", "INDIVIDUAL"]).default("INDIVIDUAL"),
  items: z.array(z.object({
    materialCode: z.string().min(1),
    materialName: z.string().min(1),
    materialType: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    kitPrice: z.number().optional(),
    individualPrice: z.number().optional(),
    isKitItem: z.boolean().default(false),
  })).min(1),
  totalAmount: z.number().min(0.01),
  vatAmount: z.number().min(0),
  transferFrom: z.string().max(50).min(1),
  transferTo: z.string().max(50).min(1),
  currency: z.string().default("TSH"),
  exchangeRate: z.number().optional(),
  createId: z.string().max(50).min(1),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InsertInventoryRequest = z.infer<typeof insertInventoryRequestSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertAgentHardwarePayment = z.infer<typeof insertAgentHardwarePaymentSchema>;
export type InsertAgentHardwareSale = z.infer<typeof insertAgentHardwareSaleSchema>;