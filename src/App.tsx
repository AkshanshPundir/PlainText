import React, { useState, useMemo } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { RosterManager } from './components/RosterManager';
import { AiQueryInterface } from './components/AiQueryInterface';
import { VolunteerBoard } from './components/VolunteerBoard';
import { CtaFooter } from './components/CtaFooter';
import { INITIAL_STUDENTS, INITIAL_TASKS } from './data/mockData';
import type { Student, VolunteerTask, TaskStatus, OperationalMetrics } from './types';

export const App: React.FC = () => {
  // Master Student Roster State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Master Volunteer Task State
  const [tasks, setTasks] = useState<VolunteerTask[]>(INITIAL_TASKS);

  // Roster Status Filter ('All' | 'Present' | 'Absent')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent'>('All');

  // Compute live operational metrics
  const metrics: OperationalMetrics = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => s.status === 'Present').length;
    const absent = total - present;
    const rate = total > 0 ? (present / total) * 100 : 0;

    return {
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      attendancePercentage: rate,
    };
  }, [students]);

  // Handler: Toggle single student status
  const handleToggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'Present' ? 'Absent' : 'Present';
          return {
            ...s,
            status: nextStatus,
            checkInTime:
              nextStatus === 'Present'
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
          };
        }
        return s;
      })
    );
  };

  // Handler: Add new student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  // Handler: Delete student
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Handler: Batch import students (CSV / OCR)
  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
  };

  // Handler: Reset roster to initial mock data
  const handleResetRoster = () => {
    setStudents(INITIAL_STUDENTS);
  };

  // Handler: Update Volunteer Task Status (Pending, In Progress, Completed)
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Handler: Add new task
  const handleAddTask = (task: VolunteerTask) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Handler: Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white selection:text-black">
      {/* Background HLS Video Stream with 200px gradient blend masks */}
      <BackgroundVideo streamUrl="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-20 pb-12">
        {/* Module 1: Hero Header & Live Operational Stats */}
        <HeroStats
          metrics={metrics}
          onQuickFilter={(filter) => {
            setStatusFilter(filter);
            const rosterEl = document.getElementById('roster-section');
            if (rosterEl) {
              rosterEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Module 2: Roster Manager & Document Ingestion */}
        <RosterManager
          students={students}
          onToggleStatus={handleToggleStudentStatus}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
          onImportStudents={handleImportStudents}
          onResetRoster={handleResetRoster}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Module 3: AI Natural Language Query Interface */}
        <AiQueryInterface
          students={students}
          tasks={tasks}
          onToggleStudentStatus={handleToggleStudentStatus}
        />

        {/* Module 4: Volunteer Task Assigner */}
        <VolunteerBoard
          tasks={tasks}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />

        {/* Module 5: CTA & Minimal Footer Section */}
        <CtaFooter />
      </main>
    </div>
  );
};

export default App;
