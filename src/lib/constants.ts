import { ResumeData, TemplateId } from '@/types/resume';

export const ACTION_VERBS = {
  leadership: ['Spearheaded', 'Orchestrated', 'Directed', 'Mobilized', 'Championed', 'Mentored', 'Restructured', 'Steered'],
  technical: ['Architected', 'Engineered', 'Developed', 'Deployed', 'Refactored', 'Automated', 'Configured', 'Implemented'],
  optimization: ['Accelerated', 'Streamlined', 'Enhanced', 'Minimized', 'Maximized', 'Revamped', 'Upgraded', 'Consolidated'],
  execution: ['Delivered', 'Executed', 'Launched', 'Generated', 'Established', 'Pioneered', 'Expanded', 'Produced'],
  analysis: ['Evaluated', 'Synthesized', 'Benchmarked', 'Forecasted', 'Audited', 'Investigated', 'Quantified', 'Modeled']
};

export const TEMPLATE_CONFIGS: {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  atsScoreRating: string;
  bestFor: string;
  previewClass: string;
  color: string;
}[] = [
  {
    id: 'classic-ats',
    name: 'Classic ATS Clean',
    category: 'Universal / High-Pass',
    description: 'Monochrome, standard typography, 100% single-column layout strictly adhering to legacy and modern ATS parsers.',
    atsScoreRating: '99% ATS Pass Rate',
    bestFor: 'Corporate, Fortune 500, Government, Healthcare, Banking',
    previewClass: 'border-slate-300 bg-white text-slate-900',
    color: '#0f172a'
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'Corporate & Tech',
    description: 'Crisp indigo section badges, structured metadata alignment, and refined visual hierarchy for modern recruiters.',
    atsScoreRating: '97% ATS Pass Rate',
    bestFor: 'Tech Companies, High-growth Startups, Engineering, Product',
    previewClass: 'border-indigo-200 bg-white text-slate-800',
    color: '#4f46e5'
  },
  {
    id: 'minimalist',
    name: 'Swiss Minimalist',
    category: 'Clean & Refined',
    description: 'Understated section dividers, generous typographic breathing room, and zero clutter for senior clarity.',
    atsScoreRating: '98% ATS Pass Rate',
    bestFor: 'Senior Leaders, Designers, Academics, Consultants',
    previewClass: 'border-neutral-200 bg-white text-neutral-900',
    color: '#171717'
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    category: 'Engineering',
    description: 'Prominent technical stack badges, direct GitHub/Live links, clean repository callouts and architecture achievements.',
    atsScoreRating: '96% ATS Pass Rate',
    bestFor: 'Full-Stack, Backend, Frontend, DevOps, Cloud Engineers',
    previewClass: 'border-cyan-200 bg-white text-slate-900',
    color: '#0284c7'
  },
  {
    id: 'data-analyst',
    name: 'Data & Analytics',
    category: 'Analytics & BI',
    description: 'Structured metric callouts, SQL/Python/Tableau tool stacks, and quantifiable business intelligence impact.',
    atsScoreRating: '96% ATS Pass Rate',
    bestFor: 'Data Analysts, BI Developers, Data Scientists, ML Engineers',
    previewClass: 'border-emerald-200 bg-white text-slate-900',
    color: '#059669'
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    category: 'Consulting & Strategy',
    description: 'Emphasizes requirements elicitation, cross-functional stakeholder alignment, agile workflows, and business KPIs.',
    atsScoreRating: '97% ATS Pass Rate',
    bestFor: 'Business Analysts, Scrum Masters, Agile PMs, Operations',
    previewClass: 'border-amber-200 bg-white text-slate-900',
    color: '#d97706'
  },
  {
    id: 'marketing-professional',
    name: 'Growth & Marketing',
    category: 'Marketing & Sales',
    description: 'Focused on ROI, campaign scale, conversion metrics, audience growth, and multi-channel attribution tools.',
    atsScoreRating: '95% ATS Pass Rate',
    bestFor: 'Growth Marketers, Brand Managers, SEO Specialists, Content Strategists',
    previewClass: 'border-rose-200 bg-white text-slate-900',
    color: '#e11d48'
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate / Student',
    category: 'Entry-Level',
    description: 'Balances academic achievements, honors, capstone projects, and internship experience for early careers.',
    atsScoreRating: '98% ATS Pass Rate',
    bestFor: 'College Graduates, Interns, Career Changers, Freshers',
    previewClass: 'border-violet-200 bg-white text-slate-900',
    color: '#7c3aed'
  },
  {
    id: 'experienced-professional',
    name: 'Experienced Professional',
    category: 'Mid to Senior Career',
    description: 'Designed for 5-15+ years career depth, multi-position chronology, and high-impact progression narratives.',
    atsScoreRating: '97% ATS Pass Rate',
    bestFor: 'Senior Engineers, Staff Directors, Operations Managers',
    previewClass: 'border-blue-200 bg-white text-slate-900',
    color: '#2563eb'
  },
  {
    id: 'executive-resume',
    name: 'Executive Leadership',
    category: 'Executive & C-Suite',
    description: 'Highlights P&L responsibility, organizational transformation, board reporting, and enterprise-scale vision.',
    atsScoreRating: '96% ATS Pass Rate',
    bestFor: 'CTOs, VPs, Directors, Chief of Staff, Founders',
    previewClass: 'border-slate-400 bg-white text-slate-950',
    color: '#09090b'
  }
];

