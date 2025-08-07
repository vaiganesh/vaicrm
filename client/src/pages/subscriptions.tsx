import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { 
  Search, 
  Eye, 
  ShoppingCart, 
  RotateCcw, 
  ArrowUpDown, 
  Gift, 
  Pause, 
  Play, 
  Power, 
  Calendar, 
  Package, 
  X, 
  Repeat, 
  RefreshCw, 
  CreditCard, 
  Settings, 
  FileText, 
  ToggleLeft, 
  Ban, 
  Plus 
} from "lucide-react";

// ModuleTile component to match home page design exactly
interface ModuleTileProps {
  title: string;
  subtitle?: string;
  icon: any;
  path: string;
  hasData?: boolean;
}

function ModuleTile({ title, subtitle, icon, path, hasData = false }: ModuleTileProps) {
  const [, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(path);
  };
  
  const Icon = icon;
  
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-azam-orange/30 p-4 hover:shadow-lg hover:border-azam-orange transition-all cursor-pointer group"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-azam-orange rounded-lg mb-3 group-hover:bg-azam-orange-dark transition-colors relative">
          <Icon className="h-6 w-6 text-white" />
          {hasData && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          )}
        </div>
        <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const subscriberModules = [
    {
      title: "Search Subscriber",
      subtitle: "Find and search subscriber records",
      icon: Search,
      path: "/search-subscriber",
    },
    {
      title: "Subscriber View",
      subtitle: "View subscriber details and status",
      icon: Eye,
      path: "/subscriber-view",
    },
    {
      title: "Consolidated Management",
      subtitle: "Complete subscription lifecycle dashboard",
      icon: Settings,
      path: "/consolidated-subscriptions",
      hasData: true,
    },
  ];

  const subscriptionModules = [
    {
      title: "Subscription Purchase",
      subtitle: "Process new subscription purchases",
      icon: ShoppingCart,
      path: "/subscription-purchase",
    },
    {
      title: "Subscription Renewal",
      subtitle: "Renew existing subscriptions",
      icon: RotateCcw,
      path: "/subscription-renewal",
    },
    {
      title: "Plan Change",
      subtitle: "Modify subscription plans",
      icon: ArrowUpDown,
      path: "/plan-change",
    },
    {
      title: "Offer Change",
      subtitle: "Update promotional offers",
      icon: Gift,
      path: "/offer-change",
    },
    {
      title: "Plan Validity Extension",
      subtitle: "Extend subscription validity",
      icon: Calendar,
      path: "/plan-validity-extension",
    },
    {
      title: "Add Add-ON Packs",
      subtitle: "Add supplementary packages",
      icon: Package,
      path: "/add-addon-packs",
    },
  ];

  const serviceModules = [
    {
      title: "Suspension",
      subtitle: "Suspend subscriber services",
      icon: Pause,
      path: "/customer-suspension",
    },
    {
      title: "Reconnection",
      subtitle: "Reconnect suspended services",
      icon: Play,
      path: "/reconnection",
    },
    {
      title: "Disconnection",
      subtitle: "Disconnect subscriber services",
      icon: Power,
      path: "/customer-disconnection",
    },
    {
      title: "Termination",
      subtitle: "Terminate subscriber accounts",
      icon: X,
      path: "/termination",
    },
    {
      title: "Retrack",
      subtitle: "Retrack service connections",
      icon: Repeat,
      path: "/retrack",
    },
    {
      title: "Replacement",
      subtitle: "Replace equipment and services",
      icon: RefreshCw,
      path: "/replacement",
    },
  ];

  const transactionModules = [
    {
      title: "Payment Transactions",
      subtitle: "View and manage payment records",
      icon: CreditCard,
      path: "/payment-transactions",
    },
    {
      title: "Service Transactions",
      subtitle: "Track service transaction history",
      icon: Settings,
      path: "/service-transactions",
    },
  ];

  const billingModules = [
    {
      title: "Invoice List",
      subtitle: "View and manage invoices",
      icon: FileText,
      path: "/invoice-list",
    },
    {
      title: "Invoice Cancellation",
      subtitle: "Cancel existing invoices",
      icon: Ban,
      path: "/invoice-cancellation",
    },
    {
      title: "Auto Renew On Off",
      subtitle: "Toggle auto-renewal settings",
      icon: ToggleLeft,
      path: "/auto-renew-toggle",
    },
  ];

  const quickActions = [
    {
      title: "Add Events",
      subtitle: "Create new subscription events",
      icon: Plus,
      path: "/add-events",
    },
    {
      title: "Bulk Operations",
      subtitle: "Perform bulk subscription actions",
      icon: Package,
      path: "/bulk-operations",
    },
    {
      title: "Reports & Analytics",
      subtitle: "View subscription reports",
      icon: FileText,
      path: "/subscription-reports",
    },
  ];

  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* New Consolidated View Banner */}
      
      
      {/* Subscriber Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('subscription.subscriberManagement')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {subscriberModules.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>

      {/* Subscription Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('subscription.subscriptionOperations')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {subscriptionModules.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>

      {/* Service Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('subscription.serviceManagement')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {serviceModules.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>

      {/* Transaction Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('subscription.transactionManagement')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {transactionModules.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>

      {/* Billing & Invoicing */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('subscription.billingInvoicing')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {billingModules.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {quickActions.map((module) => (
            <ModuleTile
              key={module.title}
              title={module.title}
              subtitle={module.subtitle}
              icon={module.icon}
              path={module.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
