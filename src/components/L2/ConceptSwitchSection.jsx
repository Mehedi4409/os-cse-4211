import React from 'react';
import { Layers, RefreshCw, Cpu, ArrowDown } from 'lucide-react';

const ConceptSwitchSection = ({ sections = [] }) => {
  const concept = sections.find((s) => s.type === 'concept');
  if (!concept) return null;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
      }}
    >
      <header>
        <div className="flex items-center gap-3">
          <Layers className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span
            className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            Core Concepts
          </span>
        </div>
        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {concept.title}
        </h2>
        <p
          className="mt-4 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {concept.definition}
        </p>
      </header>

      {/* Characteristics Card */}
      <div className="mt-10 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
        <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>
          Characteristics & Overhead
        </h3>
        <ul className="mt-4 space-y-3 text-xs sm:text-sm text-[#6e6e73]">
          {concept.characteristics.map((char, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#111d4a] font-bold">•</span>
              <span>{char}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Context Switch Visual Diagram Section */}
      <div className="mt-10 rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>
            Diagram: Transition from Process P_0 to P_1
          </h3>
          <RefreshCw className="h-5 w-5 text-[#92140c] animate-spin-slow" />
        </div>
        <p className="mt-1 text-xs text-[#6e6e73]">
          Visualizing CPU register preservation and restoration across process states via kernel intervention.
        </p>

        {/* Interactive Flow Columns */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          
          {/* Process P0 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <span className="font-bold text-[#111d4a] text-sm">Process P_0</span>
            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded bg-white p-2 border border-blue-200 font-medium text-gray-700 shadow-2xs">
                Executing instructions
              </div>
              <div className="text-[11px] text-gray-400 italic">Interrupted / System Call</div>
              <div className="rounded bg-gray-100 p-2 text-gray-500 italic">
                Idle (Waiting state)
              </div>
            </div>
          </div>

          {/* Operating System Kernel Transition */}
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-4 space-y-3">
            <span className="font-bold text-[#92140c] text-sm flex items-center justify-center gap-1.5">
              <Cpu className="h-4 w-4" /> Operating System
            </span>
            <div className="space-y-2 text-xs">
              <div className="rounded bg-white p-2 border border-red-200 font-semibold text-[#111d4a] shadow-2xs">
                Save state into PCB_0
              </div>
              <div className="flex justify-center text-[#92140c]">
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </div>
              <div className="rounded bg-white p-2 border border-red-200 font-semibold text-[#111d4a] shadow-2xs">
                Reload state from PCB_1
              </div>
            </div>
          </div>

          {/* Process P1 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <span className="font-bold text-emerald-800 text-sm">Process P_1</span>
            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded bg-gray-100 p-2 text-gray-500 italic">
                Idle (Previously waiting)
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">State restored</div>
              <div className="rounded bg-emerald-600 text-white p-2 font-medium shadow-2xs">
                Executing on CPU
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ConceptSwitchSection;