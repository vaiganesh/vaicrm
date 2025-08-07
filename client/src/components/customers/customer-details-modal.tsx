import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  FileText,
  Calendar,
  Globe,
  Banknote,
  Shield,
  Edit,
  Tv,
  Wifi,
  UserCheck
} from "lucide-react";

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

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
}

const getAccountClassColor = (accountClass: string) => {
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

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return "N/A";
  }
};

export default function CustomerDetailsModal({ customer, isOpen, onClose, onEdit }: CustomerDetailsModalProps) {
  if (!customer) return null;

  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-6 w-6 text-azam-blue" />
              Customer Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${getAccountClassColor(customer.accountClass)} text-sm px-3 py-1`}>
                {customer.accountClass}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => onEdit?.(customer)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-azam-blue" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{customer.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                  <p className="text-sm text-gray-500">Primary Phone</p>
                </div>
              </div>

              {customer.mobile && customer.mobile !== customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{customer.mobile}</p>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                  <p className="text-sm text-gray-500">Registration Date</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tv className="h-5 w-5 text-azam-blue" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{customer.customerType}</p>
                  <p className="text-sm text-gray-500">Customer Type</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tv className="h-4 w-4 text-gray-500" />
                <div>
                  <Badge className={`${getServiceTypeColor(customer.serviceType)} text-xs`}>
                    {customer.serviceType}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">Service Type</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <Badge className={`${getAccountClassColor(customer.accountClass)} text-xs`}>
                    {customer.accountClass}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">Account Class</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{customer.connectionType}</p>
                  <p className="text-sm text-gray-500">Connection Type</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{customer.currency}</p>
                  <p className="text-sm text-gray-500">Currency</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-azam-blue" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{customer.city}</p>
                    <p className="text-sm text-gray-500">City</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{customer.region}</p>
                    <p className="text-sm text-gray-500">Region</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{customer.country}</p>
                    <p className="text-sm text-gray-500">Country</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}