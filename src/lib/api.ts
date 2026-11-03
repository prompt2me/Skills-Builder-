import { Skill, SkillFile, ValidationReport, TestCase, TestResult, RequirementsSpec } from '../types/skill.ts';

export async function fetchHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'error', geminiConfigured: false };
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  if (!res.ok) throw new Error('Failed to fetch skills');
  return await res.json();
}

export async function fetchSkillById(id: string): Promise<Skill> {
  const res = await fetch(`/api/skills/${id}`);
  if (!res.ok) throw new Error('Skill not found');
  return await res.json();
}

export async function saveSkillToServer(skill: Skill): Promise<Skill> {
  const res = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill),
  });
  if (!res.ok) throw new Error('Failed to save skill');
  return await res.json();
}

export async function deleteSkillFromServer(id: string): Promise<boolean> {
  const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete skill');
  const data = await res.json();
  return data.success;
}

export async function generateSkillViaPipeline(
  description: string,
  mode: 'quick' | 'research' | 'advanced',
  advancedConfig?: {
    domain?: string;
    targetEnvironment?: string;
    intendedUsers?: string;
    tools?: string;
    autonomyLevel?: string;
  }
): Promise<Skill> {
  const res = await fetch('/api/pipeline/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, mode, advancedConfig }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(errData.error || 'Generation failed');
  }
  return await res.json();
}

export async function refineSkillViaPipeline(
  skill: Skill,
  instruction: string,
  targetFilePath?: string
): Promise<{ skill: Skill; changeSummary: string }> {
  const res = await fetch('/api/pipeline/refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skill, instruction, targetFilePath }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Refinement failed' }));
    throw new Error(errData.error || 'Refinement failed');
  }
  return await res.json();
}

export async function validateSkillFiles(files: SkillFile[]): Promise<ValidationReport> {
  const res = await fetch('/api/pipeline/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error('Validation failed');
  return await res.json();
}

export async function runTestSimulation(
  files: SkillFile[],
  requirements: RequirementsSpec
): Promise<{ testCases: TestCase[]; testResults: TestResult[] }> {
  const res = await fetch('/api/pipeline/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files, requirements }),
  });
  if (!res.ok) throw new Error('Test run failed');
  return await res.json();
}
