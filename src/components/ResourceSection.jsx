import React from 'react';
import { FileText, Presentation, Download, FolderDown } from 'lucide-react';

// Put the files in:  public/downloads/   (served at /downloads/<filename>)
// [name, category, size, filename]  (type is taken from the file extension)
const resources = [
  ['OS Note by Kulsuma (Mid)', 'Lecture Notes', '4.2 MB', 'os-note-kulsuma-mid.pdf'],
  ['OS Note Lecture 1', 'Lecture Notes', '2.8 MB', 'os-note-lecture-1.pdf'],
  ['Deadlock (Banker’s Algorithm)', 'Algorithms', '1.5 MB', 'deadlock-bankers-algorithm.pdf'],
  ['Deadlocks Complete Guide', 'Lectures', '3.1 MB', 'deadlocks.pdf'],
  ['Deadlocks Part 1 & 2', 'Lectures', '2.4 MB', 'deadlocks-1.pdf'],
  ['Deadlock Recovery', 'Advanced Topics', '1.9 MB', 'deadlock-recovery.pdf'],
  ['Chapter 1 Introduction Slides', 'Presentation Slides', '5.6 MB', 'ch1.ppt'],
  ['CPU Scheduling Sample Exercises', 'Practice Material', '1.2 MB', 'cpu-scheduling-exercises.pdf'],
  ['Processes Overview', 'Lecture Notes', '2.1 MB', 'processes.pdf'],
  ['CPU Scheduling (FCFS)', 'Presentation Slides', '4.8 MB', 'cpu-scheduling-fcfs.pptx'],
  ['CPU Scheduling (Math & Formulas)', 'Presentation Slides', '3.5 MB', 'cpu-scheduling-math.pptx'],
].map(([name, category, size, filename]) => ({
  name,
  category,
  size,
  filename,
  type: filename.split('.').pop().toUpperCase(),
  href: `/downloads/${filename}`,
}));

const ResourceSection = () => (
  <section
    className="mx-auto max-w-[960px] px-6 py-16 text-[#1d1d1f]"
    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
  >
    <header className="flex flex-col items-start gap-3 border-b border-black/[0.06] pb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111d4a]/[0.06] text-[#111d4a]">
            <FolderDown className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Course Hub
          </span>
        </div>
        <h2 className="mt-3 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>
          Downloadable Resources
        </h2>
        <p className="mt-2 text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
          Access and download all lecture notes, slides, and practice problem sets directly.
        </p>
      </div>
      <span className="rounded-xl bg-black/[0.04] px-4 py-2 font-mono font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>
        {resources.length} Files Available
      </span>
    </header>

    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      {resources.map(({ name, category, type, size, filename, href }) => {
        const isPdf = type === 'PDF';
        const Icon = isPdf ? FileText : Presentation;
        return (
          <div
            key={filename}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-black/[0.08] bg-white p-5 transition-all hover:border-black/[0.16] hover:shadow-md"
          >
            <div className="flex items-start gap-4 overflow-hidden">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                  isPdf ? 'border-red-200 bg-red-50 text-[#92140c]' : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#8e8e93]">{category}</span>
                <h3
                  className="truncate font-semibold transition-colors group-hover:text-[#111d4a]"
                  style={{ fontSize: 'var(--text-body)' }}
                  title={name}
                >
                  {name}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-[#8e8e93]">{type} • {size}</p>
              </div>
            </div>

            <a
              href={href}
              download={filename}
              title={`Download ${name}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] transition-all hover:bg-[#111d4a] hover:text-white"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        );
      })}
    </div>
  </section>
);

export default ResourceSection;