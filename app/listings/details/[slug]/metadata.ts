import { manuscriptData } from '@/app/data';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${manuscriptData.title} | Nahj al-Balagha`,
    description: manuscriptData.fullDescription || manuscriptData.subtitle || 'Read this sermon/manuscript from Nahj al-Balagha.',
    openGraph: {
      title: `${manuscriptData.title} | Nahj al-Balagha`,
      description: manuscriptData.fullDescription || manuscriptData.subtitle || 'Read this sermon/manuscript from Nahj al-Balagha.',
      url: `https://nahj-al-balagha.com/listings/details/${manuscriptData.id}`,
      images: manuscriptData.images?.length ? manuscriptData.images.map((img) => ({ url: img.url, width: 1200, height: 630, alt: img.title || manuscriptData.title })) : [
        { url: '/globe.svg', width: 1200, height: 630, alt: 'Nahj al-Balagha Logo' }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${manuscriptData.title} | Nahj al-Balagha`,
      description: manuscriptData.fullDescription || manuscriptData.subtitle || 'Read this sermon/manuscript from Nahj al-Balagha.',
      images: manuscriptData.images?.length ? manuscriptData.images.map((img) => ({ url: img.url, alt: img.title || manuscriptData.title })) : [
        { url: '/globe.svg', alt: 'Nahj al-Balagha Logo' }
      ]
    }
  };
} 