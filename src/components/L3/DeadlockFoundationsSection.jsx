import React from 'react';
import { ShieldAlert, GitBranch, Lock } from 'lucide-react';

/* =====================================================================
   Diagram engine: draws resource-allocation style graphs as SVG.
   Process = circle, Resource = box (dots = instances).
   Request edge (P → R) = dashed amber, Assignment edge (R → P) = solid navy.
   ===================================================================== */
const NAVY = '#111d4a', RED = '#92140c', AMBER = '#b7791f', GREEN = '#2f6f5e', GREY = '#8e8e93';
const PR = 22; // process radius

const P = (x, y) => ({ kind: 'p', x, y });
const R = (x, y, n = 1) => ({ kind: 'r', x, y, n, w: Math.max(64, 28 + n * 18), h: 46 });

const edgePoint = (node, to) => {
  const dx = to.x - node.x, dy = to.y - node.y, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const dist = node.kind === 'p' ? PR : Math.min(node.w / 2 / (Math.abs(ux) || 1e-6), node.h / 2 / (Math.abs(uy) || 1e-6));
  return { x: node.x + ux * (dist + 3), y: node.y + uy * (dist + 3) };
};

const geometry = (a, b, bend = 0) => {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const c = { x: (a.x + b.x) / 2 - (dy / len) * bend, y: (a.y + b.y) / 2 + (dx / len) * bend };
  const p1 = edgePoint(a, bend ? c : b), p2 = edgePoint(b, bend ? c : a);
  return bend
    ? { d: `M${p1.x} ${p1.y}Q${c.x} ${c.y} ${p2.x} ${p2.y}`, mid: { x: 0.25 * p1.x + 0.5 * c.x + 0.25 * p2.x, y: 0.25 * p1.y + 0.5 * c.y + 0.25 * p2.y } }
    : { d: `M${p1.x} ${p1.y}L${p2.x} ${p2.y}`, mid: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 } };
};

