import AboutUsHero from "./sections/hero";
import TeamSection from "./sections/team";
import SponsorsSection from "./sections/sponsors";

export const metadata = {
  title: "About Us | Nahj al-Balaghah",
  description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
  openGraph: {
    title: "About Us | Nahj al-Balaghah",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    url: "https://nahj-al-balagha.com/about-us",
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
    title: "About Us | Nahj al-Balaghah",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balaghah. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
};

export default function Page() {
    return (
        <div>
            <AboutUsHero />
            <TeamSection />
            <SponsorsSection />
        </div>
    )
}