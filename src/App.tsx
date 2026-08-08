import React, { useState, useEffect, useMemo } from "react";
import {
  Task,
  FilterStatus,
  SortOption,
  TaskCategory,
  Priority,
  TaskStats,
} from "./types";
import {
  loadTasks,
  saveTasks,
  isOverdue,
  PRIORITY_WEIGHT,
} from "./utils/storage";
import { TaskStatsBar } from "./components/TaskStatsBar";
import { TaskInput } from "./components/TaskInput";
import { TaskFilters } from "./components/TaskFilters";
import { TaskItem } from "./components/TaskItem";
import {
  CheckSquare,
  ListTodo,
  Sparkles,
  Plus,
  Layers,
  AlertCircle,
} from "lucide-react";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<
    Priority | "all" | "overdue"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">(
    "all",
  );
  const [sortOption, setSortOption] = useState<SortOption>("createdAt");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Save tasks to localStorage on updates
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Compute stats
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = tasks.filter((t) =>
      isOverdue(t.dueDate, t.completed),
    ).length;
    const highPriority = tasks.filter(
      (t) => !t.completed && t.priority === "high",
    ).length;

    return { total, completed, active, overdue, highPriority };
  }, [tasks]);

  // Task Handlers
  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: TaskCategory;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      title: newTaskData.title,
      description: newTaskData.description,
      completed: false,
      priority: newTaskData.priority,
      category: newTaskData.category,
      dueDate: newTaskData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      }),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const handleDropTask = (targetTaskId: string) => {
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      return;
    }

    setTasks((prev) => {
      const draggedIndex = prev.findIndex((task) => task.id === draggedTaskId);
      const targetIndex = prev.findIndex((task) => task.id === targetTaskId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const nextTasks = [...prev];
      const [draggedTask] = nextTasks.splice(draggedIndex, 1);
      const nextTargetIndex = nextTasks.findIndex(
        (task) => task.id === targetTaskId,
      );
      nextTasks.splice(nextTargetIndex, 0, draggedTask);
      return nextTasks;
    });
    setSortOption("manual");
    setDraggedTaskId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSortOption("createdAt");
  };

  // Count active filter conditions
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (statusFilter !== "all") count++;
    if (priorityFilter !== "all") count++;
    if (categoryFilter !== "all") count++;
    return count;
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Filter & Sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc =
            task.description?.toLowerCase().includes(q) || false;
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Status filter
        if (statusFilter === "active" && task.completed) return false;
        if (statusFilter === "completed" && !task.completed) return false;

        // Priority / Special filter
        if (priorityFilter === "overdue") {
          if (!isOverdue(task.dueDate, task.completed)) return false;
        } else if (priorityFilter !== "all") {
          if (task.priority !== priorityFilter) return false;
        }

        // Category filter
        if (categoryFilter !== "all" && task.category !== categoryFilter)
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "manual") return 0;

        // Primary sort
        if (sortOption === "priority") {
          const weightA = PRIORITY_WEIGHT[a.priority];
          const weightB = PRIORITY_WEIGHT[b.priority];
          if (weightA !== weightB) return weightB - weightA;
        } else if (sortOption === "dueDate") {
          if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
        } else if (sortOption === "title") {
          return a.title.localeCompare(b.title);
        }

        // Default sort by createdAt descending
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortOption,
  ]);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Header Container */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <CheckSquare className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                Task Manager
              </h1>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {todayFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
              {stats.active} pending
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats Summary Bar */}
        <TaskStatsBar stats={stats} onClearCompleted={handleClearCompleted} />

        {/* Task Creation Input */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Filters and Search Bar */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Task Items List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                  onDragStart={setDraggedTaskId}
                  onDrop={handleDropTask}
                />
              ))
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs my-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ListTodo className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  {tasks.length === 0
                    ? "No tasks yet"
                    : "No matching tasks found"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
                  {tasks.length === 0
                    ? "Get started by creating your first task above to keep track of your priorities."
                    : "Try adjusting your search criteria or resetting filters to view your tasks."}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
