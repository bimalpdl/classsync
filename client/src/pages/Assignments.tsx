import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, GraduationCap } from "lucide-react";
import AssignmentCard from "@/components/AssignmentCard";
import SubmissionModal from "@/components/SubmissionModal";
import { useAuth } from "@/hooks/useAuth";

export default function Assignments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["/api/assignments"],
  });

  const filteredAssignments = assignments?.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, we'll implement basic status filtering
    // In a real app, you'd check submission status from the database
    return matchesSearch;
  }) || [];

  const handleViewAssignment = (assignment) => {
    if (user?.role === 'student') {
      setSelectedAssignment(assignment);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h2 className="text-2xl font-bold text-class-sync-primary">All Assignments</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onView={() => handleViewAssignment(assignment)}
              userRole={user?.role}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-class-sync-primary mb-2">No assignments found</h3>
          <p className="text-class-sync-secondary text-center max-w-md">
            {searchTerm || statusFilter 
              ? "No assignments match your current filters. Try adjusting your search criteria."
              : "No assignments have been created yet."
            }
          </p>
        </div>
      )}

      {selectedAssignment && (
        <SubmissionModal
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}
