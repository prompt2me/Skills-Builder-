import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  interpretAndSpecify,
  conductResearch,
  planArchitecture,
  generateSkillPackage,
  generateAndRunTests,
  refineSkillPackage,
  isApiKeyConfigured,
} from './server/geminiService.ts';
import { getAllSkills, getSkillById, saveSkill, deleteSkill } from './server/storageService.ts';
import { validateSkillPackage } from './src/lib/claudeSkillStandards.ts';
import { Skill, SkillFile } from './src/types/skill.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health and Config Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: isApiKeyConfigured(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// CRUD Skills Persistence
app.get('/api/skills', (req, res) => {
  try {
    const skills = getAllSkills();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/skills/:id', (req, res) => {
  try {
    const skill = getSkillById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/skills', (req, res) => {
  try {
    const skill = req.body as Skill;
    if (!skill || !skill.id || !skill.name) {
      return res.status(400).json({ error: 'Invalid skill data' });
    }
    const saved = saveSkill(skill);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/skills/:id', (req, res) => {
  try {
    const success = deleteSkill(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Validate Skill Package directly
app.post('/api/pipeline/validate', (req, res) => {
  try {
    const { files } = req.body as { files: SkillFile[] };
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Expected files array' });
    }
    const report = validateSkillPackage(files);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Run Test Simulation
app.post('/api/pipeline/test', async (req, res) => {
  try {
    const { files, requirements } = req.body;
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Expected files array' });
    }
    const result = await generateAndRunTests(files, requirements);
    res.json(result);
  } catch (err: any) {
    console.error('Test simulation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Refine / Targeted Revision
app.post('/api/pipeline/refine', async (req, res) => {
  try {
    const { skill, instruction, targetFilePath } = req.body;
    if (!skill || !instruction) {
      return res.status(400).json({ error: 'Missing skill or instruction' });
    }
    const refinement = await refineSkillPackage(skill, instruction, targetFilePath);
    
    // Revalidate updated package
    const validationReport = validateSkillPackage(refinement.files);
    
    // Append version record
    const newVersionNumber = (skill.versions?.length || 0) + 2;
    const versionRecord = {
      version: newVersionNumber,
      timestamp: new Date().toISOString(),
      changeSummary: refinement.changeSummary,
      files: refinement.files,
    };

    const updatedSkill: Skill = {
      ...skill,
      files: refinement.files,
      validationReport,
      status: 'refined',
      versions: [...(skill.versions || []), versionRecord],
      updatedAt: new Date().toISOString(),
    };

    saveSkill(updatedSkill);
    res.json({ skill: updatedSkill, changeSummary: refinement.changeSummary });
  } catch (err: any) {
    console.error('Refinement endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Full Autonomous End-to-End Skill Generation Pipeline
app.post('/api/pipeline/generate', async (req, res) => {
  try {
    const {
      description,
      mode = 'quick',
      advancedConfig = {},
    } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'A task description is required.' });
    }

    console.log(`[Pipeline] Starting generation for: "${description}" (Mode: ${mode})`);

    // Stage 1 & 2: Intent Interpretation & Requirements Analysis
    const requirements = await interpretAndSpecify(description, advancedConfig);

    // Stage 3: Research & Grounding (if research mode, advanced mode, or specialized domain)
    const researchDepth = mode === 'research' ? 'deep' : mode === 'advanced' ? 'standard' : 'minimal';
    const researchSources = await conductResearch(requirements, researchDepth);

    // Stage 4: Architecture Planning
    const architecture = await planArchitecture(requirements, researchSources);

    // Stage 5: Skill Files Generation
    const files = await generateSkillPackage(requirements, researchSources, architecture);

    // Stage 6: Structural & Semantic Validation
    const validationReport = validateSkillPackage(files);

    // Stage 7: Behavioral Test Suite & Execution Simulation
    const { testCases, testResults } = await generateAndRunTests(files, requirements);

    // Construct Skill entity
    const skillKebabName = (
      files[0]?.content.match(/^name:\s*([a-z0-9-]+)/m)?.[1] ||
      requirements.objective.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)
    ).replace(/^-+|-+$/g, '');

    const displayName = skillKebabName
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const newSkill: Skill = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: skillKebabName,
      displayName,
      description: requirements.objective,
      taskCategory: requirements.taskType,
      targetEnvironment: (advancedConfig.targetEnvironment as any) || 'all',
      status: validationReport.isCompatible ? 'tested' : 'draft',
      userPrompt: description,
      requirements,
      researchSources,
      files,
      validationReport,
      testCases,
      testResults,
      versions: [
        {
          version: 1,
          timestamp: new Date().toISOString(),
          changeSummary: `Initial generation via ${mode} mode`,
          files,
          requirements,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to persistent storage
    saveSkill(newSkill);

    console.log(`[Pipeline] Successfully generated and saved skill: ${newSkill.name}`);
    res.json(newSkill);
  } catch (err: any) {
    console.error('[Pipeline] Generation failed:', err);
    res.status(500).json({ error: err.message || 'Skill generation failed.' });
  }
});

// Frontend Integration: Development (Vite middleware) vs Production (Static)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 AI Skill Architect server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
