import React, { Suspense } from 'react';
import ManuscriptsContent from './sections/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Historical Manuscripts | Nahj al-Balaghah",
  description: "Explore rare and ancient manuscripts of Nahj al-Balagha from renowned libraries across the Islamic world. Discover the rich history and preservation of this timeless text.",
  openGraph: {
    title: "Historical Manuscripts | Nahj al-Balaghah",
    description: "Explore rare and ancient manuscripts of Nahj al-Balagha from renowned libraries across the Islamic world.",
    url: "https://nahj-al-balagha.com/manuscripts",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Historical Manuscripts | Nahj al-Balaghah",
    description: "Explore rare and ancient manuscripts of Nahj al-Balagha from renowned libraries across the Islamic world.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
};

export default function ManuscriptsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptsContent />
      </Suspense>
    </div>
  );
}
