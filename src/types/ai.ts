import { ResumeData } from './resume';

export type IssueSeverity = 'critical' | 'warning' | 'info';
export type IssueCategory = 'grammar' | 'quality' | 'ats' | 'impact' | 'formatting';

export interface ResumeIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  section: string; // e.g. "Work Experience - Google", "Summary"
  fieldKey?: string; // target field path
  itemIndex?: number;
  bulletIndex?: number;
  originalSentence: string;
  problemIdentified: string;
  whyProblem: string;
  improvedVersion: string;
  explanation: string;
  status: 'pending' | 'applied' | 'ignored';
}

export interface ATSScoreBreakdown {
  atsFormatting: number;      // max 20
  keywordOptimization: number; // max 25
  skillsRelevance: number;     // max 15
  workExperienceQuality: number; // max 15
  professionalSummary: number; // max 10
  educationCertifications: number; // max 5
  grammarReadability: number;  // max 10
}

export interface ATSAnalysisResult {
  overallScore: number; // 0-100
  breakdown: ATSScoreBreakdown;
  scoreGrade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues';
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  identifiedKeywords: string[];
  recommendedImprovements: string[];
  priorityActionPlan: {
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    estimatedImpact: string; // e.g. "+8 points"
  }[];
  disclaimer: string;
}

export interface ProposedChange {
  id: string;
  section: 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'general';
  title: string;
  before: string;
  after: string;
  reason: string;
  accepted?: boolean;
}

export interface AIResumeAgentRequest {
  userMessage: string;
  currentResume: ResumeData;
  targetJobDescription?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIResumeAgentResponse {
  success: boolean;
  message: string;
  isResumeRelated: boolean;
  targetSections?: string[];
  proposedChanges: ProposedChange[];
  updatedResume?: ResumeData;
  error?: string;
  code?: 'API_KEY_MISSING' | 'API_ERROR' | 'INVALID_REQUEST' | 'RATE_LIMIT' | 'TIMEOUT' | 'MALFORMED_RESPONSE';
  configuredEnvVars?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  proposedChanges?: ProposedChange[];
  updatedResume?: ResumeData;
  isApplied?: boolean;
  isRejected?: boolean;
}
