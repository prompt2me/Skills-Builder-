import React, { useState } from 'react';
import { Download, Copy, Check, X, Terminal, Monitor, FileCode, Archive, Sparkles } from 'lucide-react';
import { Skill } from '../types/skill.ts';
import { downloadSingleFile, downloadZipPackage, copyToClipboard } from '../lib/exportUtils.ts';

interface ExportModalProps {
  skill: Skill;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ skill, onClose }) => {
  const [copiedSkillMd, setCopiedSkillMd] = useState(false);
  const [copiedCliCommand, setCopiedCliCommand] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const mainFile = skill.files.find((f) => f.path === 'SKILL.md');
  const cliCommand = `mkdir -p ~/.claude/skills/${skill.name} && cp -r * ~/.claude/skills/${skill.name}/`;

  const handleDownloadSkillMd = () => {
    if (mainFile) {
      downloadSingleFile('SKILL.md', mainFile.content);
    }
  };

  const handleDownloadZip = async (includeMeta = true) => {
    setIsZipping(true);
    try {
      await downloadZipPackage(skill, includeMeta);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopySkillMd = async () => {
    if (mainFile) {
      const ok = await copyToClipboard(mainFile.content);
      if (ok) {
        setCopiedSkillMd(true);
        setTimeout(() => setCopiedSkillMd(false), 2000);
      }
    }
  };

  const handleCopyCliCommand = async () => {
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopiedCliCommand(true);
      setTimeout(() => setCopiedCliCommand(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Export Claude Skill Package</h3>
              <p className="text-xs text-slate-500 font-mono">{skill.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Package Download Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors bg-white space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Archive className="w-4 h-4 text-blue-600" />
                  <span>Portable ZIP Package</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Complete directory containing <code className="text-blue-700 font-mono">SKILL.md</code>, all supporting files, templates, scripts, and installation guide.
                </p>
              </div>
              <button
                onClick={() => handleDownloadZip(true)}
                disabled={isZipping}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZipping ? 'Archiving...' : 'Download Complete .ZIP'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors bg-white space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>SKILL.md Entrypoint</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Download solely the primary Markdown file with complete YAML frontmatter and operational instructions.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSkillMd}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  onClick={handleCopySkillMd}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors flex items-center justify-center"
                  title="Copy markdown to clipboard"
                >
                  {copiedSkillMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Installation Guides */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>Claude Code CLI Deployment Instructions</span>
            </h4>
            <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs space-y-2">
              <div className="text-slate-400 text-[11px]"># 1. Unzip the downloaded package and navigate inside</div>
              <div className="text-blue-300">unzip {skill.name}.zip && cd {skill.name}</div>
              <div className="text-slate-400 text-[11px] pt-1"># 2. Deploy to your local Claude Code skills directory</div>
              <div className="flex items-center justify-between text-emerald-300 bg-slate-800/80 p-2 rounded">
                <span>{cliCommand}</span>
                <button
                  onClick={handleCopyCliCommand}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCliCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 text-[11px] pt-1"># 3. Test activation in Claude Code terminal:</div>
              <div className="text-slate-300">claude "Analyze competitors using {skill.name}"</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-slate-600" />
              <span>Claude Desktop & Projects Setup</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In Claude Desktop or claude.ai, navigate to <strong>Projects</strong>, create a Project, and paste <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">SKILL.md</code> into <strong>Custom Instructions</strong>. Upload any supporting files from <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">references/</code> directly to <strong>Project Knowledge</strong>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
