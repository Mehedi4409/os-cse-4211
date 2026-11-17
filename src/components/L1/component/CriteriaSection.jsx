import React from 'react';
import { Layers, Lightbulb } from 'lucide-react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const CriteriaSection = ({ criteria }) => {
  if (!criteria) return null;

  const enter = (i) => ({
    animation: `criteria-rise 700ms ${EASE} both`,
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
        @keyframes criteria-rise {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-criteria-enter] { animation: none !important; }
        }
      `}</style>

      {/* Main Header (Subheader * 1.618) */}
      <header data-criteria-enter style={enter(0)}>
        <Layers className="h-10 w-10 text-[#111d4a]" strokeWidth={1.5} aria-hidden="true" />
        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {criteria.title}
        </h2>
      </header>

      {/* Callout Block */}
      <div
        data-criteria-enter
        style={enter(1)}
        className="mt-10 flex gap-4 rounded-2xl bg-[#92140c]/[0.05] p-5 sm:p-6"
      >
        <Lightbulb
          className="mt-1 h-6 w-6 shrink-0 text-[#92140c]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div>
          <p
            className="font-semibold tracking-[-0.015em] text-[#92140c]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            Why less waiting time matters
          </p>
          <p
            className="mt-1.5 leading-relaxed text-[#3a3a3c]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            {criteria.why_less_waiting_time_is_good}
          </p>
        </div>
      </div>

      {/* Optimization Goals List */}
      <div data-criteria-enter style={enter(2)} className="mt-12">
        <h3
          className="font-medium uppercase tracking-wider text-[#8e8e93]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          Optimization goals
        </h3>
        <ul className="mt-4 divide-y divide-black/[0.06] border-t border-b border-black/[0.06]">
          {criteria.algorithm_optimization_goals.map((goal, idx) => (
            <li key={idx} className="py-6 first:pt-5 last:pb-5">
              {/* Subheader (Body * 1.618) */}
              <h4
                className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
                style={{ fontSize: 'var(--text-subheader)' }}
              >
                {goal.metric}
              </h4>
              <p
                className="mt-1.5 leading-relaxed text-[#6e6e73]"
                style={{ fontSize: 'var(--text-body)' }}
              >
                {goal.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CriteriaSection;