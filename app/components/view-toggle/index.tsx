'use client';
import React from 'react';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          view === 'grid'
            ? 'bg-white text-[#43896B] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        Card View
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          view === 'list'
            ? 'bg-white text-[#43896B] shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4" />
        List View
      </button>
    </div>
  );
}
