import React, { useState } from 'react';
import {
  FileText,
  Folder,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Save,
  Download,
  Eye,
  FileCode,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Wand2,
  History,
  Info,
  Check,
  Search,
  BookOpen,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { Skill, SkillFile, ValidationReport, TestCase, TestResult } from '../types/skill.ts';
import { copyToClipboard } from '../lib/exportUtils.ts';

interface SkillEditorProps {
  skill: Skill;
  onUpdateSkill: (updatedSkill: Skill) => void;
  onOpenExportModal: () => void;
  onRunValidation: (files: SkillFile[]) => Promise<ValidationReport>;
  onRunTests: (files: SkillFile[]) => Promise<{ testCases: TestCase[]; testResults: TestResult[] }>;
  onRefineSkill: (skill: Skill, instruction: string, targetFile?: string) => Promise<void>;
  onBackToDashboard: () => void;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({
  skill,
  onUpdateSkill,
  onOpenExportModal,
  onRunValidation,
  onRunTests,
  onRefineSkill,
  onBackToDashboard,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('SKILL.md');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [activeBottomTab, setActiveBottomTab] = useState<'validation' | 'tests' | 'refine' | 'requirements' | 'history'>('validation');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New file modal state
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFilePath, setNewFilePath] = useState('references/NEW_FILE.md');

  const currentFile = skill.files.find((f) => f.path === selectedFilePath) || skill.files[0];

  const handleContentChange = (newContent: string) => {
    const updatedFiles = skill.files.map((f) =>
      f.path === selectedFilePath ? { ...f, content: newContent } : f
    );
    onUpdateSkill({
      ...skill,
      files: updatedFiles,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTriggerValidation = async () => {
    setIsValidating(true);
    try {
      const report = await onRunValidation(skill.files);
      onUpdateSkill({
        ...skill,
        validationReport: report,
        status: report.isCompatible ? 'validated' : 'draft',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleTriggerTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await onRunTests(skill.files);
      onUpdateSkill({
        ...skill,
        testCases: results.testCases,
        testResults: results.testResults,
        status: 'tested',
      });
      setActiveBottomTab('tests');
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleApplyRefinement = async (promptToUse?: string) => {
    const prompt = promptToUse || refinementPrompt;
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      await onRefineSkill(skill, prompt, selectedFilePath);
      setRefinementPrompt('');
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyCurrentFile = async () => {
    if (!currentFile) return;
    const ok = await copyToClipboard(currentFile.content);
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleAddNewFile = () => {
    if (!newFilePath.trim()) return;
    if (skill.files.some((f) => f.path === newFilePath)) return;

    const newFile: SkillFile = {
      path: newFilePath.trim(),
      content: `# ${newFilePath.split('/').pop()}\n\nSupporting file content.`,
      purpose: 'Supporting file',
      language: newFilePath.endsWith('.py') ? 'python' : newFilePath.endsWith('.json') ? 'json' : 'markdown',
    };

    onUpdateSkill({
      ...skill,
      files: [...skill.files, newFile],
    });
    setSelectedFilePath(newFile.path);
    setShowAddFileModal(false);
    setNewFilePath('');
  };

  const handleDeleteFile = (pathToDelete: string) => {
    if (pathToDelete === 'SKILL.md') {
      alert('Cannot delete the root SKILL.md entrypoint.');
      return;
    }
    const updatedFiles = skill.files.filter((f) => f.path !== pathToDelete);
    onUpdateSkill({
      ...skill,
      files: updatedFiles,
    });
    if (selectedFilePath === pathToDelete) {
      setSelectedFilePath('SKILL.md');
    }
  };

  const report = skill.validationReport;
  const wordCount = currentFile?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const estimatedTokens = Math.round((currentFile?.content.length || 0) / 4);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
      {/* Top Studio Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              {skill.displayName || skill.name}
            </span>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {skill.name}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                skill.status === 'tested' || skill.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : skill.status === 'validated'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {skill.status}
            </span>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerValidation}
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 text-blue-600" />}
            <span>Validate Spec</span>
          </button>

          <button
            onClick={handleTriggerTests}
            disabled={isRunningTests}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            {isRunningTests ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Run Tests</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Package</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Modular File Tree Navigation */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-slate-400" />
              <span>Skill Package Files</span>
            </span>
            <button
              onClick={() => setShowAddFileModal(true)}
              title="Add supporting file"
              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {skill.files.map((file) => {
              const isSelected = file.path === selectedFilePath;
              const isMain = file.path === 'SKILL.md';

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100/70 text-blue-900 font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isMain ? (
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{file.path}</span>
                  </div>

                  {!isMain && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.path);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Claude Code spec tip */}
          <div className="p-3 bg-blue-50/70 border-t border-blue-100 text-[11px] text-blue-900 leading-snug">
            <strong>Claude Code Rule:</strong> All files in <code className="font-mono text-[10px] bg-blue-100 px-1 rounded">references/</code> and <code className="font-mono text-[10px] bg-blue-100 px-1 rounded">templates/</code> must be relative to the package root.
          </div>
        </div>

        {/* Center: File Editor and Rendered Document Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* File Toolbar */}
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-slate-800">
                {currentFile?.path}
              </span>
              <span className="text-[11px] text-slate-400">
                {wordCount} words • ~{estimatedTokens} tokens
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                <button
                  onClick={() => setViewMode('editor')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    viewMode === 'editor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    viewMode === 'split' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    viewMode === 'preview' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preview
                </button>
              </div>

              <button
                onClick={handleCopyCurrentFile}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                title="Copy current file content"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Editor / Preview Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Raw Text Editor */}
            {(viewMode === 'editor' || viewMode === 'split') && (
              <div className={`h-full flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-slate-200' : 'w-full'}`}>
                <textarea
                  value={currentFile?.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 resize-none focus:outline-none focus:bg-white leading-relaxed"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Markdown Rendered Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`h-full overflow-y-auto p-6 bg-white prose prose-slate max-w-none text-xs sm:text-sm ${
                viewMode === 'split' ? 'w-1/2' : 'w-full'
              }`}>
                {/* Render clean styled preview */}
                <div className="space-y-4">
                  {currentFile?.content.startsWith('---') && (
                    <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap">
                      {currentFile.content.match(/^---[\s\S]*?---/)?.[0]}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed space-y-3">
                    {/* Render headings and paragraphs nicely */}
                    {currentFile?.content
                      .replace(/^---[\s\S]*?---\n*/, '')
                      .split('\n\n')
                      .map((block, idx) => {
                        if (block.startsWith('# ')) {
                          return <h1 key={idx} className="text-xl font-bold text-slate-900 border-b pb-2">{block.replace('# ', '')}</h1>;
                        }
                        if (block.startsWith('## ')) {
                          return <h2 key={idx} className="text-base font-bold text-slate-900 mt-4 border-b pb-1 text-blue-900">{block.replace('## ', '')}</h2>;
                        }
                        if (block.startsWith('### ')) {
                          return <h3 key={idx} className="text-sm font-semibold text-slate-800">{block.replace('### ', '')}</h3>;
                        }
                        if (block.startsWith('```')) {
                          return (
                            <pre key={idx} className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                              {block.replace(/```[a-z]*\n?/g, '')}
                            </pre>
                          );
                        }
                        return <p key={idx} className="text-slate-700">{block}</p>;
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Collapsible Panel: Validation / Tests / Refine / Requirements / History */}
          <div className="h-64 border-t border-slate-200 bg-slate-50 flex flex-col shrink-0">
            {/* Tabs Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveBottomTab('validation')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'validation'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Validation & Quality</span>
                  {report && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        report.isCompatible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.overallScore}/100
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveBottomTab('tests')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'tests'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Behavioral Test Suite</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                    {skill.testCases?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('refine')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'refine'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Targeted Refinement</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('requirements')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'requirements'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Requirements & Sources</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeBottomTab === 'history'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Version History ({skill.versions?.length || 1})</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* TAB 1: VALIDATION REPORT */}
              {activeBottomTab === 'validation' && (
                <div className="space-y-4">
                  {report ? (
                    <div className="space-y-3">
                      {/* Dimension Scores */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[11px] text-slate-500 font-medium">Structural Compatibility</div>
                          <div className="text-base font-bold text-slate-900">{report.dimensions.structural.score}/100</div>
                          <div className="text-[10px] text-slate-400 capitalize">{report.dimensions.structural.status}</div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[11px] text-slate-500 font-medium">Instruction Quality</div>
                          <div className="text-base font-bold text-slate-900">{report.dimensions.instructionQuality.score}/100</div>
                          <div className="text-[10px] text-slate-400 capitalize">{report.dimensions.instructionQuality.status}</div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[11px] text-slate-500 font-medium">Tool Readiness</div>
                          <div className="text-base font-bold text-slate-900">{report.dimensions.toolReadiness.score}/100</div>
                          <div className="text-[10px] text-slate-400 capitalize">{report.dimensions.toolReadiness.status}</div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <div className="text-[11px] text-slate-500 font-medium">Task Alignment</div>
                          <div className="text-base font-bold text-slate-900">{report.dimensions.taskAlignment.score}/100</div>
                          <div className="text-[10px] text-slate-400 capitalize">{report.dimensions.taskAlignment.status}</div>
                        </div>
                      </div>

                      {/* Issues list */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-700">Audit Issues & Observations:</div>
                        {report.issues.length === 0 ? (
                          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Zero defects found! Package fully satisfies Claude Skills specifications.</span>
                          </div>
                        ) : (
                          report.issues.map((issue) => (
                            <div
                              key={issue.id}
                              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                                issue.type === 'error'
                                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                                  : issue.type === 'warning'
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-blue-50 border-blue-200 text-blue-900'
                              }`}
                            >
                              {issue.type === 'error' ? (
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              ) : (
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-1">
                                <div className="font-semibold">{issue.message}</div>
                                <div className="text-[11px] opacity-90">
                                  <strong>Remediation:</strong> {issue.remediation}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No validation report yet. Click "Validate Spec" in the top bar to run audit.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BEHAVIORAL TEST SUITE */}
              {activeBottomTab === 'tests' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Task-Specific Behavioral Test Cases</span>
                    <button
                      onClick={handleTriggerTests}
                      disabled={isRunningTests}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {isRunningTests ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>Rerun Simulation</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {skill.testCases?.map((tc) => {
                      const res = skill.testResults?.find((r) => r.testCaseId === tc.id);
                      return (
                        <div key={tc.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{tc.title}</span>
                            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {tc.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            <strong>Prompt:</strong> "{tc.inputPrompt}"
                          </div>
                          {res && (
                            <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-500">Result:</span>
                                <span className={`font-bold uppercase ${res.status === 'passed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {res.status}
                                </span>
                              </div>
                              <p className="text-slate-700 italic">"{res.simulatedResponse}"</p>
                              <div className="text-slate-500">{res.reasoning}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: TARGETED REFINEMENT */}
              {activeBottomTab === 'refine' && (
                <div className="space-y-3 max-w-3xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quick Revision Directives
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Add strict error handling & fallbacks for missing inputs',
                        'Improve auto-activation trigger description in YAML frontmatter',
                        'Add Brave Search MCP and web research methodology',
                        'Add automated Python validation script in scripts/validate.py',
                        'Make execution workflow steps more rigorous with explicit formulas',
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyRefinement(chip)}
                          disabled={isRefining}
                          className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-300 hover:border-blue-400 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Custom Revision Instruction
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={refinementPrompt}
                        onChange={(e) => setRefinementPrompt(e.target.value)}
                        placeholder={`Describe changes for ${currentFile?.path || 'this skill'}...`}
                        disabled={isRefining}
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleApplyRefinement()}
                        disabled={!refinementPrompt.trim() || isRefining}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                        <span>Apply Revision</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REQUIREMENTS & RESEARCH */}
              {activeBottomTab === 'requirements' && (
                <div className="space-y-4 max-w-4xl text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 text-sm">Objective & Target Context</div>
                    <p className="text-slate-600">{skill.requirements?.objective}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
                      <div><strong>Intended User:</strong> {skill.requirements?.intendedUser}</div>
                      <div><strong>Operating Context:</strong> {skill.requirements?.operatingContext}</div>
                    </div>
                  </div>

                  {skill.researchSources && skill.researchSources.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800">Grounding Research Sources ({skill.researchSources.length})</div>
                      {skill.researchSources.map((source, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                          <div className="font-semibold text-blue-700 flex items-center justify-between">
                            <span>{source.title}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{source.sourceType}</span>
                          </div>
                          {source.url && (
                            <a href={source.url} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:underline flex items-center gap-1">
                              <span>{source.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <div className="text-[11px] text-slate-600 pt-1">
                            <strong>Verified Claims:</strong> {source.verifiedClaims?.join('; ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: VERSION HISTORY */}
              {activeBottomTab === 'history' && (
                <div className="space-y-2 max-w-3xl text-xs">
                  {skill.versions?.map((ver) => (
                    <div key={ver.version} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Version {ver.version}</div>
                        <div className="text-slate-500 text-[11px]">{ver.changeSummary}</div>
                        <div className="text-slate-400 text-[10px]">{new Date(ver.timestamp).toLocaleString()}</div>
                      </div>
                      {ver.files && (
                        <button
                          onClick={() => {
                            onUpdateSkill({
                              ...skill,
                              files: ver.files,
                              status: 'draft',
                            });
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New File Modal */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-md w-full space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Supporting File</h3>
            <p className="text-xs text-slate-500">
              Create a supporting document, schema, or script referenced by your SKILL.md.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">File Path</label>
              <input
                type="text"
                value={newFilePath}
                onChange={(e) => setNewFilePath(e.target.value)}
                placeholder="e.g. references/METHODOLOGY.md or scripts/validate.py"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFileModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewFile}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
