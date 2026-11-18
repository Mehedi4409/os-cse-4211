import React from 'react';
import { BookOpen } from 'lucide-react';

const TEXTBOOK_PROBLEMS = [
  {
    reference: 'Exercise 6.17',
    algorithm_type: 'Preemptive Round-Robin with Priorities',
    description:
      'The following processes are being scheduled using a preemptive, round-robin scheduling algorithm. Each process is assigned a numerical priority, with a higher number indicating a higher relative priority. In addition to the processes listed below, the system also has an idle task (which consumes no CPU resources and is identified as P_idle). This task has priority 0 and is scheduled whenever the system has no other available processes to run. The length of a time quantum is 10 units. If a process is preempted by a higher-priority process, the preempted process is placed at the end of the queue.',
    processes: [
      { thread: 'P1', priority: 40, burst: 20, arrival: 0 },
      { thread: 'P2', priority: 30, burst: 25, arrival: 25 },
      { thread: 'P3', priority: 30, burst: 25, arrival: 30 },
      { thread: 'P4', priority: 35, burst: 15, arrival: 60 },
      { thread: 'P5', priority: 5, burst: 10, arrival: 100 },
      { thread: 'P6', priority: 10, burst: 10, arrival: 105 },
    ],
    questions: [
      'a. Show the scheduling order of the processes using a Gantt chart.',
      'b. What is the turnaround time for each process?',
      'c. What is the waiting time for each process?',
      'd. What is the CPU utilization rate?',
    ],
  },
  {
    reference: 'Exercise 6.18',
    algorithm_type: 'Preemptive, Priority-based, Round-Robin',
    description:
      'The following processes are being scheduled using a preemptive, priority-based, round-robin scheduling algorithm. Each process is assigned a numerical priority, with a higher number indicating a higher relative priority. The scheduler will execute the highest-priority process. For processes with the same priority, a round-robin scheduler will be used with a time quantum of 10 units. If a process is preempted by a higher-priority process, the preempted process is placed at the end of the queue.',
    processes: [
      { thread: 'P1', priority: 8, burst: 15, arrival: 0 },
      { thread: 'P2', priority: 3, burst: 20, arrival: 0 },
      { thread: 'P3', priority: 4, burst: 20, arrival: 20 },
      { thread: 'P4', priority: 4, burst: 20, arrival: 25 },
      { thread: 'P5', priority: 5, burst: 5, arrival: 45 },
      { thread: 'P6', priority: 5, burst: 15, arrival: 55 },
    ],
    questions: [
      'a. Show the scheduling order of the processes using a Gantt chart.',
      'b. What is the turnaround time for each process?',
      'c. What is the waiting time for each process?',
    ],
  },
];

const TextbookProblemsSection = ({ sections = [] }) => {
  const problemSec = sections.find((s) => s.type === 'textbook_problems');
  const problems = problemSec?.problems?.length ? problemSec.problems : TEXTBOOK_PROBLEMS;

  return (
    <section
      className="mx-auto max-w-[760px] px-6 py-16 text-[#1d1d1f]"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
      }}
    >
      <header>
        <div className="flex items-center gap-3">
          <BookOpen className="h-9 w-9 text-[#92140c]" strokeWidth={1.5} />
          <span
            className="rounded-full bg-[#92140c]/[0.06] px-3.5 py-1 font-medium text-[#92140c]"
            style={{ fontSize: 'var(--text-body)' }}
          >
            Practice
          </span>
        </div>
        <h2
          className="mt-4 font-semibold leading-[1.15] tracking-[-0.022em] text-[#1d1d1f]"
          style={{ fontSize: 'var(--text-header)' }}
        >
          Textbook Problems & Exercises
        </h2>
      </header>

      <div className="mt-12 space-y-10">
        {TEXTBOOK_PROBLEMS.map((prob, idx) => (
          <div key={idx} className="rounded-2xl border border-black/[0.08] bg-white p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-[#111d4a]" style={{ fontSize: 'var(--text-subheader)' }}>
                {prob.reference}
              </h3>
              <span className="font-mono text-xs text-[#92140c] bg-red-50 px-3 py-1 rounded-full font-medium">
                {prob.algorithm_type}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
              {prob.description}
            </p>

            {/* Process Data Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/[0.08] text-[#8e8e93]">
                    <th className="pb-2.5 font-medium">Process / Thread</th>
                    <th className="pb-2.5 font-medium">Priority</th>
                    <th className="pb-2.5 font-medium">Burst Time</th>
                    <th className="pb-2.5 font-medium">Arrival Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {prob.processes.map((p, pIdx) => (
                    <tr key={pIdx}>
                      <td className="py-3 font-semibold text-[#111d4a]">{p.thread}</td>
                      <td className="py-3 text-[#3a3a3c]">{p.priority}</td>
                      <td className="py-3 text-[#3a3a3c]">{p.burst}</td>
                      <td className="py-3 text-[#3a3a3c]">{p.arrival}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Questions List */}
            <div className="mt-6 border-t border-black/[0.06] pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8e8e93]">
                Questions to Solve
              </span>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-[#1d1d1f]">
                {prob.questions.map((q, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-2">
                    <span className="font-semibold text-[#92140c]">{q.charAt(0)}</span>
                    <span>{q.slice(3)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TextbookProblemsSection;