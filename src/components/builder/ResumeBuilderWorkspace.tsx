'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeRenderer } from '@/components/templates/ResumeRenderer';
import { ResumeWizard } from '@/components/wizard/ResumeWizard';
import { ResumeAIAgentPanel } from '@/components/ai-agent/ResumeAIAgentPanel';
import { ATSScorePanel } from '@/components/ats-analyzer/ATSScorePanel';
import { TemplateSelector } from '@/components/formatting/TemplateSelector';
import { BeforeAfterCompare } from '@/components/builder/BeforeAfterCompare';
import { ActionVerbsBank } from '@/components/tools/ActionVerbsBank';
import { BulletPointChecker } from '@/components/tools/BulletPointChecker';
import { exportResumeToDocx } from '@/lib/export-docx';
import { exportResumeToPdf } from '@/lib/export-pdf';
import { 
  FileText, Sparkles, BarChart3, Layout, Download, 
  ZoomIn, ZoomOut, SplitSquareVertical, BookOpen, Zap
} from 'lucide-react';

interface ResumeBuilderWorkspaceProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  activeSubTab?: 'wizard' | 'ai-agent' | 'ats-score' | 'templates' | 'compare' | 'verbs';
}

export const ResumeBuilderWorkspace: React.FC<ResumeBuilderWorkspaceProps> = ({
  resume,
  onChange,
  activeSubTab = 'wizard'
}) => {
  const [subTab, setSubTab] = useState<'wizard' | 'ai-agent' | 'ats-score' | 'templates' | 'compare' | 'verbs'>(activeSubTab);
  const [zoom, setZoom] = useState<number>(0.85);
  const [exporting, setExporting] = useState<boolean>(false);

  const handleDocxExport = async () => {
    setExporting(true);
    try {
      await exportResumeToDocx(resume);
    } finally {
      setExporting(false);
    }
  };

  const handlePdfExport = async () => {
    setExporting(true);
    try {
      await exportResumeToPdf('resume-render-canvas', `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_ATS.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Workspace Subnav Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {/* Left Subtabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'wizard', label: 'Editor Wizard', icon: FileText },
            { id: 'ai-agent', label: 'Resume AI Agent', icon: Sparkles, badge: 'Real AI' },
            { id: 'ats-score', label: 'ATS Score Analyzer', icon: BarChart3 },
            { id: 'templates', label: '10 Templates', icon: Layout },
            { id: 'compare', label: 'Before & After Diff', icon: SplitSquareVertical },
            { id: 'verbs', label: 'Action Verbs Lab', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
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
        </div>

        {/* Right Tools: Zoom, Exports */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs text-slate-600">
            <button
              onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center font-semibold text-[11px]">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.2, prev + 0.1))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Export DOCX */}
          <button
            onClick={handleDocxExport}
            disabled={exporting}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>DOCX</span>
          </button>

          {/* Quick Export PDF */}
          <button
            onClick={handlePdfExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Interactive Tool */}
        <div className="lg:col-span-6 space-y-4">
          {subTab === 'wizard' && (
            <ResumeWizard resume={resume} onChange={onChange} />
          )}

          {subTab === 'ai-agent' && (
            <ResumeAIAgentPanel resume={resume} onUpdateResume={onChange} />
          )}

          {subTab === 'ats-score' && (
            <ATSScorePanel resume={resume} onApplyAction={() => setSubTab('wizard')} />
          )}

          {subTab === 'templates' && (
            <TemplateSelector resume={resume} onChange={onChange} />
          )}

          {subTab === 'compare' && (
            <BeforeAfterCompare currentResume={resume} />
          )}

          {subTab === 'verbs' && (
            <div className="space-y-4">
              <BulletPointChecker />
              <ActionVerbsBank />
            </div>
          )}
        </div>

        {/* Right Column: Live A4 Resume Preview */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="bg-slate-200/60 p-4 sm:p-6 rounded-2xl border border-slate-300/80 overflow-x-auto flex justify-center shadow-inner min-h-[600px] max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="w-full flex justify-center">
              <ResumeRenderer resume={resume} scale={zoom} id="resume-render-canvas" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
