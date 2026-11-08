'use client';

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, 
  BarChart3, Layout, Download, ChevronDown, ChevronUp,
  FileText, Check, Wand2
} from 'lucide-react';
import { TEMPLATE_CONFIGS } from '@/lib/constants';

interface LandingPageProps {
  onStartBuilding: () => void;
  onExploreTemplates: () => void;
  onImproveResume: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartBuilding, 
  onExploreTemplates, 
  onImproveResume 
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What makes ResumeForge AI resumes genuinely ATS-friendly?',
      a: 'Unlike graphic design templates with double columns, unreadable text boxes, and complex graphics that crash parsers, ResumeForge AI templates are engineered to comply 100% with Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever, iCIMS). We enforce linear single-column hierarchies, standard section headers, clean typography, and parsable date formats.'
    },
    {
      q: 'Does the Resume AI Agent invent fake experiences or metrics?',
      a: 'Strictly NO. The Resume AI Agent operates under strict factual integrity: it NEVER invents degrees, employers, or fabricated performance metrics. It reframes your authentic tasks into high-converting achievement statements using strong active verbs and flags where you can insert genuine metrics.'
    },
    {
      q: 'How does the ATS Score calculation work?',
      a: 'Our proprietary 100-point scoring algorithm evaluates 7 critical dimensions: ATS Formatting (20 pts), Keyword Optimization (25 pts), Skills Relevance (15 pts), Work Experience Quality (15 pts), Professional Summary (10 pts), Education & Certifications (5 pts), and Grammar & Readability (10 pts).'
    },
    {
      q: 'Can I export to both PDF and Microsoft Word (.docx)?',
      a: 'Yes! You can download high-resolution vector A4 PDFs or native Microsoft Word (.docx) documents with one click. Both formats preserve clean, recruiter-approved typography and formatting.'
    },
    {
      q: 'Can the AI tailor my resume if I provide a job description?',
      a: 'Yes! Inside the Resume AI Agent or Resume Editor, you can paste the target job description. The AI analyzes the requirements and helps you authentically emphasize matching skills and keywords in your summary and experience bullet points without inventing qualifications.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI-Powered ATS Resume Builder</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Build an ATS-Friendly Resume <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                  With AI.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Create, edit, improve, and format your resume with an intelligent AI Resume Agent. Review structured improvements, accept changes with one click, and download recruiter-approved PDF and DOCX files.
              </p>

              {/* Primary Actions: Create My Resume, Explore Templates, Improve My Resume */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onStartBuilding}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create My Resume</span>
                </button>

                <button
                  onClick={onExploreTemplates}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <Layout className="w-4 h-4 text-cyan-600" />
                  <span>Explore Templates</span>
                </button>

                <button
                  onClick={onImproveResume}
                  className="px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Improve My Resume</span>
                </button>
              </div>

              {/* Quality Checklist */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Single-Column ATS Gold Standard
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Fictional Experience Hallucination
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant PDF & DOCX Downloads
                </span>
              </div>
            </div>

            {/* Right Column: Realistic Live Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 transform hover:-translate-y-1 transition-all duration-300">
                {/* Score Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-slate-900 text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>96/100 ATS Score</span>
                </div>

                {/* Simulated Mini Resume */}
                <div className="space-y-3 font-sans text-left border-b pb-4 border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Alex Morgan</h3>
                      <p className="text-xs font-bold text-indigo-600">Senior Full Stack Engineer</p>
                    </div>
                    <span className="text-[10px] text-slate-400">San Francisco, CA</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                    Results-driven Senior Engineer with 6+ years experience scaling SaaS platforms to 2M+ users and cutting query latency by 42%.
                  </p>
                </div>

                {/* Experience snippet */}
                <div className="pt-3 space-y-2 text-left">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>CloudScale Technologies</span>
                    <span className="text-slate-400 text-[10px]">2022 – Present</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                    <li>Architected distributed streaming pipeline handling 15M+ daily events.</li>
                    <li>Trimmed monthly AWS expenditures by $35,000 using serverless.</li>
                  </ul>
                </div>

                {/* Verified ATS pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Workday & Greenhouse Verified
                  </span>
                  <button onClick={onStartBuilding} className="text-indigo-600 font-bold hover:underline">
                    Use This Template →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Resume Creation Workflow</h2>
            <p className="text-3xl font-extrabold text-slate-900">From Draft to ATS-Ready in 3 Steps</p>
            <p className="text-sm text-slate-500">Every tool is dedicated exclusively to building stronger resumes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Enter Details or Upload</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fill out the structured 8-step wizard or upload an existing PDF/DOCX to import your experience, education, and skills.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Resume AI Agent Edits</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instruct the AI to rewrite experience, upgrade action verbs, and format sections. Review before & after changes and accept with 1 click.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Format & Export</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select from 10 ATS-optimized templates, adjust typography and spacing, and download crisp vector PDF and Word DOCX formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 10 PROFESSIONAL TEMPLATES */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recruiter-Tested Designs</h2>
            <p className="text-3xl font-extrabold text-slate-900">10 Professional ATS Templates</p>
            <p className="text-sm text-slate-500">
              Single-column, text-based templates engineered to pass ATS screening. Switch anytime without data loss.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TEMPLATE_CONFIGS.map(t => (
              <div
                key={t.id}
                className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-subtle hover:border-indigo-400 hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.category}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{t.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-emerald-700">
                  <span>{t.atsScoreRating}</span>
                  <button onClick={onStartBuilding} className="text-indigo-600 font-bold hover:underline">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQS */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Common Questions</h2>
            <p className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50/60"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">ResumeForge AI</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Empowering students, freshers, and experienced professionals to create career-defining resumes.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-medium">
              <button onClick={onStartBuilding} className="hover:text-white transition">Resume Builder</button>
              <button onClick={onExploreTemplates} className="hover:text-white transition">Templates</button>
              <button onClick={onImproveResume} className="hover:text-white transition">AI Agent</button>
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</span>
            <span>Dedicated ATS Resume Builder.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
