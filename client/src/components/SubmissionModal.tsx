import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, X, FileText } from "lucide-react";
import type { Assignment } from "@shared/schema";

interface SubmissionModalProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ assignment, isOpen, onClose }: SubmissionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comments, setComments] = useState("");
  const [submissionText, setSubmissionText] = useState("");

  const submitAssignmentMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      if (submissionText.trim()) {
        formData.append('submissionText', submissionText);
      }
      
      if (comments.trim()) {
        formData.append('comments', comments);
      }

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      await apiRequest("POST", `/api/assignments/${assignment.id}/submit`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assignment",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 25 * 1024 * 1024; // 25MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 25MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setComments("");
    setSubmissionText("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0 && !submissionText.trim()) {
      toast({
        title: "No submission content",
        description: "Please upload files or provide text submission",
        variant: "destructive",
      });
      return;
    }
    
    submitAssignmentMutation.mutate();
  };

  const canShowTextSubmission = assignment.submissionType === 'text' || assignment.submissionType === 'both';
  const canShowFileUpload = assignment.submissionType === 'file' || assignment.submissionType === 'both';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-class-sync-primary">
            Submit Assignment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-class-sync-primary mb-2">{assignment.title}</h4>
            <p className="text-sm text-class-sync-secondary mb-3 line-clamp-3">
              {assignment.description}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-class-sync-secondary">
                Due: <span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
              </span>
              <span className="text-class-sync-secondary">
                Max Marks: <span className="font-medium">{assignment.maxMarks}</span>
              </span>
            </div>
          </div>

          {/* Text Submission */}
          {canShowTextSubmission && (
            <div>
              <Label htmlFor="submissionText" className="block text-sm font-medium text-class-sync-primary mb-2">
                Text Submission {assignment.submissionType === 'text' && '(Required)'}
              </Label>
              <Textarea
                id="submissionText"
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Enter your submission text here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>
          )}

          {/* File Upload */}
          {canShowFileUpload && (
            <div>
              <Label className="block text-sm font-medium text-class-sync-primary mb-2">
                Upload Files {assignment.submissionType === 'file' && '(Required)'}
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="submission-files"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="submission-files" className="cursor-pointer">
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-class-sync-secondary">Click to upload files or drag and drop</p>
                  <p className="text-sm text-class-sync-secondary mt-1">
                    PDF, DOC, TXT, ZIP, Images up to 25MB each
                  </p>
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-class-sync-primary mb-2">Selected Files:</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <div className="flex items-center space-x-3">
                            <FileText className="text-blue-500" size={20} />
                            <div>
                              <p className="text-sm font-medium text-class-sync-primary">{file.name}</p>
                              <p className="text-xs text-class-sync-secondary">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div>
            <Label htmlFor="comments" className="block text-sm font-medium text-class-sync-primary mb-2">
              Comments (Optional)
            </Label>
            <Textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments about your submission..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-class-sync-primary hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitAssignmentMutation.isPending}
              className="px-6 py-3 class-sync-primary font-medium rounded-lg transition-colors duration-200"
            >
              {submitAssignmentMutation.isPending ? "Submitting..." : "Submit Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
