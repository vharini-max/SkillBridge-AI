import React from 'react';
import { NavTab, CategoryBreakdown } from '../types';

interface AptitudeResultsViewProps {
  scorePercentage?: number;
  breakdown?: CategoryBreakdown[];
  onNavigate: (tab: NavTab) => void;
  onRetakeTest: () => void;
}

export const AptitudeResultsView: React.FC<AptitudeResultsViewProps> = ({
  scorePercentage = 76,
  breakdown = [
    { category: 'Quantitative', score: 85 },
    { category: 'Logical Reasoning', score: 78 },
    { category: 'Verbal Ability', score: 55 },
    { category: 'Data Interpretation', score: 72 },
  ],
  onNavigate,
  onRetakeTest,
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Aptitude Test Results
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant">
            Detailed performance breakdown and feedback for your recent attempt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeTest}
            className="px-4 py-2 border border-primary text-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Retake Test
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Top Section: Overall Score & Category Breakdown Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Card */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs flex flex-col items-center justify-center text-center relative overflow-hidden">
          <h2 className="font-title-md text-base text-on-surface-variant font-semibold mb-4">
            Overall Test Score
          </h2>

          <div className="relative w-44 h-44 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-high"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${scorePercentage}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display-lg text-4xl font-bold text-on-surface">
                {scorePercentage}%
              </span>
              <span className="font-label-sm text-[11px] text-secondary font-bold bg-secondary-container/50 px-2 py-0.5 rounded-full mt-1">
                +4% Improvement
              </span>
            </div>
          </div>

          <p className="font-body-md text-xs text-on-surface-variant">
            Great job! You cleared the cut-off mark for 80% of partner companies.
          </p>
        </div>

        {/* Category Breakdown Card */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="font-title-md text-lg font-bold text-on-surface mb-4">
              Category Breakdown
            </h2>

            <div className="space-y-4">
              {breakdown.map((item, idx) => {
                let barColor = 'bg-secondary';
                let textColor = 'text-secondary';
                if (item.score < 60) {
                  barColor = 'bg-error';
                  textColor = 'text-error';
                } else if (item.score < 75) {
                  barColor = 'bg-tertiary-fixed-dim';
                  textColor = 'text-tertiary';
                }

                return (
                  <div key={idx}>
                    <div className="flex justify-between font-label-md text-xs mb-1.5">
                      <span className="font-semibold text-on-surface">{item.category}</span>
                      <span className={`font-bold ${textColor}`}>{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
            <span>Pass Threshold: 60% across all sections</span>
            <button
              onClick={() => onNavigate('skill-gap')}
              className="text-primary font-semibold hover:underline"
            >
              View Skill Gap Analysis &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Strengths, Weaknesses, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3 text-secondary font-bold text-base">
            <span className="material-symbols-outlined">thumb_up</span>
            Key Strengths
          </div>
          <ul className="space-y-2.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              <span>High speed and accuracy in Quantitative Aptitude.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              <span>Strong pattern recognition in Logical Reasoning.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              <span>Consistent time management across the test duration.</span>
            </li>
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3 text-error font-bold text-base">
            <span className="material-symbols-outlined">error</span>
            Weak Areas
          </div>
          <ul className="space-y-2.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-error text-base">cancel</span>
              <span>Lower accuracy in Verbal Ability reading comprehension.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-error text-base">cancel</span>
              <span>Vocabulary and antonym questions need revision.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-error text-base">cancel</span>
              <span>Slower pacing on complex Data Interpretation tables.</span>
            </li>
          </ul>
        </div>

        {/* Growth Recommendations */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3 text-primary font-bold text-base">
            <span className="material-symbols-outlined">lightbulb</span>
            Recommendations
          </div>
          <div className="space-y-2.5 text-xs text-on-surface-variant">
            <div className="p-2.5 bg-surface-container-low rounded-xl">
              <div className="font-bold text-on-surface">Daily Verbal Drill</div>
              <p className="mt-0.5">Practice 15 vocabulary and sentence completion drills daily.</p>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-xl">
              <div className="font-bold text-on-surface">DI Speed Practice</div>
              <p className="mt-0.5">Attempt timed Data Interpretation sets under 10 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
