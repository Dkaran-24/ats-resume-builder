import { NextResponse } from 'next/server';
import { AIResumeAgentRequest, AIResumeAgentResponse, ProposedChange } from '@/types/ai';
import { ResumeData } from '@/types/resume';

const SYSTEM_INSTRUCTIONS = `You are ResumeForge AI Resume Agent — a dedicated, professional AI resume editor and ATS consultant.

CORE PRINCIPLES:
1. FOCUS ONLY ON RESUME BUILDING: You help users create, edit, improve, customize, format, and optimize resumes for ATS. You are NOT a general career counselor, job board, or interview coach.
2. POLITENESS REDIRECT: If the user asks an unrelated question (e.g., general trivia, interview practice questions, job search recommendations, unrelated general knowledge), set "isResumeRelated": false, provide an empty "proposedChanges" array, keep "updatedResume" unchanged, and politely state that you are dedicated exclusively to resume building and invite them to ask for resume assistance.
3. ABSOLUTE FACTUAL INTEGRITY:
   - NEVER invent fake companies, jobs, universities, degrees, or certifications.
   - NEVER invent fabricated metrics or claims the user did not make.
   - You MAY reframe existing tasks into high-converting achievement statements using strong action verbs (e.g., "Spearheaded", "Architected", "Accelerated") and suggest metric placeholders if quantifiable data is missing.
4. JOB DESCRIPTION ASSISTANCE: If the user provides a job description to tailor their resume, use the job description ONLY to weave authentic matching keywords and emphasize relevant existing experience. NEVER invent qualifications.
5. STRUCTURED RESPONSE FORMAT: You MUST return a strictly valid JSON object with the following schema:
{
  "isResumeRelated": true,
  "message": "Clear conversational explanation of the changes made and why they improve the resume.",
  "targetSections": ["summary", "experience", ...],
  "proposedChanges": [
    {
      "id": "change-1",
      "section": "summary" | "experience" | "skills" | "education" | "projects" | "personalInfo",
      "title": "Short title of change",
      "before": "Original text or snippet",
      "after": "Improved text or snippet",
      "reason": "Why this change makes the resume stronger and more ATS-friendly"
    }
  ],
  "updatedResume": {
    // Complete, valid ResumeData object reflecting all accepted changes
  }
}`;

export async function POST(req: Request) {
  try {
    // 1. Validate Input Body
    let body: AIResumeAgentRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: false,
          message: 'Invalid JSON request payload.',
          error: 'Malformed request body.',
          code: 'INVALID_REQUEST',
          proposedChanges: []
        },
        { status: 400 }
      );
    }

    const { userMessage, currentResume, targetJobDescription } = body;

    // Validate user message presence
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: false,
          message: 'Please provide a message or instruction for the AI Resume Agent.',
          error: 'User message cannot be empty.',
          code: 'INVALID_REQUEST',
          proposedChanges: []
        },
        { status: 400 }
      );
    }

    // Validate message length limit
    if (userMessage.length > 8000) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: false,
          message: 'Your instruction is too long. Please keep your message under 8,000 characters.',
          error: 'User message exceeds 8,000 character limit.',
          code: 'INVALID_REQUEST',
          proposedChanges: []
        },
        { status: 400 }
      );
    }

    if (!currentResume || typeof currentResume !== 'object' || !currentResume.personalInfo) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: false,
          message: 'A valid active resume is required to perform edits.',
          error: 'Missing valid currentResume object.',
          code: 'INVALID_REQUEST',
          proposedChanges: []
        },
        { status: 400 }
      );
    }

    // 2. Resolve Server-Side API Key
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const headerKey = req.headers.get('x-ai-api-key')?.trim();

    const activeKey = geminiKey || openAiKey || headerKey;

    if (!activeKey) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: false,
          message: 'AI API key is missing. Please configure GEMINI_API_KEY (recommended) or OPENAI_API_KEY in your .env.local file on the server.',
          error: 'AI_API_KEY_MISSING: Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured.',
          code: 'API_KEY_MISSING',
          configuredEnvVars: ['GEMINI_API_KEY', 'OPENAI_API_KEY'],
          proposedChanges: []
        },
        { status: 401 }
      );
    }

    // 3. Call Real AI Model
    // We check if it's an OpenAI key (starts with 'sk-') or Gemini key
    const isOpenAi = openAiKey ? true : (headerKey?.startsWith('sk-') || false);

    if (isOpenAi) {
      return await callOpenAI(activeKey, userMessage, currentResume, targetJobDescription);
    } else {
      return await callGemini(activeKey, userMessage, currentResume, targetJobDescription);
    }
  } catch (err: any) {
    console.error('AI Resume Agent internal error:', err);
    return NextResponse.json<AIResumeAgentResponse>(
      {
        success: false,
        isResumeRelated: false,
        message: 'An internal server error occurred while processing your resume with AI.',
        error: err.message || 'Unknown internal error',
        code: 'API_ERROR',
        proposedChanges: []
      },
      { status: 500 }
    );
  }
}

