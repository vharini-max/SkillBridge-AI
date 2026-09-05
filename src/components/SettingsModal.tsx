import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetData?: () => void;
  onExportData?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onExportData,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggle = (key: keyof AppSettings) => {
    const updated = {
      ...formData,
      [key]: !formData[key],
    };
    setFormData(updated);
    onUpdateSettings(updated);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    const updated = {
      ...formData,
      theme: mode,
    };
    setFormData(updated);
    onUpdateSettings(updated);
    triggerToast(`Theme set to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`);
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    triggerToast('All platform settings saved successfully!');
  };

  const handleRestoreDefaults = () => {
    const defaults: AppSettings = {
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
    setFormData(defaults);
    onUpdateSettings(defaults);
    triggerToast('Default settings restored!');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16 relative">
      {/* Success Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-secondary-container text-on-secondary-container border border-secondary/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
          <div>
            <h4 className="font-title-md text-xs font-bold">Settings Updated</h4>
            <p className="font-body-md text-xs">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-outline-variant/60">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Platform Settings
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Configure theme mode, layout options, and data preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 bg-surface-container border border-outline-variant text-on-surface-variant rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Restore Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance / Theme */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs space-y-4">
          <h2 className="font-title-md text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">palette</span>
            Appearance & Layout
          </h2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-xs text-on-surface">Theme Mode (Lite & Dark)</label>
              <span className="font-label-sm text-[11px] font-bold text-primary px-2 py-0.5 bg-primary-container/20 rounded-full">
                Active: {formData.theme === 'dark' ? 'Dark Mode 🌙' : formData.theme === 'light' ? 'Lite Mode ☀️' : 'System Auto 💻'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  formData.theme === 'light'
                    ? 'border-primary bg-primary-container/20 text-primary font-bold shadow-xs'
                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">light_mode</span>
                <span className="text-xs font-bold">Lite Mode</span>
                <span className="text-[10px] text-on-surface-variant/80 font-normal">Daylight Clean</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  formData.theme === 'dark'
                    ? 'border-primary bg-primary-container/20 text-primary font-bold shadow-xs'
                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">dark_mode</span>
                <span className="text-xs font-bold">Dark Mode</span>
                <span className="text-[10px] text-on-surface-variant/80 font-normal">Night Contrast</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  formData.theme === 'system'
                    ? 'border-primary bg-primary-container/20 text-primary font-bold shadow-xs'
                    : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">desktop_windows</span>
                <span className="text-xs font-bold">System</span>
                <span className="text-[10px] text-on-surface-variant/80 font-normal">OS Match</span>
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high/60 transition-colors">
            <div>
              <span className="font-semibold text-on-surface text-xs block">Compact Navigation Drawer</span>
              <span className="text-[11px] text-outline">Use minimal icons mode on desktop.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.compactSidebar}
              onChange={() => handleToggle('compactSidebar')}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Account Data & Storage Tools */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-title-md text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">database</span>
              Data & Storage
            </h2>

            <p className="font-body-md text-xs text-on-surface-variant">
              Export your placement evaluation profile or clear cached evaluation test data.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  if (onExportData) onExportData();
                  else triggerToast('Profile data exported as JSON!');
                }}
                className="w-full py-2.5 bg-surface-container border border-outline-variant text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-primary">download</span>
                Export Full Profile Data (JSON)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onResetData) onResetData();
                  else {
                    localStorage.clear();
                    triggerToast('Local cache cleared successfully!');
                  }
                }}
                className="w-full py-2.5 bg-error-container/30 border border-error/30 text-error font-semibold text-xs rounded-xl hover:bg-error-container/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">cleaning_services</span>
                Reset Local Cache & Storage
              </button>
            </div>
          </div>

          {/* Save Action Bar */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 mt-4 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
