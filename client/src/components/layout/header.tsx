import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/agents": "Agent Onboarding",
  "/inventory": "Inventory Management",
  "/customers": "Customer Registration",
  "/payments": "Payment Processing",
  "/subscriptions": "Subscription Management",
  "/reports": "Reports & Analytics",
};

export default function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  
  const pageTitle = pageTitles[location] || "Dashboard";
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-azam-dark">{pageTitle}</h2>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-azam-red rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-azam-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userInitials || 'JD'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-azam-dark">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'John Doe'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'Admin'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