const Arrowheads = ({ colors }) => (
  <defs>
    {[...colors].map((c) => (
      <marker key={c} id={`ah-${c.slice(1)}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0L10 5L0 10z" fill={c} />
      </marker>
    ))}
  </defs>
);

const halo = { stroke: '#fff', strokeWidth: 4, paintOrder: 'stroke', strokeLinejoin: 'round' };

const Graph = ({ spec }) => {
  const { w, h, nodes, edges, notes = [] } = spec;
  const styled = edges.map(([from, to, o = {}]) => {
    const request = nodes[from].kind === 'p';
    const color = o.color || (o.red ? RED : request ? AMBER : NAVY);
    return { from, to, o, request, color, ...geometry(nodes[from], nodes[to], o.bend) };
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-auto w-full" style={{ maxWidth: w * 1.25 }} role="img">
      <Arrowheads colors={new Set(styled.map((e) => e.color))} />
      {styled.map((e, i) => (
        <g key={i}>
          <path d={e.d} fill="none" stroke={e.color} strokeWidth="2" strokeDasharray={e.request ? '6 4' : undefined} strokeLinecap="round" markerEnd={`url(#ah-${e.color.slice(1)})`} />
          {e.o.mark && (
            <g stroke={RED} strokeWidth="2" strokeLinecap="round">
              <circle cx={e.mid.x} cy={e.mid.y} r="9" fill="#fff" />
              <path d={`M${e.mid.x - 4} ${e.mid.y - 4}l8 8M${e.mid.x + 4} ${e.mid.y - 4}l-8 8`} />
            </g>
          )}
          {e.o.label && (
            <text x={e.mid.x} y={e.mid.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={e.color} {...halo}>{e.o.label}</text>
          )}
        </g>
      ))}
      {Object.entries(nodes).map(([name, n]) =>
        n.kind === 'p' ? (
          <g key={name}>
            <circle cx={n.x} cy={n.y} r={PR} fill="#fff" stroke={NAVY} strokeWidth="2" />
            <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY}>{name}</text>
          </g>
        ) : (
          <g key={name}>
            <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx="9" fill="#fff" stroke={NAVY} strokeWidth="2" />
            <text x={n.x} y={n.y - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY}>{name}</text>
            {Array.from({ length: n.n }, (_, k) => (
              <circle key={k} cx={n.x + (k - (n.n - 1) / 2) * 16} cy={n.y + 11} r="4.5" fill={NAVY} />
            ))}
          </g>
        )
      )}
      {notes.map(([x, y, text, color = '#6e6e73'], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={color}>{text}</text>
      ))}
    </svg>
  );
};

/* ---------- diagram library ---------- */
const CYCLE2 = {
  w: 460, h: 225,
  nodes: { P1: P(70, 105), P2: P(390, 105), R1: R(230, 40), R2: R(230, 170) },
  edges: [
    ['R1', 'P1', { red: true, label: 'held by' }],
    ['P1', 'R2', { red: true, label: 'waits' }],
    ['R2', 'P2', { red: true, label: 'held by' }],
    ['P2', 'R1', { red: true, label: 'waits' }],
  ],
  notes: [[230, 215, 'Cycle: P1 → R2 → P2 → R1 → P1', RED]],
};

const DIAGRAMS = {
  overview: { ...CYCLE2, caption: 'P1 holds R1 and waits for R2, while P2 holds R2 and waits for R1. Neither can ever continue.' },
  single_instance: { ...CYCLE2, caption: 'Every resource has a single instance, so a cycle in the graph always means deadlock.' },
  mutual_exclusion: {
    w: 460, h: 160,
    nodes: { P1: P(70, 65), R1: R(230, 65), P2: P(390, 65) },
    edges: [['R1', 'P1', { label: 'held by' }], ['P2', 'R1', { label: 'waits' }]],
    notes: [[230, 142, 'Only one process can use R1 at a time']],
    caption: 'R1 cannot be shared. P2 must wait until P1 releases it.',
  },
  hold_and_wait: {
    w: 460, h: 160,
    nodes: { R1: R(50, 65), P1: P(170, 65), R2: R(290, 65), P2: P(410, 65) },
    edges: [['R1', 'P1', { label: 'held by' }], ['P1', 'R2', { label: 'waits' }], ['R2', 'P2', { label: 'held by' }]],
    notes: [[230, 142, 'P1 keeps R1 while it waits for R2']],
    caption: 'A process holding at least one resource is waiting for another resource held by someone else.',
  },
  no_preemption: {
    w: 460, h: 165,
    nodes: { P1: P(70, 65), R1: R(230, 65), P2: P(390, 65) },
    edges: [
      ['R1', 'P1', { label: 'held by' }],
      ['P2', 'R1', { bend: 26, label: 'wants' }],
      ['R1', 'P2', { bend: -26, color: GREY, mark: true }],
    ],
    notes: [[230, 148, 'R1 cannot be taken away by force']],
    caption: 'A resource is released only voluntarily by the process holding it, after it has finished.',
  },
  circular_wait: {
    w: 460, h: 275,
    nodes: { P1: P(230, 35), R2: R(335, 90), P2: P(335, 185), R3: R(230, 240), P3: P(125, 185), R1: R(125, 90) },
    edges: [
      ['R1', 'P1', { red: true }], ['P1', 'R2', { red: true }], ['R2', 'P2', { red: true }],
      ['P2', 'R3', { red: true }], ['R3', 'P3', { red: true }], ['P3', 'R1', { red: true }],
    ],
    notes: [[230, 138, 'Circular wait', RED], [230, 154, 'P1 → P2 → P3 → P1', '#6e6e73']],
    caption: 'P1 waits for P2, P2 waits for P3, and P3 waits for P1, forming a closed chain.',
  },
  small_rag: {
    w: 560, h: 160,
    nodes: { P1: P(50, 65), R1: R(170, 65), P2: P(290, 65), R2: R(410, 65), P3: P(520, 65) },
    edges: [
      ['P1', 'R1', { label: 'requests' }], ['R1', 'P2', { label: 'assigned' }],
      ['P2', 'R2', { label: 'requests' }], ['R2', 'P3', { label: 'assigned' }],
    ],
    notes: [[280, 142, 'No cycle in the graph, so no deadlock', GREEN]],
    caption: 'P1 waits for P2, P2 waits for P3, and P3 is not waiting for anything, so the chain resolves.',
  },
  multi_instance: {
    w: 560, h: 245,
    nodes: { R1: R(240, 50, 2), P1: P(70, 125), P2: P(410, 125), R2: R(240, 195), P3: P(510, 50) },
    edges: [
      ['P1', 'R1', { label: 'requests' }], ['R1', 'P2', { label: 'assigned' }],
      ['P2', 'R2', { label: 'requests' }], ['R2', 'P1', { label: 'assigned' }],
      ['R1', 'P3', { color: GREEN, label: 'assigned' }],
    ],
    notes: [[280, 238, 'There is a cycle, but P3 will release an instance of R1, so there is no deadlock', GREEN]],
    caption: 'With several instances, a cycle is necessary but not sufficient for deadlock.',
  },
};

// map the section data to a built-in diagram by id / name
const ALIASES = [
  [/mutual/, 'mutual_exclusion'], [/hold/, 'hold_and_wait'], [/preempt/, 'no_preemption'], [/circular/, 'circular_wait'],
  [/single/, 'single_instance'], [/multi/, 'multi_instance'],
];
const findDiagram = (...keys) => {
  const text = keys.filter(Boolean).join(' ').toLowerCase();
  const hit = ALIASES.find(([re]) => re.test(text));
  return hit ? DIAGRAMS[hit[1]] : null;
};

/* ---------- small icons for legend / notation ---------- */
const Glyph = ({ kind }) => (
  <svg viewBox="0 0 40 28" className="h-7 w-10 shrink-0" aria-hidden="true">
    {kind === 'process' && <circle cx="20" cy="14" r="10" fill="#fff" stroke={NAVY} strokeWidth="2" />}
    {kind === 'resource' && (
      <>
        <rect x="8" y="3" width="24" height="22" rx="4" fill="#fff" stroke={NAVY} strokeWidth="2" />
        <circle cx="16" cy="17" r="2.5" fill={NAVY} /><circle cx="24" cy="17" r="2.5" fill={NAVY} />
      </>
    )}
    {kind === 'request' && <path d="M4 14H32M26 8l8 6-8 6" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />}
    {kind === 'assign' && <path d="M4 14H32M26 8l8 6-8 6" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
const glyphKind = (name = '') => (/request/i.test(name) ? 'request' : /assign/i.test(name) ? 'assign' : /resource/i.test(name) ? 'resource' : /process/i.test(name) ? 'process' : null);

/* ---------- reusable UI ---------- */
const TONES = { navy: ['text-[#111d4a]', 'bg-[#111d4a]/[0.06]'], red: ['text-[#92140c]', 'bg-[#92140c]/[0.07]'] };

const Head = ({ icon: Icon, tone = 'navy', pill, title, text }) => (
  <header>
    <div className="flex items-center gap-3">
      <Icon className={`h-9 w-9 ${TONES[tone][0]}`} strokeWidth={1.5} />
      <span className={`rounded-full px-3.5 py-1 font-medium ${TONES[tone][0]} ${TONES[tone][1]}`} style={{ fontSize: 'var(--text-body)' }}>{pill}</span>
    </div>
    <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>{title}</h2>
    {text && <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{text}</p>}
  </header>
);

const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs ${className}`}>{children}</div>
);

const Legend = () => (
  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-black/[0.06] pt-3 text-xs text-[#6e6e73]">
    {[['process', 'Process'], ['resource', 'Resource (dots = instances)'], ['request', 'Request edge'], ['assign', 'Assignment edge']].map(([k, t]) => (
      <span key={k} className="flex items-center gap-1"><Glyph kind={k} />{t}</span>
    ))}
  </div>
);

// Built-in SVG diagram. Falls back to the ASCII text from the data if no built-in version exists.
const DiagramCard = ({ spec, fallback }) => {
  if (spec)
    return (
      <div className="mt-6 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-5">
        <Graph spec={spec} />
        {spec.caption && <p className="mt-3 text-center text-sm text-[#6e6e73]">{spec.caption}</p>}
        <Legend />
      </div>
    );
  if (!fallback?.content) return null;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-black/[0.08] bg-gray-50/60 p-5">
      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-[#111d4a]">{fallback.content}</pre>
      {fallback.caption && <p className="mt-3 border-t border-black/[0.06] pt-3 text-xs text-[#6e6e73]">{fallback.caption}</p>}
    </div>
  );
};

const NotationCard = ({ data }) => (
  <Card className="p-5">
    <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>{data?.title}</h3>
    <ul className="mt-4 divide-y divide-black/[0.06]">
      {data?.types?.map((t) => (
        <li key={t.name} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          {glyphKind(t.name) && <Glyph kind={glyphKind(t.name)} />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">{t.name}</span>
              <code className="rounded-md bg-black/[0.04] px-2 py-0.5 font-mono text-xs font-medium text-[#92140c]">{t.notation}</code>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[#6e6e73]">{t.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Card>
);

const Block = ({ children }) => (
  <section className="mt-16 border-t border-black/[0.06] pt-14 first:mt-0 first:border-t-0 first:pt-0">{children}</section>
);

/* ---------- component ---------- */
const DeadlockFoundationsSection = ({ sections = [] }) => {
  const overview = sections.find((s) => s.type === 'deadlock_overview');
  const coffman = sections.find((s) => s.type === 'coffman_conditions');
  const rag = sections.find((s) => s.type === 'rag_section');

  if (!overview && !coffman && !rag) return null;

  const conditions = coffman?.conditions || [];
  const instances = ['single_instance', 'multi_instance']
    .map((key) => ({ key, ...rag?.resource_instances?.[key] }))
    .filter((i) => i.title || i.explanation || i.diagram);
  const prim = rag?.graph_primitives;

  return (
    <div
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      {/* 1. Overview */}
      {overview && (
        <Block>
          <Head icon={ShieldAlert} tone="red" pill="Deadlock Basics" title={overview.title} />
          <blockquote className="mt-6 rounded-2xl border-l-4 border-[#111d4a] bg-[#111d4a]/[0.04] p-5 font-medium leading-relaxed" style={{ fontSize: 'var(--text-body)' }}>
            {overview.definition}
          </blockquote>
          <p className="mt-4 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{overview.explanation}</p>
          <DiagramCard spec={DIAGRAMS.overview} fallback={overview.diagram} />
        </Block>
      )}

      {/* 2. Coffman conditions */}
      {conditions.length > 0 && (
        <Block>
          <Head icon={Lock} pill="Coffman Conditions" title={coffman.title} text={coffman.description} />

          <div className="mt-8 space-y-6">
            {conditions.map((c, i) => (
              <Card key={c.id || i}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#111d4a] font-mono text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{c.name}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-[#3a3a3c]" style={{ fontSize: 'var(--text-body)' }}>{c.explanation}</p>
                <DiagramCard spec={findDiagram(c.id, c.name)} fallback={c.diagram} />
              </Card>
            ))}
          </div>
        </Block>
      )}

      {/* 3. Resource allocation graph */}
      {rag && (
        <Block>
          <Head icon={GitBranch} pill="Graph Modeling" title={rag.title} text={prim?.description} />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <NotationCard data={prim?.vertices} />
            <NotationCard data={prim?.edges} />
          </div>

          {prim?.small_example_diagram && (
            <div className="mt-8">
              <h3 className="font-semibold" style={{ fontSize: 'var(--text-subheader)' }}>Small RAG Example</h3>
              <DiagramCard spec={DIAGRAMS.small_rag} fallback={prim.small_example_diagram} />
            </div>
          )}

          {instances.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="font-semibold" style={{ fontSize: 'var(--text-subheader)' }}>Resource Instance Behavior</h3>
              {instances.map((inst) => (
                <Card key={inst.key}>
                  <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>{inst.title}</h4>
                  <p className="mt-2 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{inst.explanation}</p>
                  <DiagramCard spec={DIAGRAMS[inst.key]} fallback={inst.diagram} />
                </Card>
              ))}
            </div>
          )}
        </Block>
      )}
    </div>
  );
};

export default DeadlockFoundationsSection;