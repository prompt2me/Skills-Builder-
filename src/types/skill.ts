export type TaskCategory =
  | 'research'
  | 'writing'
  | 'seo_marketing'
  | 'coding'
  | 'data_analysis'
  | 'automation'
  | 'education'
  | 'decision_support'
  | 'specialized';

export type TargetEnvironment = 'claude_code' | 'claude_desktop' | 'api_agent' | 'all';

export type SkillLifecycleStatus = 'draft' | 'validated' | 'tested' | 'refined' | 'ready';

export type GenerationMode = 'quick' | 'research' | 'advanced';

export interface ToolDependency {
  id: string;
  name: string;
  purpose: string;
  availability: 'verified_available' | 'requires_auth' | 'optional_enhancement' | 'unsupported_manual_fallback';
  requiredPermissions?: string[];
  mcpServerName?: string;
  operations?: string[];
  fallbackStrategy: string;
}

export interface RequirementsSpec {
  objective: string;
  taskType: TaskCategory;
  intendedUser: string;
  operatingContext: string;
  inputs: {
    name: string;
    description: string;
    required: boolean;
    format: string;
    default?: string;
  }[];
  operations: string[];
  decisions: string[];
  toolsNeeded: ToolDependency[];
  outputs: {
    name: string;
    type: string;
    description: string;
  }[];
  qualityControls: string[];
  constraints: string[];
  successCriteria: string[];
  assumptions: string[];
  unresolvedDependencies: string[];
}

export interface ResearchSource {
  title: string;
  url?: string;
  sourceType: 'official_doc' | 'api_spec' | 'academic' | 'industry_standard' | 'web';
  retrievalDate: string;
  keyFindings: string[];
  verifiedClaims: string[];
  limitations: string[];
}

export interface SkillFile {
  path: string; // e.g. "SKILL.md", "references/METHODOLOGY.md", "templates/REPORT_TEMPLATE.md", "scripts/validate.py"
  content: string;
  purpose: string;
  language: 'markdown' | 'yaml' | 'python' | 'bash' | 'json';
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'structural' | 'instruction_quality' | 'tool_readiness' | 'task_specific';
  file: string;
  line?: number;
  message: string;
  remediation: string;
}

export interface QualityDimensionScore {
  score: number; // 0-100
  criteria: string;
  status: 'passed' | 'marginal' | 'failed';
  details: string;
}

export interface ValidationReport {
  timestamp: string;
  isCompatible: boolean;
  overallScore: number;
  dimensions: {
    structural: QualityDimensionScore;
    instructionQuality: QualityDimensionScore;
    toolReadiness: QualityDimensionScore;
    taskAlignment: QualityDimensionScore;
  };
  issues: ValidationIssue[];
  summary: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: 'valid_standard' | 'missing_input' | 'ambiguous_prompt' | 'edge_case' | 'unavailable_tool' | 'conflicting_evidence' | 'out_of_scope';
  inputPrompt: string;
  expectedBehavior: string;
  evaluationRubric: string;
}

export interface TestResult {
  testCaseId: string;
  executed: boolean;
  status: 'passed' | 'failed' | 'inconclusive' | 'untested';
  simulatedResponse?: string;
  observedBehaviors: string[];
  passedChecks: string[];
  failedChecks: string[];
  reasoning: string;
}

export interface VersionRecord {
  version: number;
  timestamp: string;
  changeSummary: string;
  files: SkillFile[];
  requirements?: RequirementsSpec;
}

export interface Skill {
  id: string;
  name: string; // e.g. "competitor-seo-intelligence"
  displayName: string; // e.g. "Competitor & SEO Intelligence Analyst"
  description: string;
  taskCategory: TaskCategory;
  targetEnvironment: TargetEnvironment;
  status: SkillLifecycleStatus;
  userPrompt: string;
  requirements: RequirementsSpec;
  researchSources: ResearchSource[];
  files: SkillFile[];
  validationReport?: ValidationReport;
  testCases: TestCase[];
  testResults: TestResult[];
  versions: VersionRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStage {
  id: string;
  skillId: string;
  stageName: string;
  inputMapping: string;
  outputArtifact: string;
}

export interface MultiSkillWorkflow {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  createdAt: string;
}
