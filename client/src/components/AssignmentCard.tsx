import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Eye, Upload } from "lucide-react";
import type { Assignment } from "@shared/schema";

interface AssignmentCardProps {
  assignment: Assignment;
  onView: () => void;
  userRole?: string;
}

export default function AssignmentCard({ assignment, onView, userRole }: AssignmentCardProps) {
  const getDaysLeft = (dueDate: string | Date) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = () => {
    const daysLeft = getDaysLeft(assignment.dueDate);
    
    if (daysLeft < 0) {
      return (
        <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
          Overdue
        </Badge>
      );
    } else if (daysLeft <= 2) {
      return (
        <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
          Due Soon
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
          Active
        </Badge>
      );
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'computer-science': 'bg-blue-100 text-blue-600',
      'database-systems': 'bg-purple-100 text-purple-600',
      'web-technology': 'bg-green-100 text-green-600',
      'software-engineering': 'bg-orange-100 text-orange-600',
      'data-structures': 'bg-red-100 text-red-600',
      'algorithms': 'bg-yellow-100 text-yellow-600',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const formatSubject = (subject: string) => {
    return subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={getSubjectColor(assignment.subject)}>
            {formatSubject(assignment.subject)}
          </Badge>
          {getStatusBadge()}
        </div>
        
        <h3 className="text-lg font-bold text-class-sync-primary mb-2 line-clamp-2">
          {assignment.title}
        </h3>
        
        <p className="text-class-sync-secondary text-sm mb-4 line-clamp-3">
          {assignment.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-class-sync-secondary">Due Date:</span>
            <span className="font-medium text-class-sync-primary">
              {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-class-sync-secondary">Max Marks:</span>
            <span className="font-medium text-class-sync-primary">{assignment.maxMarks}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-class-sync-secondary">
              {daysLeft < 0 ? 'Overdue by:' : 'Time Left:'}
            </span>
            <span className={`font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 2 ? 'text-orange-600' : 'text-class-sync-primary'}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days` : `${daysLeft} days`}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={onView}
            className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
              daysLeft < 0 && userRole === 'student'
                ? 'class-sync-error text-white hover:bg-red-600'
                : 'class-sync-primary text-white'
            }`}
          >
            {userRole === 'student' ? (
              <>
                {daysLeft < 0 ? <Upload className="mr-2" size={16} /> : <Eye className="mr-2" size={16} />}
                {daysLeft < 0 ? 'Submit Now' : 'View Details'}
              </>
            ) : (
              <>
                <Eye className="mr-2" size={16} />
                View Details
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="text-class-sync-secondary" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
