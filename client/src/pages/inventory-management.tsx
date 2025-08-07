import { useState } from "react";
import { 
  Filter,
  BarChart3,
  Download,
  Upload,
  Settings,
  ArrowLeftRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import { inventoryModules, getUniqueCategories, getModuleById } from "@/components/inventory/InventoryModules";
import { QuickStats } from "@/components/inventory/QuickStats";
import { QuickActions } from "@/components/inventory/QuickActions";
import { ModuleCard } from "@/components/inventory/ModuleCard";
import { useInventoryData, useInventoryRequests, useDashboardStats } from "@/hooks/useInventoryData";

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [currentUserRole] = useState("admin"); // Can be: agent, finance, admin, warehouse_manager
  const { toast } = useToast();

  // Use refactored hooks for data fetching
  const { data: inventoryData, isLoading: inventoryLoading } = useInventoryData();
  const { data: inventoryRequests, isLoading: requestsLoading } = useInventoryRequests();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

  const categories = getUniqueCategories();
  const priorities = ["high", "medium", "low"];

  // Role-Based Access Control Helper
  const hasAccess = (moduleId: string): boolean => {
    const restrictedModules = {
      "stock-approval": ["admin", "warehouse_manager", "finance"],
      "po-grn-update": ["admin", "warehouse_manager"],
      "po-view": ["admin", "warehouse_manager", "finance"],
      "block-unblock-agent": ["admin"],
      "block-unblock-center": ["admin"],
    };
    
    const allowedRoles = restrictedModules[moduleId as keyof typeof restrictedModules];
    return !allowedRoles || allowedRoles.includes(currentUserRole);
  };

  const filteredModules = inventoryModules.filter(module => {
    // Apply role-based access control
    if (!hasAccess(module.id)) return false;
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || module.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleModuleClick = (moduleId: string) => {
    const module = getModuleById(moduleId);
    
    if (module) {
      if (expandedModule === moduleId) {
        setExpandedModule(null); // Collapse if already expanded
      } else {
        setExpandedModule(moduleId); // Expand the module
        setActiveModule(moduleId);
        
        // Auto scroll to the expanded module after a short delay to allow for rendering
        setTimeout(() => {
          const expandedElement = document.getElementById(`module-${moduleId}`);
          if (expandedElement) {
            expandedElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
      
      toast({
        title: expandedModule === moduleId ? `Closing ${module.title}` : `Opening ${module.title}`,
        description: module.subtitle,
      });
    }
  };

  // Default module content component for modules under development
  const DefaultModuleContent = ({ moduleId }: { moduleId: string }) => {
    const module = getModuleById(moduleId);
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {module?.icon && <module.icon className="h-5 w-5" />}
            {module?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-4">
              {module?.icon && <module.icon className="h-12 w-12 mx-auto text-gray-400" />}
            </div>
            <h3 className="font-semibold text-lg mb-2">{module?.title}</h3>
            <p className="text-gray-600 mb-4">{module?.subtitle}</p>
            <Badge className="mb-4">{module?.category}</Badge>
            <p className="text-sm text-gray-500">This module is under development and will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderModuleContent = (moduleId: string) => {
    // For now, all modules show the default content
    // Individual module components can be implemented separately
    return <DefaultModuleContent moduleId={moduleId} />;
  };

  if (inventoryLoading || requestsLoading || statsLoading) {
    return (
      <div className="p-4 sm:p-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading inventory data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inventory Management Center
          </h1>
          <p className="text-gray-600">
            Comprehensive inventory operations and management dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" className="bg-[#238fb7] hover:bg-[#181c4c]">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats 
        inventoryData={inventoryData || []}
        inventoryRequests={inventoryRequests || []}
        dashboardStats={dashboardStats}
      />

      {/* Quick Actions */}
      <QuickActions onModuleClick={handleModuleClick} />

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#238fb7]" />
            Search & Filter Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Modules</label>
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedPriority("all");
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredModules.length} of {inventoryModules.length} modules
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {selectedPriority !== "all" && ` with ${selectedPriority} priority`}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active Data</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="space-y-4">
            {expandedModule ? (
              // When a module is expanded, show it full width
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className={expandedModule === module.id ? "w-full" : "hidden"}>
                    <ModuleCard 
                      module={module}
                      isActive={activeModule === module.id}
                      isExpanded={expandedModule === module.id}
                      onModuleClick={handleModuleClick}
                    >
                      {renderModuleContent(module.id)}
                    </ModuleCard>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setExpandedModule(null)}
                    className="mb-4"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Show All Modules
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-50">
                    {filteredModules.filter(m => m.id !== expandedModule).map((module) => (
                      <ModuleCard 
                        key={module.id}
                        module={module}
                        isActive={activeModule === module.id}
                        isExpanded={false}
                        onModuleClick={handleModuleClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Normal grid view when nothing is expanded
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredModules.map((module) => (
                  <ModuleCard 
                    key={module.id}
                    module={module}
                    isActive={activeModule === module.id}
                    isExpanded={expandedModule === module.id}
                    onModuleClick={handleModuleClick}
                  >
                    {expandedModule === module.id && renderModuleContent(module.id)}
                  </ModuleCard>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="category">
          <div className="space-y-8">
            {expandedModule ? (
              // When a module is expanded, show it full width
              <div className="space-y-4">
                {filteredModules.map((module) => (
                  <div key={module.id} className={expandedModule === module.id ? "w-full" : "hidden"}>
                    <ModuleCard 
                      module={module}
                      isActive={activeModule === module.id}
                      isExpanded={expandedModule === module.id}
                      onModuleClick={handleModuleClick}
                    >
                      {renderModuleContent(module.id)}
                    </ModuleCard>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setExpandedModule(null)}
                    className="mb-4"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Show All Categories
                  </Button>
                  <div className="space-y-8 opacity-50">
                    {categories.map(category => {
                      const categoryModules = filteredModules.filter(m => m.category === category);
                      if (categoryModules.length === 0) return null;
                      
                      return (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-[#238fb7]" />
                            {category}
                            <Badge variant="secondary" className="ml-2">
                              {categoryModules.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {categoryModules.filter(m => m.id !== expandedModule).map((module) => (
                              <ModuleCard 
                                key={module.id}
                                module={module}
                                isActive={activeModule === module.id}
                                isExpanded={false}
                                onModuleClick={handleModuleClick}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Normal category view when nothing is expanded
              <div className="space-y-8">
                {categories.map(category => {
                  const categoryModules = filteredModules.filter(m => m.category === category);
                  if (categoryModules.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#238fb7]" />
                        {category}
                        <Badge variant="secondary" className="ml-2">
                          {categoryModules.length}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categoryModules.map((module) => (
                          <ModuleCard 
                            key={module.id}
                            module={module}
                            isActive={activeModule === module.id}
                            isExpanded={expandedModule === module.id}
                            onModuleClick={handleModuleClick}
                          >
                            {expandedModule === module.id && renderModuleContent(module.id)}
                          </ModuleCard>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Search className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No modules found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find the modules you're looking for.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedPriority("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}