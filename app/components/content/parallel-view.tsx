'use client';
import React, { useState, useEffect } from 'react';
import { type Post } from '@/api/orations';
import EditionColumn from './edition-column';
import { Split } from 'lucide-react';

interface ParallelViewProps {
  initialPost: Post;
  availablePosts: Post[];
  contentType: 'orations' | 'letters' | 'sayings';
  highlightRef?: string | null;
  englishWord?: string | null;
  arabicWord?: string | null;
}

const ParallelView = ({
  initialPost,
  availablePosts,
  contentType,
  highlightRef,
  englishWord,
  arabicWord
}: ParallelViewProps) => {
  const [leftPost, setLeftPost] = useState<Post>(initialPost);
  const [rightPost, setRightPost] = useState<Post | null>(null);

  useEffect(() => {
    setLeftPost(initialPost);
    setRightPost(null);
  }, [initialPost]);

  // Initialize right post with a different edition if available
  useEffect(() => {
    if (availablePosts.length > 1 && !rightPost) {
      const otherPost = availablePosts.find(p => p.id !== initialPost.id);
      if (otherPost) {
        setRightPost(otherPost);
      } else {
        setRightPost(availablePosts[0]);
      }
    } else if (availablePosts.length > 0 && !rightPost) {
      setRightPost(availablePosts[0]);
    }
  }, [availablePosts, initialPost.id, rightPost]);

  const handleLeftEditionChange = (editionId: string) => {
    const post = availablePosts.find(p => {
      if (p.editions && Array.isArray(p.editions)) {
        return p.editions.some((e: any) => e.id.toString() === editionId);
      } else if (p.editions && p.editions.id) {
        return p.editions.id.toString() === editionId;
      }
      return false;
    });
    if (post) setLeftPost(post);
  };

  const handleRightEditionChange = (editionId: string) => {
    const post = availablePosts.find(p => {
      if (p.editions && Array.isArray(p.editions)) {
        return p.editions.some((e: any) => e.id.toString() === editionId);
      } else if (p.editions && p.editions.id) {
        return p.editions.id.toString() === editionId;
      }
      return false;
    });
    if (post) setRightPost(post);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <EditionColumn
            content={leftPost}
            availablePosts={availablePosts}
            contentType={contentType}
            highlightRef={highlightRef}
            englishWord={englishWord}
            arabicWord={arabicWord}
            onEditionChange={handleLeftEditionChange}
            side="left"
          />
        </div>
        <div className="flex flex-col gap-4">
          {rightPost ? (
            <EditionColumn
              content={rightPost}
              availablePosts={availablePosts}
              contentType={contentType}
              highlightRef={highlightRef}
              englishWord={englishWord}
              arabicWord={arabicWord}
              onEditionChange={handleRightEditionChange}
              side="right"
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Split className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Editions</h3>
              <p className="text-gray-500 max-w-60">
                Select another edition from the dropdown to see them side-by-side.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParallelView;
