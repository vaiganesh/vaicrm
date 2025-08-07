import { BarChart3, TrendingUp } from "lucide-react";

interface ChartPlaceholderProps {
  type: "line" | "bar" | "pie";
  title: string;
  description: string;
  height?: number;
}

export default function ChartPlaceholder({ 
  type, 
  title, 
  description, 
  height = 256 
}: ChartPlaceholderProps) {
  const getIcon = () => {
    switch (type) {
      case "line":
        return <TrendingUp className="h-12 w-12 text-gray-400" />;
      case "bar":
        return <BarChart3 className="h-12 w-12 text-gray-400" />;
      case "pie":
        return <div className="w-12 h-12 border-4 border-gray-400 rounded-full border-t-transparent"></div>;
      default:
        return <BarChart3 className="h-12 w-12 text-gray-400" />;
    }
  };

  return (
    <div 
      className="bg-gray-50 rounded-lg flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {getIcon()}
        </div>
        <h4 className="text-lg font-medium text-gray-700 mb-2">{title}</h4>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-sm text-gray-500">Chart visualization using Recharts library</p>
        <div className="mt-4 text-xs text-gray-400">
          {type === "line" && "Line chart showing trends over time"}
          {type === "bar" && "Bar chart showing comparative data"}
          {type === "pie" && "Pie chart showing distribution"}
        </div>
      </div>
    </div>
  );
}
