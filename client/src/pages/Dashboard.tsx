import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Users,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AssignmentCard from "@/components/AssignmentCard";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  const recentAssignments = assignments?.slice(0, 3) || [];

  const getStatsConfig = () => {
    if (user?.role === 'teacher') {
      return [
        {
          title: "Total Assignments",
          value: stats?.total || 0,
          icon: BookOpen,
          color: "class-sync-primary",
          bgColor: "bg-blue-100",
        },
        {
          title: "Submissions",
          value: stats?.submissions || 0,
          icon: FileText,
          color: "class-sync-accent",
          bgColor: "bg-orange-100",
        },
        {
          title: "Graded",
          value: stats?.graded || 0,
          icon: CheckCircle,
          color: "class-sync-secondary",
          bgColor: "bg-green-100",
        },
        {
          title: "Pending",
          value: stats?.pending || 0,
          icon: Clock,
          color: "class-sync-error",
          bgColor: "bg-red-100",
        },
      ];
    } else {
      return [
        {
          title: "Total Assignments",
          value: stats?.total || 0,
          icon: BookOpen,
          color: "class-sync-primary",
          bgColor: "bg-blue-100",
        },
        {
          title: "Pending",
          value: stats?.pending || 0,
          icon: Clock,
          color: "class-sync-accent",
          bgColor: "bg-orange-100",
        },
        {
          title: "Submitted",
          value: stats?.submitted || 0,
          icon: CheckCircle,
          color: "class-sync-secondary",
          bgColor: "bg-green-100",
        },
        {
          title: "Overdue",
          value: stats?.overdue || 0,
          icon: AlertTriangle,
          color: "class-sync-error",
          bgColor: "bg-red-100",
        },
      ];
    }
  };

  const statsConfig = getStatsConfig();

  if (statsLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-class-sync-secondary text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-class-sync-primary">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`text-${stat.color.replace('class-sync-', '')} text-xl`} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Assignments */}
      <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-class-sync-primary">Recent Assignments</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Button>
          </div>
        </div>
        
        {assignmentsLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {recentAssignments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-class-sync-secondary uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-class-sync-secondary uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-class-sync-secondary uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-class-sync-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-class-sync-secondary uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-class-sync-primary">{assignment.title}</p>
                          <p className="text-sm text-class-sync-secondary line-clamp-2">
                            {assignment.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-class-sync-primary">{assignment.subject}</td>
                      <td className="px-6 py-4 text-class-sync-primary">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-class-sync-secondary">No assignments found</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
