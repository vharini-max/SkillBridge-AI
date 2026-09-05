import React, { useState } from 'react';
import { TestCategory } from '../types';
import { DailyAptitudeEngine } from '../data/dailyAptitudeEngine';
import { DailyAptitudeModal } from './DailyAptitudeModal';

interface AptitudeLandingViewProps {
  categories: TestCategory[];
  onStartTest: (category: TestCategory) => void;
}

export const AptitudeLandingView: React.FC<AptitudeLandingViewProps> = ({
  categories,
  onStartTest,
}) => {
  // State for explicit skill selection. Initially NO skill is selected.
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | null>(null);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);

  const todayStr = DailyAptitudeEngine.getTodayDateString();
  const dailyProgress = DailyAptitudeEngine.getProgress();
  const isDailyDone = DailyAptitudeEngine.isTodayCompleted();
  const todayRecord = dailyProgress.completedHistory[todayStr];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-2">
          Skill Assessment & Aptitude Prep
        </h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant">
          Complete daily challenges or select a specific skill category for practice.
        </p>
      </div>

      {/* Hero Card: Daily Aptitude Challenge */}
      <div className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-surface-container-lowest border border-amber-500/30 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-2xl">electric_bolt</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-title-md text-base font-bold text-on-surface">
                Daily Placement Aptitude Challenge
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-label-sm text-[11px] font-bold rounded-full flex items-center gap-1 border border-amber-500/30">
                🔥 {dailyProgress.currentStreak} Day Streak
              </span>
              <span className="px-2 py-0.5 bg-primary-container text-on-primary-container font-label-sm text-[10px] font-bold rounded">
                TCS • Infosys • Wipro • Accenture
              </span>
            </div>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant">
              {isDailyDone
                ? `Completed for ${todayStr}! Score: ${todayRecord?.score}/5 (${todayRecord?.percentage}%). Come back tomorrow or launch an extra AI practice set!`
                : `5 fresh questions generated daily for ${todayStr}. Build speed and accuracy for company placement drives.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDailyModal(true)}
          className={`px-6 py-3 rounded-xl font-title-md text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md ${
            isDailyDone
              ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant'
              : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isDailyDone ? 'visibility' : 'play_arrow'}
          </span>
          {isDailyDone ? "Review Today's Challenge" : "Take Today's Daily Challenge"}
        </button>
      </div>

      {/* Daily Challenge Modal */}
      {showDailyModal && (
        <DailyAptitudeModal onClose={() => setShowDailyModal(false)} />
      )}

      {/* Skill Selection Banner / Status Alert */}
      <div
        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          !selectedCategory
            ? 'bg-surface-container-low border-outline-variant text-on-surface-variant'
            : 'bg-primary-container/30 border-primary text-on-surface shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              !selectedCategory ? 'bg-surface-container-high text-outline' : 'bg-primary text-on-primary font-bold'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {!selectedCategory ? 'touch_app' : 'check_circle'}
            </span>
          </div>

          <div>
            <div className="font-title-md text-base font-bold text-on-surface">
              {!selectedCategory ? (
                <span className="text-error font-extrabold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">warning</span>
                  Please select a skill to start
                </span>
              ) : (
                <span className="text-primary font-extrabold">
                  Selected Skill: {selectedCategory.title}
                </span>
              )}
            </div>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              {!selectedCategory
                ? 'Click any skill card below to activate the assessment module.'
                : `${selectedCategory.questionsCount} questions | ${selectedCategory.durationMins} minutes timer`}
            </p>
          </div>
        </div>

        {/* Global Start Assessment Button - Disabled if no skill selected */}
        <button
          onClick={() => selectedCategory && onStartTest(selectedCategory)}
          disabled={!selectedCategory}
          className={`px-6 py-3 rounded-xl font-title-md text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
            !selectedCategory
              ? 'bg-surface-container-high text-outline cursor-not-allowed border border-outline-variant/60 opacity-60'
              : 'bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed shadow-md active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-lg">play_arrow</span>
          Start Assessment
        </button>
      </div>

      {/* Grid of Selectable Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory?.id === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-2xl border p-6 shadow-2xs transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-surface-container-lowest border-2 border-primary ring-2 ring-primary/20 shadow-md'
                  : 'bg-surface-container-lowest border-outline-variant hover:border-primary/60 hover:bg-surface-container-low'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[11px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check</span>
                  Selected
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary text-on-primary'
                          : 'bg-primary-container text-on-primary-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{cat.iconName}</span>
                    </div>
                    <div>
                      <h2 className="font-title-md text-lg font-bold text-on-surface">
                        {cat.title}
                      </h2>
                      {cat.tag && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold uppercase tracking-wider">
                          {cat.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                  {cat.description}
                </p>

                {/* Stats pill list */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-xl mb-6 text-center">
                  <div>
                    <div className="font-label-sm text-[10px] uppercase text-outline font-bold">
                      Questions
                    </div>
                    <div className="font-title-md text-sm font-bold text-on-surface mt-0.5">
                      {cat.questionsCount}
                    </div>
                  </div>
                  <div>
                    <div className="font-label-sm text-[10px] uppercase text-outline font-bold">
                      Duration
                    </div>
                    <div className="font-title-md text-sm font-bold text-on-surface mt-0.5">
                      {cat.durationMins} mins
                    </div>
                  </div>
                  <div>
                    <div className="font-label-sm text-[10px] uppercase text-outline font-bold">
                      High Score
                    </div>
                    <div className="font-title-md text-sm font-bold text-primary mt-0.5">
                      {cat.highestScore}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    onStartTest(cat);
                  }}
                  className={`w-full py-2.5 rounded-xl font-title-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed'
                      : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isSelected ? 'play_arrow' : 'touch_app'}
                  </span>
                  {isSelected ? 'Start Selected Assessment' : 'Select This Skill'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidelines Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs">
        <h3 className="font-title-md text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          Testing Guidelines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body-md text-xs text-on-surface-variant">
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
            <div className="font-semibold text-on-surface text-sm mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">timer</span>
              Timed Format
            </div>
            Timer starts as soon as you click 'Start Assessment'. Navigate questions freely via question palette.
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
            <div className="font-semibold text-on-surface text-sm mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">rate_review</span>
              Review & Flag
            </div>
            You can mark questions for review and clear selections anytime before submitting.
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
            <div className="font-semibold text-on-surface text-sm mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">analytics</span>
              Instant Evaluation
            </div>
            Get an instant score analysis, category breakdown, and growth recommendations on submission.
          </div>
        </div>
      </section>
    </div>
  );
};
