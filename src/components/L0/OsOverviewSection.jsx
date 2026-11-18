import React from 'react';
import { Cpu, Terminal, LayoutGrid } from 'lucide-react';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const OsOverviewSection = ({ section: propSection }) => {
  // Internal fallback dataset
  const defaultSectionData = {
    title: 'Operating System Overview',
    definition: 'An operating system is a program that manages the computer hardware and provides a basis for application programs.',
    roles: [
      { name: 'Resource Allocator', description: 'Manages and allocates CPU time, memory space, and I/O devices efficiently.' },
      { name: 'Control Program', description: 'Controls the execution of user programs to prevent errors and improper use.' },
      { name: 'Abstract Interface', description: 'Hides complex hardware details from users and application software.' },
    ],
    goals: [
      { goal: 'Execute User Programs', description: 'Make solving user problems easier and more convenient.' },
      { goal: 'Make Computer Convenient', description: 'Provide an intuitive environment for hardware interaction.' },
      { goal: 'Efficient Hardware Use', description: 'Maximize hardware utilization in a multi-user or single-user setup.' },
    ],
    computer_system: {
      title: 'Computer System',
      definition: 'A computer system can be divided into 4 main components:',
      components: [
        { name: 'Hardware', description: 'Provides basic computing resources (CPU, memory, I/O devices).' },
        { name: 'Operating System', description: 'Controls and coordinates the use of hardware among various applications and users.' },
        { name: 'Application Programs', description: 'Define the ways in which system resources are used to solve the computing problems of the user (e.g., word processors, compilers, web browsers).' },
        { name: 'Users', description: 'People, machines, or other computers.' }
      ]
    },
    kernel: {
      title: 'Kernel',
      definition: 'In computing, the kernel is a computer program that manages I/O requests from software, and translates them into data processing instructions for the CPU and other electronic components of a computer.',
      bridge: 'The kernel is a core part of an operating system which acts like a bridge between applications and hardware of the computer.',
    }
  };

  // Merge incoming prop data safely with internal fallback dataset
  const section = {
    ...defaultSectionData,
    ...propSection,
    roles: propSection?.roles || defaultSectionData.roles,
    goals: propSection?.goals || defaultSectionData.goals,
    computer_system: propSection?.computer_system || defaultSectionData.computer_system,
    kernel: propSection?.kernel || defaultSectionData.kernel,
  };

  const enter = (i) => ({
    animation: `example-rise 700ms ${EASE} both`,
    animationDelay: `${i * 90}ms`,
  });

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes example-rise {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
      `}</style>

      {/* 1. Operating System Overview Header */}
      <header data-example-enter style={enter(0)}>
        <div className="flex items-center gap-3">
          <Cpu className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span
            className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            Lecture 01
          </span>
        </div>
        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {section.title}
        </h2>
        <p
          className="mt-4 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {section.definition}
        </p>
      </header>

      {/* 2. Core Roles of an Operating System */}
      <div data-example-enter style={enter(1)} className="mt-12 border-t border-black/[0.06] pt-10">
        <h3
          className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-subheader)' }}
        >
          Core Roles of an Operating System
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {section.roles.map((role, idx) => (
            <div key={idx} className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xs">
              <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
                {role.name}
              </h4>
              <p className="mt-2 text-[#6e6e73] leading-relaxed text-xs sm:text-sm">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Operating System Goals */}
      <div data-example-enter style={enter(2)} className="mt-12 border-t border-black/[0.06] pt-10">
        <h3
          className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-subheader)' }}
        >
          Operating System Goals
        </h3>
        <ul className="mt-6 divide-y divide-black/[0.06]">
          {section.goals.map((goal, idx) => (
            <li key={idx} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="font-semibold text-[#1d1d1f]" style={{ fontSize: 'var(--text-body)' }}>
                {goal.goal}
              </span>
              <span className="text-[#6e6e73] max-w-md text-right text-xs sm:text-sm">
                {goal.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Computer System */}
      {section.computer_system && (
        <div data-example-enter style={enter(3)} className="mt-12 border-t border-black/[0.06] pt-10">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-6 w-6 text-[#111d4a]" strokeWidth={1.5} />
            <h3
              className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
              style={{ fontSize: 'var(--text-subheader)' }}
            >
              {section.computer_system.title}
            </h3>
          </div>

          <p className="mt-3 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
            {section.computer_system.definition}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.computer_system.components.map((comp, idx) => (
              <div key={idx} className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xs">
                <h4 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-body)' }}>
                  {comp.name}
                </h4>
                <p className="mt-1.5 text-[#6e6e73] leading-relaxed text-xs sm:text-sm">
                  {comp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Conceptual View of a Computer System Diagram */}
          <div className="mt-8 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-8 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Conceptual View of a Computer System
            </span>

            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <div className="grid grid-cols-4 gap-2 w-full text-center">
                <div className="rounded-xl border border-black/[0.1] bg-white py-2 px-2 text-[11px] font-semibold text-[#1d1d1f]">User 1</div>
                <div className="rounded-xl border border-black/[0.1] bg-white py-2 px-2 text-[11px] font-semibold text-[#1d1d1f]">User 2</div>
                <div className="rounded-xl border border-black/[0.1] bg-white py-2 px-2 text-[11px] font-semibold text-[#1d1d1f]">User 3</div>
                <div className="rounded-xl border border-black/[0.1] bg-white py-2 px-2 text-[11px] font-semibold text-[#1d1d1f]">User n</div>
              </div>

              <div className="text-gray-400 font-mono text-xs">↕</div>

              <div className="grid grid-cols-4 gap-2 w-full text-center">
                <div className="rounded-xl border border-[#111d4a]/20 bg-white py-2 px-1 text-[10px] font-medium text-[#111d4a]">Compiler</div>
                <div className="rounded-xl border border-[#111d4a]/20 bg-white py-2 px-1 text-[10px] font-medium text-[#111d4a]">Assembler</div>
                <div className="rounded-xl border border-[#111d4a]/20 bg-white py-2 px-1 text-[10px] font-medium text-[#111d4a]">Text Editor</div>
                <div className="rounded-xl border border-[#111d4a]/20 bg-white py-2 px-1 text-[10px] font-medium text-[#111d4a]">Database</div>
              </div>

              <div className="text-gray-400 font-mono text-xs">↕</div>

              <div className="w-full rounded-xl border border-[#111d4a]/30 bg-[#111d4a]/5 py-3 px-6 text-center font-semibold text-[#111d4a] text-sm shadow-2xs">
                Operating System
              </div>

              <div className="text-gray-400 font-mono text-xs">↕</div>

              <div className="w-full rounded-xl border-2 border-[#111d4a] bg-[#111d4a] py-3 px-6 text-center font-bold text-white text-sm shadow-sm">
                Computer Hardware
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Kernel */}
      {section.kernel && (
        <div data-example-enter style={enter(4)} className="mt-12 border-t border-black/[0.06] pt-10">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6 text-[#111d4a]" strokeWidth={1.5} />
            <h3
              className="font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
              style={{ fontSize: 'var(--text-subheader)' }}
            >
              {section.kernel.title}
            </h3>
          </div>

          <p className="mt-4 leading-relaxed text-[#6e6e73]" style={{ fontSize: 'var(--text-body)' }}>
            {section.kernel.definition}
          </p>
          <p className="mt-3 leading-relaxed text-[#1d1d1f] font-medium" style={{ fontSize: 'var(--text-body)' }}>
            {section.kernel.bridge}
          </p>

          {/* Architectural Diagram Box */}
          <div className="mt-8 rounded-2xl border border-black/[0.08] bg-gray-50/60 p-8 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Kernel Architecture Diagram
            </span>

            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <div className="w-full rounded-xl border border-[#111d4a]/20 bg-white py-3 px-6 text-center font-semibold text-[#111d4a] shadow-2xs">
                Application Software
              </div>

              <div className="text-gray-400 font-mono text-sm">↕</div>

              <div className="w-full rounded-xl border-2 border-[#111d4a] bg-[#111d4a] py-3.5 px-6 text-center font-bold text-white shadow-sm">
                Kernel (Core OS)
              </div>

              <div className="flex justify-around w-3/4 text-gray-400 font-mono text-sm">
                <span>↕</span>
                <span>↕</span>
                <span>↕</span>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="rounded-xl border border-black/[0.1] bg-white py-2.5 text-center text-xs font-semibold text-[#1d1d1f]">
                  CPU
                </div>
                <div className="rounded-xl border border-black/[0.1] bg-white py-2.5 text-center text-xs font-semibold text-[#1d1d1f]">
                  Memory
                </div>
                <div className="rounded-xl border border-black/[0.1] bg-white py-2.5 text-center text-xs font-semibold text-[#1d1d1f]">
                  Devices
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OsOverviewSection;