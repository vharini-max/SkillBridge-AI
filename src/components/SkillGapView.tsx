import React, { useState } from 'react';
import { NavTab, SkillItem } from '../types';
import { AppDatabaseEngine, SkillAssessmentRecord } from '../data/dbEngine';
import { SkillAssessmentModal } from './SkillAssessmentModal';

interface SkillGapViewProps {
  skills?: SkillItem[];
  onNavigate: (tab: NavTab) => void;
  onUpdateSkills?: (skills: SkillItem[]) => void;
}

export interface RoleDefinition {
  id: string;
  title: string;
  description: string;
  requirements: {
    name: string;
    category: string;
    minScore: number;
    weight: number;
  }[];
  highPriorityRecommendations: string[];
  mediumPriorityRecommendations: string[];
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Specializes in extracting insights from structured data using SQL, Python, Excel, and Power BI.',
    requirements: [
      { name: 'Python', category: 'Programming', minScore: 75, weight: 25 },
      { name: 'SQL', category: 'Database', minScore: 80, weight: 25 },
      { name: 'Excel', category: 'Analytics', minScore: 70, weight: 15 },
      { name: 'Power BI', category: 'Data Vis', minScore: 70, weight: 15 },
      { name: 'Statistics', category: 'Mathematics', minScore: 65, weight: 10 },
      { name: 'Communication', category: 'Soft Skill', minScore: 70, weight: 10 },
    ],
    highPriorityRecommendations: ['Power BI Dashboards', 'SQL Advanced Aggregations'],
    mediumPriorityRecommendations: ['Tableau Reporting', 'Business Problem Solving'],
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    description: 'Builds end-to-end web applications across frontend React, backend Node.js APIs, and database engines.',
    requirements: [
      { name: 'React.js', category: 'Frontend', minScore: 80, weight: 25 },
      { name: 'Node.js', category: 'Backend', minScore: 75, weight: 20 },
      { name: 'Python', category: 'Programming', minScore: 70, weight: 15 },
      { name: 'SQL', category: 'Database', minScore: 75, weight: 20 },
      { name: 'Data Structures', category: 'Computer Science', minScore: 80, weight: 20 },
    ],
    highPriorityRecommendations: ['RESTful API Design', 'System Architecture'],
    mediumPriorityRecommendations: ['Docker Containerization', 'TypeScript Types'],
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Engineers scalable software systems with strong algorithms, system design, and database knowledge.',
    requirements: [
      { name: 'Data Structures', category: 'Computer Science', minScore: 85, weight: 30 },
      { name: 'Python', category: 'Programming', minScore: 80, weight: 25 },
      { name: 'SQL', category: 'Database', minScore: 75, weight: 20 },
      { name: 'Statistics', category: 'Mathematics', minScore: 60, weight: 15 },
      { name: 'Communication', category: 'Soft Skill', minScore: 70, weight: 10 },
    ],
    highPriorityRecommendations: ['Advanced System Design', 'Algorithmic Optimization'],
    mediumPriorityRecommendations: ['Docker & Microservices'],
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    description: 'Bridges technical engineering with business strategy, requirements gathering, and data reporting.',
    requirements: [
      { name: 'Excel', category: 'Analytics', minScore: 85, weight: 30 },
      { name: 'SQL', category: 'Database', minScore: 75, weight: 25 },
      { name: 'Communication', category: 'Soft Skill', minScore: 85, weight: 25 },
      { name: 'Power BI', category: 'Data Vis', minScore: 65, weight: 20 },
    ],
    highPriorityRecommendations: ['Requirements Documentation', 'Agile / Jira Management'],
    mediumPriorityRecommendations: ['Process Flowcharting'],
  },
];

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  skills: initialSkills,
  onNavigate,
  onUpdateSkills,
}) => {
  // Database instance state
  const [dbSkills, setDbSkills] = useState<SkillItem[]>(() => {
    return initialSkills && initialSkills.length > 0
      ? initialSkills
      : AppDatabaseEngine.getSkills();
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string>('data-analyst');
  const [activeModalSkill, setActiveModalSkill] = useState<{
    name: string;
    category?: string;
  } | null>(null);

  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [customSkillCategory, setCustomSkillCategory] = useState<string>('Technical');
  const [showAddSkillForm, setShowAddSkillForm] = useState<boolean>(false);
  const [dbToast, setDbToast] = useState<string | null>(null);

  const currentRoleDef =
    ROLE_DEFINITIONS.find((r) => r.id === selectedRoleId) || ROLE_DEFINITIONS[0];

  // Calculate dynamic skill match percentages based on actual student skills in DB
  const calculateRoleMatch = (role: RoleDefinition) => {
    let totalWeightedAchieved = 0;
    let totalWeight = 0;

    const evaluatedRequirements = role.requirements.map((req) => {
      const studentSkill = dbSkills.find(
        (s) => s.name.toLowerCase() === req.name.toLowerCase()
      );
      const actualScore = studentSkill ? studentSkill.level : 0;

      totalWeightedAchieved += (actualScore * req.weight) / 100;
      totalWeight += req.weight;

      let status: 'Match' | 'Weak' | 'Missing' = 'Missing';
      if (actualScore >= req.minScore) {
        status = 'Match';
      } else if (actualScore >= 40) {
        status = 'Weak';
      } else {
        status = 'Missing';
      }

      return {
        ...req,
        actualScore,
        status,
        gapScore: Math.max(0, req.minScore - actualScore),
      };
    });

    const matchPercentage =
      totalWeight > 0 ? Math.round((totalWeightedAchieved / totalWeight) * 100) : 0;
    const gapPercentage = 100 - matchPercentage;

    return {
      matchPercentage,
      gapPercentage,
      evaluatedRequirements,
    };
  };

  const { matchPercentage, gapPercentage, evaluatedRequirements } =
    calculateRoleMatch(currentRoleDef);

  const handleAssessmentComplete = (
    updatedSkills: SkillItem[],
    logRecord: SkillAssessmentRecord
  ) => {
    setDbSkills(updatedSkills);
    if (onUpdateSkills) {
      onUpdateSkills(updatedSkills);
    }
    setActiveModalSkill(null);
    triggerDbToast(
      `Database Updated: ${logRecord.skillName} score set to ${logRecord.score}%!`
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;

    // Default unassessed level is 50%, user can launch assessment
    const updatedSkills = AppDatabaseEngine.updateSkillScore(
      customSkillInput.trim(),
      customSkillCategory,
      50
    );

    setDbSkills(updatedSkills);
    if (onUpdateSkills) {
      onUpdateSkills(updatedSkills);
    }
    setCustomSkillInput('');
    setShowAddSkillForm(false);
    triggerDbToast(`Skill "${customSkillInput}" added to persistent database!`);
  };

  const triggerDbToast = (msg: string) => {
    setDbToast(msg);
    setTimeout(() => {
      setDbToast(null);
    }, 3500);
  };

  const totalVerifiedCount = dbSkills.filter((s) => s.level >= 70).length;
  const avgDbSkillScore =
    dbSkills.length > 0
      ? Math.round(dbSkills.reduce((sum, s) => sum + s.level, 0) / dbSkills.length)
      : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16 relative">
      {/* Toast Feedback */}
      {dbToast && (
        <div className="fixed top-20 right-6 z-50 bg-secondary-container text-on-secondary-container border border-secondary/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-2xl">database</span>
          <div>
            <h4 className="font-title-md text-xs font-bold">Database Synchronized</h4>
            <p className="font-body-md text-xs">{dbToast}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-outline-variant/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
              Skill Gap & Assessment Hub
            </h1>
            <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Database Sync Active
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Real-time skill gap analysis powered by interactive skill quizzes and database verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddSkillForm(!showAddSkillForm)}
            className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-primary">add_circle</span>
            Add Custom Skill
          </button>

          <button
            onClick={() => onNavigate('readiness-score')}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            View Placement Index
          </button>
        </div>
      </div>

      {/* Database Diagnostic Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-container text-on-primary-container rounded-xl">
            <span className="material-symbols-outlined text-xl">database</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant block">
              Tracked Skills in Database
            </span>
            <span className="font-title-md text-lg font-bold text-on-surface">
              {dbSkills.length} Skills
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl">
            <span className="material-symbols-outlined text-xl text-secondary">verified</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant block">
              Verified High Proficiency
            </span>
            <span className="font-title-md text-lg font-bold text-on-surface">
              {totalVerifiedCount} Matched
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-tertiary-fixed/60 text-tertiary rounded-xl">
            <span className="material-symbols-outlined text-xl">insights</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant block">
              Average Technical Level
            </span>
            <span className="font-title-md text-lg font-bold text-on-surface">
              {avgDbSkillScore}% Average
            </span>
          </div>
        </div>
      </div>

      {/* Add Skill Form Drawer */}
      {showAddSkillForm && (
        <form
          onSubmit={handleAddCustomSkill}
          className="bg-surface-container-lowest p-5 rounded-2xl border border-primary/40 shadow-md space-y-3"
        >
          <h3 className="font-title-md text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">add_box</span>
            Register New Skill to Database
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Docker, TypeScript, Tableau, AWS..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">Category</label>
              <select
                value={customSkillCategory}
                onChange={(e) => setCustomSkillCategory(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Analytics">Analytics</option>
                <option value="Data Vis">Data Vis</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Soft Skill">Soft Skill</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddSkillForm(false)}
              className="px-3.5 py-1.5 bg-surface-container border border-outline-variant text-on-surface-variant rounded-xl text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-fixed-dim cursor-pointer shadow-2xs"
            >
              Save Skill to Database
            </button>
          </div>
        </form>
      )}

      {/* Role Selection Selector */}
      <div>
        <label className="block font-title-md text-xs font-bold text-on-surface mb-2">
          Select Target Job Role for Dynamic Gap Analysis:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ROLE_DEFINITIONS.map((r) => {
            const isSelected = r.id === selectedRoleId;
            const roleMatch = calculateRoleMatch(r).matchPercentage;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRoleId(r.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-primary bg-primary-container/20 text-on-surface shadow-xs font-bold'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-title-md text-sm font-bold truncate">{r.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      roleMatch >= 75
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-amber-500/20 text-amber-700'
                    }`}
                  >
                    {roleMatch}% Match
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${roleMatch >= 75 ? 'bg-secondary' : 'bg-primary'}`}
                    style={{ width: `${roleMatch}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dynamic Role Breakdown Card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 shadow-2xs space-y-6">
        {/* Role Match Overview Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-lg text-xl font-bold text-on-surface">
                {currentRoleDef.title} Analysis
              </h2>
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-label-sm text-xs font-bold rounded-full">
                Calculated from Database
              </span>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed max-w-xl">
              {currentRoleDef.description}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <span className="font-headline-lg text-3xl font-bold text-primary">
                {matchPercentage}%
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant block font-semibold">
                Role Match
              </span>
            </div>

            <div className="h-10 w-px bg-outline-variant" />

            <div className="text-center">
              <span className="font-headline-lg text-3xl font-bold text-error">
                {gapPercentage}%
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant block font-semibold">
                Skill Gap
              </span>
            </div>
          </div>
        </div>

        {/* Requirements & Database Verification Table */}
        <div>
          <h3 className="font-title-md text-base font-bold text-on-surface mb-3 flex items-center justify-between">
            <span>Skill Requirements & Database Score</span>
            <span className="text-xs text-outline font-medium">
              Click "Verify & Assess" to take an assessment
            </span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {evaluatedRequirements.map((req) => (
              <div
                key={req.name}
                className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-surface-container-high/60"
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      req.status === 'Match'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : req.status === 'Weak'
                        ? 'bg-amber-500/20 text-amber-700'
                        : 'bg-error-container/50 text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {req.status === 'Match'
                        ? 'check_circle'
                        : req.status === 'Weak'
                        ? 'warning'
                        : 'cancel'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-title-md text-sm font-bold text-on-surface">
                        {req.name}
                      </h4>
                      <span className="px-2 py-0.2 bg-surface-container text-on-surface-variant font-label-sm text-[10px] rounded">
                        {req.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 text-xs text-on-surface-variant">
                      <span>
                        Target: <strong>{req.minScore}%</strong>
                      </span>
                      <span>
                        Your Database Score: <strong>{req.actualScore}%</strong>
                      </span>
                    </div>

                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2 max-w-md">
                      <div
                        className={`h-full ${
                          req.status === 'Match'
                            ? 'bg-secondary'
                            : req.status === 'Weak'
                            ? 'bg-amber-500'
                            : 'bg-error'
                        }`}
                        style={{ width: `${Math.min(100, req.actualScore)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full font-label-sm text-xs font-bold ${
                      req.status === 'Match'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : req.status === 'Weak'
                        ? 'bg-amber-500/20 text-amber-700'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {req.status === 'Match'
                      ? 'Requirement Satisfied'
                      : req.status === 'Weak'
                      ? `Gap: -${req.gapScore}%`
                      : 'Critical Gap (0%)'}
                  </span>

                  <button
                    onClick={() =>
                      setActiveModalSkill({ name: req.name, category: req.category })
                    }
                    className="px-3.5 py-1.5 bg-primary text-on-primary font-label-md text-xs font-semibold rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">quiz</span>
                    {req.actualScore > 0 ? 'Re-Assess' : 'Verify & Assess'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-tertiary-fixed/30 rounded-2xl border border-tertiary/20">
            <h4 className="font-title-md text-sm font-bold text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-lg">priority_high</span>
              High Priority Skill Actions
            </h4>
            <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
              {currentRoleDef.highPriorityRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm shrink-0 mt-0.5">
                    arrow_right
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
            <h4 className="font-title-md text-sm font-bold text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">school</span>
              Recommended Learning Path
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mb-3">
              Complete practice assessments and verify skill gap items to elevate your Placement Readiness Index score above 80%.
            </p>
            <button
              onClick={() => onNavigate('aptitude-test')}
              className="text-primary font-bold text-xs hover:underline cursor-pointer flex items-center gap-1"
            >
              Take Practice Aptitude Test &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Assessment Modal */}
      {activeModalSkill && (
        <SkillAssessmentModal
          skillName={activeModalSkill.name}
          category={activeModalSkill.category}
          onComplete={handleAssessmentComplete}
          onClose={() => setActiveModalSkill(null)}
        />
      )}
    </div>
  );
};
