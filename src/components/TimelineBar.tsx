import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface TimelineStep {
  label: string;
  desc: string;
}

export interface TimelineData {
  steps: TimelineStep[];
}

interface TimelineBarProps {
  timelines: TimelineData[];
  selectedIndex: number;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({ timelines, selectedIndex }) => {
  const timeline = timelines[selectedIndex] || timelines[0];
  const total = timeline.steps.length;
  const paidIndex = total - 1; // last step is always "Get Paid"

  return (
    <div className="w-full">
      {/* Desktop: horizontal timeline */}
      <div className="hidden sm:flex items-start justify-between gap-1 px-2">
        {timeline.steps.map((step, i) => {
          const isPaid = i === paidIndex;
          return (
            <React.Fragment key={i}>
              {/* Step */}
              <div className="flex flex-col items-center text-center flex-1 min-w-0 max-w-[140px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isPaid
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isPaid ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <p className={`text-xs font-bold mt-2 ${isPaid ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
              </div>
              {/* Connector line */}
              {i < total - 1 && (
                <div className="flex items-center pt-4.5" style={{ paddingTop: '18px' }}>
                  <div className={`h-0.5 w-full rounded-full ${i < paidIndex - 1 ? 'bg-indigo-200' : 'bg-emerald-200'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="sm:hidden overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex items-start gap-3 min-w-max">
          {timeline.steps.map((step, i) => {
            const isPaid = i === paidIndex;
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center w-20 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isPaid
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isPaid ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <p className={`text-[11px] font-bold mt-1.5 ${isPaid ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {step.label}
                  </p>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
                </div>
                {i < total - 1 && (
                  <div className="flex items-center" style={{ paddingTop: '14px' }}>
                    <div className={`h-0.5 w-4 rounded-full ${i < paidIndex - 1 ? 'bg-indigo-200' : 'bg-emerald-200'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
