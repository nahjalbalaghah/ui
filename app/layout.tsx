import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/ui/header";
import Footer from "./components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nahj al-Balagha | The Path of Timeless Eloquence",
    template: "%s | Nahj al-Balagha"
  },
  description: "Explore Nahj al-Balagha: sermons, letters, and sayings of Imam Ali (AS) with translations, commentaries, and scholarly insights. Discover timeless wisdom and eloquence.",
  keywords: [
    "Nahj al-Balagha",
    "Imam Ali",
    "Islamic sermons",
    "Islamic wisdom",
    "Islamic literature",
    "Arabic eloquence",
    "Islamic teachings",
    "Sermons",
    "Letters",
    "Sayings"
  ],
  metadataBase: new URL("https://nahj-al-balagha.com"),
  openGraph: {
    title: "Nahj al-Balagha | The Path of Timeless Eloquence",
    description: "Explore Nahj al-Balagha: sermons, letters, and sayings of Imam Ali (AS) with translations, commentaries, and scholarly insights.",
    url: "https://nahj-al-balagha.com",
    siteName: "Nahj al-Balagha",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balagha Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nahj al-Balagha | The Path of Timeless Eloquence",
    description: "Explore Nahj al-Balagha: sermons, letters, and sayings of Imam Ali (AS) with translations, commentaries, and scholarly insights.",
    site: "@nahjbalagha",
    creator: "@nahjbalagha",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balagha Logo"
      }
    ]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ar: "/ar",
      ur: "/ur"
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#43896B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
