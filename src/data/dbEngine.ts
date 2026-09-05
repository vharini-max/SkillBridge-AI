import {
  SkillItem,
  ReadinessScoreData,
  AppNotification,
  AppSettings,
  StudentProfile,
  AcademicRecord,
  ProjectItem,
  CertificationItem,
  InternshipItem,
} from '../types';
import skillbridgeLogo from '../assets/images/skillbridge_logo_1786551177942.jpg';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_ACADEMICS,
  UNASSESSED_READINESS_SCORE,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
} from './mockData';

export interface SkillAssessmentRecord {
  id: string;
  skillName: string;
  category: string;
  score: number; // 0-100
  percentage: number;
  status: 'Match' | 'Weak' | 'Improve' | 'Missing';
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
}

export class AppDatabaseEngine {
  private static STORAGE_KEYS = {
    SKILLS: 'sb_db_skills_v2',
    ASSESSMENT_LOGS: 'sb_db_skill_logs_v2',
    READINESS_SCORE: 'sb_db_readiness_v2',
    PROFILE: 'sb_db_profile_v2',
    NOTIFICATIONS: 'sb_db_notifications_v2',
    SETTINGS: 'sb_db_settings_v2',
    ACADEMICS: 'sb_db_academics_v2',
    PROJECTS: 'sb_db_projects_v1',
    CERTIFICATIONS: 'sb_db_certifications_v1',
    INTERNSHIPS: 'sb_db_internships_v1',
  };

