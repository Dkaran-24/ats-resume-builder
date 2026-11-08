'use client';

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Star, 
  BarChart3, Target, Bot, Layout, Download, ChevronDown, 
  FileText, Zap, Award, Layers, Check, ChevronUp
} from 'lucide-react';
import { TEMPLATE_CONFIGS } from '@/lib/constants';

interface LandingPageProps {
  onStartBuilding: () => void;
  onAnalyzeResume: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartBuilding, onAnalyzeResume }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What makes ResumeForge AI genuinely ATS-friendly?',
      a: 'Unlike typical graphic design templates with double columns, unreadable text boxes, and complex graphics, ResumeForge AI templates are engineered to comply 100% with modern Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever, iCIMS). We enforce linear single-column hierarchies, standard section headers, clean typography, and parsable date formats.'
    },
    {
      q: 'Does the AI invent or hallucinate fake experiences?',
      a: 'Strictly NO. ResumeForge AI operates under an ethical career consultation model: it NEVER invents degrees, companies, or fabricated performance metrics. It reframes your authentic tasks into high-converting bullet points using active verbs and industry-standard phrasing, and flags where you should insert your genuine metrics.'
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
      q: 'Can I tailor my resume for multiple different job applications?',
      a: 'Absolutely. You can duplicate your master resume, paste any target job description into our Job Matcher agent, and optimize each version specifically to hit 80%+ match rate on that company’s keywords.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen AI Career Consultant & ATS Builder</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Build an ATS-Friendly Resume <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                  That Gets Noticed.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Create, analyze, optimize, and improve your resume with your personal AI career assistant. Land 3x more interviews with recruiter-tested templates and 1-click ATS fixes.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onStartBuilding}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Build My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onAnalyzeResume}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Analyze My Resume (Free ATS Score)</span>
                </button>
              </div>

              {/* Social Proof Checklist */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Single-Column ATS Gold Standard
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Fake Experience Hallucination
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant PDF & DOCX Downloads
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Live Preview Card */}
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
                    Results-driven Senior Engineer with 6+ years experience scaling SaaS platforms to 2M+ users and cutting latency by 42%.
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">How It Works</h2>
            <p className="text-3xl font-extrabold text-slate-900">From Blank Page to Interview in 3 Steps</p>
            <p className="text-sm text-slate-500">Our automated career consultant guides you through every step of the hiring journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Enter or Upload Details</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Start from scratch with our structured 8-step wizard or upload an existing PDF/DOCX to auto-extract your work history.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Resume Agent Inspection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our agent checks for passive verbs, grammar errors, missing metrics, and ATS compatibility with 1-click fixes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Match & Export</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Benchmark against job descriptions to reach 85%+ compatibility, then download crisp vector PDF and Word DOCX formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI RESUME ANALYSIS & ATS OPTIMIZATION */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Calibrated 100-Point ATS Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Stop Guessing Why You Get Screened Out.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Applicant Tracking Systems reject over 75% of qualified resumes before human eyes ever see them. ResumeForge AI simulates real enterprise parsers to grade your resume on 7 core dimensions.
              </p>

              <div className="space-y-3">
                {[
                  { title: 'ATS Formatting & Single-Column Layout', pts: '20 Points' },
                  { title: 'Keyword Optimization & Natural Density', pts: '25 Points' },
                  { title: 'Skills Relevance & Deep Categorization', pts: '15 Points' },
                  { title: 'Work Experience Quality & Google X-Y-Z Metrics', pts: '15 Points' },
                  { title: 'Professional Executive Summary Impact', pts: '10 Points' },
                  { title: 'Education & Verified Certifications', pts: '5 Points' },
                  { title: 'Grammar, Action Verbs & Readability', pts: '10 Points' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {item.title}
                    </span>
                    <span className="font-semibold text-slate-500">{item.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">ATS Score Simulator</div>
                  <div className="text-2xl font-black mt-1">94 / 100 Score</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold rounded-full">
                  Tier 1 Pass
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Action Verb Upgrade:</strong> Replaced passive "Responsible for backend" with "Spearheaded distributed microservices architecture".
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Quantifiable Metrics:</strong> Injected verified metrics formula (42% latency cut, $35k cloud savings).
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Parsable Date Ranges:</strong> Standardized multi-date chronology for frictionless Workday indexing.
                  </div>
                </div>
              </div>

              <button
                onClick={onAnalyzeResume}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs transition shadow-sm"
              >
                Scan Your Resume Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROFESSIONAL TEMPLATES SHOWCASE */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recruiter-Tested Designs</h2>
            <p className="text-3xl font-extrabold text-slate-900">10 Professional Templates</p>
            <p className="text-sm text-slate-500">
              Switch between templates at any point with 1 click without losing a single character of your data.
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

      {/* 5. FAQS */}
      <section className="py-20 bg-white border-b border-slate-100">
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

      {/* 6. FOOTER */}
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
              <button onClick={onAnalyzeResume} className="hover:text-white transition">ATS Scanner</button>
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition">Contact Us</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</span>
            <span>Designed for ATS Compatibility (Workday, Taleo, Greenhouse, Lever).</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

