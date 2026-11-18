import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const rise = (i) => ({ animation: `example-rise 700ms ${EASE} both`, animationDelay: `${i * 90}ms` });

/* ---------- data: only the raw problem + Gantt chart. Every result is computed from these ---------- */
// processes: [name, arrival, burst]   gantt: [name | 'IDLE', start, end]   steps: [time, explanation]
const EXAMPLES = [
  {
    id: 'sjf-at',
    tab: 'With arrival time',
    title: 'SJF with Arrival Time (Non-Preemptive)',
    description: 'Processes arrive at different times. Once a process starts, it runs until it finishes.',
    queue: ['P1', 'P2', 'P3', 'P4'],
    processes: [['P1', 1, 4], ['P2', 2, 1], ['P3', 3, 1], ['P4', 2, 2]],
    gantt: [['IDLE', 0, 1], ['P1', 1, 5], ['P2', 5, 6], ['P3', 6, 7], ['P4', 7, 9]],
    steps: [
      [0, 'Nothing has arrived yet (earliest arrival is 1), so the CPU stays idle until t = 1.'],
      [1, 'Only P1 has arrived, so it runs its full burst of 4 and finishes at t = 5.'],
      [5, 'P2 (BT 1), P3 (BT 1) and P4 (BT 2) are waiting. P2 and P3 tie on burst time, so the earlier arrival, P2, goes first.'],
      [6, 'P3 (BT 1) is now the shortest and runs from 6 to 7.'],
      [7, 'Only P4 is left. It runs from 7 to 9.'],
    ],
  },
  {
    id: 'sjf-no-at',
    tab: 'Without arrival time',
    title: 'SJF without Arrival Time (Non-Preemptive)',
    description: 'All processes arrive at t = 0, so they are ordered purely by burst time.',
    queue: ['P4', 'P1', 'P3', 'P2'],
    processes: [['P1', 0, 6], ['P2', 0, 8], ['P3', 0, 7], ['P4', 0, 3]],
    gantt: [['P4', 0, 3], ['P1', 3, 9], ['P3', 9, 16], ['P2', 16, 24]],
    steps: [
      [0, 'Everything has arrived, so sort by burst time: P4 (3) < P1 (6) < P3 (7) < P2 (8).'],
      [3, 'Each process then runs to completion in that order. If two burst times were equal, process order would decide.'],
    ],
  },
  {
    id: 'sjf-preemptive',
    tab: 'Preemptive (SRTF)',
    title: 'SJF Preemptive (Shortest Remaining Time First)',
    description: 'The CPU is re-checked after every unit. A new process with a shorter remaining time takes over.',
    perUnit: true, // draw the Gantt chart and burst countdown one unit at a time, like the notebook
    queue: ['P4', 'P2', 'P1', 'P3', 'P5'],
    processes: [['P1', 2, 6], ['P2', 1, 3], ['P3', 4, 2], ['P4', 0, 5], ['P5', 6, 4]],
    gantt: [['P4', 0, 1], ['P2', 1, 4], ['P3', 4, 6], ['P4', 6, 10], ['P5', 10, 14], ['P1', 14, 20]],
    steps: [
      [0, 'Only P4 has arrived (BT 5), so it starts running.'],
      [1, 'P2 arrives with BT 3. P4 has 4 left, so P2 is shorter and preempts P4.'],
      [2, 'P1 arrives (BT 6). P2 has 2 left, so it keeps the CPU and finishes at t = 4.'],
      [4, 'P3 arrives (BT 2). P4 has 4 left and P1 has 6, so P3 is shortest and runs from 4 to 6.'],
      [6, 'P5 arrives (BT 4). P4 also has 4 left. Tie: P4 arrived earlier, so P4 runs from 6 to 10.'],
      [10, 'P5 (4) is shorter than P1 (6), so P5 runs from 10 to 14.'],
      [14, 'Only P1 is left. It runs from 14 to 20.'],
    ],
  },
].map((ex) => ({
  ...ex,
  processes: ex.processes.map(([name, at, bt]) => ({ name, at, bt })),
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
    const trace = Array.from({ length: p.bt + 1 }, (_, k) => p.bt - k); // burst countdown: 6 → 5 → … → 0
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

const Gantt = ({ gantt: segments, total, perUnit }) => {
  const gantt = perUnit
    ? segments.flatMap((g) =>
        g.name === 'IDLE' ? [g] : Array.from({ length: g.end - g.start }, (_, k) => ({ name: g.name, start: g.start + k, end: g.start + k + 1 })))
    : segments;
  const ticks = [0, ...gantt.map((g) => g.end)];
  return (
    <div className="mt-3 overflow-x-auto pb-2">
      <div className={`px-3 ${perUnit ? 'min-w-[600px]' : 'min-w-[440px]'}`}>
        <div className="flex h-14 overflow-hidden rounded-xl border border-black/10">
          {gantt.map((g, i) => (
            <motion.div
              key={i}
              title={`${g.name}: ${g.start}–${g.end}`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * (perUnit ? 0.03 : 0.08), ease: [0.32, 0.72, 0, 1] }}
              className={`flex items-center justify-center border-r border-white/40 font-semibold last:border-r-0 ${perUnit ? 'text-xs' : 'text-sm'}`}
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
const SJFSection = () => {
  const [tab, setTab] = useState(0);
  const ex = EXAMPLES[tab];
  const { rows, total, averages, throughput } = useMemo(() => solve(ex), [ex]);
  const queue = ex.queue;

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
          Shortest Job First (SJF): Step-by-Step Analysis
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
      </header>

      {/* 01 Problem data */}
      <Section n="01" title="Problem Data" delay={1}>
        <Table head={['Process', 'Arrival Time (AT)', 'Burst Time (BT)']}>
          {ex.processes.map((p) => (
            <tr key={p.name}>
              <td className="py-3.5 font-semibold text-[#111d4a]"><span className="mr-2"><Dot name={p.name} /></span>{p.name}</td>
              <td className="py-3.5 text-[#3a3a3c]">{p.at}</td>
              <td className="py-3.5 text-[#3a3a3c]">{p.bt}</td>
            </tr>
          ))}
        </Table>
      </Section>

      {/* 02 Timeline */}
      <Section n="02" title="Execution Timeline" delay={2}>
        <div className="mt-6">
          <Label>Ready Queue</Label>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {queue.map((q, i) => (
              <React.Fragment key={q}>
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
          <Gantt gantt={ex.gantt} total={total} perUnit={ex.perUnit} />
          {ex.perUnit && (
            <p className="mt-2 text-xs text-[#8e8e93]">
              Drawn one unit at a time, as in the notes. When no new process can arrive in between, consecutive units can be merged (for example P4 from 6 to 10).
            </p>
          )}
        </div>

        <div className="mt-8">
          <Label>Why this order</Label>
          <ol className="mt-4 space-y-3">
            {ex.steps.map(([t, text]) => (
              <li key={t} className="flex gap-4" style={{ fontSize: 'var(--text-body)' }}>
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
        <Table head={['Process', 'AT', ex.perUnit ? 'BT (remaining)' : 'BT', 'CT', 'TAT', 'WT', 'RT']} min={ex.perUnit ? 640 : 480}>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="py-3.5 font-semibold text-[#111d4a]"><span className="mr-2"><Dot name={r.name} /></span>{r.name}</td>
              <td className="py-3.5 text-[#6e6e73]">{r.at}</td>
              <td className="py-3.5 font-mono text-xs text-[#6e6e73]">
                {ex.perUnit
                  ? r.trace.map((v, k) => (
                      <span key={k}>
                        {k > 0 && <span className="mx-1 text-[#8e8e93]">→</span>}
                        <span className={k < r.bt ? 'line-through decoration-[#92140c] decoration-2' : 'font-semibold text-[#1d1d1f]'}>{v}</span>
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

export default SJFSection;