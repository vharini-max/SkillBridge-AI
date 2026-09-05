import React, { useState } from 'react';
import { NavTab, ReadinessScoreData } from '../types';
import { UNASSESSED_READINESS_SCORE } from '../data/mockData';
import { ReadinessCategoryModals, ReadinessModalType } from './ReadinessCategoryModals';

interface ReadinessScoreViewProps {
  readinessData?: ReadinessScoreData;
  onNavigate: (tab: NavTab) => void;
  onResetScore?: () => void;
  onLoadSampleBenchmark?: () => void;
  onUpdateReadinessData?: (updated: ReadinessScoreData) => void;
}

export const ReadinessScoreView: React.FC<ReadinessScoreViewProps> = ({
  readinessData = UNASSESSED_READINESS_SCORE,
  onNavigate,
  onResetScore,
  onLoadSampleBenchmark,
  onUpdateReadinessData,
}) => {
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [activeCategoryModal, setActiveCategoryModal] = useState<ReadinessModalType>(null);

  const { overallScore, hasBeenAssessed, statusLabel, feedback, categories } = readinessData;

  // Determine stroke color and badge styles based on score
  const getScoreColor = (score: number) => {
    if (!hasBeenAssessed || score === 0) return 'stroke-outline-variant text-outline';
    if (score < 60) return 'stroke-error text-error';
    if (score < 80) return 'stroke-amber-500 text-amber-600 dark:text-amber-400';
    return 'stroke-secondary text-secondary';
  };

  const getBadgeStyle = (score: number) => {
    if (!hasBeenAssessed || score === 0) {
      return 'bg-surface-container-high text-on-surface-variant border border-outline-variant';
    }
    if (score < 60) {
      return 'bg-error-container/30 text-error border border-error/30';
    }
    if (score < 80) {
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30';
    }
    return 'bg-secondary-container text-on-secondary-container border border-secondary/30';
  };

  const getCategoryBarColor = (earned: number, max: number) => {
    const pct = max > 0 ? (earned / max) * 100 : 0;
    if (earned === 0) return 'bg-outline-variant';
    if (pct < 60) return 'bg-error';
    if (pct < 80) return 'bg-amber-500';
    return 'bg-secondary';
  };

  const handleConfirmReset = () => {
    if (onResetScore) {
      onResetScore();
    }
    setShowResetConfirmModal(false);
  };

  const categoryList = Object.values(categories);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/50">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Placement Readiness Score
          </h1>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant">
            A comprehensive evaluation of your employability factors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="px-4 py-2 bg-surface-container-high border border-outline-variant hover:bg-error/10 hover:text-error hover:border-error/40 text-on-surface font-label-md text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Reset readiness score to 0 / Unassessed"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reset Score
          </button>

          {onLoadSampleBenchmark && (
            <button
              onClick={onLoadSampleBenchmark}
              className="px-4 py-2 bg-surface-container-high border border-outline-variant hover:bg-primary/10 hover:text-primary hover:border-primary/40 text-on-surface font-label-md text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Load benchmark sample evaluation"
            >
              <span className="material-symbols-outlined text-sm">analytics</span>
              Load Benchmark Sample
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Section: Overall Readiness & Actionable Feedback */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
            {/* Background Decorative Blur */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

            <h2 className="font-title-md text-lg text-on-surface font-semibold mb-6 z-10">
              Overall Readiness
            </h2>

            <div className="relative w-56 h-56 flex items-center justify-center z-10 mb-6">
              <svg className="circular-chart w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#e2e8f0"
                  strokeWidth="3.2"
                  fill="none"
                />
                <path
                  className={`circle ${getScoreColor(overallScore)}`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-lg text-4xl md:text-5xl text-on-surface font-bold leading-none">
                  {hasBeenAssessed ? overallScore : 0}
                </span>
                <span className="font-label-md text-xs text-outline font-medium mt-1">
                  / 100
                </span>
              </div>
            </div>

            <div className={`px-5 py-2 rounded-full z-10 ${getBadgeStyle(overallScore)}`}>
              <span className="font-title-md text-sm md:text-base font-semibold">
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Actionable Feedback */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xs border-l-4 border-l-primary z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-primary-container rounded-lg shrink-0 text-on-primary-container">
                <span className="material-symbols-outlined text-primary text-xl">
                  tips_and_updates
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-base font-semibold text-on-surface mb-1">
                  Actionable Feedback
                </h3>
                <p className="font-body-md text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  {feedback}{' '}
                  <span className="inline-flex gap-2 mt-2 w-full flex-wrap">
                    <button
                      onClick={() => onNavigate('aptitude-test')}
                      className="text-primary font-semibold hover:underline cursor-pointer text-xs"
                    >
                      → Take Aptitude Test
                    </button>
                    <button
                      onClick={() => onNavigate('resume-analyzer')}
                      className="text-primary font-semibold hover:underline cursor-pointer text-xs"
                    >
                      → Analyze Resume
                    </button>
                    <button
                      onClick={() => onNavigate('skill-gap')}
                      className="text-primary font-semibold hover:underline cursor-pointer text-xs"
                    >
                      → Check Skill Gap
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Score Breakdown */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 pb-4 border-b border-surface-variant gap-2">
              <div>
                <h2 className="font-title-md text-lg text-on-surface font-semibold">
                  Score Breakdown
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Points earned through completed activities
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex gap-3 font-label-sm text-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Ready (80-100)
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Impr. (60-79)
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" /> Not Ready (&lt;60)
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {categoryList.map((cat, idx) => {
                const pct = cat.max > 0 ? (cat.earned / cat.max) * 100 : 0;
                const labelLower = cat.label.toLowerCase();
                
                let actionBtn = null;
                if (labelLower.includes('communication')) {
                  actionBtn = {
                    label: '+ Assess Articulation',
                    onClick: () => setActiveCategoryModal('communication'),
                    style: 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20',
                  };
                } else if (labelLower.includes('project')) {
                  actionBtn = {
                    label: '+ Verify Projects',
                    onClick: () => setActiveCategoryModal('projects'),
                    style: 'bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20',
                  };
                } else if (labelLower.includes('certif')) {
                  actionBtn = {
                    label: '+ Add Certifications',
                    onClick: () => setActiveCategoryModal('certifications'),
                    style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
                  };
                } else if (labelLower.includes('internship')) {
                  actionBtn = {
                    label: '+ Add Experience',
                    onClick: () => setActiveCategoryModal('internship'),
                    style: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20',
                  };
                } else if (labelLower.includes('academic')) {
                  actionBtn = {
                    label: '+ Sync CGPA',
                    onClick: () => setActiveCategoryModal('academics'),
                    style: 'bg-surface-container-high text-on-surface border-outline-variant hover:bg-surface-container-highest',
                  };
                } else if (labelLower.includes('technical')) {
                  actionBtn = {
                    label: 'Audit Skills →',
                    onClick: () => onNavigate('skill-gap'),
                    style: 'bg-surface-container-high text-primary border-outline-variant hover:bg-primary/10',
                  };
                } else if (labelLower.includes('aptitude')) {
                  actionBtn = {
                    label: 'Take Test →',
                    onClick: () => onNavigate('aptitude-test'),
                    style: 'bg-surface-container-high text-primary border-outline-variant hover:bg-primary/10',
                  };
                }

                return (
                  <div key={idx} className="p-3.5 bg-surface-container-low/60 hover:bg-surface-container-low border border-outline-variant/50 rounded-xl transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          {cat.icon}
                        </span>
                        <span className="font-title-md text-sm text-on-surface font-semibold">
                          {cat.label}
                        </span>
                        <span className="font-label-sm text-xs text-outline font-normal">
                          ({cat.weightLabel})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {actionBtn && (
                          <button
                            onClick={actionBtn.onClick}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-2xs flex items-center gap-1 ${actionBtn.style}`}
                          >
                            {actionBtn.label}
                          </button>
                        )}
                        <span className="font-title-md text-sm font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant/60">
                          {cat.earned} / {cat.max}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getCategoryBarColor(
                          cat.earned,
                          cat.max
                        )}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-5 py-2.5 bg-surface-container border border-outline-variant hover:bg-error/10 hover:text-error text-on-surface-variant font-label-md text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Reset Score
            </button>
            <button
              onClick={() => setShowDetailedModal(true)}
              className="bg-primary text-on-primary font-label-md text-sm px-6 py-2.5 rounded-lg hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors flex items-center justify-center gap-2 font-semibold shadow-2xs cursor-pointer"
            >
              View Detailed Report
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-error mb-3">
              <span className="material-symbols-outlined text-3xl">restart_alt</span>
              <h3 className="font-title-md text-lg font-bold text-on-surface">
                Reset Placement Readiness Score?
              </h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">
              This will reset your evaluation score back to <strong>0 / Unassessed</strong>. You can earn points anytime by attempting aptitude tests, running resume audits, and updating your technical skills.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 bg-surface-container border border-outline-variant rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-semibold hover:bg-error/90 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {showDetailedModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
              <div>
                <h3 className="font-title-md text-xl font-bold text-on-surface">
                  Detailed Readiness Evaluation Report
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Status: {statusLabel} ({overallScore}/100)
                </span>
              </div>
              <button
                onClick={() => setShowDetailedModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm text-on-surface-variant">
              <div className="p-3.5 bg-surface-container-low rounded-xl">
                <h4 className="font-bold text-on-surface mb-1">Evaluation Summary</h4>
                <p className="text-xs leading-relaxed">{feedback}</p>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl">
                <h4 className="font-bold text-on-surface mb-2">Category Breakdown Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {categoryList.map((c, i) => (
                    <div key={i} className="flex justify-between p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/60">
                      <span>{c.label}:</span>
                      <span className="font-bold text-on-surface">{c.earned} / {c.max}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-tertiary-fixed/30 rounded-xl">
                <h4 className="font-bold text-on-surface mb-1">Recommended Action Plan</h4>
                <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
                  <li>Complete practice tests under <strong>Aptitude Test</strong> module.</li>
                  <li>Scan your resume in <strong>Resume Analyzer</strong> to check ATS score.</li>
                  <li>Review missing skills under <strong>Skill Gap Analyzer</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowDetailedModal(false);
                  setShowResetConfirmModal(true);
                }}
                className="text-error text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Score to 0
              </button>
              <button
                onClick={() => setShowDetailedModal(false)}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs hover:bg-primary-fixed-dim hover:text-on-primary-fixed cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Category Modals for Communication, Projects, Certifications, Internships, Academics */}
      <ReadinessCategoryModals
        activeModal={activeCategoryModal}
        onClose={() => setActiveCategoryModal(null)}
        onUpdateReadinessScore={(updated) => {
          if (onUpdateReadinessData) onUpdateReadinessData(updated);
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
