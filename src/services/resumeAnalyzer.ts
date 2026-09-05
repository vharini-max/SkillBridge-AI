import { ResumeAnalysisResult, DetectedSkill, MissingSkillRecommendation, BulletFix } from '../types';

export const SAMPLE_RESUMES = [
  {
    title: 'Data Analyst / CS Resume (Alex Rivers)',
    role: 'Data Analyst',
    fileName: 'Alex_Rivers_Data_Analyst_Resume.txt',
    text: `ALEX RIVERS
alex.rivers@college.edu | +1 (555) 019-2834 | linkedin.com/in/alexrivers | github.com/alexrivers
Institute of Science & Technology - B.Tech in Computer Science (2022 - 2026) | CGPA: 8.6/10.0

EDUCATION
Institute of Science & Technology, Computer Science Engineering
- Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Statistics, Linear Algebra, Operating Systems.

TECHNICAL SKILLS
- Programming Languages: Python, SQL, C++, HTML/CSS, JavaScript
- Tools & Libraries: Pandas, NumPy, Scikit-Learn, Matplotlib, Git, Excel (Advanced)
- Databases: PostgreSQL, MySQL
- Core Competencies: Data Wrangling, Exploratory Data Analysis, Statistical Modeling

PROJECTS
E-Commerce Customer Churn Prediction | Python, Scikit-Learn, Pandas
- Developed a machine learning classification model achieving 87% accuracy in predicting customer churn.
- Cleaned and preprocessed 50,000+ customer transaction records, handling missing values and outlier detection.
- Visualized feature importance with Matplotlib and presented actionable retention strategies to project advisors.

Automated Student Attendance Tracking System | Python, OpenCV, SQL
- Built a facial recognition attendance logger using OpenCV and SQLite, reducing tracking time by 60%.
- Designed database schemas and optimized SQL queries for low-latency log retrieval.

WORK EXPERIENCE
Data Analytics Intern | TechVision Solutions (June 2025 - August 2025)
- Automated weekly KPI reporting pipelines using Python scripts, saving 8 hours of manual data entry per week.
- Performed cohort analysis on 10,000+ active user sessions to identify drop-off rates in onboarding funnels.
- Collaborated with product team to formulate A/B test metrics for new UI workflow.

CERTIFICATIONS & LEADERSHIP
- Google Data Analytics Professional Certificate
- Vice President, Campus Data Science Club (Organized 3 hackathons for 200+ students)
`
  },
  {
    title: 'Software Engineer Resume (Full Stack)',
    role: 'Software Engineer',
    fileName: 'Jordan_Lee_Software_Engineer_Resume.txt',
    text: `JORDAN LEE
jordan.lee@dev.io | +1 (555) 321-9876 | linkedin.com/in/jordanlee | github.com/jordanlee-dev

SUMMARY
Passionate Computer Science undergraduate with hands-on experience building web applications using React, Node.js, and Cloud services. Strong foundation in data structures, system design, and REST APIs.

EDUCATION
State University of Engineering - B.S. in Computer Science (Expected May 2026) | GPA: 3.8/4.0

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, C++, Java
- Frontend: React.js, Tailwind CSS, Redux Toolkit, HTML5/CSS3
- Backend: Node.js, Express, REST APIs, GraphQL
- Database & Cloud: PostgreSQL, MongoDB, Docker, AWS (S3, EC2)

PROJECTS
Real-Time Collaborative Code Editor | React, Node.js, WebSockets, Docker
- Built a multi-user collaborative code editor supporting syntax highlighting and live execution in 5+ languages.
- Implemented WebSocket synchronization with Conflict-Free Replicated Data Types (CRDTs), maintaining sub-50ms latency.
- Containerized code execution sandboxes using Docker for isolated code execution safety.

Microservices E-Commerce API Gateway | Node.js, Express, MongoDB, Redis
- Designed microservices architecture handling order processing, payments, and user authentication with JWT.
- Integrated Redis caching layer, improving API throughput by 40% and reducing database load.

EXTRA-CURRICULAR & ACHIEVEMENTS
- 1st Place - National University Hackathon 2025 (Built AI study planner)
- Codeforces Specialist (Peak Rating: 1540)
`
  }
];