// Gemini API Handler
async function callGemini(
  apiKey: string,
  userMessage: string,
  currentResume: ResumeData,
  targetJobDescription?: string
): Promise<NextResponse<AIResumeAgentResponse>> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `
CURRENT RESUME DATA (JSON):
${JSON.stringify(currentResume, null, 2)}

${targetJobDescription ? `TARGET JOB DESCRIPTION TO ASSIST IN TAILORING:\n${targetJobDescription}\n` : ''}

USER INSTRUCTION:
"${userMessage}"

Respond strictly with valid JSON following the schema. Return the complete updated resume in updatedResume.`;

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTIONS }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.2
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI model rate limit was reached. Please wait a few moments and try again.',
          error: 'Rate limit exceeded (HTTP 429).',
          code: 'RATE_LIMIT',
          proposedChanges: []
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error response:', response.status, errText);
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: `AI service error (${response.status}). Please check your API key validity or try again.`,
          error: errText,
          code: 'API_ERROR',
          proposedChanges: []
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI returned an empty response. Please try rephrasing your request.',
          error: 'Empty candidate text returned by Gemini.',
          code: 'MALFORMED_RESPONSE',
          proposedChanges: []
        },
        { status: 502 }
      );
    }

    // Parse JSON safely
    let parsed: any;
    try {
      parsed = JSON.parse(candidateText);
    } catch (parseError: any) {
      console.error('Failed to parse Gemini output as JSON:', candidateText);
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI generated an invalid JSON response. Please try again.',
          error: `JSON Parse error: ${parseError.message}`,
          code: 'MALFORMED_RESPONSE',
          proposedChanges: []
        },
        { status: 502 }
      );
    }

    // Validate structured resume data
    const updatedResume = parsed.updatedResume || currentResume;
    if (!updatedResume.personalInfo || !updatedResume.summary) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI proposed changes with an incomplete resume structure.',
          error: 'Invalid updatedResume structure in AI output.',
          code: 'MALFORMED_RESPONSE',
          proposedChanges: []
        },
        { status: 502 }
      );
    }

    return NextResponse.json<AIResumeAgentResponse>({
      success: true,
      isResumeRelated: parsed.isResumeRelated ?? true,
      message: parsed.message || 'Resume successfully updated.',
      targetSections: parsed.targetSections || [],
      proposedChanges: parsed.proposedChanges || [],
      updatedResume: updatedResume
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI request timed out. Please try again.',
          error: 'Request timed out after 25 seconds.',
          code: 'TIMEOUT',
          proposedChanges: []
        },
        { status: 504 }
      );
    }
    throw err;
  }
}

// OpenAI API Handler
async function callOpenAI(
  apiKey: string,
  userMessage: string,
  currentResume: ResumeData,
  targetJobDescription?: string
): Promise<NextResponse<AIResumeAgentResponse>> {
  const url = 'https://api.openai.com/v1/chat/completions';

  const promptText = `
CURRENT RESUME DATA (JSON):
${JSON.stringify(currentResume, null, 2)}

${targetJobDescription ? `TARGET JOB DESCRIPTION TO ASSIST IN TAILORING:\n${targetJobDescription}\n` : ''}

USER INSTRUCTION:
"${userMessage}"

Respond strictly with valid JSON following the schema. Return the complete updated resume in updatedResume.`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTIONS },
      { role: 'user', content: promptText }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'OpenAI rate limit exceeded. Please wait a moment and try again.',
          error: 'Rate limit exceeded (HTTP 429).',
          code: 'RATE_LIMIT',
          proposedChanges: []
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: `OpenAI service error (${response.status}). Please verify your OpenAI key.`,
          error: errText,
          code: 'API_ERROR',
          proposedChanges: []
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'OpenAI returned an empty response.',
          error: 'Empty response choice from OpenAI.',
          code: 'MALFORMED_RESPONSE',
          proposedChanges: []
        },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json<AIResumeAgentResponse>({
      success: true,
      isResumeRelated: parsed.isResumeRelated ?? true,
      message: parsed.message || 'Resume successfully updated.',
      targetSections: parsed.targetSections || [],
      proposedChanges: parsed.proposedChanges || [],
      updatedResume: parsed.updatedResume || currentResume
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return NextResponse.json<AIResumeAgentResponse>(
        {
          success: false,
          isResumeRelated: true,
          message: 'The AI request timed out. Please try again.',
          error: 'Request timed out after 25 seconds.',
          code: 'TIMEOUT',
          proposedChanges: []
        },
        { status: 504 }
      );
    }
    throw err;
  }
}

