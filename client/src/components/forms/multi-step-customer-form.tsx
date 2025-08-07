import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudUpload, User, MapPin, Settings, CreditCard, Upload, FileText, Building, Banknote, Hash, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { z } from "zod";

type CustomerFormData = z.infer<typeof insertCustomerSchema>;

interface MultiStepCustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CustomerFormData>;
}

const tabs = [
  { id: "general", name: "General Data", icon: User },
  { id: "personal", name: "Personal Details", icon: FileText },
  { id: "address", name: "Address Details", icon: MapPin },
  { id: "service", name: "Service Settings", icon: Settings },
  { id: "financial", name: "Financial & Tax", icon: Banknote },
  { id: "kyc", name: "KYC Documents", icon: Upload },
  { id: "preview", name: "Preview", icon: Eye }
];

export default function MultiStepCustomerForm({ onSubmit, isLoading, defaultValues }: MultiStepCustomerFormProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      customerType: "Individual",
      addressType: "Billing",
      currency: "TSH",
      smsFlag: true,
      connectionType: "Prepaid",
      ...defaultValues,
    },
    mode: "onChange"
  });

  const watchedFields = watch();

  const handleFormSubmit = async (data: CustomerFormData) => {
    onSubmit(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentTabIndex = () => {
    return tabs.findIndex(tab => tab.id === activeTab);
  };

  const goToNextTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isLastTab = () => {
    return getCurrentTabIndex() === tabs.length - 1;
  };

  const isFirstTab = () => {
    return getCurrentTabIndex() === 0;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Customer Registration Form</h3>
              <p className="text-sm text-blue-800">
                Complete the customer registration process by filling in all required information across the tabs below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerType" className="text-sm font-medium text-gray-700">Customer Type *</Label>
                  <Select value={watchedFields.customerType} onValueChange={(value) => setValue("customerType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.customerType && <p className="text-sm text-red-500 mt-1">{errors.customerType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="newOrExisting" className="text-sm font-medium text-gray-700">Customer Status *</Label>
                  <Select value={watchedFields.newOrExisting} onValueChange={(value) => setValue("newOrExisting", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Customer Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New Customer</SelectItem>
                      <SelectItem value="Existing">Existing Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.newOrExisting && <p className="text-sm text-red-500 mt-1">{errors.newOrExisting.message}</p>}
                </div>

                {watchedFields.newOrExisting === "Existing" && (
                  <div>
                    <Label htmlFor="parentCustomerId" className="text-sm font-medium text-gray-700">Parent Customer ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="parentCustomerId"
                        type="number"
                        {...register("parentCustomerId")}
                        placeholder="Enter parent customer ID"
                        className="mt-1"
                      />
                      <Button type="button" variant="outline" className="mt-1">
                        Validate
                      </Button>
                    </div>
                    {errors.parentCustomerId && <p className="text-sm text-red-500 mt-1">{errors.parentCustomerId.message}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountClass" className="text-sm font-medium text-gray-700">Account Class *</Label>
                  <Select value={watchedFields.accountClass} onValueChange={(value) => setValue("accountClass", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Account Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Hotels">Hotels</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Demo">Demo</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.accountClass && <p className="text-sm text-red-500 mt-1">{errors.accountClass.message}</p>}
                </div>

                <div>
                  <Label htmlFor="connectionType" className="text-sm font-medium text-gray-700">Connection Type *</Label>
                  <Select value={watchedFields.connectionType} onValueChange={(value) => setValue("connectionType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Connection Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Postpaid">Postpaid</SelectItem>
                      <SelectItem value="Prepaid">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.connectionType && <p className="text-sm text-red-500 mt-1">{errors.connectionType.message}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsFlag"
                    checked={watchedFields.smsFlag}
                    onCheckedChange={(checked) => setValue("smsFlag", checked)}
                  />
                  <Label htmlFor="smsFlag" className="text-sm font-medium text-gray-700">Enable SMS Notifications</Label>
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
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</Label>
                  <Select value={watchedFields.title} onValueChange={(value) => setValue("title", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                      <SelectItem value="Prof">Prof</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter first name"
                    className="mt-1"
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">Middle Name</Label>
                  <Input
                    id="middleName"
                    {...register("middleName")}
                    placeholder="Enter middle name"
                    className="mt-1"
                  />
                  {errors.middleName && <p className="text-sm text-red-500 mt-1">{errors.middleName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
                  <Select value={watchedFields.gender} onValueChange={(value) => setValue("gender", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className="mt-1"
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
                </div>

                <div>
                  <Label htmlFor="race" className="text-sm font-medium text-gray-700">Race *</Label>
                  <Select value={watchedFields.race} onValueChange={(value) => setValue("race", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Race" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="African">African</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="European">European</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.race && <p className="text-sm text-red-500 mt-1">{errors.race.message}</p>}
                </div>

                <div>
                  <Label htmlFor="orgName" className="text-sm font-medium text-gray-700">Organization Name</Label>
                  <Input
                    id="orgName"
                    {...register("orgName")}
                    placeholder="Enter organization name"
                    className="mt-1"
                  />
                  {errors.orgName && <p className="text-sm text-red-500 mt-1">{errors.orgName.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+255 xxx xxx xxx"
                    className="mt-1"
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="altPhone" className="text-sm font-medium text-gray-700">Alternative Phone</Label>
                  <Input
                    id="altPhone"
                    type="tel"
                    {...register("altPhone")}
                    placeholder="+255 xxx xxx xxx"
                    className="mt-1"
                  />
                  {errors.altPhone && <p className="text-sm text-red-500 mt-1">{errors.altPhone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number *</Label>
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
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="customer@example.com"
                    className="mt-1"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="altEmail" className="text-sm font-medium text-gray-700">Alternative Email</Label>
                  <Input
                    id="altEmail"
                    type="email"
                    {...register("altEmail")}
                    placeholder="alternate@example.com"
                    className="mt-1"
                  />
                  {errors.altEmail && <p className="text-sm text-red-500 mt-1">{errors.altEmail.message}</p>}
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
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Installation Address</h3>
              <p className="text-sm text-blue-800">
                Enter the installation address details where the service will be installed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="addressType" className="text-sm font-medium text-gray-700">Address Type *</Label>
                  <Select value={watchedFields.addressType} onValueChange={(value) => setValue("addressType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Address Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Installation">Installation</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.addressType && <p className="text-sm text-red-500 mt-1">{errors.addressType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                  <Select value={watchedFields.country} onValueChange={(value) => setValue("country", value)}>
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

            {/* Billing Address Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">Billing Address</h3>
              <p className="text-sm text-amber-800">
                Enter the billing address details where invoices will be sent.
              </p>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Switch
                id="sameAsInstallation"
                checked={watchedFields.sameAsInstallation}
                onCheckedChange={(checked) => setValue("sameAsInstallation", checked)}
              />
              <Label htmlFor="sameAsInstallation" className="text-sm font-medium text-gray-700">
                Same as Installation Address
              </Label>
            </div>

            {!watchedFields.sameAsInstallation && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingCountry" className="text-sm font-medium text-gray-700">Country</Label>
                    <Select value={watchedFields.billingCountry} onValueChange={(value) => setValue("billingCountry", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.billingCountry && <p className="text-sm text-red-500 mt-1">{errors.billingCountry.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billingRegion" className="text-sm font-medium text-gray-700">Region</Label>
                    <Select value={watchedFields.billingRegion} onValueChange={(value) => setValue("billingRegion", value)}>
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
                    {errors.billingRegion && <p className="text-sm text-red-500 mt-1">{errors.billingRegion.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billingCity" className="text-sm font-medium text-gray-700">City</Label>
                    <Input
                      id="billingCity"
                      {...register("billingCity")}
                      placeholder="Enter city"
                      className="mt-1"
                    />
                    {errors.billingCity && <p className="text-sm text-red-500 mt-1">{errors.billingCity.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingDistrict" className="text-sm font-medium text-gray-700">District</Label>
                    <Input
                      id="billingDistrict"
                      {...register("billingDistrict")}
                      placeholder="Enter district"
                      className="mt-1"
                    />
                    {errors.billingDistrict && <p className="text-sm text-red-500 mt-1">{errors.billingDistrict.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billingWard" className="text-sm font-medium text-gray-700">Ward</Label>
                    <Input
                      id="billingWard"
                      {...register("billingWard")}
                      placeholder="Enter ward"
                      className="mt-1"
                    />
                    {errors.billingWard && <p className="text-sm text-red-500 mt-1">{errors.billingWard.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billingPostalCode" className="text-sm font-medium text-gray-700">Postal Code</Label>
                    <Input
                      id="billingPostalCode"
                      {...register("billingPostalCode")}
                      placeholder="Enter postal code"
                      className="mt-1"
                    />
                    {errors.billingPostalCode && <p className="text-sm text-red-500 mt-1">{errors.billingPostalCode.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingAddress1" className="text-sm font-medium text-gray-700">Address Line 1</Label>
                    <Input
                      id="billingAddress1"
                      {...register("billingAddress1")}
                      placeholder="Enter primary address"
                      className="mt-1"
                    />
                    {errors.billingAddress1 && <p className="text-sm text-red-500 mt-1">{errors.billingAddress1.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="billingAddress2" className="text-sm font-medium text-gray-700">Address Line 2</Label>
                    <Input
                      id="billingAddress2"
                      {...register("billingAddress2")}
                      placeholder="Enter secondary address (optional)"
                      className="mt-1"
                    />
                    {errors.billingAddress2 && <p className="text-sm text-red-500 mt-1">{errors.billingAddress2.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "service":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700">Service Type *</Label>
                  <Select value={watchedFields.serviceType} onValueChange={(value) => setValue("serviceType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DTT">DTT (Digital Terrestrial TV)</SelectItem>
                      <SelectItem value="DTH">DTH (Direct to Home)</SelectItem>
                      <SelectItem value="OTT">OTT (Azam Max)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-sm text-red-500 mt-1">{errors.serviceType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="azamPayId" className="text-sm font-medium text-gray-700">Azam Pay ID</Label>
                  <Input
                    id="azamPayId"
                    {...register("azamPayId")}
                    placeholder="Enter Azam Pay ID"
                    className="mt-1"
                  />
                  {errors.azamPayId && <p className="text-sm text-red-500 mt-1">{errors.azamPayId.message}</p>}
                </div>

                <div>
                  <Label htmlFor="azamMaxTvId" className="text-sm font-medium text-gray-700">Azam Max TV ID</Label>
                  <Input
                    id="azamMaxTvId"
                    {...register("azamMaxTvId")}
                    placeholder="Enter Azam Max TV ID"
                    className="mt-1"
                  />
                  {errors.azamMaxTvId && <p className="text-sm text-red-500 mt-1">{errors.azamMaxTvId.message}</p>}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Service Information</h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>DTT:</strong> Digital Terrestrial Television service</p>
                  <p><strong>DTH:</strong> Direct to Home satellite service</p>
                  <p><strong>OTT:</strong> Over-the-Top streaming service (Azam Max)</p>
                  <hr className="my-3 border-blue-200" />
                  <p><strong>Account Classes:</strong></p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Residential: Home users</li>
                    <li>Commercial: Business customers</li>
                    <li>VIP: Premium service customers</li>
                    <li>Corporate: Large enterprise customers</li>
                  </ul>
                </div>
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
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency *</Label>
                  <Select value={watchedFields.currency} onValueChange={(value) => setValue("currency", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TSH">Tanzanian Shilling (TSH)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>}
                </div>

                <div>
                  <Label htmlFor="tinNumber" className="text-sm font-medium text-gray-700">TIN Number</Label>
                  <Input
                    id="tinNumber"
                    {...register("tinNumber")}
                    placeholder="Enter TIN number"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tax Identification Number</p>
                  {errors.tinNumber && <p className="text-sm text-red-500 mt-1">{errors.tinNumber.message}</p>}
                </div>

                <div>
                  <Label htmlFor="vrnNumber" className="text-sm font-medium text-gray-700">VRN Number</Label>
                  <Input
                    id="vrnNumber"
                    {...register("vrnNumber")}
                    placeholder="Enter VRN number"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">VAT Registration Number</p>
                  {errors.vrnNumber && <p className="text-sm text-red-500 mt-1">{errors.vrnNumber.message}</p>}
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-3">Financial Information</h4>
                <div className="text-sm text-amber-800 space-y-2">
                  <p><strong>Currency:</strong> All transactions will be processed in the selected currency</p>
                  <p><strong>TIN Number:</strong> Required for business customers and large transactions</p>
                  <p><strong>VRN Number:</strong> Required for VAT-registered customers</p>
                  <p><strong>Payment Methods:</strong> Mobile money, bank transfer, cash, credit card</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Document Upload</h3>
              <p className="text-gray-600">Upload required documents for identity verification and compliance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardContent className="p-8 text-center">
                      <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">Upload Documents</p>
                      <p className="text-sm text-gray-500 mb-4">Drag & drop files here or click to browse</p>
                      <p className="text-xs text-gray-500">Supported: PDF, JPG, PNG (max 10MB each)</p>
                    </CardContent>
                  </Card>
                </label>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">Required Documents</h4>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>✓ National ID or Passport (mandatory)</li>
                    <li>✓ Proof of Address (utility bill or bank statement)</li>
                    <li>✓ Business License (for organization customers)</li>
                    <li>✓ Tax Certificate (for business customers)</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Important Note</h4>
                  <p className="text-sm text-amber-800">
                    After submission, your application will be reviewed within 1-2 business days. 
                    You'll receive a confirmation email with your customer reference number.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Preview</h3>
              <p className="text-gray-600">Review all information before submitting your application</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Customer Type:</span>
                    <span>{watchedFields.customerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span>{watchedFields.newOrExisting}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account Class:</span>
                    <span>{watchedFields.accountClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Connection Type:</span>
                    <span>{watchedFields.connectionType}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{watchedFields.title} {watchedFields.firstName} {watchedFields.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Gender:</span>
                    <span>{watchedFields.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{watchedFields.dateOfBirth ? new Date(watchedFields.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{watchedFields.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mobile:</span>
                    <span>{watchedFields.mobile}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{watchedFields.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Region:</span>
                    <span>{watchedFields.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">District:</span>
                    <span>{watchedFields.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Address:</span>
                    <span>{watchedFields.address1} {watchedFields.address2}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial & Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Currency:</span>
                    <span>{watchedFields.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Service Type:</span>
                    <span>{watchedFields.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">TIN Number:</span>
                    <span>{watchedFields.tinNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">VRN Number:</span>
                    <span>{watchedFields.vrnNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Azam Pay ID:</span>
                    <span>{watchedFields.azamPayId || 'Not provided'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <Upload className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
              <span className="text-sm font-medium text-gray-700">Customer Registration:</span>
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
            {!isFirstTab() && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousTab}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
            {activeTab === "preview" ? (
              <Button type="submit" disabled={isLoading} size="sm" className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            ) : (
              <Button 
                type="button" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                onClick={goToNextTab}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}