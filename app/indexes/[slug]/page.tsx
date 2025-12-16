import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryBySlug, indexCategories } from '@/app/data/indexes';
import IndexListing from '@/app/components/index-listing';

// Generate static params for all index categories at build time
export async function generateStaticParams() {
  return indexCategories.map((category) => ({
    slug: category.slug,
  }));
}

// Disable dynamic params - only pre-rendered pages will be served
export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Not Found | Nahj al-Balaghah',
    };
  }

  return {
    title: `${category.title} | Nahj al-Balaghah`,
    description: category.description,
  };
}

export default async function IndexCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight mb-4">
              {category.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>
      <IndexListing items={category.items} categorySlug={slug} />
    </div>
  );
}