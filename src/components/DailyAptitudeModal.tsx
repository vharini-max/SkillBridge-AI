import React, { useState, useEffect } from 'react';
import { DailyChallengeQuestion, DailyChallengeSet, DailyChallengeProgress } from '../types';
import { DailyAptitudeEngine, DAILY_APTITUDE_POOL } from '../data/dailyAptitudeEngine';
import { AppDatabaseEngine } from '../data/dbEngine';

interface DailyAptitudeModalProps {
  onClose: () => void;
  onCompleted?: (score: number, total: number) => void;
}

export const DailyAptitudeModal: React.FC<DailyAptitudeModalProps> = ({ onClose, onCompleted }) => {
  const todayStr = DailyAptitudeEngine.getTodayDateString();
  const [challengeSet, setChallengeSet] = useState<DailyChallengeSet>(() =>
    DailyAptitudeEngine.getDailyChallengeSet(todayStr)
  );
  const [progress, setProgress] = useState<DailyChallengeProgress>(() =>
    DailyAptitudeEngine.getProgress()
  );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isExtraMode, setIsExtraMode] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isAlreadyDone = DailyAptitudeEngine.isTodayCompleted();
  const todayRecord = progress.completedHistory[todayStr];

  const questions = challengeSet.questions || [];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userSelected, setUserSelected] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(todayRecord ? todayRecord.score : 0);

  // Timer in seconds (5 minutes total)
  const [secondsLeft, setSecondsLeft] = useState<number>(challengeSet.timeLimitMins * 60);

  useEffect(() => {
    if (isFinished || (isAlreadyDone && !isExtraMode)) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, isAlreadyDone, isExtraMode]);

  const currentQ = questions[currentIdx] || questions[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isFinished) return;
    setUserSelected((prev) => ({ ...prev, [currentQ.id]: opt }));
    setRevealedExplanations((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleGenerateAiSet = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/daily-aptitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Placement Aptitude (TCS/Infosys)', targetRole: 'Campus Hiring' }),
      });
      const data = await res.json();
      let loadedQuestions: DailyChallengeQuestion[] = [];

      if (data && data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        loadedQuestions = data.questions.map((q: any, i: number) => ({
          ...q,
          id: Date.now() + i,
        }));
      } else {
        // Fallback generator from local aptitude pool
        const poolCopy = [...DAILY_APTITUDE_POOL].sort(() => 0.5 - Math.random());
        loadedQuestions = poolCopy.slice(0, 5).map((q, idx) => ({
          ...q,
          id: Date.now() + idx,
        }));
      }

      setChallengeSet({
        date: todayStr,
        title: `AI Extra Practice Set (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        targetCompanies: ['TCS NPT', 'Infosys', 'Amazon', 'Accenture'],
        totalQuestions: loadedQuestions.length,
        timeLimitMins: 5,
        questions: loadedQuestions,
      });

      setCurrentIdx(0);
      setUserSelected({});
      setRevealedExplanations({});
      setIsFinished(false);
      setIsExtraMode(true);
      setSecondsLeft(300);
      triggerToast('✨ Generated 5 Fresh Placement Questions!');
    } catch (err) {
      console.error('Failed to generate AI set', err);
      // Generate fallback set on network error
      const poolCopy = [...DAILY_APTITUDE_POOL].sort(() => 0.5 - Math.random());
      const loadedQuestions = poolCopy.slice(0, 5).map((q, idx) => ({
        ...q,
        id: Date.now() + idx,
      }));

      setChallengeSet({
        date: todayStr,
        title: `Extra Practice Set (${todayStr})`,
        targetCompanies: ['TCS NPT', 'Infosys', 'Amazon', 'Accenture'],
        totalQuestions: loadedQuestions.length,
        timeLimitMins: 5,
        questions: loadedQuestions,
      });

      setCurrentIdx(0);
      setUserSelected({});
      setRevealedExplanations({});
      setIsFinished(false);
      setIsExtraMode(true);
      setSecondsLeft(300);
      triggerToast('✨ Fresh Extra Practice Set Ready!');
    } finally {
      setIsAiLoading(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userSelected[q.id] === q.correctOption) {
        score += 1;
      }
    });
    return score;
  };

  const handleFinish = () => {
    const score = calculateScore();
    setFinalScore(score);
    setIsFinished(true);

    // Update streak and database progress
    const updatedProgress = DailyAptitudeEngine.saveCompletion(score, questions.length);
    setProgress(updatedProgress);

    // Save assessment log in DB engine to dynamically update Aptitude score
    const percentage = Math.round((score / questions.length) * 100);
    AppDatabaseEngine.logAssessmentRecord({
      id: 'log_daily_' + Date.now(),
      skillName: 'Daily Placement Aptitude Challenge',
      category: 'Aptitude Prep',
      score: percentage,
      percentage: percentage,
      status: percentage >= 70 ? 'Match' : percentage >= 40 ? 'Improve' : 'Weak',
      completedAt: new Date().toLocaleDateString(),
      correctAnswers: score,
      totalQuestions: questions.length,
    });

    if (onCompleted) {
      onCompleted(score, questions.length);
    }
  };

  const handleAutoFinish = () => {
    handleFinish();
  };

  const answeredCount = Object.keys(userSelected).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-title-md text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">electric_bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-md text-base font-bold text-on-surface">
                  {isExtraMode ? 'Extra Placement Practice Set' : 'Daily Placement Aptitude Challenge'}
                </h2>
                <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] font-bold rounded-full flex items-center gap-1">
                  {isExtraMode ? '✨ Extra Practice' : `🔥 ${progress.currentStreak} Day Streak`}
                </span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant">
                {isExtraMode ? 'AI-generated extra practice set' : `5 Fresh Questions Every Day • ${todayStr}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && (!isAlreadyDone || isExtraMode) && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container/40 text-error font-mono text-xs font-bold rounded-xl border border-error/20">
                <span className="material-symbols-outlined text-sm">timer</span>
                <span>{formatTime(secondsLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {isAlreadyDone && !isFinished && !isExtraMode ? (
            /* Already Completed State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-title-md text-xl font-bold text-on-surface">
                  Today's Challenge Completed!
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
                  You scored <span className="font-bold text-primary">{todayRecord?.score} / {todayRecord?.total}</span> ({todayRecord?.percentage}%) today. Your daily placement streak is active at <strong className="text-amber-600">🔥 {progress.currentStreak} days</strong>!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setIsFinished(true)}
                  className="px-5 py-2.5 bg-surface-container-high text-on-surface font-title-md text-xs font-semibold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleGenerateAiSet}
                  disabled={isAiLoading}
                  className="px-5 py-2.5 bg-primary text-on-primary font-title-md text-xs font-semibold rounded-xl hover:bg-primary-fixed-dim transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  {isAiLoading ? 'Generating AI Set...' : 'Generate Extra Practice Set'}
                </button>
              </div>
            </div>
          ) : isFinished ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
              </div>

              <div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                  {isExtraMode ? 'Extra Practice Finished!' : 'Daily Challenge Finished!'}
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  You answered <strong className="text-primary">{finalScore} out of {questions.length}</strong> correctly ({Math.round((finalScore / questions.length) * 100)}%).
                </p>
              </div>

              {/* Streak Banner */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center gap-3">
                <span className="text-2xl">🔥</span>
                <div className="text-left">
                  <div className="font-title-md text-sm font-bold text-amber-700 dark:text-amber-300">
                    Streak Maintained: {progress.currentStreak} Days!
                  </div>
                  <div className="font-body-md text-xs text-on-surface-variant">
                    Keep practicing daily to build campus interview speed and confidence.
                  </div>
                </div>
              </div>

              {/* Solutions Review List */}
              <div className="text-left space-y-4 pt-2">
                <h4 className="font-title-md text-sm font-bold text-on-surface">
                  Questions & Detailed Explanations
                </h4>
                {questions.map((q, idx) => {
                  const userAns = userSelected[q.id];
                  const isCorrect = userAns === q.correctOption;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : userAns
                          ? 'bg-error-container/30 border-error/20'
                          : 'bg-surface-container-low border-outline-variant'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-on-surface">
                          Q{idx + 1}. {q.questionText}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : userAns
                              ? 'bg-error text-on-error'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          {isCorrect ? 'Correct ✓' : userAns ? 'Incorrect ✗' : 'Skipped'}
                        </span>
                      </div>

                      <div className="text-on-surface-variant space-y-1 pt-1">
                        <div>
                          Your Answer: <strong className="text-on-surface">{userAns || 'None'}</strong> | Correct Answer: <strong className="text-emerald-600">{q.correctOption}</strong>
                        </div>
                        {q.explanation && (
                          <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant text-[11px] text-on-surface-variant">
                            <strong className="text-primary block mb-0.5">Explanation:</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleGenerateAiSet}
                  disabled={isAiLoading}
                  className="w-full sm:flex-1 py-3 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  {isAiLoading ? 'Generating AI Set...' : 'Generate Extra Practice Set'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-5">
              {/* Question Navigation Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-title-md text-xs font-bold text-primary px-2.5 py-1 bg-primary-container rounded-lg">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="font-label-sm text-[10px] uppercase font-bold text-outline px-2 py-0.5 bg-surface-container-high rounded">
                    {currentQ.categoryName}
                  </span>
                  {currentQ.companyTag && (
                    <span className="font-label-sm text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 px-2 py-0.5 bg-amber-500/15 rounded">
                      {currentQ.companyTag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition-all ${
                        i === currentIdx
                          ? 'bg-primary text-on-primary'
                          : userSelected[questions[i].id]
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <h3 className="font-title-md text-sm md:text-base font-bold text-on-surface leading-relaxed">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = userSelected[currentQ.id] === opt.id;
                  const isCorrectOpt = opt.id === currentQ.correctOption;
                  const showFeedback = isSelected || revealedExplanations[currentQ.id];

                  let optionStyle = 'bg-surface-container-lowest border-outline-variant hover:border-primary/60';
                  if (showFeedback) {
                    if (isCorrectOpt) {
                      optionStyle = 'bg-emerald-500/10 border-emerald-500 font-bold text-emerald-700 dark:text-emerald-300';
                    } else if (isSelected) {
                      optionStyle = 'bg-error-container/40 border-error font-bold text-error';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-primary-container/30 border-primary font-bold text-primary';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-surface-container-high font-bold flex items-center justify-center text-[11px] shrink-0">
                        {opt.id}
                      </span>
                      <span className="flex-1 font-body-md">{opt.text}</span>
                      {showFeedback && isCorrectOpt && (
                        <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                      )}
                      {showFeedback && isSelected && !isCorrectOpt && (
                        <span className="material-symbols-outlined text-error text-lg">cancel</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {revealedExplanations[currentQ.id] && currentQ.explanation && (
                <div className="p-4 bg-primary-container/20 border border-primary/20 rounded-xl space-y-1 animate-in fade-in duration-200">
                  <div className="font-title-md text-xs font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">lightbulb</span>
                    Explanation & Solution Shortcut
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <button
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    currentIdx === 0
                      ? 'text-outline cursor-not-allowed opacity-50'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  ← Previous
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 bg-primary text-on-primary font-title-md text-xs font-semibold rounded-xl hover:bg-primary-fixed-dim transition-colors"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-6 py-2 bg-emerald-600 text-white font-title-md text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Finish & Submit Challenge
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
