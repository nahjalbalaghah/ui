'use client';
import React from 'react';
import { X } from 'lucide-react';
import Checkbox from '@/app/components/checkbox';
import RangeSlider from '@/app/components/range-slider';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterOptions {
  objectType: FilterOption[];
  language: FilterOption[];
  collection: FilterOption[];
  project: FilterOption[];
}

interface ActiveFilters {
  objectType: string[];
  language: string[];
  collection: string[];
  project: string[];
  fullyDigitized: boolean;
  hasMusicalNotations: boolean;
  dateRange: [number, number];
}

interface LeftFilterSidebarProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  activeFilterCount: number;
  filterOptions: FilterOptions;
  handleFilterChange: (
    category: keyof Pick<ActiveFilters, 'objectType' | 'language' | 'collection' | 'project'>,
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
    <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
            <button 
              onClick={() => setShowFilters(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Object Type</h4>
            <div className="space-y-3">
              {filterOptions.objectType.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.objectType.includes(option.id)}
                  onChange={(checked) => handleFilterChange('objectType', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Language</h4>
            <div className="space-y-3">
              {filterOptions.language.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.language.includes(option.id)}
                  onChange={(checked) => handleFilterChange('language', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Date Range</h4>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 flex justify-between">
                <span>700 CE</span>
                <span>1900 CE</span>
              </div>
              <div className='px-5'>
                <RangeSlider
                  min={700}
                  max={1900}
                  value={activeFilters.dateRange}
                  onChange={(range: [number, number]) => setActiveFilters(prev => ({
                    ...prev,
                    dateRange: range
                  }))}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>{activeFilters.dateRange[0]} CE</span>
                <span>{activeFilters.dateRange[1]} CE</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Collection</h4>
            <div className="space-y-3">
              {filterOptions.collection.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.collection.includes(option.id)}
                  onChange={(checked) => handleFilterChange('collection', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Project</h4>
            <div className="space-y-3">
              {filterOptions.project.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  checked={activeFilters.project.includes(option.id)}
                  onChange={(checked) => handleFilterChange('project', option.id, checked)}
                  label={`${option.label} (${option.count})`}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Additional Options</h4>
            <div className="space-y-3">
              <Checkbox
                id="fullyDigitized"
                checked={activeFilters.fullyDigitized}
                onChange={(checked) => setActiveFilters(prev => ({ ...prev, fullyDigitized: checked }))}
                label="Fully Digitized (12)"
              />
              <Checkbox
                id="hasMusicalNotations"
                checked={activeFilters.hasMusicalNotations}
                onChange={(checked) => setActiveFilters(prev => ({ ...prev, hasMusicalNotations: checked }))}
                label="Has Musical Notations (12)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}