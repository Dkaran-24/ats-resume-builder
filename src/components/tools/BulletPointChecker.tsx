'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Zap, Copy, Check, ArrowRight } from 'lucide-react';
import { generateImprovedBullet } from '@/lib/ai-agent';

export const BulletPointChecker: React.FC = () => {
  const [inputBullet, setInputBullet] = useState(
    'Responsible for building backend services and helped the team improve website speed.'
  );
  const [copied, setCopied] = useState(false);

  // Analysis Heuristics
  const words = inputBullet.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const firstWord = words[0]?.replace(/[^a-zA-Z]/g, '').toLowerCase() || '';

  const weakStarters = ['responsible', 'worked', 'helped', 'assisted', 'handled', 'was', 'did', 'managed'];
  const hasWeakStarter = weakStarters.includes(firstWord);

  const hasNumbers = /(\d+%?|\$\d+|\d+\s*(users|clients|ms|hours|days|releases|x|reduction|increase))/i.test(inputBullet);
  const hasFiller = inputBullet.toLowerCase().includes('in order to') || inputBullet.toLowerCase().includes('duties included');
  const endsWithPeriod = inputBullet.trim().endsWith('.');

  // Calculate bullet score
  let score = 100;
  if (hasWeakStarter) score -= 30;
  if (!hasNumbers) score -= 35;
  if (hasFiller) score -= 15;
  if (!endsWithPeriod) score -= 5;
  if (wordCount < 8) score -= 20;
  if (wordCount > 35) score -= 15;
  score = Math.max(10, Math.min(100, score));

  const improvedVersion = generateImprovedBullet(inputBullet);

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedVersion);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center gap-2">
        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Zap className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-base font-bold text-slate-900">Bullet Point Quality Sandbox</h3>
          <p className="text-xs text-slate-500">Benchmark any bullet point against Google's X-Y-Z formula.</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Test Your Bullet Point
        </label>
        <textarea
          rows={3}
          value={inputBullet}
          onChange={e => setInputBullet(e.target.value)}
          placeholder="Paste any bullet point to test..."
          className="w-full p-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
        />
      </div>

      {/* Score & Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center sm:col-span-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Impact Score</div>
          <div className={`text-2xl font-black mt-0.5 ${
            score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {score}/100
          </div>
        </div>

        <div className="sm:col-span-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            {hasWeakStarter ? (
              <span className="text-rose-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Weak opener "{firstWord}"
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strong active opening verb
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasNumbers ? (
              <span className="text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quantifiable metrics detected (%, numbers)
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Missing measurable metrics or outcome
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`${wordCount >= 10 && wordCount <= 28 ? 'text-emerald-600' : 'text-slate-500'} flex items-center gap-1 font-medium`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {wordCount} words (Ideal: 12-25 words)
            </span>
          </div>
        </div>
      </div>

      {/* AI Enhanced Version */}
      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            AI Optimized Bullet Point
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-md border border-emerald-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
          "{improvedVersion}"
        </p>
      </div>
    </div>
  );
};

