import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  Sliders,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Skill, GenerationMode, TargetEnvironment, TaskCategory } from '../types/skill.ts';
import { downloadZipPackage } from '../lib/exportUtils.ts';

interface DashboardProps {
  skills: Skill[];
  onGenerate: (description: string, mode: GenerationMode, advancedConfig: any) => Promise<void>;
  onSelectSkill: (skill: Skill) => void;
  onDeleteSkill: (id: string) => void;
  isGenerating: boolean;
  generationStep: number;
}

const EXAMPLE_PROMPTS = [
  'Research competitors, analyze their SEO strategies, and identify content opportunities.',
  'Turn raw Excel and CSV financial data into executive dashboards with KPI formulas and charts.',
  'Design and implement production-ready TypeScript REST APIs with database schemas and integration tests.',
  'Synthesize customer interviews and product telemetry into executive B2B case study briefs.',
  'Perform automated Kubernetes cluster health audits and diagnose crashing pod logs.',
];

const GENERATION_STEPS = [
  { title: 'Intent Interpretation', desc: 'Classifying task category and user objectives' },
  { title: 'Requirements Engineering', desc: 'Deriving inputs, operations, decisions, and failure modes' },
  { title: 'Research & Evidence Collection', desc: 'Gathering authoritative documentation and official schemas' },
  { title: 'Architecture Planning', desc: 'Designing modular SKILL.md, references/, templates/, scripts/' },
  { title: 'Skill Package Compilation', desc: 'Writing compliant YAML frontmatter and operational procedures' },
  { title: 'Automated Specification Validation', desc: 'Checking naming rules, relative paths, and instruction rigor' },
  { title: 'Behavioral Test Simulation', desc: 'Testing edge cases, missing inputs, and tool fallbacks' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  skills,
  onGenerate,
  onSelectSkill,
  onDeleteSkill,
  isGenerating,
  generationStep,
}) => {
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<GenerationMode>('quick');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced options state
  const [domain, setDomain] = useState<TaskCategory>('seo_marketing');
  const [targetEnv, setTargetEnv] = useState<TargetEnvironment>('claude_code');
  const [intendedUsers, setIntendedUsers] = useState('Staff Engineers & Domain Specialists');
  const [tools, setTools] = useState('Brave Search, Filesystem');
  const [autonomyLevel, setAutonomyLevel] = useState('Semi-Autonomous with confirmation gates');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isGenerating) return;

    onGenerate(description, mode, {
      domain,
      targetEnvironment: targetEnv,
      intendedUsers,
      tools,
      autonomyLevel,
    });
  };

  const setPrompt = (text: string) => {
    setDescription(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Creator Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 sm:p-10 shadow-xl border border-slate-700">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Anthropic Claude Skills Specification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Convert Short Descriptions into Complete, Production Claude Skills
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Describe the task in one sentence. AI Skill Architect interprets your intent, investigates authoritative methods, plans modular files, compiles official YAML frontmatter, and runs automated behavioral verification.
          </p>
        </div>

        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="relative z-10 mt-8 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              What do you want your AI Skill to do?
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task in one sentence. For example: Research competitors, analyze their SEO strategies, and identify content opportunities."
                disabled={isGenerating}
                className="w-full bg-slate-950/80 border border-slate-600 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base shadow-inner pr-36 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!description.trim() || isGenerating}
                className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all shadow-md flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Try an example:</span>
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(prompt)}
                disabled={isGenerating}
                className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700 transition-colors truncate max-w-[260px] text-left"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Generation Mode Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Generation Pipeline Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setMode('quick')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  mode === 'quick'
                    ? 'bg-blue-600/20 border-blue-400 text-white ring-1 ring-blue-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Quick Generation</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Fast, complete first draft inferring optimal architecture and reasonable defaults.
                </p>
              </div>

              <div
                onClick={() => setMode('research')}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  mode === 'research'
                    ? 'bg-blue-600/20 border-blue-400 text-white ring-1 ring-blue-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span>Research-Driven</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Grounds instructions in live search data, official API docs, and industry standards.
                </p>
              </div>

              <div
                onClick={() => {
                  setMode('advanced');
                  setShowAdvanced(true);
                }}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  mode === 'advanced'
                    ? 'bg-blue-600/20 border-blue-400 text-white ring-1 ring-blue-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Advanced Control</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Customize target environment, tool dependencies, autonomy gates, and domain rules.
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Customization Collapsible */}
          <div className="border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Advanced Architecture Settings</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target AI Environment</label>
                  <select
                    value={targetEnv}
                    onChange={(e) => setTargetEnv(e.target.value as TargetEnvironment)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="claude_code">Claude Code CLI (~/.claude/skills)</option>
                    <option value="claude_desktop">Claude Desktop (Projects / Knowledge)</option>
                    <option value="api_agent">Anthropic API & Custom Agent</option>
                    <option value="all">Universal Compatibility (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as TaskCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="seo_marketing">SEO & Growth Marketing</option>
                    <option value="data_analysis">Data Analysis & Financial Dashboards</option>
                    <option value="coding">Software Architecture & APIs</option>
                    <option value="research">Competitive Research & Synthesis</option>
                    <option value="writing">Content & Narrative Writing</option>
                    <option value="automation">DevOps, Cloud & Automation</option>
                    <option value="education">Educational & Instruction Design</option>
                    <option value="decision_support">Executive Decision Support</option>
                    <option value="specialized">Specialized Professional Field</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Required MCP Tools</label>
                  <input
                    type="text"
                    value={tools}
                    onChange={(e) => setTools(e.target.value)}
                    placeholder="e.g. Brave Search, Postgres, Filesystem"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Intended Users</label>
                  <input
                    type="text"
                    value={intendedUsers}
                    onChange={(e) => setIntendedUsers(e.target.value)}
                    placeholder="e.g. SEO Leads, CFOs, Staff Engineers"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Autonomy & Guardrail Level</label>
                  <select
                    value={autonomyLevel}
                    onChange={(e) => setAutonomyLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Interactive Guardrails with confirmation gates">Interactive: Explicit user approval before destructive or external actions</option>
                    <option value="Semi-Autonomous with confirmation gates">Semi-Autonomous: Autonomous analysis with confirmation on delivery</option>
                    <option value="Fully Autonomous">Fully Autonomous: End-to-end execution without interruption</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Live Generation Progress View */}
        {isGenerating && (
          <div className="relative z-10 mt-8 p-6 rounded-xl bg-slate-950/90 border border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="font-semibold text-sm text-white">
                  Executing Pipeline: {GENERATION_STEPS[generationStep]?.title || 'Processing'}
                </span>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Stage {generationStep + 1} of {GENERATION_STEPS.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {GENERATION_STEPS.map((step, idx) => {
                const isCurrent = idx === generationStep;
                const isDone = idx < generationStep;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : isCurrent
                        ? 'bg-blue-950/50 border-blue-500 text-blue-200 ring-1 ring-blue-500 animate-pulse'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium mb-1">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[9px] shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <span className="truncate">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{skills.length}</div>
            <div className="text-xs text-slate-500 font-medium">Engineered Skills in Library</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {skills.length > 0
                ? Math.round((skills.filter((s) => s.validationReport?.isCompatible).length / skills.length) * 100)
                : 100}
              %
            </div>
            <div className="text-xs text-slate-500 font-medium">Specification Pass Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {skills.reduce((acc, s) => acc + (s.files?.length || 1), 0)}
            </div>
            <div className="text-xs text-slate-500 font-medium">Modular Files Managed</div>
          </div>
        </div>
      </div>

      {/* Recent Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Skills</h2>
            <p className="text-xs text-slate-500">Inspect, edit, test, or export your generated Claude Skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.slice(0, 6).map((skill) => {
            const isPassing = skill.validationReport?.isCompatible;
            const score = skill.validationReport?.overallScore || 85;

            return (
              <div
                key={skill.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[170px]">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isPassing ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      Score {score}/100
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectSkill(skill)}
                    className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {skill.displayName || skill.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">
                      {skill.taskCategory.replace('_', ' ')}
                    </span>
                    <span>•</span>
                    <span>{skill.files.length} files</span>
                    <span>•</span>
                    <span>{skill.testCases?.length || 0} tests</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectSkill(skill)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Open Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      title="Download ZIP package"
                      onClick={() => downloadZipPackage(skill)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete Skill"
                      onClick={() => onDeleteSkill(skill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
