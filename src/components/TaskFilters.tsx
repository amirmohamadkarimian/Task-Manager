import React from "react";
import { FilterStatus, SortOption, TaskCategory, Priority } from "../types";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  priorityFilter: Priority | "all" | "overdue";
  onPriorityFilterChange: (priority: Priority | "all" | "overdue") => void;
  categoryFilter: TaskCategory | "all";
  onCategoryFilterChange: (category: TaskCategory | "all") => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortOption,
  onSortChange,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6 space-y-3">
      {/* Search and Sort row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or note..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-slate-500 hidden md:inline-block">
            Sort by:
          </label>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-slate-400 appearance-none cursor-pointer"
            >
              <option value="manual">Manual Order</option>
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Level</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Reset all search filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-medium text-slate-600">
          {(["all", "active", "completed"] as FilterStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority & Special Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() =>
              onPriorityFilterChange(priorityFilter === "high" ? "all" : "high")
            }
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              priorityFilter === "high"
                ? "bg-rose-50 border-rose-300 text-rose-700 font-semibold"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High Priority
          </button>

          <button
            onClick={() =>
              onPriorityFilterChange(
                priorityFilter === "overdue" ? "all" : "overdue",
              )
            }
            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              priorityFilter === "overdue"
                ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Overdue
          </button>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              onCategoryFilterChange(e.target.value as TaskCategory | "all")
            }
            className="bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium focus:outline-hidden cursor-pointer capitalize"
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};
