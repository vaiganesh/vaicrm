import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MultiStepCustomerForm from "@/components/forms/multi-step-customer-form";
import CustomersDataGrid from "@/components/customers/customers-data-grid";

export default function CustomerRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for URL parameters to show form directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'new') {
      setShowForm(true);
    }
  }, []);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: any) => {
      if (editingCustomer) {
        await apiRequest("PUT", `/api/customers/${editingCustomer.id}`, customerData);
      } else {
        await apiRequest("POST", "/api/customers", customerData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Success",
        description: editingCustomer ? "Customer has been updated successfully" : "Customer has been registered successfully",
      });
      setShowForm(false);
      setEditingCustomer(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: editingCustomer ? "Failed to update customer" : "Failed to register customer",
        variant: "destructive",
      });
    },
  });

  if (showForm || editingCustomer) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingCustomer ? `Edit Customer - ${editingCustomer.firstName} ${editingCustomer.lastName}` : "New Customer Registration"}
          </h2>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
            className="text-sm w-full sm:w-auto"
          >
            Back to List
          </Button>
        </div>

        <MultiStepCustomerForm
          onSubmit={(data) => createCustomerMutation.mutate(data)}
          isLoading={createCustomerMutation.isPending}
          defaultValues={editingCustomer || undefined}
        />
      </div>
    );
  }

  const handleView = (customer: any) => {
    console.log("View customer:", customer);
    setViewingCustomer(customer);
  };

  const handleEdit = (customer: any) => {
    console.log("Edit customer:", customer);
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-lg font-semibold text-gray-900">Registered Customers</h2>
        <Button className="btn-primary w-full sm:w-auto" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      {!customers || customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No customers registered yet</p>
          <Button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Customer
          </Button>
        </div>
      ) : (
        <CustomersDataGrid
          customers={customers}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}