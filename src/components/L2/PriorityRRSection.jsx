import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const rise = (i) => ({ animation: `example-rise 700ms ${EASE} both`, animationDelay: `${i * 90}ms` });

/* ---------- data: only the raw problem + Gantt chart. Every result is computed from these ---------- */
// processes: [name, arrival, burst, priority?]   gantt: [name | 'IDLE', start, end]   steps: [time, explanation]
const EXAMPLES = [
  {
    id: 'priority-preemptive',
    tab: 'Priority (Preemptive)',
    title: 'Priority Scheduling (Preemptive) with Arrival Time',
    description: 'The CPU always goes to the highest-priority process. A newly arrived process with higher priority preempts the running one.',
    facts: ['Time quantum: 1 unit', 'Higher number = higher priority', 'Equal priority: earlier arrival first'],
    showTrace: true,
    queue: ['P1', 'P2', 'P3', 'P4'],
    processes: [['P1', 0, 5, 10], ['P2', 1, 4, 20], ['P3', 2, 2, 30], ['P4', 4, 1, 60]],
    gantt: [['P1', 0, 1], ['P2', 1, 2], ['P3', 2, 4], ['P4', 4, 5], ['P2', 5, 8], ['P1', 8, 12]],
    steps: [
      [0, 'Only P1 (priority 10) has arrived, so it runs.'],
      [1, 'P2 arrives with priority 20, which beats 10. P2 preempts P1 (4 units left).'],
      [2, 'P3 arrives with priority 30 and preempts P2 (3 units left). P3 runs from 2 to 4 and finishes.'],
      [4, 'P4 arrives with priority 60, the highest. It runs from 4 to 5 and finishes.'],
      [5, 'P2 (priority 20) and P1 (priority 10) are waiting. P2 is higher, so it runs from 5 to 8.'],
      [8, 'Only P1 is left. It runs its remaining 4 units, from 8 to 12.'],
    ],
  },
  {
    id: 'priority-np',
    tab: 'Priority (Non-Preemptive)',
    title: 'Priority Scheduling (Non-Preemptive) without Arrival Time',
    description: 'All processes arrive at t = 0. Each one runs its full burst, in order of priority.',
    facts: ['Lower number = higher importance', 'Equal priority: process order', 'No preemption'],
    queue: ['P2', 'P5', 'P1', 'P3', 'P4'],
    processes: [['P1', 0, 10, 3], ['P2', 0, 1, 1], ['P3', 0, 2, 4], ['P4', 0, 1, 5], ['P5', 0, 5, 2]],
    gantt: [['P2', 0, 1], ['P5', 1, 6], ['P1', 6, 16], ['P3', 16, 18], ['P4', 18, 19]],
    steps: [
      [0, 'Everything has arrived. In this problem a lower number means higher importance, so sort by priority number: P2 (1), P5 (2), P1 (3), P3 (4), P4 (5).'],
      [0, 'P2 runs first, from 0 to 1.'],
      [1, 'P5 runs from 1 to 6.'],
      [6, 'P1 runs from 6 to 16.'],
      [16, 'P3 runs from 16 to 18, then P4 runs from 18 to 19.'],
    ],
  },
  {
    id: 'round-robin',
    tab: 'Round Robin',
    title: 'Round Robin (Preemptive)',
    description: 'Like FCFS, but each process gets at most one time quantum. If it is not finished, it goes to the end of the ready queue.',
    facts: ['Time quantum: 2 units', 'New arrival is queued ahead of the preempted process'],
    showTrace: true,
    queue: ['P1', 'P2', 'P3', 'P1', 'P4', 'P2', 'P1'],
    processes: [['P1', 0, 5], ['P2', 1, 4], ['P3', 2, 2], ['P4', 4, 1]],
    gantt: [['P1', 0, 2], ['P2', 2, 4], ['P3', 4, 6], ['P1', 6, 8], ['P4', 8, 9], ['P2', 9, 11], ['P1', 11, 12]],
    steps: [
      [0, 'Only P1 is here. It runs for one quantum (0 to 2) and has 3 units left. P2 arrives at t = 1 and waits.'],
      [2, 'P3 arrives just as P1 is preempted. Queue: P2, P3, P1. P2 runs from 2 to 4 (2 units left).'],
      [4, 'P4 arrives just as P2 is preempted. Queue: P3, P1, P4, P2. P3 needs only 2, so it finishes at 6.'],
      [6, 'P1 runs from 6 to 8 (1 unit left).'],
      [8, 'P4 needs only 1 unit, so it runs from 8 to 9 and finishes.'],
      [9, 'P2 runs its last 2 units, from 9 to 11.'],
      [11, 'P1 runs its last unit, from 11 to 12.'],
    ],
  },
].map((ex) => ({
  ...ex,
  processes: ex.processes.map(([name, at, bt, pr]) => ({ name, at, bt, pr })),
  gantt: ex.gantt.map(([name, start, end]) => ({ name, start, end })),
}));

