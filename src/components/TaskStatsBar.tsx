import React from "react";
import { TaskStats } from "../types";
import { CheckCircle2, Clock, AlertTriangle, Trash2 } from "lucide-react";

interface TaskStatsBarProps {
  stats: TaskStats;
  onClearCompleted: () => void;
}

export const TaskStatsBar: React.FC<TaskStatsBarProps> = ({
  stats,
  onClearCompleted,
}) => {
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Task Overview
            </h2>
            <p className="text-xs text-slate-500">
              {stats.completed} of {stats.total} task
              {stats.total === 1 ? "" : "s"} completed ({completionPercentage}%)
            </p>
          </div>
        </div>

        {stats.completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Clear all completed tasks"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed ({stats.completed})</span>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
        <div
          className="bg-slate-900 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Metric badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Active
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {stats.active}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Done
            </span>
            <span className="font-semibold text-emerald-700 text-sm">
              {stats.completed}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
          <AlertTriangle
            className={`w-4 h-4 shrink-0 ${stats.overdue > 0 ? "text-rose-500" : "text-slate-400"}`}
          />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              Overdue
            </span>
            <span
              className={`font-semibold text-sm ${stats.overdue > 0 ? "text-rose-600" : "text-slate-800"}`}
            >
              {stats.overdue}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 ml-1 mr-1" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
              High Priority
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {stats.highPriority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
