import { DailyChallengeQuestion, DailyChallengeSet, DailyChallengeProgress } from '../types';

// Large pool of high-yield campus placement aptitude questions with step-by-step solutions and company tags
export const DAILY_APTITUDE_POOL: DailyChallengeQuestion[] = [
  {
    id: 101,
    categoryName: 'Quantitative Aptitude',
    companyTag: 'TCS NPT',
    difficulty: 'Medium',
    questionText: 'A tap can fill a tank in 6 hours and another tap can empty it in 12 hours. If both taps are opened together, in how many hours will the tank be full?',
    options: [
      { id: 'A', label: 'Option A', text: '8 hours' },
      { id: 'B', label: 'Option B', text: '10 hours' },
      { id: 'C', label: 'Option C', text: '12 hours' },
      { id: 'D', label: 'Option D', text: '14 hours' },
    ],
    correctOption: 'C',
    explanation: 'Net filling in 1 hour = (1/6) - (1/12) = 1/12. So it will take 12 hours to fill completely.',
  },
  {
    id: 102,
    categoryName: 'Logical Reasoning',
    companyTag: 'Infosys',
    difficulty: 'Easy',
    questionText: 'In a certain code language, "COMPUTER" is written as "RFUVQNPC". How is "MEDICINE" written in that code?',
    options: [
      { id: 'A', label: 'Option A', text: 'EOJDJEFM' },
      { id: 'B', label: 'Option B', text: 'EOJDEJFM' },
      { id: 'C', label: 'Option C', text: 'MFEJDJOE' },
      { id: 'D', label: 'Option D', text: 'MFEDJJEO' },
    ],
    correctOption: 'A',
    explanation: 'The reverse order of letters is taken and then each letter is shifted by +1, except first and last letters which swap positions: M -> E, E -> O, D -> J, I -> D, C -> J, I -> E, N -> F, E -> M.',
  },
  {
    id: 103,
    categoryName: 'Quantitative Aptitude',
    companyTag: 'Accenture',
    difficulty: 'Medium',
    questionText: 'A sum of money doubled itself at compound interest in 15 years. It will become eight times at the same rate in how many years?',
    options: [
      { id: 'A', label: 'Option A', text: '30 years' },
      { id: 'B', label: 'Option B', text: '45 years' },
      { id: 'C', label: 'Option C', text: '60 years' },
      { id: 'D', label: 'Option D', text: '75 years' },
    ],
    correctOption: 'B',
    explanation: 'Money becomes 2 times in 15 yrs. For compound interest, 2^3 = 8 times takes 3 x 15 = 45 years.',
  },
  {
    id: 104,
    categoryName: 'Verbal Ability',
    companyTag: 'Wipro',
    difficulty: 'Easy',
    questionText: 'Select the synonym for the word "METICULOUS":',
    options: [
      { id: 'A', label: 'Option A', text: 'Careless' },
      { id: 'B', label: 'Option B', text: 'Painstaking & Thorough' },
      { id: 'C', label: 'Option C', text: 'Hasty' },
      { id: 'D', label: 'Option D', text: 'Arrogant' },
    ],
    correctOption: 'B',
    explanation: 'Meticulous means showing great attention to detail; painstaking and thorough.',
  },
  {
    id: 105,
    categoryName: 'Data Interpretation',
    companyTag: 'Cognizant',
    difficulty: 'Medium',
    questionText: 'A company\'s revenue increased from $40M to $50M in Year 1, and then decreased by 10% in Year 2. What is the net revenue in Year 2?',
    options: [
      { id: 'A', label: 'Option A', text: '$45M' },
      { id: 'B', label: 'Option B', text: '$42M' },
      { id: 'C', label: 'Option C', text: '$48M' },
      { id: 'D', label: 'Option D', text: '$44M' },
    ],
    correctOption: 'A',
    explanation: 'Revenue after Year 1 = $50M. Year 2 decrease = 10% of $50M = $5M. Net revenue = $50M - $5M = $45M.',
  },
  {
    id: 106,
    categoryName: 'Quantitative Aptitude',
    companyTag: 'TCS NPT',
    difficulty: 'Hard',
    questionText: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:',
    options: [
      { id: 'A', label: 'Option A', text: '1 : 3' },
      { id: 'B', label: 'Option B', text: '3 : 2' },
      { id: 'C', label: 'Option C', text: '3 : 4' },
      { id: 'D', label: 'Option D', text: '2 : 1' },
    ],
    correctOption: 'B',
    explanation: 'Let speeds be x and y. Lengths are 27x and 17y. (27x + 17y)/(x + y) = 23 => 27x + 17y = 23x + 23y => 4x = 6y => x/y = 3/2.',
  },
  {
    id: 107,
    categoryName: 'Logical Reasoning',
    companyTag: 'Amazon',
    difficulty: 'Medium',
    questionText: 'Find the odd one out: 35, 49, 63, 77, 85, 91',
    options: [
      { id: 'A', label: 'Option A', text: '49' },
      { id: 'B', label: 'Option B', text: '77' },
      { id: 'C', label: 'Option C', text: '85' },
      { id: 'D', label: 'Option D', text: '91' },
    ],
    correctOption: 'C',
    explanation: 'All numbers except 85 are multiples of 7 (35, 49, 63, 77, 91). 85 is not divisible by 7.',
  },
  {
    id: 108,
    categoryName: 'Quantitative Aptitude',
    companyTag: 'Infosys',
    difficulty: 'Medium',
    questionText: 'In how many different ways can the letters of the word "LEADING" be arranged such that the vowels always come together?',
    options: [
      { id: 'A', label: 'Option A', text: '360' },
      { id: 'B', label: 'Option B', text: '480' },
      { id: 'C', label: 'Option C', text: '720' },
      { id: 'D', label: 'Option D', text: '5040' },
    ],
    correctOption: 'C',
    explanation: 'Vowels are E, A, I (3 vowels). Treat (EAI) as 1 unit. Total units = 4 consonants + 1 unit = 5 units. Arrangements = 5! * 3! = 120 * 6 = 720.',
  },
  {
    id: 109,
    categoryName: 'Verbal Ability',
    companyTag: 'TCS NPT',
    difficulty: 'Easy',
    questionText: 'Choose the correct word to complete: "The committee has submitted ___ report to the management."',
    options: [
      { id: 'A', label: 'Option A', text: 'their' },
      { id: 'B', label: 'Option B', text: 'its' },
      { id: 'C', label: 'Option C', text: 'they' },
      { id: 'D', label: 'Option D', text: 'them' },
    ],
    correctOption: 'B',
    explanation: 'Committee is a collective noun acting as a single entity, so singular possessive "its" is grammatically correct.',
  },
  {
    id: 110,
    categoryName: 'Coding Aptitude',
    companyTag: 'Accenture',
    difficulty: 'Medium',
    questionText: 'What is the output of a bitwise XOR operation between 12 (1100 in binary) and 10 (1010 in binary)?',
    options: [
      { id: 'A', label: 'Option A', text: '6' },
      { id: 'B', label: 'Option B', text: '8' },
      { id: 'C', label: 'Option C', text: '14' },
      { id: 'D', label: 'Option D', text: '4' },
    ],
    correctOption: 'A',
    explanation: '1100 XOR 1010 = 0110 in binary, which equals 6 in decimal.',
  },
];

