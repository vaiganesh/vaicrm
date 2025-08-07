import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CreditCard, 
  Package, 
  Calendar, 
  DollarSign, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  Wallet,
  RefreshCw,
  Ban,
  Play,
  Pause,
  Trash2,
  Plus,
  Search,
  Eye,
  Clock,
  ArrowUpDown,
  Gift,
  Loader2,
  PhoneCall,
  MessageSquare,
  Shield,
  Home,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Comprehensive schemas for all subscription operations
const subscriptionPurchaseSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  customerType: z.enum(["prepaid", "postpaid"]),
  planId: z.string().min(1, "Plan selection is required"),
  serviceType: z.enum(["residential", "hotel", "commercial"]).optional(),
  numberOfRooms: z.number().min(1).optional(),
  paymentMethod: z.enum(["wallet", "online", "agent", "otc"]),
  paymentAmount: z.number().min(0),
  autoRenewal: z.boolean(),
});

const renewalSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  renewalCount: z.number().min(1, "Renewal count must be at least 1").max(12, "Maximum 12 months"),
  paymentMethod: z.enum(["wallet", "online", "agent"]),
});

const planChangeSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  newPlanId: z.string().min(1, "Please select a new plan"),
  changeType: z.enum(["immediate", "scheduled"]),
  scheduledDate: z.date().optional(),
});

const offerChangeSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  newOfferId: z.string().min(1, "Please select a new offer"),
  changeType: z.enum(["immediate", "scheduled"]),
  scheduledDate: z.date().optional(),
});

const addOnSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  addOnIds: z.array(z.string()).min(1, "Select at least one add-on"),
  prorationEnabled: z.boolean(),
});

const suspensionSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  suspensionType: z.enum(["temporary", "permanent"]),
  reason: z.string().min(1, "Suspension reason is required"),
  suspensionDate: z.date().optional(),
  notes: z.string().optional(),
});

const serviceActionSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  actionType: z.enum(["disconnect", "reconnect", "terminate"]),
  reason: z.string().min(1, "Reason is required"),
  effectiveDate: z.date().optional(),
  notes: z.string().optional(),
});

const planValidityExtensionSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  extensionDays: z.number().min(1, "Extension days must be positive"),
  extensionDate: z.date(),
  reason: z.string().min(1, "Extension reason is required"),
  approvalRequired: z.boolean(),
});

const replacementSchema = z.object({
  smartCardNumber: z.string().min(1, "Smart card number is required"),
  newSerialNumber: z.string().min(1, "New serial number is required"),
  replacementType: z.enum(["warranty", "upgrade", "damage"]),
  centerId: z.string().min(1, "Service center is required"),
  reason: z.string().min(1, "Replacement reason is required"),
  warrantyDetails: z.string().optional(),
});

// Master data loaded from APIs