/* ---------- maths: everything below is derived from the Gantt chart ---------- */
const fmt = (n, d = 2) => +n.toFixed(d);

const solve = ({ processes, gantt }) => {
  const total = gantt.at(-1).end;
  const rows = processes.map((p) => {
    const runs = gantt.filter((g) => g.name === p.name);
    const ct = Math.max(...runs.map((g) => g.end));
    const first = Math.min(...runs.map((g) => g.start));
    const tat = ct - p.at;
    // remaining burst after each run, e.g. 4 → 3 → 0
    let left = p.bt;
    const trace = [left, ...runs.map((g) => (left -= g.end - g.start))];
    return { ...p, ct, tat, wt: tat - p.bt, rt: first - p.at, first, trace };
  });
  const n = rows.length;
  const avg = (key, label) => {
    const vals = rows.map((r) => r[key]);
    const sum = vals.reduce((a, b) => a + b, 0);
    return { label, value: fmt(sum / n), formula: `(${vals.join(' + ')}) ÷ ${n} = ${sum} ÷ ${n}` };
  };
  return {
    rows, total,
    averages: [avg('wt', 'Average Waiting Time'), avg('tat', 'Average Turnaround Time'), avg('rt', 'Average Response Time')],
    throughput: { value: fmt(n / total, 3), formula: `${n} processes ÷ ${total} time units` },
  };
};

/* ---------- small reusable pieces ---------- */
const COLORS = ['#111d4a', '#92140c', '#2f6f5e', '#b7791f', '#5b4b8a'];
const colorOf = (name) => COLORS[(parseInt(name.slice(1), 10) - 1) % COLORS.length];
const IDLE_BG = 'repeating-linear-gradient(45deg,#f3f3f5,#f3f3f5 6px,#e3e3e8 6px,#e3e3e8 12px)';

const Dot = ({ name }) => <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colorOf(name) }} />;

const Section = ({ n, title, delay, children }) => (
  <div data-example-enter style={rise(delay)} className="mt-12 border-t border-black/[0.06] pt-10">
    <div className="flex items-baseline justify-between gap-4">
      <h3 className="font-semibold leading-[1.25] tracking-[-0.015em]" style={{ fontSize: 'var(--text-subheader)' }}>{title}</h3>
      <span className="font-mono font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>{n}</span>
    </div>
    {children}
  </div>
);

const Label = ({ children }) => (
  <p className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>{children}</p>
);

