import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAssignmentSchema } from "@shared/schema";
import { CloudUpload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const subjects = [
  { value: "computer-science", label: "Computer Science" },
  { value: "database-systems", label: "Database Systems" },
  { value: "web-technology", label: "Web Technology" },
  { value: "software-engineering", label: "Software Engineering" },
  { value: "data-structures", label: "Data Structures" },
  { value: "algorithms", label: "Algorithms" },
];

export default function CreateAssignment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(insertAssignmentSchema.extend({
      dueDate: insertAssignmentSchema.shape.dueDate.transform(date => 
        typeof date === 'string' ? new Date(date) : date
      ),
    })),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      dueDate: new Date(),
      maxMarks: 100,
      submissionType: "file",
      allowLateSubmission: false,
    },
  });

  // Redirect if not teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      toast({
        title: "Access Denied",
        description: "Only teachers can create assignments.",
        variant: "destructive",
      });
      window.history.back();
    }
  }, [user, toast]);

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key === 'dueDate') {
          formData.append(key, data[key].toISOString());
        } else {
          formData.append(key, data[key]);
        }
      });

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      await apiRequest("POST", "/api/assignments", formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
      setSelectedFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    createAssignmentMutation.mutate(data);
  };

  if (user?.role !== 'teacher') {
    return null;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-class-sync-surface rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-class-sync-primary mb-6">Create New Assignment</h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Assignment Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter assignment title"
                    {...form.register("title")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Subject
                  </Label>
                  <Select onValueChange={(value) => form.setValue("subject", value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.subject.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-class-sync-primary mb-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Enter assignment description and requirements"
                  {...form.register("description")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="dueDate" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Due Date
                  </Label>
                  <Input
                    type="datetime-local"
                    id="dueDate"
                    {...form.register("dueDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  {form.formState.errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.dueDate.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="maxMarks" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Maximum Marks
                  </Label>
                  <Input
                    type="number"
                    id="maxMarks"
                    min="1"
                    placeholder="100"
                    {...form.register("maxMarks", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  {form.formState.errors.maxMarks && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.maxMarks.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="submissionType" className="block text-sm font-medium text-class-sync-primary mb-2">
                    Submission Type
                  </Label>
                  <Select onValueChange={(value) => form.setValue("submissionType", value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                      <SelectValue placeholder="File Upload" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="text">Text Submission</SelectItem>
                      <SelectItem value="both">File + Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-class-sync-primary mb-2">
                  Assignment Files (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="assignment-files"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="assignment-files" className="cursor-pointer">
                    <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-class-sync-secondary">Click to upload assignment files or drag and drop</p>
                    <p className="text-sm text-class-sync-secondary mt-1">PDF, DOC, TXT, ZIP files up to 10MB</p>
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-class-sync-primary mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm text-class-sync-primary">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
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

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowLateSubmission"
                    checked={form.watch("allowLateSubmission")}
                    onCheckedChange={(checked) => form.setValue("allowLateSubmission", checked as boolean)}
                  />
                  <Label htmlFor="allowLateSubmission" className="text-sm text-class-sync-primary">
                    Allow late submissions
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-class-sync-primary hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={createAssignmentMutation.isPending}
                  className="px-6 py-3 class-sync-primary font-medium rounded-lg transition-colors duration-200"
                >
                  {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
