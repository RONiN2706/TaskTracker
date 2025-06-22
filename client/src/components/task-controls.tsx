import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type Task } from "@shared/schema";

interface TaskControlsProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  showActive: boolean;
  setShowActive: (value: boolean) => void;
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
}

export default function TaskControls({
  sortOption,
  setSortOption,
  showActive,
  setShowActive,
  showCompleted,
  setShowCompleted,
}: TaskControlsProps) {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="theme-card-bg paper-texture rounded-lg shadow-diary border border-theme-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <label className="font-serif theme-primary font-medium">Sort by:</label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-40 px-3 py-2 rounded-lg border border-theme-border bg-theme-bg theme-text font-century focus:ring-2 focus:ring-theme-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="due-date">Due Date</SelectItem>
              <SelectItem value="completed-date">Completion Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif theme-primary font-medium">Show:</span>
          <label className="flex items-center">
            <Checkbox
              checked={showActive}
              onCheckedChange={setShowActive}
              className="mr-2 rounded data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary"
            />
            <span className="font-century text-sm">Active ({activeCount})</span>
          </label>
          <label className="flex items-center">
            <Checkbox
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
              className="mr-2 rounded data-[state=checked]:bg-diary-sage data-[state=checked]:border-diary-sage"
            />
            <span className="font-century text-sm">Completed ({completedCount})</span>
          </label>
        </div>
      </div>
    </div>
  );
}
