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
import CustomerDetailsModal from "./customer-details-modal";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  mobile: string;
  customerType: string;
  serviceType: string;
  accountClass: string;
  connectionType: string;
  city: string;
  region: string;
  country: string;
  currency: string;
  createdAt?: string;
}

interface CustomersDataGridProps {
  customers: Customer[];
  isLoading: boolean;
  onRefresh?: () => void;
  onEdit?: (customer: Customer) => void;
  onView?: (customer: Customer) => void;
}

const getStatusColor = (accountClass: string) => {
  switch (accountClass?.toLowerCase()) {
    case "premium":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "family":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "basic":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType?.toLowerCase()) {
    case "residential":
      return "bg-green-100 text-green-800 border-green-200";
    case "commercial":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "corporate":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function CustomersDataGrid({ 
  customers, 
  isLoading, 
  onRefresh, 
  onEdit, 
  onView 
}: CustomersDataGridProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
    onView?.(customer);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCustomer(null);
  };

  const handleEditFromModal = (customer: Customer) => {
    setShowDetailsModal(false);
    setSelectedCustomer(null);
    onEdit?.(customer);
  };

  const handleExport = () => {
    // Get current filtered and sorted data
    const visibleData = table.getFilteredRowModel().rows.map(row => row.original);
    
    // Convert to CSV
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Mobile', 'Customer Type', 'Service Type', 'Account Class', 'Connection Type', 'City', 'Region', 'Country', 'Currency', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...visibleData.map(customer => [
        customer.id,
        customer.firstName,
        customer.lastName,
        customer.email || '',
        customer.phone,
        customer.mobile,
        customer.customerType,
        customer.serviceType,
        customer.accountClass,
        customer.connectionType,
        customer.city,
        customer.region,
        customer.country,
        customer.currency,
        customer.createdAt || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columnHelper = createColumnHelper<Customer>();

  const columns = useMemo<ColumnDef<Customer, any>[]>(
    () => [
      columnHelper.accessor("firstName", {
        header: "Name",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {info.row.original.firstName} {info.row.original.lastName}
            </span>
            <span className="text-sm text-gray-500">{info.row.original.email || "No email"}</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("phone", {
        header: "Contact",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{info.getValue()}</span>
            <span className="text-xs text-gray-500">{info.row.original.mobile}</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("serviceType", {
        header: "Service Type",
        cell: (info) => (
          <Badge className={`${getServiceTypeColor(info.getValue())} text-xs`}>
            {info.getValue()}
          </Badge>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("accountClass", {
        header: "Account Class",
        cell: (info) => (
          <Badge className={`${getStatusColor(info.getValue())} text-xs`}>
            {info.getValue()}
          </Badge>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("connectionType", {
        header: "Connection",
        cell: (info) => (
          <span className="text-sm text-gray-900">{info.getValue()}</span>
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
              title="Edit Customer"
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
    data: customers || [],
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
  const uniqueServiceTypes = useMemo(() => 
    Array.from(new Set(customers?.map(customer => customer.serviceType).filter(Boolean))), 
    [customers]
  );
  
  const uniqueRegions = useMemo(() => 
    Array.from(new Set(customers?.map(customer => customer.region).filter(Boolean))), 
    [customers]
  );

  // Apply filters
  useMemo(() => {
    const filters = [];
    if (serviceTypeFilter && serviceTypeFilter !== "all") {
      filters.push({ id: "serviceType", value: serviceTypeFilter });
    }
    if (regionFilter && regionFilter !== "all") {
      filters.push({ id: "region", value: regionFilter });
    }
    setColumnFilters(filters);
  }, [serviceTypeFilter, regionFilter]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-azam-blue" />
            <span className="ml-2 text-gray-600">Loading customers...</span>
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
          <CardTitle className="text-lg">Registered Customers</CardTitle>
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
              placeholder="Search customers by name, email, or phone..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                {uniqueServiceTypes.map((serviceType) => (
                  <SelectItem key={serviceType} value={serviceType}>
                    {serviceType}
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
                              {header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
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
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-200 px-4 py-3 whitespace-nowrap"
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
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </p>
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

    {/* Customer Details Modal */}
    <CustomerDetailsModal
      customer={selectedCustomer}
      isOpen={showDetailsModal}
      onClose={handleCloseModal}
      onEdit={handleEditFromModal}
    />
    </>
  );
}