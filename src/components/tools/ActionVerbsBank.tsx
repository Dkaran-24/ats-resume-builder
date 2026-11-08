'use client';

import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check } from 'lucide-react';

export const ActionVerbsBank: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const verbsData: Record<string, string[]> = {
    'Leadership & Strategy': [
      'Spearheaded', 'Orchestrated', 'Mobilized', 'Championed', 'Directed',
      'Restructured', 'Steered', 'Empowered', 'Cultivated', 'Mentored',
      'Unified', 'Pioneered', 'Architected', 'Supervised', 'Delegated'
    ],
    'Technical & Engineering': [
      'Engineered', 'Architected', 'Refactored', 'Automated', 'Deployed',
      'Programmed', 'Configured', 'Consolidated', 'Containerized', 'Decoupled',
      'Migrated', 'Instrumented', 'Optimized', 'Debugged', 'Standardized'
    ],
    'Efficiency & Optimization': [
      'Accelerated', 'Streamlined', 'Trimmed', 'Maximized', 'Revamped',
      'Elevated', 'Expedited', 'Restructured', 'Overhauled', 'Downsized',
      'Modernized', 'Sharpened', 'Augmented', 'Amplified', 'Consolidated'
    ],
    'Execution & Production': [
      'Delivered', 'Launched', 'Generated', 'Established', 'Procured',
      'Instituted', 'Negotiated', 'Secured', 'Formulated', 'Produced',
      'Constructed', 'Finalized', 'Realized', 'Propelled', 'Scaled'
    ],
    'Analytics & Research': [
      'Evaluated', 'Synthesized', 'Quantified', 'Audited', 'Modeled',
      'Forecasted', 'Benchmarked', 'Investigated', 'Surveyed', 'Correlated',
      'Discovered', 'Diagnosed', 'Identified', 'Interpreted', 'Extracted'
    ]
  };

  const categories = Object.keys(verbsData);

  const handleCopy = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedWord(verb);
    setTimeout(() => setCopiedWord(null), 1200);
  };

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : [selectedCategory];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Action Verbs Library</h3>
            <p className="text-xs text-slate-500">100+ high-converting verbs categorized to replace weak phrases.</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search verbs..."
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-44"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full font-medium transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Verbs Grid */}
      <div className="space-y-4">
        {filteredCategories.map(cat => {
          const verbs = verbsData[cat].filter(v => v.toLowerCase().includes(search.toLowerCase()));
          if (verbs.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {cat}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {verbs.map(verb => {
                  const isCopied = copiedWord === verb;

                  return (
                    <button
                      key={verb}
                      onClick={() => handleCopy(verb)}
                      title="Click to copy verb"
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition flex items-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:border-indigo-400 shadow-2xs'
                      }`}
                    >
                      <span>{verb}</span>
                      {isCopied && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

