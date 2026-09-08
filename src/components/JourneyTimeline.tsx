import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export interface JourneyStep {
  num: number;
  title: string;
  desc: string;
}

interface JourneyTimelineProps {
  journeyTitle: string;
  steps: JourneyStep[];
  onFindPeople: () => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ journeyTitle, steps, onFindPeople }) => {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <h3 className="font-bold text-sm text-slate-900 mb-5">
        Your journey: {journeyTitle}
      </h3>

      {/* Timeline */}
      <div className="flex items-start justify-between mb-6">
        {steps.map((step, idx) => {
          const isLast = step.num === steps.length;
          const isSecondLast = step.num === steps.length - 1;
          return (
            <React.Fragment key={step.num}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center text-center shrink-0" style={{ width: '64px' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: isLast ? '#34D399' : '#4F46E5' }}
                >
                  {isLast ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span
                  className="text-[11px] font-bold mt-1.5 leading-tight"
                  style={{ color: isLast ? '#059669' : '#374151' }}
                >
                  {step.title}
                </span>
                <span className="text-[9px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                  {step.desc}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 flex items-start pt-4">
                  <div
                    className="h-px w-full"
                    style={{
                      backgroundColor: isSecondLast ? '#34D399' : '#E5E7EB',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action button */}
      <button
        onClick={onFindPeople}
        className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all hover:opacity-90 shadow-sm"
        style={{ backgroundColor: '#4F46E5' }}
      >
        <Sparkles className="w-4 h-4" />
        <span>Find the right people</span>
      </button>
    </div>
  );
};