const Table = ({ head, children, min = 320 }) => (
  <div className="mt-6 overflow-x-auto">
    <table className="w-full text-left" style={{ fontSize: 'var(--text-body)', minWidth: min }}>
      <thead>
        <tr className="border-b border-black/[0.08] text-[#8e8e93]">
          {head.map((h) => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-black/[0.06]">{children}</tbody>
    </table>
  </div>
);

const Name = ({ name }) => (
  <td className="py-3.5 font-semibold text-[#111d4a]"><span className="mr-2"><Dot name={name} /></span>{name}</td>
);

const Gantt = ({ gantt, total }) => {
  const ticks = [...new Set([0, ...gantt.map((g) => g.end)])];
  return (
    <div className="mt-3 overflow-x-auto pb-2">
      <div className="min-w-[440px] px-3">
        <div className="flex h-14 overflow-hidden rounded-xl border border-black/10">
          {gantt.map((g, i) => (
            <motion.div
              key={i}
              title={`${g.name}: ${g.start}–${g.end}`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center justify-center border-r border-white/40 text-sm font-semibold last:border-r-0"
              style={{
                width: `${((g.end - g.start) / total) * 100}%`,
                transformOrigin: 'left',
                ...(g.name === 'IDLE' ? { background: IDLE_BG, color: '#8e8e93' } : { background: colorOf(g.name), color: '#fff' }),
              }}
            >
              {g.name === 'IDLE' ? '' : g.name}
            </motion.div>
          ))}
        </div>
        <div className="relative mt-2 h-5 font-mono text-xs text-[#6e6e73]">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / total) * 100}%` }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- component ---------- */
const PriorityRRSection = () => {
  const [tab, setTab] = useState(0);
  const ex = EXAMPLES[tab];
  const { rows, total, averages, throughput } = useMemo(() => solve(ex), [ex]);
  const hasPriority = ex.processes[0].pr !== undefined;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      <style>{`
        @keyframes example-rise {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) { [data-example-enter] { animation: none !important; } }
      `}</style>

      <header data-example-enter style={rise(0)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Calculator className="h-10 w-10 text-[#111d4a]" strokeWidth={1.5} aria-hidden="true" />
          <span className="rounded-full bg-[#92140c]/[0.07] px-3.5 py-1 font-medium text-[#92140c]" style={{ fontSize: 'var(--text-body)' }}>
            Numerical Solver
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>
          Priority Scheduling & Round Robin: Step-by-Step Analysis
        </h2>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-black/[0.06] pb-4">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setTab(i)}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                tab === i ? 'bg-[#111d4a] text-white' : 'bg-black/[0.04] text-[#6e6e73] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
              style={{ fontSize: 'var(--text-body)' }}
            >
              {i + 1}. {e.tab}
            </button>
          ))}
        </div>

        <h3 className="mt-6 font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{ex.title}</h3>
        <p className="mt-2 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{ex.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ex.facts.map((f) => (
            <span key={f} className="rounded-md bg-[#111d4a]/[0.06] px-2.5 py-1 text-xs font-medium text-[#111d4a]">{f}</span>
          ))}
        </div>
      </header>

      {/* 01 Problem data */}
      <Section n="01" title="Problem Data" delay={1}>
        <Table head={['Process', 'Arrival Time (AT)', 'Burst Time (BT)', ...(hasPriority ? ['Priority'] : [])]}>
          {ex.processes.map((p) => (
            <tr key={p.name}>
              <Name name={p.name} />
              <td className="py-3.5 text-[#3a3a3c]">{p.at}</td>
              <td className="py-3.5 text-[#3a3a3c]">{p.bt}</td>
              {hasPriority && <td className="py-3.5 font-semibold text-[#92140c]">{p.pr}</td>}
            </tr>
          ))}
        </Table>
      </Section>

      {/* 02 Timeline */}
      <Section n="02" title="Execution Timeline" delay={2}>
        <div className="mt-6">
          <Label>Ready Queue</Label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ex.queue.map((q, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[#8e8e93]">→</span>}
                <span className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-gray-50 px-3 py-1.5 font-mono font-semibold text-[#111d4a]">
                  <Dot name={q} />{q}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Label>Gantt Chart</Label>
          <Gantt gantt={ex.gantt} total={total} />
        </div>

        <div className="mt-8">
          <Label>Why this order</Label>
          <ol className="mt-4 space-y-3">
            {ex.steps.map(([t, text], i) => (
              <li key={i} className="flex gap-4" style={{ fontSize: 'var(--text-body)' }}>
                <span className="h-fit w-14 shrink-0 rounded-md bg-black/[0.04] py-0.5 text-center font-mono text-xs font-semibold text-[#111d4a]">t = {t}</span>
                <span className="leading-relaxed text-[#6e6e73]">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 03 Calculation */}
      <Section n="03" title="Calculation & Results" delay={3}>
        <p className="mt-3 font-mono text-xs text-[#8e8e93]">
          TAT = CT − AT &nbsp;·&nbsp; WT = TAT − BT &nbsp;·&nbsp; RT = first CPU time − AT
        </p>
        <Table head={['Process', 'AT', ex.showTrace ? 'BT (remaining)' : 'BT', 'CT', 'TAT', 'WT', 'RT']} min={ex.showTrace ? 560 : 480}>
          {rows.map((r) => (
            <tr key={r.name}>
              <Name name={r.name} />
              <td className="py-3.5 text-[#6e6e73]">{r.at}</td>
              <td className="py-3.5 font-mono text-xs text-[#6e6e73]">
                {ex.showTrace
                  ? r.trace.map((v, k) => (
                      <span key={k}>
                        {k > 0 && <span className="mx-1 text-[#8e8e93]">→</span>}
                        <span className={k < r.trace.length - 1 ? 'line-through decoration-[#92140c] decoration-2' : 'font-semibold text-[#1d1d1f]'}>{v}</span>
                      </span>
                    ))
                  : r.bt}
              </td>
              <td className="py-3.5 font-semibold text-[#111d4a]">{r.ct}</td>
              <td className="py-3.5">{r.tat}</td>
              <td className="py-3.5 font-semibold text-[#92140c]">{r.wt}</td>
              <td className="py-3.5 text-[#6e6e73]">{r.rt}</td>
            </tr>
          ))}
        </Table>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.name} className="rounded-xl border border-black/[0.08] bg-gray-50/60 p-4 font-mono text-xs leading-6 text-[#6e6e73]">
              <p className="mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-[#111d4a]"><Dot name={r.name} />{r.name}</p>
              <p>TAT = {r.ct} − {r.at} = <b className="text-[#1d1d1f]">{r.tat}</b></p>
              <p>WT &nbsp;= {r.tat} − {r.bt} = <b className="text-[#92140c]">{r.wt}</b></p>
              <p>RT &nbsp;= {r.first} − {r.at} = <b className="text-[#1d1d1f]">{r.rt}</b></p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[...averages, { label: 'Throughput', ...throughput, unit: 'processes / unit time' }].map((m, i) => (
            <div key={m.label} className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xs">
              <p className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>{m.label}</p>
              <p className="mt-1 font-semibold tracking-tight" style={{ fontSize: 'var(--text-header)', color: i === 0 ? '#92140c' : '#111d4a' }}>
                {m.value}
                <span className="ml-1.5 text-sm font-medium text-[#8e8e93]">{m.unit || 'units'}</span>
              </p>
              <p className="mt-2 font-mono text-xs text-[#6e6e73]">{m.formula}</p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
};

export default PriorityRRSection;