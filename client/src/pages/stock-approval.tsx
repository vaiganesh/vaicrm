import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Package, 
  ArrowRight, 
  FileText,
  Building,
  Users,
  Wrench,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function StockApproval() {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: inventoryRequestsResponse, isLoading } = useQuery<any>({
    queryKey: ["/api/inventory-requests"],
  });

  // Extract data from API response format {success: true, data: [...]}
  const inventoryRequests = inventoryRequestsResponse?.success ? inventoryRequestsResponse.data : [];
  
  // Ensure inventoryRequests is always an array
  const safeInventoryRequests = Array.isArray(inventoryRequests) ? inventoryRequests : [];

  // Filter requests by status (API returns lowercase status values)
  const pendingRequests = safeInventoryRequests.filter((req: any) => 
    req.status?.toLowerCase() === "pending" || req.status?.toLowerCase() === "in_transit"
  );

  const approvedRequests = safeInventoryRequests.filter((req: any) => 
    req.status?.toLowerCase() === "approved"
  );

  const rejectedRequests = safeInventoryRequests.filter((req: any) => 
    req.status?.toLowerCase() === "rejected"
  );

  // Mutation for approving requests
  const approveMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("PATCH", `/api/inventory-requests/${data.id}`, {
      status: "APPROVED",
      updateId: "current_user_id"
    }),
    onSuccess: () => {
      toast({ title: "Request approved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
    },
    onError: () => {
      toast({ title: "Failed to approve request", variant: "destructive" });
    }
  });

  // Mutation for rejecting requests
  const rejectMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("PATCH", `/api/inventory-requests/${data.id}`, {
      status: "REJECTED",
      updateId: "current_user_id",
      rejectionRemarks: data.remarks
    }),
    onSuccess: () => {
      toast({ title: "Request rejected successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-requests"] });
      setRejectionModalOpen(false);
      setSelectedRequest(null);
      setRejectionRemarks("");
    },
    onError: () => {
      toast({ title: "Failed to reject request", variant: "destructive" });
    }
  });

  const handleApprove = (request: any) => {
    approveMutation.mutate({ id: request.id });
  };

  const handleReject = (request: any) => {
    setSelectedRequest(request);
    setRejectionModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectionRemarks.trim()) {
      toast({ title: "Please provide rejection remarks", variant: "destructive" });
      return;
    }
    rejectMutation.mutate({ id: selectedRequest.id, remarks: rejectionRemarks });
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <Package className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getLocationIcon = (location: string) => {
    if (location?.includes('WH') || location?.includes('Warehouse')) return <Building className="w-4 h-4" />;
    if (location?.includes('AGENT') || location?.includes('Agent')) return <Users className="w-4 h-4" />;
    if (location?.includes('REPAIR') || location?.includes('Repair')) return <Wrench className="w-4 h-4" />;
    return <Package className="w-4 h-4" />;
  };

  const getRequestTypeDisplay = (requestType: string) => {
    switch (requestType) {
      case 'STOCK_REQUEST': return 'Stock Request';
      case 'TRANSFER': return 'Stock Transfer';
      case 'EMERGENCY_REQUEST': return 'Emergency Request';
      case 'REPLENISHMENT': return 'Replenishment';
      default: return requestType;
    }
  };

  const RequestCard = ({ request, showActions = false }: { request: any, showActions?: boolean }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(request.status)}>
                {getStatusIcon(request.status)}
                <span className="ml-1">{request.status}</span>
              </Badge>
              <span className="text-sm text-gray-500">#{request.requestId}</span>
            </div>
            <h3 className="font-semibold text-lg">{getRequestTypeDisplay(request.requestType)}</h3>
            <p className="text-sm text-gray-600 mb-2">{request.itemType}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {request.createDt ? new Date(request.createDt).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-xs text-gray-400">
              {request.createDt ? new Date(request.createDt).toLocaleTimeString() : ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="font-medium">{request.itemQty}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Module</p>
            <p className="font-medium">{request.module}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="font-medium">{request.totalAmount ? `TSH ${request.totalAmount.toLocaleString()}` : 'N/A'}</p>
          </div>
        </div>

        {(request.transferFrom || request.transferTo) && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
            {request.transferFrom && (
              <div className="flex items-center text-sm">
                {getLocationIcon(request.transferFrom)}
                <span className="ml-1">{request.transferFrom}</span>
              </div>
            )}
            {request.transferFrom && request.transferTo && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
            {request.transferTo && (
              <div className="flex items-center text-sm">
                {getLocationIcon(request.transferTo)}
                <span className="ml-1">{request.transferTo}</span>
              </div>
            )}
          </div>
        )}

        {request.itemSerialNo && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Serial Numbers</p>
            <div className="flex flex-wrap gap-1">
              {request.itemSerialNo.split(',').map((serial: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs font-mono">
                  {serial.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {request.sapSoId && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">SAP Sales Order ID</p>
            <p className="font-mono text-sm">{request.sapSoId}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button
            onClick={() => handleViewDetails(request)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {showActions && request.status === 'PENDING' && (
            <>
              <Button
                onClick={() => handleApprove(request)}
                disabled={approveMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(request)}
                disabled={rejectMutation.isPending}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>

        {showActions && request.status === 'IN_TRANSIT' && (
          <>
            <Button
              onClick={() => handleApprove(request)}
              disabled={approveMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept Transfer
            </Button>
            <Button
              onClick={() => handleReject(request)}
              disabled={rejectMutation.isPending}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Transfer
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Stock Approval Center</h1>
            <p className="text-green-100 mt-1 text-sm md:text-base">Review and approve stock requests and transfers</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs md:text-sm">
              <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Approval Workflow
            </Badge>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading pending requests...</p>
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request: any) => (
                    <RequestCard key={request.id} request={request} showActions={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                  <p className="text-gray-600">All requests have been processed</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-0">
              {approvedRequests.length > 0 ? (
                <div className="space-y-4">
                  {approvedRequests.map((request: any) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Requests</h3>
                  <p className="text-gray-600">No requests have been approved yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              {rejectedRequests.length > 0 ? (
                <div className="space-y-4">
                  {rejectedRequests.map((request: any) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Rejected Requests</h3>
                  <p className="text-gray-600">No requests have been rejected</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Approval Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Stock Request Approval</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Verify material availability before approval</li>
                <li>• Check requesting center's authorization level</li>
                <li>• Ensure proper budget allocation for requests</li>
                <li>• Validate serial numbers for tracked items</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Transfer Approval</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Confirm receiving center capacity</li>
                <li>• Verify transfer reason and justification</li>
                <li>• Check for damaged/repair items requiring special approval</li>
                <li>• Ensure proper documentation for audit trail</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="remarks">Rejection Remarks</Label>
              <Textarea
                id="remarks"
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="Please provide reason for rejection..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setRejectionModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Request ID</p>
                  <p className="text-sm">{selectedRequest.requestId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Request Type</p>
                  <p className="text-sm">{getRequestTypeDisplay(selectedRequest.requestType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Module</p>
                  <p className="text-sm">{selectedRequest.module}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Item Type</p>
                  <p className="text-sm">{selectedRequest.itemType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Quantity</p>
                  <p className="text-sm">{selectedRequest.itemQty}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-sm">{selectedRequest.totalAmount ? `TSH ${selectedRequest.totalAmount.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created Date</p>
                  <p className="text-sm">{selectedRequest.createDt ? new Date(selectedRequest.createDt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              
              {selectedRequest.itemSerialNo && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Serial Numbers</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedRequest.itemSerialNo.split(',').map((serial: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs font-mono">
                        {serial.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRequest.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Reason</p>
                  <p className="text-sm text-gray-800">{selectedRequest.reason}</p>
                </div>
              )}
              
              {selectedRequest.rejectionRemarks && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejection Remarks</p>
                  <p className="text-sm text-red-600">{selectedRequest.rejectionRemarks}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}