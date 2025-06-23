import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Home, 
  PlusCircle, 
  BookOpen, 
  Upload, 
  User, 
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

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
      name: "My Submissions",
      href: "/submissions",
      icon: Upload,
      forRole: "student",
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

  const toggleSidebar = () => setIsOpen(!isOpen);

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

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-class-sync-surface shadow-lg z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 class-sync-primary rounded-full flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-class-sync-primary">Class Sync</h2>
              <span className="text-sm text-class-sync-secondary capitalize">
                {user?.role || 'Student'}
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start space-x-3 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                          : "text-class-sync-primary hover:bg-gray-100"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 class-sync-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-class-sync-primary truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-class-sync-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => window.location.href = '/api/logout'}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
