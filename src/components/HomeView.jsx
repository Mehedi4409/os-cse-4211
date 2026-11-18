import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Cpu } from 'lucide-react';

const NOTES_FILE = 'os-note-kulsumma-mid.pdf'; // must match the file in public/downloads

// --- Animation Configuration & Helper ---
const EASING = [0.16, 1, 0.3, 1];

const getEntranceAnimation = (delay = 0, yOffset = 20, duration = 0.7) => ({
  initial: { opacity: 0, y: yOffset },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASING },
});

const BUTTON_INTERACTION = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
};

// --- Single-Responsibility Sub-Components ---
const ArchitectureBadge = () => (
  <motion.div
    {...getEntranceAnimation(0, -15, 0.6)}
    className="mb-6 inline-flex items-center gap-2"
  >
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111d4a] text-white">
      <Cpu className="h-3 w-3" />
    </div>
    <span className="text-xs font-medium tracking-wide text-gray-600">
      Interactive OS Architecture
    </span>
  </motion.div>
);

const HeroHeader = () => (
  <>
    <motion.h1
      {...getEntranceAnimation(0.1, 20, 0.7)}
      className="font-extrabold tracking-tight text-gray-900"
      style={{ fontSize: 'clamp(2.25rem, 5vw + 1rem, 4rem)', lineHeight: '1.1' }}
    >
      Master Operating Systems <br />
      <span className="bg-gradient-to-r from-[#111d4a] to-[#92140c] bg-clip-text text-transparent">
        Visually & Interactively
      </span>
    </motion.h1>

    <motion.p
      {...getEntranceAnimation(0.2, 20, 0.7)}
      className="mt-6 max-w-xl text-gray-500"
      style={{ fontSize: 'clamp(1rem, 1vw + 0.5rem, 1.15rem)', lineHeight: '1.6' }}
    >
      Explore kernel internals, process synchronization, and CPU scheduling through real-time
      front-end simulations designed for clarity.
    </motion.p>
  </>
);

const ActionButton = ({ variant = 'primary', onClick, children }) => {
  const styles = {
    primary:
      'bg-[#111d4a] text-white shadow-lg shadow-[#111d4a]/15 hover:bg-[#111d4a]/90',
    secondary:
      'border border-gray-200 bg-white text-gray-700 shadow-xs hover:border-[#92140c]/40 hover:text-[#92140c]',
  };

  return (
    <motion.button
      {...BUTTON_INTERACTION}
      type="button"
      onClick={onClick}
      className={`group relative inline-flex w-full sm:w-64 items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-semibold transition-all ${styles[variant]}`}
    >
      {children}
    </motion.button>
  );
};

const ActionGroup = ({ onStartLecture, onDownloadNotes }) => (
  <motion.div
    {...getEntranceAnimation(0.3, 25, 0.8)}
    className="mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-4 px-4"
  >
    <ActionButton variant="primary" onClick={onStartLecture}>
      <span>Start Lecture 1</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </ActionButton>

    <ActionButton variant="secondary" onClick={onDownloadNotes}>
      <Download className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#92140c]" />
      <span>Download Hand Notes</span>
    </ActionButton>
  </motion.div>
);

// --- Main View Component ---
const HomeView = ({ onStartLecture }) => {
  const handleDownloadHandNotes = () => {
    const a = document.createElement('a');
    a.href = `/downloads/${NOTES_FILE}`;
    a.download = NOTES_FILE;
    a.click();
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-white px-6 py-12 text-gray-900 selection:bg-[#92140c]/10 selection:text-[#92140c]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40">
        <div className="h-[30vw] w-[30vw] rounded-full bg-gradient-to-tr from-[#111d4a]/5 to-[#92140c]/5 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <ArchitectureBadge />
        <HeroHeader />
        <ActionGroup
          onStartLecture={onStartLecture}
          onDownloadNotes={handleDownloadHandNotes}
        />
      </div>
    </div>
  );
};

export default HomeView;