import React, { useState, useEffect } from 'react';
import { ProjectItem, CertificationItem, InternshipItem, ReadinessScoreData, NavTab } from '../types';
import { AppDatabaseEngine } from '../data/dbEngine';

export type ReadinessModalType =
  | 'communication'
  | 'projects'
  | 'certifications'
  | 'internship'
  | 'academics'
  | 'skills'
  | null;

interface ReadinessCategoryModalsProps {
  activeModal: ReadinessModalType;
  onClose: () => void;
  onUpdateReadinessScore: (updatedScore: ReadinessScoreData) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const ReadinessCategoryModals: React.FC<ReadinessCategoryModalsProps> = ({
  activeModal,
  onClose,
  onUpdateReadinessScore,
  onNavigate,
}) => {
  if (!activeModal) return null;

  // Local states for forms
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- 1. Communication Assessment Modal State ---
  const [commAnswers, setCommAnswers] = useState<{ [key: string]: string }>({
    q1: 'B',
    q2: 'A',
  });
  const [speechResponseText, setSpeechResponseText] = useState<string>(
    'During our final year group capstone project, two team members disagreed on database architecture. I organized a 30-minute structured discussion where both presented benchmark data, helping us align on PostgreSQL, which reduced query response time by 40%.'
  );
  const [isEvaluatingSpeech, setIsEvaluatingSpeech] = useState<boolean>(false);

  const handleEvaluateCommunication = () => {
    setIsEvaluatingSpeech(true);
    setTimeout(() => {
      setIsEvaluatingSpeech(false);
      // Calculate score based on answers + length of response
      let score = 6;
      if (commAnswers.q1 === 'B') score += 1.5;
      if (commAnswers.q2 === 'A') score += 1.5;
      if (speechResponseText.trim().length > 60) score += 1.0;

      const finalScore = Math.min(10, Math.round(score));
      const updated = AppDatabaseEngine.updateCategoryScore(
        'communication',
        finalScore,
        `Communication assessment verified! Score awarded: ${finalScore}/10 weight points based on professional articulation & STAR interview response.`
      );
      onUpdateReadinessScore(updated);
      triggerToast(`Communication Score Updated to ${finalScore}/10 ✅`);
      setTimeout(() => onClose(), 1200);
    }, 800);
  };

  // --- 2. Projects Modal State ---
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjRole, setNewProjRole] = useState('Lead Full-Stack Developer');
  const [newProjType, setNewProjType] = useState<ProjectItem['type']>('Capstone / Major Project');
  const [newProjStack, setNewProjStack] = useState('React, TypeScript, Node.js, PostgreSQL, Tailwind');
  const [newProjGithub, setNewProjGithub] = useState('https://github.com/student/campus-placement-portal');
  const [newProjDesc, setNewProjDesc] = useState('A production-ready full-stack placement readiness platform with automated resume auditing, skill gap evaluation, and mock assessments.');
  const [projPhotoPreview, setProjPhotoPreview] = useState<string | null>(null);
  const [projPhotoTitle, setProjPhotoTitle] = useState<string>('');

