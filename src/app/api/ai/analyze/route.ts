import { NextResponse } from 'next/server';
import { calculateATSScore } from '@/lib/ats-scorer';
import { analyzeResumeForIssues } from '@/lib/ai-agent';
import { ResumeData } from '@/types/resume';

export async function POST(req: Request) {
  try {
    const resume: ResumeData = await req.json();
    if (!resume) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
    }

    const atsScoreResult = calculateATSScore(resume);
    const issues = analyzeResumeForIssues(resume);

    return NextResponse.json({
      success: true,
      score: atsScoreResult,
      issues: issues
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}

