import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Info, ArrowRight, Wand2, Copy, Check } from 'lucide-react';
import { validateSkillPackage } from '../lib/claudeSkillStandards.ts';
import { ValidationReport, SkillFile } from '../types/skill.ts';
import { copyToClipboard } from '../lib/exportUtils.ts';

const SAMPLE_SKILL_MD = `---
name: sample-seo-audit
description: Analyzes websites for technical SEO compliance. Use when the user asks to audit an SEO page or check technical site errors.
---

# Technical SEO Auditor

## Role and Objective
You are a technical SEO specialist who audits websites for crawlability, indexation, and Core Web Vitals.

## Required Inputs
- targetUrl: Website URL to audit (Required)

## Execution Workflow
1. Inspect robots.txt and sitemap.xml.
2. Check title tags, meta descriptions, and header hierarchy.
3. Verify mobile responsiveness and page speed metrics.
4. Deliver prioritized technical remediation table.

## Quality Assurance & Verification
- Verify all HTTP status codes are valid.
`;

export const DirectValidator: React.FC = () => {
  const [content, setContent] = useState(SAMPLE_SKILL_MD);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunAudit = () => {
    const file: SkillFile = {
      path: 'SKILL.md',
      content,
      purpose: 'Entrypoint',
      language: 'markdown',
    };
    const res = validateSkillPackage([file]);
    setReport(res);
  };

  const handleAutoFix = () => {
    let fixed = content;

    // Check frontmatter
    if (!fixed.startsWith('---')) {
      fixed = `---\nname: my-claude-skill\ndescription: Actionable Claude skill. Use when the user asks to perform this task.\n---\n\n` + fixed;
    }

    // Check error handling section
    if (!/##\s+(Error Handling|Fallbacks)/i.test(fixed)) {
      fixed += `\n\n## Error Handling and Fallbacks\n- If required inputs are missing, apply standard defaults and disclose assumptions.\n- If external tools fail, provide manual recommendations based on offline analysis.\n`;
    }

    // Check tools section
    if (!/##\s+(Tool|Tools|Integration)/i.test(fixed)) {
      fixed += `\n\n## Tool and Integration Requirements\n- **Filesystem**: Read and write files in the local project workspace.\n- **Web Search**: Used when real-time documentation or search data is needed.\n`;
    }

    setContent(fixed);
    const file: SkillFile = {
      path: 'SKILL.md',
      content: fixed,
      purpose: 'Entrypoint',
      language: 'markdown',
    };
    setReport(validateSkillPackage([file]));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Direct Claude Skill Audit Tool</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Paste any existing <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">SKILL.md</code> to audit structural compliance, YAML syntax, and instruction quality against official Anthropic specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col h-[580px]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700">SKILL.md Content</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleAutoFix}
                className="px-2.5 py-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center gap-1 font-semibold"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Fix Missing Sections</span>
              </button>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            spellCheck={false}
          />

          <button
            onClick={handleRunAudit}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Claude Skill</span>
          </button>
        </div>

        {/* Audit Report View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700">Audit Results</span>
            {report && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  report.isCompatible
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {report.isCompatible ? 'PASSED CLAUDE SPEC' : 'DEFECTS DETECTED'} ({report.overallScore}/100)
              </span>
            )}
          </div>

          {report ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">{report.summary}</p>

              {/* Dimension Score Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Structural Compatibility</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{report.dimensions.structural.score}/100</div>
                  <div className="text-[10px] text-slate-500 mt-1">{report.dimensions.structural.criteria}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Instruction Quality</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{report.dimensions.instructionQuality.score}/100</div>
                  <div className="text-[10px] text-slate-500 mt-1">{report.dimensions.instructionQuality.criteria}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Tool Readiness</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{report.dimensions.toolReadiness.score}/100</div>
                  <div className="text-[10px] text-slate-500 mt-1">{report.dimensions.toolReadiness.criteria}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Task Alignment</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{report.dimensions.taskAlignment.score}/100</div>
                  <div className="text-[10px] text-slate-500 mt-1">{report.dimensions.taskAlignment.criteria}</div>
                </div>
              </div>

              {/* Detailed Issues List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-800">Issues & Recommendations:</div>
                {report.issues.length === 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No errors detected! Your SKILL.md meets official standards.</span>
                  </div>
                ) : (
                  report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        issue.type === 'error'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : issue.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {issue.type === 'error' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{issue.message}</span>
                      </div>
                      <div className="text-[11px] opacity-90 pl-5.5">
                        <strong>Remediation:</strong> {issue.remediation}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
              <ShieldCheck className="w-8 h-8 text-slate-300" />
              <span>Click "Audit Claude Skill" to inspect formatting and instruction quality.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