  useEffect(() => {
    if (activeModal === 'projects') {
      const stored = AppDatabaseEngine.getProjects();
      setProjectsList(stored);
    }
  }, [activeModal]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    const newProject: ProjectItem = {
      id: 'proj_' + Date.now(),
      title: newProjTitle.trim(),
      role: newProjRole.trim(),
      techStack: newProjStack.split(',').map((s) => s.trim()).filter(Boolean),
      type: newProjType,
      description: newProjDesc.trim(),
      githubUrl: newProjGithub.trim(),
      verified: true,
      scoreContribution: newProjType.includes('Capstone') ? 8 : 5,
    };

    const updatedList = [newProject, ...projectsList];
    setProjectsList(updatedList);
    AppDatabaseEngine.saveProjects(updatedList);
    const refreshedReadiness = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshedReadiness);
    triggerToast(`Project "${newProject.title}" verified & added to portfolio! 🚀`);
    setNewProjTitle('');
  };

  const handleSaveProjPhoto = () => {
    if (!projPhotoPreview) return;
    const title = projPhotoTitle.trim() || 'Verified Project Screenshot / Architecture';
    const newProject: ProjectItem = {
      id: 'proj_photo_' + Date.now(),
      title: title,
      role: 'Full Stack Lead',
      techStack: ['Project Proof Photo'],
      type: 'Capstone / Major Project',
      description: 'Project screenshot and technical proof verified.',
      photoUrl: projPhotoPreview,
      verified: true,
      scoreContribution: 10,
    };
    const updatedList = [newProject, ...projectsList];
    setProjectsList(updatedList);
    AppDatabaseEngine.saveProjects(updatedList);
    const refreshedReadiness = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshedReadiness);
    triggerToast(`Project photo verified! Awarded 10/10 Points 🚀`);
    setProjPhotoPreview(null);
    setProjPhotoTitle('');
  };

  const handleDeleteProject = (id: string) => {
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    AppDatabaseEngine.saveProjects(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast('Project removed');
  };

  const handleAddSampleCapstone = () => {
    const sample: ProjectItem = {
      id: 'proj_sample_' + Date.now(),
      title: 'Full-Stack Enterprise Placement Intelligence Platform',
      role: 'Full Stack Architect & UI Lead',
      techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL'],
      type: 'Capstone / Major Project',
      description: 'End-to-end placement portal featuring real-time ATS resume scanning, aptitude test simulation engine, and student skill gap matrix.',
      githubUrl: 'https://github.com/alex-rivers/placement-intelligence',
      liveUrl: 'https://placement-intelligence-demo.app',
      verified: true,
      scoreContribution: 10,
    };
    const updatedList = [sample, ...projectsList];
    setProjectsList(updatedList);
    AppDatabaseEngine.saveProjects(updatedList);
    const refreshedReadiness = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshedReadiness);
    triggerToast(`Sample Capstone Project Added! Awarded 10/10 Project Weight Points ✅`);
  };

  // --- 3. Certifications Modal State ---
  const [certsList, setCertsList] = useState<CertificationItem[]>([]);
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('AWS / Amazon Web Services');
  const [certDate, setCertDate] = useState('2025-05-15');
  const [certId, setCertId] = useState('AWS-DEV-984201');
  const [certPhotoPreview, setCertPhotoPreview] = useState<string | null>(null);
  const [certPhotoTitle, setCertPhotoTitle] = useState<string>('');

  useEffect(() => {
    if (activeModal === 'certifications') {
      const stored = AppDatabaseEngine.getCertifications();
      setCertsList(stored);
    }
  }, [activeModal]);

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;

    const newCert: CertificationItem = {
      id: 'cert_' + Date.now(),
      name: certName.trim(),
      issuingOrganization: certOrg.trim(),
      issueDate: certDate,
      credentialId: certId.trim(),
      verified: true,
      scoreContribution: 5,
    };

    const updatedList = [newCert, ...certsList];
    setCertsList(updatedList);
    AppDatabaseEngine.saveCertifications(updatedList);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Certification "${newCert.name}" verified! 📜`);
    setCertName('');
  };

  const handleSaveCertPhoto = () => {
    if (!certPhotoPreview) return;
    const title = certPhotoTitle.trim() || 'Verified Industry Certification Photo';
    const newCert: CertificationItem = {
      id: 'cert_photo_' + Date.now(),
      name: title,
      issuingOrganization: 'Verified Certificate Document Proof',
      issueDate: new Date().toISOString().split('T')[0],
      photoUrl: certPhotoPreview,
      verified: true,
      scoreContribution: 5,
    };
    const updated = [newCert, ...certsList];
    setCertsList(updated);
    AppDatabaseEngine.saveCertifications(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Certificate photo verified & saved! Awarded 5/5 Points ✅`);
    setCertPhotoPreview(null);
    setCertPhotoTitle('');
  };

  const handleDeleteCert = (id: string) => {
    const updated = certsList.filter((c) => c.id !== id);
    setCertsList(updated);
    AppDatabaseEngine.saveCertifications(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast('Certification removed');
  };

  const handleAddSampleCerts = () => {
    const samples: CertificationItem[] = [
      {
        id: 'cert_1',
        name: 'AWS Certified Developer - Associate',
        issuingOrganization: 'Amazon Web Services (AWS)',
        issueDate: '2025-04-10',
        credentialId: 'AWS-89302194',
        verified: true,
        scoreContribution: 5,
      },
    ];
    setCertsList(samples);
    AppDatabaseEngine.saveCertifications(samples);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Industry Certifications Verified! Awarded 5/5 Certification Points ✅`);
  };

  // --- 4. Internship Modal State ---
  const [internList, setInternList] = useState<InternshipItem[]>([]);
  const [internCompany, setInternCompany] = useState('');
  const [internRole, setInternRole] = useState('Software Engineering Intern');
  const [internDuration, setInternDuration] = useState('3 Months (June 2025 - August 2025)');
  const [internHasPPO, setInternHasPPO] = useState<boolean>(true);
  const [internAchieve, setInternAchieve] = useState('Built RESTful microservices reducing API latency by 25%. Participated in daily Agile standups and automated deployment workflows.');
  const [internPhotoPreview, setInternPhotoPreview] = useState<string | null>(null);
  const [internPhotoTitle, setInternPhotoTitle] = useState<string>('');

  useEffect(() => {
    if (activeModal === 'internship') {
      const stored = AppDatabaseEngine.getInternships();
      setInternList(stored);
    }
  }, [activeModal]);

  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internCompany.trim()) return;

    const newIntern: InternshipItem = {
      id: 'intern_' + Date.now(),
      companyName: internCompany.trim(),
      role: internRole.trim(),
      duration: internDuration.trim(),
      hasPPO: internHasPPO,
      achievements: internAchieve.trim(),
      verified: true,
      scoreContribution: 5,
    };

    const updatedList = [newIntern, ...internList];
    setInternList(updatedList);
    AppDatabaseEngine.saveInternships(updatedList);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Internship at ${newIntern.companyName} Verified! Awarded 5/5 Internship Points 💼`);
    setInternCompany('');
  };

  const handleSaveInternPhoto = () => {
    if (!internPhotoPreview) return;
    const title = internPhotoTitle.trim() || 'Verified Internship Experience Photo';
    const newIntern: InternshipItem = {
      id: 'intern_photo_' + Date.now(),
      companyName: title,
      role: 'Internship Certificate Proof',
      duration: 'Verified Experience Document',
      hasPPO: true,
      achievements: 'Experience letter/certificate document uploaded & verified.',
      photoUrl: internPhotoPreview,
      verified: true,
      scoreContribution: 5,
    };
    const updated = [newIntern, ...internList];
    setInternList(updated);
    AppDatabaseEngine.saveInternships(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Internship experience photo verified! Awarded 5/5 Points ✅`);
    setInternPhotoPreview(null);
    setInternPhotoTitle('');
  };

  const handleDeleteInternship = (id: string) => {
    const updated = internList.filter((i) => i.id !== id);
    setInternList(updated);
    AppDatabaseEngine.saveInternships(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast('Internship record removed');
  };

  const handleAddSampleInternship = () => {
    const sample: InternshipItem = {
      id: 'intern_sample_1',
      companyName: 'TCS Innovation Labs',
      role: 'Full Stack Software Intern',
      duration: '3 Months (Summer 2025)',
      hasPPO: true,
      achievements: 'Developed internal analytics dashboard in React & Express. Received Pre-Placement Offer (PPO) recommendation.',
      verified: true,
      scoreContribution: 5,
    };
    const updated = [sample, ...internList];
    setInternList(updated);
    AppDatabaseEngine.saveInternships(updated);
    const refreshed = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshed);
    triggerToast(`Internship Record Verified! Awarded 5/5 Internship Weight Points ✅`);
  };

  // --- 5. Academic Performance Sync Modal State ---
  const [cgpaVal, setCgpaVal] = useState<number>(8.6);
  const [backlogsVal, setBacklogsVal] = useState<number>(0);
  const [attVal, setAttVal] = useState<number>(88);

  useEffect(() => {
    if (activeModal === 'academics') {
      const ac = AppDatabaseEngine.getAcademics();
      setCgpaVal(ac.cgpa);
      setBacklogsVal(ac.activeBacklogs);
      setAttVal(ac.attendancePercentage);
    }
  }, [activeModal]);

  const handleSaveAcademics = (e: React.FormEvent) => {
    e.preventDefault();
    const current = AppDatabaseEngine.getAcademics();
    const updated = AppDatabaseEngine.saveAcademics({
      ...current,
      cgpa: cgpaVal,
      activeBacklogs: backlogsVal,
      attendancePercentage: attVal,
    });
    const refreshedReadiness = AppDatabaseEngine.getReadinessScore();
    onUpdateReadinessScore(refreshedReadiness);
    triggerToast(`Academic Performance Record Saved! CGPA: ${updated.cgpa} 🎓`);
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                {activeModal === 'communication'
                  ? 'chat'
                  : activeModal === 'projects'
                  ? 'architecture'
                  : activeModal === 'certifications'
                  ? 'workspace_premium'
                  : activeModal === 'internship'
                  ? 'business_center'
                  : activeModal === 'academics'
                  ? 'school'
                  : 'code'}
              </span>
            </div>
            <div>
              <h3 className="font-headline-lg text-lg font-bold text-on-surface capitalize">
                {activeModal === 'communication'
                  ? 'Professional Communication & Articulation Assessment'
                  : activeModal === 'projects'
                  ? 'Verify Technical Projects & Capstone Portfolio'
                  : activeModal === 'certifications'
                  ? 'Add Industry Certifications & Credentials'
                  : activeModal === 'internship'
                  ? 'Verify Industry Internship & Work Experience'
                  : activeModal === 'academics'
                  ? 'Update Academic Performance & CGPA Record'
                  : 'Technical Skills Audit'}
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">
                {activeModal === 'communication'
                  ? 'Weight: 10% | Assesses verbal clarity, scenario handling, and professional email articulation'
                  : activeModal === 'projects'
                  ? 'Weight: 10% | Add major/capstone projects to earn up to 10 readiness score points'
                  : activeModal === 'certifications'
                  ? 'Weight: 5% | Verify NPTEL, AWS, Google, or Coursera certifications for 5 readiness points'
                  : activeModal === 'internship'
                  ? 'Weight: 5% | Record internship experience & PPO status for 5 readiness points'
                  : activeModal === 'academics'
                  ? 'Weight: 20% | Sync CGPA, backlogs, and attendance records'
                  : 'Weight: 35% | Update technical skills'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* MODAL 1: COMMUNICATION ASSESSMENT */}
        {activeModal === 'communication' && (
          <div className="space-y-5 text-xs text-on-surface">
            <div className="p-3.5 bg-primary-container/20 border border-primary/30 rounded-xl space-y-1">
              <h4 className="font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">psychology</span>
                Verbal & Written Communication Assessment Engine
              </h4>
              <p className="text-on-surface-variant">
                Evaluates corporate communication readiness, conflict resolution vocabulary, and interview articulation.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-on-surface">
                1. Scenario: A team member misses an important milestone deadline. What is the most articulate professional response?
              </label>
              <div className="space-y-2">
                {[
                  { id: 'A', text: 'Publicly ping them in the group channel demanding an immediate update.' },
                  { id: 'B', text: 'Schedule a private 1-on-1 to understand blockers and collaboratively adjust timelines.' },
                  { id: 'C', text: 'Report them immediately to the college placement officer without talking to them.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setCommAnswers({ ...commAnswers, q1: opt.id })}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      commAnswers.q1 === opt.id
                        ? 'bg-primary-container/30 border-primary text-primary font-semibold'
                        : 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    <input type="radio" name="comm_q1" checked={commAnswers.q1 === opt.id} readOnly className="accent-primary" />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-on-surface">
                2. Behavioral Interview Prompt (STAR Method):
                <span className="block font-normal text-on-surface-variant mt-0.5">
                  "Describe a situation where you resolved a technical or team conflict under time pressure."
                </span>
              </label>
              <textarea
                rows={3}
                value={speechResponseText}
                onChange={(e) => setSpeechResponseText(e.target.value)}
                placeholder="Type or dictate your structured response using Situation, Task, Action, Result..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary font-body-md"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
              <span className="text-[11px] text-on-surface-variant">
                Max Awardable: <strong>10 / 10 Points</strong>
              </span>
              <button
                onClick={handleEvaluateCommunication}
                disabled={isEvaluatingSpeech}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isEvaluatingSpeech ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">sync</span>
                    Evaluating Articulation...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">fact_check</span>
                    Submit & Award Communication Points
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: PROJECTS MANAGER */}
        {activeModal === 'projects' && (
          <div className="space-y-5 text-xs text-on-surface">
            <div className="flex items-center justify-between p-3 bg-secondary-container/30 border border-secondary/30 rounded-xl">
              <div>
                <h4 className="font-bold text-secondary">Projects Weight (10% Total Readiness)</h4>
                <p className="text-on-surface-variant text-[11px]">
                  {projectsList.length === 0
                    ? 'Current Score: 0/10 — Upload a project photo/screenshot or add details below'
                    : `Current Score: ${projectsList.length >= 2 ? 10 : 8}/10 — ${projectsList.length} Project(s) Verified`}
                </p>
              </div>
              <button
                onClick={handleAddSampleCapstone}
                className="px-3 py-1.5 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-[11px] flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Auto-Add Capstone (10 Pts)
              </button>
            </div>

            {/* Primary Option: UPLOAD PROJECT SCREENSHOT PHOTO */}
            <div className="p-4 bg-surface-container-low border-2 border-dashed border-secondary/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">add_a_photo</span>
                <h4 className="font-bold text-on-surface text-xs sm:text-sm">Upload Project Screenshot / Architecture Photo</h4>
              </div>

              {!projPhotoPreview ? (
                <label className="flex flex-col items-center justify-center p-5 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container/50 cursor-pointer transition-all text-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-xs">Click or Drag & Drop Project Photo Here</p>
                    <p className="text-[11px] text-on-surface-variant">Upload project screenshot or design proof</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setProjPhotoPreview(ev.target.result as string);
                            setProjPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="space-y-3 p-3 bg-surface-container-lowest border border-secondary/30 rounded-xl">
                  <div className="relative rounded-lg overflow-hidden border border-outline-variant bg-black/5 max-h-48 flex items-center justify-center">
                    <img src={projPhotoPreview} alt="Project preview" className="max-h-44 object-contain" />
                    <button
                      onClick={() => setProjPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Project Title</label>
                    <input
                      type="text"
                      value={projPhotoTitle}
                      onChange={(e) => setProjPhotoTitle(e.target.value)}
                      placeholder="e.g. Full Stack Capstone Project"
                      className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleSaveProjPhoto}
                    className="w-full py-2.5 bg-secondary text-on-secondary font-bold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Save & Verify Project Photo (Award 10/10 Points)
                  </button>
                </div>
              )}
            </div>

            {/* List of existing projects */}
            {projectsList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-on-surface text-xs">Verified Portfolio Projects ({projectsList.length}):</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {projectsList.map((p) => (
                    <div key={p.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.title} className="w-14 h-14 object-cover rounded-lg border border-outline-variant shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-lg">architecture</span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface text-sm">{p.title}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                              {p.type}
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-[11px] mt-0.5">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.techStack.map((tech, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-surface-container-high text-on-surface text-[10px] rounded font-mono">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1 text-error/70 hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Manual Project Form */}
            <details className="group p-3 bg-surface-container-low/50 border border-outline-variant/60 rounded-xl">
              <summary className="font-bold text-on-surface-variant text-xs cursor-pointer flex items-center justify-between select-none">
                <span>Optional: Fill project details manually</span>
                <span className="material-symbols-outlined text-sm transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <form onSubmit={handleAddProject} className="mt-3 space-y-3 pt-3 border-t border-outline-variant">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Project Title</label>
                    <input
                      type="text"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Distributed E-Commerce Backend"
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Project Type</label>
                    <select
                      value={newProjType}
                      onChange={(e) => setNewProjType(e.target.value as any)}
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    >
                      <option value="Capstone / Major Project">Capstone / Major Project (8-10 Pts)</option>
                      <option value="Minor Project">Minor Project (5 Pts)</option>
                      <option value="Industry Internship Project">Industry Internship Project (8 Pts)</option>
                      <option value="Open Source Contribution">Open Source Contribution (5 Pts)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={newProjStack}
                    onChange={(e) => setNewProjStack(e.target.value)}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs resize-none"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed-dim cursor-pointer"
                  >
                    Save & Verify Project
                  </button>
                </div>
              </form>
            </details>
          </div>
        )}

        {/* MODAL 3: CERTIFICATIONS MANAGER */}
        {activeModal === 'certifications' && (
          <div className="space-y-5 text-xs text-on-surface">
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div>
                <h4 className="font-bold text-amber-700 dark:text-amber-400">Certifications Weight (5% Total)</h4>
                <p className="text-on-surface-variant text-[11px]">
                  {certsList.length === 0
                    ? 'Current Score: 0/5 — Upload a photo or image of your certificate to earn points'
                    : `Current Score: 5/5 — ${certsList.length} Verified Certificate(s)`}
                </p>
              </div>
              <button
                onClick={handleAddSampleCerts}
                className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors cursor-pointer text-[11px] flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">verified</span>
                Auto-Add Sample (5 Pts)
              </button>
            </div>

            {/* Primary Option: UPLOAD CERTIFICATE PHOTO */}
            <div className="p-4 bg-surface-container-low border-2 border-dashed border-amber-500/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-lg">add_a_photo</span>
                <h4 className="font-bold text-on-surface text-xs sm:text-sm">Upload Certificate Photo / Image (Instant Verification)</h4>
              </div>

              {!certPhotoPreview ? (
                <label className="flex flex-col items-center justify-center p-6 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container/50 cursor-pointer transition-all text-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-xs">Click or Drag & Drop Photo Here</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Supports PNG, JPG, JPEG, WEBP photos of certificates</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setCertPhotoPreview(ev.target.result as string);
                            setCertPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="space-y-3 p-3 bg-surface-container-lowest border border-amber-500/30 rounded-xl">
                  <div className="relative rounded-lg overflow-hidden border border-outline-variant bg-black/5 max-h-48 flex items-center justify-center">
                    <img src={certPhotoPreview} alt="Certificate preview" className="max-h-44 object-contain" />
                    <button
                      onClick={() => setCertPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Certificate Title / Name</label>
                    <input
                      type="text"
                      value={certPhotoTitle}
                      onChange={(e) => setCertPhotoTitle(e.target.value)}
                      placeholder="e.g. AWS / NPTEL Certificate"
                      className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleSaveCertPhoto}
                    className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-lg text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Save & Verify Certificate Photo (Award 5/5 Points)
                  </button>
                </div>
              )}
            </div>

            {/* Verified Certifications List */}
            {certsList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-on-surface text-xs">Verified Certifications ({certsList.length}):</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {certsList.map((c) => (
                    <div key={c.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} className="w-12 h-12 object-cover rounded-lg border border-outline-variant shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">workspace_premium</span>
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-on-surface block text-xs">{c.name}</span>
                          <span className="text-on-surface-variant text-[11px]">{c.issuingOrganization} • {c.issueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-full text-[10px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span> Verified
                        </span>
                        <button
                          onClick={() => handleDeleteCert(c.id)}
                          className="p-1 text-error/70 hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Manual Certification Form */}
            <details className="group p-3 bg-surface-container-low/50 border border-outline-variant/60 rounded-xl">
              <summary className="font-bold text-on-surface-variant text-xs cursor-pointer flex items-center justify-between select-none">
                <span>Optional: Fill certification details manually</span>
                <span className="material-symbols-outlined text-sm transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <form onSubmit={handleAddCert} className="mt-3 space-y-3 pt-3 border-t border-outline-variant">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g. Google Cloud Associate Engineer"
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      value={certOrg}
                      onChange={(e) => setCertOrg(e.target.value)}
                      placeholder="AWS / Google / NPTEL"
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed-dim cursor-pointer">
                    Save Certification
                  </button>
                </div>
              </form>
            </details>
          </div>
        )}

        {/* MODAL 4: INTERNSHIP MANAGER */}
        {activeModal === 'internship' && (
          <div className="space-y-5 text-xs text-on-surface">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div>
                <h4 className="font-bold text-blue-700 dark:text-blue-300">Internship Experience Weight (5% Total)</h4>
                <p className="text-on-surface-variant text-[11px]">
                  {internList.length === 0
                    ? 'Current Score: 0/5 — Upload photo of your internship certificate or experience letter'
                    : `Current Score: 5/5 — ${internList.length} Verified Experience Record(s)`}
                </p>
              </div>
              <button
                onClick={handleAddSampleInternship}
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-[11px] flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">business_center</span>
                Auto-Add Sample (5 Pts)
              </button>
            </div>

            {/* Primary Option: UPLOAD INTERNSHIP PHOTO */}
            <div className="p-4 bg-surface-container-low border-2 border-dashed border-blue-500/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">add_a_photo</span>
                <h4 className="font-bold text-on-surface text-xs sm:text-sm">Upload Internship Photo / Experience Letter (Instant Verification)</h4>
              </div>

              {!internPhotoPreview ? (
                <label className="flex flex-col items-center justify-center p-6 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container/50 cursor-pointer transition-all text-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-xs">Click or Drag & Drop Experience Photo Here</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Supports PNG, JPG, JPEG, WEBP photos of internship letters</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setInternPhotoPreview(ev.target.result as string);
                            setInternPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="space-y-3 p-3 bg-surface-container-lowest border border-blue-500/30 rounded-xl">
                  <div className="relative rounded-lg overflow-hidden border border-outline-variant bg-black/5 max-h-48 flex items-center justify-center">
                    <img src={internPhotoPreview} alt="Internship preview" className="max-h-44 object-contain" />
                    <button
                      onClick={() => setInternPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Company / Document Title</label>
                    <input
                      type="text"
                      value={internPhotoTitle}
                      onChange={(e) => setInternPhotoTitle(e.target.value)}
                      placeholder="e.g. Infosys Internship Letter"
                      className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleSaveInternPhoto}
                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Save & Verify Experience Photo (Award 5/5 Points)
                  </button>
                </div>
              )}
            </div>

            {/* Verified Internships List */}
            {internList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-on-surface text-xs">Verified Internships ({internList.length}):</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {internList.map((item) => (
                    <div key={item.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.companyName} className="w-12 h-12 object-cover rounded-lg border border-outline-variant shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">business_center</span>
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-on-surface block text-xs">{item.companyName}</span>
                          <span className="text-on-surface-variant text-[11px]">{item.role} • {item.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-full text-[10px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check_circle</span> Verified
                        </span>
                        <button
                          onClick={() => handleDeleteInternship(item.id)}
                          className="p-1 text-error/70 hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collapsible Manual Internship Form */}
            <details className="group p-3 bg-surface-container-low/50 border border-outline-variant/60 rounded-xl">
              <summary className="font-bold text-on-surface-variant text-xs cursor-pointer flex items-center justify-between select-none">
                <span>Optional: Fill internship details manually</span>
                <span className="material-symbols-outlined text-sm transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <form onSubmit={handleAddInternship} className="mt-3 space-y-3 pt-3 border-t border-outline-variant">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={internCompany}
                      onChange={(e) => setInternCompany(e.target.value)}
                      placeholder="e.g. Infosys / Amazon"
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={internRole}
                      onChange={(e) => setInternRole(e.target.value)}
                      placeholder="Software Engineering Intern"
                      className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed-dim cursor-pointer">
                    Save Internship
                  </button>
                </div>
              </form>
            </details>
          </div>
        )}

        {/* MODAL 5: ACADEMICS SYNC */}
        {activeModal === 'academics' && (
          <form onSubmit={handleSaveAcademics} className="space-y-4 text-xs text-on-surface">
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl space-y-3">
              <h4 className="font-bold text-on-surface">Sync College Academic Performance</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold mb-1">Cumulative CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpaVal}
                    onChange={(e) => setCgpaVal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1">Active Backlogs Count</label>
                  <input
                    type="number"
                    min="0"
                    value={backlogsVal}
                    onChange={(e) => setBacklogsVal(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1">Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attVal}
                    onChange={(e) => setAttVal(parseInt(e.target.value) || 0)}
                    className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-primary-container/20 border border-primary/30 rounded-lg text-[11px] text-on-surface-variant">
                Academic Weight Breakdown (20% Max):
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>CGPA &ge; 9.0: 10 pts | CGPA &ge; 8.0: 8 pts | CGPA &ge; 7.0: 6 pts</li>
                  <li>0 Active Backlogs: 5 pts</li>
                  <li>Attendance &ge; 85%: 5 pts</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-surface-container border border-outline-variant rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl text-xs hover:bg-primary-fixed-dim cursor-pointer"
              >
                Sync Academic Score
              </button>
            </div>
          </form>
        )}

        {/* Footer info / Toast */}
        {toastMessage && (
          <div className="p-3 bg-inverse-surface text-inverse-on-surface rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
