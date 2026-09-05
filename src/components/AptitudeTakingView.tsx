import React, { useState, useEffect } from 'react';
import { Question, TestCategory, UserAnswerState } from '../types';

interface AptitudeTakingViewProps {
  category: TestCategory;
  questions: Question[];
  onSubmitTest: (userAnswers: Record<number, UserAnswerState>) => void;
  onCancelTest: () => void;
}

export const AptitudeTakingView: React.FC<AptitudeTakingViewProps> = ({
  category,
  questions = [],
  onSubmitTest,
  onCancelTest,
}) => {
  const safeQuestions = questions || [];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswerState>>(() => {
    const initial: Record<number, UserAnswerState> = {};
    safeQuestions.forEach((q) => {
      initial[q.id] = {
        questionId: q.id,
        isMarkedForReview: false,
        status: 'not-visited',
      };
    });
    // Mark first as unanswered/visited initially
    if (safeQuestions.length > 0 && safeQuestions[0]?.id) {
      initial[safeQuestions[0].id] = {
        questionId: safeQuestions[0].id,
        isMarkedForReview: false,
        status: 'unanswered',
      };
    }
    return initial;
  });

  // Timer countdown in seconds
  const [timeLeft, setTimeLeft] = useState<number>(category.durationMins * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitTest(userAnswers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [userAnswers, onSubmitTest]);

  const currentQuestion = questions[currentIdx] || questions[0];
  const currentAnswer = userAnswers[currentQuestion.id];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: optionId,
        status: prev[currentQuestion.id].isMarkedForReview ? 'review' : 'answered',
      },
    }));
  };

  const handleClearOption = () => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: undefined,
        status: prev[currentQuestion.id].isMarkedForReview ? 'review' : 'unanswered',
      },
    }));
  };

  const handleToggleReview = () => {
    setUserAnswers((prev) => {
      const isReviewNow = !prev[currentQuestion.id].isMarkedForReview;
      return {
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          isMarkedForReview: isReviewNow,
          status: isReviewNow
            ? 'review'
            : prev[currentQuestion.id].selectedOption
            ? 'answered'
            : 'unanswered',
        },
      };
    });
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIdx(index);
    const qId = questions[index].id;
    setUserAnswers((prev) => {
      if (prev[qId].status === 'not-visited') {
        return {
          ...prev,
          [qId]: { ...prev[qId], status: 'unanswered' },
        };
      }
      return prev;
    });
  };

  const handleSaveAndNext = () => {
    if (currentIdx < questions.length - 1) {
      handleJumpToQuestion(currentIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      handleJumpToQuestion(currentIdx - 1);
    }
  };

  // Count answered items
  const answeredCount = (Object.values(userAnswers) as UserAnswerState[]).filter(
    (a) => a.selectedOption
  ).length;
  const reviewCount = (Object.values(userAnswers) as UserAnswerState[]).filter(
    (a) => a.isMarkedForReview
  ).length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-surface text-on-surface">
      {/* Test Sticky Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-4 sticky top-16 z-20 shadow-2xs">
        <div>
          <h2 className="font-title-md text-base md:text-lg font-bold text-on-surface">
            {category.title}
          </h2>
          <p className="font-label-sm text-xs text-on-surface-variant">
            Question {currentIdx + 1} of {questions.length}
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-1.5 rounded-full border border-error/20 font-mono font-bold text-sm md:text-base">
          <span className="material-symbols-outlined text-lg animate-pulse">timer</span>
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelTest}
            className="px-3.5 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
          >
            Exit Test
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question Area (Span 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs">
          <div>
            {/* Question Header Badge */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-surface-container">
              <span className="font-title-md text-sm font-bold text-primary bg-primary-container/40 px-3 py-1 rounded-full">
                Question {currentIdx + 1}
              </span>

              {currentAnswer?.isMarkedForReview && (
                <span className="inline-flex items-center gap-1 font-label-sm text-xs text-tertiary bg-tertiary-fixed/40 px-2.5 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  Marked for Review
                </span>
              )}
            </div>

            {/* Question Text */}
            <h3 className="font-title-md text-base md:text-lg font-semibold text-on-surface leading-relaxed mb-6">
              {currentQuestion.questionText}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-3 mb-8">
              {currentQuestion.options.map((opt) => {
                const isSelected = currentAnswer?.selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-2 border-primary bg-primary-container/20 shadow-2xs'
                        : 'border-outline-variant hover:border-outline bg-surface-container-lowest'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <span className="font-body-md text-sm md:text-base text-on-surface font-medium">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-outline'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-on-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-outline-variant flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleToggleReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentAnswer?.isMarkedForReview
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-sm">flag</span>
                {currentAnswer?.isMarkedForReview ? 'Unmark Review' : 'Mark for Review'}
              </button>

              <button
                onClick={handleClearOption}
                disabled={!currentAnswer?.selectedOption}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface-container disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed shadow-2xs"
              >
                {currentIdx === questions.length - 1 ? 'Save' : 'Save & Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Palette Sidebar (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-2xs">
          <h3 className="font-title-md text-base font-bold text-on-surface pb-3 border-b border-surface-container">
            Question Palette
          </h3>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-2 font-label-sm text-xs py-1">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-secondary" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-tertiary-fixed-dim" />
              <span>Review ({reviewCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-surface-container-high border border-outline" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
              <span>Current</span>
            </div>
          </div>

          {/* Question Grid 1..30 */}
          <div className="grid grid-cols-5 gap-2.5 my-2 max-h-72 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isCurrent = idx === currentIdx;
              const isAnswered = !!ans?.selectedOption;
              const isReview = ans?.isMarkedForReview;

              let btnBg = 'bg-surface-container text-on-surface-variant';
              if (isReview) {
                btnBg = 'bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold';
              } else if (isAnswered) {
                btnBg = 'bg-secondary text-on-secondary font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${btnBg} ${
                    isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-2">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-title-md text-sm font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs"
            >
              Submit Final Test
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-title-md text-xl font-bold text-on-surface mb-2">
              Submit Test Confirmation
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-4">
              Are you sure you want to submit your test?
            </p>

            <div className="p-3 bg-surface-container-low rounded-xl mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-on-surface">
                <span>Total Questions:</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between text-secondary font-semibold">
                <span>Answered:</span>
                <span>{answeredCount}</span>
              </div>
              <div className="flex justify-between text-tertiary font-semibold">
                <span>Marked for Review:</span>
                <span>{reviewCount}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Unanswered:</span>
                <span>{questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-semibold text-xs hover:bg-surface-container"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitTest(userAnswers);
                }}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
