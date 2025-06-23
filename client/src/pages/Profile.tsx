import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Calendar, UserCheck } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4 lg:p-8">
        <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email || 'User';
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-class-sync-primary">Profile</h2>
        
        {/* Profile Overview */}
        <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profileImageUrl} alt={getDisplayName()} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-class-sync-primary mb-2">{getDisplayName()}</h3>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={user.role === 'teacher' ? 'default' : 'secondary'}
                    className={user.role === 'teacher' ? 'class-sync-primary' : 'class-sync-secondary'}
                  >
                    <UserCheck className="mr-1" size={14} />
                    {user.role === 'teacher' ? 'Teacher' : 'Student'}
                  </Badge>
                  <div className="flex items-center text-class-sync-secondary">
                    <Calendar className="mr-1" size={14} />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-class-sync-primary mb-4">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-class-sync-primary mb-2">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={user.firstName || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={user.lastName || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="email" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Email Address
                </Label>
                <div className="flex items-center">
                  <Mail className="mr-3 text-class-sync-secondary" size={20} />
                  <Input
                    id="email"
                    value={user.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="role" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Role
                </Label>
                <div className="flex items-center">
                  <User className="mr-3 text-class-sync-secondary" size={20} />
                  <Input
                    id="role"
                    value={user.role === 'teacher' ? 'Teacher' : 'Student'}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-class-sync-primary mb-4">Account Actions</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-class-sync-primary">Change Password</h5>
                  <p className="text-sm text-class-sync-secondary">Update your account password</p>
                </div>
                <Button variant="outline" className="border-gray-300 text-class-sync-primary hover:bg-gray-50">
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-class-sync-primary">Logout</h5>
                  <p className="text-sm text-class-sync-secondary">Sign out of your account</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
