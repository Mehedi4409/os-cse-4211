import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const WorkedExamplesSection = ({ section }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!section || !section.examples) return null;

  const example = section.examples[activeTab];
  const totalGanttTime = example.solution.gantt_chart.at(-1).end;

  const enter = (i) => ({
    animation: `example-rise 700ms ${EASE} both`,
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
        @keyframes example-rise {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-example-enter] { animation: none !important; }
        }
      `}</style>

      {/* Main Header & Example Tabs */}
      <header data-example-enter style={enter(0)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Calculator className="h-10 w-10 text-[#111d4a]" strokeWidth={1.5} aria-hidden="true" />
          <span
            className="rounded-full bg-[#92140c]/[0.07] px-3.5 py-1 font-medium text-[#92140c]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            {section.mode}
          </span>
        </div>

        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {section.algorithm} — Worked Examples
        </h2>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-black/[0.06] pb-4">
          {section.examples.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                activeTab === idx
                  ? 'bg-[#111d4a] text-white shadow-xs'
                  : 'bg-black/[0.04] text-[#6e6e73] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
              style={{ fontSize: 'var(--text-body)' }}
            >
              Example {idx + 1}
            </button>
          ))}
        </div>

        <h3
          className="mt-6 font-semibold text-[#111d4a]"
          style={{ fontSize: 'var(--text-subheader)' }}
        >
          {example.label}
        </h3>
        <p
          className="mt-2 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {example.question.description}
        </p>
      </header>

      {/* 1. Problem Statement & Input Table */}
      <div data-example-enter style={enter(1)} className="mt-12 border-t border-black/[0.06] pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            Problem Data
          </h3>
          <span
            className="font-mono font-medium text-[#8e8e93]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            01
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left" style={{ fontSize: 'var(--text-body)' }}>
            <thead>
              <tr className="border-b border-black/[0.08] text-[#8e8e93]">
                <th className="pb-3 font-medium">Process</th>
                <th className="pb-3 font-medium">Arrival Time (AT)</th>
                <th className="pb-3 font-medium">Burst Time (BT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {example.question.processes.map((p) => (
                <tr key={p.process}>
                  <td className="py-3.5 font-semibold text-[#111d4a]">{p.process}</td>
                  <td className="py-3.5 text-[#3a3a3c]">{p.arrival_time}</td>
                  <td className="py-3.5 text-[#3a3a3c]">{p.burst_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>
            Objectives:
          </span>
          {example.question.to_find.map((item, idx) => (
            <span
              key={idx}
              className="rounded-md bg-black/[0.04] px-2.5 py-1 font-medium text-[#1d1d1f]"
              style={{ fontSize: 'var(--text-body)' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Execution Flow & Gantt Chart */}
      <div data-example-enter style={enter(2)} className="mt-12 border-t border-black/[0.06] pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            Execution Timeline
          </h3>
          <span
            className="font-mono font-medium text-[#8e8e93]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            02
          </span>
        </div>

        {/* Ready Queue Sequence */}
        <div className="mt-6">
          <span className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>
            Ready Queue Order
          </span>
          <div
            className="mt-2 font-mono font-semibold text-[#1d1d1f] overflow-x-auto pb-1"
            style={{ fontSize: 'var(--text-body)' }}
          >
            {example.solution.ready_queue_sequence.join('  →  ')}
          </div>
        </div>

        {/* Proportional Gantt Chart */}
        <div className="mt-8 overflow-x-auto pb-2">
          <span className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>
            Gantt Chart
          </span>

          <div className="mt-3 flex w-full min-w-[360px] overflow-hidden rounded-xl border border-black/[0.1] bg-white">
            {example.solution.gantt_chart.map((block, idx) => {
              const duration = block.end - block.start;
              const widthPercent = (duration / totalGanttTime) * 100;
              const isIdle = block.is_idle;

              return (
                <motion.div
                  key={idx}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.32, 0.72, 0, 1] }}
                  style={{ width: `${widthPercent}%`, transformOrigin: 'left' }}
                  className={`flex flex-col items-center justify-center border-r border-black/[0.08] py-3 sm:py-4 px-1 last:border-r-0 ${
                    isIdle
                      ? 'bg-gray-100 text-gray-500 italic'
                      : idx % 2 === 0
                      ? 'bg-[#111d4a] text-white'
                      : 'bg-[#92140c] text-white'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm">{block.process}</span>
                  <span className="mt-0.5 font-mono text-[10px] sm:text-xs opacity-75 whitespace-nowrap">
                    {block.start}–{block.end}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Calculation Table & Final Metrics */}
      <div data-example-enter style={enter(3)} className="mt-12 border-t border-black/[0.06] pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
            style={{ fontSize: 'var(--text-subheader)' }}
          >
            Calculation & Results
          </h3>
          <span
            className="font-mono font-medium text-[#8e8e93]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            03
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[440px] text-left" style={{ fontSize: 'var(--text-body)' }}>
            <thead>
              <tr className="border-b border-black/[0.08] text-[#8e8e93]">
                <th className="pb-3 font-medium">Process</th>
                <th className="pb-3 font-medium">AT</th>
                <th className="pb-3 font-medium">BT</th>
                <th className="pb-3 font-medium">CT</th>
                <th className="pb-3 font-medium">TAT (CT − AT)</th>
                <th className="pb-3 font-medium">WT (TAT − BT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {example.solution.calculation_table.map((row) => (
                <tr key={row.process}>
                  <td className="py-3.5 font-semibold text-[#111d4a]">{row.process}</td>
                  <td className="py-3.5 text-[#6e6e73]">{row.arrival_time}</td>
                  <td className="py-3.5 text-[#6e6e73]">{row.burst_time}</td>
                  <td className="py-3.5 text-[#1d1d1f]">{row.completion_time}</td>
                  <td className="py-3.5 text-[#1d1d1f]">{row.turnaround_time}</td>
                  <td className="py-3.5 font-semibold text-[#92140c]">{row.waiting_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-10 divide-y divide-black/[0.06] border-t border-b border-black/[0.06]">
          <li className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <div>
              <p className="font-medium text-[#1d1d1f]" style={{ fontSize: 'var(--text-body)' }}>
                Average Waiting Time
              </p>
            </div>
            <span
              className="font-semibold text-[#92140c]"
              style={{ fontSize: 'var(--text-subheader)' }}
            >
              {example.solution.mathematical_steps.average_wt}
            </span>
          </li>

          <li className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <div>
              <p className="font-medium text-[#1d1d1f]" style={{ fontSize: 'var(--text-body)' }}>
                Average Turnaround Time
              </p>
            </div>
            <span
              className="font-semibold text-[#111d4a]"
              style={{ fontSize: 'var(--text-subheader)' }}
            >
              {example.solution.mathematical_steps.average_tat}
            </span>
          </li>

          <li className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <div>
              <p className="font-medium text-[#1d1d1f]" style={{ fontSize: 'var(--text-body)' }}>
                Throughput
              </p>
            </div>
            <span
              className="font-semibold text-[#1d1d1f]"
              style={{ fontSize: 'var(--text-subheader)' }}
            >
              {example.solution.mathematical_steps.throughput}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default WorkedExamplesSection;