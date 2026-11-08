import { ResumeData } from '@/types/resume';
import { ResumeIssue } from '@/types/ai';

export function analyzeResumeForIssues(resume: ResumeData): ResumeIssue[] {
  const issues: ResumeIssue[] = [];

  // 1. Analyze Summary
  if (resume.summary.text) {
    const summaryText = resume.summary.text;
    if (summaryText.toLowerCase().includes('hardworking') || summaryText.toLowerCase().includes('motivated individual')) {
      issues.push({
        id: 'issue-sum-cliche',
        category: 'quality',
        severity: 'warning',
        section: 'Professional Summary',
        fieldKey: 'summary.text',
        originalSentence: summaryText.substring(0, 80) + '...',
        problemIdentified: 'Contains generic self-descriptive clichés ("hardworking", "motivated individual").',
        whyProblem: 'Recruiters and ATS scan for concrete capabilities and quantified outcomes rather than subjective adjectives which add little informational value.',
        improvedVersion: summaryText.replace(/hardworking|motivated individual/gi, 'results-focused professional specialized in scalable software architecture'),
        explanation: 'Replaced subjective buzzwords with domain-specific competencies that demonstrate immediate business value.',
        status: 'pending'
      });
    }

    if (!summaryText.includes('%') && !summaryText.includes('$') && !/\d+/.test(summaryText)) {
      issues.push({
        id: 'issue-sum-metrics',
        category: 'impact',
        severity: 'info',
        section: 'Professional Summary',
        fieldKey: 'summary.text',
        originalSentence: summaryText,
        problemIdentified: 'Summary lacks a standout quantitative metric or scope of impact.',
        whyProblem: 'A summary that includes an impressive metric (e.g., "scaled to 2M+ users", "cut latency by 40%") captures hiring managers in the first 6 seconds.',
        improvedVersion: summaryText.endsWith('.') 
          ? `${summaryText.slice(0, -1)}, driving 35%+ efficiency gains across high-growth systems.` 
          : `${summaryText}, driving 35%+ efficiency gains across high-growth systems.`,
        explanation: 'Appended a measurable impact statement emphasizing efficiency and scale.',
        status: 'pending'
      });
    }
  } else {
    issues.push({
      id: 'issue-sum-missing',
      category: 'ats',
      severity: 'critical',
      section: 'Professional Summary',
      fieldKey: 'summary.text',
      originalSentence: '[No summary provided]',
      problemIdentified: 'Missing Professional Summary section.',
      whyProblem: 'ATS parsers look for an executive summary at the top to classify your seniority level and core domain.',
      improvedVersion: `Experienced ${resume.personalInfo.jobTitle || 'Professional'} with expertise in delivering mission-critical solutions, driving operational efficiency, and leading cross-functional teams to exceed business goals.`,
      explanation: 'Drafted a high-converting 2-sentence summary tailored to your role.',
      status: 'pending'
    });
  }

  // 2. Analyze Experience Bullet Points
  resume.experience.forEach((exp, expIdx) => {
    exp.bulletPoints.forEach((bullet, bulletIdx) => {
      // Check for weak verbs at start
      const firstWord = bullet.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
      const weakStarters = ['worked', 'helped', 'assisted', 'responsible', 'handled', 'was', 'did', 'managed'];
      
      if (weakStarters.includes(firstWord.toLowerCase())) {
        const strongReplacements: Record<string, string> = {
          worked: 'Architected and implemented',
          helped: 'Partnered cross-functionally to deliver',
          assisted: 'Spearheaded development of',
          responsible: 'Orchestrated end-to-end execution of',
          handled: 'Administered and streamlined',
          was: 'Directed key initiatives for',
          did: 'Executed strategic roadmap for',
          managed: 'Directed high-performing team and executed'
        };

        const replacement = strongReplacements[firstWord.toLowerCase()] || 'Spearheaded';
        const restOfSentence = bullet.replace(new RegExp(`^${firstWord}\\s+(on|with|for|to)?\\s*`, 'i'), '');
        const improved = `${replacement} ${restOfSentence}`;

        issues.push({
          id: `issue-exp-verb-${expIdx}-${bulletIdx}`,
          category: 'grammar',
          severity: 'warning',
          section: `Work Experience (${exp.company})`,
          fieldKey: `experience.${expIdx}.bulletPoints.${bulletIdx}`,
          itemIndex: expIdx,
          bulletIndex: bulletIdx,
          originalSentence: bullet,
          problemIdentified: `Weak opening verb "${firstWord}".`,
          whyProblem: 'Opening with passive words like "worked on" or "helped" understates your role and fails to trigger ATS leadership keyword matches.',
          improvedVersion: improved,
          explanation: `Upgraded to high-impact action verb "${replacement.split(' ')[0]}" with active accountability.`,
          status: 'pending'
        });
      }

      // Check for missing metrics
      const hasMetric = /(\d+%?|\$\d+|\d+\s*(users|clients|ms|hours|days|releases|x|reduction|increase))/i.test(bullet);
      if (!hasMetric && bullet.length > 30) {
        issues.push({
          id: `issue-exp-metric-${expIdx}-${bulletIdx}`,
          category: 'impact',
          severity: 'info',
          section: `Work Experience (${exp.company})`,
          fieldKey: `experience.${expIdx}.bulletPoints.${bulletIdx}`,
          itemIndex: expIdx,
          bulletIndex: bulletIdx,
          originalSentence: bullet,
          problemIdentified: 'No quantifiable metrics or measurable outcome detected in this bullet point.',
          whyProblem: 'Recruiters favor the Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]". Without numbers, achievements feel unsubstantiated.',
          improvedVersion: bullet.endsWith('.')
            ? `${bullet.slice(0, -1)}, improving operational throughput by 28%.`
            : `${bullet}, improving operational throughput by 28%.`,
          explanation: 'Appended a measurable outcome template that quantifies operational throughput. (Adjust the exact figure to match your actual metrics).',
          status: 'pending'
        });
      }

      // Check punctuation
      if (bullet.trim().length > 0 && !bullet.trim().endsWith('.')) {
        issues.push({
          id: `issue-exp-punct-${expIdx}-${bulletIdx}`,
          category: 'formatting',
          severity: 'info',
          section: `Work Experience (${exp.company})`,
          fieldKey: `experience.${expIdx}.bulletPoints.${bulletIdx}`,
          itemIndex: expIdx,
          bulletIndex: bulletIdx,
          originalSentence: bullet,
          problemIdentified: 'Missing terminal period at the end of the bullet point.',
          whyProblem: 'Inconsistent punctuation looks unpolished in recruitment reviews.',
          improvedVersion: `${bullet.trim()}.`,
          explanation: 'Ensured uniform sentence endings across all bullet points.',
          status: 'pending'
        });
      }

      // Check for wordiness / filler words
      if (bullet.toLowerCase().includes('in order to') || bullet.toLowerCase().includes('duties and responsibilities included')) {
        issues.push({
          id: `issue-exp-filler-${expIdx}-${bulletIdx}`,
          category: 'quality',
          severity: 'warning',
          section: `Work Experience (${exp.company})`,
          fieldKey: `experience.${expIdx}.bulletPoints.${bulletIdx}`,
          itemIndex: expIdx,
          bulletIndex: bulletIdx,
          originalSentence: bullet,
          problemIdentified: 'Contains redundant filler phrases ("in order to" / "duties included").',
          whyProblem: 'Fluff words dilute bullet point punchiness and consume valuable ATS real estate.',
          improvedVersion: bullet
            .replace(/in order to/gi, 'to')
            .replace(/duties and responsibilities included/gi, 'delivered'),
          explanation: 'Trimmed redundant phrasing for tighter, more direct expression.',
          status: 'pending'
        });
      }
    });
  });

  // 3. ATS Layout & Sections Checks
  if (resume.skills.technical.length === 0 && resume.skills.programming.length === 0) {
    issues.push({
      id: 'issue-skills-missing',
      category: 'ats',
      severity: 'critical',
      section: 'Skills Section',
      originalSentence: '[Skills section lacks technical categories]',
      problemIdentified: 'No categorized Technical or Programming skills.',
      whyProblem: 'Modern ATS filters index candidate resumes directly by skill keywords matching the Job Description.',
      improvedVersion: 'Technical Skills: System Architecture, RESTful APIs, Cloud Computing, CI/CD, Database Design.',
      explanation: 'Categorizing skills ensures accurate keyword parsing by ATS robots.',
      status: 'pending'
    });
  }

  // 4. Contact Info ATS Checks
  if (!resume.personalInfo.linkedin) {
    issues.push({
      id: 'issue-contact-linkedin',
      category: 'ats',
      severity: 'warning',
      section: 'Contact Information',
      originalSentence: '[No LinkedIn profile link provided]',
      problemIdentified: 'Missing LinkedIn profile URL.',
      whyProblem: '94% of recruiters cross-reference applicant resumes against their verified LinkedIn profiles.',
      improvedVersion: 'linkedin.com/in/your-name',
      explanation: 'Add your clean LinkedIn custom URL (omit https:// for cleaner ATS parsing).',
      status: 'pending'
    });
  }

  return issues;
}

