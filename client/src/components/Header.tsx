import { Bell, GraduationCap, Home, PlusCircle, BookOpen, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

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

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      forRole: "both",
    },
    {
      name: "Create Assignment",
      href: "/create-assignment",
      icon: PlusCircle,
      forRole: "teacher",
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: BookOpen,
      forRole: "both",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      forRole: "both",
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => item.forRole === "both" || item.forRole === user?.role
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/simple-logout', { method: 'POST' });
      window.location.href = '/api/logout';
    } catch (error) {
      window.location.href = '/api/logout';
    }
  };

  return (
    <header className="bg-class-sync-surface shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 class-sync-primary rounded-full flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-class-sync-primary">Class Sync</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                        : "text-class-sync-primary hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
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
              <span className="hidden lg:block text-class-sync-primary font-medium">
                {getDisplayName()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start space-x-3 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                      : "text-class-sync-primary hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
