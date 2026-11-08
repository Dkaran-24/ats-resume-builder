export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  avatarUrl?: string;
}

export type SummaryTone = 'Professional' | 'Technical' | 'Leadership' | 'Entry-Level';

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  bulletPoints: string[];
  technologies: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  coursework?: string[];
  honors?: string;
}

export interface SkillsCategorized {
  technical: string[];
  programming: string[];
  frameworks: string[];
  tools: string[];
  soft: string[];
  domain: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  bulletPoints: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface GenericSectionItem {
  id: string;
  title: string;
  organization?: string;
  date?: string;
  description?: string;
  url?: string;
}

export interface AdditionalSections {
  internships: WorkExperience[];
  awards: GenericSectionItem[];
  publications: GenericSectionItem[];
  volunteer: GenericSectionItem[];
  languages: LanguageItem[];
  leadership: GenericSectionItem[];
  extracurricular: GenericSectionItem[];
}

export type TemplateId = 
  | 'classic-ats'
  | 'modern-professional'
  | 'minimalist'
  | 'software-developer'
  | 'data-analyst'
  | 'business-analyst'
  | 'marketing-professional'
  | 'fresh-graduate'
  | 'experienced-professional'
  | 'executive-resume';

export interface ResumeFormatting {
  template: TemplateId;
  font: 'inter' | 'roboto' | 'merriweather' | 'garamond' | 'geist' | 'jetbrains';
  fontSize: 'compact' | 'normal' | 'relaxed';
  spacing: 'tight' | 'normal' | 'spacious';
  margins: 'narrow' | 'normal' | 'wide';
  primaryColor: string; // hex code
  sectionOrder: string[];
  showIcons: boolean;
  showDividers: boolean;
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  personalInfo: PersonalInfo;
  summary: {
    text: string;
    tone: SummaryTone;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: SkillsCategorized;
  projects: Project[];
  certifications: Certification[];
  additionalSections: AdditionalSections;
  formatting: ResumeFormatting;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  savedAt: string;
  changeSummary: string;
  data: ResumeData;
}

