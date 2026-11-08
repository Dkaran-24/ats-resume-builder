'use client';

import React, { useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { calculateATSScore } from '@/lib/ats-scorer';
import { 
  CheckCircle, AlertTriangle, ArrowUpRight, TrendingUp,
  FileCheck2, Sparkles, AlertCircle, Info, ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ATSScorePanelProps {
  resume: ResumeData;
  onApplyAction?: (actionTitle: string) => void;
}

export const ATSScorePanel: React.FC<ATSScorePanelProps> = ({ resume, onApplyAction }) => {
  const analysis = useMemo(() => calculateATSScore(resume), [resume]);

  const { overallScore, breakdown, scoreGrade, strengths, weaknesses, missingKeywords, identifiedKeywords, recommendedImprovements, priorityActionPlan, disclaimer } = analysis;

  const chartData = [
    { subject: 'Formatting', score: breakdown.atsFormatting, max: 20, pct: (breakdown.atsFormatting / 20) * 100 },
    { subject: 'Keywords', score: breakdown.keywordOptimization, max: 25, pct: (breakdown.keywordOptimization / 25) * 100 },
    { subject: 'Skills', score: breakdown.skillsRelevance, max: 15, pct: (breakdown.skillsRelevance / 15) * 100 },
    { subject: 'Experience', score: breakdown.workExperienceQuality, max: 15, pct: (breakdown.workExperienceQuality / 15) * 100 },
    { subject: 'Summary', score: breakdown.professionalSummary, max: 10, pct: (breakdown.professionalSummary / 10) * 100 },
    { subject: 'Edu/Certs', score: breakdown.educationCertifications, max: 5, pct: (breakdown.educationCertifications / 5) * 100 },
    { subject: 'Readability', score: breakdown.grammarReadability, max: 10, pct: (breakdown.grammarReadability / 10) * 100 },
  ];

  const scoreColor = overallScore >= 85 ? 'text-emerald-600' : overallScore >= 70 ? 'text-indigo-600' : overallScore >= 50 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = overallScore >= 85 ? 'bg-emerald-50 border-emerald-200' : overallScore >= 70 ? 'bg-indigo-50 border-indigo-200' : overallScore >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
      {/* Top Banner / Overall Score */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border border-slate-200">
        <div className="flex items-center gap-5">
          <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 ${scoreBg} shadow-inner`}>
            <span className={`text-4xl font-black ${scoreColor}`}>{overallScore}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">out of 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                overallScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 
                overallScore >= 70 ? 'bg-indigo-100 text-indigo-800' : 
                'bg-amber-100 text-amber-800'
              }`}>
                {scoreGrade}
              </span>
              <span className="text-xs text-slate-400">ATS Parsing Engine v2.4</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">ATS Resume Compatibility Score</h2>
            <p className="text-xs text-slate-600 max-w-lg mt-0.5">
              Based on algorithmic screening criteria used by modern Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS).
            </p>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-center">
          <div>
            <div className="text-xs text-slate-500">Strengths</div>
            <div className="text-lg font-bold text-emerald-600">{strengths.length}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Weaknesses</div>
            <div className="text-lg font-bold text-amber-600">{weaknesses.length}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Action Items</div>
            <div className="text-lg font-bold text-indigo-600">{priorityActionPlan.length}</div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Category-wise Scores List */}
        <div className="space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Detailed Category Breakdown</h3>
          
          {/* 1. ATS Formatting */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>ATS Formatting & Structure</span>
              <span>{breakdown.atsFormatting} / 20 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${(breakdown.atsFormatting / 20) * 100}%` }} />
            </div>
          </div>

          {/* 2. Keyword Optimization */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Keyword Optimization & Density</span>
              <span>{breakdown.keywordOptimization} / 25 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(breakdown.keywordOptimization / 25) * 100}%` }} />
            </div>
          </div>

          {/* 3. Skills Relevance */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Skills Relevance & Categorization</span>
              <span>{breakdown.skillsRelevance} / 15 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full transition-all duration-500" style={{ width: `${(breakdown.skillsRelevance / 15) * 100}%` }} />
            </div>
          </div>

          {/* 4. Work Experience Quality */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Work Experience Quality & Metrics</span>
              <span>{breakdown.workExperienceQuality} / 15 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${(breakdown.workExperienceQuality / 15) * 100}%` }} />
            </div>
          </div>

          {/* 5. Professional Summary */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Professional Summary Impact</span>
              <span>{breakdown.professionalSummary} / 10 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(breakdown.professionalSummary / 10) * 100}%` }} />
            </div>
          </div>

          {/* 6. Education & Certs */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Education & Certifications</span>
              <span>{breakdown.educationCertifications} / 5 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${(breakdown.educationCertifications / 5) * 100}%` }} />
            </div>
          </div>

          {/* 7. Grammar & Readability */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Grammar, Action Verbs & Readability</span>
              <span>{breakdown.grammarReadability} / 10 pts</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${(breakdown.grammarReadability / 10) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Visual Radar Profile */}
        <div className="h-64 sm:h-72 w-full flex items-center justify-center p-2 bg-slate-50/50 rounded-xl border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="ATS Compatibility" dataKey="pct" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Action Plan */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Priority-Based Action Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {priorityActionPlan.map((plan, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 shadow-subtle transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    plan.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {plan.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-emerald-600">{plan.estimatedImpact}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{plan.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{plan.description}</p>
              </div>

              {onApplyAction && (
                <button
                  onClick={() => onApplyAction(plan.title)}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Apply in Editor <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        {/* Strengths */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Key Strengths ({strengths.length})
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas for Improvement ({weaknesses.length})
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                <span className="text-amber-600 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keywords detected & missing */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">ATS Keyword Analysis</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-emerald-700 block mb-1">Identified Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {identifiedKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-medium">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-rose-700 block mb-1">Missing / Recommended Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium">
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Transparency Notice: </strong>
          {disclaimer}
        </p>
      </div>
    </div>
  );
};

