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

export interface JobMatchResult {
  jobTitle: string;
  company?: string;
  matchPercentage: number;
  extractedRequirements: string[];
  requiredTechnicalSkills: string[];
  requiredSoftSkills: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
  skillsGap: string[];
  experienceGap: string[];
  suggestedImprovements: {
    section: string;
    currentContent: string;
    suggestedContent: string;
    reason: string;
  }[];
  verdict: 'Strong Match' | 'Moderate Match' | 'Low Match';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'apply_summary' | 'add_skill' | 'improve_bullet' | 'switch_template';
    payload?: any;
  }[];
}

