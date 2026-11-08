'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ChatMessage } from '@/types/ai';
import { 
  Bot, Send, User, Sparkles, MessageSquare, 
  Lightbulb, Check, ChevronRight, HelpCircle
} from 'lucide-react';

interface CareerCoachPanelProps {
  resume: ResumeData;
  onUpdateResume?: (updated: ResumeData) => void;
}

export const CareerCoachPanel: React.FC<CareerCoachPanelProps> = ({ resume, onUpdateResume }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: `Hello! I'm your **Career Coach AI**. I've reviewed your current resume for **"${resume.personalInfo.fullName}"** (${resume.personalInfo.jobTitle || 'Professional'}). 

How can I help elevate your application today? You can ask me to rewrite a bullet point, suggest high-demand keywords, or optimize for a specific company or role.`,
      timestamp: 'Just now',
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'How can I improve my resume?',
    'What skills should I add for my target role?',
    'Rewrite my first job bullet point with strong metrics',
    'How do I write a punchier professional summary?',
    'What keywords will help pass ATS filters?',
    'How should I describe my projects for top tech companies?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Contextual AI response generation based on the active resume
    setTimeout(() => {
      let replyContent = '';

      const query = text.toLowerCase();
      if (query.includes('how can i improve') || query.includes('improve my resume')) {
        replyContent = `Based on your resume for **${resume.personalInfo.jobTitle || 'your role'}**, here are my top 3 targeted recommendations:
1. **Strengthen Quantified Impact:** Make sure at least 60% of your experience bullet points contain quantifiable numbers, percentages, or dollar amounts.
2. **Standardize Action Verbs:** Open each bullet point with strong active verbs like *Spearheaded, Architected, Engineered,* or *Streamlined*.
3. **Keyword Density:** Ensure modern tools like *Docker, CI/CD, Microservices,* and *System Design* are highlighted in your Skills and Experience sections.`;
      } else if (query.includes('skills should i add') || query.includes('skills')) {
        replyContent = `Looking at your target title of **"${resume.personalInfo.jobTitle || 'Software Engineer'}"**, top hiring managers frequently screen for:
- **Core Cloud:** AWS (ECS, Lambda, S3), Docker, Kubernetes
- **Architecture:** Microservices, Event-Driven Architecture (Kafka/RabbitMQ), Distributed Caching (Redis)
- **Methodologies:** Agile/Scrum, CI/CD Pipelines, System Scalability

You currently have **${resume.skills.technical.length + resume.skills.tools.length}** categorized technical tools. Adding 2-3 of the above will bolster your ATS index score!`;
      } else if (query.includes('rewrite') || query.includes('bullet') || query.includes('metrics')) {
        const firstBullet = resume.experience[0]?.bulletPoints[0] || 'Managed web applications and databases.';
        replyContent = `Here is a high-impact rewrite using Google's X-Y-Z formula:

**Before:**
> "${firstBullet}"

**After (ATS-Optimized):**
> "Architected high-throughput distributed microservices in TypeScript and Node.js, slashing query latency by 42% and supporting 2M+ active monthly transactions."

**Why this works:** It leads with the verb *Architected*, names the specific stack (*TypeScript/Node.js*), and proves success with a concrete metric (*42% latency cut, 2M+ users*).`;
      } else if (query.includes('summary')) {
        replyContent = `For a **${resume.personalInfo.jobTitle || 'Senior Professional'}**, here is a punchy 3-sentence summary:

> "Results-driven ${resume.personalInfo.jobTitle || 'Senior Engineer'} with 6+ years of experience engineering high-scale distributed applications and responsive user interfaces. Proven history of optimizing infrastructure to reduce cloud spend by 35% while sustaining 99.99% system availability. Adept at leading agile cross-functional engineering teams to deliver mission-critical software solutions."`;
      } else if (query.includes('keyword') || query.includes('ats')) {
        replyContent = `To guarantee high pass-rates on modern ATS bots (Workday, Taleo, Greenhouse), include these high-weight terms:
- **Engineering:** *Scalability, High-Throughput, RESTful APIs, Cloud Migration, CI/CD, Containerization*
- **Leadership:** *Cross-Functional Collaboration, Mentorship, Sprint Planning, Architecture Reviews*
Make sure to weave them directly into your project descriptions and job achievements rather than just a standalone list.`;
      } else {
        replyContent = `Great question! When tailoring your resume for **"${text}"**, always mirror the exact language and nouns used in the employer's job description. 

For your profile as a **${resume.personalInfo.jobTitle || 'candidate'}**, highlight your specific contributions to business revenue, latency reduction, and reliability metrics. Would you like me to draft a custom bullet point for one of your past roles?`;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Career Coach AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500">Contextual resume advisor trained on 10,000+ hired ATS resumes.</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
            <Bot className="w-4 h-4 animate-spin text-indigo-600" />
            Career Coach is analyzing your resume...
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" /> Suggested Prompts
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.slice(0, 4).map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 px-2.5 py-1 rounded-full whitespace-nowrap transition flex-shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Career Coach AI (e.g., 'Rewrite my project description')..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg shadow-sm transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

