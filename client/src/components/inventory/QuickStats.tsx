import { Package2, Clock, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
  inventoryData: any[];
  inventoryRequests: any[];
  dashboardStats: any;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  iconColor: string;
}

const StatCard = ({ title, value, icon: Icon, iconColor }: StatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </CardContent>
  </Card>
);

export const QuickStats = ({ inventoryData, inventoryRequests, dashboardStats }: QuickStatsProps) => {
  const totalStockItems = Array.isArray(inventoryData) ? inventoryData.length : 0;
  const pendingRequests = Array.isArray(inventoryRequests) 
    ? inventoryRequests.filter((req: any) => req.status?.toLowerCase() === 'pending').length 
    : 0;
  const activeAgents = dashboardStats?.totalAgents || 0;
  const totalLocations = 12; // This could be made dynamic based on data

  const statsData = [
    {
      title: "Total Stock Items",
      value: totalStockItems,
      icon: Package2,
      iconColor: "text-[#238fb7]"
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      iconColor: "text-yellow-500"
    },
    {
      title: "Active Agents",
      value: activeAgents,
      icon: Users,
      iconColor: "text-green-500"
    },
    {
      title: "Locations",
      value: totalLocations,
      icon: MapPin,
      iconColor: "text-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};