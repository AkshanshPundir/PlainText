import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Plus,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Filter,
  Trash2,
} from 'lucide-react';
import type { VolunteerTask, TaskStatus, TaskPriority } from '../types';

interface VolunteerBoardProps {
  tasks: VolunteerTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: VolunteerTask) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS: { id: TaskStatus; label: string; dotColor: string; borderColor: string }[] = [
  {
    id: 'Pending',
    label: 'Pending Assignment',
    dotColor: 'bg-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'In Progress',
    label: 'In Progress / Active',
    dotColor: 'bg-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  {
    id: 'Completed',
    label: 'Completed & Signed-Off',
    dotColor: 'bg-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
];

export const VolunteerBoard: React.FC<VolunteerBoardProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask,
  onDeleteTask,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newDue, setNewDue] = useState('11:00 AM');

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchPriority && matchStatus;
    });
  }, [tasks, priorityFilter, statusFilter]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAssignee) return;

    const task: VolunteerTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Coordinate onsite operations with campus leads.',
      assignee: newAssignee.trim(),
      priority: newPriority,
      status: 'Pending',
      location: newLocation.trim() || 'Campus Main Hub',
      dueTime: newDue.trim() || 'TBD',
    };

    onAddTask(task);
    setNewTitle('');
    setNewDesc('');
    setNewAssignee('');
    setNewLocation('');
    setShowAddModal(false);
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'Pending') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'Completed') return 'In Progress';
    if (current === 'In Progress') return 'Pending';
    return null;
  };

  return (
    <section id="tasks-section" className="relative z-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Kanban className="w-4 h-4" />
            <span className="uppercase tracking-widest">Module 03 // Volunteer Logistics Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight font-body">
            Volunteer Task Assigner & Operations Board
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl font-body">
            Assign critical campus logistics, track queue managers, and verify stage check-offs in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter: Pending, In Progress, Completed */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-[10px] uppercase font-mono text-white/40 ml-1.5">Status:</span>
            {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === st
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Filter className="w-3 h-3 text-white/40 ml-1.5" />
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  priorityFilter === p
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-lg shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Responsibility</span>
          </button>
        </div>
      </div>

      {/* Kanban Board 3-Column Layout in liquid-glass-strong */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="liquid-glass-strong rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="text-sm font-semibold text-white font-body tracking-wide">
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-40 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-white/30 text-center p-4">
                    No active tasks in this lane
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const nextStatus = getNextStatus(task.status);
                    const prevStatus = getPrevStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 shadow-md group relative hover:-translate-y-0.5"
                      >
                        {/* Top: Priority & Due Time */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                              task.priority === 'High'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : task.priority === 'Medium'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}
                          >
                            {task.priority} Priority
                          </span>

                          <div className="flex items-center gap-1 text-[11px] font-mono text-white/50">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{task.dueTime}</span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-sm font-medium text-white font-body leading-snug group-hover:text-cyan-200 transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-xs text-white/50 mt-1 font-body leading-relaxed line-clamp-2">
                          {task.description}
                        </p>

                        {/* Metadata: Assignee & Location */}
                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/60">
                          <div className="flex items-center gap-1.5 font-medium text-white/80">
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/40">
                            <MapPin className="w-3 h-3 text-white/40" />
                            <span>{task.location}</span>
                          </div>
                        </div>

                        {/* Workflow Action Bar */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded text-white/30 hover:text-rose-400 transition-colors"
                            title="Remove Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {prevStatus && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, prevStatus)}
                                className="px-2 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                                title={`Move back to ${prevStatus}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>Back</span>
                              </button>
                            )}

                            {nextStatus && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, nextStatus)}
                                className="px-2.5 py-1 rounded-md text-[11px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-medium transition-colors"
                                title={`Advance to ${nextStatus}`}
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {task.status === 'Completed' && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Done
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="liquid-glass-strong w-full max-w-lg rounded-2xl p-6 border border-white/20 shadow-2xl relative animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white font-body">
                Assign New Event Responsibility
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 font-body">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refreshment Logistics & Water Station Restock"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                  Detailed Operational Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of duty, checkpoint location, or team requirements..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Assigned Volunteer
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Location / Checkpoint
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Hallway 2"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Target Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12:30 PM"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
