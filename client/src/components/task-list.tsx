import { useQuery } from "@tanstack/react-query";
import { type Task } from "@shared/schema";
import TaskItem from "./task-item";
import { ListChecks, CheckCheck, BookOpen } from "lucide-react";
import { useMemo } from "react";

interface TaskListProps {
  sortOption: string;
  showActive: boolean;
  showCompleted: boolean;
}

export default function TaskList({ sortOption, showActive, showCompleted }: TaskListProps) {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const sortedAndFilteredTasks = useMemo(() => {
    let filteredTasks = tasks;

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case "completed-date":
          if (!a.completedDate && !b.completedDate) return 0;
          if (!a.completedDate) return 1;
          if (!b.completedDate) return -1;
          return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
        case "due-date":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "newest":
        default:
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });

    return sortedTasks;
  }, [tasks, sortOption]);

  const activeTasks = sortedAndFilteredTasks.filter(task => !task.completed);
  const completedTasks = sortedAndFilteredTasks.filter(task => task.completed);

  if (isLoading) {
    return (
      <div className="bg-diary-paper paper-texture rounded-lg shadow-diary border border-diary-beige/30 p-12 text-center">
        <div className="diary-muted">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-diary-paper paper-texture rounded-lg shadow-diary border border-diary-beige/30 p-12 text-center">
        <div className="diary-muted mb-4">
          <BookOpen size={64} className="mx-auto" />
        </div>
        <h3 className="font-playfair text-xl font-semibold diary-brown mb-2">
          Your diary is empty
        </h3>
        <p className="diary-muted font-century">
          Start by adding your first task above to begin organizing your day.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Tasks Section */}
      {showActive && activeTasks.length > 0 && (
        <div className="theme-card-bg paper-texture rounded-lg shadow-diary-lg border border-theme-border overflow-hidden">
          <div className="bg-theme-primary/5 px-6 py-4 border-b border-theme-border">
            <h3 className="font-serif text-lg font-semibold theme-primary flex items-center">
              <ListChecks className="mr-2 theme-accent" size={20} />
              Active Tasks
              <span className="ml-2 bg-theme-primary theme-card-bg text-xs px-2 py-1 rounded-full font-century">
                {activeTasks.length}
              </span>
            </h3>
          </div>
          
          {activeTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isLast={index === activeTasks.length - 1}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks Section */}
      {showCompleted && completedTasks.length > 0 && (
        <div className="theme-card-bg paper-texture rounded-lg shadow-diary-lg border border-theme-border overflow-hidden">
          <div className="bg-diary-sage/5 px-6 py-4 border-b border-theme-border">
            <h3 className="font-serif text-lg font-semibold theme-primary flex items-center justify-between">
              <div className="flex items-center">
                <CheckCheck className="mr-2 text-diary-sage" size={20} />
                Completed Tasks
                <span className="ml-2 bg-diary-sage theme-card-bg text-xs px-2 py-1 rounded-full font-century">
                  {completedTasks.length}
                </span>
              </div>
            </h3>
          </div>
          
          {completedTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isLast={index === completedTasks.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
