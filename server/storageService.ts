import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Skill } from '../src/types/skill.ts';
import { STARTER_SKILLS } from '../src/lib/templates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'skills.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(STARTER_SKILLS, null, 2), 'utf-8');
  }
}

export function getAllSkills(): Skill[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const skills = JSON.parse(raw);
    return Array.isArray(skills) ? skills : STARTER_SKILLS;
  } catch (err) {
    console.error('Error reading skills store:', err);
    return STARTER_SKILLS;
  }
}

export function getSkillById(id: string): Skill | null {
  const skills = getAllSkills();
  return skills.find((s) => s.id === id) || null;
}

export function saveSkill(skill: Skill): Skill {
  ensureDataFile();
  const skills = getAllSkills();
  const index = skills.findIndex((s) => s.id === skill.id);
  
  const updatedSkill: Skill = {
    ...skill,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    skills[index] = updatedSkill;
  } else {
    skills.unshift(updatedSkill);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(skills, null, 2), 'utf-8');
  return updatedSkill;
}

export function deleteSkill(id: string): boolean {
  ensureDataFile();
  const skills = getAllSkills();
  const filtered = skills.filter((s) => s.id !== id);
  if (filtered.length !== skills.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}
