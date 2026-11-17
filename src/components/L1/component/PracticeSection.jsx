import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import practiceData from '../../data/lecture2_practice.json';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const PracticeSection = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState({});

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <HelpCircle className="h-9 w-9 text-[#111d4a]" strokeWidth={1.5} />
          <span
            className="rounded-full bg-[#111d4a]/[0.06] px-3.5 py-1 font-medium text-[#111d4a]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            Interactive Quiz
          </span>
        </div>
        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          {practiceData.title}
        </h2>
        <p
          className="mt-3 leading-relaxed text-[#6e6e73]"
          style={{ fontSize: 'var(--text-body)' }}
        >
          {practiceData.subtitle}
        </p>
      </header>

      {/* Questions List */}
      <div className="mt-12 space-y-12 divide-y divide-black/[0.06]">
        {practiceData.questions.map((q, idx) => {
          const selected = selectedOptions[q.id];
          const isRevealed = showResults[q.id];
          const isCorrect = selected === q.correct_index;

          return (
            <div key={q.id} className="pt-10 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="font-mono font-medium text-[#8e8e93]"
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  Question 0{idx + 1} ({q.category})
                </span>
              </div>

              <h3
                className="mt-3 font-semibold leading-[1.25] tracking-[-0.015em] text-[#1d1d1f]"
                style={{ fontSize: 'var(--text-subheader)' }}
              >
                {q.question}
              </h3>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-black/[0.03] text-[#1d1d1f] border-transparent hover:bg-black/[0.06]';
                  if (isRevealed) {
                    if (optIdx === q.correct_index) {
                      btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium';
                    } else if (selected === optIdx) {
                      btnStyle = 'bg-red-50 text-red-900 border-red-300 font-medium';
                    } else {
                      btnStyle = 'opacity-50 bg-black/[0.02] text-gray-500 border-transparent';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !isRevealed && handleSelectOption(q.id, optIdx)}
                      disabled={isRevealed}
                      className={`w-full text-left rounded-xl p-4 border transition-all flex items-start gap-3 ${btnStyle}`}
                      style={{ fontSize: 'var(--text-body)' }}
                    >
                      <span className="font-mono text-xs mt-0.5 opacity-60">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback / Explanation */}
              {isRevealed && (
                <div
                  className={`mt-6 rounded-xl p-5 border ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-red-50/60 border-red-200 text-red-950'
                  }`}
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-[#92140c]" />
                        <span>Incorrect. The correct answer is option {String.fromCharCode(65 + q.correct_index)}.</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 leading-relaxed opacity-90">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PracticeSection;