export const INITIAL_RESUME: ResumeData = {
  id: 'resume-sample-1',
  title: 'Senior Software Engineer (ATS Optimized)',
  targetRole: 'Senior Full Stack Engineer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'alex.morgan.dev@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgandev',
    github: 'github.com/alexmorgandev',
    portfolio: 'alexmorgandev.io',
  },
  summary: {
    tone: 'Professional',
    text: 'Results-driven Senior Full Stack Software Engineer with 6+ years of experience architecting high-throughput distributed systems and responsive web applications using React, Next.js, Node.js, and AWS. Proven track record of reducing latency by 42% and scaling SaaS platforms to 2M+ active monthly users while leading high-performing agile engineering teams.'
  },
  experience: [
    {
      id: 'exp-1',
      company: 'CloudScale Technologies',
      position: 'Senior Full Stack Engineer',
      employmentType: 'Full-time',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      bulletPoints: [
        'Architected and deployed microservices-based analytics pipeline utilizing Node.js, TypeScript, and Kafka, handling 15M+ daily events with 99.99% uptime.',
        'Engineered responsive Next.js frontend with Tailwind CSS and TanStack Query, decreasing page load time by 42% and boosting Core Web Vitals to 98.',
        'Spearheaded migration from legacy monolith to serverless AWS infrastructure (Lambda, DynamoDB, API Gateway), trimming monthly cloud expenditures by $35,000.',
        'Mentored 6 junior and mid-level engineers, implemented strict automated PR review standards, and raised test coverage from 64% to 91% using Jest and Playwright.'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'Kafka', 'PostgreSQL', 'Docker'],
      achievements: ['Won Company Innovation Award Q3 2023', 'Cut deployment turnaround time by 60%']
    },
    {
      id: 'exp-2',
      company: 'Apex Digital Solutions',
      position: 'Software Engineer',
      employmentType: 'Full-time',
      location: 'Austin, TX (Remote)',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      bulletPoints: [
        'Developed customer-facing e-commerce checkout workflow processing $18M in quarterly gross merchandise value with zero transaction failures.',
        'Optimized PostgreSQL relational database queries and indexed heavy tables, slashing average query response latency from 850ms to 95ms.',
        'Built automated CI/CD pipeline with GitHub Actions, accelerating release velocity from bi-weekly releases to continuous daily deployments.',
        'Collaborated closely with product managers and UX designers to build accessible (WCAG 2.1 AA) design system components.'
      ],
      technologies: ['React', 'Redux', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions']
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2015-08',
      endDate: '2019-05',
      current: false,
      gpa: '3.82 / 4.0',
      coursework: ['Data Structures & Algorithms', 'Distributed Systems', 'Database Systems', 'Computer Networks'],
      honors: 'Dean’s Honor List (6 Semesters), Magna Cum Laude'
    }
  ],
  skills: {
    technical: ['Distributed Systems', 'RESTful APIs', 'GraphQL', 'Microservices', 'CI/CD Automation', 'System Design'],
    programming: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'SQL', 'Go', 'HTML5/CSS3'],
    frameworks: ['React.js', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'FastAPI'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS (S3, Lambda, ECS)', 'PostgreSQL', 'Redis', 'Kafka'],
    soft: ['Technical Leadership', 'Cross-functional Collaboration', 'Agile / Scrum', 'Mentorship', 'Code Review'],
    domain: ['FinTech', 'E-Commerce', 'SaaS Architecture', 'Cloud Infrastructure', 'Web Performance']
  },
  projects: [
    {
      id: 'proj-1',
      name: 'OmniStream: Real-time Collaboration Engine',
      description: 'Distributed document editing tool featuring CRDT conflict resolution and sub-50ms synchronization.',
      role: 'Lead Architect & Creator',
      technologies: ['TypeScript', 'WebSockets', 'Yjs', 'Redis', 'Docker'],
      liveUrl: 'https://omnistream.demo.dev',
      githubUrl: 'https://github.com/alexmorgandev/omnistream',
      bulletPoints: [
        'Implemented Conflict-free Replicated Data Types (CRDTs) to ensure deterministic real-time concurrent editing across 500+ active peers.',
        'Constructed custom WebSocket gateway in Go handling 50,000 persistent connections with minimal memory footprint.'
      ]
    },
    {
      id: 'proj-2',
      name: 'PulseMetrics: Cloud Cost Observability CLI',
      description: 'Open-source CLI tool that monitors AWS resource idle time and estimates cost savings.',
      role: 'Open Source Maintainer',
      technologies: ['Python', 'AWS SDK', 'Click', 'Rich'],
      githubUrl: 'https://github.com/alexmorgandev/pulse-metrics',
      bulletPoints: [
        'Garnered 1,200+ GitHub stars and was adopted by 40+ engineering organizations to optimize cloud infrastructure waste.',
        'Automated orphaned volume and unattached IP discovery, saving average users 18% on monthly AWS bills.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023-04',
      expiryDate: '2026-04',
      credentialId: 'AWS-PSA-889104',
      credentialUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: '2022-11',
      credentialId: 'CKA-992384'
    }
  ],
  additionalSections: {
    internships: [],
    awards: [
      {
        id: 'award-1',
        title: 'Outstanding Technical Contribution Award',
        organization: 'CloudScale Technologies',
        date: '2023',
        description: 'Awarded for architecting the event pipeline that prevented critical Black Friday outages.'
      }
    ],
    publications: [],
    volunteer: [
      {
        id: 'vol-1',
        title: 'Volunteer Coding Mentor',
        organization: 'Underrepresented Tech Coders',
        date: '2021 - Present',
        description: 'Taught web development and algorithmic thinking to 30+ underprivileged youth.'
      }
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'Proficient' }
    ],
    leadership: [],
    extracurricular: []
  },
  formatting: {
    template: 'classic-ats',
    font: 'inter',
    fontSize: 'normal',
    spacing: 'normal',
    margins: 'normal',
    primaryColor: '#0f172a',
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'additional'],
    showIcons: false,
    showDividers: true
  }
};

