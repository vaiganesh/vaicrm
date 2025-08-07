import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";

import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import AgentOnboarding from "@/pages/agent-onboarding";
import Inventory from "@/pages/inventory";
import InventoryModules from "@/pages/inventory-modules";
import InventoryManagement from "@/pages/inventory-management";
import StockOverview from "@/pages/stock-overview";
import StockRequest from "@/pages/stock-request";
import StockApproval from "@/pages/stock-approval";
import StockTransfer from "@/pages/stock-transfer";
import TrackSerial from "@/pages/track-serial";
import CasIdChange from "@/pages/cas-id-change";
import StbScPairing from "@/pages/stb-sc-pairing";
import WarehouseTransfer from "@/pages/warehouse-transfer";
import BlockUnblockAgent from "@/pages/block-unblock-agent";
import BlockUnblockCenter from "@/pages/block-unblock-center";
import POGRNUpdate from "@/pages/po-grn-update";
import POView from "@/pages/po-view";
import CustomerHardwareReturn from "@/pages/customer-hardware-return";
import AgentReplacement from "@/pages/agent-replacement";
import AgentFaultyRepair from "@/pages/agent-faulty-repair";
import AgentPaymentHW from "@/pages/agent-payment-hw";
import AgentHardwareSale from "@/pages/agent-hardware-sale";
import CustomerHardwareSale from "@/pages/customer-hardware-sale";
import CustomerPaymentHW from "@/pages/customer-payment-hw";
import CustomerPaymentSubscription from "@/pages/customer-payment-subscription";
import CustomerRegistration from "@/pages/customer-registration";
import Payments from "@/pages/payments";
import Subscriptions from "@/pages/subscriptions";
import ConsolidatedSubscriptions from "@/pages/consolidated-subscriptions";
import SubscriptionPurchase from "@/pages/subscription-purchase";
import SubscriptionRenewal from "@/pages/subscription-renewal";
import PlanChange from "@/pages/plan-change";
import OfferChange from "@/pages/offer-change";
import PlanValidityExtension from "@/pages/plan-validity-extension";
import AddAddonPacks from "@/pages/add-addon-packs";
import CustomerSuspension from "@/pages/customer-suspension";
import CustomerDisconnection from "@/pages/customer-disconnection";
import Termination from "@/pages/termination";
import Replacement from "@/pages/replacement";
import Reconnection from "@/pages/reconnection";
import SearchSubscriber from "@/pages/search-subscriber";
import SubscriberView from "@/pages/subscriber-view";
import Reports from "@/pages/reports";
import UnifiedReports from "@/pages/reports-unified";
import Adjustment from "@/pages/adjustment";
import ServiceTicketing from "@/pages/new-service-ticketing";
import IncidentManagement from "@/pages/new-incident-management";
import BulkProvision from "@/pages/bulk-provision";
import Provisioning from "@/pages/provisioning";
import KYCApproval from "@/pages/kyc-approval";
import KYCVerification from "@/pages/kyc-verification";
import TopHeader from "@/components/layout/top-header";
import NavHeader from "@/components/layout/nav-header";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import AgentCommission from "@/pages/agent-commission";
import AgentPaymentSubscription from "@/pages/agent-payment-subscription";
import ReceiptCancellation from "@/pages/receipt-cancellation";
import CustomerTransfer from "@/pages/customer-transfer";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopHeader />
      <NavHeader />
      <Breadcrumbs />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-azam-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => (
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      )} />
      <Route path="/dashboard" component={() => (
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      )} />
      <Route path="/onboarding" component={() => (
        <ProtectedLayout>
          <Onboarding />
        </ProtectedLayout>
      )} />
      <Route path="/agent-onboarding" component={() => (
        <ProtectedLayout>
          <AgentOnboarding />
        </ProtectedLayout>
      )} />
      <Route path="/kyc-approval" component={() => (
        <ProtectedLayout>
          <KYCApproval />
        </ProtectedLayout>
      )} />
      <Route path="/kyc-verification" component={() => (
        <ProtectedLayout>
          <KYCVerification />
        </ProtectedLayout>
      )} />

      <Route path="/inventory" component={() => (
        <ProtectedLayout>
          <InventoryModules />
        </ProtectedLayout>
      )} />
      <Route path="/inventory-management" component={() => (
        <ProtectedLayout>
          <InventoryManagement />
        </ProtectedLayout>
      )} />
      <Route path="/stock-overview" component={() => (
        <ProtectedLayout>
          <StockOverview />
        </ProtectedLayout>
      )} />
      <Route path="/stock-request" component={() => (
        <ProtectedLayout>
          <StockRequest />
        </ProtectedLayout>
      )} />
      <Route path="/stock-approval" component={() => (
        <ProtectedLayout>
          <StockApproval />
        </ProtectedLayout>
      )} />
      <Route path="/stock-transfer" component={() => (
        <ProtectedLayout>
          <StockTransfer />
        </ProtectedLayout>
      )} />
      <Route path="/track-serial" component={() => (
        <ProtectedLayout>
          <TrackSerial />
        </ProtectedLayout>
      )} />
      <Route path="/cas-id-change" component={() => (
        <ProtectedLayout>
          <CasIdChange />
        </ProtectedLayout>
      )} />
      <Route path="/stb-sc-pairing" component={() => (
        <ProtectedLayout>
          <StbScPairing />
        </ProtectedLayout>
      )} />
      <Route path="/warehouse-transfer" component={() => (
        <ProtectedLayout>
          <WarehouseTransfer />
        </ProtectedLayout>
      )} />
      <Route path="/block-unblock-agent" component={() => (
        <ProtectedLayout>
          <BlockUnblockAgent />
        </ProtectedLayout>
      )} />
      <Route path="/block-unblock-center" component={() => (
        <ProtectedLayout>
          <BlockUnblockCenter />
        </ProtectedLayout>
      )} />
      <Route path="/po-grn-update" component={() => (
        <ProtectedLayout>
          <POGRNUpdate />
        </ProtectedLayout>
      )} />
      <Route path="/po-view" component={() => (
        <ProtectedLayout>
          <POView />
        </ProtectedLayout>
      )} />
      <Route path="/customer-hardware-return" component={() => (
        <ProtectedLayout>
          <CustomerHardwareReturn />
        </ProtectedLayout>
      )} />
      <Route path="/agent-replacement" component={() => (
        <ProtectedLayout>
          <AgentReplacement />
        </ProtectedLayout>
      )} />
      <Route path="/agent-faulty-repair" component={() => (
        <ProtectedLayout>
          <AgentFaultyRepair />
        </ProtectedLayout>
      )} />
      <Route path="/agent-payment-hw" component={() => (
        <ProtectedLayout>
          <AgentPaymentHW />
        </ProtectedLayout>
      )} />
      <Route path="/agent-payment-subscription" component={() => (
        <ProtectedLayout>
          <AgentPaymentSubscription />
        </ProtectedLayout>
      )} />
      <Route path="/agent-hardware-sale" component={() => (
        <ProtectedLayout>
          <AgentHardwareSale />
        </ProtectedLayout>
      )} />
      <Route path="/customer-hardware-sale" component={() => (
        <ProtectedLayout>
          <CustomerHardwareSale />
        </ProtectedLayout>
      )} />
      <Route path="/customer-payment-hw" component={() => (
        <ProtectedLayout>
          <CustomerPaymentHW />
        </ProtectedLayout>
      )} />
      <Route path="/customer-payment-subscription" component={() => (
        <ProtectedLayout>
          <CustomerPaymentSubscription />
        </ProtectedLayout>
      )} />
      <Route path="/customer-registration" component={() => (
        <ProtectedLayout>
          <CustomerRegistration />
        </ProtectedLayout>
      )} />
      <Route path="/payments" component={() => (
        <ProtectedLayout>
          <Payments />
        </ProtectedLayout>
      )} />
      <Route path="/receipt-cancellation" component={() => (
        <ProtectedLayout>
          <ReceiptCancellation />
        </ProtectedLayout>
      )} />
      <Route path="/customer-transfer" component={() => (
        <ProtectedLayout>
          <CustomerTransfer />
        </ProtectedLayout>
      )} />
      <Route path="/subscriptions" component={() => (
        <ProtectedLayout>
          <Subscriptions />
        </ProtectedLayout>
      )} />
      <Route path="/consolidated-subscriptions" component={() => (
        <ProtectedLayout>
          <ConsolidatedSubscriptions />
        </ProtectedLayout>
      )} />
      <Route path="/subscription-purchase" component={() => (
        <ProtectedLayout>
          <SubscriptionPurchase />
        </ProtectedLayout>
      )} />
      <Route path="/subscription-renewal" component={() => (
        <ProtectedLayout>
          <SubscriptionRenewal />
        </ProtectedLayout>
      )} />
      <Route path="/plan-change" component={() => (
        <ProtectedLayout>
          <PlanChange />
        </ProtectedLayout>
      )} />
      <Route path="/offer-change" component={() => (
        <ProtectedLayout>
          <OfferChange />
        </ProtectedLayout>
      )} />
      <Route path="/plan-validity-extension" component={() => (
        <ProtectedLayout>
          <PlanValidityExtension />
        </ProtectedLayout>
      )} />
      <Route path="/add-addon-packs" component={() => (
        <ProtectedLayout>
          <AddAddonPacks />
        </ProtectedLayout>
      )} />
      <Route path="/customer-suspension" component={() => (
        <ProtectedLayout>
          <CustomerSuspension />
        </ProtectedLayout>
      )} />
      <Route path="/customer-disconnection" component={() => (
        <ProtectedLayout>
          <CustomerDisconnection />
        </ProtectedLayout>
      )} />
      <Route path="/termination" component={() => (
        <ProtectedLayout>
          <Termination />
        </ProtectedLayout>
      )} />
      <Route path="/replacement" component={() => (
        <ProtectedLayout>
          <Replacement />
        </ProtectedLayout>
      )} />
      <Route path="/reconnection" component={() => (
        <ProtectedLayout>
          <Reconnection />
        </ProtectedLayout>
      )} />
      <Route path="/search-subscriber" component={() => (
        <ProtectedLayout>
          <SearchSubscriber />
        </ProtectedLayout>
      )} />
      <Route path="/subscriber-view" component={() => (
        <ProtectedLayout>
          <SubscriberView />
        </ProtectedLayout>
      )} />
      <Route path="/reports" component={() => (
        <ProtectedLayout>
          <UnifiedReports />
        </ProtectedLayout>
      )} />
      <Route path="/adjustment" component={() => (
        <ProtectedLayout>
          <Adjustment />
        </ProtectedLayout>
      )} />
      <Route path="/service-ticketing" component={() => (
        <ProtectedLayout>
          <ServiceTicketing />
        </ProtectedLayout>
      )} />
      <Route path="/incident-management" component={() => (
        <ProtectedLayout>
          <IncidentManagement />
        </ProtectedLayout>
      )} />
      <Route path="/new-incident-management" component={() => (
        <ProtectedLayout>
          <IncidentManagement />
        </ProtectedLayout>
      )} />
      <Route path="/bulk-provision" component={() => (
        <ProtectedLayout>
          <BulkProvision />
        </ProtectedLayout>
      )} />
      <Route path="/agent-commission" component={() => (
        <ProtectedLayout>
          <AgentCommission />
        </ProtectedLayout>
      )} />
      <Route path="/provisioning" component={() => (
        <ProtectedLayout>
          <Provisioning />
        </ProtectedLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
