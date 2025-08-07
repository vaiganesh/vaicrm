import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const BULK_TYPES = [
  { key: "bulk_payment", label: "Bulk Payment", template: "/templates/bulk_payment.xlsx" },
  { key: "bulk_add_plan", label: "Bulk Add Plan", template: "/templates/bulk_add_plan.xlsx" },
  { key: "bulk_disconnection", label: "Bulk Disconnection", template: "/templates/bulk_disconnection.xlsx" },
  { key: "bulk_reconnection", label: "Bulk Reconnection", template: "/templates/bulk_reconnection.xlsx" },
  { key: "bulk_retrack", label: "Bulk Retrack", template: "/templates/bulk_retrack.xlsx" },
  { key: "bulk_credit_limit", label: "Bulk Credit Limit", template: "/templates/bulk_credit_limit.xlsx" },
  { key: "bulk_payment_cancel", label: "Bulk Payment Cancel", template: "/templates/bulk_payment_cancel.xlsx" },
  { key: "bulk_invoice_cancel", label: "Bulk Invoice Cancel", template: "/templates/bulk_invoice_cancel.xlsx" },
  { key: "bulk_adjustment", label: "Bulk Adjustment", template: "/templates/bulk_adjustment.xlsx" },
  { key: "bulk_serial_no_upload", label: "Bulk Serial No Upload", template: "/templates/bulk_serial_no_upload.xlsx" },
  { key: "bulk_advanced_renewal", label: "Bulk Advanced Renewal", template: "/templates/bulk_advanced_renewal.xlsx" },
  { key: "bulk_plan_extension", label: "Bulk Plan Extension", template: "/templates/bulk_plan_extension.xlsx" },
  { key: "bulk_service_request_update", label: "Bulk Service Request Update", template: "/templates/bulk_service_request_update.xlsx" },
];

const BULK_TYPE_COLUMNS: Record<string, { label: string; key: string }[]> = {
  bulk_payment: [
    { label: "Customer ID", key: "customerId" },
    { label: "Pay Mode", key: "payMode" },
    { label: "Pay Type", key: "payType" },
    { label: "Pay Amount", key: "payAmount" },
  ],
  bulk_add_plan: [
    { label: "SC/STB ID", key: "scStbId" },
    { label: "Plan Name", key: "planName" },
    { label: "Activation Date", key: "activationDate" },
  ],
  bulk_disconnection: [
    { label: "SC/STB ID", key: "scStbId" },
    { label: "Disconnection Reason", key: "reason" },
  ],
  bulk_reconnection: [
    { label: "SC/STB ID", key: "scStbId" },
    { label: "Reconnection Reason", key: "reason" },
  ],
  bulk_retrack: [
    { label: "SC/STB ID", key: "scStbId" },
  ],
  bulk_credit_limit: [
    { label: "ID (SC/STB/Customer)", key: "id" },
    { label: "Type (Agent/Customer)", key: "type" },
    { label: "Category (Hardware/Subscription)", key: "category" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
  ],
  bulk_payment_cancel: [
    { label: "SC/STB/Customer ID", key: "id" },
    { label: "Type (Agent/Customer)", key: "type" },
    { label: "Category (Hardware/Subscription)", key: "category" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Trans ID", key: "transId" },
  ],
  bulk_invoice_cancel: [
    { label: "SC/STB/Customer ID", key: "id" },
    { label: "Type (Agent/Customer)", key: "type" },
    { label: "Category (Hardware/Subscription)", key: "category" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Invoice ID", key: "invoiceId" },
  ],
  bulk_adjustment: [
    { label: "SC/STB/Customer ID", key: "id" },
    { label: "Type (Agent/Customer)", key: "type" },
    { label: "Reason", key: "reason" },
    { label: "Amount", key: "amount" },
    { label: "Credit/Debit", key: "creditDebit" },
  ],
  bulk_serial_no_upload: [
    { label: "Warehouse ID", key: "warehouseId" },
    { label: "Agent ID", key: "agentId" },
    { label: "Serial No", key: "serialNo" },
    { label: "Order ID", key: "orderId" },
  ],
  bulk_advanced_renewal: [
    { label: "SC ID", key: "scId" },
    { label: "Action Type", key: "actionType" }, // should be "RENEWAL"
  ],
  bulk_plan_extension: [
    { label: "SC ID", key: "scId" },
    { label: "Action Type", key: "actionType" }, // should be "EXTENSION"
    { label: "Extension Date", key: "extensionDate" },
  ],
  bulk_service_request_update: [
    { label: "SR_ID", key: "srId" },
    { label: "Customer ID", key: "customerId" },
    { label: "Status", key: "status" },
    { label: "Remarks", key: "remarks" },
  ],
};

export default function BulkUploadTab() {
  const [bulkType, setBulkType] = useState(BULK_TYPES[0].key);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "validating" | "ready" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { toast } = useToast();

  // Handle file upload and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setPreviewData([]);
    setUploadStatus("idle");
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setUploadStatus("validating");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      // Basic validation: check required columns
      const requiredCols = BULK_TYPE_COLUMNS[bulkType].map(c => c.label);
      const firstRow = json[0] as any;
      const missingCols = requiredCols.filter(col => !(col in firstRow));
      if (missingCols.length > 0) {
        setErrorMsg(`Missing columns: ${missingCols.join(", ")}`);
        setUploadStatus("error");
        return;
      }
      setPreviewData(json);
      setUploadStatus("ready");
    };
    reader.readAsBinaryString(file);
  };

  // Handle upload to backend
  const handleUpload = async () => {
    if (!previewData.length) return;
    setUploadStatus("uploading");
    try {
      const res = await fetch("/api/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: bulkType,
          records: previewData,
        }),
      });
      if (!res.ok) throw new Error("Upload failed");
      setUploadStatus("success");
      toast({ title: "Upload Successful", description: "Bulk upload processed and pending approval." });
      setFile(null);
      setPreviewData([]);
    } catch (err) {
      setUploadStatus("error");
      toast({ title: "Upload Failed", description: "There was an error processing your upload.", variant: "destructive" });
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    const template = BULK_TYPES.find(t => t.key === bulkType)?.template;
    if (template) {
      window.open(template, "_blank");
    } else {
      toast({ title: "No template available" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bulk Upload Type</label>
          <Select value={bulkType} onValueChange={setBulkType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BULK_TYPES.map(type => (
                <SelectItem key={type.key} value={type.key}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Upload Excel File</label>
        <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        {errorMsg && <div className="text-red-600 text-sm mt-2">{errorMsg}</div>}
      </div>

      {previewData.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50 mt-4">
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 text-azam-blue mr-2" />
            <span className="font-medium text-gray-900">Preview Data ({previewData.length} rows)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead>
                <tr>
                  {BULK_TYPE_COLUMNS[bulkType].map(col => (
                    <th key={col.key} className="px-2 py-1 text-left font-semibold">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {BULK_TYPE_COLUMNS[bulkType].map(col => (
                      <td key={col.key} className="px-2 py-1">{row[col.label]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <div className="text-xs text-gray-500 mt-2">Showing first 10 rows only.</div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleUpload}
          disabled={uploadStatus !== "ready"}
          className="btn-primary"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}