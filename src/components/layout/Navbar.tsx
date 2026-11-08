'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Download, FileText, Bot, Target, 
  BarChart3, Layout, Layers, User, ShieldCheck, Printer
} from 'lucide-react';
import { exportResumeToDocx } from '@/lib/export-docx';
import { exportResumeToPdf } from '@/lib/export-pdf';
import { ResumeData } from '@/types/resume';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  resume: ResumeData;
  atsScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, resume, atsScore = 88 }) => {
  const [exporting, setExporting] = React.useState(false);

  const handleDocxExport = async () => {
    setExporting(true);
    try {
      await exportResumeToDocx(resume);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handlePdfExport = async () => {
    setExporting(true);
    try {
      await exportResumeToPdf('resume-render-canvas', `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_ATS.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                  ResumeForge <span className="text-indigo-600 font-extrabold text-xs uppercase px-1.5 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">AI</span>
                </span>
                <span className="block text-[10px] text-slate-500 -mt-1 font-medium">ATS Career Consultant</span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Layers },
                { id: 'builder', label: 'Resume Builder', icon: FileText },
                { id: 'ai-agent', label: 'AI Agent', icon: Sparkles, badge: 'Fixes' },
                { id: 'ats-score', label: 'ATS Score', icon: BarChart3, badge: `${atsScore}/100` },
                { id: 'job-matcher', label: 'Job Matcher', icon: Target },
                { id: 'templates', label: '10 Templates', icon: Layout },
                { id: 'career-coach', label: 'Career Coach', icon: Bot },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Export Buttons & Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Export DOCX */}
            <button
              onClick={handleDocxExport}
              disabled={exporting}
              title="Download ATS-Formatted Microsoft Word (.docx)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>DOCX</span>
            </button>

            {/* Quick Export PDF */}
            <button
              onClick={handlePdfExport}
              disabled={exporting}
              title="Download Crisp Vector A4 PDF"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              title="Print Resume"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                AM
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

