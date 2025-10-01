import React from 'react';
import ContentDescription from '@/app/components/content/content-description';
import { type Post } from '@/api/posts';

interface SayingDescriptionProps {
  saying: Post;
}

const SayingDescription = ({ saying }: SayingDescriptionProps) => {
  return <ContentDescription content={saying} contentType="sayings" />;
};

export default SayingDescription;
