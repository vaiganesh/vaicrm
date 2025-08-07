import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BULK_TYPES = [
  { key: "bulk_payment", label: "Bulk Payment" },
  { key: "bulk_add_plan", label: "Bulk Add Plan" },
  { key: "bulk_disconnection", label: "Bulk Disconnection" },
  { key: "bulk_reconnection", label: "Bulk Reconnection" },
  { key: "bulk_retrack", label: "Bulk Retrack" },
  { key: "bulk_credit_limit", label: "Bulk Credit Limit" },
];

export default function BulkUploadTable() {
  const { toast } = useToast();

  // Tell TypeScript this is an array
  const { data: uploads, isLoading: uploadsLoading } = useQuery<any[]>({
    queryKey: ["/api/bulk-uploads"],
  });

  // Mock data for demonstration if no uploads are present
  const mockUploads = [
    {
      id: 101,
      type: "bulk_payment",
      uploadedBy: "John Doe",
      date: new Date().toISOString(),
      status: "pending",
    },
    {
      id: 102,
      type: "bulk_add_plan",
      uploadedBy: "Jane Smith",
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "approved",
    },
    {
      id: 103,
      type: "bulk_disconnection",
      uploadedBy: "Alice Brown",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: "rejected",
    },
  ];

  // Approve uploads (for finance team)
  const handleApprove = (uploadId: number) => {
    toast({ title: "Approved", description: `Upload #${uploadId} approved.` });
  };

  // Reject uploads
  const handleReject = (uploadId: number) => {
    toast({ title: "Rejected", description: `Upload #${uploadId} rejected.`, variant: "destructive" });
  };

  const displayUploads = (uploads && uploads.length > 0) ? uploads : mockUploads;

  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Bulk Upload History</h3>
      {uploadsLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-azam-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading uploads...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead>
              <tr>
                <th className="px-2 py-2">Upload ID</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Uploaded By</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayUploads.map((upload: any) => (
                <tr key={upload.id}>
                  <td className="px-2 py-2">{upload.id}</td>
                  <td className="px-2 py-2">{BULK_TYPES.find(t => t.key === upload.type)?.label || upload.type}</td>
                  <td className="px-2 py-2">{upload.uploadedBy}</td>
                  <td className="px-2 py-2">{new Date(upload.date).toLocaleString()}</td>
                  <td className="px-2 py-2">
                    <Badge
                      variant={
                        upload.status === "pending"
                          ? "secondary"
                          : upload.status === "approved"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {upload.status}
                    </Badge>
                  </td>
                  <td className="px-2 py-2">
                    {upload.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(upload.id)}>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(upload.id)} className="ml-2">
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}