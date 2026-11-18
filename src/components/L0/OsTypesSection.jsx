import React from 'react';
import { Layers } from 'lucide-react';

/* ---------- generic SVG diagram renderer ---------- */
const STYLES = {
  plain: { fill: '#fff', stroke: 'rgba(0,0,0,.2)', text: '#1d1d1f' },
  os: { fill: 'rgba(17,29,74,.05)', stroke: 'rgba(17,29,74,.3)', text: '#111d4a' },
  cpu: { fill: '#111d4a', stroke: '#111d4a', text: '#fff' },
  out: { fill: '#ecfdf5', stroke: '#a7f3d0', text: '#065f46' },
};

// boxes: [x, y, w, h, 'Title\nsubtitle', style]   arrows: [path, bothEnds?]   notes: [x, y, text, anchor]
const Diagram = ({ w, h, boxes, arrows = [], notes = [] }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
    <defs>
      <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="#8e8e93" />
      </marker>
    </defs>
    {arrows.map(([d, both], i) => (
      <path key={i} d={d} fill="none" stroke="#8e8e93" strokeWidth="1.5" markerEnd="url(#ah)" markerStart={both ? 'url(#ah)' : undefined} />
    ))}
    {boxes.map(([x, y, bw, bh, label, style = 'plain'], i) => {
      if (style === 'group')
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="14" fill="none" stroke="#8e8e93" strokeDasharray="5 4" />
            <text x={x + 12} y={y + 17} fontSize="11" fill="#8e8e93">{label}</text>
          </g>
        );
      const s = STYLES[style];
      const lines = label.split('\n');
      return (
        <g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx="10" fill={s.fill} stroke={s.stroke} />
          <text textAnchor="middle" fill={s.text} fontSize="12" y={y + bh / 2 + 4 - (lines.length - 1) * 7}>
            {lines.map((l, j) => (
              <tspan key={j} x={x + bw / 2} dy={j ? 14 : 0} fontWeight={j ? 400 : 600} fontSize={j ? 10.5 : 12}>{l}</tspan>
            ))}
          </text>
        </g>
      );
    })}
    {notes.map(([x, y, t, a = 'middle'], i) => (
      <text key={i} x={x} y={y} textAnchor={a} fontSize="11" fill="#6e6e73">{t}</text>
    ))}
  </svg>
);

/* ---------- diagram definitions ---------- */
const DIAGRAMS = {
  batch: {
    match: ['batch'],
    caption: 'Batch OS: jobs are grouped by the operator and run one after another',
    w: 700, h: 225,
    boxes: [
      ...[1, 2, 3, 4].map((n, i) => [10, 20 + i * 40, 70, 28, `Job ${n}`]),
      [120, 55, 100, 90, 'Operator\ngroups similar jobs', 'os'],
      [270, 40, 110, 44, 'Batch 1\nJob 1, Job 2'],
      [270, 116, 110, 44, 'Batch 2\nJob 3, Job 4'],
      [430, 70, 90, 60, 'OS monitor\nloads next job', 'os'],
      [565, 70, 80, 60, 'CPU\none job at a time', 'cpu'],
      [565, 165, 80, 30, 'Output', 'out'],
    ],
    arrows: [
      ...[0, 1, 2, 3].map((i) => [`M80 ${34 + i * 40}L120 100`]),
      ['M220 85L270 62'], ['M220 115L270 138'], ['M380 62L430 90'], ['M380 138L430 110'],
      ['M520 100H565'], ['M605 130V165'],
    ],
    notes: [[350, 215, 'No user interaction while a batch is running']],
  },

  timeSharing: {
    match: ['time-sharing', 'multitasking'],
    caption: 'Time-sharing OS: the CPU is switched between processes every time slice',
    w: 700, h: 220,
    boxes: [
      [20, 40, 70, 34, 'Word'], [100, 40, 70, 34, 'Email'], [180, 40, 70, 34, 'Web'],
      [330, 35, 90, 44, 'CPU\nscheduler', 'cpu'],
      [520, 40, 70, 34, 'Exit', 'out'],
      ...['Word', 'Email', 'Web', 'Word', 'Email'].map((p, i) => [100 + i * 70, 175, 66, 26, p, i % 2 ? 'plain' : 'os']),
    ],
    arrows: [['M250 57H330'], ['M420 57H520'], ['M375 79V125H135V74']],
    notes: [
      [20, 28, 'Ready queue', 'start'], [470, 50, 'done', 'middle'],
      [255, 142, 'time slice expired: back to the queue'], [20, 192, 'CPU time', 'start'],
    ],
  },

  multiprogramming: {
    match: ['multiprogrammed', 'multiprogramming'],
    caption: 'Multiprogramming OS: when the running job waits for I/O, the CPU switches to another job',
    w: 700, h: 230,
    boxes: [
      [10, 20, 330, 100, 'Main memory (job pool)', 'group'],
      [30, 55, 60, 34, 'P2'], [100, 55, 60, 34, 'P3'], [170, 55, 60, 34, 'P4'],
      [400, 45, 120, 54, 'CPU\nrunning P1', 'cpu'],
      [400, 170, 120, 40, 'I/O device\nP1 waiting', 'os'],
    ],
    arrows: [['M240 72H400'], ['M460 99V170'], ['M400 190H130V89']],
    notes: [
      [30, 108, 'Ready queue', 'start'], [470, 138, 'I/O request', 'start'],
      [265, 182, 'I/O complete: back to the ready queue'],
    ],
  },

  distributed: {
    match: ['distributed'],
    caption: 'Distributed OS: independent nodes cooperate over a communication network',
    w: 700, h: 215,
    boxes: [
      ...[1, 2, 3, 4].map((n, i) => [20 + i * 170, 10, 150, 64, `Node ${n}\nCPU, memory, disk`]),
      [20, 130, 660, 36, 'Communication network (LAN / WAN)', 'os'],
    ],
    arrows: [0, 1, 2, 3].map((i) => [`M${95 + i * 170} 74V130`, true]),
    notes: [[350, 196, 'No shared memory or clock: nodes cooperate by passing messages']],
  },
};

