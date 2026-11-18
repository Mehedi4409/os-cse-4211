import React, { useState, useEffect, useMemo } from 'react';
import lectureData from '../components/data/lecture2_part2.json';
import AlgorithmDeepDiveSection from '../components/L2/AlgorithmDeepDiveSection';
import ConceptSwitchSection from '../components/L2/ConceptSwitchSection';
import SchedulingComparisonsSection from '../components/L2/SchedulingComparisonsSection';
import CpuUtilizationSection from '../components/L2/CpuUtilizationSection';
import TextbookProblemsSection from '../components/L2/TextbookProblemsSection';
import SJFSection from  '../components/L2/SJFSection'; // Adjust path if SJFSection.jsx is located elsewhere
import PriorityRRSection from '../components/L2/PriorityRRSection'

const get = (type) => lectureData.lecture.sections.find((s) => s.type === type);
const getAlgos = () => lectureData.lecture.sections.filter((s) => s.type === 'algorithm_deep_dive');

const NavButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-sm font-medium transition-colors ${
      active ? 'bg-[#111d4a] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

const Lecture3 = () => {
  // Single source of truth: drives both the nav and the page body, including the new SJF Solver.
  const SECTIONS = useMemo(() => [
    { id: 'algorithms', label: 'Algorithms', el: <AlgorithmDeepDiveSection sections={getAlgos()} /> },
    { id: 'context-switch', label: 'Context Switch', el: <ConceptSwitchSection sections={lectureData.lecture.sections} /> },
    { id: 'comparisons', label: 'Comparisons', el: <SchedulingComparisonsSection sections={lectureData.lecture.sections} /> },
    { id: 'cpu-utilization', label: 'CPU Utilization', el: <CpuUtilizationSection sections={lectureData.lecture.sections} /> },
    { id: 'sjf-solver', label: 'SJF Numerical Solver', el: <SJFSection /> },
    { id: 'sjf-solver2', label: 'Priority Queue and RR', el: <PriorityRRSection /> },
    { id: 'problems', label: 'Exercises', el: <TextbookProblemsSection sections={lectureData.lecture.sections} /> },
  ], []);

  const [active, setActive] = useState(SECTIONS[0].id);

  // Scrollspy: highlight whichever section crosses the upper part of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [SECTIONS]);

  const goTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="min-h-screen px-4 pb-24 pt-10 text-gray-800 sm:px-6 xl:grid xl:grid-cols-[12rem_minmax(0,48rem)_12rem] xl:justify-center xl:gap-10"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Top bar below xl; on xl it becomes the left grid column */}
      <nav
        className="sticky top-16 z-20 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md lg:top-0
                   xl:top-10 xl:mx-0 xl:mb-0 xl:flex-col xl:self-start xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:backdrop-blur-none"
      >
        <p className="mb-1 hidden px-3 text-xs font-medium text-gray-400 xl:block">On this page</p>
        {SECTIONS.map(({ id, label }) => (
          <NavButton key={id} label={label} active={active === id} onClick={() => goTo(id)} />
        ))}
      </nav>

      {/* Content area */}
      <main className="mx-auto w-full max-w-3xl space-y-20 xl:max-w-none">
        {SECTIONS.map(({ id, el }) => (
          <section key={id} id={id} className="scroll-mt-32">
            {el}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Lecture3;