export const JOB_DESCRIPTION_PRESETS = [
  {
    id: 'job-swe',
    title: 'Senior Full Stack Engineer',
    company: 'NextGen Cloud Corp',
    description: `We are seeking an experienced Senior Full Stack Engineer to build next-generation distributed systems and scalable SaaS applications.
Responsibilities:
- Architect and develop scalable web applications using React, Next.js, Node.js, and TypeScript.
- Design high-performance RESTful APIs, GraphQL endpoints, and event-driven architectures with Kafka or RabbitMQ.
- Lead cloud infrastructure deployment and orchestration on AWS (ECS, Lambda, S3, RDS) and Docker.
- Optimize database queries, caching layers (Redis), and PostgreSQL schema performance.
- Collaborate with product management, UX designers, and QA to deliver clean, maintainable code with high unit and integration test coverage.
Requirements:
- 5+ years of full stack web development experience.
- Strong proficiency in modern JavaScript/TypeScript, React, Node.js, and SQL.
- Hands-on experience with cloud computing (AWS/GCP), containerization (Docker/Kubernetes), and CI/CD pipelines.
- Demonstrated experience improving page latency, Core Web Vitals, and system scalability.
- Excellent communication skills, mentorship experience, and agile team leadership.`
  },
  {
    id: 'job-da',
    title: 'Senior Data Analyst / Analytics Engineer',
    company: 'FinMetrics Global',
    description: `FinMetrics Global is looking for a Senior Data Analyst to empower business executives with data-driven insights, predictive models, and intuitive dashboards.
Key Responsibilities:
- Build, optimize, and maintain complex SQL queries, data models, and ETL pipelines in Snowflake / BigQuery.
- Create executive dashboards and interactive reports using Tableau, Power BI, or Looker.
- Conduct deep exploratory data analysis (EDA) using Python (Pandas, NumPy, Scikit-learn) or R.
- Define and track key business metrics, cohort retention, customer lifetime value (LTV), and churn indicators.
- Partner with product and engineering teams to ensure tracking data integrity and A/B test experimentation rigor.
Requirements:
- 4+ years of data analytics or business intelligence experience.
- Mastery of advanced SQL, relational databases, and data warehousing principles.
- Proficiency in Python or R for statistical analysis and data manipulation.
- Experience with visualization tools like Tableau, Looker, or Power BI.
- Strong business acumen and capability to communicate insights to non-technical stakeholders.`
  },
  {
    id: 'job-pm',
    title: 'Technical Product Manager',
    company: 'Starlight Software',
    description: `We need a high-impact Technical Product Manager to lead our developer platform and API ecosystem.
Responsibilities:
- Define product vision, roadmap, and quarterly OKRs for our developer-facing API platform.
- Write crisp PRDs, user stories, and acceptance criteria in Jira.
- Conduct customer interviews, market analysis, and user research to uncover developer pain points.
- Lead cross-functional sprint planning, backlog grooming, and standups in an Agile environment.
- Measure product KPIs, activation rates, and feature adoption using Mixpanel and SQL.
Requirements:
- 3+ years in technical product management or software engineering.
- Deep understanding of API design, developer workflows, and cloud SaaS platforms.
- Proven track record of launching successful software products from concept to scale.`
  }
];

