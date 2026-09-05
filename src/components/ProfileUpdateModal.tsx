import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';

interface ProfileUpdateModalProps {
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
  onClose: () => void;
}

export const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoSelect = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        photoUrl: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const displayPhoto = formData.photoUrl || formData.avatarUrl;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
          <h3 className="font-title-md text-xl font-bold text-on-surface">Update Student Profile</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Profile Photo Upload Section */}
          <div className="flex flex-col items-center justify-center pb-3 border-b border-outline-variant">
            <label className="block font-semibold text-on-surface mb-2 self-start">Profile Photo</label>
            <div className="flex items-center gap-4">
              <img
                src={displayPhoto}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-container shadow-xs"
              />
              <div className="flex flex-col gap-1.5">
                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-fixed-dim transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  Upload New Photo
                </button>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-error font-semibold hover:underline text-[11px] text-left"
                  >
                    Reset to Default Avatar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Department / Branch</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">CGPA (out of 10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })
                }
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface mb-1">Passing Year</label>
              <input
                type="number"
                value={formData.passingYear}
                onChange={(e) =>
                  setFormData({ ...formData, passingYear: parseInt(e.target.value) || 2026 })
                }
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">College Name</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-semibold hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
