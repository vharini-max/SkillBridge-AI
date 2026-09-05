import React, { useState } from 'react';
import { StudentProfile, AcademicRecord } from '../types';

interface LoginViewProps {
  onLogin: (profileData?: Partial<StudentProfile>) => void;
  onNewUserSetup: (
    profileData: Partial<StudentProfile>,
    academicData: Partial<AcademicRecord>
  ) => void;
  onResetDatabase: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onNewUserSetup,
  onResetDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'new-user'>('login');

  // Existing user login fields
  const [email, setEmail] = useState('alex.rivers@college.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Rivers');

  // New User Registration & Database Reset fields
  const [newPerson, setNewPerson] = useState({
    name: '',
    email: '',
    college: '',
    branch: 'Computer Science & Engineering',
    targetRole: 'Software Engineer',
  });

  const [dbResetToast, setDbResetToast] = useState<string | null>(null);

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || 'Alex Rivers',
      email: email || 'alex.rivers@college.edu',
    });
  };

  const handleNewUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name.trim() || !newPerson.email.trim()) {
      alert('Please fill in your Full Name and Email address.');
      return;
    }

    onNewUserSetup(
      {
        name: newPerson.name,
        email: newPerson.email,
        college: newPerson.college || 'Institute of Technology',
        branch: newPerson.branch || 'Computer Science & Engineering',
        targetRole: newPerson.targetRole || 'Software Engineer',
        cgpa: 8.0,
        activeBacklogs: 0,
      },
      {
        cgpa: 8.0,
        activeBacklogs: 0,
      }
    );
  };

  const handleResetDbClick = () => {
    if (
      confirm(
        'Are you sure you want to reset all database records for a new user? This clears previous user logs and sets up a fresh database.'
      )
    ) {
      onResetDatabase();
      setDbResetToast('Database reset to fresh state! Logging in...');
      setTimeout(() => setDbResetToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-fixed rounded-full filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-fixed rounded-full filter blur-3xl opacity-20 pointer-events-none" />

      {dbResetToast && (
        <div className="fixed top-8 z-50 bg-secondary-container text-on-secondary-container border border-secondary/40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary">database</span>
          <span className="font-title-md text-xs font-bold">{dbResetToast}</span>
        </div>
      )}

      <div className="max-w-lg w-full bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary-container text-on-primary-container rounded-2xl mb-2 shadow-xs">
            <span className="material-symbols-outlined text-3xl text-primary font-bold">school</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            SkillBridge
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Campus Placement Readiness & Career Acceleration Platform
          </p>
        </div>

        {/* Tab Selector: Existing Login vs New Person Setup */}
        <div className="flex bg-surface-container-low p-1 rounded-2xl mb-6 border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-surface-container-lowest text-primary shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">login</span>
            Existing Student
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new-user')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'new-user'
                ? 'bg-primary text-on-primary shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            New Person Setup
          </button>
        </div>

        {/* Tab 1: Standard / Existing Login */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleStandardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Student / User Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivers"
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">College Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Sign In to SkillBridge
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <span className="relative px-3 bg-surface-container-lowest font-label-sm text-[11px] text-outline font-medium">
                DEMO OR RESET ACCESS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onLogin()}
                className="py-2.5 px-3 bg-surface-container border border-outline-variant text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-primary">account_circle</span>
                Demo Student (Alex)
              </button>

              <button
                type="button"
                onClick={handleResetDbClick}
                className="py-2.5 px-3 bg-error-container/30 border border-error/30 text-error font-bold text-xs rounded-xl hover:bg-error-container/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                Reset DB for New Person
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: New Person Registration & Database Setup */}
        {activeTab === 'new-user' && (
          <form onSubmit={handleNewUserSubmit} className="space-y-3 text-xs">
            <div className="bg-primary-container/20 border border-primary/20 p-3 rounded-xl text-xs text-primary font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">database</span>
              <span>This will create a fresh student profile in the database.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">College Email *</label>
                <input
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  placeholder="john.doe@university.edu"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">College / University</label>
                <input
                  type="text"
                  value={newPerson.college}
                  onChange={(e) => setNewPerson({ ...newPerson, college: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Branch / Degree</label>
                <input
                  type="text"
                  value={newPerson.branch}
                  onChange={(e) => setNewPerson({ ...newPerson, branch: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Target Career Role</label>
              <input
                type="text"
                value={newPerson.targetRole}
                onChange={(e) => setNewPerson({ ...newPerson, targetRole: e.target.value })}
                placeholder="e.g. Full Stack Developer, Data Analyst, Software Engineer"
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-fixed-dim transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span className="material-symbols-outlined text-lg">database</span>
              Connect & Initialize New Database
            </button>
          </form>
        )}

        <p className="text-[11px] text-center text-outline mt-6">
          SkillBridge Placement Portal &bull; Live Database Session
        </p>
      </div>
    </div>
  );
};