  // --- Academic Performance Collection ---
  static getAcademics(): AcademicRecord {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ACADEMICS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading academics', e);
    }
    this.saveAcademics(INITIAL_ACADEMICS);
    return INITIAL_ACADEMICS;
  }

  static saveAcademics(record: AcademicRecord): AcademicRecord {
    let computedCgpa = record.cgpa;
    if (record.semesters && record.semesters.length > 0) {
      const sumGpa = record.semesters.reduce((sum, sem) => sum + (Number(sem.gpa) || 0), 0);
      computedCgpa = parseFloat((sumGpa / record.semesters.length).toFixed(2));
    }

    const updatedRecord: AcademicRecord = {
      ...record,
      cgpa: computedCgpa,
    };

    try {
      localStorage.setItem(this.STORAGE_KEYS.ACADEMICS, JSON.stringify(updatedRecord));
    } catch (e) {
      console.error('DB Error saving academics', e);
    }

    // Sync profile CGPA
    const profile = this.getProfile();
    if (profile) {
      this.saveProfile({ ...profile, cgpa: computedCgpa });
    }

    // Recalculate Readiness Index Academic Weight
    this.recalculateAcademicReadiness(updatedRecord);

    return updatedRecord;
  }

  static recalculateAcademicReadiness(record: AcademicRecord): void {
    // Max academic score weight in readiness index is 20 points
    let earnedAcademicScore = 0;

    // CGPA weight: up to 10 points
    if (record.cgpa >= 9.0) earnedAcademicScore += 10;
    else if (record.cgpa >= 8.0) earnedAcademicScore += 8;
    else if (record.cgpa >= 7.0) earnedAcademicScore += 6;
    else if (record.cgpa >= 6.0) earnedAcademicScore += 4;
    else earnedAcademicScore += 2;

    // Backlogs weight: 5 points if 0 active backlogs, 2 points if 1 backlog, 0 if >1
    if (record.activeBacklogs === 0) earnedAcademicScore += 5;
    else if (record.activeBacklogs === 1) earnedAcademicScore += 2;

    // Attendance weight: 5 points if attendance >= 85%, 3 points if >= 75%
    if (record.attendancePercentage >= 85) earnedAcademicScore += 5;
    else if (record.attendancePercentage >= 75) earnedAcademicScore += 3;

    let readiness = this.getReadinessScore();
    if (!readiness) readiness = UNASSESSED_READINESS_SCORE;

    const updatedCategories = {
      ...readiness.categories,
      academicPerformance: {
        ...readiness.categories.academicPerformance,
        earned: earnedAcademicScore,
        assessed: true,
      },
    };

    const categoryArray = Object.values(updatedCategories);
    const sum = categoryArray.reduce((acc, cat) => acc + (cat.earned || 0), 0);

    const updatedReadiness: ReadinessScoreData = {
      ...readiness,
      overallScore: sum,
      hasBeenAssessed: true,
      statusLabel:
        sum === 0 ? 'Not Assessed' : sum < 60 ? 'Not Ready' : sum < 80 ? 'Needs Improvement' : 'Placement Ready',
      statusColor:
        sum < 60
          ? 'bg-error-container text-error'
          : sum < 80
          ? 'bg-amber-500/20 text-amber-700'
          : 'bg-secondary-container text-on-secondary-container',
      feedback: `Academic database updated! Recorded CGPA: ${record.cgpa}, Backlogs: ${record.activeBacklogs}. Total Placement Index: ${sum}/100.`,
      categories: updatedCategories,
    };

    this.saveReadinessScore(updatedReadiness);
  }

  // --- Skills Collection ---
  static getSkills(): SkillItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.SKILLS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading skills', e);
    }
    this.saveSkills(INITIAL_SKILLS);
    return INITIAL_SKILLS;
  }

  static saveSkills(skills: SkillItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    } catch (e) {
      console.error('DB Error saving skills', e);
    }
  }

  static updateSkillScore(skillName: string, category: string, newScore: number): SkillItem[] {
    const currentSkills = this.getSkills();
    const existingIndex = currentSkills.findIndex(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );

    let status: 'Match' | 'Weak' | 'Improve' | 'Missing' = 'Missing';
    if (newScore >= 75) status = 'Match';
    else if (newScore >= 55) status = 'Weak';
    else if (newScore >= 40) status = 'Improve';
    else status = 'Missing';

    let updatedSkills: SkillItem[];

    if (existingIndex >= 0) {
      updatedSkills = [...currentSkills];
      updatedSkills[existingIndex] = {
        ...updatedSkills[existingIndex],
        level: newScore,
        status,
      };
    } else {
      const newSkill: SkillItem = {
        id: 'sk_' + Date.now(),
        name: skillName,
        category: category || 'Technical',
        level: newScore,
        requirementLevel: 'Verified Assessment',
        status,
      };
      updatedSkills = [newSkill, ...currentSkills];
    }

    this.saveSkills(updatedSkills);

    // Also update assessment log
    this.logAssessmentRecord({
      id: 'log_' + Date.now(),
      skillName,
      category,
      score: newScore,
      percentage: newScore,
      status,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      correctAnswers: Math.round((newScore / 100) * 4),
      totalQuestions: 4,
    });

    // Update readiness score technical category based on actual weighted skills average
    this.recalculateTechnicalReadiness(updatedSkills);

    return updatedSkills;
  }

  // --- Assessment Logs ---
  static getAssessmentLogs(): SkillAssessmentRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ASSESSMENT_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading assessment logs', e);
    }
    return [];
  }

  static logAssessmentRecord(record: SkillAssessmentRecord): void {
    const logs = this.getAssessmentLogs();
    const updated = [record, ...logs];
    try {
      localStorage.setItem(this.STORAGE_KEYS.ASSESSMENT_LOGS, JSON.stringify(updated));
    } catch (e) {
      console.error('DB Error saving log', e);
    }
  }

  // --- Technical Readiness Index Recalculation ---
  static recalculateTechnicalReadiness(skills: SkillItem[]): void {
    if (!skills || skills.length === 0) return;

    const avgSkillScore =
      skills.reduce((sum, s) => sum + s.level, 0) / skills.length;
    // Max technical score weight in readiness index is 35 points
    const earnedTechScore = Math.min(35, Math.round((avgSkillScore / 100) * 35));

    let readiness = this.getReadinessScore();
    if (!readiness) readiness = UNASSESSED_READINESS_SCORE;

    const updatedCategories = {
      ...readiness.categories,
      technicalSkills: {
        ...readiness.categories.technicalSkills,
        earned: earnedTechScore,
        assessed: true,
      },
    };

    const categoryArray = Object.values(updatedCategories);
    const sum = categoryArray.reduce((acc, cat) => acc + (cat.earned || 0), 0);

    const updatedReadiness: ReadinessScoreData = {
      ...readiness,
      overallScore: sum,
      hasBeenAssessed: true,
      statusLabel:
        sum === 0 ? 'Not Assessed' : sum < 60 ? 'Not Ready' : sum < 80 ? 'Needs Improvement' : 'Placement Ready',
      statusColor:
        sum < 60
          ? 'bg-error-container text-error'
          : sum < 80
          ? 'bg-amber-500/20 text-amber-700'
          : 'bg-secondary-container text-on-secondary-container',
      feedback: `Skill evaluation database updated! Technical skill score average: ${Math.round(
        avgSkillScore
      )}%. Total Placement Index: ${sum}/100.`,
      categories: updatedCategories,
    };

    this.saveReadinessScore(updatedReadiness);
  }

  // --- Readiness Score ---
  static getReadinessScore(): ReadinessScoreData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.READINESS_SCORE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading readiness', e);
    }
    return UNASSESSED_READINESS_SCORE;
  }

  static saveReadinessScore(score: ReadinessScoreData): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.READINESS_SCORE, JSON.stringify(score));
    } catch (e) {
      console.error('DB Error saving readiness', e);
    }
  }

  // --- Profile, Notifications, Settings ---
  static getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PROFILE);
      if (data) {
        const parsed: StudentProfile = JSON.parse(data);
        // If avatar or photoUrl is unsplash/lh3 default or missing, update to SkillBridge logo
        if (!parsed.photoUrl || parsed.avatarUrl.includes('unsplash') || parsed.avatarUrl.includes('googleusercontent')) {
          parsed.avatarUrl = skillbridgeLogo;
          parsed.photoUrl = skillbridgeLogo;
        }
        return parsed;
      }
    } catch (e) {
      console.error('DB Error reading profile', e);
    }
    return INITIAL_PROFILE;
  }

  static saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('DB Error saving profile', e);
    }
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('DB Error saving settings', e);
    }
  }

  static getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  }

  static saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('DB Error saving notifications', e);
    }
  }

  static resetDatabase(): void {
    localStorage.removeItem(this.STORAGE_KEYS.SKILLS);
    localStorage.removeItem(this.STORAGE_KEYS.ASSESSMENT_LOGS);
    localStorage.removeItem(this.STORAGE_KEYS.READINESS_SCORE);
    localStorage.removeItem(this.STORAGE_KEYS.PROFILE);
    localStorage.removeItem(this.STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(this.STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(this.STORAGE_KEYS.ACADEMICS);

    // Also clear legacy keys
    localStorage.removeItem('student_profile');
    localStorage.removeItem('placement_readiness_score');
    localStorage.removeItem('app_notifications');
    localStorage.removeItem('app_settings');
  }

  static initializeNewUserDatabase(
    customProfile?: Partial<StudentProfile>,
    customAcademics?: Partial<AcademicRecord>
  ): {
    profile: StudentProfile;
    academics: AcademicRecord;
    skills: SkillItem[];
    readinessScore: ReadinessScoreData;
    notifications: AppNotification[];
  } {
    // 1. Wipe previous storage completely
    this.resetDatabase();

    // 2. Build new student profile
    const inputCgpa = customAcademics?.cgpa ?? customProfile?.cgpa ?? 8.2;
    const inputBacklogs = customAcademics?.activeBacklogs ?? 0;
    const inputBranch = customProfile?.branch?.trim() || 'Computer Science & Engineering';
    const inputCollege = customProfile?.college?.trim() || 'Institute of Science & Technology';

    const newProfile: StudentProfile = {
      name: customProfile?.name?.trim() || 'New Student',
      email: customProfile?.email?.trim() || 'student@college.edu',
      phone: '+1 (555) 019-2834',
      department: inputBranch,
      passingYear: 2026,
      rollNumber: customProfile?.rollNumber?.trim() || 'STU' + Math.floor(100000 + Math.random() * 900000),
      role: customProfile?.role?.trim() || `${inputBranch} Student`,
      targetRole: customProfile?.targetRole?.trim() || 'Full Stack Engineer',
      cgpa: inputCgpa,
      activeBacklogs: inputBacklogs,
      college: inputCollege,
      branch: inputBranch,
      semester: customProfile?.semester?.trim() || 'Semester 6',
      avatarUrl: skillbridgeLogo,
      photoUrl: skillbridgeLogo,
      skillsSummary: {
        technicalMatchPercentage: 0,
        weakAreasCount: 0,
        strongSkillsCount: 0,
      },
    };

    // 3. Build new academic record
    const newAcademics: AcademicRecord = {
      cgpa: inputCgpa,
      activeBacklogs: inputBacklogs,
      attendancePercentage: customAcademics?.attendancePercentage ?? 88,
      creditsCompleted: customAcademics?.creditsCompleted ?? 120,
      totalCredits: customAcademics?.totalCredits ?? 160,
      tenthPercentage: customAcademics?.tenthPercentage ?? 85.0,
      twelfthPercentage: customAcademics?.twelfthPercentage ?? 82.0,
      degreeName: `B.Tech - ${inputBranch}`,
      institutionName: inputCollege,
      semesters: [
        {
          id: 'sem1',
          sem: 'Semester 1',
          gpa: inputCgpa,
          status: 'Passed',
          creditsCompleted: 24,
          totalCredits: 24,
          subjects: [
            { id: 'sub1', code: 'CS101', name: 'Introduction to Programming', credits: 4, grade: 'A', marks: 85 },
            { id: 'sub2', code: 'MA101', name: 'Mathematics I', credits: 4, grade: 'A', marks: 88 },
          ],
        },
      ],
    };

    // 4. Save profile and academics
    this.saveProfile(newProfile);
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACADEMICS, JSON.stringify(newAcademics));
    } catch (e) {
      console.error('DB Error saving academics', e);
    }

    // 5. Initialize fresh UNASSESSED readiness score (0/100)
    const unassessedReadiness: ReadinessScoreData = {
      ...UNASSESSED_READINESS_SCORE,
    };
    this.saveReadinessScore(unassessedReadiness);

    // 6. Initialize fresh unassessed baseline skills (level 0)
    const freshSkills: SkillItem[] = [
      { id: 'sk_1', name: 'Data Structures & Algorithms', category: 'Core CS', level: 0, requirementLevel: 'Must Have', status: 'Missing' },
      { id: 'sk_2', name: 'JavaScript / TypeScript', category: 'Languages', level: 0, requirementLevel: 'Must Have', status: 'Missing' },
      { id: 'sk_3', name: 'React.js', category: 'Frontend', level: 0, requirementLevel: 'Must Have', status: 'Missing' },
      { id: 'sk_4', name: 'Node.js & Express', category: 'Backend', level: 0, requirementLevel: 'Preferred', status: 'Missing' },
      { id: 'sk_5', name: 'SQL Databases', category: 'Database', level: 0, requirementLevel: 'Preferred', status: 'Missing' },
    ];
    this.saveSkills(freshSkills);

    return {
      profile: newProfile,
      academics: newAcademics,
      skills: freshSkills,
      readinessScore: unassessedReadiness,
      notifications: [],
    };
  }

  // --- Category Score Direct Update ---
  static updateCategoryScore(
    categoryKey: keyof ReadinessScoreData['categories'],
    earnedScore: number,
    customFeedback?: string
  ): ReadinessScoreData {
    let readiness = this.getReadinessScore();
    if (!readiness) readiness = UNASSESSED_READINESS_SCORE;

    const cat = readiness.categories[categoryKey];
    if (!cat) return readiness;

    const cappedScore = Math.min(Math.max(0, earnedScore), cat.max);
    const updatedCategories = {
      ...readiness.categories,
      [categoryKey]: {
        ...cat,
        earned: cappedScore,
        assessed: true,
      },
    };

    const categoryArray = Object.values(updatedCategories);
    const sum = categoryArray.reduce((acc, c) => acc + (c.earned || 0), 0);

    const statusLabel =
      sum === 0 ? 'Not Assessed' : sum < 60 ? 'Not Ready' : sum < 80 ? 'Needs Improvement' : 'Placement Ready';

    const updatedReadiness: ReadinessScoreData = {
      ...readiness,
      overallScore: sum,
      hasBeenAssessed: true,
      statusLabel,
      feedback: customFeedback || `Updated ${cat.label} evaluation score to ${cappedScore}/${cat.max}. Total Placement Readiness Index: ${sum}/100.`,
      categories: updatedCategories,
    };

    this.saveReadinessScore(updatedReadiness);
    return updatedReadiness;
  }

  // --- Projects Collection ---
  static getProjects(): ProjectItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading projects', e);
    }
    return [];
  }

  static saveProjects(projects: ProjectItem[]): ProjectItem[] {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('DB Error saving projects', e);
    }

    // Auto calculate projects readiness score weight (max 10 points)
    // 5 points for 1 minor project, 8 points for capstone, 10 for 2+ or deployed capstone
    let earned = 0;
    if (projects.length >= 2) earned = 10;
    else if (projects.length === 1) {
      earned = projects[0].type.includes('Capstone') ? 8 : 5;
    }
    this.updateCategoryScore('projects', earned, `Verified ${projects.length} project(s) in technical portfolio. Awarded ${earned}/10 project weight points.`);
    return projects;
  }

  // --- Certifications Collection ---
  static getCertifications(): CertificationItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CERTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading certifications', e);
    }
    return [];
  }

  static saveCertifications(certs: CertificationItem[]): CertificationItem[] {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(certs));
    } catch (e) {
      console.error('DB Error saving certifications', e);
    }

    // Auto calculate certification weight (max 5 points)
    let earned = 0;
    if (certs.length >= 1) earned = 5;

    this.updateCategoryScore('certifications', earned, `Verified ${certs.length} industry certification(s). Awarded ${earned}/5 certification weight points.`);
    return certs;
  }

  // --- Internships Collection ---
  static getInternships(): InternshipItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.INTERNSHIPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('DB Error reading internships', e);
    }
    return [];
  }

  static saveInternships(internships: InternshipItem[]): InternshipItem[] {
    try {
      localStorage.setItem(this.STORAGE_KEYS.INTERNSHIPS, JSON.stringify(internships));
    } catch (e) {
      console.error('DB Error saving internships', e);
    }

    // Auto calculate internship weight (max 5 points)
    let earned = 0;
    if (internships.length > 0) {
      earned = internships.some(i => i.hasPPO) ? 5 : 5;
    }

    this.updateCategoryScore('internship', earned, `Verified ${internships.length} industry internship record(s). Awarded ${earned}/5 internship weight points.`);
    return internships;
  }
}
