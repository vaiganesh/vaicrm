import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Package, CheckCircle, AlertCircle, Search, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendorName: string;
  vendorCode: string;
  orderDate: Date;
  expectedDelivery: Date;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "PARTIALLY_RECEIVED" | "FULLY_RECEIVED" | "CANCELLED";
  items: POItem[];
}

interface POItem {
  id: number;
  materialCode: string;
  materialName: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  totalPrice: number;
  grnStatus: "PENDING" | "PARTIAL" | "COMPLETE";
}

interface GRNEntry {
  id: number;
  grnNumber: string;
  poNumber: string;
  receivedDate: Date;
  receivedBy: string;
  items: GRNItem[];
  status: "DRAFT" | "SUBMITTED" | "APPROVED";
}

interface GRNItem {
  materialCode: string;
  materialName: string;
  receivedQty: number;
  serialNumbers: string[];
  condition: "GOOD" | "DAMAGED" | "INCOMPLETE";
  remarks?: string;
}

export default function POGRNUpdate() {
  const [selectedTab, setSelectedTab] = useState("search");
  const [searchPO, setSearchPO] = useState("");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [grnData, setGrnData] = useState<GRNEntry | null>(null);
  const [updatingItem, setUpdatingItem] = useState<POItem | null>(null);
  const [receivedQty, setReceivedQty] = useState("");
  const [serialNumbers, setSerialNumbers] = useState("");
  const [condition, setCondition] = useState<"GOOD" | "DAMAGED" | "INCOMPLETE">("GOOD");
  const [remarks, setRemarks] = useState("");

  const queryClient = useQueryClient();

  const { data: purchaseOrders, isLoading } = useQuery<PurchaseOrder[]>({
    queryKey: ["/api/purchase-orders"],
  });

  const { data: grnEntries } = useQuery<GRNEntry[]>({
    queryKey: ["/api/grn-entries"],
  });

  const searchPOMutation = useMutation({
    mutationFn: async (poNumber: string) => {
      const response = await fetch(`/api/purchase-orders/search?po=${poNumber}`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
        setSelectedPO(data);
        // Initialize GRN data for the PO
        setGrnData({
          id: 0,
          grnNumber: `GRN${Date.now()}`,
          poNumber: data.poNumber,
          receivedDate: new Date(),
          receivedBy: "current_user",
          items: [],
          status: "DRAFT",
        });
      } else {
        toast({ title: "Purchase Order not found", variant: "destructive" });
      }
    },
  });

  const updateGRNMutation = useMutation({
    mutationFn: async (grnData: GRNEntry) => {
      const response = await fetch("/api/grn-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grnData),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "GRN updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/grn-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
    },
  });

  const handleSearch = () => {
    if (searchPO.trim()) {
      searchPOMutation.mutate(searchPO.trim());
    }
  };

  const handleItemUpdate = (item: POItem) => {
    setUpdatingItem(item);
    setReceivedQty("");
    setSerialNumbers("");
    setCondition("GOOD");
    setRemarks("");
  };

  const handleSubmitItemUpdate = () => {
    if (updatingItem && grnData) {
      const qty = parseInt(receivedQty);
      const serialNumbersArray = serialNumbers.split(",").map(s => s.trim()).filter(s => s);

      const grnItem: GRNItem = {
        materialCode: updatingItem.materialCode,
        materialName: updatingItem.materialName,
        receivedQty: qty,
        serialNumbers: serialNumbersArray,
        condition,
        remarks,
      };

      const existingItemIndex = grnData.items.findIndex(
        item => item.materialCode === updatingItem.materialCode
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...grnData.items];
        updatedItems[existingItemIndex] = grnItem;
        setGrnData({ ...grnData, items: updatedItems });
      } else {
        setGrnData({ ...grnData, items: [...grnData.items, grnItem] });
      }

      setUpdatingItem(null);
      setReceivedQty("");
      setSerialNumbers("");
      setCondition("GOOD");
      setRemarks("");
    }
  };

  const handleSubmitGRN = () => {
    if (grnData) {
      updateGRNMutation.mutate({ ...grnData, status: "SUBMITTED" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PARTIALLY_RECEIVED": return "bg-blue-100 text-blue-800";
      case "FULLY_RECEIVED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGRNStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PARTIAL": return "bg-blue-100 text-blue-800";
      case "COMPLETE": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "GOOD": return "bg-green-100 text-green-800";
      case "DAMAGED": return "bg-red-100 text-red-800";
      case "INCOMPLETE": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PO - GRN Update</h1>
          <p className="text-gray-600">Update Goods Receipt Note (GRN) for Purchase Orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-azam-blue" />
          <span className="text-sm text-gray-600">GRN Management</span>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search PO</TabsTrigger>
          <TabsTrigger value="pending">Pending GRN</TabsTrigger>
          <TabsTrigger value="completed">Completed GRN</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search Purchase Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="searchPO">Purchase Order Number</Label>
                  <Input
                    id="searchPO"
                    value={searchPO}
                    onChange={(e) => setSearchPO(e.target.value)}
                    placeholder="Enter PO number"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="bg-azam-blue hover:bg-azam-blue/90">
                    Search
                  </Button>
                </div>
              </div>

              {selectedPO && (
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Purchase Order: {selectedPO.poNumber}</CardTitle>
                      <Badge className={getStatusColor(selectedPO.status)}>
                        {selectedPO.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Vendor Information</p>
                        <p className="text-sm text-gray-600">Name: {selectedPO.vendorName}</p>
                        <p className="text-sm text-gray-600">Code: {selectedPO.vendorCode}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Order Details</p>
                        <p className="text-sm text-gray-600">Date: {new Date(selectedPO.orderDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Expected: {new Date(selectedPO.expectedDelivery).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Purchase Order Items</h4>
                      <div className="space-y-2">
                        {selectedPO.items.map((item) => (
                          <Card key={item.id} className="border-l-4 border-l-azam-blue">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{item.materialName}</p>
                                  <p className="text-sm text-gray-600">Code: {item.materialCode}</p>
                                  <p className="text-sm text-gray-600">
                                    Ordered: {item.orderedQty} | Received: {item.receivedQty}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getGRNStatusColor(item.grnStatus)}>
                                    {item.grnStatus}
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {selectedPO.currency} {item.totalPrice.toLocaleString()}
                                  </p>
                                  <Button
                                    size="sm"
                                    onClick={() => handleItemUpdate(item)}
                                    className="mt-2 bg-azam-blue hover:bg-azam-blue/90"
                                  >
                                    Update GRN
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {grnData && grnData.items.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3">GRN Items Updated</h4>
                          <div className="space-y-2">
                            {grnData.items.map((item, index) => (
                              <Card key={index} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{item.materialName}</p>
                                      <p className="text-sm text-gray-600">Received: {item.receivedQty}</p>
                                      <p className="text-sm text-gray-600">
                                        Serial Numbers: {item.serialNumbers.join(", ")}
                                      </p>
                                    </div>
                                    <Badge className={getConditionColor(item.condition)}>
                                      {item.condition}
                                    </Badge>
                                  </div>
                                  {item.remarks && (
                                    <p className="text-sm text-gray-600 mt-2">Remarks: {item.remarks}</p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <Button
                            onClick={handleSubmitGRN}
                            className="w-full mt-4 bg-green-600 hover:bg-green-700"
                          >
                            Submit GRN
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {updatingItem && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Update GRN for {updatingItem.materialName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="receivedQty">Received Quantity</Label>
                        <Input
                          id="receivedQty"
                          type="number"
                          value={receivedQty}
                          onChange={(e) => setReceivedQty(e.target.value)}
                          placeholder="Enter received quantity"
                          max={updatingItem.orderedQty}
                        />
                      </div>
                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Select value={condition} onValueChange={(value: any) => setCondition(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GOOD">Good</SelectItem>
                            <SelectItem value="DAMAGED">Damaged</SelectItem>
                            <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serialNumbers">Serial Numbers (comma-separated)</Label>
                      <Textarea
                        id="serialNumbers"
                        value={serialNumbers}
                        onChange={(e) => setSerialNumbers(e.target.value)}
                        placeholder="Enter serial numbers separated by commas"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter any remarks"
                        rows={2}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setUpdatingItem(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitItemUpdate}
                        disabled={!receivedQty || !serialNumbers.trim()}
                        className="flex-1 bg-azam-blue hover:bg-azam-blue/90"
                      >
                        Add to GRN
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {purchaseOrders?.filter(po => po.status === "PENDING" || po.status === "PARTIALLY_RECEIVED").map((po) => (
              <Card key={po.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{po.poNumber}</h3>
                      <p className="text-sm text-gray-600">Vendor: {po.vendorName}</p>
                      <p className="text-sm text-gray-600">
                        Expected: {new Date(po.expectedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(po.status)}>
                        {po.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {po.currency} {po.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {grnEntries?.filter(grn => grn.status === "APPROVED").map((grn) => (
              <Card key={grn.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{grn.grnNumber}</h3>
                      <p className="text-sm text-gray-600">PO: {grn.poNumber}</p>
                      <p className="text-sm text-gray-600">
                        Received: {new Date(grn.receivedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {grn.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Items: {grn.items.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}