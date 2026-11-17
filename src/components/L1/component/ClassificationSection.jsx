import React from 'react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const ClassificationSection = ({ classification }) => {
  if (!classification) return null;

  const enter = (i) => ({
    animation: `classification-rise 700ms ${EASE} both`,
    animationDelay: `${i * 90}ms`,
  });

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes classification-rise {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-classification-enter] { animation: none !important; }
        }
      `}</style>

      {/* Main Header (Subheader * 1.618) */}
      <header data-classification-enter style={enter(0)}>
        <h2
          className="font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {classification.title}
        </h2>
        <p
          className="mt-4 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {classification.description}
        </p>
      </header>

      {/* Categories List */}
      <div data-classification-enter style={enter(1)} className="mt-12">
        <ul className="divide-y divide-black/[0.06] border-t border-b border-black/[0.06]">
          {classification.categories.map((cat, idx) => (
            <li key={idx} className="py-8 first:pt-6 last:pb-6">
              <div className="flex items-baseline justify-between gap-4">
                {/* Subheader (Body * 1.618) */}
                <h3
                  className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
                  style={{ fontSize: 'var(--text-subheader)' }}
                >
                  {cat.type} Scheduling
                </h3>
                <span
                  className="font-mono font-medium text-[#8e8e93]"
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
              </div>

              <p
                className="mt-2.5 leading-relaxed text-[#6e6e73]"
                style={{ fontSize: 'var(--text-body)' }}
              >
                {cat.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className="font-medium text-[#8e8e93]"
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  Algorithms:
                </span>
                {cat.algorithms.map((algo, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-black/[0.04] px-2.5 py-1 font-medium text-[#1d1d1f]"
                    style={{ fontSize: 'var(--text-body)' }}
                  >
                    {algo}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClassificationSection;