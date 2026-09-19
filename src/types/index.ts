export type AttendanceStatus = 'Present' | 'Absent';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  section: string;
  status: AttendanceStatus;
  email: string;
  checkInTime?: string;
  department?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  location: string;
  dueTime: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredData?: {
    type: 'student_list' | 'stats_summary' | 'task_list' | 'section_breakdown';
    students?: Student[];
    tasks?: VolunteerTask[];
    summary?: {
      title: string;
      value: string | number;
      badge?: string;
    }[];
  };
}

export interface OperationalMetrics {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}
