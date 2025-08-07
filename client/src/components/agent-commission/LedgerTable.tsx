import { Badge } from "@/components/ui/badge";

interface LedgerTableProps {
  type: "payment" | "commission";
  data: any[];
  isLoading: boolean;
}

const PAYMENT_COLUMNS = [
  { label: "Date", key: "date" },
  { label: "Description", key: "description" },
  { label: "Reference", key: "reference" },
  { label: "Type", key: "type" }, // Credit/Debit
  { label: "Amount (TSH)", key: "amount" },
  { label: "Balance (TSH)", key: "balance" },
];

const COMMISSION_COLUMNS = [
  { label: "Date", key: "date" },
  { label: "Description", key: "description" },
  { label: "Commission Rate", key: "rate" },
  { label: "Gross Amount", key: "gross" },
  { label: "WHT (10%)", key: "wht" },
  { label: "VAT (18%)", key: "vat" },
  { label: "Net Amount", key: "net" },
  { label: "Status", key: "status" },
];

export default function LedgerTable({ type, data, isLoading }: LedgerTableProps) {
  const columns = type === "payment" ? PAYMENT_COLUMNS : COMMISSION_COLUMNS;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-2 py-2 text-left font-semibold">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                <div className="w-8 h-8 border-2 border-azam-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </td>
            </tr>
          ) : !data.length ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-2 py-2">
                    {col.key === "status" && row[col.key] ? (
                      <Badge
                        variant={
                          row[col.key] === "Paid"
                            ? "default"
                            : row[col.key] === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {row[col.key]}
                      </Badge>
                    ) : col.key === "amount" || col.key === "gross" || col.key === "wht" || col.key === "vat" || col.key === "net" || col.key === "balance" ? (
                      row[col.key] !== undefined ? Number(row[col.key]).toLocaleString() : ""
                    ) : col.key === "date" && row[col.key] ? (
                      new Date(row[col.key]).toLocaleDateString()
                    ) : (
                      row[col.key] ?? ""
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}