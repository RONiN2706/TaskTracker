import { BookOpen } from "lucide-react";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import TaskControls from "@/components/task-controls";
import ThemeSelector from "@/components/theme-selector";
import { useState } from "react";

export default function Home() {
  const [sortOption, setSortOption] = useState<string>("newest");
  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <div className="min-h-screen theme-bg">
      {/* Header */}
      <header className="theme-card-bg shadow-diary border-b border-theme-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold theme-primary text-center">
                <BookOpen className="inline mr-3 theme-accent" size={36} />
                Task Journal
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeSelector />
            </div>
          </div>
          <p className="text-center theme-muted font-century">
            The personal diary for organizing tasks
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Task Creation Form */}
        <TaskForm />

        {/* Task Controls */}
        <TaskControls
          sortOption={sortOption}
          setSortOption={setSortOption}
          showActive={showActive}
          setShowActive={setShowActive}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
        />

        {/* Task List */}
        <TaskList
          sortOption={sortOption}
          showActive={showActive}
          showCompleted={showCompleted}
        />
      </div>

      {/* Footer */}
      <footer className="theme-card-bg border-t border-theme-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="theme-muted font-century text-sm">
            Keep track of your daily tasks with this beautiful diary-inspired interface.
          </p>
        </div>
      </footer>
    </div>
  );
}
