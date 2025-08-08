import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Mail, 
  RotateCcw, 
  Send, 
  Search, 
  BookOpen,
  Monitor,
  User,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Schema based on UI specification
const newIncidentSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  commonFaults: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub Category is required'),
  status: z.string().default('OPEN'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  userId: z.string().min(1, 'User ID is required'),
  configurationItem: z.string().min(1, 'Configuration Item is required'),
  assignmentGroup: z.string().min(1, 'Assignment Group is required'),
  assignedTo: z.string().optional(),
  channel: z.string().default('Others'),
  alternateLocation: z.string().optional(),
  alternateContact: z.string().optional(),
  shortDescription: z.string().min(1, 'Short Description is required'),
  additionalComments: z.string().min(1, 'Additional Comments is required'),
});

type FormData = z.infer<typeof newIncidentSchema>;

// Options from specification
const clientOptions = [
  { value: 'azam-digital-services', label: 'Azam Digital Services' },
  { value: 'azam-tv-operations', label: 'Azam TV Operations' },
  { value: 'azam-media-group', label: 'Azam Media Group' },
];

const commonFaultsOptions = [
  { value: 'hardware-failure', label: 'Hardware Failure' },
  { value: 'software-issue', label: 'Software Issue' },
  { value: 'network-connectivity', label: 'Network Connectivity' },
  { value: 'user-access-issue', label: 'User Access Issue' },
  { value: 'system-performance', label: 'System Performance' },
];

const categoryOptions = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'software', label: 'Software' },
  { value: 'network', label: 'Network' },
  { value: 'security', label: 'Security' },
  { value: 'access', label: 'Access' },
];

const subCategoryMap = {
  hardware: [
    { value: 'server-hardware', label: 'Server Hardware' },
    { value: 'workstation', label: 'Workstation' },
    { value: 'network-equipment', label: 'Network Equipment' },
  ],
  software: [
    { value: 'application-software', label: 'Application Software' },
    { value: 'operating-system', label: 'Operating System' },
    { value: 'database', label: 'Database' },
  ],
  network: [
    { value: 'connectivity', label: 'Connectivity' },
    { value: 'performance', label: 'Performance' },
    { value: 'configuration', label: 'Configuration' },
  ],
  security: [
    { value: 'access-control', label: 'Access Control' },
    { value: 'malware', label: 'Malware' },
    { value: 'data-breach', label: 'Data Breach' },
  ],
  access: [
    { value: 'account-lockout', label: 'Account Lockout' },
    { value: 'password-reset', label: 'Password Reset' },
    { value: 'permissions', label: 'Permissions' },
  ],
};

const priorityOptions = [
  { value: 'Low', label: 'Low', sla: '7 days' },
  { value: 'Medium', label: 'Medium', sla: '3 days' },
  { value: 'High', label: 'High', sla: '1 day' },
  { value: 'Critical', label: 'Critical', sla: '4 hours' },
];

const channelOptions = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Email', label: 'Email' },
  { value: 'Portal', label: 'Portal' },
  { value: 'Walk-in', label: 'Walk-in' },
  { value: 'Others', label: 'Others' },
];

