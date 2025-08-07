import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Building, Users, Wrench, HardDrive } from "lucide-react";

export default function StockOverview() {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [serialSearchTerm, setSerialSearchTerm] = useState("");

  const { data: inventoryResponse, isLoading } = useQuery<any>({
    queryKey: ["/api/inventory"],
  });

  // Extract data from API response format {success: true, data: [...]}
  const inventory = inventoryResponse?.success ? inventoryResponse.data : [];
  
  // Ensure inventory is always an array
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const stockOverview = {
    warehouse: { total: 2450, fresh: 2200, used: 200, faulty: 50 },
    otc: { total: 850, fresh: 720, used: 100, faulty: 30 },
    agent: { total: 1200, fresh: 980, used: 180, faulty: 40 },
    repair: { total: 170, fresh: 0, used: 120, faulty: 50 }
  };

  const locations = [
    { id: "WH_DAR", name: "Warehouse - Dar es Salaam" },
    { id: "OTC_MWANZA", name: "OTC - Mwanza" },
    { id: "OTC_ARUSHA", name: "OTC - Arusha" },
    { id: "REPAIR_CTR", name: "Repair Center" },
    { id: "AGENT_001", name: "Agent - John Mwamba" },
    { id: "AGENT_002", name: "Agent - Mary Kimaro" }
  ];

  const filteredInventory = safeInventory.filter((item: any) => {
    if (selectedLocation !== "all" && item.owner !== selectedLocation) return false;
    if (serialSearchTerm && !item.serialNumber?.toLowerCase().includes(serialSearchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'fresh': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-yellow-100 text-yellow-800';
      case 'faulty': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (owner: string) => {
    if (owner?.includes('WH') || owner?.includes('Warehouse')) return <Building className="w-4 h-4" />;
    if (owner?.includes('AGENT') || owner?.includes('Agent')) return <Users className="w-4 h-4" />;
    if (owner?.includes('REPAIR') || owner?.includes('Repair')) return <Wrench className="w-4 h-4" />;
    return <Package className="w-4 h-4" />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-azam-blue to-blue-800 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Stock Overview</h1>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Comprehensive inventory status across all locations</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs md:text-sm">
              <HardDrive className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              SAP MM Connected
            </Badge>
          </div>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stockOverview).map(([location, stats]) => (
          <Card key={location} className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 capitalize flex items-center">
                {location === 'warehouse' && <Building className="w-4 h-4 mr-2 text-blue-600" />}
                {location === 'otc' && <Package className="w-4 h-4 mr-2 text-purple-600" />}
                {location === 'agent' && <Users className="w-4 h-4 mr-2 text-green-600" />}
                {location === 'repair' && <Wrench className="w-4 h-4 mr-2 text-orange-600" />}
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-azam-blue" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-azam-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading inventory...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CAS ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInventory.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.materialCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.materialName}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.serialNumber}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(item.state)} variant="secondary">
                            {item.state}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            {getLocationIcon(item.owner)}
                            <span className="ml-2">{item.owner}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">
                          {item.casId || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredInventory.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.materialName}</p>
                        <p className="text-xs text-gray-600">{item.materialCode}</p>
                      </div>
                      <Badge className={getStatusColor(item.state)} variant="secondary">
                        {item.state}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial:</span>
                        <span className="font-mono">{item.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span className="flex items-center">
                          {getLocationIcon(item.owner)}
                          <span className="ml-1">{item.owner}</span>
                        </span>
                      </div>
                      {item.casId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">CAS ID:</span>
                          <span className="font-mono">{item.casId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No inventory items found</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}