export function generateImprovedBullet(rawText: string, targetRole?: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return '';

  // Clean starter
  let words = trimmed.split(/\s+/);
  const firstWord = words[0].toLowerCase();
  
  const verbMap: Record<string, string> = {
    made: 'Architected and delivered',
    built: 'Engineered and scaled',
    helped: 'Partnered across teams to deliver',
    worked: 'Spearheaded implementation of',
    responsible: 'Led end-to-end execution of',
    handled: 'Orchestrated',
    created: 'Pioneered development of',
    managed: 'Directed',
    fixed: 'Diagnosed and resolved critical bottlenecks in'
  };

  let starter = verbMap[firstWord] || 'Spearheaded';
  let body = words.slice(1).join(' ');

  // Add measurable metric if missing
  const hasMetric = /\d+/.test(trimmed);
  let metricSuffix = hasMetric ? '' : ', driving a 30% reduction in turnaround time';

  let result = `${starter} ${body}${metricSuffix}`;
  if (!result.endsWith('.')) result += '.';
  return result;
}

export function generateSummaryAI(
  jobTitle: string,
  tone: 'Professional' | 'Technical' | 'Leadership' | 'Entry-Level',
  experienceYears: number = 5,
  coreSkills: string[] = ['System Architecture', 'Cloud Services', 'Agile Leadership']
): string {
  const skillsList = coreSkills.slice(0, 4).join(', ');

  switch (tone) {
    case 'Technical':
      return `Hands-on ${jobTitle} with ${experienceYears}+ years of deep technical mastery in ${skillsList}. Expert at architecting fault-tolerant distributed systems, refactoring legacy codebases, and accelerating CI/CD deployment pipelines with 99.99% system reliability.`;
    case 'Leadership':
      return `Strategic ${jobTitle} with a demonstrated track record of leading high-caliber engineering teams, orchestrating cross-functional initiatives, and scaling high-impact platforms. Passionate about talent mentorship, agile delivery excellence, and driving 40%+ measurable efficiency gains.`;
    case 'Entry-Level':
      return `Ambitious, high-achieving ${jobTitle} graduate equipped with rigorous academic foundations and hands-on project experience in ${skillsList}. Proven problem-solver committed to shipping clean, well-tested code and rapidly contributing to enterprise engineering workflows.`;
    case 'Professional':
    default:
      return `Results-driven ${jobTitle} with ${experienceYears}+ years of progressive experience delivering high-impact solutions across ${skillsList}. Proven capability to translate complex business requirements into scalable architectures that maximize user satisfaction and operational efficiency.`;
  }
}

