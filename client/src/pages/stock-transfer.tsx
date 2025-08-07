import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, ArrowRight, Package, Building, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function StockTransfer() {
  const [transferRequest, setTransferRequest] = useState({
    materialType: "",
    serialNumbers: [] as string[],
    transferFrom: "",
    transferTo: "",
    reason: "",
    requestType: "TRANSFER",
    deviceCondition: "GOOD",
    conditionRemarks: ""
  });
  
  const [serialInput, setSerialInput] = useState("");

  const { toast } = useToast();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: inventoryRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/inventory-requests"],
  });

  const materialTypes = [
    { code: "STB001", name: "HD Set-Top Box", type: "STB" },
    { code: "STB002", name: "4K Set-Top Box", type: "STB" },
    { code: "SC001", name: "Smart Card Basic", type: "SMART_CARD" },
    { code: "SC002", name: "Smart Card Premium", type: "SMART_CARD" },
    { code: "CBL001", name: "HDMI Cable", type: "CABLE" },
    { code: "RMT001", name: "Remote Control", type: "REMOTE" }
  ];

  const locations = [
    { id: "WH_DAR", name: "Warehouse - Dar es Salaam", type: "warehouse" },
    { id: "OTC_MWANZA", name: "OTC - Mwanza", type: "otc" },
    { id: "OTC_ARUSHA", name: "OTC - Arusha", type: "otc" },
    { id: "REPAIR_CTR", name: "Repair Center", type: "repair" },
    { id: "AGENT_001", name: "Agent - John Mwamba", type: "agent" },
    { id: "AGENT_002", name: "Agent - Mary Kimaro", type: "agent" }
  ];

  // Filter transfers from inventory requests
  const transferRequests = (inventoryRequests as any)?.data?.filter((req: any) => 
    req.requestType === "TRANSFER" || req.transferFrom
  ) || [];

  // Mutation for transfer requests
  const transferMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/inventory-requests", data),
    onSuccess: () => {
      toast({ title: "Transfer request submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
      setTransferRequest({
        materialType: "",
        serialNumbers: [] as string[],
        transferFrom: "",
        transferTo: "",
        reason: "",
        requestType: "TRANSFER",
        deviceCondition: "GOOD",
        conditionRemarks: ""
      });
      setSerialInput("");
    },
    onError: () => {
      toast({ title: "Failed to submit transfer request", variant: "destructive" });
    }
  });

  const handleAddSerial = () => {
    if (serialInput.trim() && !transferRequest.serialNumbers.includes(serialInput.trim())) {
      setTransferRequest({
        ...transferRequest,
        serialNumbers: [...transferRequest.serialNumbers, serialInput.trim()]
      });
      setSerialInput("");
    }
  };

  const handleRemoveSerial = (serial: string) => {
    setTransferRequest({
      ...transferRequest,
      serialNumbers: transferRequest.serialNumbers.filter(s => s !== serial)
    });
  };

  const handleTransferSubmit = () => {
    if (!transferRequest.materialType || !transferRequest.transferFrom || !transferRequest.transferTo) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    if (transferRequest.serialNumbers.length === 0) {
      toast({ title: "Please add at least one serial number", variant: "destructive" });
      return;
    }

    // Check for condition remarks if item is damaged or needs repair
    if ((transferRequest.deviceCondition === 'DAMAGED' || transferRequest.deviceCondition === 'REPAIR') && 
        !transferRequest.conditionRemarks.trim()) {
      toast({ title: "Condition remarks are required for damaged/repair items", variant: "destructive" });
      return;
    }

    // Set special approval status for damaged/repair items
    const status = (transferRequest.deviceCondition === 'DAMAGED' || transferRequest.deviceCondition === 'REPAIR') 
      ? "PENDING_SPECIAL_APPROVAL" 
      : "PENDING";

    transferMutation.mutate({
      ...transferRequest,
      requestId: `TRF${Date.now()}`,
      itemType: transferRequest.materialType,
      itemQty: transferRequest.serialNumbers.length.toString(),
      itemSerialNo: transferRequest.serialNumbers.join(','),
      createId: "current_user_id",
      status: status
    });
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <Building className="w-4 h-4" />;
      case 'agent': return <Users className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'warehouse': return 'text-blue-600';
      case 'agent': return 'text-green-600';
      case 'otc': return 'text-purple-600';
      case 'repair': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Stock Transfer Management</h1>
            <p className="text-purple-100 mt-1 text-sm md:text-base">Transfer inventory between locations and track approvals</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs md:text-sm">
              <ArrowLeftRight className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Transfer Portal
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transfer Request Form */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="w-5 h-5 mr-2 text-purple-600" />
                New Transfer Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materialType">Material Type</Label>
                  <Select 
                    value={transferRequest.materialType} 
                    onValueChange={(value) => setTransferRequest({...transferRequest, materialType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
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
                  <Label htmlFor="reason">Transfer Reason</Label>
                  <Input
                    value={transferRequest.reason}
                    onChange={(e) => setTransferRequest({...transferRequest, reason: e.target.value})}
                    placeholder="Enter transfer reason"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transferFrom">Transfer From</Label>
                  <Select 
                    value={transferRequest.transferFrom} 
                    onValueChange={(value) => setTransferRequest({...transferRequest, transferFrom: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          <div className="flex items-center">
                            <span className={getLocationColor(location.type)}>
                              {getLocationIcon(location.type)}
                            </span>
                            <span className="ml-2">{location.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="transferTo">Transfer To</Label>
                  <Select 
                    value={transferRequest.transferTo} 
                    onValueChange={(value) => setTransferRequest({...transferRequest, transferTo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          <div className="flex items-center">
                            <span className={getLocationColor(location.type)}>
                              {getLocationIcon(location.type)}
                            </span>
                            <span className="ml-2">{location.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Serial Numbers Section */}
              <div>
                <Label htmlFor="serialNumbers">Serial Numbers</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="Enter serial number"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSerial()}
                  />
                  <Button onClick={handleAddSerial} variant="outline">
                    Add
                  </Button>
                </div>
                
                {transferRequest.serialNumbers.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {transferRequest.serialNumbers.map((serial, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm font-mono">{serial}</span>
                        <Button 
                          onClick={() => handleRemoveSerial(serial)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Device Condition Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deviceCondition">Device Condition</Label>
                  <Select 
                    value={transferRequest.deviceCondition} 
                    onValueChange={(value) => setTransferRequest({...transferRequest, deviceCondition: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOOD">Good</SelectItem>
                      <SelectItem value="DAMAGED">Damaged</SelectItem>
                      <SelectItem value="REPAIR">Needs Repair</SelectItem>
                      <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="conditionRemarks">Condition Remarks</Label>
                  <Input
                    value={transferRequest.conditionRemarks}
                    onChange={(e) => setTransferRequest({...transferRequest, conditionRemarks: e.target.value})}
                    placeholder="Enter condition remarks (required for damaged/repair)"
                  />
                </div>
              </div>

              {(transferRequest.deviceCondition === 'DAMAGED' || transferRequest.deviceCondition === 'REPAIR') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Special Approval Required:</strong> Items marked as damaged or needing repair require additional supervisor approval.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleTransferSubmit}
                disabled={transferMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {transferMutation.isPending ? "Submitting..." : "Submit Transfer Request"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transfer History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-purple-600" />
                Recent Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading transfers...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transferRequests.length > 0 ? (
                    transferRequests.map((request: any) => (
                      <div key={request.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                {request.status || 'PENDING'}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-2">#{request.requestId}</span>
                            </div>
                            <p className="font-medium text-sm">{request.itemType}</p>
                            <p className="text-xs text-gray-600">Qty: {request.itemQty}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.createDt ? new Date(request.createDt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{request.transferFrom}</span>
                          <ArrowRight className="w-3 h-3 mx-2" />
                          <span>{request.transferTo}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No transfer requests found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}