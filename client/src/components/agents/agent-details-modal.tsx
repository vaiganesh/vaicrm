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
  X,
  UserCheck,
  MessageSquare
} from "lucide-react";

interface Agent {
  id: number;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  type: string;
  country: string;
  region: string;
  city: string;
  district?: string;
  ward?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
  tinNumber?: string;
  vrnNumber?: string;
  currency: string;
  role: string;
  status: string;
  commission?: string;
  onboardingRefNo?: string;
  sapBpId?: string;
  contractAccountId?: string;
  kycDocuments?: {
    nationalId?: string;
    businessLicense?: string;
    taxCertificate?: string;
  };
  createdAt?: string;
  dateOfBirth?: string;
  gender?: string;
  paymentTerms?: string;
  kycDocId?: string;
  kycDocNo?: string;
}

interface AgentDetailsModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (agent: Agent) => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "inactive":
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "suspended":
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
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

export default function AgentDetailsModal({ agent, isOpen, onClose, onEdit }: AgentDetailsModalProps) {
  if (!agent) return null;

  const fullName = `${agent.title || ''} ${agent.firstName} ${agent.lastName}`.trim();
  const fullAddress = [agent.address1, agent.address2, agent.ward, agent.district, agent.city, agent.region, agent.country]
    .filter(Boolean)
    .join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-6 w-6 text-azam-blue" />
              Agent Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(agent.status)} text-sm px-3 py-1`}>
                {agent.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => onEdit?.(agent)}>
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
                  <p className="text-sm text-gray-500">Agent ID: {agent.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.email}</p>
                  <p className="text-sm text-gray-500">Primary Email</p>
                </div>
              </div>

              {agent.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.mobile}</p>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                  </div>
                </div>
              )}

              {agent.phone && agent.phone !== agent.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.phone}</p>
                    <p className="text-sm text-gray-500">Phone Number</p>
                  </div>
                </div>
              )}

              {agent.fax && (
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.fax}</p>
                    <p className="text-sm text-gray-500">Fax Number</p>
                  </div>
                </div>
              )}

              {agent.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(agent.dateOfBirth)}</p>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                  </div>
                </div>
              )}

              {agent.gender && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.gender}</p>
                    <p className="text-sm text-gray-500">Gender</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-azam-blue" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.type}</p>
                  <p className="text-sm text-gray-500">Agent Type</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.role}</p>
                  <p className="text-sm text-gray-500">Role</p>
                </div>
              </div>

              {agent.onboardingRefNo && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.onboardingRefNo}</p>
                    <p className="text-sm text-gray-500">Onboarding Reference</p>
                  </div>
                </div>
              )}

              {agent.sapBpId && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.sapBpId}</p>
                    <p className="text-sm text-gray-500">SAP Business Partner ID</p>
                  </div>
                </div>
              )}

              {agent.contractAccountId && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.contractAccountId}</p>
                    <p className="text-sm text-gray-500">Contract Account ID</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{formatDate(agent.createdAt)}</p>
                  <p className="text-sm text-gray-500">Registration Date</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-azam-blue" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">{fullAddress || "Address not provided"}</p>
                  <p className="text-sm text-gray-500">Full Address</p>
                </div>
              </div>

              {agent.postalCode && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.postalCode}</p>
                    <p className="text-sm text-gray-500">Postal Code</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.country}</p>
                  <p className="text-sm text-gray-500">Country</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.region}</p>
                  <p className="text-sm text-gray-500">Region</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.city}</p>
                  <p className="text-sm text-gray-500">City</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Banknote className="h-5 w-5 text-azam-blue" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{agent.currency}</p>
                  <p className="text-sm text-gray-500">Operating Currency</p>
                </div>
              </div>

              {agent.commission && (
                <div className="flex items-center gap-3">
                  <Banknote className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.commission}%</p>
                    <p className="text-sm text-gray-500">Commission Rate</p>
                  </div>
                </div>
              )}

              {agent.paymentTerms && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.paymentTerms}</p>
                    <p className="text-sm text-gray-500">Payment Terms</p>
                  </div>
                </div>
              )}

              {agent.tinNumber && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.tinNumber}</p>
                    <p className="text-sm text-gray-500">TIN Number</p>
                  </div>
                </div>
              )}

              {agent.vrnNumber && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.vrnNumber}</p>
                    <p className="text-sm text-gray-500">VRN Number</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* KYC Documents Section */}
        {(agent.kycDocuments || agent.kycDocId || agent.kycDocNo) && (
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-azam-blue" />
                KYC Documents & Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {agent.kycDocId && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{agent.kycDocId}</p>
                        <p className="text-sm text-gray-500">KYC Document ID</p>
                      </div>
                    </div>
                  )}

                  {agent.kycDocNo && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{agent.kycDocNo}</p>
                        <p className="text-sm text-gray-500">KYC Document Number</p>
                      </div>
                    </div>
                  )}
                </div>

                {agent.kycDocuments && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Document Status</h4>
                    <div className="space-y-2">
                      {agent.kycDocuments.nationalId && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">National ID</span>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {agent.kycDocuments.nationalId}
                          </Badge>
                        </div>
                      )}
                      {agent.kycDocuments.businessLicense && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Business License</span>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {agent.kycDocuments.businessLicense}
                          </Badge>
                        </div>
                      )}
                      {agent.kycDocuments.taxCertificate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tax Certificate</span>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {agent.kycDocuments.taxCertificate}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => onEdit?.(agent)} className="bg-azam-blue hover:bg-azam-blue/90">
            <Edit className="h-4 w-4 mr-2" />
            Edit Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}