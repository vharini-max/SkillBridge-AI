import React from 'react';
import { NavTab, StudentProfile } from '../types';
import { InstallPWA } from './InstallPWA';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileSidebar: () => void;
  profile: StudentProfile;
  unreadCount?: number;
  onLogout?: () => void;
  currentTheme?: 'light' | 'dark' | 'system';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileSidebar,
  profile,
  unreadCount = 0,
  onLogout,
  currentTheme,
  onToggleTheme,
}) => {
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-outline-variant shadow-2xs">
      {/* Mobile Title & Menu Toggle */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 text-primary hover:bg-surface-container rounded-lg"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <span
          className="font-headline-lg text-xl font-bold text-primary cursor-pointer"
          onClick={() => onSelectTab('dashboard')}
        >
          SkillBridge
        </span>
      </div>

      {/* Desktop Navigation Header Tabs */}
      <div className="hidden md:flex flex-1 items-center gap-6 ml-4 h-full">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`h-full flex items-center px-3 font-title-md text-base transition-colors ${
            currentTab === 'dashboard'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('aptitude-test')}
          className={`h-full flex items-center px-3 font-title-md text-base transition-colors ${
            currentTab === 'aptitude-test' ||
            currentTab === 'aptitude-results' ||
            currentTab === 'aptitude-taking'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Tests & Assessments
        </button>
        <button
          onClick={() => onSelectTab('skill-gap')}
          className={`h-full flex items-center px-3 font-title-md text-base transition-colors ${
            currentTab === 'skill-gap'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Skill Gap Analyzer
        </button>
        <button
          onClick={() => onSelectTab('resume-analyzer')}
          className={`h-full flex items-center px-3 font-title-md text-base transition-colors ${
            currentTab === 'resume-analyzer'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Resume Analyzer
        </button>
      </div>

      {/* Right Action Icons & Search */}
      <div className="flex items-center gap-2.5">
        <InstallPWA variant="header" />

        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search skills, tests, academics..."
            className="pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-label-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-44 xl:w-52"
          />
        </div>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title={`Switch Theme (Current: ${currentTheme === 'dark' ? 'Dark Mode' : 'Lite Mode'})`}
          >
            <span className="material-symbols-outlined text-xl">
              {currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}

        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2 p-1 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
          title="Profile"
        >
          <img
            src={profile.photoUrl || profile.avatarUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          />
        </button>
      </div>
    </header>
  );
};
