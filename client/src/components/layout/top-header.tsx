import { useState } from "react";
import { ChevronDown, User, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import AdvancedSearch from "@/components/ui/advanced-search";
import ApiConfigPanel from "@/components/ApiConfigPanel";
import logo from "@/assets/logo.png";

export default function TopHeader() {
  const [, setLocation] = useLocation();
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // Comprehensive page structure with categories and sub-pages
  const allPages = [
    // Core Modules
    { name: "Home", path: "/", category: "Core" },
    { name: t('navigation.dashboard'), path: "/dashboard", category: "Core" },

    // Onboarding
    { name: "Agent Onboarding", path: "/agent-onboarding", category: "Onboarding" },
    { name: "Customer Registration", path: "/customer-registration", category: "Onboarding" },

    // Customer Management
    { name: "Search Subscriber", path: "/search-subscriber", category: "Customer Management" },
    { name: "Subscriber View", path: "/subscriber-view", category: "Customer Management" },
    { name: "Consolidated Subscriptions", path: "/consolidated-subscriptions", category: "Customer Management" },

    // Inventory Management
    { name: "Inventory Overview", path: "/inventory", category: "Inventory" },
    { name: "Stock Overview", path: "/stock-overview", category: "Inventory" },
    { name: "Stock Request", path: "/stock-request", category: "Inventory" },
    { name: "Stock Approval", path: "/stock-approval", category: "Inventory" },
    { name: "Stock Transfer", path: "/stock-transfer", category: "Inventory" },
    { name: "Serial Tracking", path: "/serial-tracking", category: "Inventory" },
    { name: "CAS ID Change", path: "/cas-id-change", category: "Inventory" },
    { name: "STB Smart Card Pairing", path: "/stb-smart-card-pairing", category: "Inventory" },
    { name: "Warehouse Transfer", path: "/warehouse-transfer", category: "Inventory" },
    { name: "Block STB - Agent", path: "/block-stb-agent", category: "Inventory" },
    { name: "Block STB - Center/WH", path: "/block-stb-center", category: "Inventory" },
    { name: "Unblock STB - Agent", path: "/unblock-stb-agent", category: "Inventory" },
    { name: "Unblock STB - Center/WH", path: "/unblock-stb-center", category: "Inventory" },
    { name: "PO - GRN Update", path: "/po-grn-update", category: "Inventory" },
    { name: "PO View", path: "/po-view", category: "Inventory" },
    { name: "Customer Hardware Return", path: "/customer-hardware-return", category: "Inventory" },
    { name: "Agent Faulty to Repair", path: "/agent-faulty-repair", category: "Inventory" },

    // Payment Management
    { name: "Payments Overview", path: "/payments", category: "Payments" },
    { name: "Agent Payment - Hardware", path: "/agent-payment-hw", category: "Payments" },
    { name: "Agent Payment - Subscription", path: "/agent-payment-sub", category: "Payments" },
    { name: "Customer Payment - Hardware", path: "/customer-payment-hw", category: "Payments" },
    { name: "Customer Payment - Subscription", path: "/customer-payment-sub", category: "Payments" },
    { name: "Receipt Cancellation", path: "/receipt-cancellation", category: "Payments" },
    { name: "Customer to Customer Transfer", path: "/customer-transfer", category: "Payments" },

    // Subscription Management
    { name: "Subscriptions Overview", path: "/subscriptions", category: "Subscriptions" },
    { name: "Subscription Purchase", path: "/subscription-purchase", category: "Subscriptions" },
    { name: "Subscription Renewal", path: "/subscription-renewal", category: "Subscriptions" },
    { name: "Plan Change", path: "/plan-change", category: "Subscriptions" },
    { name: "Add Addon Packs", path: "/add-addon-packs", category: "Subscriptions" },
    { name: "Customer Suspension", path: "/customer-suspension", category: "Subscriptions" },

    // Operations
    { name: "Adjustment", path: "/adjustment", category: "Operations" },
    { name: "Service Ticketing", path: "/service-ticketing", category: "Operations" },
    { name: "Bulk Provision", path: "/bulk-provision", category: "Operations" },
    { name: "Agent Commission", path: "/agent-commission", category: "Operations" },
    { name: "Provisioning", path: "/provisioning", category: "Operations" },

    // Reports & Analytics
    { name: "Reports", path: "/reports", category: "Reports" },
    { name: "Analytics Dashboard", path: "/analytics", category: "Reports" },

    // Administration
    { name: "User Management", path: "/user-management", category: "Administration" },
    { name: "System Settings", path: "/system-settings", category: "Administration" },
    { name: "Audit Logs", path: "/audit-logs", category: "Administration" },
  ];

  // Hot keys for popular searches
  const hotKeys = [
    t('navigation.dashboard'),
    "Inventory Overview",
    "Payments Overview", 
    "Subscriptions Overview",
    "Agent Onboarding",
    "Customer Registration",
    "Search Subscriber",
    "Stock Overview",
    "Consolidated Subscriptions"
  ];

  // All page names for search suggestions
  const tipKeys = allPages.map(page => page.name);

  const handleSearch = (searchValue: string) => {
    // Find matching page
    const matchedPage = allPages.find(page => 
      page.name.toLowerCase() === searchValue.toLowerCase()
    );

    if (matchedPage) {
      setLocation(matchedPage.path);
    } else {
      // Fallback to search subscriber page with search term
      setLocation(`/search-subscriber?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handlePageSelect = (path: string) => {
    setLocation(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="bg-azam-header shadow-sm border-b border-azam-header-dark">
      {/* SAP Fiori Shell Bar */}
      <div className="flex items-center justify-between h-14 px-3 sm:px-4">
        {/* Left side - Logo and Product Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="AZAM TV Logo"
              className="h-11 w-auto object-contain"
            />
            

            {/* Mobile Menu Button - SAP Fiori Style */}
            <div className="hidden sm:block h-5 w-px bg-white/20"></div>
            <span className="hidden sm:inline text-white text-sm font-medium">VAI</span>


          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Advanced Search Bar (Desktop) - SAP Fiori styled */}
          <div className="hidden sm:flex relative">
            <div className="bg-white rounded border border-white">
              <AdvancedSearch
                hotKeys={hotKeys}
                tipKeys={tipKeys}
                allPages={allPages}
                onSearch={handleSearch}
                placeholder={t('common.search') + " pages..."}
                className="w-[400px] bg-transparent border-none text-black placeholder:text-gray-700"
              />
            </div>
          </div>

          {/* Language Switcher - SAP Fiori Style */}
          <div className="text-white">
            <LanguageSwitcher variant="minimal" />
          </div>

          {/* Notifications - SAP Fiori Style */}
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-azam-header-light p-2 h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 bg-[#d53835] text-white text-xs rounded-full h-3.5 w-3.5 flex items-center justify-center text-[10px] font-medium">3</span>
          </Button>

          {/* User Menu - SAP Fiori Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-white hover:bg-azam-header-light px-2 h-8">
                <div className="w-6 h-6 bg-azam-orange rounded-full flex items-center justify-center border border-azam-orange">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="hidden sm:inline text-xs text-white font-medium">{user?.firstName || "Admin User"}</span>
                <ChevronDown className="h-3 w-3 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mt-1 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem className="cursor-pointer text-sm">
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-sm">
                <Settings className="mr-2 h-4 w-4" />
                {t('common.settings')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-sm"
                onClick={() => setIsApiConfigOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                API Configuration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-sm text-[#d53835] hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('navigation.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Advanced Search Bar - SAP Fiori Style */}
      <div className="sm:hidden border-t border-azam-header-dark bg-azam-header">
        <div className="p-3">
          <div className="bg-white rounded border border-white">
            <AdvancedSearch
              hotKeys={hotKeys}
              tipKeys={tipKeys}
              allPages={allPages}
              onSearch={handleSearch}
              placeholder={t('common.search') + " pages..."}
              className="w-full bg-transparent border-none text-black placeholder:text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* API Configuration Panel */}
      <ApiConfigPanel 
        isOpen={isApiConfigOpen} 
        onClose={() => setIsApiConfigOpen(false)} 
      />
    </div>
  );
}