const STORAGE_KEY_PROGRESS = 'sb_daily_challenge_progress_v1';

export class DailyAptitudeEngine {
  // Get current local date string YYYY-MM-DD
  static getTodayDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get daily challenge set for a given date
  static getDailyChallengeSet(dateStr: string = this.getTodayDateString()): DailyChallengeSet {
    // Generate deterministic hash from date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);

    // Pick 5 questions from pool deterministically based on date hash
    const selected: DailyChallengeQuestion[] = [];
    const poolCopy = [...DAILY_APTITUDE_POOL];
    const totalToSelect = Math.min(5, poolCopy.length);

    for (let i = 0; i < totalToSelect; i++) {
      const index = (positiveHash + i * 3) % poolCopy.length;
      selected.push(poolCopy[index]);
      poolCopy.splice(index, 1);
    }

    const companyTags = Array.from(
      new Set(selected.map((q) => q.companyTag).filter(Boolean) as string[])
    );

    return {
      date: dateStr,
      title: `Daily Aptitude Challenge (${dateStr})`,
      targetCompanies: companyTags.length > 0 ? companyTags : ['TCS', 'Infosys', 'Wipro'],
      totalQuestions: selected.length,
      timeLimitMins: 5,
      questions: selected,
    };
  }

  // Load progress object
  static getProgress(): DailyChallengeProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to parse daily challenge progress', e);
    }

    return {
      currentStreak: 0,
      bestStreak: 0,
      completedHistory: {},
    };
  }

  // Check if today's challenge is completed
  static isTodayCompleted(): boolean {
    const today = this.getTodayDateString();
    const progress = this.getProgress();
    return !!progress.completedHistory[today];
  }

  // Save completion of today's challenge
  static saveCompletion(score: number, total: number): DailyChallengeProgress {
    const today = this.getTodayDateString();
    const progress = this.getProgress();

    const percentage = Math.round((score / total) * 100);

    // Check streak continuation
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

    let newStreak = progress.currentStreak;
    if (!progress.completedHistory[today]) {
      if (progress.lastCompletedDate === yesterdayStr) {
        newStreak += 1;
      } else if (progress.lastCompletedDate === today) {
        // Same day
      } else {
        newStreak = 1;
      }
    }

    const newBestStreak = Math.max(progress.bestStreak, newStreak);

    const updatedProgress: DailyChallengeProgress = {
      lastCompletedDate: today,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      completedHistory: {
        ...progress.completedHistory,
        [today]: {
          date: today,
          score,
          total,
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          percentage,
        },
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updatedProgress));
    } catch (e) {
      console.error('Failed to save daily challenge progress', e);
    }

    return updatedProgress;
  }
}
