import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { 
  Users, 
  UserPlus, 
  Package, 
  CreditCard, 
  Receipt, 
  Settings,
  BarChart3,
  MessageCircle,
  Layers,
  DollarSign,
  Cog
} from "lucide-react";

function getModules(t: (key: string) => string) {
  return [
    {
      title: t('home.agentManagement'),
      subtitle: t('home.agentManagementDesc'),
      icon: Users,
      path: "/onboarding",
      category: "Core"
    },
    {
      title: t('home.customerManagement'),
      subtitle: t('home.customerManagementDesc'),
      icon: UserPlus,
      path: "/onboarding",
      category: "Core"
    },
    {
      title: t('home.inventoryManagement'),
      subtitle: t('home.inventoryManagementDesc'),
      icon: Package,
      path: "/inventory",
      category: "Core"
    },
    {
      title: t('home.paymentProcessing'),
      subtitle: t('home.paymentProcessingDesc'),
      icon: CreditCard,
      path: "/payments",
      category: "Core"
    },
    {
      title: t('home.subscriptionManagement'),
      subtitle: t('home.subscriptionManagementDesc'),
      icon: Receipt,
      path: "/subscriptions",
      category: "Core"
    },
    {
      title: t('home.reportsAnalytics'),
      subtitle: t('home.reportsAnalyticsDesc'),
      icon: BarChart3,
      path: "/reports",
      category: "Analytics"
    },
    {
      title: t('home.adjustment'),
      subtitle: t('home.adjustmentDesc'),
      icon: Settings,
      path: "/adjustment",
      category: "Operations"
    },
    {
      title: t('home.serviceTicketing'),
      subtitle: t('home.serviceTicketingDesc'),
      icon: MessageCircle,
      path: "/service-ticketing",
      category: "Operations"
    },
    {
      title: t('home.bulkProvision'),
      subtitle: t('home.bulkProvisionDesc'),
      icon: Layers,
      path: "/bulk-provision",
      category: "Operations"
    },
    {
      title: t('home.agentCommission'),
      subtitle: t('home.agentCommissionDesc'),
      icon: DollarSign,
      path: "/agent-commission",
      category: "Operations"
    },
    {
      title: "Provisioning",
      subtitle: "Service provisioning management",
      icon: Cog,
      path: "/provisioning",
      category: "Operations"
    }
  ];
}

function getQuickActions(t: (key: string) => string) {
  return [
    {
      title: t('home.newAgent'),
      subtitle: t('home.newAgentDesc'),
      icon: UserPlus,
      path: "/agent-onboarding?mode=new"
    },
    {
      title: t('home.newCustomer'),
      subtitle: t('home.newCustomerDesc'),
      icon: UserPlus,
      path: "/customer-registration?mode=new"
    },
    {
      title: t('home.updateInventory'),
      subtitle: t('home.updateInventoryDesc'),
      icon: Package,
      path: "/inventory"
    },
    {
      title: t('home.processPayment'),
      subtitle: t('home.processPaymentDesc'),
      icon: CreditCard,
      path: "/payments"
    }
  ];
}

export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  const modules = getModules(t);
  const quickActions = getQuickActions(t);

  const ModuleTile = ({ module }: { module: any }) => {
    const Icon = module.icon;
    return (
      <div
        onClick={() => handleModuleClick(module.path)}
        className="bg-white rounded-lg shadow-sm border border-azam-orange/30 p-4 hover:shadow-lg hover:border-azam-orange transition-all cursor-pointer group"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-azam-orange rounded-lg mb-3 group-hover:bg-azam-orange-dark transition-colors">
            <Icon className="h-6 w-6 text-white" />
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


        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <ModuleTile key={index} module={action} />
            ))}
          </div>
        </div>

        {/* Core Modules */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.coreModules')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {modules.filter(module => module.category === "Core").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Analytics Modules */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.analyticsModules')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {modules.filter(module => module.category === "Analytics").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>

        {/* Operations Modules */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.operationsModules')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {modules.filter(module => module.category === "Operations").map((module, index) => (
              <ModuleTile key={index} module={module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}