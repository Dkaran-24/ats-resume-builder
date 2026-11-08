'use client';

import React, { useState } from 'react';
import { ResumeData, SummaryTone, WorkExperience, Education, Project, Certification, LanguageItem } from '@/types/resume';
import { generateImprovedBullet, generateSummaryAI } from '@/lib/ai-agent';
import { 
  User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2, 
  Award, Plus, Trash2, Sparkles, Check, ChevronRight, ChevronLeft,
  Globe, Linkedin, Github, Mail, Phone, MapPin, Zap
} from 'lucide-react';

interface ResumeWizardProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

const WIZARD_STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Summary', icon: FileText },
  { id: 3, name: 'Work Experience', icon: Briefcase },
  { id: 4, name: 'Education', icon: GraduationCap },
  { id: 5, name: 'Skills', icon: Wrench },
  { id: 6, name: 'Projects', icon: FolderGit2 },
  { id: 7, name: 'Certifications', icon: Award },
  { id: 8, name: 'Additional Sections', icon: Plus },
];

export const ResumeWizard: React.FC<ResumeWizardProps> = ({ resume, onChange }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Helper updater
  const updateResume = (updater: (prev: ResumeData) => ResumeData) => {
    const updated = updater(JSON.parse(JSON.stringify(resume)));
    onChange(updated);
  };

  // Step 1: Personal Info
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], val: string) => {
    updateResume(prev => {
      prev.personalInfo[field] = val;
      return prev;
    });
  };

  // Step 2: Summary Generator
  const handleGenerateSummary = (tone: SummaryTone) => {
    const generated = generateSummaryAI(
      resume.personalInfo.jobTitle || 'Software Engineer',
      tone,
      5,
      [...resume.skills.technical, ...resume.skills.frameworks]
    );
    updateResume(prev => {
      prev.summary.tone = tone;
      prev.summary.text = generated;
      return prev;
    });
  };

  // Step 3: Work Experience
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '2022-01',
      endDate: 'Present',
      current: true,
      bulletPoints: ['Spearheaded development of core web application modules, increasing user engagement by 25%.'],
      technologies: ['TypeScript', 'React', 'AWS'],
      achievements: []
    };
    updateResume(prev => {
      prev.experience.unshift(newExp);
      return prev;
    });
  };

  const removeExperience = (idx: number) => {
    updateResume(prev => {
      prev.experience.splice(idx, 1);
      return prev;
    });
  };

  const updateExpField = (idx: number, field: keyof WorkExperience, val: any) => {
    updateResume(prev => {
      (prev.experience[idx] as any)[field] = val;
      return prev;
    });
  };

  const addExpBullet = (expIdx: number) => {
    updateResume(prev => {
      prev.experience[expIdx].bulletPoints.push('Spearheaded key engineering initiatives that streamlined system throughput by 30%.');
      return prev;
    });
  };

  const updateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    updateResume(prev => {
      prev.experience[expIdx].bulletPoints[bulletIdx] = val;
      return prev;
    });
  };

  const enhanceExpBullet = (expIdx: number, bulletIdx: number) => {
    const currentText = resume.experience[expIdx].bulletPoints[bulletIdx];
    const improved = generateImprovedBullet(currentText, resume.personalInfo.jobTitle);
    updateExpBullet(expIdx, bulletIdx, improved);
  };

  const removeExpBullet = (expIdx: number, bulletIdx: number) => {
    updateResume(prev => {
      prev.experience[expIdx].bulletPoints.splice(bulletIdx, 1);
      return prev;
    });
  };

  // Step 4: Education
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: 'Bachelor of Science',
      fieldOfStudy: '',
      startDate: '2018',
      endDate: '2022',
      current: false,
      gpa: '3.8 / 4.0',
      coursework: []
    };
    updateResume(prev => {
      prev.education.push(newEdu);
      return prev;
    });
  };

  const removeEducation = (idx: number) => {
    updateResume(prev => {
      prev.education.splice(idx, 1);
      return prev;
    });
  };

  // Step 5: Skills Tag helper
  const addSkillTag = (category: keyof ResumeData['skills'], skillName: string) => {
    if (!skillName.trim()) return;
    updateResume(prev => {
      if (!prev.skills[category].includes(skillName.trim())) {
        prev.skills[category].push(skillName.trim());
      }
      return prev;
    });
  };

  const removeSkillTag = (category: keyof ResumeData['skills'], skillIdx: number) => {
    updateResume(prev => {
      prev.skills[category].splice(skillIdx, 1);
      return prev;
    });
  };

  // Step 6: Projects
  const addProject = () => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: 'New High-Impact Project',
      description: 'Full-stack application engineered with modern cloud microservices.',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      bulletPoints: ['Engineered responsive web client and RESTful API backend handling 10k+ requests/sec.'],
      githubUrl: 'https://github.com/username/project',
      liveUrl: 'https://demo.project.dev'
    };
    updateResume(prev => {
      prev.projects.push(newProj);
      return prev;
    });
  };

  // Step 7: Certifications
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      name: 'Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023-01',
      credentialUrl: ''
    };
    updateResume(prev => {
      prev.certifications.push(newCert);
      return prev;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Steps Horizontal Bar */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {WIZARD_STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-slate-200/80 text-slate-800 hover:bg-slate-300/80'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.name}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 flex-1 space-y-6">
        {/* STEP 1: PERSONAL INFO */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 1: Personal & Contact Information</h3>
              <p className="text-xs text-slate-500">Provide clean, accurate contact information for ATS parsers and hiring recruiters.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={e => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Target Title *</label>
                <input
                  type="text"
                  value={resume.personalInfo.jobTitle}
                  onChange={e => updatePersonalInfo('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address *
                </label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={e => updatePersonalInfo('email', e.target.value)}
                  placeholder="alex.morgan@email.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number *
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.phone}
                  onChange={e => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location (City, State / Remote)
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={e => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA (or Remote)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.linkedin}
                  onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-800" /> GitHub URL
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.github}
                  onChange={e => updatePersonalInfo('github', e.target.value)}
                  placeholder="github.com/username"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-teal-600" /> Portfolio Website
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.portfolio}
                  onChange={e => updatePersonalInfo('portfolio', e.target.value)}
                  placeholder="yourportfolio.io"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL SUMMARY */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Professional Summary</h3>
              <p className="text-xs text-slate-500">Capture the recruiter’s attention in 3-4 impactful sentences highlighting your value proposition.</p>
            </div>

            {/* AI Generator Bar */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI Summary Assistant
                </span>
                <span className="text-[11px] text-indigo-600 font-medium">Select Tone & Generate</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Professional', 'Technical', 'Leadership', 'Entry-Level'] as SummaryTone[]).map(tone => (
                  <button
                    key={tone}
                    onClick={() => handleGenerateSummary(tone)}
                    className="px-3 py-1.5 bg-white border border-indigo-200 hover:border-indigo-500 text-indigo-900 hover:text-indigo-600 text-xs font-semibold rounded-lg shadow-2xs transition"
                  >
                    Generate {tone} Tone
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Summary Text</label>
              <textarea
                rows={5}
                value={resume.summary.text}
                onChange={e => updateResume(prev => { prev.summary.text = e.target.value; return prev; })}
                placeholder="Results-driven professional with 5+ years of experience..."
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Recommended: 40 - 90 words</span>
                <span>{resume.summary.text ? resume.summary.text.trim().split(/\s+/).length : 0} words</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WORK EXPERIENCE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 3: Work Experience</h3>
                <p className="text-xs text-slate-500">Document your employment history with achievement-oriented bullet points.</p>
              </div>
              <button
                onClick={addExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Role
              </button>
            </div>

            <div className="space-y-6">
              {resume.experience.map((exp, expIdx) => (
                <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Position #{expIdx + 1}
                    </span>
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Role
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => updateExpField(expIdx, 'company', e.target.value)}
                        placeholder="e.g. CloudScale Tech"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={e => updateExpField(expIdx, 'position', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => updateExpField(expIdx, 'location', e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => updateExpField(expIdx, 'startDate', e.target.value)}
                        placeholder="2022-03"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={e => updateExpField(expIdx, 'endDate', e.target.value)}
                        placeholder="Present"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id={`curr_${exp.id}`}
                        checked={exp.current}
                        onChange={e => updateExpField(expIdx, 'current', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`curr_${exp.id}`} className="text-xs font-medium text-slate-700">
                        I currently work here
                      </label>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Bullet Points (Action Verb + Scope + Metric)
                      </label>
                      <button
                        onClick={() => addExpBullet(expIdx)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bulletPoints.map((bp, bidx) => (
                      <div key={bidx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bp}
                          onChange={e => updateExpBullet(expIdx, bidx, e.target.value)}
                          className="flex-1 p-2 text-xs border border-slate-300 rounded-md bg-white outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                        />
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => enhanceExpBullet(expIdx, bidx)}
                            title="Enhance with AI action verbs & metrics"
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Zap className="w-3.5 h-3.5 text-indigo-600" />
                          </button>
                          <button
                            onClick={() => removeExpBullet(expIdx, bidx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: EDUCATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 4: Education & Academic Credentials</h3>
                <p className="text-xs text-slate-500">Add colleges, degrees, honors, and coursework.</p>
              </div>
              <button
                onClick={addEducation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            <div className="space-y-4">
              {resume.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">Degree #{eduIdx + 1}</span>
                    <button onClick={() => removeEducation(eduIdx)} className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => updateResume(prev => { prev.education[eduIdx].institution = e.target.value; return prev; })}
                        placeholder="University of California, Berkeley"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Major</label>
                      <input
                        type="text"
                        value={`${edu.degree} in ${edu.fieldOfStudy}`}
                        onChange={e => {
                          const parts = e.target.value.split(' in ');
                          updateResume(prev => {
                            prev.education[eduIdx].degree = parts[0] || 'Bachelor';
                            prev.education[eduIdx].fieldOfStudy = parts[1] || '';
                            return prev;
                          });
                        }}
                        placeholder="Bachelor of Science in Computer Science"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year / Dates</label>
                      <input
                        type="text"
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={e => {
                          const parts = e.target.value.split(' - ');
                          updateResume(prev => {
                            prev.education[eduIdx].startDate = parts[0] || '2018';
                            prev.education[eduIdx].endDate = parts[1] || '2022';
                            return prev;
                          });
                        }}
                        placeholder="2018 - 2022"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={e => updateResume(prev => { prev.education[eduIdx].gpa = e.target.value; return prev; })}
                        placeholder="3.8 / 4.0, Magna Cum Laude"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: SKILLS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 5: Categorized Skills</h3>
              <p className="text-xs text-slate-500">Categorize your technical tools and domain proficiencies for optimal ATS indexing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['technical', 'programming', 'frameworks', 'tools', 'soft', 'domain'] as const).map(catKey => {
                const list = resume.skills[catKey] || [];
                const catTitles: Record<string, string> = {
                  technical: 'Technical & Systems',
                  programming: 'Programming Languages',
                  frameworks: 'Frameworks & Libraries',
                  tools: 'Tools & DevOps Platforms',
                  soft: 'Soft & Leadership Skills',
                  domain: 'Domain Knowledge'
                };

                return (
                  <div key={catKey} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {catTitles[catKey]} ({list.length})
                    </label>

                    <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-white rounded-lg border border-slate-200">
                      {list.map((skill, sidx) => (
                        <span key={sidx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded text-xs font-medium">
                          {skill}
                          <button onClick={() => removeSkillTag(catKey, sidx)} className="hover:text-rose-600">×</button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`input_${catKey}`}
                        placeholder={`Add ${catTitles[catKey]}...`}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkillTag(catKey, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                      <button
                        onClick={() => {
                          const el = document.getElementById(`input_${catKey}`) as HTMLInputElement;
                          if (el && el.value) {
                            addSkillTag(catKey, el.value);
                            el.value = '';
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: PROJECTS */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 6: Featured Projects</h3>
                <p className="text-xs text-slate-500">Showcase your practical engineering applications, open-source work, and key results.</p>
              </div>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {resume.projects.map((proj, pidx) => (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">Project #{pidx + 1}</span>
                    <button
                      onClick={() => updateResume(prev => { prev.projects.splice(pidx, 1); return prev; })}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => updateResume(prev => { prev.projects[pidx].name = e.target.value; return prev; })}
                        placeholder="OmniStream Realtime Engine"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Live Demo / GitHub Link</label>
                      <input
                        type="text"
                        value={proj.githubUrl || proj.liveUrl || ''}
                        onChange={e => updateResume(prev => { prev.projects[pidx].githubUrl = e.target.value; return prev; })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Summary Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={e => updateResume(prev => { prev.projects[pidx].description = e.target.value; return prev; })}
                      className="w-full p-2 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: CERTIFICATIONS */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 7: Certifications & Licenses</h3>
                <p className="text-xs text-slate-500">Provide verifiable credentials that validate your skill mastery.</p>
              </div>
              <button
                onClick={addCertification}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {resume.certifications.map((cert, cidx) => (
                <div key={cert.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={e => updateResume(prev => { prev.certifications[cidx].name = e.target.value; return prev; })}
                      placeholder="Certification Name"
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={e => updateResume(prev => { prev.certifications[cidx].issuer = e.target.value; return prev; })}
                      placeholder="Issuer (e.g. AWS, Google)"
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={cert.issueDate}
                      onChange={e => updateResume(prev => { prev.certifications[cidx].issueDate = e.target.value; return prev; })}
                      placeholder="Issue Date (e.g. 2023-04)"
                      className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                  </div>
                  <button
                    onClick={() => updateResume(prev => { prev.certifications.splice(cidx, 1); return prev; })}
                    className="text-slate-400 hover:text-rose-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: ADDITIONAL SECTIONS */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 8: Additional Custom Sections</h3>
              <p className="text-xs text-slate-500">Add awards, publications, volunteer experience, and languages.</p>
            </div>

            {/* Languages */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Languages</span>
                <button
                  onClick={() => updateResume(prev => {
                    prev.additionalSections.languages.push({ id: `lang_${Date.now()}`, language: 'French', proficiency: 'Proficient' });
                    return prev;
                  })}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  + Add Language
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {resume.additionalSections.languages.map((lang, lidx) => (
                  <div key={lang.id} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                    <input
                      type="text"
                      value={lang.language}
                      onChange={e => updateResume(prev => { prev.additionalSections.languages[lidx].language = e.target.value; return prev; })}
                      className="w-20 font-bold outline-none border-b border-dashed"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={e => updateResume(prev => { (prev.additionalSections.languages[lidx] as any).proficiency = e.target.value; return prev; })}
                      className="text-slate-500 text-xs bg-transparent outline-none"
                    >
                      <option>Native</option>
                      <option>Fluent</option>
                      <option>Proficient</option>
                      <option>Intermediate</option>
                      <option>Basic</option>
                    </select>
                    <button
                      onClick={() => updateResume(prev => { prev.additionalSections.languages.splice(lidx, 1); return prev; })}
                      className="text-slate-300 hover:text-rose-600 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Honors & Awards */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Honors & Awards</span>
                <button
                  onClick={() => updateResume(prev => {
                    prev.additionalSections.awards.push({ id: `award_${Date.now()}`, title: 'Employee of the Year', organization: 'Company Inc', date: '2023' });
                    return prev;
                  })}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  + Add Award
                </button>
              </div>

              <div className="space-y-2">
                {resume.additionalSections.awards.map((aw, awIdx) => (
                  <div key={aw.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aw.title}
                      onChange={e => updateResume(prev => { prev.additionalSections.awards[awIdx].title = e.target.value; return prev; })}
                      placeholder="Award Title"
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                    <input
                      type="text"
                      value={aw.organization}
                      onChange={e => updateResume(prev => { prev.additionalSections.awards[awIdx].organization = e.target.value; return prev; })}
                      placeholder="Organization"
                      className="w-36 px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white outline-none"
                    />
                    <button
                      onClick={() => updateResume(prev => { prev.additionalSections.awards.splice(awIdx, 1); return prev; })}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Step
        </button>

        <span className="text-xs font-medium text-slate-500">
          Step {currentStep} of {WIZARD_STEPS.length}
        </span>

        <button
          onClick={() => setCurrentStep(prev => Math.min(WIZARD_STEPS.length, prev + 1))}
          disabled={currentStep === WIZARD_STEPS.length}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-30 transition shadow-sm"
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

