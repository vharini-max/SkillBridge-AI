import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, SkillItem, NavTab } from '../types';

interface ProfileViewProps {
  profile: StudentProfile;
  skills: SkillItem[];
  onOpenEditModal: () => void;
  onNavigate: (tab: NavTab) => void;
  onUpdateProfile?: (updated: StudentProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  skills,
  onOpenEditModal,
  onNavigate,
  onUpdateProfile,
}) => {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync state when profile prop changes
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handlePhotoSelect = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updated = { ...formData, photoUrl: dataUrl };
      setFormData(updated);
      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }
      triggerToast('Profile photo updated and saved!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updated = { ...formData, photoUrl: undefined };
    setFormData(updated);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    triggerToast('Profile photo reset to default!');
  };

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditingInline(false);
    triggerToast('Profile information saved successfully!');
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  const displayPhoto = formData.photoUrl || formData.avatarUrl;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16 relative">
      {/* Save Success Toast Banner */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-secondary-container text-on-secondary-container border border-secondary/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
          <div>
            <h4 className="font-title-md text-xs font-bold">Profile Updated</h4>
            <p className="font-body-md text-xs">{saveToast}</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-outline-variant/60">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Student Profile
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Manage your personal details, academic scores, photo, and career resume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEditingInline ? (
            <>
              <button
                onClick={() => {
                  setFormData({ ...profile });
                  setIsEditingInline(false);
                }}
                className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface-variant rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">save</span>
                Save Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditingInline(true)}
                className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-primary">edit_note</span>
                Quick Edit Mode
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl font-title-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Save current profile settings"
              >
                <span className="material-symbols-outlined text-base">save</span>
                Save Profile
              </button>
              <button
                onClick={onOpenEditModal}
                className="px-3.5 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer"
                title="Open detailed modal editor"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Modal Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Info Card & Photo Upload */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs flex flex-col items-center text-center">
          {/* Avatar with Upload Hover Badge */}
          <div className="relative group mb-4">
            <img
              src={displayPhoto}
              alt={formData.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-container shadow-md"
            />
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white font-label-sm text-[11px] gap-1 cursor-pointer"
              title="Upload New Profile Photo"
            >
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              <span>Change Photo</span>
            </button>
          </div>

          <input
            type="file"
            ref={photoInputRef}
            onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="px-3 py-1 bg-surface-container border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">upload</span>
              Upload Photo
            </button>

            {formData.photoUrl && (
              <button
                onClick={handleRemovePhoto}
                className="px-2.5 py-1 bg-error-container/60 border border-error/20 rounded-lg font-label-md text-xs font-semibold text-error hover:bg-error-container transition-colors flex items-center gap-1 cursor-pointer"
                title="Remove Custom Photo"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Reset
              </button>
            )}
          </div>

          {isEditingInline ? (
            <div className="w-full space-y-3 text-left font-body-md text-xs bg-surface-container-low p-4 rounded-xl border border-outline-variant mb-4">
              <h3 className="font-bold text-on-surface text-sm border-b border-outline-variant/60 pb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">person</span>
                Edit Personal Info
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Department / Branch</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Passing Year</label>
                  <input
                    type="number"
                    value={formData.passingYear}
                    onChange={(e) => setFormData({ ...formData, passingYear: parseInt(e.target.value) || 2026 })}
                    className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full p-2 bg-surface border border-outline-variant rounded-lg text-on-surface text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-2xs hover:bg-primary-fixed-dim"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Save Profile Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-title-md text-xl font-bold text-on-surface">{formData.name}</h2>
              <p className="font-body-md text-sm text-primary font-semibold mt-0.5">
                {formData.department}
              </p>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">{formData.college}</p>

              <div className="w-full my-5 border-t border-outline-variant" />

              {/* Readonly details list */}
              <div className="w-full space-y-3 text-left font-body-md text-xs">
                <div className="flex justify-between items-center p-2 bg-surface-container-low/60 rounded-lg">
                  <span className="text-on-surface-variant font-medium">CGPA:</span>
                  <span className="font-bold text-secondary text-sm">{formData.cgpa} / 10.0</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-surface-container-low/60 rounded-lg">
                  <span className="text-on-surface-variant font-medium">Passing Year:</span>
                  <span className="font-semibold text-on-surface">{formData.passingYear}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-surface-container-low/60 rounded-lg">
                  <span className="text-on-surface-variant font-medium">Email:</span>
                  <span className="font-semibold text-on-surface truncate max-w-[180px]">
                    {formData.email}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-surface-container-low/60 rounded-lg">
                  <span className="text-on-surface-variant font-medium">Phone:</span>
                  <span className="font-semibold text-on-surface">{formData.phone}</span>
                </div>
              </div>
            </>
          )}

          {/* Direct Save Action Button */}
          <div className="w-full mt-5">
            <button
              onClick={handleSaveProfile}
              className="w-full py-2.5 bg-primary text-on-primary font-label-md text-xs font-bold rounded-xl hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Save Profile Data
            </button>
          </div>
        </div>

        {/* Right Column: Resume & Skills */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Resume Upload Card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                Resume & ATS Verification
              </h3>
              <span className="text-xs text-secondary font-bold flex items-center gap-1 bg-secondary-container px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-base">verified</span>
                Verified
              </span>
            </div>

            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center bg-surface-container-low flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">
                badge
              </span>
              <h4 className="font-title-md text-sm font-bold text-on-surface">
                {formData.resumeFileName || 'Alex_Rivers_CS_Resume.pdf'}
              </h4>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Uploaded &bull; PDF 1.4 MB &bull; ATS Score: 82/100
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <button
                  onClick={() => onNavigate('resume-analyzer')}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  Open AI Resume Analyzer
                </button>
                <button
                  onClick={() => triggerToast('Resume PDF downloaded!')}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl font-label-md text-xs font-semibold hover:bg-surface-container cursor-pointer"
                >
                  Download Resume File
                </button>
              </div>
            </div>
          </div>

          {/* Current Skill Portfolio */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-title-md text-lg font-bold text-on-surface">Skill Portfolio</h3>
              <button
                onClick={() => onNavigate('skill-gap')}
                className="text-primary font-semibold text-xs hover:underline cursor-pointer"
              >
                Analyze Skill Gap &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-center justify-between"
                >
                  <div>
                    <span className="font-title-md text-sm font-bold text-on-surface block">
                      {skill.name}
                    </span>
                    <span className="font-body-md text-[11px] text-on-surface-variant">
                      {skill.category}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${
                      skill.status === 'Match'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : skill.status === 'Weak' || skill.status === 'Improve'
                        ? 'bg-tertiary-fixed/60 text-tertiary'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {skill.level}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
