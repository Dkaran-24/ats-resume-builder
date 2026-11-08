'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeIssue } from '@/types/ai';
import { analyzeResumeForIssues } from '@/lib/ai-agent';
import { 
  Sparkles, AlertCircle, CheckCircle2, XCircle, ArrowRight, 
  HelpCircle, ShieldCheck, Zap, RefreshCw, Undo2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIAgentPanelProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export const AIAgentPanel: React.FC<AIAgentPanelProps> = ({ resume, onUpdateResume }) => {
  const [issues, setIssues] = useState<ResumeIssue[]>(() => analyzeResumeForIssues(resume));
  const [filter, setFilter] = useState<'all' | 'grammar' | 'quality' | 'ats' | 'impact'>('all');
  const [lastFixUndo, setLastFixUndo] = useState<{ issueId: string; prevResume: ResumeData } | null>(null);

  const handleRefresh = () => {
    const freshIssues = analyzeResumeForIssues(resume);
    setIssues(freshIssues);
  };

  const applyFix = (issue: ResumeIssue) => {
    const prevResume = JSON.parse(JSON.stringify(resume));
    const nextResume: ResumeData = JSON.parse(JSON.stringify(resume));

    // Handle Summary Fix
    if (issue.fieldKey === 'summary.text') {
      nextResume.summary.text = issue.improvedVersion;
    } 
    // Handle Experience Bullet Point Fix
    else if (issue.itemIndex !== undefined && issue.bulletIndex !== undefined) {
      if (nextResume.experience[issue.itemIndex]?.bulletPoints[issue.bulletIndex] !== undefined) {
        nextResume.experience[issue.itemIndex].bulletPoints[issue.bulletIndex] = issue.improvedVersion;
      }
    } 
    // Handle Contact LinkedIn
    else if (issue.id === 'issue-contact-linkedin') {
      nextResume.personalInfo.linkedin = 'linkedin.com/in/alexmorgandev';
    } 
    // Handle missing skills
    else if (issue.id === 'issue-skills-missing') {
      nextResume.skills.technical = ['System Architecture', 'Cloud Services', 'RESTful APIs', 'Microservices', 'Distributed Systems'];
    }

    onUpdateResume(nextResume);
    setLastFixUndo({ issueId: issue.id, prevResume });

    // Mark issue as applied
    setIssues(prev => prev.map(item => item.id === issue.id ? { ...item, status: 'applied' } : item));

    // Trigger celebration if low pending count
    const remaining = issues.filter(i => i.id !== issue.id && i.status === 'pending').length;
    if (remaining === 0) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const ignoreIssue = (issueId: string) => {
    setIssues(prev => prev.map(item => item.id === issueId ? { ...item, status: 'ignored' } : item));
  };

  const undoLastFix = () => {
    if (!lastFixUndo) return;
    onUpdateResume(lastFixUndo.prevResume);
    setIssues(prev => prev.map(item => item.id === lastFixUndo.issueId ? { ...item, status: 'pending' } : item));
    setLastFixUndo(null);
  };

  const filteredIssues = issues.filter(i => {
    if (filter === 'all') return true;
    return i.category === filter;
  });

  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const appliedCount = issues.filter(i => i.status === 'applied').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Resume Improvement Agent</h2>
              <p className="text-xs text-slate-500">Autonomous inspection for grammar, action verbs, impact metrics, and ATS compatibility.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastFixUndo && (
            <button
              onClick={undoLastFix}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Undo2 className="w-3.5 h-3.5" /> Undo Last Fix
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-scan Resume
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-xs font-medium text-slate-500">Issues Found</div>
          <div className="text-xl font-bold text-slate-800">{issues.length}</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <div className="text-xs font-medium text-amber-700">Pending Review</div>
          <div className="text-xl font-bold text-amber-800">{pendingCount}</div>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
          <div className="text-xs font-medium text-emerald-700">Fixes Applied</div>
          <div className="text-xl font-bold text-emerald-800">{appliedCount}</div>
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
          <div className="text-xs font-medium text-indigo-700">Integrity Check</div>
          <div className="text-sm font-bold text-indigo-900 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Human Approval
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(['all', 'grammar', 'quality', 'ats', 'impact'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full font-medium capitalize transition ${
              filter === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'ats' ? 'ATS Compatibility' : cat}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No issues found in this category!</h3>
            <p className="text-xs text-slate-500 mt-1">Your resume meets high quality and ATS standards here.</p>
          </div>
        ) : (
          filteredIssues.map(issue => {
            const isApplied = issue.status === 'applied';
            const isIgnored = issue.status === 'ignored';

            return (
              <div 
                key={issue.id}
                className={`p-5 rounded-xl border transition-all ${
                  isApplied
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                    : isIgnored
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : issue.severity === 'critical'
                    ? 'bg-rose-50/30 border-rose-200'
                    : 'bg-white border-slate-200 hover:border-indigo-200 shadow-subtle'
                }`}
              >
                {/* Issue Tag and Section */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                      issue.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                      issue.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.category} • {issue.severity}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{issue.section}</span>
                  </div>

                  {isApplied && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Applied
                    </span>
                  )}
                  {isIgnored && (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      Ignored
                    </span>
                  )}
                </div>

                {/* Problem Description */}
                <div className="mb-3 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {issue.problemIdentified}
                  </h4>
                  <p className="text-xs text-slate-600 pl-5.5">
                    <strong className="text-slate-700">Why it's a problem:</strong> {issue.whyProblem}
                  </p>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                  <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg text-xs">
                    <div className="font-semibold text-red-800 mb-1">Original Sentence:</div>
                    <p className="text-slate-700 italic">"{issue.originalSentence}"</p>
                  </div>

                  <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg text-xs">
                    <div className="font-semibold text-emerald-800 mb-1">AI Improved Version:</div>
                    <p className="text-slate-900 font-medium">"{issue.improvedVersion}"</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-100 mb-3">
                  <strong className="text-slate-700">Explanation of Improvement: </strong>
                  {issue.explanation}
                </div>

                {/* Action Buttons */}
                {!isApplied && !isIgnored && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => ignoreIssue(issue.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    >
                      Ignore Suggestion
                    </button>
                    <button
                      onClick={() => applyFix(issue)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" /> Apply Fix
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