const findDiagram = (name) => {
  const n = name.toLowerCase();
  return Object.values(DIAGRAMS).find((d) => d.match.some((m) => n.includes(m)));
};

/* ---------- small components ---------- */
const TONES = {
  green: ['border-emerald-200 bg-emerald-50/50', 'text-emerald-900', 'text-emerald-800'],
  red: ['border-red-200 bg-red-50/50', 'text-red-900', 'text-red-800'],
};

const ProsCons = ({ title, items, tone }) => {
  if (!items) return null;
  const [box, head, list] = TONES[tone];
  return (
    <div className={`rounded-2xl border p-5 ${box}`}>
      <h4 className={`font-semibold ${head}`} style={{ fontSize: 'var(--text-body)' }}>{title}</h4>
      <ul className={`mt-2 list-disc space-y-1 pl-4 text-xs sm:text-sm ${list}`}>
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
};

/* ---------- component ---------- */
const OsTypesSection = ({ section }) => {
  if (!section) return null;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      <header>
        <div className="flex items-center gap-3">
          <Layers className="h-9 w-9 text-[#92140c]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#92140c]/[0.06] px-3.5 py-1 font-medium text-[#92140c]" style={{ fontSize: 'var(--text-body)' }}>
            Classifications
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>
          {section.title}
        </h2>
      </header>

      <div className="mt-12 space-y-16 divide-y divide-black/[0.06]">
        {section.categories.map((cat) => {
          const diagram = findDiagram(cat.name);
          return (
            <div key={cat.name} className="pt-12 first:pt-0">
              <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{cat.name}</h3>
              <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{cat.description}</p>

              {cat.examples && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#8e8e93]" style={{ fontSize: 'var(--text-body)' }}>Examples:</span>
                  {cat.examples.map((ex) => (
                    <span key={ex} className="rounded-md bg-black/[0.04] px-2.5 py-1 text-xs font-medium">{ex}</span>
                  ))}
                </div>
              )}

              {diagram && (
                <figure className="mt-8 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-6">
                  <figcaption className="mb-4 text-center text-xs font-semibold text-gray-400">{diagram.caption}</figcaption>
                  <Diagram {...diagram} />
                </figure>
              )}

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <ProsCons title="Advantages" items={cat.advantages} tone="green" />
                <ProsCons title="Disadvantages" items={cat.disadvantages} tone="red" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OsTypesSection;