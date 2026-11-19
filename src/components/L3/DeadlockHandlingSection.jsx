import React from 'react';
import { Sliders, Check } from 'lucide-react';

/* ---------- deadlock conditions (used to light up which ones a strategy targets) ---------- */
const CONDITIONS = [
  { key: 'mutex', label: 'Mutual exclusion', re: /mutual[\s-]*exclusion/i },
  { key: 'hold', label: 'Hold and wait', re: /hold[\s-]*(and|&)[\s-]*wait/i },
  { key: 'preempt', label: 'No preemption', re: /pre-?empt/i },
  { key: 'circular', label: 'Circular wait', re: /circular/i },
];

/* =====================================================================
   SVG diagram kit
   ===================================================================== */
const COLOR = { navy: '#111d4a', red: '#92140c', green: '#2f6f5e', amber: '#b7791f', grey: '#8e8e93' };
const TONE = {
  plain: { fill: '#fff', stroke: COLOR.navy, text: COLOR.navy },
  red: { fill: 'rgba(146,20,12,.07)', stroke: COLOR.red, text: COLOR.red },
  green: { fill: 'rgba(47,111,94,.09)', stroke: COLOR.green, text: COLOR.green },
  amber: { fill: 'rgba(183,121,31,.10)', stroke: COLOR.amber, text: '#8a5a12' },
  navy: { fill: 'rgba(17,29,74,.06)', stroke: COLOR.navy, text: COLOR.navy },
  ghost: { fill: 'rgba(0,0,0,.03)', stroke: COLOR.grey, text: '#6e6e73' },
};
const halo = { stroke: '#fff', strokeWidth: 4, paintOrder: 'stroke', strokeLinejoin: 'round' };

