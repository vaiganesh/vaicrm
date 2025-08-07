import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Package, ArrowUpDown, Barcode, Link2, HardDrive, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/lib/i18n";

export default function Inventory() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [serialSearchTerm, setSerialSearchTerm] = useState("");
  const [casIdUpdate, setCasIdUpdate] = useState({ serialNo: "", casId: "" });
  const [stbSmartCardPair, setStbSmartCardPair] = useState({ stbSerial: "", smartCardNo: "" });
  const [stockRequest, setStockRequest] = useState({
    module: "OTC",
    requestType: "STOCK_REQUEST",
    itemType: "",
    itemQty: "1",
    transferTo: "",
    reason: ""
  });
  const [transferRequest, setTransferRequest] = useState({
    materialType: "",
    serialNumbers: [],
    transferTo: "",
    reason: ""
  });

  const { toast } = useToast();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: inventoryRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/inventory-requests"],
  });

  // Mock data for comprehensive inventory system
  const stockOverview = {
    warehouse: { total: 2500, fresh: 2100, used: 300, faulty: 100 },
    otc: { total: 850, fresh: 720, used: 100, faulty: 30 },
    agent: { total: 1200, fresh: 980, used: 180, faulty: 40 },
    repair: { total: 170, fresh: 0, used: 120, faulty: 50 }
  };

  const materialTypes = [
    { code: "STB001", name: "HD Set-Top Box", type: "STB" },
    { code: "STB002", name: "4K Set-Top Box", type: "STB" },
    { code: "SC001", name: "Smart Card Basic", type: "SMART_CARD" },
    { code: "SC002", name: "Smart Card Premium", type: "SMART_CARD" },
    { code: "CBL001", name: "HDMI Cable", type: "CABLE" },
    { code: "RMT001", name: "Remote Control", type: "REMOTE" }
  ];

  const locations = [
    { id: "WH_DAR", name: "Warehouse - Dar es Salaam" },
    { id: "OTC_MWANZA", name: "OTC - Mwanza" },
    { id: "OTC_ARUSHA", name: "OTC - Arusha" },
    { id: "REPAIR_CTR", name: "Repair Center" },
    { id: "AGENT_001", name: "Agent - John Mwamba" },
    { id: "AGENT_002", name: "Agent - Mary Kimaro" }
  ];

  const filteredInventory = inventory?.filter((item: any) => {
    if (selectedLocation !== "all" && item.owner !== selectedLocation) return false;
    return true;
  }) || [];

  // Mutation for stock requests
  const stockRequestMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("/api/inventory-requests", "POST", data),
    onSuccess: () => {
      toast({ title: "Stock request submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
    },
    onError: () => {
      toast({ title: "Failed to submit stock request", variant: "destructive" });
    }
  });

  // Mutation for CAS ID updates
  const casIdUpdateMutation = useMutation({
    mutationFn: async (data: any) => apiRequest(`/api/inventory/${data.serialNo}/cas-id`, "PATCH", data),
    onSuccess: () => {
      toast({ title: "CAS ID updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: () => {
      toast({ title: "Failed to update CAS ID", variant: "destructive" });
    }
  });

  // Mutation for STB-Smart Card pairing
  const pairingMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("/api/inventory/pairing", "POST", data),
    onSuccess: () => {
      toast({ title: "STB and Smart Card paired successfully" });
    },
    onError: () => {
      toast({ title: "Failed to pair devices", variant: "destructive" });
    }
  });

  const handleStockRequest = () => {
    if (!stockRequest.itemType || !stockRequest.transferTo) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    stockRequestMutation.mutate({
      ...stockRequest,
      requestId: `REQ${Date.now()}`,
      createId: "current_user_id"
    });
  };

  const handleCasIdUpdate = () => {
    if (!casIdUpdate.serialNo || !casIdUpdate.casId) {
      toast({ title: "Please provide both Serial Number and CAS ID", variant: "destructive" });
      return;
    }
    casIdUpdateMutation.mutate(casIdUpdate);
  };

  const handleDevicePairing = () => {
    if (!stbSmartCardPair.stbSerial || !stbSmartCardPair.smartCardNo) {
      toast({ title: "Please provide both STB Serial and Smart Card Number", variant: "destructive" });
      return;
    }
    pairingMutation.mutate(stbSmartCardPair);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">SAP MM Inventory Management</h1>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Comprehensive inventory control with SAP integration</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs md:text-sm">
              <HardDrive className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="hidden sm:inline">Connected to </span>SAP MM
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200 overflow-x-auto">
            <TabsList className="px-2 md:px-6 h-auto p-0 bg-transparent min-w-max flex">
              <TabsTrigger 
                value="overview" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Stock </span>Overview
              </TabsTrigger>
              <TabsTrigger 
                value="request" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Stock </span>Request
              </TabsTrigger>
              <TabsTrigger 
                value="transfer" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Stock </span>Transfer
              </TabsTrigger>
              <TabsTrigger 
                value="tracking" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <Barcode className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Serial </span>Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="provisioning" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                CAS ID
              </TabsTrigger>
              <TabsTrigger 
                value="pairing" 
                className="border-b-2 border-transparent data-[state=active]:border-azam-blue data-[state=active]:text-azam-blue py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap"
              >
                <Link2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">STB </span>Pairing
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-3 md:p-6">
            {/* Stock Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(stockOverview).map(([location, stats]) => (
                  <Card key={location} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-700 capitalize">
                        {location} Center
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-2xl font-bold text-gray-900 mb-2">{stats.total}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-600">Fresh:</span>
                          <span className="font-medium">{stats.fresh}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-600">Used:</span>
                          <span className="font-medium">{stats.used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Faulty:</span>
                          <span className="font-medium">{stats.faulty}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by serial number..." 
                    className="pl-9"
                    value={serialSearchTerm}
                    onChange={(e) => setSerialSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Stock Overview Table/Cards */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-900">Inventory Items</h3>
                </div>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInventory.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.materialCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.serialNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.condition === 'New' ? 'success' : item.condition === 'Used' ? 'warning' : 'destructive'}>
                              {item.condition}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={item.status === 'available' ? 'success' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.owner}</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredInventory.map((item: any) => (
                    <Card key={item.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.materialCode}</p>
                            <p className="text-xs text-gray-600 mt-1">{item.serialNumber}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={item.condition === 'New' ? 'success' : item.condition === 'Used' ? 'warning' : 'destructive'} className="text-xs">
                              {item.condition}
                            </Badge>
                            <Badge variant={item.status === 'available' ? 'success' : 'secondary'} className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-1 text-gray-900">{item.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Owner:</span>
                            <span className="ml-1 text-gray-900">{item.owner}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm" className="text-xs px-3 py-1">View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Stock Request Tab */}
            <TabsContent value="request" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">OTC Stock Request Process</h3>
                  <p className="text-xs md:text-sm text-blue-800">
                    Submit requests for stock transfer from warehouse to OTC centers. Requests are processed through SAP MM via CM workflow.
                  </p>
                </div>

                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Create Stock Request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="module" className="text-sm font-medium">Request Module</Label>
                        <Select value={stockRequest.module} onValueChange={(value) => setStockRequest(prev => ({ ...prev, module: value }))}>
                          <SelectTrigger className="h-9 md:h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OTC">OTC Center</SelectItem>
                            <SelectItem value="AGENT">Agent</SelectItem>
                            <SelectItem value="REPAIR">Repair Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="itemType" className="text-sm font-medium">Material Type</Label>
                        <Select value={stockRequest.itemType} onValueChange={(value) => setStockRequest(prev => ({ ...prev, itemType: value }))}>
                          <SelectTrigger className="h-9 md:h-10">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialTypes.map((material) => (
                              <SelectItem key={material.code} value={material.code}>
                                {material.name} ({material.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          className="h-9 md:h-10"
                          value={stockRequest.itemQty}
                          onChange={(e) => setStockRequest(prev => ({ ...prev, itemQty: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="transferTo" className="text-sm font-medium">Transfer To</Label>
                        <Select value={stockRequest.transferTo} onValueChange={(value) => setStockRequest(prev => ({ ...prev, transferTo: value }))}>
                          <SelectTrigger className="h-9 md:h-10">
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium">Request Reason</Label>
                      <Input
                        id="reason"
                        className="h-9 md:h-10"
                        placeholder="Enter reason for stock request"
                        value={stockRequest.reason}
                        onChange={(e) => setStockRequest(prev => ({ ...prev, reason: e.target.value }))}
                      />
                    </div>

                    <Button 
                      onClick={handleStockRequest} 
                      disabled={stockRequestMutation.isPending}
                      className="w-full h-9 md:h-10 text-sm md:text-base"
                    >
                      {stockRequestMutation.isPending ? "Submitting..." : "Submit Request to SAP MM"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stock Transfer Tab */}
            <TabsContent value="transfer" className="mt-0">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">Stock Transfer Workflow</h3>
                <p className="text-sm text-amber-800">
                  Transfer stock between centers, OTC, repair facilities, or mark as damaged. All transfers require approval and SAP integration.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Initiate Transfer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Transfer Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transfer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse_otc">Warehouse to OTC</SelectItem>
                          <SelectItem value="warehouse_warehouse">Warehouse to Warehouse</SelectItem>
                          <SelectItem value="warehouse_damaged">Warehouse to Damaged</SelectItem>
                          <SelectItem value="otc_damaged">OTC to Damaged</SelectItem>
                          <SelectItem value="damaged_repaired">Damaged to Repaired</SelectItem>
                          <SelectItem value="warehouse_replacement">Warehouse to Replacement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Serial Numbers</Label>
                      <Input placeholder="Enter serial numbers (comma separated)" />
                    </div>

                    <div>
                      <Label>Destination</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">Submit Transfer Request</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Transfer Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">Transfer #{i}001</p>
                              <p className="text-xs text-gray-600">5 STB units to OTC Mwanza</p>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Approve</Button>
                            <Button size="sm" variant="destructive">Reject</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Serial Tracking Tab */}
            <TabsContent value="tracking" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h3 className="font-semibold text-green-900 mb-2 text-sm md:text-base">Serial Number Tracking</h3>
                  <p className="text-xs md:text-sm text-green-800">
                    Track material movement history and transaction records across the entire supply chain.
                  </p>
                </div>

                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Search Serial Number</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex-1">
                        <Input 
                          placeholder="Enter serial number to track"
                          className="h-9 md:h-10"
                          value={serialSearchTerm}
                          onChange={(e) => setSerialSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button className="h-9 md:h-10 px-4 md:px-6">
                        <Search className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Track
                      </Button>
                    </div>

                    {serialSearchTerm && (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-3 md:p-4">
                          <h4 className="font-medium mb-3 text-sm md:text-base">Item Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 text-xs md:text-sm">Serial Number</p>
                              <p className="font-medium text-sm md:text-base">{serialSearchTerm}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs md:text-sm">Material Code</p>
                              <p className="font-medium text-sm md:text-base">STB001</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs md:text-sm">Current State</p>
                              <Badge variant="success" className="text-xs">FRESH</Badge>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs md:text-sm">Current Owner</p>
                              <p className="font-medium text-sm md:text-base">OTC Mwanza</p>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-3 md:p-4">
                          <h4 className="font-medium mb-3 text-sm md:text-base">Movement History</h4>
                          <div className="space-y-2 md:space-y-3">
                            {[
                              { date: "2024-01-15", action: "Received at Warehouse", location: "WH_DAR", user: "warehouse_user" },
                              { date: "2024-01-20", action: "Transferred to OTC", location: "OTC_MWANZA", user: "otc_manager" },
                              { date: "2024-01-25", action: "Assigned to Agent", location: "AGENT_001", user: "john_mwamba" }
                            ].map((entry, i) => (
                              <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm border-b border-gray-100 pb-2">
                                <div className="text-gray-600 text-xs md:text-sm md:w-24">{entry.date}</div>
                                <div className="flex-1 font-medium">{entry.action}</div>
                                <div className="text-gray-600 text-xs md:text-sm">{entry.location}</div>
                                <div className="text-gray-600 text-xs md:text-sm">{entry.user}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CAS ID Update Tab */}
            <TabsContent value="provisioning" className="mt-0">
              <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-2 text-sm md:text-base">CAS ID Provisioning Update</h3>
                  <p className="text-xs md:text-sm text-yellow-800">
                    Update CAS ID for STB devices after motherboard repairs. This updates the Nagra CAS system integration.
                  </p>
                </div>

                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Update STB CAS ID</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div>
                      <Label htmlFor="stbSerial" className="text-sm font-medium">STB Serial Number</Label>
                      <Input
                        id="stbSerial"
                        className="h-9 md:h-10"
                        placeholder="Enter STB serial number"
                        value={casIdUpdate.serialNo}
                        onChange={(e) => setCasIdUpdate(prev => ({ ...prev, serialNo: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="newCasId" className="text-sm font-medium">New CAS ID</Label>
                      <Input
                        id="newCasId"
                        className="h-9 md:h-10"
                        placeholder="Enter new CAS ID"
                        value={casIdUpdate.casId}
                        onChange={(e) => setCasIdUpdate(prev => ({ ...prev, casId: e.target.value }))}
                      />
                      <p className="text-xs text-gray-600 mt-1">CAS ID from the new motherboard after repair</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Update Process</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>1. Verify STB serial number in inventory</li>
                        <li>2. Update CAS ID in portal database</li>
                        <li>3. Sync with Nagra CAS system</li>
                        <li>4. Update SAP MM inventory record</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handleCasIdUpdate} 
                      disabled={casIdUpdateMutation.isPending}
                      className="w-full h-9 md:h-10 text-sm md:text-base"
                    >
                      {casIdUpdateMutation.isPending ? "Updating..." : "Update CAS ID"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* STB Pairing Tab */}
            <TabsContent value="pairing" className="mt-0">
              <div className="max-w-2xl mx-auto">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h3 className="font-semibold text-purple-900 mb-2 text-sm md:text-base">STB - Smart Card Pairing</h3>
                  <p className="text-xs md:text-sm text-purple-800">
                    Pair STB devices with Smart Cards. Active customer boxes will trigger pairing commands to Nagra system.
                  </p>
                </div>

                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-lg md:text-xl">Device Pairing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div>
                      <Label htmlFor="stbSerial" className="text-sm font-medium">STB Serial Number</Label>
                      <Input
                        id="stbSerial"
                        className="h-9 md:h-10"
                        placeholder="Enter STB serial number"
                        value={stbSmartCardPair.stbSerial}
                        onChange={(e) => setStbSmartCardPair(prev => ({ ...prev, stbSerial: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smartCardNo" className="text-sm font-medium">Smart Card Number</Label>
                      <Input
                        id="smartCardNo"
                        className="h-9 md:h-10"
                        placeholder="Enter smart card number"
                        value={stbSmartCardPair.smartCardNo}
                        onChange={(e) => setStbSmartCardPair(prev => ({ ...prev, smartCardNo: e.target.value }))}
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Pairing Validation</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• STB serial number validation</li>
                        <li>• Smart card number format check</li>
                        <li>• Customer activation status verification</li>
                        <li>• Nagra system compatibility check</li>
                      </ul>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full h-9 md:h-10 text-sm md:text-base">Pair Devices</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Device Pairing</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will pair STB {stbSmartCardPair.stbSerial} with Smart Card {stbSmartCardPair.smartCardNo}. 
                            If the STB is active with a customer, pairing commands will be sent to Nagra system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDevicePairing}>
                            Confirm Pairing
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
