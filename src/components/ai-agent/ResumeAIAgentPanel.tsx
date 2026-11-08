'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ProposedChange, AIResumeAgentResponse } from '@/types/ai';
import { 
  Sparkles, Send, CheckCircle2, XCircle, ArrowRight, 
  RotateCcw, Undo2, Key, AlertCircle, FileText, Check, 
  ChevronDown, ChevronUp, Bot, ExternalLink, HelpCircle, Loader2
} from 'lucide-react';

interface ResumeAIAgentPanelProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onClose?: () => void;
}

interface MessageHistoryItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  proposedChanges?: ProposedChange[];
  pendingUpdatedResume?: ResumeData;
  isApplied?: boolean;
  isRejected?: boolean;
  isResumeRelated?: boolean;
}

export const ResumeAIAgentPanel: React.FC<ResumeAIAgentPanelProps> = ({
  resume,
  onUpdateResume,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [showJobDescInput, setShowJobDescInput] = useState(false);
  const [sessionApiKey, setSessionApiKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ message: string; code?: string } | null>(null);
  const [lastUndoResume, setLastUndoResume] = useState<ResumeData | null>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    'Rewrite my professional summary to be more punchy and impactful',
    'Make my work experience bullet points stronger using action verbs',
    'Organize my skills into technical, frameworks, and tools',
    'Make this resume suitable for a fresher / entry-level role',
    'Make my resume one page and remove fluff words',
    'Improve ATS readability and sentence structures',
    'Tailor my resume for a Senior Software Engineer job description'
  ];

  // Conversation history
  const [messages, setMessages] = useState<MessageHistoryItem[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am your **Resume AI Agent**. I have full context of your resume for **"${resume.personalInfo.fullName || 'Professional'}"** (${resume.personalInfo.jobTitle || 'Your Role'}).

Tell me how you would like to edit or improve your resume. I will propose structured changes that you can review and accept with one click!`,
      timestamp: 'Just now',
      isResumeRelated: true
    }
  ]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    setErrorBanner(null);

    const userMsgItem: MessageHistoryItem = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsgItem]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (sessionApiKey.trim()) {
        headers['x-ai-api-key'] = sessionApiKey.trim();
      }

      const response = await fetch('/api/ai/resume-agent', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userMessage: textToSend,
          currentResume: resume,
          targetJobDescription: jobDescriptionInput.trim() || undefined
        })
      });

      const data: AIResumeAgentResponse = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === 'API_KEY_MISSING') {
          setErrorBanner({
            message: data.message || 'AI API key is missing. Please configure GEMINI_API_KEY in your server .env.local file.',
            code: 'API_KEY_MISSING'
          });
          setShowKeyConfig(true);
        } else {
          setErrorBanner({
            message: data.message || data.error || 'Failed to process AI resume request.',
            code: data.code
          });
        }

        const botErrMsg: MessageHistoryItem = {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: data.message || 'Error occurred while contacting the AI model. See configuration above.',
          timestamp: 'Just now',
          isResumeRelated: false
        };
        setMessages(prev => [...prev, botErrMsg]);
        return;
      }

      // Successful response with proposed changes
      const botMsgItem: MessageHistoryItem = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: 'Just now',
        proposedChanges: data.proposedChanges || [],
        pendingUpdatedResume: data.updatedResume,
        isApplied: false,
        isRejected: false,
        isResumeRelated: data.isResumeRelated
      };

      setMessages(prev => [...prev, botMsgItem]);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorBanner({
        message: 'Network or server error while connecting to AI Agent API.',
        code: 'NETWORK_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  // Accept changes -> update actual resume editor & live preview!
  const handleAcceptChanges = (messageId: string, updatedResumeData?: ResumeData) => {
    if (!updatedResumeData) return;

    // Save previous for Undo
    setLastUndoResume(JSON.parse(JSON.stringify(resume)));

    // Apply to actual resume
    onUpdateResume(updatedResumeData);

    // Mark message as applied
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isApplied: true, isRejected: false } : msg
      )
    );
  };

  // Reject changes
  const handleRejectChanges = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRejected: true, isApplied: false } : msg
      )
    );
  };

  // Undo last applied changes
  const handleUndo = () => {
    if (!lastUndoResume) return;
    onUpdateResume(lastUndoResume);
    setLastUndoResume(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      {/* Agent Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Resume AI Agent
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Connected to Active Resume
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Proposes structured changes that update your actual resume upon approval.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastUndoResume && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Undo last accepted change"
            >
              <Undo2 className="w-3.5 h-3.5 text-slate-600" /> Undo
            </button>
          )}

          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Configure Server AI API Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Configuration Accordion / Notice */}
      {showKeyConfig && (
        <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <strong className="text-indigo-900 font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" /> Server-Side AI API Configuration
            </strong>
            <button onClick={() => setShowKeyConfig(false)} className="text-indigo-600 font-bold">×</button>
          </div>
          <p className="text-indigo-800 text-[11px] leading-relaxed">
            The AI Agent connects server-side via <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> or <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">OPENAI_API_KEY</code> in <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">.env.local</code>. You can also supply a key below for your active session:
          </p>
          <div className="flex gap-2 pt-1">
            <input
              type="password"
              value={sessionApiKey}
              onChange={e => setSessionApiKey(e.target.value)}
              placeholder="Paste Gemini (AIza...) or OpenAI (sk-...) API key for this session"
              className="flex-1 px-3 py-1.5 text-xs border border-indigo-200 bg-white rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                setShowKeyConfig(false);
                setErrorBanner(null);
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Error / Key Missing Banner */}
      {errorBanner && (
        <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">AI Configuration Notice: </strong>
              <span>{errorBanner.message}</span>
              {errorBanner.code === 'API_KEY_MISSING' && (
                <div className="mt-1 text-[11px] text-rose-700">
                  Tip: Create a <code className="font-mono bg-rose-100 px-1 rounded">.env.local</code> file in your project root with <code className="font-mono bg-rose-100 px-1 rounded">GEMINI_API_KEY=your_key</code> or click the key icon above.
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-rose-400 hover:text-rose-700 font-bold">×</button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
              }`}
            >
              {/* Message text content */}
              <div className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</div>

              {/* Proposed Changes Review Box */}
              {msg.proposedChanges && msg.proposedChanges.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-indigo-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      Proposed Changes ({msg.proposedChanges.length})
                    </span>
                    {msg.isApplied && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied to Resume
                      </span>
                    )}
                    {msg.isRejected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* List of changes with Before & After diff */}
                  <div className="space-y-2">
                    {msg.proposedChanges.map((change, cIdx) => (
                      <div key={change.id || cIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 capitalize text-xs">
                            {change.title || `${change.section} improvement`}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {change.section}
                          </span>
                        </div>

                        {change.before && (
                          <div className="p-2 bg-red-50/50 rounded border border-red-100 text-[11px]">
                            <span className="text-red-700 font-semibold block mb-0.5">Original:</span>
                            <span className="text-slate-600 line-through">{change.before}</span>
                          </div>
                        )}

                        <div className="p-2 bg-emerald-50/50 rounded border border-emerald-100 text-[11px]">
                          <span className="text-emerald-700 font-semibold block mb-0.5">Proposed Version:</span>
                          <span className="text-slate-900 font-medium">{change.after}</span>
                        </div>

                        {change.reason && (
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            <strong>Why: </strong>{change.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Accept / Reject Controls */}
                  {!msg.isApplied && !msg.isRejected && msg.pendingUpdatedResume && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleRejectChanges(msg.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptChanges(msg.id, msg.pendingUpdatedResume)}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept & Apply Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={`text-[10px] ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'} text-right pt-0.5`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 max-w-[85%]">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 flex-shrink-0" />
            <span>AI Resume Agent is analyzing your resume and generating proposed edits...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Resume Instructions
          </span>
          <button
            onClick={() => setShowJobDescInput(!showJobDescInput)}
            className="text-[10px] font-bold text-indigo-600 hover:underline"
          >
            {showJobDescInput ? '− Hide Job Description' : '+ Add Job Description for Targeted Tailoring'}
          </button>
        </div>

        {/* Optional Job Description Box */}
        {showJobDescInput && (
          <div className="mb-2 p-2 bg-white rounded-lg border border-indigo-200 space-y-1">
            <label className="block text-[10px] font-bold text-indigo-900 uppercase">
              Target Job Description (Optional context for AI tailoring)
            </label>
            <textarea
              rows={2}
              value={jobDescriptionInput}
              onChange={e => setJobDescriptionInput(e.target.value)}
              placeholder="Paste job requirements here to tailor your resume specifically for this position..."
              className="w-full p-1.5 text-xs border border-slate-200 rounded outline-none"
            />
          </div>
        )}

        {/* Suggested Prompts Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedPrompts.slice(0, 4).map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 px-3 py-1 rounded-full whitespace-nowrap transition shadow-2xs flex-shrink-0 disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask AI Resume Agent (e.g., 'Rewrite my summary', 'Make my experience suitable for a fresher')..."
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

