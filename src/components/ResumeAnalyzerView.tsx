import React, { useState, useRef } from 'react';
import { NavTab, ResumeAnalysisResult } from '../types';
import { analyzeResumeClientSide, SAMPLE_RESUMES, TARGET_JOB_ROLES } from '../services/resumeAnalyzer';

interface ResumeAnalyzerViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<string>('Data Analyst');
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES[0].text);
  const [fileName, setFileName] = useState<string>(SAMPLE_RESUMES[0].fileName);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(() =>
    analyzeResumeClientSide(SAMPLE_RESUMES[0].text, SAMPLE_RESUMES[0].fileName, 'Data Analyst')
  );
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Candidate Rejection & Evaluation Decision State
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectCategory, setRejectCategory] = useState<string>('ATS Score below threshold (<75%)');
  const [rejectNotes, setRejectNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleConfirmReject = () => {
    if (!analysisResult) return;
    const nowStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updated: ResumeAnalysisResult = {
      ...analysisResult,
      decisionStatus: 'rejected',
      rejectionReason: rejectCategory,
      rejectionNotes: rejectNotes || `Resume did not pass initial ATS audit for ${selectedRole}.`,
      rejectedAt: nowStr,
    };
    setAnalysisResult(updated);
    try {
      localStorage.setItem(`resume_decision_${fileName}_${selectedRole}`, JSON.stringify({
        decisionStatus: 'rejected',
        rejectionReason: rejectCategory,
        rejectionNotes: rejectNotes,
        rejectedAt: nowStr,
      }));
    } catch (e) {
      console.error(e);
    }
    setShowRejectModal(false);
    triggerToast('Resume REJECTED — Decision & feedback logged successfully ❌');
  };

  const handleShortlistCandidate = () => {
    if (!analysisResult) return;
    const nowStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updated: ResumeAnalysisResult = {
      ...analysisResult,
      decisionStatus: 'accepted',
      rejectedAt: nowStr,
    };
    setAnalysisResult(updated);
    try {
      localStorage.setItem(`resume_decision_${fileName}_${selectedRole}`, JSON.stringify({
        decisionStatus: 'accepted',
      }));
    } catch (e) {
      console.error(e);
    }
    triggerToast('Candidate SHORTLISTED for interview process ✅');
  };

  const handleResetDecision = () => {
    if (!analysisResult) return;
    const updated: ResumeAnalysisResult = {
      ...analysisResult,
      decisionStatus: undefined,
      rejectionReason: undefined,
      rejectionNotes: undefined,
      rejectedAt: undefined,
    };
    setAnalysisResult(updated);
    try {
      localStorage.removeItem(`resume_decision_${fileName}_${selectedRole}`);
    } catch (e) {
      console.error(e);
    }
    triggerToast('Candidate evaluation decision reset to Pending Review 🔄');
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setIsAnalyzing(true);

    const reader = new FileReader();

    if (file.type === 'application/pdf' || file.type.includes('word')) {
      // For binary files, read as data URL or array buffer and extract filename
      reader.onload = async () => {
        const resultData = reader.result as string;
        await runAnalysis(file.name, `[Parsed content from ${file.name}]\n\nName: ${file.name.split('.')[0]}\nFile Size: ${(file.size / 1024).toFixed(1)} KB\nFormat: ${file.type}`, resultData, file.type);
      };
      reader.readAsDataURL(file);
    } else {
      // Text or Image
      reader.onload = async () => {
        const textContent = (reader.result as string) || '';
        setResumeText(textContent);
        await runAnalysis(file.name, textContent, undefined, file.type);
      };
      reader.readAsText(file);
    }
  };

  const runAnalysis = async (
    nameOfFile: string,
    rawText: string,
    base64Data?: string,
    mimeType?: string,
    overrideRole?: string
  ) => {
    setIsAnalyzing(true);
    const activeRole = overrideRole || selectedRole;
    try {
      // Try calling full-stack Express API route first
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: rawText,
          resumeBase64: base64Data ? base64Data.split(',')[1] : undefined,
          mimeType,
          targetRole: activeRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.useFallback && data.atsScore !== undefined) {
          setAnalysisResult({
            ...data,
            fileName: nameOfFile,
            analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          });
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (err) {
      console.log('Falling back to local rule engine:', err);
    }

    // Restore saved decision if available
    let storedDecision = null;
    try {
      const saved = localStorage.getItem(`resume_decision_${nameOfFile}_${activeRole}`);
      if (saved) storedDecision = JSON.parse(saved);
    } catch (e) {}

    // Client-side rule engine evaluation
    const fallbackData = analyzeResumeClientSide(rawText, nameOfFile, activeRole);
    if (storedDecision) {
      fallbackData.decisionStatus = storedDecision.decisionStatus;
      fallbackData.rejectionReason = storedDecision.rejectionReason;
      fallbackData.rejectionNotes = storedDecision.rejectionNotes;
      fallbackData.rejectedAt = storedDecision.rejectedAt;
    }
    setAnalysisResult(fallbackData);
    setIsAnalyzing(false);
  };

  const handleSelectSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.text);
    setFileName(sample.fileName);
    setSelectedRole(sample.role);
    runAnalysis(sample.fileName, sample.text);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1280px] mx-auto w-full pb-16">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">badge</span>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">
              AI Resume Analyzer & ATS Audit
            </h1>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Upload your resume to scan against Applicant Tracking Systems (ATS), verify keyword density, and identify critical placement skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('skill-gap')}
            className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl font-title-md text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">compare_arrows</span>
            Skill Gap Analyzer
          </button>
        </div>
      </div>

      {/* Target Role & Sample Switcher */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="font-title-md text-xs font-bold text-on-surface whitespace-nowrap">
            Target Placement Role:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => {
              const newRole = e.target.value;
              setSelectedRole(newRole);
              if (resumeText) runAnalysis(fileName, resumeText, undefined, undefined, newRole);
            }}
            className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl font-label-md text-xs font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
          >
            {TARGET_JOB_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pt-2 md:pt-0">
          <span className="font-label-sm text-[11px] font-semibold text-on-surface-variant shrink-0">
            Load Preset:
          </span>
          {SAMPLE_RESUMES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-xs font-semibold border transition-all shrink-0 ${
                fileName === sample.fileName
                  ? 'bg-primary text-on-primary border-primary shadow-2xs'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload Area & Analysis Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Resume Input (4 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${
              isDragOver
                ? 'border-primary bg-primary-container/20'
                : 'border-outline-variant bg-surface-container-low hover:bg-surface-container/60'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary-container/60 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">cloud_upload</span>
            </div>
            <h3 className="font-title-md text-sm font-bold text-on-surface">
              Upload Resume File
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1 max-w-xs">
              Drag and drop your PDF, DOCX, TXT, or Image file here, or browse from computer.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".pdf,.docx,.txt,.doc,image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md text-xs font-semibold hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              Browse Files
            </button>
          </div>

          {/* Raw Text Inspector */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="font-title-md text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg">description</span>
                Resume Raw Text Inspector
              </h3>
              <span className="font-label-sm text-[11px] text-on-surface-variant truncate max-w-[140px]">
                {fileName}
              </span>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
              }}
              rows={12}
              placeholder="Paste or edit resume text here to analyze..."
              className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-xs text-on-surface leading-relaxed outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={() => runAnalysis(fileName, resumeText)}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-secondary text-on-secondary font-title-md text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  Re-Analyze Text for {selectedRole}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Detailed ATS Results (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {isAnalyzing ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-2xs flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-full bg-primary-container text-primary flex items-center justify-center mb-4 animate-bounce">
                <span className="material-symbols-outlined text-3xl animate-spin">auto_awesome</span>
              </div>
              <h3 className="font-headline-lg text-lg font-bold text-on-surface">
                Auditing Resume for ATS Compliance...
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 max-w-sm">
                Parsing keywords, calculating action verb density, evaluating section structure, and cross-referencing against {selectedRole} placement requirements.
              </p>
            </div>
          ) : analysisResult ? (
            <>
              {/* Score Header Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant">
                  <div>
                    <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
                      ATS Audit Score Summary
                    </span>
                    <h2 className="font-headline-lg text-xl font-bold text-on-surface mt-0.5">
                      {analysisResult.fileName}
                    </h2>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">
                      Analyzed on {analysisResult.analyzedAt} for <strong className="text-on-surface">{analysisResult.targetRole}</strong>
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col items-center min-w-[120px] ${getScoreColor(analysisResult.atsScore)}`}>
                    <span className="font-headline-lg text-3xl font-extrabold leading-none">
                      {analysisResult.atsScore}
                    </span>
                    <span className="font-label-sm text-[11px] font-semibold mt-1">
                      / 100 ATS Rating
                    </span>
                  </div>
                </div>

                {/* Summary text */}
                <p className="font-body-md text-xs text-on-surface-variant mt-4 leading-relaxed bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60">
                  {analysisResult.summary}
                </p>

                {/* Sub-Metric Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold block">
                      Impact Verbs
                    </span>
                    <span className="font-headline-lg text-lg font-bold text-on-surface">
                      {analysisResult.categoryScores.impactVerbs}%
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold block">
                      Formatting
                    </span>
                    <span className="font-headline-lg text-lg font-bold text-on-surface">
                      {analysisResult.categoryScores.formattingReadability}%
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold block">
                      Skill Relevance
                    </span>
                    <span className="font-headline-lg text-lg font-bold text-on-surface">
                      {analysisResult.categoryScores.skillRelevance}%
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold block">
                      Role Match
                    </span>
                    <span className="font-headline-lg text-lg font-bold text-primary">
                      {analysisResult.targetRoleMatch}%
                    </span>
                  </div>
                </div>

                {/* Candidate Shortlist & Rejection Decision Panel */}
                <div className="mt-5 pt-4 border-t border-outline-variant/60">
                  {analysisResult.decisionStatus === 'rejected' ? (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-rose-600 text-2xl shrink-0">cancel</span>
                          <div>
                            <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                              Decision Logged
                            </span>
                            <h4 className="font-title-md text-sm font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                              RESUME REJECTED (Not Recommended for Placement Drive)
                            </h4>
                          </div>
                        </div>
                        {analysisResult.rejectedAt && (
                          <span className="font-label-sm text-[11px] font-semibold text-rose-600/90 shrink-0">
                            Rejected on {analysisResult.rejectedAt}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-on-surface space-y-1.5 pl-1 sm:pl-8">
                        {analysisResult.rejectionReason && (
                          <p>
                            <strong className="text-rose-700 dark:text-rose-400">Primary Rejection Reason:</strong>{' '}
                            {analysisResult.rejectionReason}
                          </p>
                        )}
                        {analysisResult.rejectionNotes && (
                          <p className="bg-surface-container-lowest/80 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-on-surface-variant italic">
                            "{analysisResult.rejectionNotes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 sm:pl-8">
                        <button
                          onClick={handleResetDecision}
                          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">undo</span>
                          Undo Rejection / Reset Decision
                        </button>
                        <button
                          onClick={() => {
                            setRejectNotes(analysisResult.rejectionNotes || '');
                            setRejectCategory(analysisResult.rejectionReason || 'ATS Score below threshold (<75%)');
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit Rejection Reason
                        </button>
                      </div>
                    </div>
                  ) : analysisResult.decisionStatus === 'accepted' ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                        <div>
                          <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                            Decision Logged
                          </span>
                          <h4 className="font-title-md text-sm font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
                            CANDIDATE SHORTLISTED FOR PLACEMENT INTERVIEWS
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetDecision}
                          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          Change Decision
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
                        <div>
                          <h4 className="font-title-md text-xs font-bold text-on-surface">Candidate Review & Shortlist Decision</h4>
                          <p className="font-body-md text-[11px] text-on-surface-variant">Review ATS findings above, then record official candidate decision for this placement drive.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const missingList = analysisResult.missingCriticalSkills.map((m) => m.skill).join(', ');
                            setRejectNotes(
                              `Resume rejected for ${selectedRole} position. ATS Rating: ${analysisResult.atsScore}/100. Missing competencies: ${missingList || 'Key requirements'}. Re-upload required.`
                            );
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-base">cancel</span>
                          Reject Resume
                        </button>

                        <button
                          onClick={handleShortlistCandidate}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-base">check_circle</span>
                          Shortlist Candidate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detected Skills vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted Skills */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col">
                  <h3 className="font-title-md text-base font-bold text-on-surface mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                      Detected Technical Skills
                    </span>
                    <span className="font-label-sm text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {analysisResult.detectedSkills.length} Found
                    </span>
                  </h3>

                  <div className="flex flex-wrap gap-1.5 flex-1 align-content-start">
                    {analysisResult.detectedSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-surface-container-low border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1"
                      >
                        {sk.skill}
                        {sk.level && (
                          <span className="text-[10px] text-on-surface-variant font-normal">
                            ({sk.level})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs flex flex-col">
                  <h3 className="font-title-md text-base font-bold text-on-surface mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-rose-600 text-lg">warning</span>
                      Missing Skills for {selectedRole}
                    </span>
                    <span className="font-label-sm text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                      {analysisResult.missingCriticalSkills.length} Gaps
                    </span>
                  </h3>

                  <div className="space-y-2 flex-1">
                    {analysisResult.missingCriticalSkills.map((ms, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs"
                      >
                        <div className="flex justify-between items-center font-bold text-rose-900">
                          <span>{ms.skill}</span>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-700 bg-rose-200/60 px-1.5 py-0.5 rounded">
                            {ms.importance} Priority
                          </span>
                        </div>
                        <p className="font-body-md text-[11px] text-rose-800 mt-1">
                          {ms.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Bullet Point Optimizer */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs">
                <h3 className="font-title-md text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_fix_high</span>
                  ATS Bullet Point Improvements
                </h3>

                <div className="space-y-3">
                  {analysisResult.sampleBulletFixes.map((fix, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-2 text-xs"
                    >
                      <div className="flex items-start gap-2 text-error">
                        <span className="material-symbols-outlined text-sm mt-0.5">remove_circle</span>
                        <div>
                          <strong className="font-semibold text-on-surface-variant">Original:</strong>{' '}
                          <span className="line-through text-on-surface-variant">{fix.original}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-emerald-700 font-semibold bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                        <span className="material-symbols-outlined text-sm mt-0.5">add_circle</span>
                        <div>
                          <strong className="text-emerald-900 font-bold">ATS Optimized:</strong>{' '}
                          <span>{fix.improved}</span>
                        </div>
                      </div>

                      <p className="font-body-md text-[11px] text-on-surface-variant pl-6 italic">
                        Why: {fix.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Key Improvements List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs">
                  <h3 className="font-title-md text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">thumb_up</span>
                    Resume Strengths
                  </h3>
                  <ul className="space-y-2 text-xs font-body-md text-on-surface-variant">
                    {analysisResult.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-base mt-0.5 shrink-0">
                          check
                        </span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xs">
                  <h3 className="font-title-md text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-600 text-lg">build</span>
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2 text-xs font-body-md text-on-surface-variant">
                    {analysisResult.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-base mt-0.5 shrink-0">
                          arrow_forward
                        </span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg border border-outline-variant text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <span className="material-symbols-outlined text-primary-fixed text-lg">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reject Resume Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">block</span>
                </div>
                <div>
                  <h3 className="font-headline-lg text-lg font-bold text-on-surface">Reject Resume Candidate</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">Log reason and candidate feedback for candidate rejection</p>
                </div>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-xs font-bold text-on-surface mb-1.5">
                  Primary Rejection Reason Category
                </label>
                <select
                  value={rejectCategory}
                  onChange={(e) => setRejectCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface font-semibold outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="ATS Score below threshold (<75%)">ATS Score below minimum threshold (&lt;75%)</option>
                  <option value={`Missing Critical Technical Skills for ${selectedRole}`}>
                    Missing Critical Technical Skills for {selectedRole}
                  </option>
                  <option value="Weak Impact Verbs & Lack of Quantified Achievements">
                    Weak Impact Verbs & Lack of Quantified Achievements
                  </option>
                  <option value="Formatting / Contact Details / Readability Issues">
                    Formatting / Contact Details / Readability Issues
                  </option>
                  <option value="Other / Custom Reason">Other / Custom Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-xs font-bold text-on-surface mb-1.5">
                  Detailed Rejection Feedback & Improvement Notes
                </label>
                <textarea
                  rows={4}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Provide constructive feedback for the candidate explaining why the resume was rejected and what to fix..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-rose-500 resize-none font-body-md"
                />
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <span className="material-symbols-outlined text-base mt-0.5 shrink-0">warning</span>
                <p>
                  Rejecting this candidate flags their resume as non-compliant for <strong>{selectedRole}</strong>. The candidate will see feedback notes to revise bullet points.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                Confirm Resume Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
