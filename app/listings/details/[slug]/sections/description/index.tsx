'use client';
import React from 'react';

interface ManuscriptDescriptionProps {
  title?: string;
  description: string;
}

export default function ManuscriptDescription({ 
  title = "About This Manuscript", 
  description 
}: ManuscriptDescriptionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}