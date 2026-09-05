import React, { useState } from 'react';
import { StudentProfile, SkillItem, NavTab, ReadinessScoreData } from '../types';
import { AppDatabaseEngine } from '../data/dbEngine';
import { DailyAptitudeEngine } from '../data/dailyAptitudeEngine';
import { DailyAptitudeModal } from './DailyAptitudeModal';
import { InstallPWA } from './InstallPWA';

interface DashboardViewProps {
  profile: StudentProfile;
  skills: SkillItem[];
  readinessData?: ReadinessScoreData;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  skills,
  readinessData,
  onNavigate,
}) => {
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const todayStr = DailyAptitudeEngine.getTodayDateString();
  const dailyProgress = DailyAptitudeEngine.getProgress();
  const isDailyDone = DailyAptitudeEngine.isTodayCompleted();
  const todayRecord = dailyProgress.completedHistory[todayStr];

  // Profile completion calculation
  const profileFields = [profile.name, profile.email, profile.college, profile.branch, profile.targetRole];
  const filledFieldsCount = profileFields.filter((f) => f && f.trim() !== '').length;
  const profileCompletion = Math.min(100, Math.round((filledFieldsCount / profileFields.length) * 100));
  const profileDashOffset = 251.2 - (251.2 * profileCompletion) / 100;

  // Readiness Score
  const score = readinessData?.hasBeenAssessed ? readinessData.overallScore : 0;
  const statusLabel = readinessData?.hasBeenAssessed ? readinessData.statusLabel : 'Not Assessed';
  const strokeOffset = 251.2 - (251.2 * score) / 100;

  // Skill Match Calculation
  const assessedSkills = skills.filter((s) => s.level > 0);
  const skillMatchScore =
    skills.length > 0 && assessedSkills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
      : 0;
  const skillMatchLabel = assessedSkills.length > 0 ? 'Based on target benchmarks' : 'Not assessed yet';

  // Aptitude Score Calculation
  const assessmentLogs = AppDatabaseEngine.getAssessmentLogs();
  const aptitudeScore =
    assessmentLogs.length > 0
      ? Math.round(assessmentLogs.reduce((acc, log) => acc + (log.percentage || log.score), 0) / assessmentLogs.length)
      : 0;
  const aptitudeLabel = assessmentLogs.length > 0 ? `${assessmentLogs.length} test(s) completed` : 'No tests taken yet';

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16">
      {/* Welcome Banner */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
          Welcome, {profile.name}!
        </h1>
        <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-1">
          Here is your academic and skill readiness overview for today.
        </p>
      </div>

      {/* Daily Placement Aptitude Challenge Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary-container/20 to-surface-container-lowest border border-primary/30 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">electric_bolt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-title-md text-base font-bold text-on-surface">
                Daily Placement Aptitude Challenge
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-label-sm text-[10px] font-bold rounded-full flex items-center gap-1 border border-amber-500/30">
                🔥 {dailyProgress.currentStreak} Day Streak
              </span>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              {isDailyDone
                ? `Completed for today! You scored ${todayRecord?.score}/5 (${todayRecord?.percentage}%).`
                : `5 fresh campus drive questions for ${todayStr} (TCS NPT, Infosys, Accenture, Wipro).`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDailyModal(true)}
          className={`px-5 py-2.5 rounded-xl font-title-md text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-xs cursor-pointer ${
            isDailyDone
              ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant'
              : 'bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isDailyDone ? 'visibility' : 'play_arrow'}
          </span>
          {isDailyDone ? "Review Today's Quiz" : "Start Today's Challenge (5 Qs)"}
        </button>
      </div>

      {/* PWA Mobile Download App Card */}
      <InstallPWA variant="dashboard" />

      {/* Daily Challenge Modal */}
      {showDailyModal && (
        <DailyAptitudeModal
          onClose={() => setShowDailyModal(false)}
        />
      )}

      {/* Bento Grid - Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div
          onClick={() => onNavigate('profile')}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between"
        >
          <h3 className="font-title-md text-base font-bold text-on-surface w-full text-left">
            Profile Completion
          </h3>
          <div className="relative w-28 h-28 my-2 flex items-center justify-center">
            <svg className="w-full h-full circular-progress" viewBox="0 0 100 100">
              <circle
                className="text-surface-container stroke-current"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                strokeWidth="8"
              />
              <circle
                className="text-primary stroke-current"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                strokeDasharray="251.2"
                strokeDashoffset={profileDashOffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <span className="absolute font-headline-lg text-xl font-bold text-on-surface">
              {profileCompletion}%
            </span>
          </div>
        </div>

        {/* Placement Readiness */}
        <div
          onClick={() => onNavigate('readiness-score')}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between"
        >
          <div className="flex justify-between items-center w-full">
            <h3 className="font-title-md text-base font-bold text-on-surface">
              Readiness Score
            </h3>
            <span className="material-symbols-outlined text-outline text-lg" title="View & Reset Score">
              trending_up
            </span>
          </div>
          <div className="relative w-28 h-28 my-1 flex items-center justify-center">
            <svg className="w-full h-full circular-progress" viewBox="0 0 100 100">
              <circle
                className="text-surface-container stroke-current"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                strokeWidth="10"
              />
              <circle
                className={`${score === 0 ? 'text-outline-variant' : score < 60 ? 'text-error' : score < 80 ? 'text-amber-500' : 'text-secondary'} stroke-current`}
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                strokeDasharray="251.2"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline-lg text-xl font-bold text-on-surface">
                {score}
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant">
                / 100
              </span>
            </div>
          </div>
          <span className={`font-label-sm text-xs px-3 py-1 rounded-full font-semibold ${
            score === 0
              ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
              : score < 60
              ? 'bg-error-container/30 text-error'
              : score < 80
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
              : 'bg-secondary-container text-on-secondary-container'
          }`}>
            {statusLabel}
          </span>
        </div>

        {/* Skill Match */}
        <div
          onClick={() => onNavigate('skill-gap')}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-title-md text-base font-bold text-on-surface">Skill Match</h3>
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-on-surface">{skillMatchScore}%</div>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              {skillMatchLabel}
            </p>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${skillMatchScore}%` }} />
          </div>
        </div>

        {/* Aptitude Score */}
        <div
          onClick={() => onNavigate('aptitude-test')}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-title-md text-base font-bold text-on-surface">Aptitude Score</h3>
            <span className="material-symbols-outlined text-primary text-xl">quiz</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold text-on-surface">{aptitudeScore}%</div>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{aptitudeLabel}</p>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${aptitudeScore}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col gap-6">
        {/* Skill Proficiency Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-title-md text-lg font-bold text-on-surface">
              Skill Proficiency Breakdown
            </h3>
            <button
              onClick={() => onNavigate('skills')}
              className="text-primary hover:underline font-label-md text-xs font-semibold"
            >
              View All Skills
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {skills.slice(0, 4).map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between font-label-md text-xs mb-1.5">
                  <span className="font-semibold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">
                      check_circle
                    </span>
                    {skill.name}
                  </span>
                  <span className="text-on-surface-variant font-medium">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      skill.level >= 75
                        ? 'bg-secondary'
                        : skill.level >= 50
                        ? 'bg-primary'
                        : 'bg-tertiary-fixed-dim'
                    }`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Aptitude Tests Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-primary mb-1">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                <span className="font-label-sm text-xs font-bold uppercase tracking-wider">AI Powered</span>
              </div>
              <h3 className="font-title-md text-base font-bold text-on-surface">
                ATS Resume Analyzer
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Upload your resume to check ATS keyword match and fix skill gaps for campus drives.
              </p>
            </div>
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="w-full py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">badge</span>
              Scan Resume
            </button>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-secondary mb-1">
                <span className="material-symbols-outlined text-xl">quiz</span>
                <span className="font-label-sm text-xs font-bold uppercase tracking-wider">Assessment</span>
              </div>
              <h3 className="font-title-md text-base font-bold text-on-surface">
                Aptitude Assessment
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Practice timed quizzes across Quantitative, Logical Reasoning, and Verbal ability.
              </p>
            </div>
            <button
              onClick={() => onNavigate('aptitude-test')}
              className="w-full py-2 bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-title-md text-xs font-semibold hover:bg-surface-container-highest transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              Take Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
