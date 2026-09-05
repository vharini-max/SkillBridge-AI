import React, { useState } from 'react';
import { SKILL_QUIZZES, SkillQuiz } from '../data/skillQuizQuestions';
import { AppDatabaseEngine, SkillAssessmentRecord } from '../data/dbEngine';
import { SkillItem } from '../types';

interface SkillAssessmentModalProps {
  skillName: string;
  category?: string;
  onComplete: (updatedSkills: SkillItem[], newRecord: SkillAssessmentRecord) => void;
  onClose: () => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  skillName,
  category = 'Technical',
  onComplete,
  onClose,
}) => {
  // Check if we have a pre-authored quiz or create a dynamic 3-question evaluation
  const key = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const quiz: SkillQuiz = SKILL_QUIZZES[key] || {
    skillId: key,
    skillName,
    category,
    title: `${skillName} Skill Verification Quiz`,
    description: `Evaluate your core knowledge and practical problem-solving in ${skillName}.`,
    questions: [
      {
        id: 1,
        question: `What is a fundamental best practice when building scalable applications in ${skillName}?`,
        options: [
          'Failing silently without error logging',
          'Writing modular, reusable, and thoroughly tested code',
          'Storing sensitive credentials in plain text',
          'Avoiding version control systems',
        ],
        correctOption: 1,
        explanation: 'Modular design, reusable functions, and test coverage ensure maintainability and scalability.',
      },
      {
        id: 2,
        question: `How do you measure efficiency and performance when working with ${skillName}?`,
        options: [
          'By counting the number of source code lines',
          'By analyzing time and space complexity (Big O notation) and profiling execution runtime',
          'By hardware CPU temperature only',
          'Efficiency cannot be measured',
        ],
        correctOption: 1,
        explanation: 'Big O notation and algorithmic profiling measure algorithmic efficiency regardless of hardware.',
      },
      {
        id: 3,
        question: `Which approach is recommended when handling errors or edge cases in ${skillName}?`,
        options: [
          'Ignoring exceptions and letting the process crash',
          'Implementing structured exception handling, validation, and graceful fallback paths',
          'Hardcoding test variables in production',
          'Restarting the entire database server on every request',
        ],
        correctOption: 1,
        explanation: 'Structured try-catch handling and boundary checks prevent unexpected application crashes.',
      },
      {
        id: 4,
        question: `What is the primary role of ${skillName} in enterprise software systems?`,
        options: [
          'Serving as a core component for functionality, data pipeline, or architecture',
          'Replacing operating system kernels',
          'Manual paper printing',
          'None of the above',
        ],
        correctOption: 0,
        explanation: `${skillName} provides crucial technical capabilities within full-stack engineering architectures.`,
      },
    ],
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [selfScore, setSelfScore] = useState<number>(75);

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOption) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
    setCalculatedScore(scorePct);
    setIsSubmitted(true);

    // Save to Database Engine
    const updatedSkills = AppDatabaseEngine.updateSkillScore(skillName, category, scorePct);

    let statusLabel: 'Match' | 'Weak' | 'Improve' | 'Missing' = 'Missing';
    if (scorePct >= 75) statusLabel = 'Match';
    else if (scorePct >= 55) statusLabel = 'Weak';
    else if (scorePct >= 40) statusLabel = 'Improve';

    const logRecord: SkillAssessmentRecord = {
      id: 'log_' + Date.now(),
      skillName,
      category,
      score: scorePct,
      percentage: scorePct,
      status: statusLabel,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
    };

    onComplete(updatedSkills, logRecord);
  };

  const handleManualSelfAssessment = () => {
    const updatedSkills = AppDatabaseEngine.updateSkillScore(skillName, category, selfScore);

    let statusLabel: 'Match' | 'Weak' | 'Improve' | 'Missing' = 'Missing';
    if (selfScore >= 75) statusLabel = 'Match';
    else if (selfScore >= 55) statusLabel = 'Weak';
    else if (selfScore >= 40) statusLabel = 'Improve';

    const logRecord: SkillAssessmentRecord = {
      id: 'log_' + Date.now(),
      skillName,
      category,
      score: selfScore,
      percentage: selfScore,
      status: statusLabel,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      correctAnswers: Math.round((selfScore / 100) * 4),
      totalQuestions: 4,
    };

    onComplete(updatedSkills, logRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div>
            <span className="px-2.5 py-0.5 bg-primary-container text-on-primary-container font-label-sm text-[11px] font-bold rounded-full mb-1 inline-block">
              Skill Database Assessment
            </span>
            <h2 className="font-title-md text-xl font-bold text-on-surface">{quiz.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isSubmitted ? (
            <>
              {/* Mode Toggle Bar */}
              <div className="flex bg-surface-container rounded-xl p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setManualMode(false)}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    !manualMode ? 'bg-surface text-primary shadow-xs font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Interactive Knowledge Quiz ({quiz.questions.length} Qs)
                </button>
                <button
                  type="button"
                  onClick={() => setManualMode(true)}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    manualMode ? 'bg-surface text-primary shadow-xs font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  Self-Reported Score Slider
                </button>
              </div>

              {manualMode ? (
                /* Manual Score Entry */
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/60 space-y-4">
                  <h3 className="font-title-md text-sm font-bold text-on-surface">
                    Set Verified Skill Proficiency for {skillName}
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    Drag the slider to record your actual proficiency or certification score.
                  </p>

                  <div className="text-center py-2">
                    <span className="font-headline-lg text-4xl font-bold text-primary">{selfScore}%</span>
                    <span
                      className={`block text-xs font-bold mt-1 ${
                        selfScore >= 75
                          ? 'text-secondary'
                          : selfScore >= 55
                          ? 'text-amber-600'
                          : 'text-error'
                      }`}
                    >
                      {selfScore >= 75
                        ? 'Match - Fully Proficient'
                        : selfScore >= 55
                        ? 'Weak - Needs Polish'
                        : 'Missing / High Priority Gap'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={selfScore}
                    onChange={(e) => setSelfScore(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-outline font-semibold">
                    <span>0% (Unassessed)</span>
                    <span>50% (Intermediate)</span>
                    <span>100% (Expert)</span>
                  </div>

                  <button
                    onClick={handleManualSelfAssessment}
                    className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    Save {selfScore}% Skill Score to Database
                  </button>
                </div>
              ) : (
                /* Quiz Questions */
                <div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant mb-2">
                    <span className="font-bold">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    <span className="text-primary font-medium">{quiz.category}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-5">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                      }}
                    />
                  </div>

                  <h3 className="font-title-md text-base font-bold text-on-surface mb-4 leading-snug">
                    {currentQ.question}
                  </h3>

                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOptionSelect(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary-container/20 text-on-surface font-bold shadow-2xs'
                              : 'border-outline-variant/60 bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'border-primary bg-primary text-on-primary'
                                : 'border-outline-variant'
                            }`}
                          >
                            {isSelected ? '✓' : String.fromCharCode(65 + idx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Nav Footer */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface-variant rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      &larr; Back
                    </button>

                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-primary-fixed-dim disabled:opacity-40 cursor-pointer"
                      >
                        Next &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="px-6 py-2 bg-secondary text-on-secondary rounded-xl text-xs font-bold hover:bg-secondary/90 shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Submit & Calculate Score
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results Display */
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-4xl text-secondary">verified</span>
              </div>

              <div>
                <h3 className="font-headline-lg text-3xl font-bold text-on-surface">
                  {calculatedScore}% Earned
                </h3>
                <p className="font-title-md text-sm font-semibold text-secondary mt-1">
                  {calculatedScore >= 75
                    ? 'Skill Verified - Matched Role Standard!'
                    : calculatedScore >= 50
                    ? 'Intermediate Proficiency Recorded'
                    : 'Skill Gap Identified - Practice Recommended'}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-sm mx-auto">
                  Your score has been committed to the skill database engine. Your gap analysis for target job roles has been recalculated.
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant text-left text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-on-surface-variant">Skill Evaluated:</span>
                  <span className="text-on-surface">{skillName}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-on-surface-variant">Database Status:</span>
                  <span
                    className={`font-bold ${
                      calculatedScore >= 75 ? 'text-secondary' : 'text-amber-600'
                    }`}
                  >
                    {calculatedScore >= 75 ? 'Match (Requirement Satisfied)' : 'Gap / Needs Action'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs cursor-pointer"
              >
                Close & Return to Skill Gap View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
