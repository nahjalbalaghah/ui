'use client';
import React from 'react';
import Checkbox from '@/app/components/checkbox';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterOptions {
  type: FilterOption[];
  translations: FilterOption[];
  themes: FilterOption[];
  difficulty: FilterOption[];
  length: FilterOption[];
}

interface ActiveFilters {
  type: string[];
  translations: string[];
  themes: string[];
  difficulty: string[];
  length: string[];
  sortBy: string;
}

interface LeftFilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  activeFilterCount: number;
  filterOptions: FilterOptions;
  handleFilterChange: (
    category: keyof Pick<ActiveFilters, 'type' | 'translations' | 'themes' | 'difficulty' | 'length'>,
    id: string,
    checked: boolean
  ) => void;
  clearAllFilters: () => void;
}

export default function LeftFilterSidebar({
  showFilters,
  setShowFilters,
  activeFilters,
  setActiveFilters,
  activeFilterCount,
  filterOptions,
  handleFilterChange,
  clearAllFilters
}: LeftFilterSidebarProps) {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-[#43896B] text-sm hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Content Type</h4>
            <div className="space-y-3">
              {filterOptions.type.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.type.includes(option.id)}
                  onChange={(checked) => handleFilterChange('type', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Available Translations</h4>
            <div className="space-y-3">
              {filterOptions.translations.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.translations.includes(option.id)}
                  onChange={(checked) => handleFilterChange('translations', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Themes</h4>
            <div className="space-y-3">
              {filterOptions.themes.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.themes.includes(option.id)}
                  onChange={(checked) => handleFilterChange('themes', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Difficulty Level</h4>
            <div className="space-y-3">
              {filterOptions.difficulty.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.difficulty.includes(option.id)}
                  onChange={(checked) => handleFilterChange('difficulty', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Content Length</h4>
            <div className="space-y-3">
              {filterOptions.length.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.length.includes(option.id)}
                  onChange={(checked) => handleFilterChange('length', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}