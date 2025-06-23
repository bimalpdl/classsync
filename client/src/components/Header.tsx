import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user?.email || 'User';
  };

  const getInitials = () => {
    if (user?.firstName || user?.lastName) {
      const first = user.firstName?.charAt(0) || '';
      const last = user.lastName?.charAt(0) || '';
      return (first + last).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getPageTitle = () => {
    const path = window.location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/create-assignment':
        return 'Create Assignment';
      case '/assignments':
        return 'Assignments';
      case '/submissions':
        return 'My Submissions';
      case '/profile':
        return 'Profile';
      default:
        return 'Class Sync';
    }
  };

  return (
    <header className="bg-class-sync-surface shadow-sm border-b border-gray-200 p-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu is handled by Sidebar component */}
          <h1 className="text-2xl font-bold text-class-sync-primary ml-12 lg:ml-0">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="text-class-sync-secondary" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 class-sync-error rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl} alt={getDisplayName()} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-class-sync-primary font-medium">
              {getDisplayName()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
