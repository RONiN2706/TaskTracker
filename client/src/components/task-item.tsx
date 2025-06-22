import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Calendar, CalendarX, CheckCircle } from "lucide-react";
import { format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  isLast: boolean;
}

export default function TaskItem({ task, isLast }: TaskItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isOverdue = task.dueDate && !task.completed && isAfter(new Date(), new Date(task.dueDate));

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Task deleted",
        description: "Task has been removed from your diary.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = (checked: boolean) => {
    updateTaskMutation.mutate({ completed: checked });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate();
    }
  };



  return (
    <div
      className={cn(
        "p-6 hover:bg-theme-primary/10 transition-colors duration-200",
        !isLast && "border-b border-theme-border",
        isOverdue && "overdue",
        task.completed && "completed"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            disabled={updateTaskMutation.isPending}
            className={cn(
              "w-5 h-5 rounded border-2 focus:ring-theme-primary/30",
              task.completed
                ? "data-[state=checked]:bg-diary-sage data-[state=checked]:border-diary-sage"
                : "border-theme-primary data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4
                className={cn(
                  "font-century font-semibold diary-text mb-1",
                  task.completed && "line-through"
                )}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="theme-muted font-century text-sm mb-3">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs">
                {task.completed && task.completedDate ? (
                  <span className="flex items-center diary-sage">
                    <CheckCircle className="mr-1" size={12} />
                    Completed: {format(new Date(task.completedDate), "MMM dd, yyyy")}
                  </span>
                ) : task.dueDate ? (
                  <span
                    className={cn(
                      "flex items-center",
                      isOverdue ? "diary-red font-medium" : "theme-primary"
                    )}
                  >
                    {isOverdue ? (
                      <CalendarX className="mr-1" size={12} />
                    ) : (
                      <Calendar className="mr-1" size={12} />
                    )}
                    Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    {isOverdue && " (Overdue)"}
                  </span>
                ) : (
                  <span className="flex items-center theme-muted">
                    <Calendar className="mr-1" size={12} />
                    No due date
                  </span>
                )}

              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending}
              className="theme-muted hover:diary-red transition-colors duration-200 p-2 h-auto"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
