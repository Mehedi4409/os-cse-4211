import React from 'react';
import lectureData from '../components/L1/L2.json';
import ClassificationSection from '../components/L1/component/ClassificationSection';
import TerminologySection from '../components/L1/component/TerminologySection';
import CriteriaSection from '../components/L1/component/CriteriaSection';
import WorkedExampleSection from '../components/L1/component/WorkedExampleSection';

const Lecture2 = () => {
  const classification = lectureData.sections.find(s => s.type === 'theory_classification');
  const terminology = lectureData.sections.find(s => s.type === 'terminology');
  const criteria = lectureData.sections.find(s => s.type === 'criteria');
  const example = lectureData.sections.find(s => s.type === 'worked_example');

  return (
    <div className="space-y-12 text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <ClassificationSection classification={classification} />
      <TerminologySection terminology={terminology} />
      <CriteriaSection criteria={criteria} />
      <WorkedExampleSection example={example} />
    </div>
  );
};

export default Lecture2;