export const TARGET_ROLE_SKILL_MAP: Record<string, string[]> = {
  'Data Analyst': ['Power BI', 'Tableau', 'Excel', 'Statistics', 'SQL', 'Python', 'A/B Testing', 'Data Visualization'],
  'Business Analyst': ['Excel', 'SQL', 'Requirements Gathering', 'Agile', 'Jira', 'Power BI', 'Process Mapping', 'User Stories'],
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 'PostgreSQL', 'MongoDB', 'REST API', 'Git', 'Tailwind', 'Docker'],
  'Software Engineer (Full Stack)': ['Data Structures', 'Git', 'Docker', 'REST API', 'JavaScript', 'TypeScript', 'System Design', 'React', 'Node.js'],
  'Frontend Developer': ['React', 'TypeScript', 'Tailwind', 'HTML', 'CSS', 'JavaScript', 'Redux', 'Responsive Design', 'Vite'],
  'Backend Developer': ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API', 'System Design', 'Redis', 'Docker', 'Java'],
  'Data Scientist / ML Engineer': ['Python', 'Pandas', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Statistics', 'SQL', 'Machine Learning', 'Deep Learning'],
  'Cloud / DevOps Engineer': ['Docker', 'AWS', 'Linux', 'Kubernetes', 'CI/CD', 'Python', 'Terraform', 'Bash', 'Networking'],
  'Cybersecurity Analyst': ['Networking', 'Linux', 'SIEM', 'Penetration Testing', 'Cryptography', 'Python', 'Wireshark', 'Security Protocols'],
  'Product Manager / APM': ['Product Analytics', 'Agile', 'Scrum', 'User Research', 'SQL', 'Jira', 'Roadmapping', 'A/B Testing'],
  'AI / LLM Engineer': ['Python', 'LangChain', 'LlamaIndex', 'OpenAI', 'Gemini API', 'Vector Databases', 'PyTorch', 'Transformers'],
  'Mobile App Developer (Android/iOS)': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'REST API', 'Mobile UI'],
  'Database Administrator (DBA)': ['PostgreSQL', 'MySQL', 'Database Tuning', 'SQL', 'Backup & Recovery', 'Replication', 'Linux'],
  'QA / Automation Engineer': ['Selenium', 'Cypress', 'Python', 'JavaScript', 'API Testing', 'Postman', 'JUnit', 'CI/CD'],
  'UI/UX / Product Designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Adobe XD']
};

export const TARGET_JOB_ROLES = Object.keys(TARGET_ROLE_SKILL_MAP);

