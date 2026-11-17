import React, { useState, useEffect } from 'react';
import lectureData from '../components/L1/L2.json';
import ClassificationSection from '../components/L1/component/ClassificationSection';
import TerminologySection from '../components/L1/component/TerminologySection';
import CriteriaSection from '../components/L1/component/CriteriaSection';
import WorkedExampleSection from '../components/L1/component/WorkedExampleSection';
import ConvoyEffectSection from './L1/component/ConvoyEffectSection';
import PracticeSection from './L1/component/PracticeSection';

const get = (type) => lectureData.sections.find((s) => s.type === type);

// Single source of truth: drives both the nav and the page body.
const SECTIONS = [
  { id: 'classification', label: 'Classification', el: <ClassificationSection classification={get('theory_classification')} /> },
  { id: 'terminology', label: 'Terminology', el: <TerminologySection terminology={get('terminology')} /> },
  { id: 'criteria', label: 'Criteria', el: <CriteriaSection criteria={get('criteria')} /> },
  { id: 'examples', label: 'Worked Examples', el: <WorkedExampleSection section={get('worked_examples')} /> },
  { id: 'deep-dive', label: 'Convoy Effect', el: <ConvoyEffectSection section={get('concept_deep_dive')} /> },
  { id: 'practice', label: 'Practice', el: <PracticeSection /> },
];

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

const Lecture2 = () => {
  const [active, setActive] = useState(SECTIONS[0].id);

  // Scrollspy: highlight whichever section crosses the upper part of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach(({ id }) => io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, []);

  const goTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="min-h-screen px-4 pb-24 pt-10 text-gray-800 sm:px-6 xl:grid xl:grid-cols-[10rem_minmax(0,48rem)_10rem] xl:justify-center xl:gap-10"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Top bar below xl; on xl it becomes the left grid column, so it stays inside the page area and never overlaps SideNav */}
      <nav
        className="sticky top-16 z-20 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md lg:top-0
                   xl:top-10 xl:mx-0 xl:mb-0 xl:flex-col xl:self-start xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:backdrop-blur-none"
      >
        <p className="mb-1 hidden px-3 text-xs font-medium text-gray-400 xl:block">On this page</p>
        {SECTIONS.map(({ id, label }) => (
          <NavButton key={id} label={label} active={active === id} onClick={() => goTo(id)} />
        ))}
      </nav>

      {/* Content stays centered: the empty right column mirrors the nav column */}
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

export default Lecture2;