export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetRole?: string;
  industry?: string;
  experienceLevel?: 'Student' | 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Executive';
  createdAt: string;
}

export interface UserActivity {
  id: string;
  type: 'create_resume' | 'update_resume' | 'run_ats_analysis' | 'match_job' | 'export_pdf' | 'export_docx';
  description: string;
  timestamp: string;
  resumeId?: string;
  score?: number;
}

