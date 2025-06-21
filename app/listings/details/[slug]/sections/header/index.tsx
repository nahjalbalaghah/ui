'use client';
import React from 'react';
import { ArrowLeft, Download, Share2, BookOpen, Calendar, FileText } from 'lucide-react';
import Button from '@/app/components/button';

interface ManuscriptData {
  title: string;
  arabicTitle: string;
  description: string;
  chapter: number;
  type: string;
  digitized: boolean;
}

interface ManuscriptHeaderProps {
  manuscript: ManuscriptData;
  onBack?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function ManuscriptHeader({ 
  manuscript, 
  onBack, 
  onDownload, 
  onShare 
}: ManuscriptHeaderProps) {
  return (
    <div className="mb-8">
      <nav className="mb-6">
        <Button
          variant="outlined"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack || (() => window.history.back())}
        >
          Back to Manuscripts
        </Button>
      </nav>
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#43896B] via-[#5BA375] to-[#43896B]"></div>
        <div className="p-8 lg:p-10">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#43896B] text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>Manuscript Collection</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {manuscript.title}
                </h1>
                <h2 className="text-xl lg:text-2xl text-[#43896B] font-arabic leading-relaxed">
                  {manuscript.arabicTitle}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
                  {manuscript.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#43896B] text-white rounded-xl shadow-sm">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Chapter {manuscript.chapter}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{manuscript.type}</span>
                </div>
                {manuscript.digitized && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Fully Digitized</span>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-center bg-[#43896B] hover:bg-[#3A7A5E] text-white shadow-md hover:shadow-lg transition-all duration-200"
                      icon={<Download className="w-4 h-4" />}
                      onClick={onDownload}
                    >
                      Download Manuscript
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      className="w-full justify-center border-gray-300 hover:bg-gray-50 transition-all duration-200"
                      icon={<Share2 className="w-4 h-4" />}
                      onClick={onShare}
                    >
                      Share
                    </Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Document Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">PDF Document</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${manuscript.digitized ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {manuscript.digitized ? 'Available' : 'Processing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium">Arabic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}