export function analyzeResumeClientSide(
  text: string,
  fileName: string = 'Uploaded_Resume.pdf',
  targetRole: string = 'Data Analyst'
): ResumeAnalysisResult {
  const cleanText = text || '';
  const lowerText = cleanText.toLowerCase();

  // 1. Detect contact info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cleanText);
  const hasPhone = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(cleanText) || lowerText.includes('phone') || lowerText.includes('+');
  const hasLinkedIn = lowerText.includes('linkedin.com');
  const hasGitHub = lowerText.includes('github.com');

  // 2. Detect section completeness
  const sections = {
    education: lowerText.includes('education') || lowerText.includes('academic') || lowerText.includes('b.tech') || lowerText.includes('b.s.') || lowerText.includes('cgpa'),
    experience: lowerText.includes('experience') || lowerText.includes('intern') || lowerText.includes('work'),
    projects: lowerText.includes('project') || lowerText.includes('built') || lowerText.includes('developed'),
    skills: lowerText.includes('skill') || lowerText.includes('technical') || lowerText.includes('technologies'),
    summary: lowerText.includes('summary') || lowerText.includes('objective') || lowerText.includes('about'),
  };

  const sectionCount = Object.values(sections).filter(Boolean).length;
  const completenessScore = Math.min(100, Math.round((sectionCount / 5) * 85 + (hasEmail && hasPhone ? 15 : 0)));

  // 3. Impact action verbs analysis
  const impactVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented', 'optimized',
    'increased', 'reduced', 'saved', 'automated', 'led', 'architected',
    'formulated', 'collaborated', 'engineered', 'spearheaded', 'analyzed',
    'transformed', 'integrated', 'delivered', 'achieved'
  ];

  let impactVerbCount = 0;
  impactVerbs.forEach(verb => {
    const matches = lowerText.match(new RegExp(`\\b${verb}\\b`, 'g'));
    if (matches) impactVerbCount += matches.length;
  });

  const impactVerbsScore = Math.min(100, Math.max(45, impactVerbCount * 9));

  // 4. Quantifiable metrics check (numbers, percentages, metrics)
  const metricMatches = cleanText.match(/\d+%/g) || [];
  const numberMatches = cleanText.match(/\$\d+|\b\d+\s*(hours|ms|sec|users|records|k|mb|gb|%)|\b\d{2,}\b/gi) || [];
  const metricsCount = metricMatches.length + numberMatches.length;

  // 5. Skill detection
  const skillCatalog: Record<string, string[]> = {
    Languages: ['python', 'sql', 'javascript', 'typescript', 'c++', 'java', 'html', 'css', 'r', 'bash'],
    'Frameworks & Libraries': ['react', 'node.js', 'pandas', 'numpy', 'scikit-learn', 'express', 'matplotlib', 'seaborn', 'tensorflow', 'pytorch', 'tailwind', 'redux'],
    'Tools & Cloud': ['git', 'github', 'docker', 'aws', 'excel', 'power bi', 'tableau', 'postgresql', 'mysql', 'mongodb', 'redis', 'jira'],
    'Core Concepts': ['data structures', 'algorithms', 'oops', 'dbms', 'statistics', 'machine learning', 'rest api', 'system design', 'agile']
  };

  const detectedSkills: DetectedSkill[] = [];
  const detectedSkillNames = new Set<string>();

  Object.entries(skillCatalog).forEach(([category, skills]) => {
    (skills || []).forEach(skill => {
      if (lowerText.includes(skill)) {
        const formattedSkill = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!detectedSkillNames.has(formattedSkill)) {
          detectedSkillNames.add(formattedSkill);
          detectedSkills.push({
            category,
            skill: formattedSkill,
            level: lowerText.includes('advanced') || lowerText.includes('expert') ? 'Advanced' : 'Intermediate'
          });
        }
      }
    });
  });

  // Target role specific skill check
  const targetRequired = TARGET_ROLE_SKILL_MAP[targetRole] || TARGET_ROLE_SKILL_MAP['Data Analyst'];
  const missingSkillsList: MissingSkillRecommendation[] = [];

  let matchedTargetSkills = 0;
  targetRequired.forEach(reqSkill => {
    const isPresent = lowerText.includes(reqSkill.toLowerCase());
    if (isPresent) {
      matchedTargetSkills++;
    } else {
      missingSkillsList.push({
        skill: reqSkill,
        importance: ['Power BI', 'SQL', 'Data Structures', 'Docker'].includes(reqSkill) ? 'High' : 'Medium',
        recommendation: `Add experience or coursework demonstrating ${reqSkill} proficiency.`
      });
    }
  });

  const skillRelevanceScore = Math.min(100, Math.round((matchedTargetSkills / targetRequired.length) * 100));
  const targetRoleMatchScore = Math.min(100, Math.round((skillRelevanceScore * 0.6) + (impactVerbsScore * 0.2) + (completenessScore * 0.2)));

  // Formatting & Readability
  const textLength = cleanText.length;
  let formattingScore = 85;
  if (textLength < 300) formattingScore -= 30; // Too short
  if (textLength > 6000) formattingScore -= 15; // Too long for single page
  if (!hasLinkedIn) formattingScore -= 5;
  if (!hasGitHub) formattingScore -= 5;
  if (metricsCount < 2) formattingScore -= 10;

  formattingScore = Math.max(40, Math.min(98, formattingScore));

  // Overall ATS Score
  const overallAtsScore = Math.round(
    completenessScore * 0.2 +
    impactVerbsScore * 0.25 +
    skillRelevanceScore * 0.3 +
    formattingScore * 0.25
  );

  // Strengths & Improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  const formattingFeedback: string[] = [];

  if (hasEmail && hasPhone) strengths.push('Clear contact header with valid email and phone number.');
  if (hasLinkedIn && hasGitHub) strengths.push('Professional online profiles linked (LinkedIn & GitHub).');
  if (impactVerbCount >= 5) strengths.push(`Strong use of ${impactVerbCount} action-oriented verbs across project and work descriptions.`);
  if (metricsCount >= 3) strengths.push(`Excellent use of ${metricsCount} quantified result metrics (% and numeric outcomes).`);
  if (detectedSkills.length >= 6) strengths.push(`Identified ${detectedSkills.length} relevant technical skills and tools.`);

  if (missingSkillsList.length > 0) {
    improvements.push(`Missing key role expectations for ${targetRole}: ${missingSkillsList.map(m => m.skill).join(', ')}.`);
  }
  if (metricsCount < 3) {
    improvements.push('Add more quantified achievements (e.g., "Reduced latency by 40%", "Processed 10,000+ records").');
  }
  if (!hasGitHub) {
    improvements.push('Include a GitHub or portfolio URL to showcase open-source work and code quality.');
  }
  if (impactVerbCount < 6) {
    improvements.push('Replace passive phrases like "worked on" or "responsible for" with strong action verbs like "Spearheaded", "Architected", or "Optimized".');
  }

  if (cleanText.length < 500) {
    formattingFeedback.push('Resume length appears brief. Expand on project impact, scope, and technical responsibilities.');
  } else {
    formattingFeedback.push('Standard single/two-page structure detected with clean readable section spacing.');
  }
  formattingFeedback.push('Ensure standard bullet points are used without nested tables or graphic columns for 100% ATS readability.');

  const sampleBulletFixes: BulletFix[] = [
    {
      original: 'Worked on a python project for data prediction.',
      improved: 'Architected a predictive machine learning model in Python, achieving 87% accuracy on 50k+ records.',
      reason: 'Replaced passive phrase "Worked on" with strong action verb and quantified the accuracy outcome.'
    },
    {
      original: 'Responsible for writing SQL queries and managing database.',
      improved: 'Optimized complex PostgreSQL database queries, reducing API query latency by 35% across 10k daily sessions.',
      reason: 'Added concrete database technology name, action verb, and measurable latency gain.'
    }
  ];

  return {
    atsScore: overallAtsScore,
    summary: `Your resume demonstrates a ${overallAtsScore >= 75 ? 'strong' : 'moderate'} baseline with ${detectedSkills.length} identified technical skills. To maximize ATS shortlisting for ${targetRole} positions, focus on adding missing core skills and quantifying bullet achievements.`,
    targetRoleMatch: targetRoleMatchScore,
    targetRole,
    categoryScores: {
      impactVerbs: impactVerbsScore,
      formattingReadability: formattingScore,
      skillRelevance: skillRelevanceScore,
      completeness: completenessScore,
    },
    detectedSkills,
    missingCriticalSkills: missingSkillsList,
    strengths: strengths.length > 0 ? strengths : ['Clear educational details provided.'],
    improvements,
    formattingFeedback,
    sampleBulletFixes,
    analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
  };
}
