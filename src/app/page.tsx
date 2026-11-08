'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { storage } from '@/lib/storage';
import { calculateATSScore } from '@/lib/ats-scorer';
import { INITIAL_RESUME } from '@/lib/constants';
import { Navbar } from '@/components/layout/Navbar';
import { LandingPage } from '@/components/landing/LandingPage';
import { MainDashboard } from '@/components/dashboard/MainDashboard';
import { ResumeBuilderWorkspace } from '@/components/builder/ResumeBuilderWorkspace';
import { CareerCoachPanel } from '@/components/career-coach/CareerCoachPanel';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = storage.getCurrentResume();
    if (saved) {
      setResume(saved);
    }
  }, []);

  // Calculate live ATS score
  const atsAnalysis = useMemo(() => calculateATSScore(resume), [resume]);

  const handleUpdateResume = (updated: ResumeData) => {
    setResume(updated);
    storage.saveCurrentResume(updated);
  };

  const handleSelectResume = (selected: ResumeData) => {
    setResume(selected);
    storage.saveCurrentResume(selected);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-bold text-sm">
          Loading ResumeForge AI...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        resume={resume}
        atsScore={atsAnalysis.overallScore}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartBuilding={() => setCurrentTab('builder')}
            onAnalyzeResume={() => setCurrentTab('ats-score')}
          />
        )}

        {currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MainDashboard
              currentResume={resume}
              onSelectResume={handleSelectResume}
              onNavigateTab={setCurrentTab}
              atsScore={atsAnalysis.overallScore}
            />
          </div>
        )}

        {currentTab === 'builder' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="wizard"
            />
          </div>
        )}

        {currentTab === 'ai-agent' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="ai-agent"
            />
          </div>
        )}

        {currentTab === 'ats-score' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="ats-score"
            />
          </div>
        )}

        {currentTab === 'job-matcher' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="job-matcher"
            />
          </div>
        )}

        {currentTab === 'templates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="templates"
            />
          </div>
        )}

        {currentTab === 'career-coach' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CareerCoachPanel
              resume={resume}
              onUpdateResume={handleUpdateResume}
            />
          </div>
        )}
      </main>
    </div>
  );
}

