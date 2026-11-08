'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { JobMatchResult } from '@/types/ai';
import { matchResumeWithJobDescription } from '@/lib/job-matcher';
import { JOB_DESCRIPTION_PRESETS } from '@/lib/constants';
import { 
  Target, CheckCircle2, XCircle, AlertCircle, Sparkles, 
  ArrowRight, FileText, Briefcase, Plus, Check
} from 'lucide-react';

interface JobMatcherPanelProps {
  resume: ResumeData;
  onOptimizeResume: (updatedResume: ResumeData) => void;
}

export const JobMatcherPanel: React.FC<JobMatcherPanelProps> = ({ resume, onOptimizeResume }) => {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [jobText, setJobText] = useState(JOB_DESCRIPTION_PRESETS[0].description);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(() => 
    matchResumeWithJobDescription(resume, JOB_DESCRIPTION_PRESETS[0].description, 'Senior Full Stack Engineer')
  );
  const [appliedSuggestions, setAppliedSuggestions] = useState<Record<number, boolean>>({});

  const handleRunMatch = () => {
    if (!jobText.trim()) return;
    const res = matchResumeWithJobDescription(resume, jobText, jobTitle);
    setMatchResult(res);
  };

  const loadPreset = (preset: typeof JOB_DESCRIPTION_PRESETS[0]) => {
    setJobTitle(preset.title);
    setJobText(preset.description);
    const res = matchResumeWithJobDescription(resume, preset.description, preset.title);
    setMatchResult(res);
  };

  const handleAddMissingSkill = (skill: string) => {
    // Add skill to technical skills if user possesses it
    const nextResume: ResumeData = JSON.parse(JSON.stringify(resume));
    if (!nextResume.skills.technical.includes(skill)) {
      nextResume.skills.technical.push(skill);
      onOptimizeResume(nextResume);
      // Re-run match
      setMatchResult(matchResumeWithJobDescription(nextResume, jobText, jobTitle));
    }
  };

  const handleApplyImprovement = (index: number, improvement: JobMatchResult['suggestedImprovements'][0]) => {
    const nextResume: ResumeData = JSON.parse(JSON.stringify(resume));
    if (improvement.section.includes('Summary')) {
      nextResume.summary.text = `${nextResume.summary.text} Proficient with modern tooling including ${matchResult?.missingKeywords.slice(0, 2).join(' and ')}.`;
    }
    onOptimizeResume(nextResume);
    setAppliedSuggestions(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Job Description Matching Agent</h2>
              <p className="text-xs text-slate-500">Benchmark your resume against specific job postings to maximize your ATS match rate.</p>
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Load Preset:</span>
          <div className="flex gap-1.5">
            {JOB_DESCRIPTION_PRESETS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                {p.title.split(' ')[1] || p.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Data Analyst"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="sm:w-2/3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Paste Job Description
            </label>
            <div className="relative">
              <textarea
                value={jobText}
                onChange={e => setJobText(e.target.value)}
                rows={4}
                placeholder="Paste the full job responsibilities and requirements here..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed font-mono"
              />
              <button
                onClick={handleRunMatch}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Analyze Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {matchResult && (
        <div className="space-y-6 pt-4 border-t border-slate-100">
          {/* Match Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
                  matchResult.matchPercentage >= 75 ? 'border-emerald-500 text-emerald-700' :
                  matchResult.matchPercentage >= 50 ? 'border-amber-500 text-amber-700' :
                  'border-rose-500 text-rose-700'
                } bg-white shadow-sm`}>
                  <span className="text-2xl font-black">{matchResult.matchPercentage}%</span>
                  <span className="text-[9px] font-bold uppercase">Match</span>
                </div>
              </div>

              <div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  matchResult.verdict === 'Strong Match' ? 'bg-emerald-100 text-emerald-800' :
                  matchResult.verdict === 'Moderate Match' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {matchResult.verdict}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Match for {matchResult.jobTitle}</h3>
                <p className="text-xs text-slate-500">
                  {matchResult.matchingKeywords.length} of {matchResult.matchingKeywords.length + matchResult.missingKeywords.length} core keywords verified on your resume.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-xs text-right">
              <strong>Tip:</strong> Aim for 80%+ match rate to guarantee passing automated recruiter screening filters.
            </div>
          </div>

          {/* Keywords Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Keywords */}
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matching Keywords ({matchResult.matchingKeywords.length})
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">Found in Resume</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchingKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-md text-xs font-medium shadow-2xs">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Missing Keywords ({matchResult.missingKeywords.length})
                </span>
                <span className="text-[11px] text-rose-700 font-medium">Click + to add if truthful</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddMissingSkill(kw)}
                    title="Add to your skills if you possess this capability"
                    className="group px-2 py-1 bg-white border border-rose-300 hover:border-blue-500 text-rose-800 hover:text-blue-700 rounded-md text-xs font-medium shadow-2xs transition flex items-center gap-1"
                  >
                    <span>{kw}</span>
                    <Plus className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gaps Analysis */}
          {(matchResult.skillsGap.length > 0 || matchResult.experienceGap.length > 0) && (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Identified Competency & Seniority Gaps
              </h4>
              <ul className="space-y-1 text-xs text-amber-950">
                {matchResult.skillsGap.slice(0, 3).map((gap, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>High priority technical requirement missing: <strong>{gap}</strong></span>
                  </li>
                ))}
                {matchResult.experienceGap.map((gap, i) => (
                  <li key={`exp-${i}`} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Targeted Improvements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tailored Resume Recommendations
            </h4>
            <div className="space-y-2.5">
              {matchResult.suggestedImprovements.map((imp, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{imp.section}: </span>
                    <span className="text-slate-600">{imp.suggestedContent}</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5 font-sans">Reason: {imp.reason}</span>
                  </div>

                  <button
                    onClick={() => handleApplyImprovement(idx, imp)}
                    disabled={appliedSuggestions[idx]}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs whitespace-nowrap transition flex items-center gap-1 ${
                      appliedSuggestions[idx]
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {appliedSuggestions[idx] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Resume
                      </>
                    ) : (
                      'Apply to Resume'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

