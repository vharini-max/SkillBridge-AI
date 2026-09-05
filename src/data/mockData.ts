import {
  StudentProfile,
  SkillItem,
  JobRecommendation,
  CompanyEligibility,
  PlacementDrive,
  TestCategory,
  Question,
  CategoryBreakdown,
  ReadinessScoreData,
  AppNotification,
  AppSettings,
  AcademicRecord
} from '../types';

export const INITIAL_ACADEMICS: AcademicRecord = {
  cgpa: 8.6,
  activeBacklogs: 0,
  attendancePercentage: 92,
  creditsCompleted: 142,
  totalCredits: 160,
  tenthPercentage: 88.5,
  twelfthPercentage: 86.0,
  degreeName: 'B.Tech - Computer Science & Engineering',
  institutionName: 'Institute of Science & Technology',
  semesters: [
    {
      id: 'sem1',
      sem: 'Semester 1',
      gpa: 8.4,
      status: 'Passed',
      creditsCompleted: 24,
      totalCredits: 24,
      subjects: [
        { id: 'sub1', code: 'CS101', name: 'Introduction to Programming (C)', credits: 4, grade: 'A', marks: 85 },
        { id: 'sub2', code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A+', marks: 91 },
        { id: 'sub3', code: 'PH101', name: 'Engineering Physics', credits: 4, grade: 'B+', marks: 78 },
        { id: 'sub4', code: 'EE101', name: 'Basic Electrical Engineering', credits: 4, grade: 'A', marks: 84 },
      ],
    },
    {
      id: 'sem2',
      sem: 'Semester 2',
      gpa: 8.5,
      status: 'Passed',
      creditsCompleted: 24,
      totalCredits: 24,
      subjects: [
        { id: 'sub5', code: 'CS102', name: 'Data Structures & Algorithms', credits: 4, grade: 'A+', marks: 92 },
        { id: 'sub6', code: 'MA102', name: 'Linear Algebra & Calculus', credits: 4, grade: 'A', marks: 86 },
        { id: 'sub7', code: 'EC101', name: 'Digital Electronics', credits: 4, grade: 'B+', marks: 79 },
      ],
    },
    {
      id: 'sem3',
      sem: 'Semester 3',
      gpa: 8.7,
      status: 'Passed',
      creditsCompleted: 24,
      totalCredits: 24,
      subjects: [
        { id: 'sub8', code: 'CS201', name: 'Object-Oriented Programming (Java)', credits: 4, grade: 'A+', marks: 94 },
        { id: 'sub9', code: 'CS202', name: 'Database Management Systems', credits: 4, grade: 'A', marks: 88 },
        { id: 'sub10', code: 'MA201', name: 'Discrete Mathematics', credits: 4, grade: 'A', marks: 85 },
      ],
    },
    {
      id: 'sem4',
      sem: 'Semester 4',
      gpa: 8.8,
      status: 'Passed',
      creditsCompleted: 24,
      totalCredits: 24,
      subjects: [
        { id: 'sub11', code: 'CS203', name: 'Operating Systems', credits: 4, grade: 'A+', marks: 90 },
        { id: 'sub12', code: 'CS204', name: 'Computer Networks', credits: 4, grade: 'A', marks: 87 },
        { id: 'sub13', code: 'CS205', name: 'Software Engineering', credits: 4, grade: 'A', marks: 89 },
      ],
    },
    {
      id: 'sem5',
      sem: 'Semester 5',
      gpa: 8.6,
      status: 'Passed',
      creditsCompleted: 23,
      totalCredits: 24,
      subjects: [
        { id: 'sub14', code: 'CS301', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', marks: 86 },
        { id: 'sub15', code: 'CS302', name: 'Web Technologies & React', credits: 4, grade: 'A+', marks: 93 },
        { id: 'sub16', code: 'CS303', name: 'Theory of Computation', credits: 4, grade: 'B+', marks: 77 },
      ],
    },
    {
      id: 'sem6',
      sem: 'Semester 6',
      gpa: 8.6,
      status: 'Passed',
      creditsCompleted: 23,
      totalCredits: 24,
      subjects: [
        { id: 'sub17', code: 'CS304', name: 'Machine Learning Basics', credits: 4, grade: 'A', marks: 88 },
        { id: 'sub18', code: 'CS305', name: 'Cloud Computing & DevOps', credits: 4, grade: 'A', marks: 85 },
        { id: 'sub19', code: 'CS306', name: 'Information Security', credits: 4, grade: 'A', marks: 84 },
      ],
    },
  ],
};

export const UNASSESSED_READINESS_SCORE: ReadinessScoreData = {
  overallScore: 0,
  hasBeenAssessed: false,
  statusLabel: 'Not Assessed',
  statusColor: 'bg-outline-variant text-on-surface-variant',
  feedback: 'No evaluation work detected yet. Complete aptitude tests, scan your resume, and update your academic/skill records to generate your Placement Readiness Score.',
  categories: {
    technicalSkills: { earned: 0, max: 35, label: 'Technical Skills', weightLabel: '35% weight', icon: 'code', assessed: false },
    academicPerformance: { earned: 0, max: 20, label: 'Academic Performance', weightLabel: '20% weight', icon: 'school', assessed: false },
    aptitude: { earned: 0, max: 15, label: 'Aptitude', weightLabel: '15% weight', icon: 'psychology', assessed: false },
    communication: { earned: 0, max: 10, label: 'Communication', weightLabel: '10% weight', icon: 'chat', assessed: false },
    projects: { earned: 0, max: 10, label: 'Projects', weightLabel: '10% weight', icon: 'architecture', assessed: false },
    certifications: { earned: 0, max: 5, label: 'Certifications', weightLabel: '5% weight', icon: 'workspace_premium', assessed: false },
    internship: { earned: 0, max: 5, label: 'Internship', weightLabel: '5% weight', icon: 'business_center', assessed: false },
  },
};

export const SAMPLE_BENCHMARK_READINESS_SCORE: ReadinessScoreData = {
  overallScore: 78,
  hasBeenAssessed: true,
  statusLabel: 'Needs Improvement',
  statusColor: 'bg-amber-500/20 text-amber-700',
  feedback: "To reach 'Placement Ready' status, focus on improving your Power BI skills and increasing your Aptitude score through practice tests.",
  categories: {
    technicalSkills: { earned: 28, max: 35, label: 'Technical Skills', weightLabel: '35% weight', icon: 'code', assessed: true },
    academicPerformance: { earned: 16, max: 20, label: 'Academic Performance', weightLabel: '20% weight', icon: 'school', assessed: true },
    aptitude: { earned: 11, max: 15, label: 'Aptitude', weightLabel: '15% weight', icon: 'psychology', assessed: true },
    communication: { earned: 6, max: 10, label: 'Communication', weightLabel: '10% weight', icon: 'chat', assessed: true },
    projects: { earned: 8, max: 10, label: 'Projects', weightLabel: '10% weight', icon: 'architecture', assessed: true },
    certifications: { earned: 4, max: 5, label: 'Certifications', weightLabel: '5% weight', icon: 'workspace_premium', assessed: true },
    internship: { earned: 5, max: 5, label: 'Internship', weightLabel: '5% weight', icon: 'business_center', assessed: true },
  },
};


import skillbridgeLogo from '../assets/images/skillbridge_logo_1786551177942.jpg';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Alex Rivers',
  role: 'Student',
  department: 'Final Year, CS',
  cgpa: 8.6,
  avatarUrl: skillbridgeLogo,
  photoUrl: skillbridgeLogo,
  email: 'alex.rivers@college.edu',
  phone: '+1 (555) 019-2834',
  college: 'Institute of Science & Technology',
  passingYear: 2026
};

export const INITIAL_SKILLS: SkillItem[] = [
  { id: '1', name: 'Python', category: 'Programming', level: 85, requirementLevel: 'Core Requirement', status: 'Match' },
  { id: '2', name: 'SQL', category: 'Database', level: 90, requirementLevel: 'Core Requirement', status: 'Match' },
  { id: '3', name: 'Excel', category: 'Analytics', level: 60, requirementLevel: 'Intermediate Requirement', status: 'Weak' },
  { id: '4', name: 'Communication', category: 'Soft Skill', level: 65, requirementLevel: 'Soft Skill', status: 'Improve' },
  { id: '5', name: 'Power BI', category: 'Data Vis', level: 25, requirementLevel: 'Visualization Tool', status: 'Missing' },
  { id: '6', name: 'Statistics', category: 'Mathematics', level: 40, requirementLevel: 'Core Knowledge', status: 'Missing' },
  { id: '7', name: 'Data Structures', category: 'Computer Science', level: 88, requirementLevel: 'Core Requirement', status: 'Match' },
  { id: '8', name: 'Tableau', category: 'Data Vis', level: 30, requirementLevel: 'Elective Tool', status: 'Missing' }
];

export const INITIAL_JOB_RECOMMENDATIONS: JobRecommendation[] = [
  {
    id: 'j1',
    title: 'Data Analyst',
    company: 'FinEdge Systems',
    matchPercentage: 92,
    type: 'Full-time',
    missingSkills: ['Power BI'],
    salaryRange: '$75,000 - $90,000'
  },
  {
    id: 'j2',
    title: 'Business Analyst',
    company: 'Apex Analytics',
    matchPercentage: 84,
    type: 'Full-time',
    missingSkills: ['Advanced Statistics'],
    salaryRange: '$80,000 - $95,000'
  },
  {
    id: 'j3',
    title: 'Reporting Analyst',
    company: 'Global Insights',
    matchPercentage: 81,
    type: 'Full-time',
    missingSkills: ['Power BI', 'Tableau'],
    salaryRange: '$70,000 - $82,000'
  },
  {
    id: 'j4',
    title: 'Software Engineer',
    company: 'TechCorp',
    matchPercentage: 78,
    type: 'Full-time',
    missingSkills: ['System Design'],
    salaryRange: '$95,000 - $115,000'
  }
];

export const INITIAL_COMPANY_ELIGIBILITY: CompanyEligibility[] = [
  {
    id: 'c1',
    companyName: 'ABC Technologies',
    role: 'Associate Consultant',
    status: 'Eligible',
    cgpaRequired: 7.5,
    date: 'Oct 12'
  },
  {
    id: 'c2',
    companyName: 'XYZ Solutions',
    role: 'Software Developer',
    status: 'Conditional',
    cgpaRequired: 8.0,
    date: 'Oct 18',
    reason: 'Pending Aptitude Retake (>80% needed)'
  },
  {
    id: 'c3',
    companyName: 'TechCorp',
    role: 'Software Engineer',
    status: 'Not Eligible',
    cgpaRequired: 8.8,
    date: 'Oct 15',
    reason: 'Minimum CGPA 8.8 required (Current: 8.6)'
  }
];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'p1',
    companyCode: 'TC',
    companyName: 'TechCorp',
    role: 'Software Engineer',
    date: 'Oct 15',
    package: '12 LPA',
    location: 'San Francisco, CA / Remote',
    status: 'Upcoming',
    description: 'TechCorp is conducting campus placements for full-stack and backend software engineering positions.'
  },
  {
    id: 'p2',
    companyCode: 'FE',
    companyName: 'FinEdge',
    role: 'Analyst',
    date: 'Oct 20',
    package: '9.5 LPA',
    location: 'New York, NY',
    status: 'Upcoming',
    description: 'FinEdge is seeking analytical minds with strong SQL, Python, and statistical modeling skills.'
  },
  {
    id: 'p3',
    companyCode: 'DD',
    companyName: 'DataDynamics',
    role: 'Data Engineer',
    date: 'Nov 02',
    package: '11 LPA',
    location: 'Austin, TX',
    status: 'Upcoming',
    description: 'Data Engineer role focusing on cloud pipelines, relational databases, and ETL workflows.'
  }
];