export default function ConsolidatedSubscriptions() {
  const [activeOperation, setActiveOperation] = useState("purchase");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const { toast } = useToast();
  // QueryClient is already imported from queryClient in lib/queryClient

  // Fetch master data from APIs
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions/plans"],
  });

  const { data: availableOffers = [], isLoading: offersLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions/offers"],
  });

  const { data: addOnPacks = [], isLoading: addOnsLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions/addons"],
  });

  const { data: serviceCenters = [], isLoading: centersLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions/service-centers"],
  });

  const { data: suspensionReasons = [], isLoading: reasonsLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions/suspension-reasons"],
  });

  // Individual operation forms
  const purchaseForm = useForm({ resolver: zodResolver(subscriptionPurchaseSchema) });
  const renewalForm = useForm({ resolver: zodResolver(renewalSchema) });
  const planChangeForm = useForm({ resolver: zodResolver(planChangeSchema) });
  const offerChangeForm = useForm({ resolver: zodResolver(offerChangeSchema) });
  const addOnForm = useForm({ resolver: zodResolver(addOnSchema) });
  const suspensionForm = useForm({ resolver: zodResolver(suspensionSchema) });
  const serviceActionForm = useForm({ resolver: zodResolver(serviceActionSchema) });
  const validityExtensionForm = useForm({ resolver: zodResolver(planValidityExtensionSchema) });
  const replacementForm = useForm({ resolver: zodResolver(replacementSchema) });

  // Mock customer data with comprehensive details
  const mockCustomerData = {
    customerId: "CUST001",
    smartCardNumber: "SC123456789",
    firstName: "John",
    lastName: "Doe",
    phone: "+255712345678",
    email: "john.doe@example.com",
    currentPlan: {
      id: "AZAM_LITE_1M",
      name: "Azam Lite 1 Month",
      price: 12000,
      startDate: "2025-01-15T10:00:00Z",
      endDate: "2025-02-14T23:59:59Z",
      status: "Active"
    },
    currentOffers: [
      { id: "PROMO001", name: "50% Off First Month", endDate: "2025-02-14T23:59:59Z" }
    ],
    addOns: [
      { id: "SPORT001", name: "Sports Pack", endDate: "2025-02-14T23:59:59Z" }
    ],
    walletBalance: 25000,
    autoRenewalEnabled: true,
    lastPaymentDate: "2025-01-15T10:00:00Z",
    bufferPeriodDays: 2,
    status: "ACTIVE",
    serviceType: "residential",
    accountType: "prepaid"
  };

  // Customer search functionality
  const handleCustomerSearch = async (smartCardNumber: string) => {
    if (!smartCardNumber) return;

    setIsProcessing(true);
    setProcessingStep("Searching customer database...");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (smartCardNumber === "SC123456789") {
        setSelectedCustomer(mockCustomerData);
        setWalletBalance(mockCustomerData.walletBalance);
        toast({
          title: "Customer Found",
          description: `${mockCustomerData.firstName} ${mockCustomerData.lastName} - ${mockCustomerData.currentPlan.name}`,
        });
      } else {
        toast({
          title: "Customer Not Found",
          description: "No customer found with this smart card number",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Wallet balance check and top-up prompt
  const checkWalletBalance = (requiredAmount: number) => {
    if (walletBalance < requiredAmount) {
      setTopUpAmount(requiredAmount - walletBalance);
      setPaymentGatewayOpen(true);
      return false;
    }
    return true;
  };

  // Calculate buffer period eligibility
  const isWithinBufferPeriod = useMemo(() => {
    if (!selectedCustomer) return false;
    const planStartDate = new Date(selectedCustomer.currentPlan.startDate);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference <= selectedCustomer.bufferPeriodDays;
  }, [selectedCustomer]);

  // Process subscription purchase with payment gateway integration
  const processSubscriptionPurchase = async (data: any) => {
    setIsProcessing(true);
    setProcessingStep("Initiating subscription purchase...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/purchase", data);
      const result = await response.json();

      // Process workflow steps
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }

      // Update wallet balance if provided in response
      if (result.walletBalanceAfter !== undefined) {
        setWalletBalance(result.walletBalanceAfter);
      } else {
        setWalletBalance(prev => prev - data.paymentAmount);
      }

      toast({
        title: "Subscription Created Successfully",
        description: `Contract ID: ${result.contractId}, Invoice: ${result.invoiceNumber}`,
      });

      // Invalidate customer data to refresh UI
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Subscription purchase error:", error);
      toast({
        title: "Subscription Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process renewal with count input and balance validation
  const processRenewal = async (data: any) => {
    const plan = subscriptionPlans.find(p => p.id === selectedCustomer?.currentPlan.id);
    const totalAmount = plan ? plan.price * data.renewalCount : 0;

    if (!checkWalletBalance(totalAmount)) return;

    setIsProcessing(true);
    setProcessingStep("Initiating subscription renewal...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/renewal", data);
      const result = await response.json();

      // Process predefined workflow steps
      const steps = [
        "1. Validating renewal eligibility",
        "2. Calculating renewal amount and count",
        "3. Wallet balance verification",
        "4. Processing payment transaction",
        "5. Creating renewal order in SAP SOM",
        "6. Extending subscription validity",
        "7. Updating contract in SAP CC",
        "8. Generating renewal invoice",
        "9. Financial posting to sub-ledger"
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Update wallet balance from response
      if (result.walletBalanceAfter !== undefined) {
        setWalletBalance(result.walletBalanceAfter);
      } else {
        setWalletBalance(prev => prev - totalAmount);
      }
      
      toast({
        title: "Renewal Successful",
        description: `Renewed until ${new Date(result.newExpiryDate).toLocaleDateString()}, Invoice: ${result.invoiceNumber}`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Renewal error:", error);
      toast({
        title: "Renewal Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process plan change with buffer period logic
  const processPlanChange = async (data: any) => {
    const newPlan = subscriptionPlans.find(p => p.id === data.newPlanId);
    if (!newPlan || !selectedCustomer) return;

    const currentPlanAmount = selectedCustomer.currentPlan.price;
    const newPlanAmount = newPlan.price;
    let paymentRequired = 0;

    if (isWithinBufferPeriod && data.changeType === "immediate") {
      // Within buffer - full refund of current plan
      const refundAmount = currentPlanAmount;
      const availableBalance = walletBalance + refundAmount;
      paymentRequired = Math.max(0, newPlanAmount - availableBalance);
    } else {
      // After buffer or scheduled - no refund
      paymentRequired = Math.max(0, newPlanAmount - walletBalance);
    }

    if (paymentRequired > 0 && !checkWalletBalance(newPlanAmount)) return;

    setIsProcessing(true);
    setProcessingStep("Initiating plan change...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/plan-change", {
        ...data,
        currentPlanAmount,
        newPlanAmount,
        isWithinBufferPeriod,
        paymentRequired
      });
      const result = await response.json();

      // Process workflow steps from backend or use default
      const steps = result.workflowSteps?.map((step: any) => `${step.step}. ${step.name}`) || [
        "1. Customer validation and current plan check",
        "2. Buffer period validation",
        "3. Payment calculation and refund processing",
        isWithinBufferPeriod ? "4. Previous invoice cancellation" : "4. Skip invoice cancellation",
        "5. Wallet transaction processing",
        "6. Creating plan change order in SOM",
        "7. NAGRA disconnection of old plan",
        "8. NAGRA activation of new plan",
        "9. Contract update in SAP CC",
        "10. Billing generation in SAP CI",
        "11. Financial posting in SAP FICA"
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 700));
      }

      // Update balance from backend response
      if (result.walletBalanceAfter !== undefined) {
        setWalletBalance(result.walletBalanceAfter);
      } else if (isWithinBufferPeriod) {
        setWalletBalance(prev => prev + currentPlanAmount - newPlanAmount);
      } else {
        setWalletBalance(prev => prev - paymentRequired);
      }

      toast({
        title: "Plan Change Successful",
        description: `Plan changed to ${newPlan.name}. Change ID: ${result.changeId}`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Plan change error:", error);
      toast({
        title: "Plan Change Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process add-on with proration calculation
  const processAddOn = async (data: any) => {
    const selectedAddOns = addOnPacks.filter(addon => data.addOnIds.includes(addon.id));
    let totalAmount = 0;

    if (data.prorationEnabled && selectedCustomer) {
      // Calculate proration based on base plan end date
      const planEndDate = new Date(selectedCustomer.currentPlan.endDate);
      const currentDate = new Date();
      const remainingDays = Math.floor((planEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const prorationFactor = remainingDays / 30; // Assuming 30-day month

      totalAmount = selectedAddOns.reduce((sum, addon) => sum + (addon.price * prorationFactor), 0);
    } else {
      totalAmount = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    }

    if (!checkWalletBalance(totalAmount)) return;

    setIsProcessing(true);
    setProcessingStep("Processing add-on purchase...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/add-ons", data);
      const result = await response.json();

      // Process workflow steps from backend
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }

      // Update wallet balance from response
      if (result.walletBalanceAfter !== undefined) {
        setWalletBalance(result.walletBalanceAfter);
      } else {
        setWalletBalance(prev => prev - totalAmount);
      }
      
      toast({
        title: "Add-ons Added Successfully",
        description: `Order ID: ${result.addOnOrderId}${data.prorationEnabled ? ' with proration' : ''}`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Add-on processing error:", error);
      toast({
        title: "Add-on Processing Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process suspension with reason selection  
  const processSuspension = async (data: any) => {
    const reasonText = suspensionReasons.find(r => r.id === data.reason)?.name || data.reason;

    setIsProcessing(true);
    setProcessingStep("Initiating customer suspension...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/suspension", data);
      const result = await response.json();

      const steps = [
        "1. Customer validation",
        "2. Suspension eligibility check", 
        "3. Reason validation and logging",
        "4. Creating suspension request",
        "5. JSON request to CM (Content Management)",
        "6. NAGRA disconnection",
        "7. Contract status update",
        "8. Customer notification"
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      toast({
        title: "Suspension Processed",
        description: `Customer suspended - ${reasonText}. Request ID: ${result.suspensionId || 'Generated'}`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Suspension error:", error);
      toast({
        title: "Suspension Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process offer change with buffer period logic
  const processOfferChange = async (data: any) => {
    if (!selectedCustomer) return;

    setIsProcessing(true);
    setProcessingStep("Initiating offer change...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/offer-change", {
        ...data,
        isWithinBufferPeriod
      });
      const result = await response.json();

      const steps = [
        "1. Customer validation and current offer check",
        "2. Buffer period validation",
        "3. New offer validation",
        "4. Creating offer change order",
        "5. Updating customer offers",
        "6. Contract modification",
        "7. Customer notification"
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      toast({
        title: "Offer Change Successful",
        description: `Offer changed successfully. Change ID: ${result.changeId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Offer change error:", error);
      toast({
        title: "Offer Change Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process plan validity extension
  const processValidityExtension = async (data: any) => {
    setIsProcessing(true);
    setProcessingStep("Initiating plan validity extension...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/validity-extension", data);
      const result = await response.json();

      // Process workflow steps
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
      }

      toast({
        title: "Validity Extension Processed",
        description: `Extension ${result.status}. ID: ${result.extensionId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Validity extension error:", error);
      toast({
        title: "Validity Extension Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process hardware replacement
  const processHardwareReplacement = async (data: any) => {
    setIsProcessing(true);
    setProcessingStep("Initiating hardware replacement...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/hardware-replacement", data);
      const result = await response.json();

      // Process workflow steps
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }

      toast({
        title: "Hardware Replacement Successful",
        description: `Replacement completed. ID: ${result.replacementId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Hardware replacement error:", error);
      toast({
        title: "Hardware Replacement Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process payment/top-up
  const processPaymentTopup = async (data: any) => {
    setIsProcessing(true);
    setProcessingStep("Processing payment top-up...");

    try {
      const response = await apiRequest("POST", "/api/subscriptions/payment-topup", data);
      const result = await response.json();

      // Process workflow steps
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }

      // Update wallet balance
      if (result.newWalletBalance !== undefined) {
        setWalletBalance(result.newWalletBalance);
      }

      toast({
        title: "Payment Successful",
        description: `Top-up completed. Transaction ID: ${result.transactionId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Payment top-up error:", error);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Process service actions (disconnect, reconnect, terminate)
  const processServiceAction = async (data: any) => {
    setIsProcessing(true);
    setProcessingStep(`Processing ${data.actionType}...`);

    try {
      const response = await apiRequest("POST", "/api/subscriptions/service-action", data);
      const result = await response.json();

      // Process workflow steps
      if (result.workflowSteps) {
        for (const step of result.workflowSteps) {
          setProcessingStep(`${step.step}. ${step.name}`);
          await new Promise(resolve => setTimeout(resolve, 700));
        }
      }

      toast({
        title: `${data.actionType.charAt(0).toUpperCase() + data.actionType.slice(1)} Successful`,
        description: `Action completed. ID: ${result.actionId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      
    } catch (error) {
      console.error("Service action error:", error);
      toast({
        title: "Service Action Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consolidated Subscription Management</h1>
          <p className="text-gray-600">Complete subscription lifecycle management with payment integration</p>
        </div>
        <Badge variant="outline" className="text-azam-blue border-azam-blue">
          Enhanced SAP BRIM Integration
        </Badge>
      </div>

      {/* Customer Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Customer Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="smartCard">Smart Card Number</Label>
              <Input
                id="smartCard"
                placeholder="Enter smart card number"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomerSearch((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => {
                const input = document.getElementById('smartCard') as HTMLInputElement;
                handleCustomerSearch(input.value);
              }}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>

          {selectedCustomer && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.customerId}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Current Plan</h4>
                  <p className="text-sm">{selectedCustomer.currentPlan.name}</p>
                  <Badge variant={selectedCustomer.status === "ACTIVE" ? "default" : "destructive"}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Wallet Balance</h4>
                  <p className="text-lg font-bold text-green-600">TSH {walletBalance.toLocaleString()}</p>
                  {isWithinBufferPeriod && (
                    <Badge variant="outline" className="text-xs">Within Buffer Period</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-azam-blue" />
                <span className="font-medium">Processing Operation...</span>
              </div>
              <p className="text-sm text-gray-600">{processingStep}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-azam-blue h-2 rounded-full transition-all duration-300 w-1/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Gateway Modal */}
      <Dialog open={paymentGatewayOpen} onOpenChange={setPaymentGatewayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Wallet Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your wallet balance is insufficient. Please top up to continue.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Balance</Label>
                <p className="text-lg font-bold">TSH {walletBalance.toLocaleString()}</p>
              </div>
              <div>
                <Label>Required Top-up</Label>
                <p className="text-lg font-bold text-red-600">TSH {topUpAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (selectedCustomer && topUpAmount > 0) {
                    processPaymentTopup({
                      smartCardNumber: selectedCustomer.smartCardNumber,
                      topupAmount: topUpAmount,
                      paymentMethod: "online",
                      notes: "Customer wallet top-up"
                    });
                    setPaymentGatewayOpen(false);
                  } else {
                    toast({
                      title: "Invalid Top-up",
                      description: "Please enter a valid amount",
                      variant: "destructive"
                    });
                  }
                }}
                className="flex-1"
              >
                Top Up Now
              </Button>
              <Button variant="outline" onClick={() => setPaymentGatewayOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Operations */}
      <Tabs value={activeOperation} onValueChange={setActiveOperation} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="renewal">Renewal</TabsTrigger>
          <TabsTrigger value="plan-change">Plan Change</TabsTrigger>
          <TabsTrigger value="offer-change">Offer Change</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Subscription Purchase Tab */}
        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Subscription Purchase</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...purchaseForm}>
                <form onSubmit={purchaseForm.handleSubmit(processSubscriptionPurchase)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={purchaseForm.control}
                      name="customerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="prepaid">Prepaid</SelectItem>
                              <SelectItem value="postpaid">Postpaid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {purchaseForm.watch("customerType") === "postpaid" && (
                      <>
                        <FormField
                          control={purchaseForm.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select service type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="residential">Residential</SelectItem>
                                  <SelectItem value="hotel">Hotel</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={purchaseForm.control}
                          name="numberOfRooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Rooms</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={purchaseForm.control}
                      name="planId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Plan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subscription plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subscriptionPlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} - TSH {plan.price.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={purchaseForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wallet">Wallet Balance</SelectItem>
                              <SelectItem value="online">Online Payment</SelectItem>
                              <SelectItem value="agent">Agent Payment</SelectItem>
                              <SelectItem value="otc">Over The Counter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={purchaseForm.control}
                      name="autoRenewal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Enable Auto-Renewal</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={!selectedCustomer || isProcessing}>
                    {isProcessing ? "Processing..." : "Create Subscription"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Renewal Tab with Count Input */}
        <TabsContent value="renewal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Renewal</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...renewalForm}>
                <form onSubmit={renewalForm.handleSubmit(processRenewal)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={renewalForm.control}
                      name="renewalCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Renewal Count (Months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="12"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={renewalForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="wallet">Wallet Balance</SelectItem>
                              <SelectItem value="online">Online Payment</SelectItem>
                              <SelectItem value="agent">Agent Payment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedCustomer && renewalForm.watch("renewalCount") && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Renewal Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>Current Plan: {selectedCustomer.currentPlan.name}</p>
                          <p>Price per Month: TSH {selectedCustomer.currentPlan.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p>Renewal Count: {renewalForm.watch("renewalCount")} month(s)</p>
                          <p className="font-bold">Total Amount: TSH {(selectedCustomer.currentPlan.price * (renewalForm.watch("renewalCount") || 1)).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={!selectedCustomer || isProcessing}>
                    {isProcessing ? "Processing..." : "Process Renewal"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Change Tab with Buffer Logic */}
        <TabsContent value="plan-change" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Change</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...planChangeForm}>
                <form onSubmit={planChangeForm.handleSubmit(processPlanChange)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={planChangeForm.control}
                      name="newPlanId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Plan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select new plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subscriptionPlans
                                .filter(plan => plan.id !== selectedCustomer?.currentPlan.id)
                                .map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} - TSH {plan.price.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={planChangeForm.control}
                      name="changeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Change Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select change type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate Change</SelectItem>
                              <SelectItem value="scheduled">Scheduled Change</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {planChangeForm.watch("changeType") === "scheduled" && (
                    <FormField
                      control={planChangeForm.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheduled Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedCustomer && planChangeForm.watch("newPlanId") && (
                    <div className={`p-4 rounded-lg ${isWithinBufferPeriod ? 'bg-green-50' : 'bg-yellow-50'}`}>
                      <h4 className="font-semibold mb-2">Plan Change Summary</h4>
                      <div className="space-y-2 text-sm">
                        {isWithinBufferPeriod && planChangeForm.watch("changeType") === "immediate" && (
                          <Alert className="mb-2">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Within buffer period - full refund available for current plan
                            </AlertDescription>
                          </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>Current Plan: {selectedCustomer.currentPlan.name}</p>
                            <p>Current Price: TSH {selectedCustomer.currentPlan.price.toLocaleString()}</p>
                            {isWithinBufferPeriod && <p className="text-green-600">Refund: TSH {selectedCustomer.currentPlan.price.toLocaleString()}</p>}
                          </div>
                          <div>
                            <p>New Plan: {subscriptionPlans.find(p => p.id === planChangeForm.watch("newPlanId"))?.name}</p>
                            <p>New Price: TSH {subscriptionPlans.find(p => p.id === planChangeForm.watch("newPlanId"))?.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={!selectedCustomer || isProcessing}>
                    {isProcessing ? "Processing..." : "Process Plan Change"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offer Change Tab */}
        <TabsContent value="offer-change" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offer Change</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...offerChangeForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={offerChangeForm.control}
                      name="newOfferId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Offers</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select offer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableOffers.map((offer) => (
                                <SelectItem key={offer.id} value={offer.id}>
                                  {offer.name} - {offer.validity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={offerChangeForm.control}
                      name="changeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Change Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select change type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate Change</SelectItem>
                              <SelectItem value="scheduled">Scheduled Change</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="button" 
                    disabled={!selectedCustomer || isProcessing}
                    onClick={() => {
                      const formData = offerChangeForm.getValues();
                      if (formData.newOfferId && formData.changeType) {
                        processOfferChange({
                          smartCardNumber: selectedCustomer?.smartCardNumber,
                          newOfferId: formData.newOfferId,
                          changeType: formData.changeType,
                          scheduledDate: formData.changeType === "scheduled" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
                        });
                      }
                    }}
                  >
                    {isProcessing ? "Processing..." : "Apply Offer Change"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add-ons Tab with Proration */}
        <TabsContent value="addons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add-on Packs</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...addOnForm}>
                <form onSubmit={addOnForm.handleSubmit(processAddOn)} className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={addOnForm.control}
                      name="addOnIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Add-ons</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addOnPacks.map((addon) => (
                              <div key={addon.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                <input
                                  type="checkbox"
                                  id={addon.id}
                                  checked={field.value?.includes(addon.id) || false}
                                  onChange={(e) => {
                                    const currentValue = field.value || [];
                                    if (e.target.checked) {
                                      field.onChange([...currentValue, addon.id]);
                                    } else {
                                      field.onChange(currentValue.filter((id: string) => id !== addon.id));
                                    }
                                  }}
                                />
                                <label htmlFor={addon.id} className="flex-1 cursor-pointer">
                                  <div>
                                    <p className="font-medium">{addon.name}</p>
                                    <p className="text-sm text-gray-600">{addon.channels} channels - TSH {addon.price.toLocaleString()}</p>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addOnForm.control}
                      name="prorationEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Enable Proration (based on current plan end date)</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={!selectedCustomer || isProcessing}>
                    {isProcessing ? "Processing..." : "Add Selected Packs"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab - Suspension, Disconnection, etc. */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suspension */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pause className="h-5 w-5" />
                  Customer Suspension
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...suspensionForm}>
                  <form onSubmit={suspensionForm.handleSubmit(processSuspension)} className="space-y-4">
                    <FormField
                      control={suspensionForm.control}
                      name="suspensionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suspension Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="temporary">Temporary</SelectItem>
                              <SelectItem value="permanent">Permanent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={suspensionForm.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suspension Reason</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suspensionReasons.map((reason) => (
                                <SelectItem key={reason.id} value={reason.id}>
                                  {reason.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={suspensionForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Optional notes..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={!selectedCustomer || isProcessing} className="w-full">
                      Process Suspension
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Service Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Service Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...serviceActionForm}>
                  <form className="space-y-4">
                    <FormField
                      control={serviceActionForm.control}
                      name="actionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="disconnect">Disconnection</SelectItem>
                              <SelectItem value="reconnect" disabled={selectedCustomer?.status !== "SUSPENDED"}>
                                Reconnection {selectedCustomer?.status !== "SUSPENDED" && "(Only for suspended customers)"}
                              </SelectItem>
                              <SelectItem value="terminate">Termination</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceActionForm.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Reason for action..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="button" 
                      disabled={!selectedCustomer || isProcessing} 
                      className="w-full"
                      onClick={() => {
                        const formData = serviceActionForm.getValues();
                        if (formData.actionType && formData.reason) {
                          processServiceAction({
                            smartCardNumber: selectedCustomer?.smartCardNumber,
                            actionType: formData.actionType,
                            reason: formData.reason,
                            notes: formData.notes
                          });
                        }
                      }}
                    >
                      Process Action
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Plan Validity Extension */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Plan Validity Extension
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...validityExtensionForm}>
                  <form className="space-y-4">
                    <FormField
                      control={validityExtensionForm.control}
                      name="extensionDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extension Days</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={validityExtensionForm.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extension Reason</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Reason for extension..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={validityExtensionForm.control}
                      name="approvalRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Requires Manager Approval</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="button" 
                      disabled={!selectedCustomer || isProcessing} 
                      className="w-full"
                      onClick={() => {
                        const formData = validityExtensionForm.getValues();
                        if (formData.extensionDays && formData.reason) {
                          const extensionDate = new Date();
                          extensionDate.setDate(extensionDate.getDate() + formData.extensionDays);
                          processValidityExtension({
                            smartCardNumber: selectedCustomer?.smartCardNumber,
                            extensionDays: formData.extensionDays,
                            extensionDate: extensionDate.toISOString(),
                            reason: formData.reason,
                            approvalRequired: formData.approvalRequired
                          });
                        }
                      }}
                    >
                      Request Extension
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Hardware Replacement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Hardware Replacement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...replacementForm}>
                  <form className="space-y-4">
                    <FormField
                      control={replacementForm.control}
                      name="replacementType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Replacement Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="warranty">Warranty Replacement</SelectItem>
                              <SelectItem value="upgrade">Hardware Upgrade</SelectItem>
                              <SelectItem value="damage">Damage Replacement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={replacementForm.control}
                      name="centerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Center</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select center" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceCenters.map((center) => (
                                <SelectItem key={center.id} value={center.id}>
                                  {center.name} ({center.stock} units available)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={replacementForm.control}
                      name="newSerialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Device Serial</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter new device serial number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="button" 
                      disabled={!selectedCustomer || isProcessing} 
                      className="w-full"
                      onClick={() => {
                        const formData = replacementForm.getValues();
                        if (formData.replacementType && formData.centerId && formData.newSerialNumber) {
                          processHardwareReplacement({
                            smartCardNumber: selectedCustomer?.smartCardNumber,
                            newSerialNumber: formData.newSerialNumber,
                            replacementType: formData.replacementType,
                            centerId: formData.centerId,
                            reason: formData.reason || "Hardware replacement requested",
                            warrantyDetails: formData.replacementType === "warranty" ? "Under warranty period" : "Out of warranty"
                          });
                        }
                      }}
                    >
                      Process Replacement
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}