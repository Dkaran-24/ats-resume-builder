import { ResumeData, ResumeVersion } from '@/types/resume';
import { UserProfile, UserActivity } from '@/types/auth';
import { INITIAL_RESUME } from './constants';

const STORAGE_KEYS = {
  CURRENT_RESUME: 'resumeforge_current_resume',
  ALL_RESUMES: 'resumeforge_all_resumes',
  USER_PROFILE: 'resumeforge_user_profile',
  USER_ACTIVITIES: 'resumeforge_activities',
  RESUME_VERSIONS: 'resumeforge_versions',
  AUTH_TOKEN: 'resumeforge_auth_token'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_demo_882',
  name: 'Alex Morgan',
  email: 'alex.morgan.dev@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetRole: 'Senior Full Stack Engineer',
  industry: 'Software & Technology',
  experienceLevel: 'Senior',
  createdAt: new Date().toISOString()
};

export const storage = {
  getCurrentResume(): ResumeData {
    if (typeof window === 'undefined') return INITIAL_RESUME;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_RESUME);
      return data ? JSON.parse(data) : INITIAL_RESUME;
    } catch {
      return INITIAL_RESUME;
    }
  },

  saveCurrentResume(resume: ResumeData): void {
    if (typeof window === 'undefined') return;
    try {
      resume.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CURRENT_RESUME, JSON.stringify(resume));

      // Also update in all resumes list
      const all = storage.getAllResumes();
      const existingIdx = all.findIndex(r => r.id === resume.id);
      if (existingIdx >= 0) {
        all[existingIdx] = resume;
      } else {
        all.unshift(resume);
      }
      localStorage.setItem(STORAGE_KEYS.ALL_RESUMES, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save resume in localStorage:', e);
    }
  },

  getAllResumes(): ResumeData[] {
    if (typeof window === 'undefined') return [INITIAL_RESUME];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_RESUMES);
      if (!data) {
        const initial = [INITIAL_RESUME];
        localStorage.setItem(STORAGE_KEYS.ALL_RESUMES, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [INITIAL_RESUME];
    }
  },

  createResume(title: string, targetRole: string): ResumeData {
    const newResume: ResumeData = {
      ...INITIAL_RESUME,
      id: `resume_${Date.now()}`,
      title: title || 'New Professional Resume',
      targetRole: targetRole || 'Software Professional',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    storage.saveCurrentResume(newResume);
    storage.addActivity({
      id: `act_${Date.now()}`,
      type: 'create_resume',
      description: `Created new resume "${newResume.title}"`,
      timestamp: new Date().toISOString(),
      resumeId: newResume.id
    });
    return newResume;
  },

  duplicateResume(resumeId: string): ResumeData | null {
    const all = storage.getAllResumes();
    const source = all.find(r => r.id === resumeId);
    if (!source) return null;

    const dup: ResumeData = {
      ...JSON.parse(JSON.stringify(source)),
      id: `resume_${Date.now()}`,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    storage.saveCurrentResume(dup);
    return dup;
  },

  deleteResume(resumeId: string): void {
    const all = storage.getAllResumes().filter(r => r.id !== resumeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ALL_RESUMES, JSON.stringify(all));
    }
  },

  getUserProfile(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getActivities(): UserActivity[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_ACTIVITIES);
      return data ? JSON.parse(data) : [
        {
          id: 'act_1',
          type: 'create_resume',
          description: 'Created "Senior Software Engineer (ATS Optimized)"',
          timestamp: '2 hours ago',
          resumeId: INITIAL_RESUME.id
        },
        {
          id: 'act_2',
          type: 'run_ats_analysis',
          description: 'ATS Scan achieved 92/100 readiness score',
          timestamp: '1 hour ago',
          score: 92
        },
        {
          id: 'act_3',
          type: 'match_job',
          description: 'Targeted match for "Senior Full Stack Engineer" (88% match)',
          timestamp: '45 mins ago'
        }
      ];
    } catch {
      return [];
    }
  },

  addActivity(activity: UserActivity): void {
    if (typeof window === 'undefined') return;
    try {
      const list = storage.getActivities();
      list.unshift(activity);
      localStorage.setItem(STORAGE_KEYS.USER_ACTIVITIES, JSON.stringify(list.slice(0, 20)));
    } catch (e) {
      console.error(e);
    }
  },

  saveVersionSnapshot(resume: ResumeData, changeSummary: string): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS);
      const versions: ResumeVersion[] = raw ? JSON.parse(raw) : [];
      const newVersion: ResumeVersion = {
        id: `ver_${Date.now()}`,
        resumeId: resume.id,
        versionNumber: (resume.version || 1) + 1,
        savedAt: new Date().toISOString(),
        changeSummary: changeSummary || 'Automatic snapshot',
        data: JSON.parse(JSON.stringify(resume))
      };
      versions.unshift(newVersion);
      localStorage.setItem(STORAGE_KEYS.RESUME_VERSIONS, JSON.stringify(versions.slice(0, 15)));
      
      // Update resume version counter
      resume.version = newVersion.versionNumber;
      storage.saveCurrentResume(resume);
    } catch (e) {
      console.error(e);
    }
  },

  getVersionsForResume(resumeId: string): ResumeVersion[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS);
      const versions: ResumeVersion[] = raw ? JSON.parse(raw) : [];
      return versions.filter(v => v.resumeId === resumeId);
    } catch {
      return [];
    }
  }
};