const assignmentGroups = [
  { value: 'SERVICE_DESK_LEVEL_1', label: 'SERVICE DESK LEVEL 1' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
  { value: 'NETWORK_OPERATIONS', label: 'Network Operations' },
  { value: 'FIELD_SERVICES', label: 'Field Services' },
  { value: 'APPLICATION_SUPPORT', label: 'Application Support' },
];

export default function NewIncidentManagement() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [showKBSearch, setShowKBSearch] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(newIncidentSchema),
    defaultValues: {
      status: 'OPEN',
      channel: 'Others',
      priority: 'Medium',
    },
  });

  // Auto-populate opened timestamp and user info
  const [currentUser] = useState({
    id: 'USER001',
    name: 'Service Desk Agent',
    location: 'Dar es Salaam HQ',
    contact: '+255 712 345 678'
  });

  const [openedTimestamp] = useState(new Date());

  // Calculate target resolve date based on priority
  const calculateTargetDate = (priority: string) => {
    const targetDate = new Date();
    switch (priority) {
      case 'Critical':
        targetDate.setHours(targetDate.getHours() + 4);
        break;
      case 'High':
        targetDate.setDate(targetDate.getDate() + 1);
        break;
      case 'Medium':
        targetDate.setDate(targetDate.getDate() + 3);
        break;
      case 'Low':
        targetDate.setDate(targetDate.getDate() + 7);
        break;
      default:
        targetDate.setDate(targetDate.getDate() + 3);
    }
    return targetDate;
  };

  const [targetResolveDate, setTargetResolveDate] = useState(calculateTargetDate('Medium'));

  // Generate auto-incrementing incident number
  const [incidentNumber] = useState(() => `INC0000173`);

  // Mock user search
  const userSearchResults = [
    { id: 'U001', name: 'John Doe', location: 'Dar es Salaam', contact: '+255 712 111 111' },
    { id: 'U002', name: 'Mary Smith', location: 'Arusha', contact: '+255 712 222 222' },
    { id: 'U003', name: 'Ahmed Hassan', location: 'Mwanza', contact: '+255 712 333 333' },
  ].filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Mock asset search
  const assetSearchResults = [
    { id: 'ASSET001', name: 'Production Server 01', type: 'Server' },
    { id: 'ASSET002', name: 'Network Switch 01', type: 'Network Equipment' },
    { id: 'ASSET003', name: 'Workstation 01', type: 'Computer' },
  ].filter(asset => 
    asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(assetSearchQuery.toLowerCase())
  );

  // Create incident mutation
  const createIncidentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          incidentNumber,
          openedBy: currentUser.id,
          opened: openedTimestamp,
          targetResolveDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create incident');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Incident ${incidentNumber} has been created successfully.`,
      });
      form.reset();
      setHasUnsavedChanges(false);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create incident. Please try again.',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    createIncidentMutation.mutate(data);
  };

  // Handle form reset
  const handleReset = () => {
    form.reset();
    setSelectedCategory('');
    setSelectedUser(null);
    setUserSearchQuery('');
    setAssetSearchQuery('');
    setHasUnsavedChanges(false);
  };

  // Watch for form changes to detect unsaved changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change') {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Update target resolve date when priority changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'priority' && value.priority) {
        setTargetResolveDate(calculateTargetDate(value.priority));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header Bar - Consolidated Single Bar */}
      <div className="bg-white border-b border-gray-300 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-gray-700">
                AzamTV Service Desk - New Incident
              </div>
              <div className="text-sm text-gray-500 ml-4">
                Incident #: <strong>{incidentNumber}</strong>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                type="submit" 
                disabled={createIncidentMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 h-8 text-sm"
              >
                <Send className="h-3 w-3 mr-1" />
                {createIncidentMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="border-gray-400 text-gray-700 px-4 py-1.5 h-8 text-sm"
                onClick={handleReset}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container - Centered horizontally */}
      <div className="w-full flex justify-center">
        <div className="max-w-5xl w-full p-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Toolbar */}


              {/* Form Content - Two Column Layout, compact */}
              <div className="bg-white border border-gray-300 shadow-sm">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column - Incident Details */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                        Incident Details
                      </h3>

                      {/* Number */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Number</label>
                        <div className="col-span-3">
                          <Input 
                            value={incidentNumber} 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Client */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Client <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="client"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {clientOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Common Faults */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">Common Faults</label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="commonFaults"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {commonFaultsOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedCategory(value);
                                    form.setValue('subCategory', '');
                                  }} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categoryOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Sub Category */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Sub Category <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="subCategory"
                            render={({ field }) => (
                              <FormItem>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  disabled={!selectedCategory}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {selectedCategory && subCategoryMap[selectedCategory as keyof typeof subCategoryMap]?.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* State */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">State</label>
                        <div className="col-span-3">
                          <Input 
                            value="OPEN" 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Opened */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Opened</label>
                        <div className="col-span-3">
                          <Input 
                            value={openedTimestamp.toLocaleDateString() + ' 16:17'} 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Target Resolve Date */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Target Resolve Date</label>
                        <div className="col-span-3">
                          <Input 
                            value={targetResolveDate.toLocaleDateString()} 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Alternate Location */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">Alternate Location</label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="alternateLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="h-7 text-xs"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* White Board ID */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">White Board ID</label>
                        <div className="col-span-3">
                          <Input 
                            value="" 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Assignment & Contact */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                        Assignment & Contact
                      </h3>

                      {/* Opened by */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Opened by</label>
                        <div className="col-span-3">
                          <Input 
                            value="User ID" 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* User ID */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          User ID <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                              <FormItem>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="Search users..."
                                      className="h-7 text-xs pr-8"
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setUserSearchQuery(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <Search className="h-3 w-3 absolute right-2 top-2 text-gray-400" />
                                  {userSearchQuery && userSearchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-24 overflow-y-auto">
                                      {userSearchResults.map((user) => (
                                        <button
                                          key={user.id}
                                          type="button"
                                          className="w-full text-left px-2 py-1.5 hover:bg-gray-100 flex items-center text-xs"
                                          onClick={() => {
                                            field.onChange(user.id);
                                            setSelectedUser(user);
                                            setUserSearchQuery('');
                                          }}
                                        >
                                          <User className="h-3 w-3 mr-2" />
                                          <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.id}</div>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Location</label>
                        <div className="col-span-3">
                          <Input 
                            value={selectedUser?.location || currentUser.location} 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Contact Number */}
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <label className="text-xs text-gray-600">Contact Number</label>
                        <div className="col-span-3">
                          <Input 
                            value={selectedUser?.contact || currentUser.contact} 
                            disabled 
                            className="h-7 bg-gray-50 text-xs"
                          />
                        </div>
                      </div>

                      {/* Configuration Item */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Configuration Item <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="configurationItem"
                            render={({ field }) => (
                              <FormItem>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="Search assets..."
                                      className="h-7 text-xs pr-8"
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setAssetSearchQuery(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                  <Monitor className="h-3 w-3 absolute right-2 top-2 text-gray-400" />
                                  {assetSearchQuery && assetSearchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-24 overflow-y-auto">
                                      {assetSearchResults.map((asset) => (
                                        <button
                                          key={asset.id}
                                          type="button"
                                          className="w-full text-left px-2 py-1.5 hover:bg-gray-100 flex items-center text-xs"
                                          onClick={() => {
                                            field.onChange(asset.id);
                                            setAssetSearchQuery('');
                                          }}
                                        >
                                          <Monitor className="h-3 w-3 mr-2" />
                                          <div>
                                            <div className="font-medium">{asset.name}</div>
                                            <div className="text-xs text-gray-500">{asset.id}</div>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Priority <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {priorityOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Assignment Group */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">
                          Assignment Group <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="assignmentGroup"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue placeholder="Please Specify" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {assignmentGroups.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Assigned To */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">Assigned To</label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="assignedTo"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="h-7 text-xs"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Channel */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">Channel</label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="channel"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {channelOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="text-xs">
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Alternate Contact */}
                      <div className="grid grid-cols-4 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5">Alternate Contact</label>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="alternateContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="h-7 text-xs"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Width Description Fields */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      {/* Short Description */}
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5 col-span-2">
                          Short Description <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-10">
                          <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center space-x-2">
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      placeholder="Brief summary of the issue"
                                      className="h-7 text-xs flex-1"
                                    />
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setShowKBSearch(!showKBSearch)}
                                  >
                                    <BookOpen className="h-3 w-3" />
                                  </Button>
                                </div>
                                {showKBSearch && (
                                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="text-sm text-blue-800">
                                      💡 Knowledge Base Suggestions: Network troubleshooting, Software issues, Hardware diagnostics
                                    </div>
                                  </div>
                                )}
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional Comments */}
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <label className="text-xs text-gray-600 pt-1.5 col-span-2">
                          Additional Comments <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-10">
                          <FormField
                            control={form.control}
                            name="additionalComments"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    rows={4}
                                    placeholder="Detailed description of the issue, steps to reproduce, error messages, etc."
                                    className="text-xs resize-none"
                                  />
                                </FormControl>
                                <div className="text-right mt-1">
                                  <span className="text-xs text-gray-500">✓ Check Spelling</span>
                                </div>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </form>
          </Form>

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-400 rounded-lg p-3 shadow-lg z-50">
              <div className="text-sm text-amber-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                You have unsaved changes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}