const Defs = () => (
  <defs>
    {Object.entries(COLOR).map(([k, c]) => (
      <marker key={k} id={`a-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0L10 5L0 10z" fill={c} />
      </marker>
    ))}
  </defs>
);

// Rounded box with centred lines of text. `head` makes the first line bold.
const Box = ({ x, y, w, h, lines, tone = 'plain', head = false, size = 11, dashed = false }) => {
  const t = TONE[tone];
  const list = Array.isArray(lines) ? lines : [lines];
  const y0 = y + h / 2 - ((list.length - 1) * (size + 4)) / 2 + size / 3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={t.fill} stroke={t.stroke} strokeWidth="1.6" strokeDasharray={dashed ? '5 4' : undefined} />
      <text textAnchor="middle" fill={t.text} fontSize={size}>
        {list.map((l, i) => (
          <tspan key={i} x={x + w / 2} y={y0 + i * (size + 4)} fontWeight={head && i === 0 ? 700 : 600}>{l}</tspan>
        ))}
      </text>
    </g>
  );
};

const Diamond = ({ cx, cy, w, h, lines }) => (
  <g>
    <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`} fill={TONE.navy.fill} stroke={COLOR.navy} strokeWidth="1.6" />
    <text textAnchor="middle" fill={COLOR.navy} fontSize="11" fontWeight="600">
      {lines.map((l, i) => <tspan key={i} x={cx} y={cy + 4 - ((lines.length - 1) * 7.5) + i * 15}>{l}</tspan>)}
    </text>
  </g>
);

const Arrow = ({ d, color = 'navy', dashed = false }) => (
  <path d={d} fill="none" stroke={COLOR[color]} strokeWidth="2" strokeDasharray={dashed ? '6 4' : undefined} strokeLinecap="round" strokeLinejoin="round" markerEnd={`url(#a-${color})`} />
);

const Txt = ({ x, y, children, color = '#6e6e73', size = 11, anchor = 'middle', weight = 600, bg = false }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} {...(bg ? halo : {})}>{children}</text>
);

const Svg = ({ w, h, children }) => (
  <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-auto w-full" style={{ maxWidth: w * 1.2 }} role="img">
    <Defs />
    {children}
  </svg>
);

/* ---------- the four strategies ---------- */
const FIXES = [
  ['Mutual exclusion', ['Make resources', 'sharable', '(e.g. spooling)']],
  ['Hold and wait', ['Ask for all resources', 'at once, or hold', 'none while waiting']],
  ['No preemption', ['Let the OS take', 'resources away from', 'a waiting process']],
  ['Circular wait', ['Impose a fixed order', 'on resource types;', 'request in that order']],
];

const Prevention = () => (
  <Svg w={570} h={272}>
    <Txt x={285} y={20} color={COLOR.navy} size={12} weight={700}>Deadlock needs all four conditions at once</Txt>
    {FIXES.map(([name, lines], i) => {
      const x = 9 + i * 140;
      return (
        <g key={name}>
          <Box x={x} y={36} w={132} h={40} lines={name} tone="red" size={11.5} />
          <circle cx={x + 128} cy={38} r="9" fill="#fff" stroke={COLOR.red} strokeWidth="2" />
          <path d={`M${x + 124} 34l8 8M${x + 132} 34l-8 8`} stroke={COLOR.red} strokeWidth="2" strokeLinecap="round" />
          <Arrow d={`M${x + 66} 78V110`} color="green" />
          <Txt x={x + 74} y={98} anchor="start" size={10} color={COLOR.green}>break it</Txt>
          <Box x={x} y={113} w={132} h={86} lines={lines} tone="green" size={10.5} />
        </g>
      );
    })}
    <Box x={9} y={222} w={552} h={34} lines="Break any one condition and deadlock becomes impossible" tone="green" size={12} />
  </Svg>
);

const Avoidance = () => (
  <Svg w={600} h={292}>
    {/* decision flow */}
    <Box x={20} y={15} w={200} h={40} lines="Process requests a resource" />
    <Arrow d="M120 55V88" />
    <Diamond cx={120} cy={135} w={190} h={90} lines={['Is the system still', 'in a safe state?']} />
    <Arrow d="M120 180V203" color="green" />
    <Txt x={128} y={196} anchor="start" size={10.5} color={COLOR.green} bg>Yes</Txt>
    <Box x={70} y={205} w={100} h={36} lines="Grant request" tone="green" />
    <Arrow d="M215 135H275V203" color="red" />
    <Txt x={245} y={128} size={10.5} color={COLOR.red} bg>No</Txt>
    <Box x={225} y={205} w={100} h={36} lines="Make it wait" tone="red" />
    <Txt x={170} y={272} size={10.5}>Needs each process's maximum demand in advance</Txt>

    {/* state space */}
    <Box x={360} y={15} w={230} h={235} lines="" tone="ghost" dashed />
    <Txt x={475} y={34} color="#6e6e73" size={11}>All system states</Txt>
    <Box x={372} y={48} w={100} h={190} lines="" tone="green" />
    <Txt x={422} y={70} color={COLOR.green} size={12} weight={700}>Safe</Txt>
    <Box x={482} y={48} w={96} h={190} lines="" tone="amber" />
    <Txt x={530} y={70} color="#8a5a12" size={12} weight={700}>Unsafe</Txt>
    <Box x={494} y={150} w={72} h={70} lines="Deadlock" tone="red" />
    <Txt x={475} y={272} size={10.5}>Deadlock states sit inside the unsafe region</Txt>
  </Svg>
);

const Detection = () => (
  <Svg w={570} h={258}>
    <Box x={10} y={40} w={110} h={50} lines={['Processes run', 'normally']} />
    <Arrow d="M120 65H148" />
    <Box x={150} y={40} w={140} h={50} lines={['Run detection', 'algorithm periodically']} />
    <Arrow d="M290 65H308" />
    <Diamond cx={365} cy={65} w={110} h={72} lines={['Deadlock?']} />
    <Arrow d="M420 65H446" color="red" />
    <Txt x={433} y={55} size={10.5} color={COLOR.red} bg>Yes</Txt>
    <Box x={448} y={38} w={112} h={54} lines="Recover" tone="amber" size={12} />
    <Arrow d="M504 92V122" color="amber" />
    <Box x={448} y={124} w={112} h={38} lines={['Terminate', 'processes']} tone="plain" />
    <Txt x={504} y={178} size={10.5}>or</Txt>
    <Box x={448} y={184} w={112} h={38} lines={['Preempt resources', '& roll back']} tone="plain" />
    <Arrow d="M365 101V150H65V92" color="green" />
    <Txt x={375} y={124} anchor="start" size={10.5} color={COLOR.green} bg>No</Txt>
    <Txt x={215} y={166} size={10.5} bg>keep monitoring</Txt>
    <Txt x={230} y={244} size={11.5}>Deadlock is allowed to happen, then found and repaired</Txt>
  </Svg>
);

const Ignorance = () => (
  <Svg w={560} h={150}>
    <Box x={10} y={32} w={150} h={60} lines="Deadlock is rare" />
    <Arrow d="M160 62H203" />
    <Box x={205} y={32} w={150} h={60} lines={['Handling it costs', 'more than it saves']} />
    <Arrow d="M355 62H398" />
    <Box x={400} y={32} w={150} h={60} lines={['Do nothing;', 'restart if it hangs']} tone="amber" />
    <Txt x={280} y={132} size={11.5}>Common in general-purpose systems such as UNIX</Txt>
  </Svg>
);

const BUILT_IN = [
  [/prevent/i, Prevention, 'Prevention makes sure at least one of the four necessary conditions can never hold.'],
  [/avoid/i, Avoidance, 'Avoidance grants a request only if the system stays in a safe state.'],
  [/detect|recover/i, Detection, 'Detection and recovery lets deadlock occur, finds it, then breaks it.'],
  [/ignor|ostrich/i, Ignorance, 'The ostrich approach ignores deadlock and accepts the small risk.'],
];

/* ---------- diagram panel: built-in SVG, falls back to the ASCII text from the data ---------- */
const DiagramPanel = ({ name, diagram }) => {
  const hit = BUILT_IN.find(([re]) => re.test(name));
  if (hit) {
    const [, Diagram, caption] = hit;
    return (
      <figure className="mt-6 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-5">
        <Diagram />
        <figcaption className="mt-3 text-center text-sm text-[#6e6e73]">{caption}</figcaption>
      </figure>
    );
  }
  if (!diagram?.content) return null;
  return (
    <figure className="mt-6 overflow-x-auto rounded-2xl border border-black/[0.08] bg-gray-50/60 p-5">
      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-[#111d4a]">{diagram.content}</pre>
      {diagram.caption && <figcaption className="mt-3 border-t border-black/[0.06] pt-3 text-xs text-[#6e6e73]">{diagram.caption}</figcaption>}
    </figure>
  );
};

/* ---------- strategy card ---------- */
const StrategyCard = ({ method, index }) => {
  const [title, ...rest] = method.name.split(' (');
  const subtitle = rest.join(' (').replace(/\)\s*$/, '');
  const relation = method.relation_to_four_conditions || '';
  const targeted = CONDITIONS.filter((c) => c.re.test(relation));

  return (
    <article className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#111d4a] font-mono text-sm font-bold text-white">{index + 1}</span>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{title}</h3>
          {subtitle && <p className="text-sm text-[#6e6e73]">{subtitle}</p>}
        </div>
      </div>

      <p className="mt-4 leading-relaxed text-[#3a3a3c]" style={{ fontSize: 'var(--text-body)' }}>{method.summary}</p>

      <div className="mt-5 rounded-2xl bg-[#111d4a]/[0.04] p-5">
        <p className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>How it relates to the four deadlock conditions</p>
        {targeted.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Conditions this strategy targets">
            {CONDITIONS.map((c) => {
              const on = targeted.includes(c);
              return (
                <li
                  key={c.key}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                    on ? 'border-[#111d4a] bg-[#111d4a] text-white' : 'border-[#111d4a]/15 bg-white text-[#8e8e93]'
                  }`}
                >
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  {c.label}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-sm leading-relaxed text-[#6e6e73]">{relation}</p>
      </div>

      <DiagramPanel name={method.name} diagram={method.diagram} />
    </article>
  );
};

/* ---------- section ---------- */
const DeadlockHandlingSection = ({ sections = [] }) => {
  const handling = sections.find((s) => s.type === 'deadlock_handling');
  if (!handling?.methods?.length) return null;
  const { methods } = handling;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      <header>
        <div className="flex items-center gap-3">
          <Sliders className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
            Strategies &amp; trade-offs
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>{handling.title}</h2>
        <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
          {methods.length} {methods.length === 1 ? 'approach' : 'approaches'}, each tackling deadlock in a different way.
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {methods.map((m, i) => <StrategyCard key={m.name || i} method={m} index={i} />)}
      </div>
    </section>
  );
};

export default DeadlockHandlingSection;