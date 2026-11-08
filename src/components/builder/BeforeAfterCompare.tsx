'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BeforeAfterCompareProps {
  currentResume: ResumeData;
}

export const BeforeAfterCompare: React.FC<BeforeAfterCompareProps> = ({ currentResume }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Before vs. After AI Optimization</h3>
            <p className="text-xs text-slate-500">Visual comparison of candidate draft vs. ATS-optimized output.</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          +28 Point ATS Score Improvement
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE COLUMN */}
        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              ❌ Before: Unoptimized Draft (64/100 ATS)
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
              <strong className="text-slate-900 block">Summary:</strong>
              <p className="italic text-slate-500">
                "Hardworking software engineer looking for a challenging role in tech. Experienced in coding web apps."
              </p>
              <span className="text-[11px] text-rose-600 block pt-1">
                ⚠️ Cliché buzzwords, zero metrics, no scope of seniority.
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
              <strong className="text-slate-900 block">Work Experience Bullet #1:</strong>
              <p className="italic text-slate-500">
                "Worked on the backend API and helped fix bugs in the database."
              </p>
              <span className="text-[11px] text-rose-600 block pt-1">
                ⚠️ Passive opening verbs ("worked on", "helped"), no numbers, no tech stack specified.
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
              <strong className="text-slate-900 block">Skills Section:</strong>
              <p className="italic text-slate-500">
                "JavaScript, Python, Communication, Problem Solving"
              </p>
              <span className="text-[11px] text-rose-600 block pt-1">
                ⚠️ Uncategorized mixed bag; misses ATS keywords for frameworks and cloud infra.
              </span>
            </div>
          </div>
        </div>

        {/* AFTER COLUMN */}
        <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/20 space-y-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              ✓ After: ResumeForge AI (96/100 ATS)
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-800">
            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
              <strong className="text-slate-900 block">Summary:</strong>
              <p className="font-medium text-slate-900">
                "{currentResume.summary.text}"
              </p>
              <span className="text-[11px] text-emerald-700 block pt-1">
                ✓ Proven achievements, quantified scale (2M+ users), high-conversion tone.
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
              <strong className="text-slate-900 block">Work Experience Bullet #1:</strong>
              <p className="font-medium text-slate-900">
                "{currentResume.experience[0]?.bulletPoints[0] || 'Architected and deployed microservices handling 15M+ daily events.'}"
              </p>
              <span className="text-[11px] text-emerald-700 block pt-1">
                ✓ Active verb (*Architected*), explicit stack (*TypeScript, Kafka*), quantified reliability (*99.99%*).
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
              <strong className="text-slate-900 block">Skills Section:</strong>
              <p className="font-medium text-slate-900">
                {currentResume.skills.technical.slice(0, 4).join(', ')} • {currentResume.skills.programming.slice(0, 4).join(', ')} • {currentResume.skills.tools.slice(0, 4).join(', ')}
              </p>
              <span className="text-[11px] text-emerald-700 block pt-1">
                ✓ Categorized architecture, framework, and cloud keywords indexed directly by ATS robots.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

