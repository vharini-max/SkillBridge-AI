import React from 'react';
import { NavTab, StudentProfile } from '../types';
import { InstallPWA } from './InstallPWA';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: StudentProfile;
  onOpenProfileModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenProfileModal,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  unreadCount = 0,
}) => {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'skills', label: 'My Skills', icon: 'psychology' },
    { id: 'skill-gap', label: 'Skill Gap', icon: 'compare_arrows' },
    { id: 'readiness-score', label: 'Readiness Score', icon: 'trending_up' },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: 'badge' },
    { id: 'aptitude-test', label: 'Aptitude Test', icon: 'quiz' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Navigation Drawer */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-outline-variant flex flex-col pt-6 pb-4 px-4 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="mb-6 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <span className="font-headline-lg text-2xl md:text-3xl font-bold text-primary tracking-tight">
              SkillBridge
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Profile Summary Card */}
        <div className="mb-6 flex flex-col items-center p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant text-center">
          <img
            src={profile.photoUrl || profile.avatarUrl}
            alt={profile.name}
            className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-primary-container shadow-xs"
          />
          <h2 className="font-title-md text-base font-bold text-on-surface leading-tight">
            {profile.name}
          </h2>
          <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
            {profile.department}
          </p>
          <button
            onClick={onOpenProfileModal}
            className="mt-3 w-full py-1.5 px-3 bg-primary text-on-primary rounded-lg font-label-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs"
          >
            Update Profile
          </button>
        </div>

        {/* Main Navigation List */}
        <ul className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive =
              currentTab === item.id ||
              (item.id === 'aptitude-test' &&
                (currentTab === 'aptitude-results' || currentTab === 'aptitude-taking'));

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-2xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:rounded-xl font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="font-label-md text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Utility Links & PWA Download Button */}
        <div className="mt-auto border-t border-outline-variant pt-3 flex flex-col gap-2">
          <InstallPWA variant="sidebar" />

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left font-label-md text-sm transition-colors ${
              currentTab === 'settings'
                ? 'bg-surface-container-high text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={() => {
              onCloseMobile();
              if (onLogout) {
                onLogout();
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-left font-label-md text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};
