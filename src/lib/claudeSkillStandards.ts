import { SkillFile, ValidationIssue, ValidationReport } from '../types/skill.ts';

export interface MCPDefinition {
  name: string;
  category: string;
  description: string;
  commonTools: string[];
  recommendedFallbacks: string;
}

export const COMMON_MCPS: MCPDefinition[] = [
  {
    name: 'filesystem',
    category: 'Local Environment',
    description: 'Read and write local project files, inspect directory trees, and search files.',
    commonTools: ['read_file', 'write_file', 'list_directory', 'directory_tree', 'search_files'],
    recommendedFallbacks: 'Instruct the user to provide file contents in chat or output code blocks directly.',
  },
  {
    name: 'brave-search',
    category: 'Web Research',
    description: 'Real-time web search and local POI query using Brave Search API.',
    commonTools: ['brave_web_search', 'brave_local_search'],
    recommendedFallbacks: 'Fall back to user-provided source URLs or clearly document missing live search access.',
  },
  {
    name: 'puppeteer',
    category: 'Web Automation',
    description: 'Headless browser navigation, page scraping, screenshot capture, and DOM element evaluation.',
    commonTools: ['navigate', 'screenshot', 'click', 'fill', 'evaluate'],
    recommendedFallbacks: 'Request HTML/text dumps or suggest running an offline curl/Python scraper script.',
  },
  {
    name: 'postgres',
    category: 'Database',
    description: 'Execute read-only or transactional queries on PostgreSQL instances with schema inspection.',
    commonTools: ['query', 'describe_table', 'list_tables'],
    recommendedFallbacks: 'Request CSV or schema DDL exports for manual analysis.',
  },
  {
    name: 'github',
    category: 'Code & Version Control',
    description: 'Interact with GitHub repositories, pull requests, issues, and commit histories.',
    commonTools: ['get_issue', 'create_pull_request', 'search_repositories', 'get_file_contents'],
    recommendedFallbacks: 'Use git CLI commands if in Claude Code terminal or request patch diffs.',
  },
  {
    name: 'slack',
    category: 'Communication',
    description: 'Read channel histories and post automated status reports or alerts.',
    commonTools: ['post_message', 'list_channels', 'get_channel_history'],
    recommendedFallbacks: 'Format messages in clear copyable markdown blocks for manual distribution.',
  },
];

