import React, { useState } from 'react';
import { Search, Filter, FolderKanban, Download, Trash2, ArrowRight, Copy, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { Skill, TaskCategory } from '../types/skill.ts';
import { downloadZipPackage } from '../lib/exportUtils.ts';

interface SkillLibraryProps {
  skills: Skill[];
  onSelectSkill: (skill: Skill) => void;
  onDuplicateSkill: (skill: Skill) => void;
  onDeleteSkill: (id: string) => void;
  onNewSkill: () => void;
}

export const SkillLibrary: React.FC<SkillLibraryProps> = ({
  skills,
  onSelectSkill,
  onDuplicateSkill,
  onDeleteSkill,
  onNewSkill,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || skill.taskCategory === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || skill.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Skills Library</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage, version, test, and package your custom Claude Skills.
          </p>
        </div>

        <button
          onClick={onNewSkill}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Skill</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by name, objective, or trigger..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Domains</option>
              <option value="seo_marketing">SEO & Marketing</option>
              <option value="data_analysis">Data Analysis</option>
              <option value="coding">Coding & Architecture</option>
              <option value="research">Research</option>
              <option value="writing">Writing & Narrative</option>
              <option value="automation">Automation & DevOps</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="validated">Validated</option>
              <option value="tested">Tested</option>
              <option value="refined">Refined</option>
              <option value="ready">Ready for Export</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching skills found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or create a brand new skill from the dashboard.
          </p>
          <button
            onClick={onNewSkill}
            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Create Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
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
                        isPassing
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
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
                    <span>v{skill.versions?.length || 1}</span>
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
                      title="Clone / Duplicate skill"
                      onClick={() => onDuplicateSkill(skill)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
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
      )}
    </div>
  );
};
