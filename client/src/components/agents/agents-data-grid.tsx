import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";
import AgentDetailsModal from "./agent-details-modal";

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  type: string;
  city: string;
  region: string;
  country: string;
  currency: string;
  createdAt?: string;
}

interface AgentsDataGridProps {
  agents: Agent[];
  isLoading: boolean;
  onRefresh?: () => void;
  onEdit?: (agent: Agent) => void;
  onView?: (agent: Agent) => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "inactive":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "suspended":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function AgentsDataGrid({ 
  agents, 
  isLoading, 
  onRefresh, 
  onEdit, 
  onView 
}: AgentsDataGridProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
    onView?.(agent);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAgent(null);
  };

  const handleEditFromModal = (agent: Agent) => {
    setShowDetailsModal(false);
    setSelectedAgent(null);
    onEdit?.(agent);
  };

  const handleExport = () => {
    // Get current filtered and sorted data
    const visibleData = table.getFilteredRowModel().rows.map(row => row.original);
    
    // Convert to CSV
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Type', 'City', 'Region', 'Country', 'Currency', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...visibleData.map(agent => [
        agent.id,
        agent.firstName,
        agent.lastName,
        agent.email,
        agent.phone || '',
        agent.role,
        agent.status,
        agent.type,
        agent.city,
        agent.region,
        agent.country,
        agent.currency,
        agent.createdAt || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `agents_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columnHelper = createColumnHelper<Agent>();

  const columns = useMemo<ColumnDef<Agent, any>[]>(
    () => [
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {info.row.original.firstName} {info.row.original.lastName}
            </span>
            <span className="text-sm text-gray-500">{info.row.original.email}</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("phone", {
        header: "Contact",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{info.getValue()}</span>
            <span className="text-xs text-gray-500">{info.row.original.type}</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
          <Badge variant="outline" className="text-xs">
            {info.getValue()}
          </Badge>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Badge className={`${getStatusColor(info.getValue())} text-xs`}>
            {info.getValue()}
          </Badge>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("region", {
        header: "Location",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{info.row.original.city}</span>
            <span className="text-xs text-gray-500">{info.getValue()}, {info.row.original.country}</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("currency", {
        header: "Currency",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-50"
              onClick={() => handleViewDetails(info.row.original)}
              title="View Details"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-50"
              onClick={() => onEdit?.(info.row.original)}
              title="Edit Agent"
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onView, handleViewDetails]
  );

  const table = useReactTable({
    data: agents || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    if (!Array.isArray(agents)) return [];
    return Array.from(new Set(agents.map(agent => agent.status).filter(Boolean)));
  }, [agents]);
  
  const uniqueRegions = useMemo(() => {
    if (!Array.isArray(agents)) return [];
    return Array.from(new Set(agents.map(agent => agent.region).filter(Boolean)));
  }, [agents]);

  // Apply filters
  useMemo(() => {
    const filters = [];
    if (statusFilter && statusFilter !== "all") {
      filters.push({ id: "status", value: statusFilter });
    }
    if (regionFilter && regionFilter !== "all") {
      filters.push({ id: "region", value: regionFilter });
    }
    setColumnFilters(filters);
  }, [statusFilter, regionFilter]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-azam-blue" />
            <span className="ml-2 text-gray-600">Loading agents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <CardTitle className="text-lg">Registered Agents</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents by name, email, or phone..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-1 ${
                            header.column.getCanSort() ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronsUpDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-200 px-4 py-3 text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-4">
          <div className="text-sm text-gray-700">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Agent Details Modal */}
    <AgentDetailsModal
      agent={selectedAgent}
      isOpen={showDetailsModal}
      onClose={handleCloseModal}
      onEdit={handleEditFromModal}
    />
    </>
  );
}