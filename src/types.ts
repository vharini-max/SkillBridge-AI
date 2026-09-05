export type NavTab =
  | 'dashboard'
  | 'profile'
  | 'skills'
  | 'skill-gap'
  | 'readiness-score'
  | 'resume-analyzer'
  | 'aptitude-test'
  | 'aptitude-results'
  | 'aptitude-taking'
  | 'settings';

export interface AcademicSubject {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  marks: number;
}

export interface SemesterEntry {
  id: string;
  sem: string;
  gpa: number;
  status: 'Passed' | 'Active Backlog' | 'Cleared';
  creditsCompleted: number;
  totalCredits: number;
  subjects?: AcademicSubject[];
}

export interface AcademicRecord {
  cgpa: number;
  activeBacklogs: number;
  attendancePercentage: number;
  creditsCompleted: number;
  totalCredits: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  degreeName: string;
  institutionName: string;
  semesters: SemesterEntry[];
}

export interface StudentProfile {
  name: string;
  role: string;
  department: string;
  cgpa: number;
  avatarUrl: string;
  photoUrl?: string;
  email: string;
  phone: string;
  college: string;
  passingYear: number;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeFileName?: string;
  branch?: string;
  rollNumber?: string;
  targetRole?: string;
  semester?: string;
  activeBacklogs?: number;
  skillsSummary?: {
    technicalMatchPercentage: number;
    weakAreasCount: number;
    strongSkillsCount: number;
  };
}

export interface DetectedSkill {
  category: string; // e.g. 'Languages', 'Frameworks', 'Tools', 'Core Concepts'
  skill: string;
  level?: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface MissingSkillRecommendation {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  recommendation: string;
}

export interface BulletFix {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  summary: string;
  targetRoleMatch: number;
  targetRole: string;
  categoryScores: {
    impactVerbs: number;
    formattingReadability: number;
    skillRelevance: number;
    completeness: number;
  };
  detectedSkills: DetectedSkill[];
  missingCriticalSkills: MissingSkillRecommendation[];
  strengths: string[];
  improvements: string[];
  formattingFeedback: string[];
  sampleBulletFixes: BulletFix[];
  analyzedAt: string;
  fileName: string;
  decisionStatus?: 'accepted' | 'rejected' | 'pending_revision';
  rejectionReason?: string;
  rejectionNotes?: string;
  rejectedAt?: string;
}

export interface MetricScore {
  title: string;
  value: string | number;
  subtext: string;
  statusTag?: string;
  percentage?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  requirementLevel?: string; // Core Requirement, Soft Skill, etc.
  status: 'Match' | 'Weak' | 'Improve' | 'Missing';
}

export interface RealJob {
  id: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  location: string;
  type: string; // 'Remote' | 'Full-time' | 'Internship' | 'Part-time'
  requiredSkills: string[];
  matchPercentage: number;
  isEligible: boolean;
  eligibilityStatus: string; // "Eligible ✅" or "Not Eligible ❌ - Improve: [...]"
  missingSkills: string[];
  salaryOrStipend?: string;
  applyUrl?: string;
  postedDate?: string;
}

export interface CourseItem {
  id: string;
  skillName: string;
  courseName: string;
  duration: string;
  courseLink: string;
  level: string; // e.g., 'Beginner', 'Intermediate', 'Advanced', 'Missing Skill'
  description?: string;
  category?: string;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company?: string;
  companyLogo?: string;
  location?: string;
  matchPercentage: number;
  type: string;
  missingSkills: string[];
  requiredSkills?: string[];
  isEligible?: boolean;
  eligibilityStatus?: string;
  salaryRange?: string;
  applyUrl?: string;
}

export interface CompanyEligibility {
  id: string;
  companyName: string;
  role: string;
  status: 'Eligible' | 'Conditional' | 'Not Eligible';
  cgpaRequired: number;
  date: string;
  reason?: string;
}

export interface PlacementDrive {
  id: string;
  companyCode: string;
  companyName: string;
  role: string;
  date: string;
  package: string;
  location: string;
  status: 'Upcoming' | 'Applied' | 'In Progress' | 'Closed';
  description: string;
}

export interface TestCategory {
  id: string;
  title: string;
  tag?: string;
  questionsCount: number;
  durationMins: number;
  highestScore: string;
  description: string;
  iconName: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  text: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface UserAnswerState {
  questionId: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isMarkedForReview: boolean;
  status: 'answered' | 'unanswered' | 'review' | 'not-visited';
}

export interface CategoryBreakdown {
  category: string;
  score: number; // percentage
  statusColor?: string;
}

export interface CategoryScoreItem {
  earned: number;
  max: number;
  label: string;
  weightLabel: string;
  icon: string;
  assessed: boolean;
}

export interface ReadinessScoreData {
  overallScore: number;
  hasBeenAssessed: boolean;
  statusLabel: 'Not Assessed' | 'Not Ready' | 'Needs Improvement' | 'Placement Ready';
  statusColor: string;
  feedback: string;
  categories: {
    technicalSkills: CategoryScoreItem;
    academicPerformance: CategoryScoreItem;
    aptitude: CategoryScoreItem;
    communication: CategoryScoreItem;
    projects: CategoryScoreItem;
    certifications: CategoryScoreItem;
    internship: CategoryScoreItem;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'drive' | 'assessment' | 'skill' | 'system';
  targetTab?: NavTab;
}

export interface AppSettings {
  emailDrives: boolean;
  smsSchedules: boolean;
  weeklyProgress: boolean;
  instantResults: boolean;
  theme: 'light' | 'dark' | 'system';
  compactSidebar: boolean;
  recruiterVisible: boolean;
  includeInCohort: boolean;
  publicAtsScore: boolean;
}

export interface DailyChallengeQuestion extends Question {
  categoryName: string;
  companyTag?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface DailyChallengeSet {
  date: string;
  title: string;
  targetCompanies: string[];
  totalQuestions: number;
  timeLimitMins: number;
  questions: DailyChallengeQuestion[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  techStack: string[];
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  photoUrl?: string;
  type: 'Capstone / Major Project' | 'Minor Project' | 'Industry Internship Project' | 'Open Source Contribution';
  impactStatement?: string;
  verified: boolean;
  scoreContribution: number;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  photoUrl?: string;
  verified: boolean;
  scoreContribution: number;
}

export interface InternshipItem {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  location?: string;
  hasPPO?: boolean;
  achievements: string;
  photoUrl?: string;
  verified: boolean;
  scoreContribution: number;
}

export interface DailyChallengeProgress {
  lastCompletedDate?: string;
  currentStreak: number;
  bestStreak: number;
  completedHistory: Record<string, {
    date: string;
    score: number;
    total: number;
    completedAt: string;
    percentage: number;
  }>;
}

