import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Users, UserPlus, Package, CreditCard, Receipt, BarChart3, Monitor,
  Settings, MessageCircle, Layers, DollarSign, Cog, MoreHorizontal, ChevronDown, ChevronRight, Menu, Plus, Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subModules?: ModuleItem[];
}

interface ModuleItem {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  subPages?: ModuleItem[];
}

export default function NavHeader() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const getModuleData = (section: string): ModuleItem[] => {
    switch (section) {
      case 'onboarding':
        return [
          { title: t('home.agentManagement'), subtitle: t('home.agentManagementDesc'), icon: Users, path: "/agent-onboarding" },
          { title: t('home.customerManagement'), subtitle: t('home.customerManagementDesc'), icon: UserPlus, path: "/customer-registration" },
          { title: "KYC Verification", subtitle: "Review and approve agent KYC documents", icon: Settings, path: "/kyc-verification" },
        ];
      case 'inventory-management':
        return [
          {
            title: "Stock Management", 
            subtitle: "Manage all stock operations", 
            icon: Package, 
            path: "/stock-overview",
            subPages: [
              { title: "Stock Overview", subtitle: "View current stock levels and status", icon: Package, path: "/stock-overview" },
              { title: "Stock Request", subtitle: "Request new inventory items", icon: Package, path: "/stock-request" },
              { title: "Stock Approval", subtitle: "Approve pending stock requests", icon: Package, path: "/stock-approval" },
              { title: "Stock Transfer", subtitle: "Transfer stock between locations", icon: Package, path: "/stock-transfer" },
            ]
          },
          {
            title: "Device Management", 
            subtitle: "Device configuration and pairing", 
            icon: Settings, 
            path: "/cas-id-change",
            subPages: [
              { title: "CAS ID Change", subtitle: "Update CAS ID for devices", icon: Settings, path: "/cas-id-change" },
              { title: "STB - SC Pairing", subtitle: "Pair Set-Top Box with Smart Card", icon: Settings, path: "/stb-sc-pairing" },
            ]
          },
          {
            title: "Tracking & Monitoring", 
            subtitle: "Track and monitor inventory", 
            icon: BarChart3, 
            path: "/track-serial",
            subPages: [
              { title: "Track Serial No", subtitle: "Track and search serial numbers", icon: BarChart3, path: "/track-serial" },
            ]
          },
          {
            title: "Warehouse Operations", 
            subtitle: "Warehouse management functions", 
            icon: Package, 
            path: "/warehouse-transfer",
            subPages: [
              { title: "Warehouse Transfer", subtitle: "Transfer between warehouse locations", icon: Package, path: "/warehouse-transfer" },
            ]
          },
          {
            title: "Access Control", 
            subtitle: "Control STB access and blocking", 
            icon: Settings, 
            path: "/block-unblock-agent",
            subPages: [
              { title: "Block / Unblock STB - Agent", subtitle: "Block or unblock STB for agents", icon: Settings, path: "/block-unblock-agent" },
              { title: "Block / Unblock STB - Center", subtitle: "Block or unblock STB from center", icon: Settings, path: "/block-unblock-center" },
            ]
          },
          {
            title: "Agent Operations", 
            subtitle: "Agent-related inventory operations", 
            icon: Users, 
            path: "/agent-replacement",
            subPages: [
              { title: "Agent to Sub Agent Transfer", subtitle: "Transfer items between agents", icon: Users, path: "/agent-replacement" },
            ]
          },
          {
            title: "Purchase Management", 
            subtitle: "Purchase orders and receipts", 
            icon: CreditCard, 
            path: "/po-view",
            subPages: [
              { title: "PO View", subtitle: "View purchase orders", icon: CreditCard, path: "/po-view" },
              { title: "PO GRN Update", subtitle: "Update Goods Receipt Notes", icon: CreditCard, path: "/po-grn-update" },
            ]
          },
          {
            title: "Returns & Sales", 
            subtitle: "Hardware returns and sales", 
            icon: Receipt, 
            path: "/customer-hardware-return",
            subPages: [
              { title: "Customer Hardware Return", subtitle: "Process customer hardware returns", icon: Receipt, path: "/customer-hardware-return" },
              { title: "Agent Hardware Sale", subtitle: "Record agent hardware sales", icon: Receipt, path: "/agent-hardware-sale" },
              { title: "Customer Hardware Sale", subtitle: "Record customer hardware sales (OTC)", icon: Receipt, path: "/customer-hardware-sale" },
            ]
          },
          {
            title: "Repair Management", 
            subtitle: "Repair and replacement operations", 
            icon: Cog, 
            path: "/agent-faulty-repair",
            subPages: [
              { title: "Agent Faulty to Repair Change", subtitle: "Move faulty items to repair status", icon: Cog, path: "/agent-faulty-repair" },
              { title: "Agent Replacement", subtitle: "Process agent equipment replacement", icon: Cog, path: "/agent-replacement" },
            ]
          },
        ];
      case 'payment':
        return [
          { title: "Agent Payment - HW", subtitle: "Hardware payment processing", icon: CreditCard, path: "/agent-payment-hw" },
          { title: "Agent Payment - Subscription", subtitle: "Subscription payment processing", icon: CreditCard, path: "/agent-payment-subscription" },
          { title: "Customer Payment - HW", subtitle: "Customer hardware payments", icon: CreditCard, path: "/customer-payment-hw" },
          { title: "Customer Payment - Subscription", subtitle: "Customer subscription payments", icon: CreditCard, path: "/customer-payment-subscription" },
          { title: "Receipt Cancellation", subtitle: "Cancel payment receipts", icon: CreditCard, path: "/receipt-cancellation" },
          { title: "Customer To Customer Transfer", subtitle: "Transfer between customers", icon: CreditCard, path: "/customer-transfer" },
        ];
      case 'subscriber-management':
        return [
          { title: "Search Subscriber", subtitle: "Find customer subscriptions", icon: Users, path: "/search-subscriber" },
        ];
      case 'adjustment':
        return [
          { title: "Create Adjustment", subtitle: "Create new adjustments", icon: Settings, path: "/adjustment" },
          { title: "Adjustment Approval", subtitle: "Approve pending adjustments", icon: Settings, path: "/adjustment" },
        ];
      case 'service-ticketing':
        return [
          { title: "Service Ticketing", subtitle: "Raise service-related tickets", icon: MessageCircle, path: "/service-ticketing" },
          { title: "New Incident", subtitle: "Create new service desk incidents", icon: Plus, path: "/new-incident-management" },
        ];
      case 'bulk-management':
        return [
          { title: "New Upload & View", subtitle: "New & Upload bulk provisioning file", icon: Layers, path: "/bulk-provision" },
        ];
      case 'agent-commission':
        return [
          { title: "View Commission", subtitle: "View agent commissions", icon: DollarSign, path: "/agent-commission" },
        ];
      case 'provisioning':
        return [
          { title: "Provisioning", subtitle: "On-Screen Display management", icon: Cog, path: "/provisioning" },
        ];
      case 'reports':
        return [
          { title: "Daily Reports", subtitle: "View daily operational reports", icon: BarChart3, path: "/reports/daily" },
          { title: "TRA Reports", subtitle: "View TRA reports", icon: BarChart3, path: "/reports/TRA" },
          { title: "TCRA Reports", subtitle: "View TCRA reports", icon: BarChart3, path: "/reports/TCRA" },
        ];
      default:
        return [];
    }
  };

  // KYC role specific navigation
  const kycNavigationItems: NavigationItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: Monitor },
    { name: "KYC Approval", path: "/kyc-approval", icon: UserPlus },
  ];

  const coreNavigationItems: NavigationItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: Monitor },
    { name: "Onboarding", path: "/onboarding", icon: UserPlus, subModules: getModuleData('onboarding') },
    { name: "Inventory Management", path: "/inventory", icon: Package, subModules: getModuleData('inventory-management') },
    { name: "Payment", path: "/payments", icon: CreditCard, subModules: getModuleData('payment') },
    { name: "Subscriber Management", path: "/subscriptions", icon: Receipt, subModules: getModuleData('subscriber-management') },
    { name: "Adjustment", path: "/adjustment", icon: Settings, subModules: getModuleData('adjustment') },
  ];

  // Operations items as part of hamburger menu structure
  const operationsItems: NavigationItem[] = [
    { name: "Service Ticketing", path: "/service-ticketing", icon: MessageCircle, subModules: getModuleData('service-ticketing') },
    { name: "Bulk Management", path: "/bulk-management", icon: Layers, subModules: getModuleData('bulk-management') },
    { name: "Agent Commission", path: "/agent-commission", icon: DollarSign, subModules: getModuleData('agent-commission') },
    { name: "Provisioning", path: "/provisioning", icon: Cog, subModules: getModuleData('provisioning') },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ];

  // Select navigation items based on user role
  const getNavigationItems = () => {
    if (user?.role === 'kyc') {
      return kycNavigationItems;
    }
    return [...coreNavigationItems, ...operationsItems];
  };

  // All navigation items combined for hamburger menu
  const allNavigationItems = getNavigationItems();

  // Helper function to check if a navigation item should be active
  const isNavigationItemActive = (item: NavigationItem) => {
    // Direct path match
    if (location === item.path) return true;

    // Check if current location matches any sub-module paths
    if (item.subModules) {
      return item.subModules.some(subModule => location === subModule.path);
    }

    // Special cases for section-based matching
    const itemName = item.name.toLowerCase();
    if (itemName.includes('onboarding') && (location.startsWith('/onboarding') || location.startsWith('/agent-onboarding') || location.startsWith('/customer-registration'))) {
      return true;
    }
    if (itemName.includes('approval') && location.startsWith('/kyc-approval')) {
      return true;
    }
    if (itemName.includes('inventory') && (location.startsWith('/inventory') || location.startsWith('/stock') || location.startsWith('/cas-id') || location.startsWith('/stb-sc') || location.startsWith('/track-serial') || location.startsWith('/warehouse') || location.startsWith('/block-unblock') || location.startsWith('/agent-replacement') || location.startsWith('/po-') || location.startsWith('/customer-hardware') || location.startsWith('/agent-hardware') || location.startsWith('/agent-faulty'))) {
      return true;
    }
    if (itemName.includes('payment') && (location.startsWith('/payment') || location.startsWith('/receipt') || location.startsWith('/customer-transfer'))) {
      return true;
    }
    if (itemName.includes('subscriber') && location.startsWith('/search-subscriber')) {
      return true;
    }
    if (itemName.includes('adjustment') && location.startsWith('/adjustment')) {
      return true;
    }
    if (itemName.includes('service') && (location.startsWith('/service-ticketing') || location.startsWith('/new-incident'))) {
      return true;
    }
    if (itemName.includes('bulk') && location.startsWith('/bulk')) {
      return true;
    }
    if (itemName.includes('commission') && (location.startsWith('/agent-commission'))) {
      return true;
    }
    if (itemName.includes('provisioning') && (location.startsWith('/provisioning'))) {
      return true;
    }
    if (itemName.includes('reports') && (location.startsWith('/reports'))) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768); // md breakpoint
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavigationLayout = () => {
    const getItemWidth = (item: NavigationItem) => {
      if (windowWidth < 640) return 44;
      const baseWidth = 28, iconWidth = 16, textWidth = item.name.length * 8;
      return baseWidth + iconWidth + textWidth + 4;
    };

    const allItems = allNavigationItems;
    const moreButtonWidth = windowWidth >= 640 ? 80 : 65;
    const containerPadding = windowWidth >= 640 ? 48 : 32;
    const itemSpacing = 4;
    const safetyBuffer = Math.max(20, windowWidth * 0.02);
    const availableWidth = windowWidth - containerPadding - safetyBuffer;

    let totalWidth = 0, fittingItemsCount = 0;
    for (let i = 0; i < allItems.length; i++) {
      const width = getItemWidth(allItems[i]) + (i > 0 ? itemSpacing : 0);
      if ((totalWidth + width) <= availableWidth) {
        totalWidth += width;
        fittingItemsCount++;
      } else break;
    }

    const finalItemCount = Math.max(fittingItemsCount, 2);
    return {
      primaryItems: allItems.slice(0, finalItemCount),
      secondaryItems: allItems.slice(finalItemCount),
      shouldShowMoreButton: allItems.length > finalItemCount
    };
  };

  const { primaryItems, secondaryItems, shouldShowMoreButton } = getNavigationLayout();

  // For mobile, always show "More" button since we're hiding most nav items
  const shouldShowMoreOnMobile = isMobile && (allNavigationItems.length > 2);

  // Define color schemes for different module types - simplified and consistent
  const getIconColor = (title: string) => {
    const lowerTitle = title.toLowerCase();

    // Agent & Customer - Blue
    if (lowerTitle.includes('agent') || lowerTitle.includes('customer')) {
      return 'text-blue-600';
    }
    // Inventory - Green  
    if (lowerTitle.includes('inventory') || lowerTitle.includes('stock') || lowerTitle.includes('hardware')) {
      return 'text-green-600';
    }
    // Payments - Purple
    if (lowerTitle.includes('payment') || lowerTitle.includes('billing')) {
      return 'text-purple-600';
    }
    // Subscriptions - Orange
    if (lowerTitle.includes('subscription') || lowerTitle.includes('plan') || lowerTitle.includes('renewal')) {
      return 'text-orange-600';
    }
    // Reports - Teal
    if (lowerTitle.includes('report') || lowerTitle.includes('analytics')) {
      return 'text-teal-600';
    }
    // Operations - Red
    if (lowerTitle.includes('operation') || lowerTitle.includes('service') || lowerTitle.includes('ticket')) {
      return 'text-red-600';
    }
    // Default - AZAM Blue
    return 'text-azam-blue';
  };

  const getHoverBg = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('agent') || lowerTitle.includes('customer')) {
      return "hover:bg-blue-100/50";
    }
    if (lowerTitle.includes('inventory') || lowerTitle.includes('stock') || lowerTitle.includes('hardware')) {
      return "hover:bg-green-100/50";
    }
    if (lowerTitle.includes('payment') || lowerTitle.includes('billing')) {
      return "hover:bg-purple-100/50";
    }
    if (lowerTitle.includes('subscription') || lowerTitle.includes('plan') || lowerTitle.includes('renewal')) {
      return "hover:bg-orange-100/50";
    }
    if (lowerTitle.includes('report') || lowerTitle.includes('analytics')) {
      return "hover:bg-teal-100/50";
    }
    if (lowerTitle.includes('operation') || lowerTitle.includes('service') || lowerTitle.includes('ticket')) {
      return "hover:bg-red-100/50";
    }
    return "hover:bg-gray-100/50";
  };

  const renderDropdownContent = (modules: ModuleItem[]) => {
    if (!modules || modules.length === 0) return null;

    // Get background gradient based on category
    const getCategoryGradient = (modules: ModuleItem[]) => {
      if (!modules.length) return "from-gray-50 to-white";

      const firstModule = modules[0].title.toLowerCase();

      if (firstModule.includes('agent') || firstModule.includes('customer')) {
        return "from-blue-50 to-white"; // Onboarding - Blue theme
      }
      if (firstModule.includes('inventory') || firstModule.includes('stock')) {
        return "from-green-50 to-white"; // Inventory - Green theme
      }
      if (firstModule.includes('payment')) {
        return "from-purple-50 to-white"; // Payments - Purple theme
      }
      if (firstModule.includes('report') || firstModule.includes('analytics')) {
        return "from-teal-50 to-white"; // Analytics - Teal theme
      }
      if (firstModule.includes('operation') || firstModule.includes('service')) {
        return "from-red-50 to-white"; // Operations - Red theme
      }
      return "from-orange-50 to-white"; // Default - Orange theme
    };

    const getBorderColor = (modules: ModuleItem[]) => {
      if (!modules.length) return "border-gray-200";

      const firstModule = modules[0].title.toLowerCase();

      if (firstModule.includes('agent') || firstModule.includes('customer')) {
        return "border-blue-200";
      }
      if (firstModule.includes('inventory') || firstModule.includes('stock')) {
        return "border-green-200";
      }
      if (firstModule.includes('payment')) {
        return "border-purple-200";
      }
      if (firstModule.includes('report') || firstModule.includes('analytics')) {
        return "border-teal-200";
      }
      if (firstModule.includes('operation') || firstModule.includes('service')) {
        return "border-red-200";
      }
      return "border-orange-200";
    };

    return (
      <div className={`absolute top-full left-0 w-full bg-gradient-to-b ${getCategoryGradient(modules)} border ${getBorderColor(modules)} shadow-lg z-50 rounded-b-lg`}>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const iconColorClass = getIconColor(module.title);
              const hoverBgClass = getHoverBg(module.title);

              // Check if module has subPages to render as expandable
              if (module.subPages && module.subPages.length > 0) {
                return (
                  <div key={index} className="space-y-2">
                    {/* Category Header */}
                    <div className={`p-3 bg-white/50 border border-gray-200 rounded-lg ${hoverBgClass}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className={`h-4 w-4 ${iconColorClass}`} />
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{module.title}</p>
                          <p className="text-xs text-gray-500">{module.subtitle}</p>
                        </div>
                      </div>

                      {/* Sub-pages grid */}
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {module.subPages.map((subPage, subPageIndex) => {
                          const SubPageIcon = subPage.icon;
                          const subPageIconColorClass = getIconColor(subPage.title);
                          const subPageHoverBgClass = getHoverBg(subPage.title);

                          return (
                            <div
                              key={subPageIndex}
                              onClick={() => setLocation(subPage.path)}
                              className={`cursor-pointer p-2 flex items-center space-x-2 rounded-md transition-all duration-200 ${subPageHoverBgClass} hover:shadow-sm`}
                            >
                              <SubPageIcon className={`h-3 w-3 flex-shrink-0 ${subPageIconColorClass}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs text-gray-900 truncate">{subPage.title}</p>
                                <p className="text-[10px] text-gray-500 truncate">
                                  {subPage.subtitle}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular module without sub-pages
              return (
                <div
                  key={index}
                  onClick={() => setLocation(module.path)}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${hoverBgClass} transition-all duration-200 cursor-pointer group border border-transparent hover:border-white hover:shadow-sm`}
                >
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${iconColorClass} group-hover:scale-110 transition-transform duration-200`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-azam-blue transition-colors duration-200 truncate">
                      {module.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {module.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile when menu is open */}
      {isHamburgerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsHamburgerOpen(false)}
        />
      )}

      {/* Full-length side menu */}
      <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-50 to-white shadow-xl border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out overflow-y-auto ${
        isHamburgerOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobile ? 'w-80' : 'w-96'}`}>
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-azam-blue text-white">
          <h2 className="text-lg font-semibold">Navigation Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHamburgerOpen(false)}
            className="text-white hover:bg-white/10 p-2"
          >
            ✕
          </Button>
        </div>

        <div className="p-4">
          {/* Core Navigation Items */}
          <div className="space-y-1">
            {coreNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavigationItemActive(item);

              const getItemColors = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('dashboard')) {
                  return {
                    icon: isActive ? "text-blue-600" : "text-blue-500",
                    hover: "hover:bg-blue-50 hover:text-blue-700",
                    active: "bg-blue-50/80 text-blue-700 border-l-2 border-blue-500"
                  };
                }
                if (lowerName.includes('onboarding')) {
                  return {
                    icon: isActive ? "text-orange-600" : "text-orange-500",
                    hover: "hover:bg-orange-50 hover:text-orange-700",
                    active: "bg-orange-50/80 text-orange-700 border-l-2 border-orange-500"
                  };
                }
                if (lowerName.includes('inventory')) {
                  return {
                    icon: isActive ? "text-green-600" : "text-green-500",
                    hover: "hover:bg-green-50 hover:text-green-700",
                    active: "bg-green-50/80 text-green-700 border-l-2 border-green-500"
                  };
                }
                if (lowerName.includes('payment')) {
                  return {
                    icon: isActive ? "text-purple-600" : "text-purple-500",
                    hover: "hover:bg-purple-50 hover:text-purple-700",
                    active: "bg-purple-50/80 text-purple-700 border-l-2 border-purple-500"
                  };
                }
                if (lowerName.includes('subscriber')) {
                  return {
                    icon: isActive ? "text-orange-600" : "text-orange-500",
                    hover: "hover:bg-orange-50 hover:text-orange-700",
                    active: "bg-orange-50/80 text-orange-700 border-l-2 border-orange-500"
                  };
                }
                if (lowerName.includes('adjustment')) {
                  return {
                    icon: isActive ? "text-gray-600" : "text-gray-500",
                    hover: "hover:bg-gray-50 hover:text-gray-700",
                    active: "bg-gray-50/80 text-gray-700 border-l-2 border-gray-500"
                  };
                }
                return {
                  icon: isActive ? "text-azam-blue" : "text-gray-500",
                  hover: "hover:bg-azam-blue/5 hover:text-azam-blue",
                  active: "bg-azam-blue/5 text-azam-blue border-l-2 border-azam-blue"
                };
              };

              const colors = getItemColors(item.name);

              if (item.subModules && item.subModules.length > 0) {
                const isExpanded = expandedSections.has(item.name);

                return (
                  <div key={item.path} className="space-y-1">
                    {/* Parent Item */}
                    <div
                      onClick={() => toggleSection(item.name)}
                      className={`cursor-pointer p-4 flex items-center justify-between rounded-md transition-all duration-200 mx-1 ${isActive ? colors.active : colors.hover}`}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="h-5 w-5 flex-shrink-0 text-current" />
                        <span className="font-medium text-base">{item.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Expanded Sections */}
                    {isExpanded && (
                      <div className="ml-6 pl-3 space-y-1 border-l-2 border-gray-100">
                        {item.subModules.map((subModule, subIndex) => {
                          const SubIcon = subModule.icon;
                          const subIconColorClass = getIconColor(subModule.title);
                          const subHoverBgClass = getHoverBg(subModule.title);
                          const isSubActive = location === subModule.path;

                          // Check if this module has sub-pages
                          if (subModule.subPages && subModule.subPages.length > 0) {
                            return (
                              <div key={subIndex} className="border-b border-gray-100 last:border-b-0 py-2">
                                {/* Category Header */}
                                <div className="px-2 py-1 bg-gray-50/50 border-l-2 border-azam-blue/20 rounded-sm">
                                  <div className="flex items-center space-x-2">
                                    <SubIcon className={`h-4 w-4 ${subIconColorClass}`} />
                                    <div>
                                      <p className="font-semibold text-sm text-gray-800">{subModule.title}</p>
                                      <p className="text-xs text-gray-600">{subModule.subtitle}</p>
                                    </div>
                                  </div>
                                </div>
                                {/* Sub-pages */}
                                <div className="pl-4 space-y-1 mt-1">
                                  {subModule.subPages.map((subPage, subPageIndex) => {
                                    const SubPageIcon = subPage.icon;
                                    const subPageIconColorClass = getIconColor(subPage.title);
                                    const subPageHoverBgClass = getHoverBg(subPage.title);
                                    const isSubPageActive = location === subPage.path;

                                    return (
                                      <div
                                        key={subPageIndex}
                                        onClick={() => {
                                          setLocation(subPage.path);
                                          setIsHamburgerOpen(false);
                                        }}
                                        className={`cursor-pointer p-2 flex items-start space-x-2 rounded-md transition-all duration-200 ${isSubPageActive ? 'bg-azam-blue/10 text-azam-blue border-l-2 border-azam-blue' : subPageHoverBgClass}`}
                                      >
                                        <SubPageIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${subPageIconColorClass}`} />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm text-gray-900 leading-tight">{subPage.title}</p>
                                          <p className="text-xs text-gray-500 leading-tight mt-0.5 whitespace-normal">{subPage.subtitle}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          // Regular module without sub-pages
                          return (
                            <div
                              key={subIndex}
                              onClick={() => {
                                setLocation(subModule.path);
                                setIsHamburgerOpen(false);
                              }}
                              className={`cursor-pointer p-3 flex items-start space-x-3 rounded-md transition-all duration-200 ${isSubActive ? 'bg-azam-blue/10 text-azam-blue border-l-2 border-azam-blue' : subHoverBgClass}`}
                            >
                              <SubIcon className="h-4 w-4 flex-shrink-0 text-current" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 leading-tight">{subModule.title}</p>
                                <p className="text-xs text-gray-500 leading-tight mt-0.5 whitespace-normal">{subModule.subtitle}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
                // Simple navigation item without sub-modules
                return (
                  <div
                    key={item.path}
                    onClick={() => {
                      setLocation(item.path);
                      setIsHamburgerOpen(false);
                    }}
                    className={`cursor-pointer p-4 flex items-center space-x-4 rounded-md transition-all duration-200 mx-1 ${isActive ? colors.active : colors.hover}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 text-current" />
                    <span className="font-medium text-base">{item.name}</span>
                  </div>
                );
              }
            })}
          </div>

          {/* Operations Items */}
          {operationsItems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Operations</h3>
              <div className="space-y-1">
                {operationsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isNavigationItemActive(item);
                  const colors = {
                    icon: isActive ? "text-azam-blue" : "text-gray-500",
                    hover: "hover:bg-azam-blue/5 hover:text-azam-blue",
                    active: "bg-azam-blue/5 text-azam-blue border-l-2 border-azam-blue"
                  };

                  if (item.subModules && item.subModules.length > 0) {
                    const isExpanded = expandedSections.has(item.name);

                    return (
                      <div key={item.path} className="space-y-1">
                        {/* Parent Item */}
                        <div
                          onClick={() => toggleSection(item.name)}
                          className={`cursor-pointer p-4 flex items-center justify-between rounded-md transition-all duration-200 mx-1 ${isActive ? colors.active : colors.hover}`}
                        >
                          <div className="flex items-center space-x-4">
                            <Icon className="h-5 w-5 flex-shrink-0 text-current" />
                            <span className="font-medium text-base">{item.name}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Expanded Sections */}
                        {isExpanded && (
                          <div className="ml-6 pl-3 space-y-1 border-l-2 border-gray-100">
                            {item.subModules.map((subModule, subIndex) => {
                              const SubIcon = subModule.icon;
                              const subIconColorClass = getIconColor(subModule.title);
                              const subHoverBgClass = getHoverBg(subModule.title);
                              const isSubActive = location === subModule.path;

                              return (
                                <div
                                  key={subIndex}
                                  onClick={() => {
                                    setLocation(subModule.path);
                                    setIsHamburgerOpen(false);
                                  }}
                                  className={`cursor-pointer p-3 flex items-start space-x-3 rounded-md transition-all duration-200 ${isSubActive ? 'bg-azam-blue/10 text-azam-blue border-l-2 border-azam-blue' : subHoverBgClass}`}
                                >
                                  <SubIcon className="h-4 w-4 flex-shrink-0 text-current" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 leading-tight">{subModule.title}</p>
                                    <p className="text-xs text-gray-500 leading-tight mt-0.5 whitespace-normal">{subModule.subtitle}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item.path}
                        onClick={() => {
                          setLocation(item.path);
                          setIsHamburgerOpen(false);
                        }}
                        className={`cursor-pointer p-4 flex items-center space-x-4 rounded-md transition-all duration-200 mx-1 ${isActive ? colors.active : colors.hover}`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 text-current" />
                        <span className="font-medium text-base">{item.name}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative bg-azam-blue px-2 sm:px-3 md:px-4 py-0">
        <div className={`flex items-center justify-between w-full ${isMobile ? 'h-12' : 'h-10'}`}>
          {/* Hamburger Menu Button */}
          <div className={`flex-shrink-0 ${isMobile ? 'mr-2' : 'mr-3'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              className={`flex items-center justify-center p-0 text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 ${
                isMobile ? 'w-10 h-10' : 'w-9 h-9'
              }`}
            >
              <Menu className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
            </Button>
          </div>

        {/* Mobile: Hide navigation items completely - show only hamburger menu */}
        {isMobile ? (
          <div className="flex-1"></div>
        ) : (
          /* Desktop: Show full navigation */
          <div className="flex items-center space-x-0 flex-1 overflow-hidden">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavigationItemActive(item);

              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => item.subModules && setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.subModules ? (
                    <div
                      className={`flex items-center space-x-1.5 px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap rounded-lg cursor-default
                        ${isActive
                          ? "bg-white/95 text-azam-orange shadow-lg backdrop-blur-sm"
                          : "text-white hover:bg-white/95 hover:text-azam-orange hover:shadow-lg hover:backdrop-blur-sm hover:scale-105"}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLocation(item.path)}
                      className={`flex items-center space-x-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap rounded-lg transition-all duration-300
                        ${isActive
                          ? "bg-white/95 text-azam-orange shadow-lg backdrop-blur-sm scale-105"
                          : "text-white hover:bg-white/95 hover:text-azam-orange hover:shadow-lg hover:backdrop-blur-sm hover:scale-105"}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isMobile && (shouldShowMoreButton || shouldShowMoreOnMobile) && (
          <div className="flex-shrink-0 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 text-sm font-semibold text-white hover:bg-white/95 hover:text-azam-orange rounded-lg hover:shadow-lg hover:backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isMobile ? 'px-2 py-2 h-10' : 'px-3 py-2 h-9'
                  }`}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-xs">More</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 bg-gradient-to-b from-slate-50 to-white shadow-lg border border-slate-200 rounded-lg">
                {(isMobile ? [...coreNavigationItems.slice(2), ...operationsItems] : secondaryItems).map((item) => {
                  const Icon = item.icon;
                  const isActive = isNavigationItemActive(item);

                  // Get color scheme for each item
                  const getItemColors = (name: string) => {
                    const lowerName = name.toLowerCase();
                    if (lowerName.includes('operation')) {
                      return {
                        icon: isActive ? "text-red-600" : "text-red-500",
                        hover: "hover:bg-red-50 hover:text-red-700",
                        active: "bg-red-50/80 text-red-700 border-l-2 border-red-500"
                      };
                    }
                    if (lowerName.includes('analytics')) {
                      return {
                        icon: isActive ? "text-teal-600" : "text-teal-500",
                        hover: "hover:bg-teal-50 hover:text-teal-700",
                        active: "bg-teal-50/80 text-teal-700 border-l-2 border-teal-500"
                      };
                    }
                    return {
                      icon: isActive ? "text-azam-blue" : "text-gray-500",
                      hover: "hover:bg-azam-blue/5 hover:text-azam-blue",
                      active: "bg-azam-blue/5 text-azam-blue border-l-2 border-azam-blue"
                    };
                  };

                  const colors = getItemColors(item.name);

                  // If item has submodules, render as submenu
                  if (item.subModules && item.subModules.length > 0) {
                    return (
                      <DropdownMenuSub key={item.path}>
                        <DropdownMenuSubTrigger className={`cursor-pointer p-3 flex items-center justify-between rounded-md transition-all duration-200 mx-1 ${
                          isActive ? colors.active : colors.hover
                        }`}>
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-4 w-4 flex-shrink-0 ${colors.icon}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-64 bg-gradient-to-b from-slate-50 to-white shadow-lg border border-slate-200 rounded-lg">
                          {item.subModules.map((subModule, subIndex) => {
                            const SubIcon = subModule.icon;
                            const subIconColorClass = getIconColor(subModule.title);
                            const subHoverBgClass = getHoverBg(subModule.title);
                            const isSubActive = location === subModule.path;

                            return (
                              <DropdownMenuItem
                                key={subIndex}
                                onClick={() => setLocation(subModule.path)}
                                className={`cursor-pointer p-3 flex items-center space-x-3 rounded-md transition-all duration-200 mx-1 ${
                                  isSubActive ? 'bg-azam-blue/10 text-azam-blue border-l-2 border-azam-blue' : subHoverBgClass
                                }`}
                              >
                                <SubIcon className={`h-4 w-4 flex-shrink-0 ${subIconColorClass}`} />
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-900">{subModule.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{subModule.subtitle}</p>
                                </div>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }

                  // Regular menu item without submodules
                  return (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => setLocation(item.path)}
                      className={`cursor-pointer p-3 flex items-center space-x-3 rounded-md transition-all duration-200 mx-1 ${
                        isActive 
                          ? colors.active
                          : colors.hover
                      }`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${colors.icon}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {hoveredItem && !isMobile && (
        <div
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {(() => {
            const hoveredItemData = [...coreNavigationItems, ...operationsItems].find(item => item.name === hoveredItem);
            return hoveredItemData?.subModules ? renderDropdownContent(hoveredItemData.subModules) : null;
          })()}
        </div>
      )}
    </div>
    </>
  );
}