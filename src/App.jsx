import React, { useState } from 'react';
import { ReactLenis } from 'lenis/react';

import SideNav from './components/SideNav';
import HomeView from './components/HomeView';
import Lecture1 from './components/Lecture1';
import Lecture2 from './components/Lecture2';
import Lecture3 from './components/Lecture3';
import Lecture4 from './components/Lecture4';
import Lecture5 from './components/Lecture5';
import ResourceSection from './components/ResourceSection';

const LECTURES = [
  { id: 'lecture-1', number: '01', title: 'Introduction to OS', component: Lecture1 },
  { id: 'lecture-2', number: '02', title: 'CPU Scheduling', component: Lecture2 },
  { id: 'lecture-3', number: '03', title: 'Processes & Threads', component: Lecture3 },
  { id: 'lecture-4', number: '04', title: 'Process Synchronization', component: Lecture4 },
  { id: 'lecture-5', number: '05', title: 'Deadlocks', component: Lecture5 },
];

function App() {
  const [activeId, setActiveId] = useState('home');

  const activeLecture = LECTURES.find((lec) => lec.id === activeId);
  const ActiveComponent = activeLecture?.component;

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-white text-black">
        <SideNav lectures={LECTURES} activeId={activeId} onSelect={setActiveId}>
          <div className="lg:px-8 sm:px-4 pt-8">
            {activeId === 'home' ? (
              <HomeView onStartLecture={() => setActiveId(LECTURES[0].id)} />
            ) : activeId === 'resources' ? (
              <ResourceSection />
            ) : (
              activeLecture && (
                <div className="space-y-6">
                  {ActiveComponent && <ActiveComponent />}
                </div>
              )
            )}
          </div>
        </SideNav>
      </div>
    </ReactLenis>
  );
}

export default App;