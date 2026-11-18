import React from 'react';
import { Activity } from 'lucide-react';

const CpuUtilizationSection = ({ sections = [] }) => {
  const util = sections.find((s) => s.type === 'numerical_concepts');
  if (!util) return null;

  return (
    <section className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif' }}>
      <header>
        <div className="flex items-center gap-3">
          <Activity className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Performance Metrics
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]" style={{ fontSize: 'var(--text-header)' }}>
          {util.title}
        </h2>
        <p className="mt-4 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
          {util.definition}
        </p>
      </header>

      {/* Formulas */}
      <div className="mt-12 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
        <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>Mathematical Formulas</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-black/[0.08] bg-gray-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">CPU Utilization</span>
            <p className="mt-1 font-mono text-xs sm:text-sm font-semibold text-[#111d4a]">{util.formula.cpu_utilization}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-gray-50/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Idle Time %</span>
            <p className="mt-1 font-mono text-xs sm:text-sm font-semibold text-[#92140c]">{util.formula.idle_time_percentage}</p>
          </div>
        </div>
        <p className="mt-6 text-xs sm:text-sm text-[#6e6e73] leading-relaxed border-t border-black/[0.06] pt-4">
          {util.example_explanation}
        </p>
      </div>
    </section>
  );
};

export default CpuUtilizationSection;