export function validateSkillPackage(files: SkillFile[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const mainFile = files.find((f) => f.path === 'SKILL.md');

  let structuralScore = 100;
  let instructionScore = 100;
  let toolScore = 100;
  let taskScore = 100;

  if (!mainFile) {
    issues.push({
      id: 'missing-skill-md',
      type: 'error',
      category: 'structural',
      file: 'root',
      message: 'CRITICAL: Package must contain a root "SKILL.md" file.',
      remediation: 'Ensure the main entrypoint file is named exactly "SKILL.md".',
    });
    structuralScore = 0;
  } else {
    const content = mainFile.content;

    // Check frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      issues.push({
        id: 'missing-frontmatter',
        type: 'error',
        category: 'structural',
        file: 'SKILL.md',
        line: 1,
        message: 'Missing standard YAML frontmatter delimited by "---".',
        remediation: 'Add a valid YAML frontmatter at the very top of SKILL.md with "name" and "description".',
      });
      structuralScore -= 40;
    } else {
      const yaml = match[1];
      const nameMatch = yaml.match(/^name:\s*([^\r\n]+)/m);
      const descMatch = yaml.match(/^description:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/m);

      if (!nameMatch) {
        issues.push({
          id: 'missing-name',
          type: 'error',
          category: 'structural',
          file: 'SKILL.md',
          message: 'Frontmatter is missing required "name" property.',
          remediation: 'Define name: your-skill-name in kebab-case.',
        });
        structuralScore -= 25;
      } else {
        const skillName = nameMatch[1].trim().replace(/['"]/g, '');
        const validNameRegex = /^[a-z0-9-]+$/;
        if (!validNameRegex.test(skillName)) {
          issues.push({
            id: 'invalid-name-format',
            type: 'error',
            category: 'structural',
            file: 'SKILL.md',
            message: `Skill name "${skillName}" violates naming standard. Must be lowercase alphanumeric with hyphens only.`,
            remediation: 'Change name to only use lowercase characters, numbers, and hyphens (e.g., "competitor-seo-analyst").',
          });
          structuralScore -= 20;
        }
      }

      if (!descMatch) {
        issues.push({
          id: 'missing-description',
          type: 'error',
          category: 'instruction_quality',
          file: 'SKILL.md',
          message: 'Frontmatter is missing required "description" property.',
          remediation: 'Add a descriptive activation statement explaining when Claude should activate this skill.',
        });
        instructionScore -= 30;
      } else {
        const desc = descMatch[1].trim();
        if (desc.length < 30) {
          issues.push({
            id: 'description-too-short',
            type: 'warning',
            category: 'instruction_quality',
            file: 'SKILL.md',
            message: 'Activation description is very short. Claude may fail to trigger automatically on user queries.',
            remediation: 'Specify both what the skill accomplishes and specific user prompt triggers (e.g. "Use when the user asks to...").',
          });
          instructionScore -= 15;
        }

        const hasTriggerPhrase = /(use when|activate when|trigger when|when the user|for analyzing|when requested)/i.test(desc);
        if (!hasTriggerPhrase) {
          issues.push({
            id: 'activation-triggers-weak',
            type: 'info',
            category: 'instruction_quality',
            file: 'SKILL.md',
            message: 'Description does not explicitly state activation conditions ("Use when...").',
            remediation: 'Explicitly specify activation conditions so Claude knows precisely when to invoke this skill.',
          });
          instructionScore -= 10;
        }
      }
    }

    // Check for essential sections
    const hasRole = /##\s+(Role|Objective|Overview|Purpose)/i.test(content);
    const hasInputs = /##\s+(Required Inputs|Inputs|Input Specification)/i.test(content);
    const hasWorkflow = /##\s+(Workflow|Execution Workflow|Procedure|Process)/i.test(content);
    const hasErrorHandling = /##\s+(Error Handling|Fallbacks|Failure Modes)/i.test(content);
    const hasQA = /##\s+(Quality Assurance|Verification|Validation|Quality Checks)/i.test(content);
    const hasTools = /##\s+(Tools|Tool Integration|Dependencies|MCP Requirements)/i.test(content);

    if (!hasRole) {
      issues.push({
        id: 'missing-role-section',
        type: 'warning',
        category: 'instruction_quality',
        file: 'SKILL.md',
        message: 'Missing explicit "Role and Objective" section.',
        remediation: 'Add "## Role and Objective" defining clear agent boundaries.',
      });
      instructionScore -= 10;
    }

    if (!hasInputs) {
      issues.push({
        id: 'missing-inputs-section',
        type: 'warning',
        category: 'instruction_quality',
        file: 'SKILL.md',
        message: 'Missing explicit "Required Inputs" specification.',
        remediation: 'Add "## Required Inputs" describing required vs optional parameters and defaults.',
      });
      instructionScore -= 15;
    }

    if (!hasWorkflow) {
      issues.push({
        id: 'missing-workflow-section',
        type: 'error',
        category: 'instruction_quality',
        file: 'SKILL.md',
        message: 'Missing step-by-step "Execution Workflow" section.',
        remediation: 'Add a numbered procedural workflow with explicit criteria.',
      });
      instructionScore -= 25;
    }

    if (!hasErrorHandling) {
      issues.push({
        id: 'missing-error-handling',
        type: 'warning',
        category: 'instruction_quality',
        file: 'SKILL.md',
        message: 'Missing "Error Handling and Fallbacks" section.',
        remediation: 'Define recovery behaviors when tools are unavailable or inputs are malformed.',
      });
      instructionScore -= 10;
    }

    if (!hasQA) {
      issues.push({
        id: 'missing-qa-section',
        type: 'info',
        category: 'task_specific',
        file: 'SKILL.md',
        message: 'Missing explicit Quality Assurance pre-delivery verification checks.',
        remediation: 'Add measurable verification gates before finalizing output.',
      });
      taskScore -= 10;
    }

    if (!hasTools) {
      issues.push({
        id: 'missing-tools-section',
        type: 'info',
        category: 'tool_readiness',
        file: 'SKILL.md',
        message: 'Tool requirements are not explicitly documented.',
        remediation: 'Add "## Tool and Integration Requirements" distinguishing available from optional tools.',
      });
      toolScore -= 15;
    }

    // Check relative references: [label](path)
    const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    for (const match of linkMatches) {
      const target = match[2];
      // Only check internal file paths, not http/https or anchors
      if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('#') && !target.startsWith('mailto:')) {
        const cleanPath = target.replace(/^\.\//, '');
        const exists = files.some((f) => f.path === cleanPath || f.path === target);
        if (!exists) {
          issues.push({
            id: `broken-link-${cleanPath}`,
            type: 'error',
            category: 'structural',
            file: 'SKILL.md',
            message: `Relative reference to "${target}" cannot be resolved. File is missing from package.`,
            remediation: `Generate or include "${cleanPath}" in the package or remove the invalid link.`,
          });
          structuralScore -= 15;
        }
      }
    }
  }

  // Supporting files check
  files.forEach((file) => {
    if (file.path !== 'SKILL.md') {
      if (file.content.trim().length === 0) {
        issues.push({
          id: `empty-file-${file.path}`,
          type: 'warning',
          category: 'structural',
          file: file.path,
          message: `Supporting file "${file.path}" is empty.`,
          remediation: 'Provide actionable supporting content or remove this file.',
        });
        structuralScore -= 5;
      }
    }
  });

  structuralScore = Math.max(0, structuralScore);
  instructionScore = Math.max(0, instructionScore);
  toolScore = Math.max(0, toolScore);
  taskScore = Math.max(0, taskScore);

  const overallScore = Math.round((structuralScore * 0.35 + instructionScore * 0.35 + toolScore * 0.15 + taskScore * 0.15));
  const isCompatible = issues.filter((i) => i.type === 'error').length === 0 && overallScore >= 70;

  return {
    timestamp: new Date().toISOString(),
    isCompatible,
    overallScore,
    dimensions: {
      structural: {
        score: structuralScore,
        criteria: 'YAML frontmatter, naming conventions, valid relative paths, package completeness',
        status: structuralScore >= 80 ? 'passed' : structuralScore >= 60 ? 'marginal' : 'failed',
        details: structuralScore >= 80 ? 'Complies with official Claude Skill packaging rules.' : 'Contains structural defects.',
      },
      instructionQuality: {
        score: instructionScore,
        criteria: 'Clear role boundaries, activation trigger specificity, executable procedure',
        status: instructionScore >= 80 ? 'passed' : instructionScore >= 60 ? 'marginal' : 'failed',
        details: instructionScore >= 80 ? 'Instructions are operational, unambiguous, and directive.' : 'Instructions need clearer execution gates.',
      },
      toolReadiness: {
        score: toolScore,
        criteria: 'Clear separation of required vs optional tools, manual fallback strategies',
        status: toolScore >= 80 ? 'passed' : toolScore >= 60 ? 'marginal' : 'failed',
        details: toolScore >= 80 ? 'Tools and MCP fallbacks are documented.' : 'Tool expectations are underspecified.',
      },
      taskAlignment: {
        score: taskScore,
        criteria: 'Domain-specific methodology, QA rubrics, measurable completion criteria',
        status: taskScore >= 80 ? 'passed' : taskScore >= 60 ? 'marginal' : 'failed',
        details: taskScore >= 80 ? 'Includes domain methodology and verification checks.' : 'Task verification checks could be strengthened.',
      },
    },
    issues,
    summary: isCompatible
      ? 'Package passes official Claude Code specification checks with no blocking errors.'
      : 'Package contains validation issues that require attention prior to deployment.',
  };
}
