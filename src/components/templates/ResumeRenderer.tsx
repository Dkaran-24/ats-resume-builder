'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { 
  Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink,
  Award, Briefcase, GraduationCap, Code, FolderGit2, CheckCircle2
} from 'lucide-react';

interface ResumeRendererProps {
  resume: ResumeData;
  scale?: number;
  id?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ 
  resume, 
  scale = 1,
  id = 'resume-render-canvas'
}) => {
  const { formatting, personalInfo, summary, experience, education, skills, projects, certifications, additionalSections } = resume;
  const template = formatting?.template || 'classic-ats';

  // Dynamic styling variables
  const fontClass = {
    inter: 'font-sans',
    roboto: 'font-sans',
    merriweather: 'font-serif',
    garamond: 'font-serif',
    geist: 'font-sans',
    jetbrains: 'font-mono'
  }[formatting?.font || 'inter'];

  const fontSizeClass = {
    compact: 'text-[11px] leading-relaxed',
    normal: 'text-[12.5px] leading-relaxed',
    relaxed: 'text-[13.5px] leading-loose'
  }[formatting?.fontSize || 'normal'];

  const spacingClass = {
    tight: 'space-y-3',
    normal: 'space-y-4',
    spacious: 'space-y-6'
  }[formatting?.spacing || 'normal'];

  const marginClass = {
    narrow: 'p-6',
    normal: 'p-8 sm:p-10',
    wide: 'p-12'
  }[formatting?.margins || 'normal'];

  const accentColor = formatting?.primaryColor || '#0f172a';

  return (
    <div 
      id={id}
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm'
      }}
      className={`bg-white text-slate-900 shadow-2xl rounded-sm transition-all duration-200 mx-auto print:shadow-none print:m-0 print:w-full print:border-none ${fontClass} ${fontSizeClass} ${marginClass}`}
    >
      {/* HEADER SECTION */}
      <header className={`border-b pb-4 mb-4 ${template === 'modern-professional' || template === 'software-developer' ? 'border-slate-200' : 'border-slate-300'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 
              style={{ color: template === 'classic-ats' ? '#0f172a' : accentColor }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-base font-semibold text-slate-600 mt-0.5">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Quick Contacts */}
          <div className="text-xs text-slate-600 space-y-1 sm:text-right">
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {personalInfo.email && (
                <span className="flex items-center gap-1 hover:text-slate-900">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1 hover:text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.location}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end text-blue-600 font-medium">
              {personalInfo.linkedin && (
                <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                  <Linkedin className="w-3 h-3" />
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {personalInfo.github && (
                <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                  <Github className="w-3 h-3" />
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {personalInfo.portfolio && (
                <a href={`https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                  <Globe className="w-3 h-3" />
                  {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={spacingClass}>
        {/* PROFESSIONAL SUMMARY */}
        {summary?.text && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-1.5 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {summary.text}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experience && experience.length > 0 && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-2 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Work Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="text-slate-600 font-medium"> — {exp.company}</span>
                      {exp.location && (
                        <span className="text-slate-500 text-xs font-normal">, {exp.location}</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>

                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="mt-1.5 list-disc list-outside pl-4 space-y-1 text-slate-700">
                      {exp.bulletPoints.map((bp, bidx) => (
                        <li key={bidx} className="leading-snug">
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">Technologies:</span>
                      {template === 'software-developer' ? (
                        exp.technologies.map((t, tidx) => (
                          <span key={tidx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span>{exp.technologies.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills && Object.values(skills).some(arr => arr && arr.length > 0) && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-2 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Skills & Core Competencies
            </h2>
            <div className="space-y-1 text-slate-700 text-xs">
              {skills.technical?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Technical Skills: </span>
                  <span>{skills.technical.join(', ')}</span>
                </div>
              )}
              {skills.programming?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Programming Languages: </span>
                  <span>{skills.programming.join(', ')}</span>
                </div>
              )}
              {skills.frameworks?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Frameworks & Libraries: </span>
                  <span>{skills.frameworks.join(', ')}</span>
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Tools & Platforms: </span>
                  <span>{skills.tools.join(', ')}</span>
                </div>
              )}
              {skills.domain?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Domain Expertise: </span>
                  <span>{skills.domain.join(', ')}</span>
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900">Soft Skills: </span>
                  <span>{skills.soft.join(', ')}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-2 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                      <span className="text-slate-600 font-medium"> — {edu.institution}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                  {(edu.gpa || edu.honors || (edu.coursework && edu.coursework.length > 0)) && (
                    <div className="text-xs text-slate-600 mt-0.5 space-x-2">
                      {edu.gpa && <span>GPA: <strong className="text-slate-800">{edu.gpa}</strong></span>}
                      {edu.honors && <span>• {edu.honors}</span>}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <span>• Coursework: {edu.coursework.join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-2 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.role && <span className="text-xs text-slate-500">({proj.role})</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-blue-600">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 hover:underline">
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                    <ul className="mt-1 list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                      {proj.bulletPoints.map((bp, pidx) => (
                        <li key={pidx} className="leading-snug">{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 
              style={{ color: accentColor }}
              className={`text-xs font-bold tracking-wider uppercase mb-2 pb-0.5 border-b ${
                template === 'modern-professional' ? 'border-indigo-100 flex items-center gap-1.5' : 'border-slate-300'
              }`}
            >
              Certifications & Credentials
            </h2>
            <ul className="space-y-1 text-slate-700">
              {certifications.map(cert => (
                <li key={cert.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <strong className="text-slate-900">{cert.name}</strong>
                    <span className="text-slate-600"> — {cert.issuer}</span>
                    {cert.credentialId && <span className="text-slate-400 text-[11px] ml-1">ID: {cert.credentialId}</span>}
                  </div>
                  <span className="text-slate-500 text-[11px] font-medium">{cert.issueDate}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ADDITIONAL SECTIONS (Awards, Volunteer, Languages) */}
        {additionalSections && (
          <>
            {additionalSections.awards?.length > 0 && (
              <section>
                <h2 style={{ color: accentColor }} className="text-xs font-bold tracking-wider uppercase mb-1.5 pb-0.5 border-b border-slate-300">
                  Honors & Awards
                </h2>
                <ul className="space-y-1 text-xs">
                  {additionalSections.awards.map(aw => (
                    <li key={aw.id} className="flex justify-between">
                      <span><strong>{aw.title}</strong> — {aw.organization}</span>
                      <span className="text-slate-500">{aw.date}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {additionalSections.languages?.length > 0 && (
              <section>
                <h2 style={{ color: accentColor }} className="text-xs font-bold tracking-wider uppercase mb-1.5 pb-0.5 border-b border-slate-300">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                  {additionalSections.languages.map(l => (
                    <span key={l.id}>
                      <strong>{l.language}:</strong> {l.proficiency}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

