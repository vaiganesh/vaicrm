import { useLocation } from "wouter";
import { 
  Package2, 
  ClipboardList,
  CheckCircle,
  ArrowLeftRight,
  Search,
  RefreshCcw,
  Link2,
  AlertTriangle,
  Building,
  Shield,
  ShieldOff,
  Users,
  Eye,
  FileEdit,
  RotateCcw,
  ShoppingCart,
  Repeat
} from "lucide-react";

const inventoryModules = [
  {
    title: "Stock Overview",
    subtitle: "View current stock levels and status",
    icon: Package2,
    path: "/stock-overview",
    category: "Stock Management",
    color: "azam-blue"
  },
  {
    title: "Stock Request", 
    subtitle: "Request new inventory items",
    icon: ClipboardList,
    path: "/stock-request",
    category: "Stock Management",
    color: "azam-blue"
  },
  {
    title: "Stock Approval",
    subtitle: "Approve pending stock requests",
    icon: CheckCircle,
    path: "/stock-approval",
    category: "Stock Management", 
    color: "green"
  },
  {
    title: "Stock Transfer",
    subtitle: "Transfer stock between locations",
    icon: ArrowLeftRight,
    path: "/stock-transfer",
    category: "Stock Management",
    color: "purple"
  },
  {
    title: "Track Serial No",
    subtitle: "Track and search serial numbers",
    icon: Search,
    path: "/track-serial",
    category: "Tracking & Monitoring",
    color: "yellow"
  },
  {
    title: "CAS ID Change",
    subtitle: "Update CAS ID for devices",
    icon: RefreshCcw,
    path: "/cas-id-change",
    category: "Device Management",
    color: "azam-blue"
  },
  {
    title: "STB - SC Pairing",
    subtitle: "Pair Set-Top Box with Smart Card",
    icon: Link2,
    path: "/stb-sc-pairing",
    category: "Device Management",
    color: "green"
  },
  {
    title: "Agent Faulty to Repair Change",
    subtitle: "Move faulty items to repair status",
    icon: AlertTriangle,
    path: "/agent-faulty-repair",
    category: "Repair Management",
    color: "red"
  },
  {
    title: "Warehouse Transfer",
    subtitle: "Transfer between warehouse locations",
    icon: Building,
    path: "/warehouse-transfer",
    category: "Warehouse Operations",
    color: "purple"
  },
  {
    title: "Block / Unblock STB - Agent",
    subtitle: "Block or unblock STB for agents",
    icon: Shield,
    path: "/block-unblock-agent",
    category: "Access Control",
    color: "red"
  },
  {
    title: "Block / Unblock STB - Center",
    subtitle: "Block or unblock STB from center",
    icon: ShieldOff,
    path: "/block-unblock-center",
    category: "Access Control",
    color: "red"
  },
  {
    title: "Agent to Sub Agent Transfer",
    subtitle: "Transfer items between agents",
    icon: Users,
    path: "/agent-subagent-transfer",
    category: "Agent Operations",
    color: "purple"
  },
  {
    title: "PO View",
    subtitle: "View purchase orders",
    icon: Eye,
    path: "/po-view",
    category: "Purchase Management",
    color: "yellow"
  },
  {
    title: "PO GRN Update",
    subtitle: "Update Goods Receipt Notes",
    icon: FileEdit,
    path: "/po-grn-update",
    category: "Purchase Management",
    color: "green"
  },
  {
    title: "Customer Hardware Return",
    subtitle: "Process customer hardware returns",
    icon: RotateCcw,
    path: "/customer-hardware-return",
    category: "Returns & Sales",
    color: "yellow"
  },
  {
    title: "Agent Hardware Sale",
    subtitle: "Record agent hardware sales",
    icon: ShoppingCart,
    path: "/agent-hardware-sale",
    category: "Returns & Sales",
    color: "green"
  },
  {
    title: "Customer Hardware Sale",
    subtitle: "Record customer hardware sales (OTC)",
    icon: ShoppingCart,
    path: "/customer-hardware-sale",
    category: "Returns & Sales",
    color: "green"
  },
  {
    title: "Agent Replacement",
    subtitle: "Process agent equipment replacement",
    icon: Repeat,
    path: "/agent-replacement",
    category: "Repair Management",
    color: "azam-blue"
  }
];

export default function InventoryModules() {
  const [, navigate] = useLocation();

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  const ModuleTile = ({ module }: { module: any }) => {
    const Icon = module.icon;
    const colorClasses = {
      "azam-blue": "bg-azam-orange group-hover:bg-azam-orange-dark text-white",
      "green": "bg-azam-orange group-hover:bg-azam-orange-dark text-white",
      "purple": "bg-azam-orange group-hover:bg-azam-orange-dark text-white",
      "yellow": "bg-azam-orange group-hover:bg-azam-orange-dark text-white",
      "red": "bg-azam-orange group-hover:bg-azam-orange-dark text-white"
    };

    return (
      <div
        onClick={() => handleModuleClick(module.path)}
        className="bg-white rounded-lg shadow-sm border border-azam-orange/30 p-4 hover:shadow-lg hover:border-azam-orange transition-all cursor-pointer group relative"
      >
        {/* Data indicator badge */}
        {module.hasData && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}

        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 transition-colors ${colorClasses[module.color as keyof typeof colorClasses] || colorClasses["azam-blue"]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">{module.title}</h3>
          <p className="text-xs text-gray-500 leading-tight">{module.subtitle}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">


        {/* Stock Management */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Stock Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Stock Management").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Device Management */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Device Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Device Management").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Tracking & Monitoring */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tracking & Monitoring</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Tracking & Monitoring").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Warehouse Operations */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Warehouse Operations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Warehouse Operations").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Access Control */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Access Control</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Access Control").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Agent Operations */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Agent Operations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Agent Operations").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Purchase Management */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Purchase Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Purchase Management").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Returns & Sales */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Returns & Sales</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Returns & Sales").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Repair Management */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Repair Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {inventoryModules.filter(module => module.category === "Repair Management").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}