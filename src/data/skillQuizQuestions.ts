export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number; // 0-based index
  explanation: string;
}

export interface SkillQuiz {
  skillId: string;
  skillName: string;
  category: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const SKILL_QUIZZES: Record<string, SkillQuiz> = {
  python: {
    skillId: 'python',
    skillName: 'Python',
    category: 'Programming',
    title: 'Python Core & Data Analysis Assessment',
    description: 'Evaluate your knowledge of Python data structures, list comprehensions, and pandas basics.',
    questions: [
      {
        id: 1,
        question: 'Which of the following creates a dictionary in Python?',
        options: ['d = [1, 2, 3]', 'd = (1, 2, 3)', 'd = {"a": 1, "b": 2}', 'd = {1, 2, 3}'],
        correctOption: 2,
        explanation: 'In Python, curly braces with key-value pairs {"a": 1} create a dictionary.',
      },
      {
        id: 2,
        question: 'What is the output of [x**2 for x in range(4)]?',
        options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '[1, 2, 3, 4]'],
        correctOption: 0,
        explanation: 'range(4) produces 0, 1, 2, 3. Squaring each yields 0, 1, 4, 9.',
      },
      {
        id: 3,
        question: 'In Pandas, which method filters rows where column "A" > 10?',
        options: ['df.filter(col("A") > 10)', 'df[df["A"] > 10]', 'df.where("A > 10")', 'df.select("A > 10")'],
        correctOption: 1,
        explanation: 'Boolean indexing df[df["A"] > 10] is the standard Pandas syntax for filtering rows.',
      },
      {
        id: 4,
        question: 'What is the difference between a list and a tuple in Python?',
        options: [
          'Lists are immutable, tuples are mutable',
          'Lists are mutable, tuples are immutable',
          'Lists use parentheses, tuples use brackets',
          'There is no functional difference',
        ],
        correctOption: 1,
        explanation: 'Lists are mutable (can be changed), whereas tuples are immutable once created.',
      },
    ],
  },
  sql: {
    skillId: 'sql',
    skillName: 'SQL',
    category: 'Database',
    title: 'SQL Relational & Aggregation Assessment',
    description: 'Test your proficiency with JOINs, GROUP BY, HAVING, and indexing concepts.',
    questions: [
      {
        id: 1,
        question: 'Which clause is used to filter aggregated results in SQL?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctOption: 1,
        explanation: 'HAVING filters aggregated groups, whereas WHERE filters individual rows before grouping.',
      },
      {
        id: 2,
        question: 'What type of JOIN returns all records from the left table and matched records from the right table?',
        options: ['INNER JOIN', 'FULL JOIN', 'LEFT JOIN', 'RIGHT JOIN'],
        correctOption: 2,
        explanation: 'LEFT JOIN (or LEFT OUTER JOIN) includes all rows from the left table regardless of matches in the right table.',
      },
      {
        id: 3,
        question: 'How do you prevent duplicate values in a column result set?',
        options: ['SELECT DISTINCT', 'SELECT UNIQUE', 'SELECT NO_DUPLICATES', 'SELECT GROUP'],
        correctOption: 0,
        explanation: 'The DISTINCT keyword in SQL removes duplicate rows from the result set.',
      },
      {
        id: 4,
        question: 'What is the primary function of a Database Index?',
        options: [
          'Encrypt sensitive columns',
          'Speed up data retrieval queries at the cost of slower writes',
          'Automatically backup tables',
          'Enforce primary key uniqueness only',
        ],
        correctOption: 1,
        explanation: 'Indexes create data structures (like B-trees) that greatly speed up SELECT query performance.',
      },
    ],
  },
  'power-bi': {
    skillId: 'power-bi',
    skillName: 'Power BI',
    category: 'Data Vis',
    title: 'Power BI DAX & Data Modeling Assessment',
    description: 'Assess your knowledge of DAX measures, Power Query transformations, and dashboard design.',
    questions: [
      {
        id: 1,
        question: 'What language is used to create custom measures and calculated columns in Power BI?',
        options: ['M', 'DAX', 'SQL', 'VBA'],
        correctOption: 1,
        explanation: 'DAX (Data Analysis Expressions) is used for formulas and calculations in Power BI models.',
      },
      {
        id: 2,
        question: 'Which tool inside Power BI Desktop is used to clean and transform raw data before loading?',
        options: ['Power Query Editor', 'Report View', 'DAX Studio', 'Model View'],
        correctOption: 0,
        explanation: 'Power Query Editor is used for ETL (Extract, Transform, Load) data preparation.',
      },
      {
        id: 3,
        question: 'What is the primary purpose of the CALCULATE function in DAX?',
        options: [
          'Multiply two matrices',
          'Evaluate an expression in a modified filter context',
          'Calculate total row count of a table',
          'Format numbers into currency strings',
        ],
        correctOption: 1,
        explanation: 'CALCULATE evaluates an expression under modified filter contexts, making it the most powerful DAX function.',
      },
    ],
  },
  statistics: {
    skillId: 'statistics',
    skillName: 'Statistics',
    category: 'Mathematics',
    title: 'Business Statistics & Probability Assessment',
    description: 'Evaluate your grasp of mean, median, standard deviation, hypothesis testing, and p-values.',
    questions: [
      {
        id: 1,
        question: 'In a heavily right-skewed dataset, which measure of central tendency is least affected by outliers?',
        options: ['Mean', 'Median', 'Mode', 'Range'],
        correctOption: 1,
        explanation: 'Median is robust to extreme outliers in skewed distributions.',
      },
      {
        id: 2,
        question: 'What does a p-value less than 0.05 typically indicate in hypothesis testing?',
        options: [
          'Strong evidence to reject the null hypothesis',
          'Weak evidence against the null hypothesis',
          'The alternative hypothesis is guaranteed false',
          'The sample size was too small',
        ],
        correctOption: 0,
        explanation: 'A p-value < 0.05 provides statistically significant evidence to reject the null hypothesis.',
      },
      {
        id: 3,
        question: 'What is the square root of Variance called?',
        options: ['Standard Error', 'Standard Deviation', 'Interquartile Range', 'Correlation Coefficient'],
        correctOption: 1,
        explanation: 'Standard Deviation is defined as the square root of variance.',
      },
    ],
  },
  excel: {
    skillId: 'excel',
    skillName: 'Excel',
    category: 'Analytics',
    title: 'Advanced Excel & Pivot Tables Assessment',
    description: 'Test your knowledge of VLOOKUP/XLOOKUP, INDEX-MATCH, Pivot Tables, and logical formulas.',
    questions: [
      {
        id: 1,
        question: 'Which modern Excel function replaces both VLOOKUP and HLOOKUP with bidirectional lookup support?',
        options: ['XLOOKUP', 'INDEX', 'LOOKUP', 'SEARCH'],
        correctOption: 0,
        explanation: 'XLOOKUP can search both vertically and horizontally in any direction without column index limits.',
      },
      {
        id: 2,
        question: 'How do you summarize large datasets dynamically in Excel without writing formulas?',
        options: ['Data Validation', 'Pivot Tables', 'Conditional Formatting', 'Goal Seek'],
        correctOption: 1,
        explanation: 'Pivot Tables allow rapid aggregation, filtering, and grouping of structured data.',
      },
      {
        id: 3,
        question: 'What does the formula =COUNTIF(range, ">50") do?',
        options: [
          'Sum numbers greater than 50',
          'Count cells in range with values strictly greater than 50',
          'Average numbers greater than 50',
          'Highlight cells with values over 50',
        ],
        correctOption: 1,
        explanation: 'COUNTIF counts cells meeting a single criterion, here values > 50.',
      },
    ],
  },
  communication: {
    skillId: 'communication',
    skillName: 'Communication',
    category: 'Soft Skill',
    title: 'Professional Communication & Presentation Assessment',
    description: 'Evaluate active listening, stakeholder reporting, email etiquette, and presentation skills.',
    questions: [
      {
        id: 1,
        question: 'When presenting technical data to non-technical business stakeholders, what is best practice?',
        options: [
          'Use maximum technical jargon to show expertise',
          'Translate data into actionable business impact and key takeaways',
          'Avoid showing any visual charts',
          'Send raw database tables via email without context',
        ],
        correctOption: 1,
        explanation: 'Effective communication translates complex metrics into clear business insights and decisions.',
      },
      {
        id: 2,
        question: 'What is the core principle of Active Listening in professional discussions?',
        options: [
          'Interrupting immediately when you disagree',
          'Fully concentrating, understanding, responding, and remembering what is said',
          'Formulating your response while the speaker is talking',
          'Taking word-for-word verbatim notes without eye contact',
        ],
        correctOption: 1,
        explanation: 'Active listening focuses fully on understanding the speaker before responding.',
      },
    ],
  },
  'react-js': {
    skillId: 'react-js',
    skillName: 'React.js',
    category: 'Programming',
    title: 'React Components & Hooks Assessment',
    description: 'Assess component lifecycle, useState, useEffect, props, and modern state management.',
    questions: [
      {
        id: 1,
        question: 'Which Hook is used to perform side effects in functional React components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctOption: 1,
        explanation: 'useEffect is used for data fetching, subscriptions, and DOM updates in React.',
      },
      {
        id: 2,
        question: 'Why should key props be provided when rendering lists in React?',
        options: [
          'To style individual list items',
          'To help React identify which items changed, were added, or removed for efficient rendering',
          'To bind click listeners',
          'Keys are optional and offer no performance benefit',
        ],
        correctOption: 1,
        explanation: 'Keys give elements stable identities, allowing React to optimize virtual DOM reconciliation.',
      },
      {
        id: 3,
        question: 'What is the primary benefit of TypeScript when writing React components?',
        options: [
          'Speeds up browser execution runtime',
          'Provides compile-time type checking for props and state to prevent runtime bugs',
          'Replaces CSS for styling',
          'Removes the need for React state',
        ],
        correctOption: 1,
        explanation: 'TypeScript detects prop mismatches and type errors before code runs in production.',
      },
    ],
  },
  'data-structures': {
    skillId: 'data-structures',
    skillName: 'Data Structures',
    category: 'Computer Science',
    title: 'Data Structures & Algorithms Assessment',
    description: 'Evaluate Big O complexity, arrays, trees, hash maps, and sorting algorithms.',
    questions: [
      {
        id: 1,
        question: 'What is the average time complexity for searching an element in a Hash Table?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctOption: 0,
        explanation: 'Hash tables offer O(1) constant average time complexity for lookups and insertions.',
      },
      {
        id: 2,
        question: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
        options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
        correctOption: 1,
        explanation: 'A Stack follows LIFO, whereas a Queue follows FIFO (First-In, First-Out).',
      },
      {
        id: 3,
        question: 'What is the worst-case time complexity of Quick Sort?',
        options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'],
        correctOption: 2,
        explanation: 'Quick Sort has an average case of O(n log n), but degrades to O(n^2) with poor pivot choices.',
      },
    ],
  },
};
