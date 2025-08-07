import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAgentSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CloudUpload, ChevronLeft, ChevronRight, User, MapPin, Hash, CreditCard, Upload, Check, FileText, Building, Banknote } from "lucide-react";
import type { z } from "zod";

type AgentFormData = z.infer<typeof insertAgentSchema>;

interface MultiStepAgentFormProps {
  onSubmit: (data: AgentFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<AgentFormData>;
}

const tabs = [
  { id: "general", name: "General Data", icon: User },
  { id: "personal", name: "Personal Details", icon: FileText },
  { id: "address", name: "Address Details", icon: MapPin },
  { id: "tax", name: "Tax Information", icon: Hash },
  { id: "financial", name: "Financial Settings", icon: Banknote },
  { id: "kyc", name: "KYC Documents", icon: Upload }
];

export default function MultiStepAgentForm({ onSubmit, isLoading, defaultValues }: MultiStepAgentFormProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({
    poa: [],
    poi: []
  });
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(insertAgentSchema),
    defaultValues: {
      status: "draft",
      currency: "TSH",
      commission: 5.00,
      type: "",
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      fax: "",
      title: "",
      country: "",
      region: "",
      city: "",
      district: "",
      ward: "",
      address1: "",
      address2: "",
      postalCode: "",
      tinNumber: "",
      vrnNumber: "",
      parentId: "",
      kycDocId: "",
      kycDocNo: "",
      ...defaultValues,
    },
    mode: "onChange"
  });

  const watchedFields = watch();

  const handleFormSubmit = async (data: AgentFormData) => {
    console.log("Form submit triggered with data:", data);
    
    // Add the uploaded files to the data
    const submitData = {
      ...data,
      kycDocuments: uploadedFiles
    };
    
    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  const getCurrentTabIndex = () => {
    return tabs.findIndex(tab => tab.id === activeTab);
  };

  const getTabRequiredFields = (tabId: string) => {
    switch (tabId) {
      case "general":
        return ["type", "role", "currency"];
      case "personal":
        return ["firstName", "lastName", "email", "phone"];
      case "address":
        return ["country", "region", "city", "district", "ward", "address1"];
      case "tax":
        return ["tinNumber"];
      case "financial":
        return ["currency"];
      case "kyc":
        return [];
      default:
        return [];
    }
  };

  const navigateToNextTab = async () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      // Validate only current tab's required fields
      const requiredFields = getTabRequiredFields(activeTab);
      let isValid = true;
      
      if (requiredFields.length > 0) {
        isValid = await trigger(requiredFields as any);
      }
      
      if (isValid) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }
  };

  const navigateToPreviousTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isFirstTab = getCurrentTabIndex() === 0;
  const isLastTab = getCurrentTabIndex() === tabs.length - 1;

  const handleFileUpload = (type: 'poa' | 'poi', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray]
      }));
    }
  };

  const removeFile = (type: 'poa' | 'poi', index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Agent Onboarding - SAP BRIM Integration</h3>
              <p className="text-sm text-blue-800">
                Complete the agent onboarding process. After submission, the system will generate an onboarding reference number and initiate SAP Business Partner creation for contract management.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">Agent Type <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={watchedFields.type} onValueChange={(value) => setValue("type", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Agent Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Sub Agent">Sub Agent</SelectItem>
                          <SelectItem value="Agent Employee">Agent Employee</SelectItem>
                          <SelectItem value="Installers">Installers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Show Parent ID field right next to Agent Type for Sub Agents and Agent Employees */}
                    {(watchedFields.type === "Sub Agent" || watchedFields.type === "Agent Employee") && (
                      <div className="flex-1">
                        <div className="flex gap-1">
                          <Input
                            id="parentId"
                            {...register("parentId")}
                            placeholder="Parent Agent ID"
                            className="mt-1"
                          />
                          <Button type="button" variant="outline" size="sm" className="mt-1 px-2 text-xs">
                            Validate
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter main agent's Business Partner ID</p>
                      </div>
                    )}
                  </div>
                  {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
                  {errors.parentId && <p className="text-sm text-red-500 mt-1">{errors.parentId.message}</p>}
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                  <Input
                    id="status"
                    value="Draft"
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="commission" className="text-sm font-medium text-gray-700">Commission Rate (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    {...register("commission")}
                    placeholder="5.00"
                    className="mt-1"
                  />
                  {errors.commission && <p className="text-sm text-red-500 mt-1">{errors.commission.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency <span className="text-red-500">*</span></Label>
                  <Select value={watchedFields.currency} onValueChange={(value) => setValue("currency", value)} disabled>
                    <SelectTrigger className="mt-1 bg-gray-50">
                      <SelectValue placeholder="Auto-selected based on country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TSH">Tanzanian Shilling (TSH)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Currency will be auto-selected based on country selection</p>
                  {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></Label>
                  <Select value={watchedFields.role} onValueChange={(value) => setValue("role", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="sub_agent">Sub Agent</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="installer">Installer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">Primary Region</Label>
                  <Select value={watchedFields.region} onValueChange={(value) => setValue("region", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                      <SelectItem value="Arusha">Arusha</SelectItem>
                      <SelectItem value="Mwanza">Mwanza</SelectItem>
                      <SelectItem value="Dodoma">Dodoma</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case "personal":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></Label>
                  <Select value={watchedFields.title} onValueChange={(value) => setValue("title", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    {...register("firstName")}
                    placeholder="Enter full name"
                    className="mt-1"
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="agent@example.com"
                    className="mt-1"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="mobile"
                    type="tel"
                    {...register("mobile")}
                    placeholder="+255 xxx xxx xxx"
                    className="mt-1"
                  />
                  {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>}
                </div>

                <div>
                  <Label htmlFor="fax" className="text-sm font-medium text-gray-700">Fax Number</Label>
                  <Input
                    id="fax"
                    {...register("fax")}
                    placeholder="Enter fax number"
                    className="mt-1"
                  />
                  {errors.fax && <p className="text-sm text-red-500 mt-1">{errors.fax.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                {/* Additional personal details can be added here if needed */}
              </div>
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country <span className="text-red-500">*</span></Label>
                  <Select value={watchedFields.country} onValueChange={(value) => {
                    setValue("country", value);
                    // Auto-set currency based on country
                    if (value === "Tanzania") setValue("currency", "TSH");
                    else if (value === "Kenya") setValue("currency", "KES");
                    else if (value === "Uganda") setValue("currency", "UGX");
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">Region *</Label>
                  <Select value={watchedFields.region} onValueChange={(value) => setValue("region", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                      <SelectItem value="Arusha">Arusha</SelectItem>
                      <SelectItem value="Mwanza">Mwanza</SelectItem>
                      <SelectItem value="Dodoma">Dodoma</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>}
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="Enter city"
                    className="mt-1"
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700">District *</Label>
                  <Input
                    id="district"
                    {...register("district")}
                    placeholder="Enter district"
                    className="mt-1"
                  />
                  {errors.district && <p className="text-sm text-red-500 mt-1">{errors.district.message}</p>}
                </div>

                <div>
                  <Label htmlFor="ward" className="text-sm font-medium text-gray-700">Ward *</Label>
                  <Input
                    id="ward"
                    {...register("ward")}
                    placeholder="Enter ward"
                    className="mt-1"
                  />
                  {errors.ward && <p className="text-sm text-red-500 mt-1">{errors.ward.message}</p>}
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal Code</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    placeholder="Enter postal code"
                    className="mt-1"
                  />
                  {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address1" className="text-sm font-medium text-gray-700">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    {...register("address1")}
                    placeholder="Enter primary address"
                    className="mt-1"
                  />
                  {errors.address1 && <p className="text-sm text-red-500 mt-1">{errors.address1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address2" className="text-sm font-medium text-gray-700">Address Line 2</Label>
                  <Input
                    id="address2"
                    {...register("address2")}
                    placeholder="Enter secondary address (optional)"
                    className="mt-1"
                  />
                  {errors.address2 && <p className="text-sm text-red-500 mt-1">{errors.address2.message}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case "tax":
        return (
          <div className="space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">Tax Information</h3>
              <p className="text-sm text-amber-800">
                <strong>TIN Number:</strong> Tax Identification Number is mandatory for agent registration. 
                Non-TIN agents will be tagged as NON-REGISTERED and may have limited functionality.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tinNumber" className="text-sm font-medium text-gray-700">TIN Number *</Label>
                  <Input
                    id="tinNumber"
                    {...register("tinNumber")}
                    placeholder="Enter TIN number"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for tax compliance</p>
                  {errors.tinNumber && <p className="text-sm text-red-500 mt-1">{errors.tinNumber.message}</p>}
                </div>

                <div>
                  <Label htmlFor="vrnNumber" className="text-sm font-medium text-gray-700">VRN Number</Label>
                  <Input
                    id="vrnNumber"
                    {...register("vrnNumber")}
                    placeholder="Enter VRN number (optional)"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">VAT Registration Number - provide if available</p>
                  {errors.vrnNumber && <p className="text-sm text-red-500 mt-1">{errors.vrnNumber.message}</p>}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Tax Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• TIN Number is mandatory for all agents</li>
                  <li>• VRN Number required for VAT-registered businesses</li>
                  <li>• Tax certificates may be required for verification</li>
                  <li>• Commission payments will be subject to applicable taxes</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "financial":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operatingCurrency" className="text-sm font-medium text-gray-700">Operating Currency <span className="text-red-500">*</span></Label>
                  <Select value={watchedFields.currency} onValueChange={(value) => setValue("currency", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Operating Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TSH">Tanzanian Shilling (TSH)</SelectItem>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="UGX">Ugandan Shilling (UGX)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Currency for agent operations and commission payments</p>
                  {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
                </div>

                <div>
                  <Label htmlFor="commission" className="text-sm font-medium text-gray-700">Commission Rate (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register("commission")}
                    placeholder="5.00"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default commission rate (can be adjusted per agreement)</p>
                  {errors.commission && <p className="text-sm text-red-500 mt-1">{errors.commission.message}</p>}
                </div>


              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">SAP BRIM Integration</h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Business Partner Creation:</strong> Automatic SAP BP creation after approval</p>
                  <p><strong>Contract Account:</strong> System will create Contract Account for billing</p>
                  <p><strong>Role Assignments:</strong> FLCU01 (Customer), FLCU00 (FI Customer), MKK (Contract Partner)</p>
                  <p><strong>Commission Structure:</strong> Configurable rate with default 5%</p>
                  <p><strong>Financial Management:</strong> Payment terms applied to commission processing</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Document Upload & Approval Process</h3>
              <p className="text-gray-600">Upload required documents for identity verification and SAP Business Partner creation approval</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kycDocId" className="text-sm font-medium text-gray-700">KYC Document ID</Label>
                  <Input
                    id="kycDocId"
                    {...register("kycDocId")}
                    placeholder="e.g., POI-001, POA-002"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Internal system reference ID for uploaded documents</p>
                  {errors.kycDocId && <p className="text-sm text-red-500 mt-1">{errors.kycDocId.message}</p>}
                </div>

                <div>
                  <Label htmlFor="kycDocNo" className="text-sm font-medium text-gray-700">KYC Document Number</Label>
                  <Input
                    id="kycDocNo"
                    {...register("kycDocNo")}
                    placeholder="e.g., NIDA-123456789, PP-A12345"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Official document number from government ID/passport</p>
                  {errors.kycDocNo && <p className="text-sm text-red-500 mt-1">{errors.kycDocNo.message}</p>}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Document ID vs Document Number</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Document ID:</strong> Internal system reference (e.g., POI-001, POA-002)</p>
                  <p><strong>Document Number:</strong> Official number from the physical document (e.g., NIDA-123456789 for National ID, PP-A12345 for Passport)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">POA (Power of Attorney) Documents <span className="text-red-500">*</span></Label>
                  <input
                    type="file"
                    id="poa-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('poa', e.target.files)}
                    className="hidden"
                  />
                  <Card 
                    className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('poa-upload')?.click()}
                  >
                    <CardContent className="p-6 text-center">
                      <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Upload POA Documents</p>
                      <p className="text-xs text-gray-500">Business license, authorization letters</p>
                    </CardContent>
                  </Card>
                  {uploadedFiles.poa.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {uploadedFiles.poa.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('poa', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">POI (Proof of Identity) Documents <span className="text-red-500">*</span></Label>
                  <input
                    type="file"
                    id="poi-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('poi', e.target.files)}
                    className="hidden"
                  />
                  <Card 
                    className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('poi-upload')?.click()}
                  >
                    <CardContent className="p-6 text-center">
                      <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Upload POI Documents</p>
                      <p className="text-xs text-gray-500">National ID, passport, driver's license</p>
                    </CardContent>
                  </Card>
                  {uploadedFiles.poi.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {uploadedFiles.poi.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile('poi', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">Required Documents</h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <p><strong>POA (Power of Attorney):</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Business License (for business agents)</li>
                      <li>• Authorization Letters</li>
                      <li>• TIN/VRN Certificates</li>
                    </ul>
                    <p><strong>POI (Proof of Identity):</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• National ID (NIDA) - mandatory</li>
                      <li>• Passport (alternative)</li>
                      <li>• Driver's License (supporting)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Preview Feature</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    Before final submission, you can preview your application and all uploaded documents to ensure accuracy.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowPreview(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Preview Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Agent Registration:</span>
              <span className="text-sm text-gray-900">General Data</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Status: Draft
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 bg-gray-50">
                <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="px-2 md:px-4 py-3 text-sm font-medium text-gray-600 bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-white rounded-none"
                      >
                        <Icon className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">{tab.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="p-6 m-0">
                  {renderTabContent()}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex space-x-3">
            {isLastTab && (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const formData = watch();
                    console.log("Saving draft:", formData);
                    // Here you could save to localStorage or call an API
                    alert("Draft saved successfully!");
                  }}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </Button>
              </>
            )}
          </div>
          
          <div className="flex space-x-3">
            {!isFirstTab && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={navigateToPreviousTab}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
            
            {!isLastTab ? (
              <Button 
                type="button" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={navigateToNextTab}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  console.log("Submit button clicked");
                  console.log("Form errors:", errors);
                  console.log("Form values:", watchedFields);
                }}
              >
                {isLoading ? "Processing..." : "Submit for SAP BP Creation"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Registration Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">General Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Type:</strong> {watchedFields.type || "Not specified"}</p>
                  <p><strong>Role:</strong> {watchedFields.role || "Not specified"}</p>
                  <p><strong>Currency:</strong> {watchedFields.currency}</p>
                  <p><strong>Commission:</strong> {watchedFields.commission}%</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Details</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {watchedFields.firstName} {watchedFields.lastName}</p>
                  <p><strong>Email:</strong> {watchedFields.email}</p>
                  <p><strong>Phone:</strong> {watchedFields.phone}</p>
                  <p><strong>Mobile:</strong> {watchedFields.mobile}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Country:</strong> {watchedFields.country}</p>
                  <p><strong>Region:</strong> {watchedFields.region}</p>
                  <p><strong>City:</strong> {watchedFields.city}</p>
                  <p><strong>Address:</strong> {watchedFields.address1}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tax Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>TIN Number:</strong> {watchedFields.tinNumber}</p>
                  <p><strong>VRN Number:</strong> {watchedFields.vrnNumber || "Not provided"}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">POA Documents ({uploadedFiles.poa.length})</p>
                  {uploadedFiles.poa.map((file, index) => (
                    <p key={index} className="text-xs text-gray-600">• {file.name}</p>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">POI Documents ({uploadedFiles.poi.length})</p>
                  {uploadedFiles.poi.map((file, index) => (
                    <p key={index} className="text-xs text-gray-600">• {file.name}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}