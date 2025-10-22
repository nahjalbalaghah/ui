'use client';
import React from 'react';
import { BookOpen } from 'lucide-react';

interface ManuscriptCountBadgeProps {
  count: number;
}

const ManuscriptCountBadge: React.FC<ManuscriptCountBadgeProps> = ({ count }) => {
  if (count === 0) {
    return null;
  }

  const handleClick = () => {
    const manuscriptSection = document.getElementById('manuscript-references');
    if (manuscriptSection) {
      manuscriptSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[#43896B]/10 text-[#43896B] rounded-full border border-[#43896B]/20 hover:bg-[#43896B]/20 hover:border-[#43896B]/30 transition-all cursor-pointer active:scale-95"
      aria-label={`Scroll to ${count} manuscript ${count === 1 ? 'reference' : 'references'}`}
    >
      <BookOpen className="w-3.5 h-3.5" />
      <span>
        {count} {count === 1 ? 'Manuscript' : 'Manuscripts'}
      </span>
    </button>
  );
};

export default ManuscriptCountBadge;
