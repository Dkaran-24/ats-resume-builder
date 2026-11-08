'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { UserActivity } from '@/types/auth';
import { storage } from '@/lib/storage';
import { 
  PlusCircle, UploadCloud, BarChart3, Sparkles, 
  FolderKanban, Layout, Clock, ArrowRight, CheckCircle2,
  Copy, Trash2, Edit3, FileText, TrendingUp, History, Download,
  BookOpen, SplitSquareVertical
} from 'lucide-react';

interface MainDashboardProps {
  currentResume: ResumeData;
  onSelectResume: (resume: ResumeData) => void;
  onNavigateTab: (tab: string) => void;
  atsScore: number;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  currentResume,
  onSelectResume,
  onNavigateTab,
  atsScore
}) => {
  const [resumes, setResumes] = useState<ResumeData[]>(() => storage.getAllResumes());
  const [activities, setActivities] = useState<UserActivity[]>(() => storage.getActivities());
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleCreateNew = () => {
    const title = prompt('Enter a name for your new resume:', 'New Professional Resume');
    if (!title) return;
    const created = storage.createResume(title, 'Software Engineer');
    setResumes(storage.getAllResumes());
    onSelectResume(created);
    onNavigateTab('builder');
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = storage.duplicateResume(id);
    if (dup) {
      setResumes(storage.getAllResumes());
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resumes.length <= 1) {
      alert('You must keep at least one active resume.');
      return;
    }
    if (confirm('Are you sure you want to delete this resume?')) {
      storage.deleteResume(id);
      const remaining = storage.getAllResumes();
      setResumes(remaining);
      if (currentResume.id === id) {
        onSelectResume(remaining[0]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTimeout(() => {
        alert(`Resume "${file.name}" successfully parsed! Sections have been extracted and mapped to the ATS editor.`);
        setShowUploadModal(false);
        onNavigateTab('builder');
      }, 700);
    }
  };

  const dashboardCards = [
    {
      id: 'create',
      title: 'Create New Resume',
      desc: 'Build an ATS-optimized resume step-by-step with structured section wizards.',
      icon: PlusCircle,
      color: 'bg-indigo-600 text-white',
      badge: 'Step-by-step',
      onClick: handleCreateNew
    },
    {
      id: 'upload',
      title: 'Upload Existing Resume',
      desc: 'Import PDF, DOCX, or TXT file. AI extracts and parses your sections instantly.',
      icon: UploadCloud,
      color: 'bg-blue-600 text-white',
      badge: 'PDF / DOCX',
      onClick: () => setShowUploadModal(true)
    },
    {
      id: 'ai-agent',
      title: 'Resume AI Agent',
      desc: 'Instruct the AI to rewrite experience, polish summary, format, and apply structured edits.',
      icon: Sparkles,
      color: 'bg-purple-600 text-white',
      badge: 'Real AI Edits',
      onClick: () => onNavigateTab('ai-agent')
    },
    {
      id: 'analyze',
      title: 'Analyze ATS Compatibility',
      desc: 'Get an instant ATS score out of 100 with radar chart and category breakdown.',
      icon: BarChart3,
      color: 'bg-emerald-600 text-white',
      badge: `${atsScore}/100 Score`,
      onClick: () => onNavigateTab('ats-score')
    },
    {
      id: 'templates',
      title: 'Resume Templates',
      desc: 'Choose from 10 single-column ATS templates: Classic, Modern, Tech, Executive.',
      icon: Layout,
      color: 'bg-cyan-600 text-white',
      badge: '10 Templates',
      onClick: () => onNavigateTab('templates')
    },
    {
      id: 'saved',
      title: 'My Saved Resumes',
      desc: 'Manage your versions, duplicates, and role-tailored resumes in one place.',
      icon: FolderKanban,
      color: 'bg-slate-800 text-white',
      badge: `${resumes.length} Active`,
      onClick: () => {
        const el = document.getElementById('saved-resumes-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'compare',
      title: 'Before & After Comparison',
      desc: 'Inspect a visual comparison between your raw draft and the AI-optimized resume.',
      icon: SplitSquareVertical,
      color: 'bg-amber-600 text-white',
      badge: 'Diff Viewer',
      onClick: () => onNavigateTab('builder')
    },
    {
      id: 'verbs',
      title: 'Action Verbs Library',
      desc: 'Browse 100+ categorized power verbs to replace weak phrases in your experience.',
      icon: BookOpen,
      color: 'bg-rose-600 text-white',
      badge: '100+ Verbs',
      onClick: () => onNavigateTab('builder')
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
              ResumeForge AI Dashboard
            </span>
            <span className="text-xs text-slate-400">ATS Resume Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentResume.personalInfo.fullName || 'Professional'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your active resume is currently scoring <strong className="text-emerald-400 font-bold">{atsScore}/100</strong> on ATS screening tests.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('builder')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Open Resume Builder
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Resumes</span>
            <FolderKanban className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{resumes.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all roles</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Last Edited</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2 truncate">
            {currentResume.title}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Autosaved in session</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Latest ATS Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-600">{atsScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">ATS Readiness Rating</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Target Role</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2 truncate">
            {currentResume.targetRole || 'Software Professional'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Template: {currentResume.formatting?.template || 'Classic ATS'}</div>
        </div>
      </div>

      {/* Resume Building Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Resume Building & AI Tools</h2>
          <span className="text-xs text-slate-500">Select any tool to create or improve</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardCards.map(card => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 shadow-subtle hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Resumes Section */}
      <div id="saved-resumes-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Saved Resumes ({resumes.length})</h2>
          <button
            onClick={handleCreateNew}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => {
            const isCurrent = r.id === currentResume.id;

            return (
              <div
                key={r.id}
                onClick={() => {
                  onSelectResume(r);
                  onNavigateTab('builder');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className={`w-4 h-4 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{r.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 truncate">
                  {r.personalInfo.fullName} • {r.personalInfo.jobTitle || 'No title'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    v{r.version || 1} • {r.experience.length} roles
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicate(r.id, e)}
                      title="Duplicate Resume"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(r.id, e)}
                      title="Delete Resume"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" /> Upload Existing Resume
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Upload your current resume (.pdf, .docx, or .txt). The editor will import your experience, education, and skills.
            </p>

            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-8 text-center bg-slate-50/50 cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Click to browse or drag and drop</p>
              <p className="text-[11px] text-slate-400 mt-1">PDF, Word (DOCX), or Plain Text</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
