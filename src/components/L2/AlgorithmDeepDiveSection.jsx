import React from 'react';
import { Cpu } from 'lucide-react';

const AlgorithmDeepDiveSection = ({ sections = [] }) => {
  const algorithms = sections.filter((s) => s.type === 'algorithm_deep_dive');
  if (algorithms.length === 0) return null;

  return (
    <section className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif' }}>
      <header className="mb-12">
        <div className="flex items-center gap-3">
          <Cpu className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Algorithms
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]" style={{ fontSize: 'var(--text-header)' }}>
          CPU Scheduling Deep Dives
        </h2>
      </header>

      <div className="space-y-12 divide-y divide-black/[0.06]">
        {algorithms.map((algo, idx) => (
          <div key={idx} className="pt-10 first:pt-0">
            <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>
              {algo.algorithm}
            </h3>
            <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
              {algo.description}
            </p>

            {algo.rules && (
              <div className="mt-6 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
                <h4 className="font-semibold text-[#1d1d1f]" style={{ fontSize: 'var(--text-body)' }}>Execution Rules</h4>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#6e6e73]">
                  {algo.rules.map((rule, i) => (
                    <li key={i}>• {rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {algo.types && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {algo.types.map((t, i) => (
                  <div key={i} className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xs">
                    <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>{t.mode} Mode</h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#6e6e73] leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            )}

            {algo.drawbacks && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {algo.drawbacks.map((d, i) => (
                  <div key={i} className={`rounded-2xl border p-5 ${d.issue ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
                    <h4 className={`font-semibold ${d.issue ? 'text-red-900' : 'text-emerald-900'}`} style={{ fontSize: 'var(--text-body)' }}>
                      {d.issue ? d.issue : 'Solution'}
                    </h4>
                    <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${d.issue ? 'text-red-800' : 'text-emerald-800'}`}>{d.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlgorithmDeepDiveSection;