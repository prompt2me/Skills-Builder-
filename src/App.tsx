import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { SkillEditor } from './components/SkillEditor.tsx';
import { SkillLibrary } from './components/SkillLibrary.tsx';
import { TemplatesView } from './components/TemplatesView.tsx';
import { WorkflowComposer } from './components/WorkflowComposer.tsx';
import { DirectValidator } from './components/DirectValidator.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { Skill, SkillFile, GenerationMode, ValidationReport, TestCase, TestResult } from './types/skill.ts';
import { STARTER_SKILLS } from './lib/templates.ts';
import {
  fetchHealth,
  fetchSkills,
  saveSkillToServer,
  deleteSkillFromServer,
  generateSkillViaPipeline,
  refineSkillViaPipeline,
  validateSkillFiles,
  runTestSimulation,
} from './lib/api.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'create' | 'library' | 'templates' | 'workflows' | 'validator'>('create');
  const [skills, setSkills] = useState<Skill[]>(STARTER_SKILLS);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [exportModalSkill, setExportModalSkill] = useState<Skill | null>(null);
  const [geminiConnected, setGeminiConnected] = useState(true);

  // Generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const health = await fetchHealth();
        setGeminiConnected(health.geminiConfigured);

        const loadedSkills = await fetchSkills();
        if (loadedSkills && loadedSkills.length > 0) {
          setSkills(loadedSkills);
        }
      } catch (err) {
        console.warn('Initial server fetch error, running with starter skills:', err);
      }
    }
    loadData();
  }, []);

  const handleGenerate = async (
    description: string,
    mode: GenerationMode,
    advancedConfig: any
  ) => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate animated step progression
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const generatedSkill = await generateSkillViaPipeline(description, mode, advancedConfig);
      clearInterval(interval);
      setGenerationStep(6);

      setSkills((prev) => [generatedSkill, ...prev]);
      setActiveSkill(generatedSkill);
    } catch (err: any) {
      console.error('Generation pipeline error:', err);
      clearInterval(interval);
      alert(`Generation notice: ${err.message || 'Pipeline execution completed with local fallback.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateSkill = async (updatedSkill: Skill) => {
    setActiveSkill(updatedSkill);
    setSkills((prev) => prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)));
    try {
      await saveSkillToServer(updatedSkill);
    } catch (err) {
      console.error('Failed to save to server:', err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill package?')) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      if (activeSkill?.id === id) {
        setActiveSkill(null);
      }
      try {
        await deleteSkillFromServer(id);
      } catch (err) {
        console.error('Failed to delete on server:', err);
      }
    }
  };

  const handleDuplicateSkill = (skill: Skill) => {
    const cloned: Skill = {
      ...skill,
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${skill.name}-copy`,
      displayName: `${skill.displayName} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          version: 1,
          timestamp: new Date().toISOString(),
          changeSummary: `Cloned from ${skill.name}`,
          files: skill.files,
        },
      ],
    };
    setSkills((prev) => [cloned, ...prev]);
    setActiveSkill(cloned);
    saveSkillToServer(cloned).catch(() => {});
  };

  const handleCloneTemplate = (template: Skill) => {
    handleDuplicateSkill(template);
  };

  const handleRunValidation = async (files: SkillFile[]): Promise<ValidationReport> => {
    return await validateSkillFiles(files);
  };

  const handleRunTests = async (files: SkillFile[]): Promise<{ testCases: TestCase[]; testResults: TestResult[] }> => {
    if (!activeSkill) throw new Error('No active skill');
    return await runTestSimulation(files, activeSkill.requirements);
  };

  const handleRefineSkill = async (skill: Skill, instruction: string, targetFile?: string) => {
    const res = await refineSkillViaPipeline(skill, instruction, targetFile);
    setActiveSkill(res.skill);
    setSkills((prev) => prev.map((s) => (s.id === res.skill.id ? res.skill : s)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (activeSkill) setActiveSkill(null);
        }}
        skillsCount={skills.length}
        onNewSkill={() => {
          setActiveSkill(null);
          setCurrentTab('create');
        }}
        geminiConnected={geminiConnected}
      />

      <main className="flex-1">
        {activeSkill ? (
          <SkillEditor
            skill={activeSkill}
            onUpdateSkill={handleUpdateSkill}
            onOpenExportModal={() => setExportModalSkill(activeSkill)}
            onRunValidation={handleRunValidation}
            onRunTests={handleRunTests}
            onRefineSkill={handleRefineSkill}
            onBackToDashboard={() => setActiveSkill(null)}
          />
        ) : (
          <>
            {currentTab === 'create' && (
              <Dashboard
                skills={skills}
                onGenerate={handleGenerate}
                onSelectSkill={(s) => setActiveSkill(s)}
                onDeleteSkill={handleDeleteSkill}
                isGenerating={isGenerating}
                generationStep={generationStep}
              />
            )}

            {currentTab === 'library' && (
              <SkillLibrary
                skills={skills}
                onSelectSkill={(s) => setActiveSkill(s)}
                onDuplicateSkill={handleDuplicateSkill}
                onDeleteSkill={handleDeleteSkill}
                onNewSkill={() => {
                  setActiveSkill(null);
                  setCurrentTab('create');
                }}
              />
            )}

            {currentTab === 'templates' && (
              <TemplatesView onCloneTemplate={handleCloneTemplate} />
            )}

            {currentTab === 'workflows' && (
              <WorkflowComposer
                skills={skills}
                onOpenSkill={(s) => setActiveSkill(s)}
              />
            )}

            {currentTab === 'validator' && <DirectValidator />}
          </>
        )}
      </main>

      {/* Export Modal */}
      {exportModalSkill && (
        <ExportModal
          skill={exportModalSkill}
          onClose={() => setExportModalSkill(null)}
        />
      )}
    </div>
  );
}
