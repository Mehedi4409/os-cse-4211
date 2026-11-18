import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

const SchedulingComparisonsSection = ({ sections = [] }) => {
  const compSection = sections.find((s) => s.type === 'comparisons');
  if (!compSection) return null;

  const [preNonPre, convoyStarv] = compSection.comparisons;

  return (
    <section className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif' }}>
      <header>
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Comparisons
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]" style={{ fontSize: 'var(--text-header)' }}>
          Scheduling Trade-offs & Phenomena
        </h2>
      </header>

      {/* Preemptive vs Non-Preemptive */}
      <div className="mt-12">
        <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{preNonPre.topic}</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
            <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>Preemptive</h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#6e6e73]">
              {preNonPre.preemptive.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
            <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>Non-Preemptive</h4>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#6e6e73]">
              {preNonPre.non_preemptive.map((np, i) => (
                <li key={i}>• {np}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Convoy Effect vs Starvation */}
      <div className="mt-12 border-t border-black/[0.06] pt-10">
        <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>Convoy Effect vs. Starvation</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <h4 className="font-semibold text-amber-900" style={{ fontSize: 'var(--text-body)' }}>Convoy Effect</h4>
            <p className="mt-2 text-xs sm:text-sm text-amber-800 leading-relaxed">{convoyStarv.convoy_effect}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
            <h4 className="font-semibold text-red-900" style={{ fontSize: 'var(--text-body)' }}>Starvation</h4>
            <p className="mt-2 text-xs sm:text-sm text-red-800 leading-relaxed">{convoyStarv.starvation}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulingComparisonsSection;