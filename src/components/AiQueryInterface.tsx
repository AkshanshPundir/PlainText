import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  ListTodo,
  RotateCcw,
} from 'lucide-react';
import type { Student, VolunteerTask, ChatMessage } from '../types';
import { processCoordinatorQuery } from '../utils/aiQueryEngine';
import { SUGGESTION_PROMPTS } from '../data/mockData';

interface AiQueryInterfaceProps {
  students: Student[];
  tasks: VolunteerTask[];
  onToggleStudentStatus?: (id: string) => void;
}

export const AiQueryInterface: React.FC<AiQueryInterfaceProps> = ({
  students,
  tasks,
  onToggleStudentStatus,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello, Coordinator. I am your Smart Campus Event Intelligence Assistant. I have live access to your active roster and operational task board. How can I assist you with today’s event flow?',
      timestamp: '09:00 AM',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    // Realistic typing / thinking simulation (350ms - 550ms for snappy response)
    setTimeout(() => {
      const response = processCoordinatorQuery(query, students, tasks);
      setMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. Connected to live operational roster state. What would you like to query?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <section id="ai-section" className="relative z-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-widest">Module 02 // Natural Language Reasoning Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight font-body">
            AI Operations Query Terminal
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl font-body">
            Ask plain-English questions about student roll numbers, section turnout bottlenecks, or volunteer coverage. Answers evaluate live memory dynamically.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          className="liquid-pill-btn px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
          title="Clear chat messages"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-white/40 mb-2 font-mono flex items-center gap-1.5">
          <span>Suggested Coordinator Prompts</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="liquid-glass-strong hover:bg-white/10 text-white/80 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-body border border-white/10 hover:border-white/20 transition-all text-left flex items-center gap-1.5 group shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Terminal in liquid-glass-strong */}
      <div className="liquid-glass-strong rounded-3xl border border-white/15 overflow-hidden flex flex-col h-[520px] sm:h-[560px] shadow-2xl">
        {/* Terminal Header Bar */}
        <div className="px-6 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-white/80 font-medium">
              GEMINI_NEURAL_ROSTER_AGENT // ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-white/40">
            <span>Roster Nodes: {students.length}</span>
            <span>|</span>
            <span>Task Nodes: {tasks.length}</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-body">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border text-xs ${
                    isUser
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col space-y-2 max-w-[88%] sm:max-w-xl">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-white text-black font-medium rounded-tr-none shadow-lg'
                        : 'bg-white/[0.04] text-white/90 border border-white/10 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Structured Content: Student List */}
                    {msg.structuredData?.type === 'student_list' && msg.structuredData.students && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {msg.structuredData.students.length === 0 ? (
                          <div className="text-xs text-white/50 italic">No records to display.</div>
                        ) : (
                          msg.structuredData.students.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 text-xs"
                            >
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1.5">
                                  <span>{student.name}</span>
                                  <span className="font-mono text-[10px] text-white/50">
                                    ({student.rollNumber})
                                  </span>
                                </div>
                                <div className="text-[11px] text-white/50">{student.section}</div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    student.status === 'Present'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  }`}
                                >
                                  {student.status === 'Present' ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-rose-400" />
                                  )}
                                  {student.status}
                                </span>

                                {onToggleStudentStatus && (
                                  <button
                                    onClick={() => onToggleStudentStatus(student.id)}
                                    className="text-[10px] text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-white/15 transition-all"
                                  >
                                    Toggle
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Structured Content: Stats Summary Pills */}
                    {msg.structuredData?.type === 'stats_summary' && msg.structuredData.summary && (
                      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                        {msg.structuredData.summary.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/40 border border-white/10"
                          >
                            <div className="text-[10px] uppercase font-mono text-white/50">
                              {item.title}
                            </div>
                            <div className="text-base font-bold text-white mt-0.5 font-body flex items-baseline justify-between">
                              <span>{item.value}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structured Content: Task List */}
                    {msg.structuredData?.type === 'task_list' && msg.structuredData.tasks && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        {msg.structuredData.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{task.title}</span>
                              </div>
                              <div className="text-[11px] text-white/50 mt-0.5">
                                Assigned to: <span className="text-white/80">{task.assignee}</span> • {task.location}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                  task.priority === 'High'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {task.priority}
                              </span>
                              <span className="text-[10px] text-white/40">{task.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span
                    className={`text-[10px] font-mono text-white/40 px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3 items-center mr-auto">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white/60 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Evaluating active memory & calculating metrics...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (e.g. 'Show absent students in Section C' or 'Summarize overall attendance rate')..."
              className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-body"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isThinking}
              className="absolute right-2 p-2 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-md"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
