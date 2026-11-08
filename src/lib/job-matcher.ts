import { ResumeData } from '@/types/resume';
import { JobMatchResult } from '@/types/ai';

export function matchResumeWithJobDescription(
  resume: ResumeData,
  jobText: string,
  targetJobTitle?: string
): JobMatchResult {
  const normalizedJob = jobText.toLowerCase();

  // Common keywords & skill dictionary
  const techSkillDictionary = [
    'react', 'next.js', 'vue', 'angular', 'node.js', 'typescript', 'javascript',
    'python', 'java', 'golang', 'c++', 'sql', 'postgresql', 'mongodb', 'redis',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'git',
    'restful api', 'graphql', 'kafka', 'microservices', 'distributed systems',
    'tableau', 'power bi', 'snowflake', 'bigquery', 'pandas', 'numpy', 'scikit-learn',
    'machine learning', 'devops', 'linux', 'html5', 'css3', 'tailwind'
  ];

  const softSkillDictionary = [
    'leadership', 'cross-functional', 'communication', 'collaboration',
    'agile', 'scrum', 'problem solving', 'mentorship', 'stakeholder management',
    'strategic thinking', 'critical thinking', 'adaptability', 'project management'
  ];

  // Extract skills present in the JD
  const requiredTechnicalSkills: string[] = [];
  const requiredSoftSkills: string[] = [];
  const extractedKeywords: string[] = [];

  techSkillDictionary.forEach(skill => {
    if (normalizedJob.includes(skill)) {
      requiredTechnicalSkills.push(formatSkillName(skill));
      extractedKeywords.push(formatSkillName(skill));
    }
  });

  softSkillDictionary.forEach(skill => {
    if (normalizedJob.includes(skill)) {
      requiredSoftSkills.push(formatSkillName(skill));
      extractedKeywords.push(formatSkillName(skill));
    }
  });

  // Extract responsibilities/requirements sentences
  const lines = jobText.split(/[\n•\-*]+/).map(l => l.trim()).filter(l => l.length > 25);
  const extractedRequirements = lines.slice(0, 6);

  // Compare against resume text
  const allResumeText = [
    resume.summary.text,
    ...resume.experience.flatMap(e => [...e.bulletPoints, ...(e.technologies || [])]),
    ...resume.projects.flatMap(p => [...p.bulletPoints, ...(p.technologies || [])]),
    ...resume.education.map(ed => `${ed.degree} ${ed.fieldOfStudy}`),
    ...Object.values(resume.skills).flat()
  ].join(' ').toLowerCase();

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const skillsGap: string[] = [];

  requiredTechnicalSkills.forEach(skill => {
    if (allResumeText.includes(skill.toLowerCase())) {
      matchingKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
      skillsGap.push(skill);
    }
  });

  requiredSoftSkills.forEach(skill => {
    if (allResumeText.includes(skill.toLowerCase())) {
      matchingKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
    }
  });

  // Experience gap
  const experienceGap: string[] = [];
  if (normalizedJob.includes('5+ years') || normalizedJob.includes('senior')) {
    if (resume.experience.length < 2) {
      experienceGap.push('Job expects 5+ years seniority; resume currently has fewer than 2 documented positions.');
    }
  }
  if (normalizedJob.includes('cloud') || normalizedJob.includes('aws')) {
    if (!allResumeText.includes('aws') && !allResumeText.includes('cloud')) {
      experienceGap.push('Hands-on cloud infrastructure experience (AWS/GCP/Azure) highlighted in job requirements is currently unlisted.');
    }
  }

  // Calculate Match %
  const totalKeywords = matchingKeywords.length + missingKeywords.length;
  let matchPercentage = 0;
  if (totalKeywords > 0) {
    matchPercentage = Math.round((matchingKeywords.length / totalKeywords) * 100);
  } else {
    matchPercentage = 75;
  }

  // Suggested Improvements
  const suggestedImprovements: {
    section: string;
    currentContent: string;
    suggestedContent: string;
    reason: string;
  }[] = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 3).join(', ');
    suggestedImprovements.push({
      section: 'Skills / Summary',
      currentContent: resume.summary.text ? resume.summary.text.substring(0, 70) + '...' : 'No summary',
      suggestedContent: `Highlight your genuine familiarity with ${topMissing} in your summary and experience where applicable.`,
      reason: `These high-frequency terms appear in the job requirements but were not detected on your resume.`
    });
  }

  if (skillsGap.length > 0) {
    suggestedImprovements.push({
      section: 'Work Experience Bullet Points',
      currentContent: resume.experience[0]?.bulletPoints[0] || 'First bullet point',
      suggestedContent: `Tie your experience with ${skillsGap[0]} directly to a measurable team outcome (e.g., latency, deployment speed, reliability).`,
      reason: 'Helps ATS and the hiring manager immediately see you meet the core technical spec.'
    });
  }

  let verdict: 'Strong Match' | 'Moderate Match' | 'Low Match' = 'Moderate Match';
  if (matchPercentage >= 80) verdict = 'Strong Match';
  else if (matchPercentage < 50) verdict = 'Low Match';

  return {
    jobTitle: targetJobTitle || 'Target Position',
    matchPercentage,
    extractedRequirements,
    requiredTechnicalSkills: requiredTechnicalSkills.slice(0, 10),
    requiredSoftSkills: requiredSoftSkills.slice(0, 8),
    matchingKeywords,
    missingKeywords,
    skillsGap,
    experienceGap,
    suggestedImprovements,
    verdict
  };
}

function formatSkillName(s: string): string {
  if (s === 'aws') return 'AWS';
  if (s === 'gcp') return 'GCP';
  if (s === 'sql') return 'SQL';
  if (s === 'ci/cd') return 'CI/CD';
  if (s === 'restful api') return 'RESTful APIs';
  if (s === 'next.js') return 'Next.js';
  if (s === 'node.js') return 'Node.js';
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

