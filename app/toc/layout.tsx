import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Table of Contents | Nahj al-Balaghah",
  description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
  openGraph: {
    title: "Table of Contents | Nahj al-Balaghah",
    description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
    url: "https://nahj-al-balagha.com/toc",
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
    title: "Table of Contents | Nahj al-Balaghah",
    description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
};

export default function TOCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
