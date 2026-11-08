'use client';

import React from 'react';
import { ResumeData, TemplateId, ResumeFormatting } from '@/types/resume';
import { TEMPLATE_CONFIGS } from '@/lib/constants';
import { 
  Palette, Type, Layout, Sliders, CheckCircle2, 
  Sparkles, Check, Wand2
} from 'lucide-react';

interface TemplateSelectorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ resume, onChange }) => {
  const formatting = resume.formatting || {
    template: 'classic-ats',
    font: 'inter',
    fontSize: 'normal',
    spacing: 'normal',
    margins: 'normal',
    primaryColor: '#0f172a',
    sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'additional'],
    showIcons: false,
    showDividers: true
  };

  const updateFormatting = (partial: Partial<ResumeFormatting>) => {
    const updated: ResumeData = JSON.parse(JSON.stringify(resume));
    updated.formatting = { ...formatting, ...partial };
    onChange(updated);
  };

  const autoFixFormattingAI = () => {
    const updated: ResumeData = JSON.parse(JSON.stringify(resume));
    // Standardize dates to YYYY-MM
    updated.experience.forEach(exp => {
      if (exp.startDate && !exp.startDate.includes('-') && exp.startDate.length === 4) {
        exp.startDate = `${exp.startDate}-01`;
      }
      // Ensure bullet points end with periods
      exp.bulletPoints = exp.bulletPoints.map(bp => bp.trim().endsWith('.') ? bp.trim() : `${bp.trim()}.`);
    });
    // Set optimal ATS formatting presets
    updated.formatting.font = 'inter';
    updated.formatting.fontSize = 'normal';
    updated.formatting.spacing = 'normal';
    updated.formatting.margins = 'normal';
    updated.formatting.showDividers = true;
    onChange(updated);
  };

  const colorOptions = [
    { name: 'Classic Slate', hex: '#0f172a' },
    { name: 'Indigo Corporate', hex: '#4f46e5' },
    { name: 'Navy Executive', hex: '#1e3a8a' },
    { name: 'Emerald Growth', hex: '#059669' },
    { name: 'Charcoal Minimal', hex: '#262626' },
    { name: 'Crimson Modern', hex: '#dc2626' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Wand2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Resume Formatting & Template Engine</h2>
              <p className="text-xs text-slate-500">Switch between 10 ATS-optimized templates with zero data loss.</p>
            </div>
          </div>
        </div>

        <button
          onClick={autoFixFormattingAI}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" /> 1-Click ATS Auto-Format
        </button>
      </div>

      {/* 10 Templates Carousel / Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          Select From 10 Professional ATS Templates
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TEMPLATE_CONFIGS.map(t => {
            const isSelected = formatting.template === t.id;

            return (
              <div
                key={t.id}
                onClick={() => updateFormatting({ template: t.id, primaryColor: t.color })}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-subtle'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t.category}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1">{t.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-700">{t.atsScoreRating}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography & Spacing Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
        {/* Font Family */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-slate-400" /> Font Family
          </label>
          <select
            value={formatting.font}
            onChange={e => updateFormatting({ font: e.target.value as any })}
            className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="inter">Inter (Clean Modern Sans)</option>
            <option value="roboto">Roboto (Standard ATS)</option>
            <option value="merriweather">Merriweather (Executive Serif)</option>
            <option value="garamond">Garamond (Classic Academic)</option>
            <option value="jetbrains">JetBrains (Technical Monospace)</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Font Size</label>
          <div className="grid grid-cols-3 gap-1">
            {(['compact', 'normal', 'relaxed'] as const).map(sz => (
              <button
                key={sz}
                onClick={() => updateFormatting({ fontSize: sz })}
                className={`py-1.5 text-xs font-medium capitalize rounded-md border transition ${
                  formatting.fontSize === sz
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Line & Section Spacing */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Section Spacing</label>
          <div className="grid grid-cols-3 gap-1">
            {(['tight', 'normal', 'spacious'] as const).map(sp => (
              <button
                key={sp}
                onClick={() => updateFormatting({ spacing: sp })}
                className={`py-1.5 text-xs font-medium capitalize rounded-md border transition ${
                  formatting.spacing === sp
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Page Margins</label>
          <div className="grid grid-cols-3 gap-1">
            {(['narrow', 'normal', 'wide'] as const).map(mg => (
              <button
                key={mg}
                onClick={() => updateFormatting({ margins: mg })}
                className={`py-1.5 text-xs font-medium capitalize rounded-md border transition ${
                  formatting.margins === mg
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accent Colors */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-slate-400" /> Accent Color (Titles & Dividers)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {colorOptions.map(c => (
            <button
              key={c.hex}
              onClick={() => updateFormatting({ primaryColor: c.hex })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                formatting.primaryColor === c.hex
                  ? 'border-indigo-600 bg-slate-50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

