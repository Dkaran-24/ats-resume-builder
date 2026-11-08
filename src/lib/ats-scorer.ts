import { ResumeData } from '@/types/resume';
import { ATSAnalysisResult, ATSScoreBreakdown } from '@/types/ai';

export function calculateATSScore(resume: ResumeData): ATSAnalysisResult {
  let atsFormatting = 0;       // max 20
  let keywordOptimization = 0; // max 25
  let skillsRelevance = 0;     // max 15
  let workExperienceQuality = 0; // max 15
  let professionalSummary = 0; // max 10
  let educationCertifications = 0; // max 5
  let grammarReadability = 0;  // max 10

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingKeywords: string[] = [];
  const identifiedKeywords: string[] = [];
  const recommendedImprovements: string[] = [];
  const priorityActionPlan: {
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    estimatedImpact: string;
  }[] = [];

  // 1. ATS Formatting (20 pts)
  // Single column, valid contacts, section headers standard
  let formatScore = 0;
  if (resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone) {
    formatScore += 7;
  } else {
    weaknesses.push('Incomplete personal contact details (missing email, phone, or full name).');
  }

  if (resume.personalInfo.location) formatScore += 3;
  if (resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.portfolio) formatScore += 4;

  // Single-column & template check
  if (resume.formatting.template) {
    formatScore += 6;
    strengths.push('Clean ATS-compliant layout structure with parsable typography.');
  }
  atsFormatting = Math.min(20, formatScore);

  // 2. Keyword Optimization (25 pts)
  // Extract all text and analyze action verbs & technical industry keywords
  const allResumeText = [
    resume.summary.text,
    ...resume.experience.flatMap(e => [...e.bulletPoints, ...(e.technologies || [])]),
    ...resume.projects.flatMap(p => [...p.bulletPoints, ...(p.technologies || [])]),
    ...resume.education.map(ed => `${ed.degree} ${ed.fieldOfStudy} ${(ed.coursework || []).join(' ')}`),
    ...Object.values(resume.skills).flat()
  ].join(' ').toLowerCase();

  const standardKeywords = [
    'cloud', 'api', 'architecture', 'agile', 'scrum', 'ci/cd', 'optimization', 'performance',
    'security', 'database', 'testing', 'automation', 'leadership', 'collaboration',
    'analytics', 'scalability', 'cross-functional', 'stakeholder', 'strategy'
  ];

  let foundKeywordsCount = 0;
  standardKeywords.forEach(kw => {
    if (allResumeText.includes(kw)) {
      foundKeywordsCount++;
      identifiedKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    } else {
      missingKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  const keywordRatio = Math.min(1, foundKeywordsCount / 10);
  keywordOptimization = Math.round(keywordRatio * 25);

  if (keywordOptimization >= 20) {
    strengths.push(`Rich industry keywords detected (${foundKeywordsCount} verified keywords matched).`);
  } else {
    weaknesses.push('Resume is sparse in standard industry keywords; consider weaving core terms naturally.');
    priorityActionPlan.push({
      priority: 'High',
      title: 'Incorporate Core Industry Keywords',
      description: `Integrate industry keywords such as: ${missingKeywords.slice(0, 4).join(', ')}.`,
      estimatedImpact: '+8 points'
    });
  }

  // 3. Skills Relevance (15 pts)
  const totalSkillsCount = 
    resume.skills.technical.length +
    resume.skills.programming.length +
    resume.skills.frameworks.length +
    resume.skills.tools.length +
    resume.skills.soft.length +
    resume.skills.domain.length;

  if (totalSkillsCount >= 16) {
    skillsRelevance = 15;
    strengths.push(`Well-rounded skill profile categorized across ${totalSkillsCount} distinct competencies.`);
  } else if (totalSkillsCount >= 10) {
    skillsRelevance = 12;
  } else if (totalSkillsCount >= 5) {
    skillsRelevance = 8;
    weaknesses.push('Skills section has fewer than 10 skills. ATS parsers score specialized skills favorably.');
  } else {
    skillsRelevance = 4;
    weaknesses.push('Critically low number of categorized skills.');
    priorityActionPlan.push({
      priority: 'High',
      title: 'Flesh Out Categorized Skills',
      description: 'Add at least 5-8 more technical tools, languages, and methodologies.',
      estimatedImpact: '+6 points'
    });
  }

  // 4. Work Experience Quality (15 pts)
  // Check action verbs and measurable numbers (e.g. %, $, numbers)
  const allBulletPoints = [
    ...resume.experience.flatMap(e => e.bulletPoints),
    ...resume.projects.flatMap(p => p.bulletPoints)
  ];

  let quantifiedCount = 0;
  const metricsRegex = /(\d+[%kKmMbB]?|\$\d+|\d+x|\d+\s*(users|clients|ms|seconds|hours|days|weeks|months|years|revenue|reduction|increase|growth))/i;

  allBulletPoints.forEach(bp => {
    if (metricsRegex.test(bp)) quantifiedCount++;
  });

  const metricRatio = allBulletPoints.length > 0 ? (quantifiedCount / allBulletPoints.length) : 0;
  
  if (resume.experience.length >= 2 && allBulletPoints.length >= 4) {
    workExperienceQuality += 7;
  } else if (resume.experience.length >= 1) {
    workExperienceQuality += 4;
  }

  if (metricRatio >= 0.5) {
    workExperienceQuality += 8;
    strengths.push('High concentration of quantified metrics and business impact statements.');
  } else if (metricRatio >= 0.25) {
    workExperienceQuality += 5;
    weaknesses.push('Some bullet points lack measurable numbers or quantified impact.');
    priorityActionPlan.push({
      priority: 'Medium',
      title: 'Add Measurable Numbers to Experience',
      description: 'Strengthen bullet points by answering "By how much?" (e.g., %, time saved, latency cut).',
      estimatedImpact: '+4 points'
    });
  } else {
    workExperienceQuality += 2;
    weaknesses.push('Work experience mostly lists tasks rather than measurable business achievements.');
    priorityActionPlan.push({
      priority: 'High',
      title: 'Transform Task Descriptions to Quantified Impact',
      description: 'Utilize the X-Y-Z formula: Accomplished [X] as measured by [Y] by doing [Z].',
      estimatedImpact: '+7 points'
    });
  }

  // 5. Professional Summary (10 pts)
  const summaryLength = resume.summary.text ? resume.summary.text.trim().split(/\s+/).length : 0;
  if (summaryLength >= 35 && summaryLength <= 110) {
    professionalSummary = 10;
    strengths.push('Punchy, well-proportioned professional summary (~50-80 words).');
  } else if (summaryLength > 0 && summaryLength < 35) {
    professionalSummary = 6;
    weaknesses.push('Professional summary is too brief; aim for 3-4 impactful sentences highlighting your value proposition.');
    priorityActionPlan.push({
      priority: 'Medium',
      title: 'Expand Professional Summary',
      description: 'Provide a 3-sentence summary covering years of experience, core expertise, and a flagship achievement.',
      estimatedImpact: '+4 points'
    });
  } else if (summaryLength > 110) {
    professionalSummary = 6;
    weaknesses.push('Professional summary is overly long and may be skipped by busy recruiters.');
  } else {
    professionalSummary = 0;
    weaknesses.push('Missing professional summary.');
    priorityActionPlan.push({
      priority: 'High',
      title: 'Add Professional Summary',
      description: 'Generate or write an ATS summary introducing your professional identity.',
      estimatedImpact: '+10 points'
    });
  }

  // 6. Education & Certifications (5 pts)
  if (resume.education.length > 0 && resume.certifications.length > 0) {
    educationCertifications = 5;
    strengths.push('Both formal education and verifiable industry certifications present.');
  } else if (resume.education.length > 0 || resume.certifications.length > 0) {
    educationCertifications = 4;
  } else {
    educationCertifications = 1;
    weaknesses.push('Missing education details.');
  }

  // 7. Grammar & Readability (10 pts)
  // Check for common passive filler phrases e.g. "responsible for", "helped to", "duties included"
  const passivePhrases = ['responsible for', 'duties included', 'helped to', 'worked on', 'assisted in'];
  let passiveOccurrences = 0;
  passivePhrases.forEach(phrase => {
    if (allResumeText.includes(phrase)) passiveOccurrences++;
  });

  if (passiveOccurrences === 0) {
    grammarReadability = 10;
    strengths.push('Active voice maintained throughout without passive filler phrases.');
  } else if (passiveOccurrences <= 2) {
    grammarReadability = 7;
    weaknesses.push(`Found ${passiveOccurrences} passive voice phrases like "responsible for" or "worked on".`);
    priorityActionPlan.push({
      priority: 'Low',
      title: 'Replace Passive Verbs with Active Verbs',
      description: 'Replace phrases like "responsible for" with "Engineered", "Orchestrated", or "Spearheaded".',
      estimatedImpact: '+3 points'
    });
  } else {
    grammarReadability = 4;
    weaknesses.push('Frequent passive phrasing weakens the perceived authority of your accomplishments.');
  }

  // Total
  const breakdown: ATSScoreBreakdown = {
    atsFormatting: Math.min(20, atsFormatting),
    keywordOptimization: Math.min(25, keywordOptimization),
    skillsRelevance: Math.min(15, skillsRelevance),
    workExperienceQuality: Math.min(15, workExperienceQuality),
    professionalSummary: Math.min(10, professionalSummary),
    educationCertifications: Math.min(5, educationCertifications),
    grammarReadability: Math.min(10, grammarReadability),
  };

  const overallScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  let scoreGrade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues';
  if (overallScore >= 85) scoreGrade = 'Excellent';
  else if (overallScore >= 70) scoreGrade = 'Good';
  else if (overallScore >= 50) scoreGrade = 'Needs Improvement';
  else scoreGrade = 'Critical Issues';

  recommendedImprovements.push(
    'Keep resume strictly to 1 page if under 5 years experience, or 2 pages for senior profiles.',
    'Use standard bullet points (no asterisks or unusual wingdings).',
    'Ensure all date ranges follow a uniform format (e.g., "YYYY-MM" or "Month YYYY").'
  );

  return {
    overallScore,
    breakdown,
    scoreGrade,
    strengths,
    weaknesses,
    missingKeywords: missingKeywords.slice(0, 8),
    identifiedKeywords: identifiedKeywords.slice(0, 10),
    recommendedImprovements,
    priorityActionPlan,
    disclaimer: 'Notice: This score is an estimated compatibility assessment based on industry-standard ATS parsing heuristics (Workday, Taleo, Greenhouse, Lever), not a guaranteed score from any single employer system.'
  };
}

