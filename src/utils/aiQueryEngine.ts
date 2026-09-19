import type { Student, VolunteerTask, ChatMessage } from '../types';

export function processCoordinatorQuery(
  rawQuery: string,
  students: Student[],
  tasks: VolunteerTask[]
): ChatMessage {
  const query = rawQuery.toLowerCase().trim();
  const id = `msg-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. "Show absent students in Section [A/B/C/D]"
  const sectionMatch = query.match(/section\s+([a-d])/i);
  const mentionsAbsent = query.includes('absent') || query.includes('missing') || query.includes('not present') || query.includes('not checked');

  if (sectionMatch && mentionsAbsent) {
    const sectionTarget = `Section ${sectionMatch[1].toUpperCase()}`;
    const absentInSec = students.filter(
      (s) => s.section.toLowerCase() === sectionTarget.toLowerCase() && s.status === 'Absent'
    );

    if (absentInSec.length === 0) {
      return {
        id,
        sender: 'assistant',
        text: `Great news! All registered students in ${sectionTarget} are currently marked Present. No absentees detected.`,
        timestamp,
        structuredData: {
          type: 'student_list',
          students: [],
        },
      };
    }

    return {
      id,
      sender: 'assistant',
      text: `There are currently ${absentInSec.length} absent student(s) in ${sectionTarget}:`,
      timestamp,
      structuredData: {
        type: 'student_list',
        students: absentInSec,
      },
    };
  }

  // 2. "Show students in Section [A/B/C/D]"
  if (sectionMatch && !mentionsAbsent) {
    const sectionTarget = `Section ${sectionMatch[1].toUpperCase()}`;
    const secStudents = students.filter(
      (s) => s.section.toLowerCase() === sectionTarget.toLowerCase()
    );
    const presentCount = secStudents.filter((s) => s.status === 'Present').length;
    const rate = secStudents.length > 0 ? ((presentCount / secStudents.length) * 100).toFixed(1) : '0';

    return {
      id,
      sender: 'assistant',
      text: `${sectionTarget} has ${secStudents.length} total students (${presentCount} Present, ${secStudents.length - presentCount} Absent, Turnout: ${rate}%):`,
      timestamp,
      structuredData: {
        type: 'student_list',
        students: secStudents,
      },
    };
  }

  // 3. "Summarize overall attendance rate" or "attendance" or "metrics"
  if (
    query.includes('attendance rate') ||
    query.includes('summarize') ||
    query.includes('summary') ||
    query.includes('turnout') ||
    query.includes('overall attendance')
  ) {
    const total = students.length;
    const present = students.filter((s) => s.status === 'Present').length;
    const absent = total - present;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

    // Group by section
    const secGroups: Record<string, { total: number; present: number }> = {};
    students.forEach((s) => {
      if (!secGroups[s.section]) secGroups[s.section] = { total: 0, present: 0 };
      secGroups[s.section].total++;
      if (s.status === 'Present') secGroups[s.section].present++;
    });

    const summaryPills = [
      { title: 'Total Registered', value: total, badge: 'All Cohorts' },
      { title: 'Checked-in', value: present, badge: `${rate}%` },
      { title: 'Absent / Pending', value: absent, badge: absent > 0 ? 'Follow up' : 'Clear' },
      { title: 'Overall Turnout', value: `${rate}%`, badge: Number(rate) >= 85 ? 'On Target' : 'Action Needed' },
    ];

    return {
      id,
      sender: 'assistant',
      text: `Live operational summary: Campus attendance is currently at **${rate}%** with **${present}** present out of **${total}** enrolled attendees across all 4 sections.`,
      timestamp,
      structuredData: {
        type: 'stats_summary',
        summary: summaryPills,
      },
    };
  }

  // 4. "Which section has the highest/lowest attendance?"
  if (query.includes('highest') || query.includes('lowest') || query.includes('best') || query.includes('worst')) {
    const secGroups: Record<string, { total: number; present: number }> = {};
    students.forEach((s) => {
      if (!secGroups[s.section]) secGroups[s.section] = { total: 0, present: 0 };
      secGroups[s.section].total++;
      if (s.status === 'Present') secGroups[s.section].present++;
    });

    const rates = Object.entries(secGroups).map(([sec, data]) => ({
      section: sec,
      rate: data.total > 0 ? (data.present / data.total) * 100 : 0,
      present: data.present,
      total: data.total,
    }));

    rates.sort((a, b) => b.rate - a.rate);
    const highest = rates[0];
    const lowest = rates[rates.length - 1];

    const isAskingHighest = query.includes('highest') || query.includes('best');

    if (isAskingHighest && highest) {
      return {
        id,
        sender: 'assistant',
        text: `**${highest.section}** leads with the highest attendance rate at **${highest.rate.toFixed(1)}%** (${highest.present}/${highest.total} checked in).`,
        timestamp,
        structuredData: {
          type: 'stats_summary',
          summary: rates.map((r) => ({
            title: r.section,
            value: `${r.rate.toFixed(1)}%`,
            badge: `${r.present}/${r.total} checked in`,
          })),
        },
      };
    } else if (lowest) {
      return {
        id,
        sender: 'assistant',
        text: `**${lowest.section}** currently has the lowest attendance rate at **${lowest.rate.toFixed(1)}%** (${lowest.present}/${lowest.total} checked in). Dispatching reminder alerts recommended.`,
        timestamp,
        structuredData: {
          type: 'stats_summary',
          summary: rates.map((r) => ({
            title: r.section,
            value: `${r.rate.toFixed(1)}%`,
            badge: `${r.present}/${r.total} checked in`,
          })),
        },
      };
    }
  }

  // 5. "Show absent students" (overall)
  if (mentionsAbsent) {
    const allAbsent = students.filter((s) => s.status === 'Absent');
    return {
      id,
      sender: 'assistant',
      text: `There are **${allAbsent.length}** absent student(s) across all campus sections:`,
      timestamp,
      structuredData: {
        type: 'student_list',
        students: allAbsent,
      },
    };
  }

  // 6. "List high priority volunteer tasks" or "volunteer" or "tasks"
  if (query.includes('volunteer') || query.includes('task') || query.includes('priority') || query.includes('kanban')) {
    const highPriorityOnly = query.includes('high priority') || query.includes('critical') || query.includes('urgent');
    const matchedTasks = highPriorityOnly
      ? tasks.filter((t) => t.priority === 'High')
      : tasks;

    return {
      id,
      sender: 'assistant',
      text: highPriorityOnly
        ? `Here are the **${matchedTasks.length} High-Priority** volunteer event tasks requiring coordinator attention:`
        : `Active event responsibility roster (${tasks.length} total tasks):`,
      timestamp,
      structuredData: {
        type: 'task_list',
        tasks: matchedTasks,
      },
    };
  }

  // 7. Search for a specific student name or roll number
  const singleStudent = students.find(
    (s) =>
      query.includes(s.name.toLowerCase()) ||
      query.includes(s.rollNumber.toLowerCase())
  );
  if (singleStudent) {
    return {
      id,
      sender: 'assistant',
      text: `Found record for **${singleStudent.name}** (${singleStudent.rollNumber}): Currently **${singleStudent.status}** in **${singleStudent.section}** (Check-in time: ${singleStudent.checkInTime || 'None logged'}).`,
      timestamp,
      structuredData: {
        type: 'student_list',
        students: [singleStudent],
      },
    };
  }

  // Default fallback query response grounded in live context
  const totalStudents = students.length;
  const presentStudents = students.filter((s) => s.status === 'Present').length;
  const rate = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) : '0';

  return {
    id,
    sender: 'assistant',
    text: `I evaluated your question against the **current active roster** (${totalStudents} students, ${rate}% attendance) and **${tasks.length} volunteer tasks**. Try asking: "Show absent students in Section C", "Summarize overall attendance rate", or "List high priority volunteer tasks".`,
    timestamp,
  };
}
