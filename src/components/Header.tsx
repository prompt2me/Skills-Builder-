import React from 'react';
import { Sparkles, Layers, FolderKanban, BookOpen, GitMerge, CheckCircle2, Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'create' | 'library' | 'templates' | 'workflows' | 'validator';
  onSelectTab: (tab: 'create' | 'library' | 'templates' | 'workflows' | 'validator') => void;
  skillsCount: number;
  onNewSkill: () => void;
  geminiConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  skillsCount,
  onNewSkill,
  geminiConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('create')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AI Skill Architect</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Claude Code Spec
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Professional Claude Skill Engineering & Packaging Studio</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('create')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'create'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Skill</span>
            </button>

            <button
              onClick={() => onSelectTab('library')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'library'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>My Skills</span>
              {skillsCount > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {skillsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'templates'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => onSelectTab('workflows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'workflows'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GitMerge className="w-4 h-4" />
              <span>Workflows</span>
            </button>

            <button
              onClick={() => onSelectTab('validator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'validator'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Audit Tool</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${geminiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{geminiConnected ? 'Gemini 3.8 Flash Ready' : 'AI Offline (Mock Ready)'}</span>
            </div>

            <button
              onClick={onNewSkill}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              <span>New Skill</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
