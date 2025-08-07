import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type InventoryModule } from "./InventoryModules";

interface ModuleCardProps {
  module: InventoryModule;
  isActive: boolean;
  isExpanded: boolean;
  onModuleClick: (moduleId: string) => void;
  children?: React.ReactNode;
}

// Utility functions for styling
const getColorClasses = (color: string, isActive: boolean): string => {
  const baseClasses = "text-white";
  
  if (isActive) {
    return `bg-[#238fb7] ${baseClasses}`;
  }
  
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600"
  };
  
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

const getPriorityBadgeColor = (priority: string): string => {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };
  
  return priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium;
};

export const ModuleCard = ({ 
  module, 
  isActive, 
  isExpanded, 
  onModuleClick, 
  children 
}: ModuleCardProps) => {
  const Icon = module.icon;
  
  return (
    <div id={`module-${module.id}`}>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
          isActive ? 'border-[#238fb7] shadow-lg' : 'border-gray-200 hover:border-[#238fb7]/50'
        }`}
        onClick={() => onModuleClick(module.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${getColorClasses(module.color, isActive)}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-end gap-1">
              {module.hasData && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Active Data"></div>
              )}
              <Badge 
                variant="secondary" 
                className={`text-xs ${getPriorityBadgeColor(module.priority)}`}
              >
                {module.priority}
              </Badge>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
              {module.title}
            </h3>
            <p className="text-xs text-gray-600 leading-tight">
              {module.subtitle}
            </p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {module.category}
            </span>
            {isExpanded ? (
              <Badge variant="outline" className="text-xs">Expanded</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Click to expand</Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isExpanded && children && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};