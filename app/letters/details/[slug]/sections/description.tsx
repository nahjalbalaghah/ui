import React from 'react';
import ContentDescription from '@/app/components/content/content-description';
import { type Post } from '@/api/posts';

interface LetterDescriptionProps {
  letter: Post;
}

const LetterDescription = ({ letter }: LetterDescriptionProps) => {
  return <ContentDescription content={letter} contentType="letters" />;
};

export default LetterDescription;
