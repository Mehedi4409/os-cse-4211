import React, { useState, useEffect, useMemo } from 'react';
import deadlockData from '../components/data/lecture3.json';
import DeadlockFoundationsSection from '../components/L3/DeadlockFoundationsSection';
import DeadlockHandlingSection from '../components/L3/DeadlockHandlingSection';
import BankersAlgorithmSection from '../components/L3/BankersAlgorithmSection';

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

const Lecture4 = () => {
  const sections = deadlockData?.lecture?.sections || [];

  const SECTIONS = useMemo(
    () => [
      {
        id: 'deadlock-foundations',
        label: 'Deadlock & RAG',
        el: <DeadlockFoundationsSection sections={sections} />,
      },
      {
        id: 'deadlock-handling',
        label: 'Handling Methods',
        el: <DeadlockHandlingSection sections={sections} />,
      },
      {
        id: 'bankers-algorithm',
        label: "Banker's Algorithm",
        el: <BankersAlgorithmSection sections={sections} />,
      },
    ],
    [sections]
  );

  const [active, setActive] = useState(SECTIONS[0].id);

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
      className="min-h-screen px-4 pb-24 pt-6 text-gray-800 sm:px-6 xl:grid xl:grid-cols-[11rem_minmax(0,48rem)_11rem] xl:justify-center xl:gap-10"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <nav
        className="sticky top-16 z-20 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md lg:top-0
                   xl:top-10 xl:mx-0 xl:mb-0 xl:flex-col xl:self-start xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:backdrop-blur-none"
      >
        <p className="mb-1 hidden px-3 text-xs font-medium text-gray-400 xl:block">On this page</p>
        {SECTIONS.map(({ id, label }) => (
          <NavButton key={id} label={label} active={active === id} onClick={() => goTo(id)} />
        ))}
      </nav>

      <main className="mx-auto w-full max-w-3xl space-y-16 xl:max-w-none">
        {SECTIONS.map(({ id, el }) => (
          <section key={id} id={id} className="scroll-mt-32">
            {el}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Lecture4;