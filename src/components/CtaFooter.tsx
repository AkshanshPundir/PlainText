import { useState } from 'react';
import { ArrowUpRight, BookOpen, X, Sparkles } from 'lucide-react';

export const CtaFooter: React.FC = () => {
  const [showDocsModal, setShowDocsModal] = useState(false);

  const handleLaunchAssistant = () => {
    const el = document.getElementById('ai-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-20">
      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="liquid-glass-strong rounded-3xl p-10 sm:p-16 border border-white/15 relative overflow-hidden shadow-2xl">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* Heading in Instrument Serif italic */}
          <h2 className="font-heading italic text-4xl sm:text-6xl text-white font-normal tracking-wide leading-tight mb-4">
            Your event operations, simplified.
          </h2>

          {/* Subtext */}
          <p className="font-body text-base sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Instant roster management, automated verification, and real-time coordinator insights.
          </p>

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Launch Assistant - Liquid Glass Pill */}
            <button
              onClick={handleLaunchAssistant}
              className="liquid-pill-btn px-8 py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 group w-full sm:w-auto shadow-lg"
            >
              <span>Launch Assistant</span>
              <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* View Documentation - Solid White Pill */}
            <button
              onClick={() => setShowDocsModal(true)}
              className="px-8 py-3.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto shadow-xl shadow-white/10"
            >
              <span>View Documentation</span>
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Footer Bar */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-white/50">
          {/* Left: © 2026 Studio. All rights reserved. */}
          <div>
            &copy; 2026 Studio. All rights reserved.
          </div>

          {/* Right: Navigation links for "Privacy" and "Terms" ONLY */}
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy Policy: All attendee data processed locally in runtime memory.');
              }}
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                alert('Terms of Service: Distributed for 4-Day Campus Hackathon evaluation.');
              }}
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>

      {/* Documentation Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="liquid-glass-strong w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white font-body">
                  Operations Assistant Documentation
                </h3>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm text-white/80 font-body leading-relaxed">
              <div>
                <h4 className="font-semibold text-white text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  System Architecture
                </h4>
                <p className="text-white/60 text-xs sm:text-sm">
                  Smart Campus & Event Operations Assistant is an active-state event management cockpit built for high-throughput 4-day hackathons.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-medium text-white text-xs uppercase font-mono text-cyan-300">
                    1. Roster Synchronization & Ingestion
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Accepts standard CSV file uploads via PapaParse or simulated OCR captures of handwritten sign-in sheets. Interactive Present/Absent badges toggle instantaneously with optimistic UI recalculation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-medium text-white text-xs uppercase font-mono text-cyan-300">
                    2. Dynamic AI Query Engine
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Evaluates natural language questions directly against live operational memory. Try asking:
                    <br />• <i>&ldquo;Show absent students in Section C&rdquo;</i>
                    <br />• <i>&ldquo;Summarize overall attendance rate&rdquo;</i>
                    <br />• <i>&ldquo;Which section has the highest turnout?&rdquo;</i>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-medium text-white text-xs uppercase font-mono text-cyan-300">
                    3. Volunteer Dispatch Kanban
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Enables real-time task movement between Pending, In Progress, and Completed states. Critical operations such as crowd control and certificate verification are prioritized with color-coded tags.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-medium text-white text-xs uppercase font-mono text-cyan-300">
                    4. Visual & Audio/Video Layer
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Runs HLS background streaming via hls.js with top and bottom 200px black-to-transparent gradient blend masks and frosted Liquid Glassmorphism styling.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowDocsModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90"
                >
                  Close Reference
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