export const INITIAL_TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'quant',
    title: 'Quantitative Aptitude',
    tag: 'Core Skill',
    questionsCount: 30,
    durationMins: 45,
    highestScore: '24 / 30',
    description: 'Test your numerical ability, mathematical reasoning, and problem-solving speed under time constraints.',
    iconName: 'calculate'
  },
  {
    id: 'logical',
    title: 'Logical Reasoning',
    questionsCount: 25,
    durationMins: 30,
    highestScore: 'Not Attempted',
    description: 'Assess your ability to analyze complex patterns, deduce relationships, and apply structured thinking.',
    iconName: 'extension'
  },
  {
    id: 'verbal',
    title: 'Verbal Ability',
    questionsCount: 40,
    durationMins: 40,
    highestScore: '32 / 40',
    description: 'Evaluate your grasp of English grammar, vocabulary, reading comprehension, and communicative logic.',
    iconName: 'forum'
  },
  {
    id: 'di',
    title: 'Data Interpretation',
    tag: 'Advanced',
    questionsCount: 20,
    durationMins: 30,
    highestScore: '15 / 20',
    description: 'Determine your proficiency in extracting insights from charts, graphs, and complex datasets.',
    iconName: 'bar_chart'
  }
];

export const MOCK_RESULTS_BREAKDOWN: CategoryBreakdown[] = [
  { category: 'Quantitative', score: 85 },
  { category: 'Logical Reasoning', score: 78 },
  { category: 'Verbal Ability', score: 55 },
  { category: 'Data Interpretation', score: 72 }
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "If 'A' is coded as 1, 'B' as 2, and 'CAT' as 24, how is 'DOG' coded?",
    options: [
      { id: 'A', label: 'Option A', text: '26' },
      { id: 'B', label: 'Option B', text: '27' },
      { id: 'C', label: 'Option C', text: '28' },
      { id: 'D', label: 'Option D', text: '29' }
    ],
    correctOption: 'A',
    explanation: 'D(4) + O(15) + G(7) = 26'
  },
  {
    id: 2,
    questionText: 'Find the next number in the series: 3, 6, 12, 24, 48, ?',
    options: [
      { id: 'A', label: 'Option A', text: '72' },
      { id: 'B', label: 'Option B', text: '96' },
      { id: 'C', label: 'Option C', text: '84' },
      { id: 'D', label: 'Option D', text: '108' }
    ],
    correctOption: 'B',
    explanation: 'Each number is doubled: 48 * 2 = 96'
  },
  {
    id: 3,
    questionText: 'Pointing to a photograph, a man said "I have no brother or sister, but that man\'s father is my father\'s son." Whose photograph was it?',
    options: [
      { id: 'A', label: 'Option A', text: 'His own' },
      { id: 'B', label: 'Option B', text: 'His son\'s' },
      { id: 'C', label: 'Option C', text: 'His father\'s' },
      { id: 'D', label: 'Option D', text: 'His nephew\'s' }
    ],
    correctOption: 'B',
    explanation: 'Since he has no brother or sister, "my father\'s son" is himself. So "that man\'s father is myself" => the photograph is his son.'
  },
  {
    id: 4,
    questionText: 'Which letter replaces the question mark? A, C, F, J, O, ?',
    options: [
      { id: 'A', label: 'Option A', text: 'S' },
      { id: 'B', label: 'Option B', text: 'T' },
      { id: 'C', label: 'Option C', text: 'U' },
      { id: 'D', label: 'Option D', text: 'V' }
    ],
    correctOption: 'C',
    explanation: '+2, +3, +4, +5, +6 => O (15) + 6 = 21 (U)'
  },
  {
    id: 5,
    questionText: 'Statements: All dogs are mammals. All mammals are animals. Conclusion: All dogs are animals.',
    options: [
      { id: 'A', label: 'Option A', text: 'Follows logically' },
      { id: 'B', label: 'Option B', text: 'Does not follow' },
      { id: 'C', label: 'Option C', text: 'Either follows or not' },
      { id: 'D', label: 'Option D', text: 'Insufficient data' }
    ],
    correctOption: 'A',
    explanation: 'By syllogism, All A are B and All B are C implies All A are C.'
  },
  {
    id: 6,
    questionText: 'A train 150m long is running at 60 km/h. How much time will it take to cross a platform 250m long?',
    options: [
      { id: 'A', label: 'Option A', text: '20 seconds' },
      { id: 'B', label: 'Option B', text: '24 seconds' },
      { id: 'C', label: 'Option C', text: '30 seconds' },
      { id: 'D', label: 'Option D', text: '18 seconds' }
    ],
    correctOption: 'B',
    explanation: 'Total distance = 400m. Speed = 60 * (5/18) = 50/3 m/s. Time = 400 / (50/3) = 24 seconds.'
  },
  {
    id: 7,
    questionText: 'In a class of 45 students, Rahul is ranked 15th from the top. What is his rank from the bottom?',
    options: [
      { id: 'A', label: 'Option A', text: '30th' },
      { id: 'B', label: 'Option B', text: '31st' },
      { id: 'C', label: 'Option C', text: '32nd' },
      { id: 'D', label: 'Option D', text: '29th' }
    ],
    correctOption: 'B',
    explanation: 'Rank from bottom = Total - Rank from top + 1 = 45 - 15 + 1 = 31st.'
  },
  {
    id: 8,
    questionText: 'Which word does NOT belong with the others? Apple, Orange, Banana, Potato',
    options: [
      { id: 'A', label: 'Option A', text: 'Apple' },
      { id: 'B', label: 'Option B', text: 'Orange' },
      { id: 'C', label: 'Option C', text: 'Banana' },
      { id: 'D', label: 'Option D', text: 'Potato' }
    ],
    correctOption: 'D',
    explanation: 'Potato is a vegetable; others are fruits.'
  },
  {
    id: 9,
    questionText: 'If 5 workers complete a project in 12 days, how many days will 10 workers take to complete the same project?',
    options: [
      { id: 'A', label: 'Option A', text: '6 days' },
      { id: 'B', label: 'Option B', text: '8 days' },
      { id: 'C', label: 'Option C', text: '10 days' },
      { id: 'D', label: 'Option D', text: '24 days' }
    ],
    correctOption: 'A',
    explanation: 'Inverse proportion: 5 * 12 = 10 * x => x = 6 days.'
  },
  {
    id: 10,
    questionText: 'Clock angle problem: What is the angle between the hour hand and minute hand at 3:30?',
    options: [
      { id: 'A', label: 'Option A', text: '75 degrees' },
      { id: 'B', label: 'Option B', text: '90 degrees' },
      { id: 'C', label: 'Option C', text: '105 degrees' },
      { id: 'D', label: 'Option D', text: '60 degrees' }
    ],
    correctOption: 'A',
    explanation: '|30*H - 5.5*M| = |30*3 - 5.5*30| = |90 - 165| = 75 degrees.'
  },
  {
    id: 11,
    questionText: "If 'LIGHT' is written as 'MJHIU', how is 'FLAME' written?",
    options: [
      { id: 'A', label: 'Option A', text: 'GMBNF' },
      { id: 'B', label: 'Option B', text: 'GMBNF' },
      { id: 'C', label: 'Option C', text: 'GLBNF' },
      { id: 'D', label: 'Option D', text: 'GMCNE' }
    ],
    correctOption: 'A',
    explanation: 'Shift each letter forward by 1: F->G, L->M, A->B, M->N, E->F => GMBNF'
  },
  {
    id: 12,
    questionText: "If the code for 'SYSTEM' is 'SYSMET' and 'NEARER' is 'AENRER', what is the code for 'FRACTION'?",
    options: [
      { id: 'A', label: 'Option A', text: 'CARFNOIT' },
      { id: 'B', label: 'Option B', text: 'FRACNOIT' },
      { id: 'C', label: 'Option C', text: 'NOITCARF' },
      { id: 'D', label: 'Option D', text: 'CARFTION' }
    ],
    correctOption: 'B',
    explanation: 'The word is divided into two halves and reversed or rearranged according to pattern: FRAC | TION -> FRAC | NOIT => FRACNOIT'
  },
  {
    id: 13,
    questionText: 'In a code language, 256 means "you are good", 637 means "good and bad", 358 means "you and me". What digit stands for "bad"?',
    options: [
      { id: 'A', label: 'Option A', text: '2' },
      { id: 'B', label: 'Option B', text: '7' },
      { id: 'C', label: 'Option C', text: '6' },
      { id: 'D', label: 'Option D', text: '3' }
    ],
    correctOption: 'B',
    explanation: '"good" is 6, "and" is 3. In 637 ("good and bad"), "bad" must be 7.'
  },
  {
    id: 14,
    questionText: 'A man walks 5 km North, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?',
    options: [
      { id: 'A', label: 'Option A', text: '3 km' },
      { id: 'B', label: 'Option B', text: '5 km' },
      { id: 'C', label: 'Option C', text: '8 km' },
      { id: 'D', label: 'Option D', text: '13 km' }
    ],
    correctOption: 'A',
    explanation: 'He creates a rectangle of 5 km x 3 km. He ends up 3 km East of starting point.'
  },
  {
    id: 15,
    questionText: 'What is the sum of angles in a convex pentagon?',
    options: [
      { id: 'A', label: 'Option A', text: '360 degrees' },
      { id: 'B', label: 'Option B', text: '540 degrees' },
      { id: 'C', label: 'Option C', text: '720 degrees' },
      { id: 'D', label: 'Option D', text: '450 degrees' }
    ],
    correctOption: 'B',
    explanation: '(5 - 2) * 180 = 540 degrees.'
  },
  {
    id: 16,
    questionText: 'Complete the analogy: Moon : Satellite :: Sun : ?',
    options: [
      { id: 'A', label: 'Option A', text: 'Planet' },
      { id: 'B', label: 'Option B', text: 'Star' },
      { id: 'C', label: 'Option C', text: 'Asteroid' },
      { id: 'D', label: 'Option D', text: 'Comet' }
    ],
    correctOption: 'B',
    explanation: 'Moon is a satellite; Sun is a star.'
  },
  {
    id: 17,
    questionText: 'If 30% of a number is 90, what is 50% of that number?',
    options: [
      { id: 'A', label: 'Option A', text: '120' },
      { id: 'B', label: 'Option B', text: '150' },
      { id: 'C', label: 'Option C', text: '180' },
      { id: 'D', label: 'Option D', text: '200' }
    ],
    correctOption: 'B',
    explanation: 'Number = 90 / 0.3 = 300. 50% of 300 = 150.'
  },
  {
    id: 18,
    questionText: 'Which fraction is the largest: 3/4, 5/6, 7/9, 11/12?',
    options: [
      { id: 'A', label: 'Option A', text: '3/4' },
      { id: 'B', label: 'Option B', text: '5/6' },
      { id: 'C', label: 'Option C', text: '7/9' },
      { id: 'D', label: 'Option D', text: '11/12' }
    ],
    correctOption: 'D',
    explanation: '11/12 = 0.916, 5/6 = 0.833, 3/4 = 0.75, 7/9 = 0.777.'
  },
  {
    id: 19,
    questionText: 'Statements: Some books are pens. All pens are papers. Conclusion: Some books are papers.',
    options: [
      { id: 'A', label: 'Option A', text: 'True' },
      { id: 'B', label: 'Option B', text: 'False' },
      { id: 'C', label: 'Option C', text: 'Uncertain' },
      { id: 'D', label: 'Option D', text: 'None of the above' }
    ],
    correctOption: 'A',
    explanation: 'The books that are pens are also papers.'
  },
  {
    id: 20,
    questionText: 'How many 3-digit numbers can be formed using digits 1, 2, 3, 4 without repetition?',
    options: [
      { id: 'A', label: 'Option A', text: '12' },
      { id: 'B', label: 'Option B', text: '24' },
      { id: 'C', label: 'Option C', text: '36' },
      { id: 'D', label: 'Option D', text: '16' }
    ],
    correctOption: 'B',
    explanation: '4 * 3 * 2 = 24.'
  },
  {
    id: 21,
    questionText: 'What is the probability of getting a sum of 7 when rolling two fair dice?',
    options: [
      { id: 'A', label: 'Option A', text: '1/6' },
      { id: 'B', label: 'Option B', text: '1/12' },
      { id: 'C', label: 'Option C', text: '5/36' },
      { id: 'D', label: 'Option D', text: '1/4' }
    ],
    correctOption: 'A',
    explanation: 'Favorable pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total = 36. 6/36 = 1/6.'
  },
  {
    id: 22,
    questionText: 'A car covers a distance of 300 km in 4 hours. What is its average speed in m/s?',
    options: [
      { id: 'A', label: 'Option A', text: '20.83 m/s' },
      { id: 'B', label: 'Option B', text: '25 m/s' },
      { id: 'C', label: 'Option C', text: '18.5 m/s' },
      { id: 'D', label: 'Option D', text: '30 m/s' }
    ],
    correctOption: 'A',
    explanation: '75 km/h * (5/18) = 20.83 m/s.'
  },
  {
    id: 23,
    questionText: 'Find the odd one out: 64, 125, 216, 343, 512, 729, 841',
    options: [
      { id: 'A', label: 'Option A', text: '343' },
      { id: 'B', label: 'Option B', text: '512' },
      { id: 'C', label: 'Option C', text: '841' },
      { id: 'D', label: 'Option D', text: '729' }
    ],
    correctOption: 'C',
    explanation: 'All others are perfect cubes (4^3, 5^3, 6^3, 7^3, 8^3, 9^3), but 841 is 29^2.'
  },
  {
    id: 24,
    questionText: 'If a principal doubles in 8 years at simple interest, what is the rate of interest per annum?',
    options: [
      { id: 'A', label: 'Option A', text: '10%' },
      { id: 'B', label: 'Option B', text: '12.5%' },
      { id: 'C', label: 'Option C', text: '15%' },
      { id: 'D', label: 'Option D', text: '8%' }
    ],
    correctOption: 'B',
    explanation: 'I = P => P = P * R * 8 / 100 => R = 100/8 = 12.5%.'
  },
  {
    id: 25,
    questionText: 'Choose the synonym for "PERSEVERANCE":',
    options: [
      { id: 'A', label: 'Option A', text: 'Persistence' },
      { id: 'B', label: 'Option B', text: 'Hesitation' },
      { id: 'C', label: 'Option C', text: 'Indifference' },
      { id: 'D', label: 'Option D', text: 'Timidity' }
    ],
    correctOption: 'A',
    explanation: 'Perseverance means continued effort to do or achieve something despite difficulties.'
  },
  {
    id: 26,
    questionText: 'Choose the antonym for "CANDID":',
    options: [
      { id: 'A', label: 'Option A', text: 'Frank' },
      { id: 'B', label: 'Option B', text: 'Honest' },
      { id: 'C', label: 'Option C', text: 'Secretive' },
      { id: 'D', label: 'Option D', text: 'Direct' }
    ],
    correctOption: 'C',
    explanation: 'Candid means truthful and straightforward; secretive is the opposite.'
  },
  {
    id: 27,
    questionText: 'Two pipes A and B can fill a tank in 10 and 15 minutes respectively. If both operate together, how long will it take?',
    options: [
      { id: 'A', label: 'Option A', text: '5 minutes' },
      { id: 'B', label: 'Option B', text: '6 minutes' },
      { id: 'C', label: 'Option C', text: '7.5 minutes' },
      { id: 'D', label: 'Option D', text: '8 minutes' }
    ],
    correctOption: 'B',
    explanation: '(1/10 + 1/15) = 1/6 tank per minute => 6 minutes.'
  },
  {
    id: 28,
    questionText: 'In a row of trees, one tree is 7th from either end. How many trees are there in the row?',
    options: [
      { id: 'A', label: 'Option A', text: '13' },
      { id: 'B', label: 'Option B', text: '14' },
      { id: 'C', label: 'Option C', text: '15' },
      { id: 'D', label: 'Option D', text: '12' }
    ],
    correctOption: 'A',
    explanation: '7 + 7 - 1 = 13 trees.'
  },
  {
    id: 29,
    questionText: 'In a code, "MEMBER" is written as "REBMEM". How is "SYSTEM" written?',
    options: [
      { id: 'A', label: 'Option A', text: 'METSYS' },
      { id: 'B', label: 'Option B', text: 'SYSMET' },
      { id: 'C', label: 'Option C', text: 'SYSSTEM' },
      { id: 'D', label: 'Option D', text: 'TEMSYS' }
    ],
    correctOption: 'A',
    explanation: 'Reverse the entire string: SYSTEM -> METSYS'
  },
  {
    id: 30,
    questionText: 'What is the median of the dataset: 12, 7, 19, 3, 15, 21, 9?',
    options: [
      { id: 'A', label: 'Option A', text: '9' },
      { id: 'B', label: 'Option B', text: '12' },
      { id: 'C', label: 'Option C', text: '15' },
      { id: 'D', label: 'Option D', text: '7' }
    ],
    correctOption: 'B',
    explanation: 'Sorted dataset: 3, 7, 9, 12, 15, 19, 21. Middle value is 12.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'New Company Drive: TechCorp India',
    desc: 'TechCorp has posted a Software Development Engineer drive scheduled for Oct 15. Min CGPA: 7.5.',
    time: '10 mins ago',
    unread: true,
    type: 'drive',
    targetTab: 'dashboard',
  },
  {
    id: 'n2',
    title: 'Aptitude Test Score Evaluated',
    desc: 'Your recent Quantitative & Logical Reasoning score was updated. Readiness Index updated.',
    time: '2 hours ago',
    unread: true,
    type: 'assessment',
    targetTab: 'readiness-score',
  },
  {
    id: 'n3',
    title: 'Skill Gap Action Required',
    desc: 'Complete Power BI and SQL Advanced practice modules to unlock FinEdge Analyst position eligibility.',
    time: 'Yesterday',
    unread: false,
    type: 'skill',
    targetTab: 'skill-gap',
  },
  {
    id: 'n4',
    title: 'Resume ATS Score Verification',
    desc: 'Your resume scan scored 82/100. Review recommended impact verb enhancements.',
    time: '3 days ago',
    unread: false,
    type: 'system',
    targetTab: 'resume-analyzer',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  emailDrives: true,
  smsSchedules: true,
  weeklyProgress: true,
  instantResults: true,
  theme: 'light',
  compactSidebar: false,
  recruiterVisible: true,
  includeInCohort: true,
  publicAtsScore: true,
};

