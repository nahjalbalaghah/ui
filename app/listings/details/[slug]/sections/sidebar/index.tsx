'use client';
import React from 'react';
import { Calendar, MapPin, BookOpen, Languages } from 'lucide-react';

interface ManuscriptDetails {
  date: string;
  location: string;
  language: string;
  folios: string;
  dimensions: string;
  script: string;
  collection: string;
  project: string;
}

interface ManuscriptDetailsSidebarProps {
  details: ManuscriptDetails;
  className?: string;
}

export default function ManuscriptDetailsSidebar({ 
  details, 
  className = '' 
}: ManuscriptDetailsSidebarProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Manuscript Details</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Date</p>
            <p className="text-sm text-gray-600">{details.date}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Origin</p>
            <p className="text-sm text-gray-600">{details.location}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Languages className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Language</p>
            <p className="text-sm text-gray-600">{details.language}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Folios</p>
            <p className="text-sm text-gray-600">{details.folios}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dimensions</p>
            <p className="text-sm text-gray-600">{details.dimensions}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Script</p>
            <p className="text-sm text-gray-600">{details.script}</p>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Collection Information</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Collection</p>
            <p className="text-sm text-gray-600">{details.collection}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Project</p>
            <p className="text-sm text-gray-600">{details.project}</p>
          </div>
        </div>
      </div>
    </div>
  );
}