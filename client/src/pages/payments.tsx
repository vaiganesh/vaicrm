import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { 
  CreditCard, 
  Package2, 
  X,
  ArrowLeftRight,
} from "lucide-react";

const paymentModules = [
  {
    title: "Agent Payment - HW",
    subtitle: "Process hardware payments for agents",
    icon: Package2,
    path: "/agent-payment-hw",
    category: "Agent Payments",
    hasData: true
  },
  {
    title: "Agent Payment - Subscription",
    subtitle: "Process subscription payments for agents",
    icon: CreditCard,
    path: "/agent-payment-subscription",
    category: "Agent Payments"
  },
  {
    title: "Customer Payment - HW",
    subtitle: "Process hardware payments for customers",
    icon: Package2,
    path: "/customer-payment-hw",
    category: "Customer Payments"
  },
  {
    title: "Customer Hardware Sale - OTC",
    subtitle: "Over-the-counter hardware sales with payment processing",
    icon: Package2,
    path: "/customer-hardware-sale",
    category: "Customer Payments",
    hasData: true
  },
  {
    title: "Customer Payment - Subscription",
    subtitle: "Process subscription payments for customers",
    icon: CreditCard,
    path: "/customer-subscription-purchase",
    category: "Customer Payments",
    hasData: true
  },
  {
    title: "Receipt Cancellation",
    subtitle: "Cancel existing payment receipts",
    icon: X,
    path: "/receipt-cancellation",
    category: "Payment Management"
  },
  {
    title: "Customer To Customer Transfer",
    subtitle: "Transfer payments between customers",
    icon: ArrowLeftRight,
    path: "/customer-to-customer-transfer",
    category: "Payment Management"
  }
];


export default function PaymentsPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  const ModuleTile = ({ module }: { module: any }) => {
    const Icon = module.icon;
    return (
      <div
        onClick={() => handleModuleClick(module.path)}
        className="bg-white rounded-lg shadow-sm border border-azam-orange/30 p-4 hover:shadow-lg hover:border-azam-orange transition-all cursor-pointer group"
      >
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-12 h-12 bg-azam-orange rounded-lg mb-3 group-hover:bg-azam-orange-dark transition-colors">
            <Icon className="h-6 w-6 text-white" />
            {module.hasData && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">{module.title}</h3>
          <p className="text-xs text-gray-500 leading-tight">{module.subtitle}</p>
        </div>
      </div>
    );
  };

  const categories = Array.from(new Set(paymentModules.map(module => module.category)));

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">
        
        {/* Payment Modules by Category */}
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {paymentModules
                .filter(module => module.category === category)
                .map((module, index) => (
                  <ModuleTile key={index} module={module} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
