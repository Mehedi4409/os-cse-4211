import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const ConvoyEffectSection = ({ section }) => {
  if (!section) return null;

  const comp = section.solution.comparison;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <header>
        <h2
          className="font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {section.title}
        </h2>
      </header>

      {/* Convoy Effect Problem Breakdown */}
      <div className="mt-10 rounded-2xl bg-[#92140c]/[0.04] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-[#92140c]" />
          <h3
            className="font-semibold text-[#92140c]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            {section.problem.name}
          </h3>
        </div>
        <p
          className="mt-3 leading-relaxed text-[#3a3a3c]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {section.problem.definition}
        </p>
        <ul
          className="mt-4 list-disc pl-5 space-y-2 text-[#3a3a3c]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {section.problem.consequences.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* SJF Resolution */}
      <div className="mt-12 border-t border-black/[0.06] pt-10">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-[#111d4a]" />
          <h3
            className="font-semibold text-[#111d4a]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            {section.solution.name}
          </h3>
        </div>
        <p
          className="mt-3 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {section.solution.mechanism}
        </p>

        {/* Visual Comparison Box */}
        <div className="mt-8 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xs">
          <span
            className="font-medium text-[#8e8e93]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            Workload Comparison (P1: 24, P2: 3, P3: 3)
          </span>

          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs text-gray-500">
                <span>FCFS Strategy</span>
                <span className="font-semibold text-[#92140c]">Avg WT: {comp.fcfs_avg_wt}</span>
              </div>
              <div className="flex h-10 w-full overflow-hidden rounded-lg border border-black/[0.1] bg-gray-50">
                {comp.fcfs_gantt.map((b, i) => (
                  <div
                    key={i}
                    style={{ width: `${((b.end - b.start) / 30) * 100}%` }}
                    className="flex flex-col items-center justify-center border-r border-black/[0.08] bg-[#111d4a] text-xs font-bold text-white"
                  >
                    {b.process}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between font-mono text-xs text-gray-500">
                <span>SJF Strategy (Shortest Job First)</span>
                <span className="font-semibold text-emerald-700">Avg WT: {comp.sjf_avg_wt}</span>
              </div>
              <div className="flex h-10 w-full overflow-hidden rounded-lg border border-black/[0.1] bg-gray-50">
                {comp.sjf_gantt.map((b, i) => (
                  <div
                    key={i}
                    style={{ width: `${((b.end - b.start) / 30) * 100}%` }}
                    className="flex flex-col items-center justify-center border-r border-black/[0.08] bg-emerald-700 text-xs font-bold text-white"
                  >
                    {b.process}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
            style={{ fontSize: 'var(--text-body)' }}
          >
            <strong>Key Takeaway:</strong> {comp.improvement}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConvoyEffectSection;