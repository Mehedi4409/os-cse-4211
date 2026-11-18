import React from 'react';
import { Activity, Cpu, Database, FileCode, Terminal, HardDrive } from 'lucide-react';

/* ---------- reusable pieces ---------- */
const Block = ({ icon: Icon, title, children }) => (
  <div className="mt-12 border-t border-black/[0.06] pt-10">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="h-6 w-6 text-[#111d4a]" strokeWidth={1.5} />}
      <h3 className="font-semibold" style={{ fontSize: 'var(--text-subheader)' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Text = ({ children }) => (
  <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{children}</p>
);

const Bullets = ({ items }) => (
  <ul className="mt-4 space-y-2 text-sm text-[#6e6e73]">
    {items.map((t) => <li key={t}>• {t}</li>)}
  </ul>
);

const Card = ({ title, tag, children }) => (
  <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
    <div className="flex items-baseline justify-between">
      <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>{title}</h4>
      {tag && <span className="rounded bg-black/[0.04] px-2 py-0.5 font-mono text-xs text-[#8e8e93]">{tag}</span>}
    </div>
    <div className="mt-2 text-xs text-[#6e6e73] sm:text-sm">{children}</div>
  </div>
);

const Figure = ({ caption, children }) => (
  <figure className="mt-6 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-6">
    <figcaption className="mb-4 text-center text-xs font-semibold text-gray-400">{caption}</figcaption>
    {children}
  </figure>
);

/* ---------- state diagram data (x, y = centre of node) ---------- */
const NODES = [
  ['New', 70, 70, 110], ['Ready', 260, 70, 110], ['Run', 470, 70, 110], ['Terminate', 650, 70, 120],
  ['Suspend Ready', 110, 220, 150], ['Wait / Block', 360, 220, 130], ['Suspend Wait', 360, 350, 140],
];

// [path, label, labelX, labelY, textAnchor]
const EDGES = [
  ['M125 70H205', '', 0, 0],
  ['M290 52Q365 15 440 52', 'Schedule / Dispatch', 365, 22, 'middle'],
  ['M445 88Q365 130 290 88', 'Priority / Time quantum', 365, 130, 'middle'],
  ['M525 70H590', 'Completion', 557, 58, 'middle'],
  ['M470 88Q485 160 405 205', 'I/O Request', 490, 150, 'start'],
  ['M345 202Q275 150 272 90', 'I/O\nCompletion', 300, 165, 'start'],
  ['M222 88Q150 120 150 202', 'Suspend', 135, 150, 'end'],
  ['M190 202Q215 130 242 90', 'Resume', 205, 118, 'end'],
  ['M335 238Q315 280 335 332', 'Suspend', 305, 290, 'end'],
  ['M390 332Q410 280 390 238', 'Resume', 410, 290, 'start'],
  ['M290 350Q130 350 130 240', "I/O completed\nbut still in\nsuspend", 112, 295, 'end'],
];

const StateDiagram = () => (
  <svg viewBox="0 0 760 410" className="w-full" role="img" aria-label="Seven-state process model">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0L10 5L0 10z" fill="#c9a227" />
      </marker>
    </defs>
    {EDGES.map(([d, label, x, y, anchor], i) => (
      <g key={i}>
        <path d={d} fill="none" stroke="#c9a227" strokeWidth="1.5" markerEnd="url(#arrow)" />
        {label.split('\n').map((line, j) => (
          <text key={j} x={x} y={y + j * 15} textAnchor={anchor} fontSize="12" fill="#6e6e73">{line}</text>
        ))}
      </g>
    ))}
    {NODES.map(([name, x, y, w]) => (
      <g key={name}>
        <rect x={x - w / 2} y={y - 18} width={w} height="36" rx="18"
          fill={name === 'Run' ? '#111d4a' : '#fff'} stroke="#111d4a" strokeOpacity={name === 'Run' ? 1 : 0.3} />
        <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight="600"
          fill={name === 'Run' ? '#fff' : '#111d4a'}>{name}</text>
      </g>
    ))}
  </svg>
);

/* ---------- static content ---------- */
const PYRAMID = ['Registers', 'Cache', 'Main Memory', 'Solid State Disk (SSD)', 'Magnetic Disk', 'Optical Disk', 'Magnetic Tapes'];

const SCHEDULERS = [
  ['STS', 'Short-Term Scheduler', ['Selects which process gets the CPU.', 'Runs very frequently.', 'Controls CPU allocation.', 'Operates directly on the ready queue.', 'Also called CPU Scheduler.']],
  ['MTS', 'Medium-Term Scheduler', ['Moves processes in and out of memory.', 'Controls process suspension.', 'Runs sometimes.', 'Manages swapped-out blocked/ready processes.', 'Also called Swapper.']],
  ['LTS', 'Long-Term Scheduler', ['Selects which process enters memory.', 'Controls the degree of multiprogramming.', 'Runs less frequently.', 'Selects processes from job pool to ready queue.', 'Also called Job Scheduler.']],
];

/* ---------- component ---------- */
const ProcessStatesSection = ({ section }) => {
  if (!section) return null;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      <header>
        <div className="flex items-center gap-3">
          <Activity className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Process & Memory
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>
          {section.title}
        </h2>
      </header>

      <Block icon={HardDrive} title="Storage Structure">
        <Text>Main memory and registers are the only storage media that the CPU can access directly. Instructions must be in memory to be executed by the CPU. Secondary storage (like magnetic disks) provides large non-volatile capacity to store programs and data.</Text>
      </Block>

      <Block icon={Database} title="Storage Hierarchy">
        <Figure caption="Storage pyramid (speed vs. capacity)">
          <div className="mx-auto flex max-w-md flex-col items-center gap-2">
            {PYRAMID.map((name, i) => (
              <div key={name} className="rounded-lg border border-black/[0.15] bg-white py-1.5 text-center text-xs font-semibold"
                style={{ width: `${33 + i * 11}%` }}>
                {name}
              </div>
            ))}
          </div>
        </Figure>
      </Block>

      <Block icon={FileCode} title="Program">
        <Bullets items={['A program is a passive entity.', 'It is stored on a disk as an executable file.', 'It consists of a static set of instructions.']} />
      </Block>

      <Block icon={Activity} title="Process">
        <Bullets items={['A process is an active entity.', 'It is loaded into memory for execution.', 'It represents a program in execution, including current activity, program counter, and contents of processor registers.']} />
      </Block>

      <Block title="Program vs. Process">
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Card title="Program">Passive entity stored on disk.</Card>
          <Card title="Process">Active entity loaded into memory for execution.</Card>
        </div>
      </Block>

      <Block icon={Terminal} title="System Calls">
        <Text>System calls provide an interface to the services made available by an operating system. They allow user-level processes to request kernel-level actions, such as process control, file management, and device communication.</Text>
      </Block>

      <Block title="Process State Transition Diagram">
        <Figure caption="7-state process model">
          <StateDiagram />
        </Figure>
      </Block>

      <Block title="Process States">
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {section.states.map((s) => (
            <Card key={s.name} title={s.name} tag={s.location}>{s.description}</Card>
          ))}
        </div>
      </Block>

      <Block icon={Cpu} title="STS vs. MTS vs. LTS">
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {SCHEDULERS.map(([abbr, name, points]) => (
            <Card key={abbr} title={`${abbr} · ${name}`}>
              <ol className="list-decimal space-y-2 pl-4 text-xs">
                {points.map((p) => <li key={p}>{p}</li>)}
              </ol>
            </Card>
          ))}
        </div>
      </Block>
    </section>
  );
};

export default ProcessStatesSection;