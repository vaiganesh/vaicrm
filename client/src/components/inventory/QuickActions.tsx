import { TrendingUp, Plus, ArrowLeftRight, Search, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onModuleClick: (moduleId: string) => void;
}

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => (
  <Button 
    variant="outline" 
    className="h-auto p-3 flex flex-col items-center gap-2"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    <span className="text-xs">{label}</span>
  </Button>
);

export const QuickActions = ({ onModuleClick }: QuickActionsProps) => {
  const actionItems = [
    {
      icon: Plus,
      label: "New Request",
      moduleId: "stock-request"
    },
    {
      icon: ArrowLeftRight,
      label: "Transfer Stock",
      moduleId: "stock-transfer"
    },
    {
      icon: Search,
      label: "Track Serial",
      moduleId: "track-serial"
    },
    {
      icon: CheckCircle,
      label: "Approve Requests",
      moduleId: "stock-approval"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#238fb7]" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actionItems.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={() => onModuleClick(action.moduleId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};