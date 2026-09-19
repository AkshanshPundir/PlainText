import React, { useState, useId, useMemo } from 'react';
import Papa from 'papaparse';
import {
  Upload,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Download,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  ScanLine,
  Trash2,
  Clock,
  Check,
  X,
} from 'lucide-react';
import type { Student, AttendanceStatus } from '../types';

interface RosterManagerProps {
  students: Student[];
  onToggleStatus: (id: string) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onImportStudents: (newStudents: Student[]) => void;
  onResetRoster: () => void;
  statusFilter: 'All' | 'Present' | 'Absent';
  setStatusFilter: (filter: 'All' | 'Present' | 'Absent') => void;
}

export const RosterManager: React.FC<RosterManagerProps> = ({
  students,
  onToggleStatus,
  onAddStudent,
  onDeleteStudent,
  onImportStudents,
  onResetRoster,
  statusFilter,
  setStatusFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newSection, setNewSection] = useState('Section C');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('Present');

  const fileInputId = useId();

  // Distinct sections
  const sections = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.section))).sort();
    return ['All', ...list];
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSection = selectedSection === 'All' || s.section === selectedSection;
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;

      return matchSearch && matchSection && matchStatus;
    });
  }, [students, searchQuery, selectedSection, statusFilter]);

  // Handle CSV upload via PapaParse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed: Student[] = [];
          results.data.forEach((row: any, idx: number) => {
            const roll = row['Roll Number'] || row['rollNumber'] || row['Roll'] || `CS-2026-${100 + idx}`;
            const name = row['Full Name'] || row['Name'] || row['name'] || `Attendee ${idx + 1}`;
            const section = row['Section'] || row['section'] || 'Section C';
            const statusRaw = (row['Status'] || row['Attendance'] || 'Present').toLowerCase();
            const status: AttendanceStatus = statusRaw.includes('absent') ? 'Absent' : 'Present';
            const email = row['Email'] || `${roll.toLowerCase()}@campus.edu`;

            parsed.push({
              id: `csv-${Date.now()}-${idx}`,
              rollNumber: roll,
              name,
              section,
              status,
              email,
              checkInTime: status === 'Present' ? 'Just now' : undefined,
              department: row['Department'] || 'General Studies',
            });
          });

          if (parsed.length > 0) {
            onImportStudents(parsed);
            setScanMessage(`Successfully imported ${parsed.length} attendees from CSV.`);
            setTimeout(() => setScanMessage(null), 4000);
          }
        },
        error: (err) => {
          console.error(err);
          setScanMessage('Failed to parse CSV file. Please check structure.');
          setTimeout(() => setScanMessage(null), 4000);
        },
      });
    } else {
      // Scanned image / document handling
      handleSimulatedOcrScan(file.name);
    }
  };

  // Simulate OCR scan for images / PDF sheets
  const handleSimulatedOcrScan = (filename = 'Scanned_Sheet_Section_C.jpg') => {
    setIsScanning(true);
    setScanMessage(`Scanning sheet: "${filename}" with OCR model...`);

    setTimeout(() => {
      const generatedStudents: Student[] = [
        {
          id: `ocr-${Date.now()}-1`,
          rollNumber: 'CS-2026-091',
          name: 'Meera Chawla (Scanned)',
          section: 'Section C',
          status: 'Present',
          email: 'meera.c@campus.edu',
          checkInTime: '09:18 AM',
          department: 'Information Systems',
        },
        {
          id: `ocr-${Date.now()}-2`,
          rollNumber: 'CS-2026-092',
          name: 'Pravin Nambiar (Scanned)',
          section: 'Section C',
          status: 'Absent',
          email: 'pravin.n@campus.edu',
          department: 'Information Systems',
        },
        {
          id: `ocr-${Date.now()}-3`,
          rollNumber: 'CS-2026-093',
          name: 'Kavita Sundaram (Scanned)',
          section: 'Section C',
          status: 'Present',
          email: 'kavita.s@campus.edu',
          checkInTime: '09:22 AM',
          department: 'Data Science',
        },
      ];

      onImportStudents(generatedStudents);
      setIsScanning(false);
      setScanMessage(`OCR extraction complete: 3 records recovered from "${filename}".`);
      setTimeout(() => setScanMessage(null), 4500);
    }, 1800);
  };

  // Export current roster to CSV
  const handleExportCsv = () => {
    const exportData = filteredStudents.map((s) => ({
      'Roll Number': s.rollNumber,
      'Full Name': s.name,
      Section: s.section,
      Status: s.status,
      Email: s.email,
      'Check-in Time': s.checkInTime || 'N/A',
      Department: s.department || 'N/A',
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Manual Student Submit
  const handleSubmitNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll || !newName) return;

    const student: Student = {
      id: `manual-${Date.now()}`,
      rollNumber: newRoll.trim(),
      name: newName.trim(),
      section: newSection,
      status: newStatus,
      email: newEmail.trim() || `${newRoll.toLowerCase().replace(/\s+/g, '')}@campus.edu`,
      checkInTime: newStatus === 'Present' ? 'Just now' : undefined,
      department: 'Campus Hackathon Entry',
    };

    onAddStudent(student);
    setNewRoll('');
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  return (
    <section id="roster-section" className="relative z-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <ScanLine className="w-4 h-4" />
            <span className="uppercase tracking-widest">Module 01 // Roster Ingestion & Verification</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight font-body">
            Roster Manager & Verification Desk
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl font-body">
            Reconcile physical badge taps, upload digital spreadsheets, or toggle attendance statuses with instant state sync.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleSimulatedOcrScan()}
            disabled={isScanning}
            className="liquid-pill-btn px-3.5 py-2 rounded-xl text-xs font-medium text-cyan-300 flex items-center gap-1.5 disabled:opacity-50"
            title="Simulate paper attendance sheet scan with OCR"
          >
            <ScanLine className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Sheet...' : 'OCR Scan Sheet'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="liquid-pill-btn px-3.5 py-2 rounded-xl text-xs font-medium text-white/90 flex items-center gap-1.5"
            title="Download visible records as CSV"
          >
            <Download className="w-4 h-4 text-white/70" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white text-black hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-lg shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onResetRoster}
            className="liquid-pill-btn p-2 rounded-xl text-xs text-white/50 hover:text-white"
            title="Reset to default mock roster"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification banner for OCR / CSV */}
      {scanMessage && (
        <div className="mb-6 p-3.5 rounded-xl liquid-glass-strong border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{scanMessage}</span>
          </div>
          <button onClick={() => setScanMessage(null)} className="text-cyan-400/60 hover:text-cyan-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Document Ingestion Dropzone */}
      <div className="mb-8">
        <label
          htmlFor={fileInputId}
          className="liquid-glass-strong border border-dashed border-white/20 hover:border-white/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:bg-white/10 transition-all">
            <Upload className="w-6 h-6 text-white/70 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h4 className="mt-3 text-sm sm:text-base font-medium text-white group-hover:text-cyan-300 transition-colors">
            Drop CSV Rosters or Scanned Sheets
          </h4>
          <p className="mt-1 text-xs text-white/50 max-w-md font-body">
            Upload CSV rosters for auto-parsing with PapaParse, or upload attendance sheet photos to trigger our OCR extractor.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-white/40">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 flex items-center gap-1">
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> .CSV
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 flex items-center gap-1">
              <ScanLine className="w-3 h-3 text-cyan-400" /> .PNG / .JPG / .PDF
            </span>
          </div>
          <input
            id={fileInputId}
            type="file"
            accept=".csv,image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="liquid-glass-strong rounded-2xl p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Roll Number, Full Name, or Email..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls: Section Dropdown & Status Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Section Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              aria-label="Filter by Section"
              className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec} className="bg-neutral-900 text-white">
                  {sec === 'All' ? 'All Sections' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {(['All', 'Present', 'Absent'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  statusFilter === st
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Data Table in liquid-glass-strong */}
      <div className="liquid-glass-strong rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-white/50">
                <th className="py-3.5 px-4 sm:px-6">Roll Number</th>
                <th className="py-3.5 px-4 sm:px-6">Full Name</th>
                <th className="py-3.5 px-4 sm:px-6">Section</th>
                <th className="py-3.5 px-4 sm:px-6">Check-in Status</th>
                <th className="py-3.5 px-4 sm:px-6">Time / Info</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-body">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    No attendee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isPresent = student.status === 'Present';
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Roll Number */}
                      <td className="py-4 px-4 sm:px-6 font-mono text-xs text-white/90 font-medium">
                        {student.rollNumber}
                      </td>

                      {/* Full Name & Email */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-medium text-white group-hover:text-cyan-200 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-white/40 font-body">
                          {student.email}
                        </div>
                      </td>

                      {/* Section */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80">
                          {student.section}
                        </span>
                      </td>

                      {/* Interactive Attendance Status Pill Toggle */}
                      <td className="py-4 px-4 sm:px-6">
                        <button
                          onClick={() => onToggleStatus(student.id)}
                          className={`group/pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                            isPresent
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                          }`}
                          title="Click to toggle Present/Absent"
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Present</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Absent</span>
                            </>
                          )}
                          <span className="text-[10px] opacity-40 ml-1 group-hover/pill:opacity-100 transition-opacity">
                            (toggle)
                          </span>
                        </button>
                      </td>

                      {/* Check-in Time / Info */}
                      <td className="py-4 px-4 sm:px-6 text-xs text-white/60">
                        {student.checkInTime ? (
                          <div className="flex items-center gap-1.5 font-mono text-white/70">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{student.checkInTime}</span>
                          </div>
                        ) : (
                          <span className="text-white/30 italic">Not logged</span>
                        )}
                      </td>

                      {/* Action controls */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleStatus(student.id)}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            title={isPresent ? 'Mark Absent' : 'Mark Present'}
                          >
                            {isPresent ? (
                              <X className="w-4 h-4 text-rose-400" />
                            ) : (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/10 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 font-body gap-2">
          <div>
            Showing <span className="text-white font-medium">{filteredStudents.length}</span> of{' '}
            <span className="text-white font-medium">{students.length}</span> enrolled attendees
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-emerald-400">
              Present: {filteredStudents.filter((s) => s.status === 'Present').length}
            </span>
            <span className="text-rose-400">
              Absent: {filteredStudents.filter((s) => s.status === 'Absent').length}
            </span>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="liquid-glass-strong w-full max-w-md rounded-2xl p-6 border border-white/20 shadow-2xl relative animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white font-body">Add New Student</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewStudent} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-2026-055"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Section
                  </label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5 font-mono">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. student@campus.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/40"
                />
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
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
