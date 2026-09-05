import React, { useState, useEffect } from 'react';
import {
  NavTab,
  StudentProfile,
  AcademicRecord,
  SkillItem,
  TestCategory,
  UserAnswerState,
  CategoryBreakdown,
  ReadinessScoreData,
  CategoryScoreItem,
  AppNotification,
  AppSettings,
} from './types';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_TEST_CATEGORIES,
  SAMPLE_QUESTIONS,
  MOCK_RESULTS_BREAKDOWN,
  UNASSESSED_READINESS_SCORE,
  SAMPLE_BENCHMARK_READINESS_SCORE,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
} from './data/mockData';

import { AppDatabaseEngine } from './data/dbEngine';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ReadinessScoreView } from './components/ReadinessScoreView';
import { SkillGapView } from './components/SkillGapView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { AptitudeLandingView } from './components/AptitudeLandingView';
import { AptitudeTakingView } from './components/AptitudeTakingView';
import { AptitudeResultsView } from './components/AptitudeResultsView';
import { ProfileView } from './components/ProfileView';
import { ProfileUpdateModal } from './components/ProfileUpdateModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginView } from './components/LoginView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Authentication Session State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') !== 'false';
  });
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState<boolean>(false);

  // App State: Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PROFILE;
  });

  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('student_profile', JSON.stringify(updatedProfile));
  };

  // App State: Skills (Database-Backed)
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    return AppDatabaseEngine.getSkills();
  });

  const handleUpdateSkills = (updatedSkills: SkillItem[]) => {
    setSkills(updatedSkills);
    AppDatabaseEngine.saveSkills(updatedSkills);
  };

  const [testCategories] = useState<TestCategory[]>(INITIAL_TEST_CATEGORIES);

  // App State: Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('app_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n));
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddNotification = (newNotif: AppNotification) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('app_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // App State: Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    return AppDatabaseEngine.getSettings();
  });

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    AppDatabaseEngine.saveSettings(newSettings);
  };

  // Readiness Score State
  const [readinessData, setReadinessData] = useState<ReadinessScoreData>(() => {
    return AppDatabaseEngine.getReadinessScore();
  });

  const handleResetReadinessScore = () => {
    setReadinessData(UNASSESSED_READINESS_SCORE);
    AppDatabaseEngine.saveReadinessScore(UNASSESSED_READINESS_SCORE);
    localStorage.removeItem('placement_readiness_score');
  };

  const handleLoadSampleBenchmark = () => {
    setReadinessData(SAMPLE_BENCHMARK_READINESS_SCORE);
    localStorage.setItem('placement_readiness_score', JSON.stringify(SAMPLE_BENCHMARK_READINESS_SCORE));
  };

  // Active Test & Results State
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | null>(null);
  const [testResultsScore, setTestResultsScore] = useState<number>(76);
  const [testResultsBreakdown, setTestResultsBreakdown] =
    useState<CategoryBreakdown[]>(MOCK_RESULTS_BREAKDOWN);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  // Auth Handlers
  const handleLogin = (profileData?: Partial<StudentProfile>) => {
    if (profileData && profileData.name) {
      const initialized = AppDatabaseEngine.initializeNewUserDatabase(profileData);
      setProfile(initialized.profile);
      setSkills(initialized.skills);
      setReadinessData(initialized.readinessScore);
      setNotifications(initialized.notifications);
    } else {
      const savedProf = AppDatabaseEngine.getProfile();
      setProfile(savedProf);
      setSkills(AppDatabaseEngine.getSkills());
      setReadinessData(AppDatabaseEngine.getReadinessScore());
      setNotifications(AppDatabaseEngine.getNotifications());
    }
    setSelectedCategory(null);
    setIsLoggedIn(true);
    localStorage.setItem('is_logged_in', 'true');
    setCurrentTab('dashboard');
  };

  const handleNewUserSetup = (
    profileData: Partial<StudentProfile>,
    academicData: Partial<AcademicRecord>
  ) => {
    const initialized = AppDatabaseEngine.initializeNewUserDatabase(profileData, academicData);
    setProfile(initialized.profile);
    setSkills(initialized.skills);
    setReadinessData(initialized.readinessScore);
    setNotifications(initialized.notifications);

    setIsLoggedIn(true);
    localStorage.setItem('is_logged_in', 'true');
    setCurrentTab('dashboard');
  };

  const handleResetDatabase = () => {
    const initialized = AppDatabaseEngine.initializeNewUserDatabase();
    setProfile(initialized.profile);
    setSkills(initialized.skills);
    setReadinessData(initialized.readinessScore);
    setNotifications(initialized.notifications);

    setIsLoggedIn(true);
    localStorage.setItem('is_logged_in', 'true');
    setCurrentTab('dashboard');
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false);
    localStorage.setItem('is_logged_in', 'false');
    setShowLogoutConfirmModal(false);
  };

  // Test Handlers
  const handleStartTest = (cat: TestCategory) => {
    setSelectedCategory(cat);
    setCurrentTab('aptitude-taking');
  };

  const handleSubmitTest = (userAnswers: Record<number, UserAnswerState>) => {
    let correct = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id]?.selectedOption === q.correctOption) {
        correct++;
      }
    });

    const calculatedPct = Math.min(
      100,
      Math.max(40, Math.round((correct / SAMPLE_QUESTIONS.length) * 100))
    );

    setTestResultsScore(calculatedPct > 0 ? calculatedPct : 78);
    setTestResultsBreakdown([
      { category: selectedCategory?.title || 'Quantitative', score: Math.min(100, calculatedPct + 5) },
      { category: 'Logical Reasoning', score: Math.max(50, calculatedPct - 4) },
      { category: 'Verbal Ability', score: Math.max(45, calculatedPct - 15) },
      { category: 'Data Interpretation', score: Math.max(55, calculatedPct - 2) },
    ]);

    if (selectedCategory) {
      selectedCategory.highestScore = `${correct} / ${SAMPLE_QUESTIONS.length}`;
    }

    const earnedAptitude = Math.round((calculatedPct / 100) * 15);
    setReadinessData((prev) => {
      const updatedCategories = {
        ...prev.categories,
        aptitude: {
          ...prev.categories.aptitude,
          earned: earnedAptitude,
          assessed: true,
        },
      };
      const categoryArray = Object.values(updatedCategories) as CategoryScoreItem[];
      const sum = categoryArray.reduce((acc, cat) => acc + cat.earned, 0);
      const statusLabel =
        sum === 0 ? 'Not Assessed' : sum < 60 ? 'Not Ready' : sum < 80 ? 'Needs Improvement' : 'Placement Ready';

      const updated: ReadinessScoreData = {
        overallScore: sum,
        hasBeenAssessed: true,
        statusLabel,
        statusColor:
          sum < 60
            ? 'bg-error-container text-error'
            : sum < 80
            ? 'bg-amber-500/20 text-amber-700'
            : 'bg-secondary-container text-on-secondary-container',
        feedback: `Aptitude test completed (${calculatedPct}%). Complete resume scans and skill gap verification to boost your total readiness score!`,
        categories: updatedCategories,
      };
      localStorage.setItem('placement_readiness_score', JSON.stringify(updated));
      return updated;
    });

    setCurrentTab('aptitude-results');
  };

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={handleLogin}
        onNewUserSetup={handleNewUserSetup}
        onResetDatabase={handleResetDatabase}
      />
    );
  }

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            profile={profile}
            skills={skills}
            readinessData={readinessData}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );

      case 'readiness-score':
        return (
          <ReadinessScoreView
            readinessData={readinessData}
            onNavigate={(tab) => setCurrentTab(tab)}
            onResetScore={handleResetReadinessScore}
            onLoadSampleBenchmark={handleLoadSampleBenchmark}
            onUpdateReadinessData={(updated) => setReadinessData(updated)}
          />
        );

      case 'skills':
      case 'skill-gap':
        return (
          <SkillGapView
            skills={skills}
            onNavigate={(tab) => setCurrentTab(tab)}
            onUpdateSkills={handleUpdateSkills}
          />
        );

      case 'resume-analyzer':
        return <ResumeAnalyzerView onNavigate={(tab) => setCurrentTab(tab)} />;

      case 'aptitude-test':
        return (
          <AptitudeLandingView
            categories={testCategories}
            onStartTest={handleStartTest}
          />
        );

      case 'aptitude-taking':
        return (
          <AptitudeTakingView
            category={selectedCategory || testCategories[1]}
            questions={SAMPLE_QUESTIONS}
            onSubmitTest={handleSubmitTest}
            onCancelTest={() => setCurrentTab('aptitude-test')}
          />
        );

      case 'aptitude-results':
        return (
          <AptitudeResultsView
            scorePercentage={testResultsScore}
            breakdown={testResultsBreakdown}
            onNavigate={(tab) => setCurrentTab(tab)}
            onRetakeTest={() => setCurrentTab('aptitude-taking')}
          />
        );

      case 'profile':
        return (
          <ProfileView
            profile={profile}
            skills={skills}
            onOpenEditModal={() => setIsEditProfileOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'settings':
        return (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetDatabase}
          />
        );

      default:
        return (
          <DashboardView
            profile={profile}
            skills={skills}
            readinessData={readinessData}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        profile={profile}
        onOpenProfileModal={() => setIsEditProfileOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={() => setShowLogoutConfirmModal(true)}
        unreadCount={unreadNotifCount}
      />

      {/* Main Page Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          profile={profile}
          unreadCount={unreadNotifCount}
          onLogout={() => setShowLogoutConfirmModal(true)}
          currentTheme={settings.theme}
          onToggleTheme={() => {
            const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
            handleUpdateSettings({ ...settings, theme: newTheme });
          }}
        />

        <main className="flex-1 w-full">{renderActiveView()}</main>
      </div>

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <ProfileUpdateModal
          profile={profile}
          onSave={handleUpdateProfile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <h3 className="font-title-md text-lg font-bold text-on-surface mb-1">
              Confirm Sign Out?
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mb-6">
              Are you sure you want to log out of SkillBridge? Your saved readiness scores and settings will remain safe.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                className="flex-1 py-2.5 bg-surface-container border border-outline-variant text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 bg-error text-on-error font-bold text-xs rounded-xl hover:bg-error/90 cursor-pointer shadow-2xs"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
