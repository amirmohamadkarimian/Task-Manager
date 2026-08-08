import React, { useState } from "react";
import { Task, Priority, TaskCategory } from "../types";
import { formatDueDateLabel, isOverdue } from "../utils/storage";
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  AlertCircle,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { motion } from "motion/react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDrop: (targetId: string, draggedId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Edit form states
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<TaskCategory>(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

  const dueDateInfo = formatDueDateLabel(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    onUpdateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate || "");
    setIsEditing(false);
  };

  // Priority color styles
  const priorityBadgeStyle: Record<Priority, string> = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-800 border-amber-200",
    low: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <motion.div
      layout
      draggable={!isEditing}
      onDragStart={(event) => {
        setIsDragging(true);
        const dragEvent = event as unknown as DragEvent;
        dragEvent.dataTransfer.effectAllowed = "move";
        dragEvent.dataTransfer.setData("text/plain", task.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragEnter={(event) => event.preventDefault()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const draggedTaskId = event.dataTransfer.getData("text/plain");
        if (draggedTaskId) onDrop(task.id, draggedTaskId);
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group bg-white border rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      } ${
        task.completed
          ? "border-slate-200/60 bg-slate-50/50"
          : overdue
            ? "border-rose-200 bg-rose-50/10"
            : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {isEditing ? (
        /* Edit Mode Form */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-slate-900 focus:bg-white"
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900 focus:bg-white resize-none"
              placeholder="Description or notes..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Priority Select */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value as TaskCategory)
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800 capitalize"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={!editTitle.trim()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-lg cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Normal Task Display */
        <div>
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"
              title="Drag to reorder"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-5" />
            </div>

            {/* Custom Checkbox */}
            <button
              type="button"
              onClick={() => onToggleComplete(task.id)}
              className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                task.completed
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                  : "border-slate-300 hover:border-slate-500 bg-white"
              }`}
              title={task.completed ? "Mark incomplete" : "Mark completed"}
            >
              {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {/* Content area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  onClick={() => onToggleComplete(task.id)}
                  className={`text-sm font-semibold transition-all cursor-pointer leading-snug ${
                    task.completed
                      ? "line-through text-slate-400"
                      : "text-slate-900 hover:text-slate-700"
                  }`}
                >
                  {task.title}
                </h3>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Badges and metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${
                    priorityBadgeStyle[task.priority]
                  }`}
                >
                  {task.priority} priority
                </span>

                {/* Category Tag */}
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md capitalize">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {task.category}
                </span>

                {/* Due Date Pill */}
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                      task.completed
                        ? "bg-slate-100 text-slate-400 border-slate-200"
                        : overdue
                          ? "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
                          : dueDateInfo.isToday
                            ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{dueDateInfo.text}</span>
                  </span>
                )}

                {/* Notes toggle button if description exists */}
                {task.description && (
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors ml-auto cursor-pointer"
                  >
                    <span>{showNotes ? "Hide notes" : "View notes"}</span>
                    {showNotes ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Expanded Description Notes */}
              {task.description && (showNotes || isEditing) && (
                <div className="mt-2.5 p-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
