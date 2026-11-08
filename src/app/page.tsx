'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { UserProfile } from '@/types/auth';
import { storage } from '@/lib/storage';
import { calculateATSScore } from '@/lib/ats-scorer';
import { INITIAL_RESUME } from '@/lib/constants';
import { Navbar } from '@/components/layout/Navbar';
import { LandingPage } from '@/components/landing/LandingPage';
import { MainDashboard } from '@/components/dashboard/MainDashboard';
import { ResumeBuilderWorkspace } from '@/components/builder/ResumeBuilderWorkspace';
import { AuthModal } from '@/components/auth/AuthModal';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storage.getUserProfile());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = storage.getCurrentResume();
    if (saved) {
      setResume(saved);
    }
    const prof = storage.getUserProfile();
    if (prof) {
      setUserProfile(prof);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
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
            onExploreTemplates={() => setCurrentTab('templates')}
            onImproveResume={() => setCurrentTab('ai-agent')}
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

        {currentTab === 'templates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ResumeBuilderWorkspace
              resume={resume}
              onChange={handleUpdateResume}
              activeSubTab="templates"
            />
          </div>
        )}
      </main>

      {/* Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={userProfile}
        onUserUpdate={setUserProfile}
      />
    </div>
  );
}
