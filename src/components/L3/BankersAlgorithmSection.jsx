import React from 'react';
import { Calculator, Info, CheckCircle2, Check, X } from 'lucide-react';

/* ---------- reusable pieces ---------- */
const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs ${className}`}>{children}</div>
);

const Title = ({ children, right }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-3">
    <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>{children}</h3>
    {right}
  </div>
);

const Step = ({ n, children }) => (
  <section className="mt-14 border-t border-black/[0.06] pt-12">
    <span className="rounded-full bg-[#111d4a]/[0.06] px-3 py-1 font-mono text-xs font-semibold text-[#111d4a]">Step {n}</span>
    <div className="mt-4">{children}</div>
  </section>
);

// A vector shown as small boxes: (3, 3, 2) → [3][3][2]
const TONES = { navy: 'text-[#111d4a]', red: 'text-[#92140c]', green: 'text-[#2f6f5e]', grey: 'text-[#6e6e73]' };
const Vec = ({ v = [], tone = 'navy' }) => (
  <span className="inline-flex gap-1" aria-label={`(${v.join(', ')})`}>
    {v.map((x, i) => (
      <span key={i} className={`min-w-7 rounded-md bg-black/[0.05] px-1.5 py-0.5 text-center font-mono text-xs font-semibold ${TONES[tone]}`}>{x}</span>
    ))}
  </span>
);

const Table = ({ head, min = 320, children }) => (
  <div className="mt-5 overflow-x-auto">
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

const fits = (need, work) => Array.isArray(need) && Array.isArray(work) && need.every((n, i) => n <= work[i]);

/* ---------- section ---------- */
const BankersAlgorithmSection = ({ sections = [] }) => {
  const bankers = sections.find((s) => s.type === 'bankers_algorithm');
  if (!bankers) return null;

  const { problem_input: input, math_and_steps: math } = bankers;
  const resources = input?.resources || ['r1', 'r2', 'r3'];
  const step1 = math?.step_1_calculate_need;
  const step2 = math?.step_2_safety_algorithm;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif' }}
    >
      <header>
        <div className="flex items-center gap-3">
          <Calculator className="h-9 w-9 text-[#92140c]" strokeWidth={1.5} />
          <span className="rounded-full bg-[#92140c]/[0.07] px-3.5 py-1 font-medium text-[#92140c]" style={{ fontSize: 'var(--text-body)' }}>
            Deadlock Avoidance Math
          </span>
        </div>
        <h2 className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em]" style={{ fontSize: 'var(--text-header)' }}>{bankers.title}</h2>
        <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>{bankers.brief}</p>
      </header>

      {/* Given data */}
      <Card className="mt-10">
        <Title>Given: Maximum Need</Title>
        {input?.description && <p className="mt-2 text-sm text-[#6e6e73]">{input.description}</p>}
        <Table head={['Process', ...resources]}>
          {input?.max_need?.map((row) => (
            <tr key={row.process}>
              <td className="py-3 pr-4 font-semibold text-[#111d4a]">{row.process}</td>
              {resources.map((r) => (
                <td key={r} className="py-3 pr-4 font-mono text-sm text-[#3a3a3c]">{row[r]}</td>
              ))}
            </tr>
          ))}
        </Table>
        {input?.assumptions_note && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/80 p-3.5 text-sm leading-relaxed text-amber-950">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <span>{input.assumptions_note}</span>
          </div>
        )}
      </Card>

      {/* Formulas */}
      {math?.formulas?.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#8e8e93]">Key formulas</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {math.formulas.map((f, i) => (
              <li key={i} className="rounded-xl border border-black/[0.08] bg-[#111d4a]/[0.04] px-4 py-3 font-mono text-xs leading-relaxed text-[#111d4a]">{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1 */}
      {step1 && (
        <Step n={1}>
          <Card>
            <Title>{step1.title}</Title>
            <p className="mt-4 rounded-xl bg-black/[0.03] p-4 font-mono text-xs leading-relaxed text-[#1d1d1f]">{step1.available_calculation}</p>
            <p className="mt-5 text-xs text-[#8e8e93]">Vectors are in the order ({resources.join(', ')}).</p>
            <Table head={['Process', 'Max', 'Allocation', 'Need', 'Calculation']} min={560}>
              {step1.need_rows?.map((r) => (
                <tr key={r.process}>
                  <td className="py-3.5 pr-4 font-semibold text-[#111d4a]">{r.process}</td>
                  <td className="py-3.5 pr-4"><Vec v={r.max} tone="grey" /></td>
                  <td className="py-3.5 pr-4"><Vec v={r.allocation} tone="grey" /></td>
                  <td className="py-3.5 pr-4"><Vec v={r.need} tone="red" /></td>
                  <td className="py-3.5 font-mono text-xs text-[#6e6e73]">{r.calc}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </Step>
      )}

      {/* Step 2 */}
      {step2 && (
        <Step n={2}>
          <Card>
            <Title right={
              <span className="inline-flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-1.5 text-xs font-semibold text-[#111d4a]">
                Initial Work <Vec v={step2.initial_work} />
              </span>
            }>
              {step2.title}
            </Title>

            <ol className="mt-6 space-y-3">
              {step2.iterations?.map((it, i) => {
                const ok = fits(it.need, it.work_before);
                const known = Array.isArray(it.need) && Array.isArray(it.work_before);
                return (
                  <li key={i} className={`rounded-xl border p-4 ${known ? (ok ? 'border-[#2f6f5e]/25 bg-[#2f6f5e]/[0.04]' : 'border-[#b7791f]/30 bg-[#b7791f]/[0.05]') : 'border-black/[0.08] bg-gray-50/60'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${known ? (ok ? 'bg-[#2f6f5e]' : 'bg-[#b7791f]') : 'bg-[#111d4a]'}`}>
                        {known ? (ok ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <X className="h-3.5 w-3.5" strokeWidth={3} />) : <span className="text-xs font-bold">{i + 1}</span>}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>{i + 1}. {it.step}</p>

                        {known && (
                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                            <span className="text-[#8e8e93]">Need</span><Vec v={it.need} tone="red" />
                            <span className={`font-mono text-sm font-bold ${ok ? 'text-[#2f6f5e]' : 'text-[#b7791f]'}`}>{ok ? '≤' : '≰'}</span>
                            <span className="text-[#8e8e93]">Work</span><Vec v={it.work_before} />
                            {it.work_after && (
                              <>
                                <span className="text-[#8e8e93]">→</span>
                                <span className="text-[#8e8e93]">New Work</span><Vec v={it.work_after} tone="green" />
                              </>
                            )}
                          </div>
                        )}

                        <p className="mt-3 font-mono text-xs leading-relaxed text-[#6e6e73]">{it.comparison}</p>
                        <p className="mt-1.5 text-sm font-medium text-[#1d1d1f]">{it.result}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {step2.safe_sequence?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#2f6f5e]/30 bg-[#2f6f5e]/[0.06] p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2f6f5e]">
                <CheckCircle2 className="h-4 w-4" /> Safe sequence found
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-lg font-bold text-[#2f6f5e]">&lt;</span>
                {step2.safe_sequence.map((p, i) => (
                  <React.Fragment key={p}>
                    {i > 0 && <span className="text-[#2f6f5e]">→</span>}
                    <span className="rounded-lg bg-[#2f6f5e] px-3 py-1.5 font-mono text-sm font-bold text-white">{p}</span>
                  </React.Fragment>
                ))}
                <span className="font-mono text-lg font-bold text-[#2f6f5e]">&gt;</span>
              </div>
              {step2.conclusion && <p className="mt-4 text-sm leading-relaxed text-[#1d1d1f]">{step2.conclusion}</p>}
            </div>
          )}
        </Step>
      )}
    </section>
  );
};

export default BankersAlgorithmSection;