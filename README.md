# Smart Campus & Event Operations Assistant 🎓⚡

> **Streamlining campus rosters & event coordination in real time.**  
> A production-ready, active-state operations dashboard tailored for a 4-day campus hackathon submission. Built with React 19, Vite, TypeScript, Tailwind CSS, and Liquid Glassmorphism.

---

## 🌟 Key Highlights & Features

### 1. 🌌 Cinematic Dark & Liquid Glassmorphism UI
- **Custom Design System**: Pitch-black canvas (`#000000`) paired with frosted, high-contrast glassmorphism (`.liquid-glass-strong`).
- **Typography**:
  - Headings: `Instrument Serif` (italic, elegant, high-impact)
  - Body & UI: `Barlow` (clean, modern, legible)
- **Background Video Stream**: Live HLS background video integration powered by `hls.js`, gracefully masked with top and bottom 200px black-to-transparent linear-gradient fades for seamless ambient depth.

### 2. 📊 Hero Header & Live Operational Stats
- **Real-Time Synchronized Metrics**:
  - **Total Enrolled**: Instant attendee count across all campus sections.
  - **Present & Checked In**: Live verified headcount with pulsing active indicator.
  - **Absent / Pending**: Immediate tracking of missing participants requiring follow-up.
  - **Attendance Rate**: Live percentage gauge with threshold goal indicator.
- Interactive cards: Click any stat card to instantly filter the roster table!

### 3. 📋 Roster Manager & Multi-Modal Document Ingestion
- **Document Dropzone**: Ingest rosters via `.csv` file uploads parsed in browser with `papaparse`, or simulate camera/scanner OCR extractions of physical sign-in sheets.
- **Interactive Verification Table**:
  - Instant **Present/Absent pill badge toggle**: Clicking toggles attendance state immediately and recalculates all metrics and AI memory across the app.
  - Live search by Roll Number, Full Name, or Email.
  - Section filtering (All, Section A, Section B, Section C, Section D).
  - Attendance status filtering (`All`, `Present`, `Absent`).
  - Action tools: "Export CSV", "Add Student" modal, "OCR Scan Sheet", and "Reset Roster".

### 4. 🧠 AI Natural Language Operations Query Terminal
- **Active-State Reasoning Engine**: Evaluates natural language coordinator questions directly against the **current live roster state in memory**.
- **Interactive Suggestion Chips**:
  - *"Show absent students in Section C"*
  - *"Summarize overall attendance rate"*
  - *"Which section has the highest attendance?"*
  - *"List high priority volunteer tasks"*
- **Rich Structured Responses**: Formats answers with interactive student cards (including direct status toggle buttons!), stat pills, and priority task summaries.

### 5. 📌 Volunteer Task Assigner (Kanban Board)
- **3 Operational Lanes**:
  - **Pending Assignment**
  - **In Progress / Active**
  - **Completed & Signed-Off**
- Pre-seeded with crucial campus logistics: *Crowd Control at Main Entrance*, *Ticketing Desk & Kit Distribution*, *Certificate Distribution Prep*, *Stage Audio & Visual Check*, *VIP Escort & Refreshments*.
- Single-click **Advance** and **Back** workflow transitions.
- Filter by Status or Priority (`High`, `Medium`, `Low`).
- "New Responsibility" modal dialog to dispatch custom tasks to volunteers.

### 6. 🚀 Minimal CTA & Footer
- Headline: *"Your event operations, simplified."*
- Actions: **Launch Assistant** (smooth scroll to AI terminal) and **View Documentation** (interactive system manual modal).
- Minimal bottom footer with `© 2026 Studio. All rights reserved.` and `"Privacy"` / `"Terms"` links.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom fonts and liquid glassmorphism components
- **Streaming**: `hls.js` (Mux HLS stream integration)
- **Data Ingestion**: `papaparse` (client-side CSV parsing)
- **Icons**: `lucide-react`

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ or v24 LTS recommended)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/AkshanshPundir/PlainText.git
cd PlainText

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Architecture

```
smart-campus-assistant/
├── index.html                  # Google Fonts link & root mount
├── package.json                # Dependencies & build scripts
├── tailwind.config.ts          # Custom font families & glass colors
├── postcss.config.js           # Tailwind PostCSS configuration
├── vite.config.ts              # Vite configuration
├── src/
│   ├── index.css               # .liquid-glass-strong styles & border gradient mask
│   ├── main.tsx                # React application entrypoint
│   ├── App.tsx                 # Master layout combining all 5 modules with unified state
│   ├── types/
│   │   └── index.ts            # Student, VolunteerTask, ChatMessage, and Metric interfaces
│   ├── data/
│   │   └── mockData.ts         # Pre-seeded campus roster, tasks, and suggestion chips
│   ├── utils/
│   │   └── aiQueryEngine.ts    # Coordinator natural language evaluator against live memory
│   └── components/
│       ├── BackgroundVideo.tsx # HLS background video stream with 200px black gradient blends
│       ├── Navbar.tsx          # Top navbar with live event badge
│       ├── HeroStats.tsx       # Instrument Serif italic headline + 4 live metric cards
│       ├── RosterManager.tsx   # Document ingestion, search, filter, and interactive table
│       ├── AiQueryInterface.tsx# Liquid glass chat card with suggestion chips & structured cards
│       ├── VolunteerBoard.tsx  # Kanban board with task advancement & assignment modal
│       └── CtaFooter.tsx       # CTA section with documentation modal and minimal footer
```

---

## 📜 License & Acknowledgements

Created for the 4-Day Campus Hackathon. Distributed under the MIT License.
&copy; 2026 Studio. All rights reserved.
