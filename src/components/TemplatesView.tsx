import React, { useState } from 'react';
import { BookOpen, Copy, Check, FileCode, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { Skill } from '../types/skill.ts';
import { STARTER_SKILLS } from '../lib/templates.ts';

interface TemplatesViewProps {
  onCloneTemplate: (template: Skill) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onCloneTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Skill>(STARTER_SKILLS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Curated Claude Skill Blueprints</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Production-tested Claude Skills built according to official Anthropic specifications. Clone and customize for your specific workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-3">
          {STARTER_SKILLS.map((template) => {
            const isSelected = template.id === selectedTemplate.id;
            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {template.name}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Validated
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{template.displayName}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{template.description}</p>
                <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                  <span className="capitalize">{template.taskCategory.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{template.files.length} files</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Template Deep-Dive Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedTemplate.name}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedTemplate.displayName}</h2>
                <p className="text-xs text-slate-600 mt-1">{selectedTemplate.description}</p>
              </div>

              <button
                onClick={() => onCloneTemplate(selectedTemplate)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone & Customize</span>
              </button>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase">Target Operating Context</div>
                <div className="text-xs text-slate-600">{selectedTemplate.requirements?.operatingContext}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase">Intended Users</div>
                <div className="text-xs text-slate-600">{selectedTemplate.requirements?.intendedUser}</div>
              </div>
            </div>

            {/* Included Files */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">Included Package Files ({selectedTemplate.files.length})</div>
              <div className="space-y-1.5">
                {selectedTemplate.files.map((file) => (
                  <div key={file.path} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-mono font-medium text-slate-800">{file.path}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{file.purpose}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample SKILL.md excerpt */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">SKILL.md Preview</div>
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs max-h-60 overflow-y-auto leading-relaxed">
                {selectedTemplate.files.find((f) => f.path === 'SKILL.md')?.content.slice(0, 800)}...
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Includes YAML frontmatter, execution workflow, quality assurance checks, and behavioral test cases.
            </span>
            <button
              onClick={() => onCloneTemplate(selectedTemplate)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Clone into My Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
