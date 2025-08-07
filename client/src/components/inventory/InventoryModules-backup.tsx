import { 
  Package2, 
  ClipboardList,
  CheckCircle,
  ArrowLeftRight,
  Search,
  RefreshCcw,
  Link2,
  Building,
  Shield,
  ShieldOff,
  UserX,
  FileText,
  ClipboardCheck,
  CreditCard,
  Wrench,
  UserCheck,
  XCircle,
  type LucideIcon
} from "lucide-react";

// Centralized inventory modules configuration
export const inventoryModules: InventoryModule[] = [
  // Stock Management
  {
    id: "stock-overview",
    title: "Stock Overview",
    subtitle: "View current stock levels and status",
    icon: Package2,
    category: "Stock Management",
    color: "blue",
    hasData: true,
    priority: "high"
  },
  {
    id: "stock-request",
    title: "Stock Request",
    subtitle: "Request new inventory items",
    icon: ClipboardList,
    category: "Stock Management",
    color: "blue",
    hasData: true,
    priority: "high"
  },
  {
    id: "stock-approval",
    title: "Stock Approval",
    subtitle: "Approve pending stock requests",
    icon: CheckCircle,
    category: "Stock Management",
    color: "green",
    hasData: true,
    priority: "high"
  },
  {
    id: "stock-transfer",
    title: "Stock Transfer",
    subtitle: "Transfer stock between locations",
    icon: ArrowLeftRight,
    category: "Stock Management",
    color: "purple",
    hasData: true,
    priority: "high"
  },
  
  // Device Management
  {
    id: "cas-id-change",
    title: "CAS ID Change",
    subtitle: "Update CAS ID for devices",
    icon: RefreshCcw,
    category: "Device Management",
    color: "blue",
    hasData: true,
    priority: "medium"
  },
  {
    id: "stb-sc-pairing",
    title: "STB - SC Pairing",
    subtitle: "Pair Set-Top Box with Smart Card",
    icon: Link2,
    category: "Device Management",
    color: "green",
    hasData: true,
    priority: "medium"
  },
  
  // Tracking & Monitoring
  {
    id: "track-serial",
    title: "Track Serial No",
    subtitle: "Track and search serial numbers",
    icon: Search,
    category: "Tracking & Monitoring",
    color: "yellow",
    hasData: true,
    priority: "medium"
  },
  
  // Warehouse Operations
  {
    id: "warehouse-transfer",
    title: "Warehouse Transfer",
    subtitle: "Transfer between warehouse locations",
    icon: Building,
    category: "Warehouse Operations",
    color: "purple",
    hasData: true,
    priority: "medium"
  },
  
  // Access Control
  {
    id: "block-unblock-agent",
    title: "Block / Unblock STB - Agent",
    subtitle: "Block or unblock STB for agents",
    icon: Shield,
    category: "Access Control",
    color: "red",
    hasData: true,
    priority: "low"
  },
  {
    id: "block-unblock-center",
    title: "Block / Unblock STB - Center",
    subtitle: "Block or unblock STB from center",
    icon: ShieldOff,
    category: "Access Control",
    color: "red",
    hasData: true,
    priority: "low"
  },
  
  // Agent Operations
  {
    id: "agent-subagent-transfer",
    title: "Agent to Sub Agent Transfer",
    subtitle: "Transfer items between agents",
    icon: UserX,
    category: "Agent Operations",
    color: "orange",
    hasData: true,
    priority: "medium"
  },
  
  // Purchase Management
  {
    id: "po-view",
    title: "PO View",
    subtitle: "View purchase orders and details",
    icon: FileText,
    category: "Purchase Management",
    color: "blue",
    hasData: true,
    priority: "medium"
  },
  {
    id: "po-grn-update",
    title: "PO - GRN Update",
    subtitle: "Update goods receipt notes",
    icon: ClipboardCheck,
    category: "Purchase Management",
    color: "green",
    hasData: true,
    priority: "medium"
  },
  
  // Returns & Sales
  {
    id: "customer-hardware-return",
    title: "Customer Hardware Return",
    subtitle: "Process customer hardware returns",
    icon: XCircle,
    category: "Returns & Sales",
    color: "red",
    hasData: true,
    priority: "medium"
  },
  {
    id: "agent-hardware-sale",
    title: "Agent Hardware Sale",
    subtitle: "Agent to customer hardware sales",
    icon: CreditCard,
    category: "Returns & Sales",
    color: "green",
    hasData: true,
    priority: "high"
  },
  {
    id: "customer-hardware-sale",
    title: "Customer Hardware Sale (OTC)",
    subtitle: "Over-the-counter hardware sales",
    icon: CreditCard,
    category: "Returns & Sales",
    color: "green",
    hasData: true,
    priority: "high"
  },
  
  // Repair Management
  {
    id: "agent-faulty-repair",
    title: "Agent Faulty to Repair Change",
    subtitle: "Change faulty items to repair status",
    icon: Wrench,
    category: "Repair Management",
    color: "yellow",
    hasData: true,
    priority: "medium"
  },
  {
    id: "agent-replacement",
    title: "Agent Replacement",
    subtitle: "Process agent replacement workflows",
    icon: UserCheck,
    category: "Repair Management",
    color: "blue",
    hasData: true,
    priority: "medium"
  }
];

// Type definitions for better type safety
export interface InventoryModule {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  category: string;
  color: string;
  hasData: boolean;
  priority: "high" | "medium" | "low";
}

// Utility functions for module management
export const getModulesByCategory = (category: string): InventoryModule[] => {
  return inventoryModules.filter(module => module.category === category);
};

export const getModuleById = (id: string): InventoryModule | undefined => {
  return inventoryModules.find(module => module.id === id);
};

export const getUniqueCategories = (): string[] => {
  return Array.from(new Set(inventoryModules.map(module => module.category)));
};

export const getModulesByPriority = (priority: "high" | "medium" | "low"): InventoryModule[] => {
  return inventoryModules.filter(module => module.priority === priority);
};