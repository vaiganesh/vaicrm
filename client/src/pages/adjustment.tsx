import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import CreateAdjustmentForm from "@/components/adjustment/CreateAdjustmentForm";
import AdjustmentApprovalTable from "@/components/adjustment/AdjustmentApprovalTable";
import AdjustmentHistoryTable from "@/components/adjustment/AdjustmentHistoryTable";

export default function Adjustment() {
  const [activeTab, setActiveTab] = useState("create");

  // Fetch adjustment statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/adjustments/stats'],
    queryFn: async () => {
      const response = await fetch('/api/adjustments/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  // Fetch pending adjustments count
  const { data: pendingCount } = useQuery({
    queryKey: ['/api/adjustments/pending'],
    queryFn: async () => {
      const response = await fetch('/api/adjustments/pending');
      if (!response.ok) throw new Error('Failed to fetch pending adjustments');
      const data = await response.json();
      return data.length;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adjustment Management</h1>
          <p className="text-gray-600">Manage customer account adjustments, approvals, and transaction history</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Adjustments</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : stats?.total || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(stats?.totalAmount || 0)} net impact
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Requires review</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Credit Adjustments</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.creditAmount || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Customer credits</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Debit Adjustments</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats?.debitAmount || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Customer debits</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Guide</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                PENDING
              </Badge>
              <span className="text-sm text-gray-600">Awaiting approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                APPROVED
              </Badge>
              <span className="text-sm text-gray-600">Being processed</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                PROCESSED
              </Badge>
              <span className="text-sm text-gray-600">Completed successfully</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <XCircle className="h-3 w-3 mr-1" />
                REJECTED
              </Badge>
              <span className="text-sm text-gray-600">Request denied</span>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Card className="bg-white shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="border-b">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50">
                <TabsTrigger 
                  value="create" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <DollarSign className="h-4 w-4" />
                  Create Adjustment
                </TabsTrigger>
                <TabsTrigger 
                  value="approval" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approval Queue
                  {pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-6">
              <TabsContent value="create" className="mt-0">
                <div className="max-w-4xl mx-auto">
                  <CardDescription className="mb-6">
                    Create new adjustment requests for customer accounts. All adjustments require approval before processing.
                  </CardDescription>
                  <CreateAdjustmentForm />
                </div>
              </TabsContent>

              <TabsContent value="approval" className="mt-0">
                <div>
                  <CardDescription className="mb-6">
                    Review and approve pending adjustment requests. Approved adjustments will be automatically processed through CM and FICA systems.
                  </CardDescription>
                  <AdjustmentApprovalTable />
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div>
                  <CardDescription className="mb-6">
                    View complete history of all adjustment requests and their processing status.
                  </CardDescription>
                  <AdjustmentHistoryTable />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}