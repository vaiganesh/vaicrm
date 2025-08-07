import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import LedgerTable from "@/components/agent-commission/LedgerTable";
import { useAuth } from "@/hooks/use-auth";

export default function AgentCommission() {
  const [activeTab, setActiveTab] = useState("payment");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { user } = useAuth();

  // Fetch payment ledger
  const { data: paymentLedger = [], isLoading: loadingPayments } = useQuery<any[]>({
  queryKey: ["/api/agent/ledger", user?.id, dateFrom, dateTo],
  // ...fetch logic
});

const { data: commissionLedger = [], isLoading: loadingCommissions } = useQuery<any[]>({
  queryKey: ["/api/agent/commission-ledger", user?.id, dateFrom, dateTo],
  // ...fetch logic
});

  // Export handlers (optional)
  const handleExport = (type: "payment" | "commission", format: "excel" | "pdf") => {
    // Implement export logic or just alert for now
    alert(`Exporting ${type} ledger as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-azam-dark">Agent Ledger Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="payment">Payment Ledger</TabsTrigger>
              <TabsTrigger value="commission">Commission Ledger</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <div>
                <label className="block text-xs font-medium mb-1">From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-36"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-36"
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(activeTab as any, "excel")}
                  className="mr-2"
                >
                  <Download className="h-4 w-4 mr-1" /> Export Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(activeTab as any, "pdf")}
                >
                  <Download className="h-4 w-4 mr-1" /> Export PDF
                </Button>
              </div>
            </div>

            {/* Payment Ledger Tab */}
            <TabsContent value="payment">
              <LedgerTable
                type="payment"
                data={paymentLedger}
                isLoading={loadingPayments}
              />
            </TabsContent>

            {/* Commission Ledger Tab */}
            <TabsContent value="commission">
              <LedgerTable
                type="commission"
                data={commissionLedger}
                isLoading={loadingCommissions}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}