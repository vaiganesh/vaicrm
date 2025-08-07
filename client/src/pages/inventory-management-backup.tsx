import { useState } from "react";
import { 
  Filter,
  BarChart3,
  Download,
  Upload,
  Settings,
  ArrowLeftRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import { inventoryModules, getUniqueCategories, getModuleById } from "@/components/inventory/InventoryModules";
import { QuickStats } from "@/components/inventory/QuickStats";
import { QuickActions } from "@/components/inventory/QuickActions";
import { ModuleCard } from "@/components/inventory/ModuleCard";
import { useInventoryData, useInventoryRequests, useDashboardStats } from "@/hooks/useInventoryData";

// Removed inventoryModules - now imported from refactored component

export default function InventoryManagement() {
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
    icon: Users,
    category: "Agent Operations",
    color: "purple",
    hasData: false,
    priority: "medium"
  },
  
  // Purchase Management
  {
    id: "po-view",
    title: "PO View",
    subtitle: "View purchase orders",
    icon: Eye,
    category: "Purchase Management",
    color: "yellow",
    hasData: true,
    priority: "medium"
  },
  {
    id: "po-grn-update",
    title: "PO GRN Update",
    subtitle: "Update Goods Receipt Notes",
    icon: FileEdit,
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
    icon: RotateCcw,
    category: "Returns & Sales",
    color: "yellow",
    hasData: true,
    priority: "low"
  },
  {
    id: "agent-hardware-sale",
    title: "Agent Hardware Sale",
    subtitle: "Record agent hardware sales",
    icon: ShoppingCart,
    category: "Returns & Sales",
    color: "green",
    hasData: false,
    priority: "low"
  },
  {
    id: "customer-hardware-sale",
    title: "Customer Hardware Sale (OTC)",
    subtitle: "Record customer hardware sales",
    icon: ShoppingCart,
    category: "Returns & Sales",
    color: "green",
    hasData: false,
    priority: "low"
  },
  
  // Repair Management
  {
    id: "agent-faulty-repair",
    title: "Agent Faulty to Repair Change",
    subtitle: "Move faulty items to repair status",
    icon: AlertTriangle,
    category: "Repair Management",
    color: "red",
    hasData: true,
    priority: "medium"
  },
  {
    id: "agent-replacement",
    title: "Agent Replacement",
    subtitle: "Process agent equipment replacement",
    icon: Repeat,
    category: "Repair Management",
    color: "blue",
    hasData: false,
    priority: "medium"
  },
  {
    id: "serial-upload",
    title: "Serial Upload",
    subtitle: "Upload serial numbers for allocation",
    icon: Upload,
    category: "Warehouse Operations",
    color: "blue",
    hasData: true,
    priority: "high"
  }
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUserRole] = useState("admin"); // Can be: agent, finance, admin, warehouse_manager
  const [showAuditFields, setShowAuditFields] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Inventory data queries
  const { data: agents } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/agents"],
  });

  const { data: customers } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const { data: stockRequests } = useQuery<any[]>({
    queryKey: ["/api/stock-requests"],
  });

  const { data: stbDevices } = useQuery<any[]>({
    queryKey: ["/api/stb-devices"],
  });

  // Get dashboard stats
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Get inventory data
  const { data: inventoryData } = useQuery({
    queryKey: ['/api/inventory'],
  });

  // Get inventory requests
  const { data: inventoryRequests } = useQuery({
    queryKey: ['/api/inventory-requests'],
  });

  const categories = Array.from(new Set(inventoryModules.map(m => m.category)));
  const priorities = ["high", "medium", "low"];
  
  // Role-Based Access Control Helper
  const hasAccess = (moduleId: string): boolean => {
    const restrictedModules = {
      "stock-approval": ["admin", "warehouse_manager", "finance"],
      "po-grn-update": ["admin", "warehouse_manager"],
      "po-view": ["admin", "warehouse_manager", "finance"],
      "block-unblock-agent": ["admin"],
      "block-unblock-center": ["admin"],
    };
    
    const allowedRoles = restrictedModules[moduleId as keyof typeof restrictedModules];
    return !allowedRoles || allowedRoles.includes(currentUserRole);
  };

  const filteredModules = inventoryModules.filter(module => {
    // Apply role-based access control
    if (!hasAccess(module.id)) return false;
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || module.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getColorClasses = (color: string, active: boolean = false) => {
    const baseClasses = "transition-all duration-200";
    const colorMap = {
      blue: active ? "bg-[#238fb7] text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100",
      green: active ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100",
      purple: active ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100",
      yellow: active ? "bg-yellow-600 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      red: active ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
    };
    return `${baseClasses} ${colorMap[color as keyof typeof colorMap] || colorMap.blue}`;
  };

  const handleModuleClick = (moduleId: string) => {
    const module = inventoryModules.find(m => m.id === moduleId);
    
    if (module) {
      if (expandedModule === moduleId) {
        setExpandedModule(null); // Collapse if already expanded
      } else {
        setExpandedModule(moduleId); // Expand the module
        setActiveModule(moduleId);
        
        // Auto scroll to the expanded module after a short delay to allow for rendering
        setTimeout(() => {
          const expandedElement = document.getElementById(`module-${moduleId}`);
          if (expandedElement) {
            expandedElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
      
      toast({
        title: expandedModule === moduleId ? `Closing ${module.title}` : `Opening ${module.title}`,
        description: module.subtitle,
      });
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Module content components
  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case 'stock-overview':
        return <StockOverviewContent />;
      case 'stock-request':
        return <StockRequestContent />;
      case 'stock-approval':
        return <StockApprovalContent />;
      case 'stock-transfer':
        return <StockTransferContent />;
      case 'track-serial':
        return <TrackSerialContent />;
      case 'cas-id-change':
        return <CasIdChangeContent />;
      case 'stb-sc-pairing':
        return <StbScPairingContent />;
      case 'warehouse-transfer':
        return <WarehouseTransferContent />;
      case 'block-unblock-agent':
        return <BlockUnblockAgentContent />;
      case 'block-unblock-center':
        return <BlockUnblockCenterContent />;
      case 'agent-subagent-transfer':
        return <AgentSubagentTransferContent />;
      case 'po-view':
        return <POViewContent />;
      case 'po-grn-update':
        return <POGRNUpdateContent />;
      case 'customer-hardware-return':
        return <CustomerHardwareReturnContent />;
      case 'agent-hardware-sale':
        return <AgentHardwareSaleContent />;
      case 'customer-hardware-sale':
        return <CustomerHardwareSaleContent />;
      case 'agent-faulty-repair':
        return <AgentFaultyRepairContent />;
      case 'agent-replacement':
        return <AgentReplacementContent />;
      case 'serial-upload':
        return <SerialNumberUploadContent />;
      default:
        return <DefaultModuleContent moduleId={moduleId} />;
    }
  };

  // Serial Number Upload Component
  const SerialNumberUploadContent = () => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setUploadFile(file);
        // Parse CSV file for serial numbers
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          setSerialNumbers(lines);
        };
        reader.readAsText(file);
      }
    };

    const processUpload = async () => {
      if (!uploadFile || serialNumbers.length === 0) return;
      
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Call the backend API
        const response = await apiRequest("/api/inventory/serial-upload", "POST", {
          serialNumbers,
          materialCode: "STB001",
          location: "WH_DAR",
          uploadedBy: "current_user"
        });

        toast({
          title: "Upload Successful",
          description: `${serialNumbers.length} serial numbers uploaded for warehouse allocation`,
        });

        setUploadFile(null);
        setSerialNumbers([]);
        setUploadProgress(0);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload serial numbers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Serial Number Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload CSV file with serial numbers
                  </span>
                  <Input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {uploadFile && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>File: {uploadFile.name}</span>
                <span>{serialNumbers.length} serial numbers</span>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-azam-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={processUpload}
                  disabled={isUploading}
                  className="bg-azam-blue hover:bg-azam-blue/90"
                >
                  {isUploading ? "Uploading..." : "Process Upload"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUploadFile(null);
                    setSerialNumbers([]);
                    setUploadProgress(0);
                  }}
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const StockOverviewContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" />
          Stock Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(inventoryData as any)?.length || 0}
                  </p>
                </div>
                <Package2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-yellow-600">12</p>
                </div>
                <ArrowLeftRight className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Current Inventory</h4>
            <div className="flex items-center space-x-2">
              <Label htmlFor="audit-toggle-overview" className="text-sm">Show Audit Fields</Label>
              <input
                id="audit-toggle-overview"
                type="checkbox"
                checked={showAuditFields}
                onChange={(e) => setShowAuditFields(e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>INV_CODE</TableHead>
                <TableHead>INV_NAME</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                {showAuditFields && (
                  <>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Modified Date</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(inventoryData as any)?.slice(0, 5).map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{item.materialCode || item.invCode}</TableCell>
                  <TableCell>{item.materialName || item.invName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={item.quantity <= 5 ? "text-red-600 font-medium" : ""}>
                        {item.quantity}
                      </span>
                      {item.serialNumber && (
                        <Badge variant="outline" className="text-xs">
                          SN: {item.serialNumber}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.quantity > 10 ? "default" : "destructive"}
                      className={
                        item.quantity > 10 
                          ? "bg-green-100 text-green-800" 
                          : item.quantity > 5
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {item.quantity > 10 ? "In Stock" : item.quantity > 5 ? "Low Stock" : "Critical"}
                    </Badge>
                  </TableCell>
                  {showAuditFields && (
                    <>
                      <TableCell className="text-xs">{item.createId || "system"}</TableCell>
                      <TableCell className="text-xs">{item.createDt || new Date().toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{item.updateDt || "N/A"}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Legend for audit fields */}
          {showAuditFields && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Audit Information</h5>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>INV_CODE/INV_NAME:</strong> Maps to INVENTORY_DETAILS table structure</p>
                <p><strong>Created By:</strong> User who created this inventory record</p>
                <p><strong>Created/Modified Date:</strong> Timestamps for audit trail</p>
                <p><strong>Serial Numbers:</strong> Displayed when available for individual tracking</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const StockRequestContent = () => {
    const [requestData, setRequestData] = useState({
      materialCode: "",
      materialName: "",
      quantity: 1,
      requestType: "",
      urgency: "normal",
      notes: ""
    });

    const createRequestMutation = useMutation({
      mutationFn: (data: any) => apiRequest("/api/stock-requests", "POST", data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/stock-requests"] });
        toast({
          title: "Success",
          description: "Stock request submitted successfully",
        });
        setRequestData({
          materialCode: "",
          materialName: "",
          quantity: 1,
          requestType: "",
          urgency: "normal",
          notes: ""
        });
      },
    });

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Stock Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="materialCode">Material Code</Label>
              <Input
                id="materialCode"
                value={requestData.materialCode}
                onChange={(e) => setRequestData({...requestData, materialCode: e.target.value})}
                placeholder="Enter material code"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="materialName">Material Name</Label>
              <Input
                id="materialName"
                value={requestData.materialName}
                onChange={(e) => setRequestData({...requestData, materialName: e.target.value})}
                placeholder="Enter material name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={requestData.quantity}
                onChange={(e) => setRequestData({...requestData, quantity: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type</Label>
              <Select onValueChange={(value) => setRequestData({...requestData, requestType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-stock">New Stock</SelectItem>
                  <SelectItem value="restock">Restock</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select onValueChange={(value) => setRequestData({...requestData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={requestData.notes}
                onChange={(e) => setRequestData({...requestData, notes: e.target.value})}
                placeholder="Additional notes or requirements"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => createRequestMutation.mutate(requestData)}
            disabled={createRequestMutation.isPending}
            className="w-full bg-[#238fb7] hover:bg-[#181c4c]"
          >
            {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const StockApprovalContent = () => {
    const [selectedApproval, setSelectedApproval] = useState<any>(null);
    const [approvalNotes, setApprovalNotes] = useState("");
    const [requiresSpecialApproval, setRequiresSpecialApproval] = useState(false);

    const handleApproval = async (request: any, action: "APPROVE" | "REJECT") => {
      try {
        // Check if it's a damaged/repair item requiring special approval
        const isDamagedRepair = request.itemType === "DAMAGED" || request.itemType === "REPAIR";
        
        if (isDamagedRepair && action === "APPROVE" && currentUserRole !== "admin") {
          toast({
            title: "Special Approval Required",
            description: "Damaged/Repair items require admin approval",
            variant: "destructive",
          });
          return;
        }

        const approvalData = {
          requestId: request.requestId,
          action,
          approvedBy: "current_user",
          approvalDate: new Date().toISOString(),
          notes: approvalNotes,
          requiresSpecialApproval: isDamagedRepair,
        };

        // Call the backend approval API
        await apiRequest(`/api/inventory-requests/${request.id}/approve`, "POST", {
          action,
          notes: approvalNotes,
          approvedBy: "current_user",
          userRole: currentUserRole,
        });

        toast({
          title: `Request ${action.toLowerCase()}d`,
          description: `Request ${request.requestId} has been ${action.toLowerCase()}d`,
        });

        setSelectedApproval(null);
        setApprovalNotes("");
        queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process approval",
          variant: "destructive",
        });
      }
    };

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Stock Approval
            {currentUserRole && (
              <Badge variant="outline" className="ml-2 text-xs">
                Role: {currentUserRole}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Toggle for audit fields */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Pending Approvals</h4>
              <div className="flex items-center space-x-2">
                <Label htmlFor="audit-toggle" className="text-sm">Show Audit Fields</Label>
                <input
                  id="audit-toggle"
                  type="checkbox"
                  checked={showAuditFields}
                  onChange={(e) => setShowAuditFields(e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>

            {(inventoryRequests as any)?.filter((req: any) => req.status === 'PENDING').slice(0, 5).map((request: any, index: number) => {
              const isDamagedRepair = request.itemType === "DAMAGED" || request.itemType === "REPAIR";
              const borderColor = isDamagedRepair ? "border-l-red-500" : "border-l-yellow-500";
              
              return (
                <Card key={index} className={`border-l-4 ${borderColor}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{request.requestId}</p>
                            {isDamagedRepair && (
                              <Badge variant="destructive" className="text-xs">
                                Special Approval Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{request.module} - {request.priority}</p>
                          <p className="text-xs text-gray-500">Requested: {request.createDt}</p>
                          
                          {/* Audit Fields - shown conditionally */}
                          {showAuditFields && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                              <div><strong>Created By:</strong> {request.createId}</div>
                              <div><strong>Created Date:</strong> {request.createDt}</div>
                              <div><strong>Last Modified:</strong> {request.updateDt || "N/A"}</div>
                              <div><strong>Request Type:</strong> {request.itemType || "NORMAL"}</div>
                              {isDamagedRepair && (
                                <div className="text-red-600">
                                  <strong>⚠ Requires Admin Approval</strong>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approval Details - {request.requestId}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Request Type</Label>
                                    <p className="text-sm">{request.itemType || "NORMAL"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <p className="text-sm">{request.priority}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="approval-notes">Approval Notes</Label>
                                  <Textarea
                                    id="approval-notes"
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    placeholder="Add notes for this approval..."
                                    className="mt-1"
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    className="text-red-600 border-red-600"
                                    onClick={() => handleApproval(request, "REJECT")}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproval(request, "APPROVE")}
                                    disabled={isDamagedRepair && currentUserRole !== "admin"}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {isDamagedRepair && currentUserRole !== "admin" ? "Admin Required" : "Approve"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {(inventoryRequests as any)?.filter((req: any) => req.status === 'PENDING').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending approvals</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };;

  const TrackSerialContent = () => {
    const [serialNumber, setSerialNumber] = useState("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
      if (!serialNumber.trim()) return;
      
      setIsSearching(true);
      try {
        // Try STB status search first, then center status if needed
        const response = await apiRequest(`/api/stb-status/search?serialNumber=${encodeURIComponent(serialNumber)}`, "GET");
        setSearchResults(response);
      } catch (error) {
        try {
          // Fallback to center STB status search
          const response = await apiRequest(`/api/center-stb-status/search?serialNumber=${encodeURIComponent(serialNumber)}`, "GET");
          setSearchResults(response);
        } catch (fallbackError) {
          toast({
            title: "Search Failed",
            description: "Serial number not found in system",
            variant: "destructive",
          });
          setSearchResults(null);
        }
      } finally {
        setIsSearching(false);
      }
    };

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Serial Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter serial number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !serialNumber.trim()}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            
            {searchResults && (
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Search Results</h4>
                  <div className="space-y-2">
                    <p><strong>Serial Number:</strong> {searchResults.serialNumber || searchResults.serial}</p>
                    <p><strong>Status:</strong> <Badge variant={searchResults.status === "ACTIVE" ? "default" : "secondary"}>{searchResults.status}</Badge></p>
                    <p><strong>Location:</strong> {searchResults.location || searchResults.owner}</p>
                    {searchResults.materialCode && <p><strong>Material Code:</strong> {searchResults.materialCode}</p>}
                    {searchResults.casId && <p><strong>CAS ID:</strong> {searchResults.casId}</p>}
                    {showAuditFields && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs"><strong>Created:</strong> {searchResults.createDt || "N/A"}</p>
                        <p className="text-xs"><strong>Modified:</strong> {searchResults.updateDt || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CasIdChangeContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCcw className="h-5 w-5" />
          CAS ID Change
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current CAS ID</Label>
            <Input placeholder="Enter current CAS ID" />
          </div>
          <div className="space-y-2">
            <Label>New CAS ID</Label>
            <Input placeholder="Enter new CAS ID" />
          </div>
          <div className="space-y-2">
            <Label>Device Serial</Label>
            <Input placeholder="Enter device serial number" />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faulty">Faulty Device</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
              Update CAS ID
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StbScPairingContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          STB - Smart Card Pairing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>STB Serial Number</Label>
            <Input placeholder="Enter STB serial number" />
          </div>
          <div className="space-y-2">
            <Label>Smart Card Number</Label>
            <Input placeholder="Enter smart card number" />
          </div>
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input placeholder="Enter customer ID" />
          </div>
          <div className="space-y-2">
            <Label>Pairing Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select pairing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Pairing</SelectItem>
                <SelectItem value="replace">Replace Pairing</SelectItem>
                <SelectItem value="upgrade">Upgrade Pairing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
              Pair Devices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StockTransferContent = () => {
    const [transferData, setTransferData] = useState({
      fromLocation: "",
      toLocation: "",
      materialCode: "",
      quantity: 1,
      reason: "",
      urgency: "normal"
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const processTransfer = async () => {
      if (!transferData.fromLocation || !transferData.toLocation || !transferData.materialCode) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      try {
        // Submit as warehouse transfer or inventory request
        await apiRequest("/api/warehouse-transfers", "POST", {
          transferFrom: transferData.fromLocation,
          transferTo: transferData.toLocation,
          materialCode: transferData.materialCode,
          quantity: transferData.quantity,
          reason: transferData.reason,
          urgency: transferData.urgency,
          requestedBy: "current_user",
          status: "PENDING",
        });

        toast({
          title: "Transfer Initiated",
          description: "Stock transfer request has been submitted successfully",
        });

        setTransferData({
          fromLocation: "",
          toLocation: "",
          materialCode: "",
          quantity: 1,
          reason: "",
          urgency: "normal"
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/warehouse-transfers"] });
      } catch (error) {
        toast({
          title: "Transfer Failed",
          description: "Failed to process transfer request",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Stock Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>From Location</Label>
              <Select onValueChange={(value) => setTransferData({...transferData, fromLocation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH_DAR">Warehouse - Dar es Salaam</SelectItem>
                  <SelectItem value="WH_MWANZA">Warehouse - Mwanza</SelectItem>
                  <SelectItem value="OTC_ARUSHA">OTC - Arusha</SelectItem>
                  <SelectItem value="AGENT_001">Agent Store 001</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>To Location</Label>
              <Select onValueChange={(value) => setTransferData({...transferData, toLocation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH_DAR">Warehouse - Dar es Salaam</SelectItem>
                  <SelectItem value="WH_MWANZA">Warehouse - Mwanza</SelectItem>
                  <SelectItem value="OTC_ARUSHA">OTC - Arusha</SelectItem>
                  <SelectItem value="AGENT_001">Agent Store 001</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Material Code</Label>
              <Input
                value={transferData.materialCode}
                onChange={(e) => setTransferData({...transferData, materialCode: e.target.value})}
                placeholder="Enter material code (e.g., STB001)"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={transferData.quantity}
                onChange={(e) => setTransferData({...transferData, quantity: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select onValueChange={(value) => setTransferData({...transferData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Transfer Reason</Label>
              <Textarea
                value={transferData.reason}
                onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
                placeholder="Reason for transfer"
              />
            </div>
          </div>
          
          <Button 
            className="w-full bg-[#238fb7] hover:bg-[#181c4c]"
            onClick={processTransfer}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing Transfer..." : "Process Transfer"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const WarehouseTransferContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warehouse className="h-5 w-5" />
          Warehouse Transfer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold">Pending Transfers</h4>
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold">Completed Today</h4>
                  <p className="text-2xl font-bold text-green-600">15</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold">In Transit</h4>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Recent Transfers</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>TRF001</TableCell>
                  <TableCell>Warehouse A</TableCell>
                  <TableCell>Warehouse B</TableCell>
                  <TableCell>STB001 (5)</TableCell>
                  <TableCell><Badge>In Transit</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRF002</TableCell>
                  <TableCell>Warehouse B</TableCell>
                  <TableCell>Agent Store</TableCell>
                  <TableCell>SC001 (10)</TableCell>
                  <TableCell><Badge variant="secondary">Completed</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BlockUnblockAgentContent = () => {
    const [selectedAgent, setSelectedAgent] = useState("");
    const [action, setAction] = useState("");
    const [reason, setReason] = useState("");

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Block/Unblock Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Agent</Label>
                <Select onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent1">John Doe (A001)</SelectItem>
                    <SelectItem value="agent2">Jane Smith (A002)</SelectItem>
                    <SelectItem value="agent3">Mike Johnson (A003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Action</Label>
                <Select onValueChange={setAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block Agent</SelectItem>
                    <SelectItem value="unblock">Unblock Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide reason for this action"
              />
            </div>
            
            <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
              Execute Action
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BlockUnblockCenterContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Block/Unblock Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Center</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center1">Distribution Center A</SelectItem>
                  <SelectItem value="center2">Regional Center B</SelectItem>
                  <SelectItem value="center3">Service Center C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Action</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block Center</SelectItem>
                  <SelectItem value="unblock">Unblock Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Administrative Notes</Label>
            <Textarea placeholder="Administrative reason and notes" />
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Execute Center Action
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AgentSubagentTransferContent = () => {
    const [transferData, setTransferData] = useState({
      fromAgent: "",
      toAgent: "",
      transferType: "",
      items: [],
      notes: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const processTransfer = async () => {
      if (!transferData.fromAgent || !transferData.toAgent || !transferData.transferType) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      try {
        // Submit as inventory request for agent-to-agent transfers
        await apiRequest("/api/inventory-requests", "POST", {
          requestType: "AGENT_TRANSFER",
          module: "AGENT",
          transferFrom: transferData.fromAgent,
          transferTo: transferData.toAgent,
          itemType: transferData.transferType.toUpperCase(),
          notes: transferData.notes,
          createId: "current_user",
          status: "PENDING",
        });

        toast({
          title: "Transfer Initiated",
          description: "Agent transfer request has been submitted for approval",
        });

        setTransferData({
          fromAgent: "",
          toAgent: "",
          transferType: "",
          items: [],
          notes: ""
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
      } catch (error) {
        toast({
          title: "Transfer Failed",
          description: "Failed to process transfer request",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agent/Sub-agent Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Agent</Label>
                <Select onValueChange={(value) => setTransferData({...transferData, fromAgent: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {(agents as any)?.data?.map((agent: any) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.firstName} {agent.lastName} ({agent.agentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>To Agent</Label>
                <Select onValueChange={(value) => setTransferData({...transferData, toAgent: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {(agents as any)?.data?.filter((agent: any) => agent.id.toString() !== transferData.fromAgent)?.map((agent: any) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.firstName} {agent.lastName} ({agent.agentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Transfer Type</Label>
                <Select onValueChange={(value) => setTransferData({...transferData, transferType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory Transfer</SelectItem>
                    <SelectItem value="customer">Customer Transfer</SelectItem>
                    <SelectItem value="territory">Territory Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transfer Notes</Label>
              <Textarea
                value={transferData.notes}
                onChange={(e) => setTransferData({...transferData, notes: e.target.value})}
                placeholder="Add any additional notes for this transfer..."
              />
            </div>
            
            <Button 
              className="w-full bg-[#238fb7] hover:bg-[#181c4c]"
              onClick={processTransfer}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Transfer..." : "Process Transfer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const POViewContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Purchase Order View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Search PO number" className="flex-1" />
            <Button variant="outline">Search</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>PO001</TableCell>
                <TableCell>Tech Vendor Ltd</TableCell>
                <TableCell>2024-01-15</TableCell>
                <TableCell>$15,000</TableCell>
                <TableCell><Badge>Approved</Badge></TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PO002</TableCell>
                <TableCell>Hardware Solutions</TableCell>
                <TableCell>2024-01-10</TableCell>
                <TableCell>$8,500</TableCell>
                <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const POGRNUpdateContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          PO/GRN Update
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PO Number</Label>
              <Input placeholder="Enter PO number" />
            </div>
            
            <div className="space-y-2">
              <Label>GRN Number</Label>
              <Input placeholder="Enter GRN number" />
            </div>
            
            <div className="space-y-2">
              <Label>Received Quantity</Label>
              <Input type="number" placeholder="Quantity received" />
            </div>
            
            <div className="space-y-2">
              <Label>Received Date</Label>
              <Input type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Receipt Notes</Label>
            <Textarea placeholder="Notes about the received items" />
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Update GRN
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CustomerHardwareReturnContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Customer Hardware Return
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer ID</Label>
              <Input placeholder="Enter customer ID" />
            </div>
            
            <div className="space-y-2">
              <Label>Device Serial</Label>
              <Input placeholder="Enter device serial number" />
            </div>
            
            <div className="space-y-2">
              <Label>Return Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faulty">Faulty Device</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="cancellation">Service Cancellation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Input type="date" />
            </div>
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Process Return
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AgentHardwareSaleContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Agent Hardware Sale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agent ID</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">John Doe (A001)</SelectItem>
                  <SelectItem value="agent2">Jane Smith (A002)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Product</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stb">STB Device</SelectItem>
                  <SelectItem value="smartcard">Smart Card</SelectItem>
                  <SelectItem value="remote">Remote Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="Quantity to sell" min="1" />
            </div>
            
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input type="number" placeholder="Price per unit" step="0.01" />
            </div>
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Record Sale
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CustomerHardwareSaleContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Customer Hardware Sale (OTC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="Enter customer name" />
            </div>
            
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input placeholder="Enter contact number" />
            </div>
            
            <div className="space-y-2">
              <Label>Product</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stb">STB Device</SelectItem>
                  <SelectItem value="smartcard">Smart Card</SelectItem>
                  <SelectItem value="bundle">Complete Bundle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Process OTC Sale
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AgentFaultyRepairContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Agent Faulty to Repair
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Device Serial</Label>
              <Input placeholder="Enter device serial number" />
            </div>
            
            <div className="space-y-2">
              <Label>Fault Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select fault type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Hardware Issue</SelectItem>
                  <SelectItem value="software">Software Issue</SelectItem>
                  <SelectItem value="physical">Physical Damage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Agent ID</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">John Doe (A001)</SelectItem>
                  <SelectItem value="agent2">Jane Smith (A002)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Fault Description</Label>
            <Textarea placeholder="Detailed description of the fault" />
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Submit for Repair
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AgentReplacementContent = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Agent Replacement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Agent</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select current agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent1">John Doe (A001)</SelectItem>
                  <SelectItem value="agent2">Jane Smith (A002)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Replacement Agent</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select replacement agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent3">Mike Johnson (A003)</SelectItem>
                  <SelectItem value="agent4">Sarah Wilson (A004)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Replacement Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resignation">Resignation</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="performance">Performance Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Input type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Handover Notes</Label>
            <Textarea placeholder="Notes for the handover process" />
          </div>
          
          <Button className="w-full bg-[#238fb7] hover:bg-[#181c4c]">
            Process Replacement
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const DefaultModuleContent = ({ moduleId }: { moduleId: string }) => {
    const module = inventoryModules.find(m => m.id === moduleId);
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {module?.icon && <module.icon className="h-5 w-5" />}
            {module?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              {module?.icon && <module.icon className="h-12 w-12 mx-auto text-gray-400" />}
            </div>
            <h3 className="font-semibold text-lg mb-2">{module?.title}</h3>
            <p className="text-gray-600 mb-4">{module?.subtitle}</p>
            <Badge className="mb-4">{module?.category}</Badge>
            <p className="text-sm text-gray-500">This module is under development and will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ModuleCard = ({ module }: { module: any }) => {
    const Icon = module.icon;
    const isActive = activeModule === module.id;
    const isExpanded = expandedModule === module.id;
    
    return (
      <div id={`module-${module.id}`}>
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
            isActive ? 'border-[#238fb7] shadow-lg' : 'border-gray-200 hover:border-[#238fb7]/50'
          }`}
          onClick={() => handleModuleClick(module.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${getColorClasses(module.color, isActive)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-end gap-1">
                {module.hasData && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Active Data"></div>
                )}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPriorityBadgeColor(module.priority)}`}
                >
                  {module.priority}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
                {module.title}
              </h3>
              <p className="text-xs text-gray-600 leading-tight">
                {module.subtitle}
              </p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {module.category}
              </span>
              {isExpanded ? (
                <Badge variant="outline" className="text-xs">Expanded</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Click to expand</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {isExpanded && (
          <div className="w-full">
            {renderModuleContent(module.id)}
          </div>
        )}
      </div>
    );
  };

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(inventoryData) ? inventoryData.length : 0}
              </p>
            </div>
            <Package2 className="h-8 w-8 text-[#238fb7]" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(inventoryRequests) ? inventoryRequests.filter((req: any) => req.status === 'PENDING').length : 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dashboardStats as any)?.totalAgents || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuickActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#238fb7]" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => handleModuleClick('stock-request')}
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">New Request</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => handleModuleClick('stock-transfer')}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-xs">Transfer Stock</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => handleModuleClick('track-serial')}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">Track Serial</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-3 flex flex-col items-center gap-2"
            onClick={() => handleModuleClick('stock-approval')}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Approve Requests</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inventory Management Center
          </h1>
          <p className="text-gray-600">
            Comprehensive inventory operations and management dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" className="bg-[#238fb7] hover:bg-[#181c4c]">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedPriority("all");
              setActiveModule(null);
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredModules.length} of {inventoryModules.length} modules
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {selectedPriority !== "all" && ` with ${selectedPriority} priority`}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active Data</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="space-y-4">
            {expandedModule ? (
              // When a module is expanded, show it full width
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className={expandedModule === module.id ? "w-full" : "hidden"}>
                    <ModuleCard module={module} />
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setExpandedModule(null)}
                    className="mb-4"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Show All Modules
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-50">
                    {filteredModules.filter(m => m.id !== expandedModule).map((module) => (
                      <ModuleCard key={module.id} module={module} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Normal grid view when nothing is expanded
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="category">
          <div className="space-y-8">
            {expandedModule ? (
              // When a module is expanded, show it full width
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className={expandedModule === module.id ? "w-full" : "hidden"}>
                    <ModuleCard module={module} />
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setExpandedModule(null)}
                    className="mb-4"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Show All Categories
                  </Button>
                  <div className="space-y-8 opacity-50">
                    {categories.map(category => {
                      const categoryModules = filteredModules.filter(m => m.category === category);
                      if (categoryModules.length === 0) return null;
                      
                      return (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-[#238fb7]" />
                            {category}
                            <Badge variant="secondary" className="ml-2">
                              {categoryModules.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {categoryModules.filter(m => m.id !== expandedModule).map((module) => (
                              <ModuleCard key={module.id} module={module} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Normal category view when nothing is expanded
              <div className="space-y-8">
                {categories.map(category => {
                  const categoryModules = filteredModules.filter(m => m.category === category);
                  if (categoryModules.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#238fb7]" />
                        {category}
                        <Badge variant="secondary" className="ml-2">
                          {categoryModules.length}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categoryModules.map((module) => (
                          <ModuleCard key={module.id} module={module} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Search className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No modules found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedPriority("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}