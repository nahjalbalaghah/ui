import IslamicScholarsSection from "../sections/scholars";
import ServicesSection from "../sections/services";
import ImpactCommunitySection from "./sections/community";
import AboutUsHero from "./sections/hero";

export const metadata = {
  title: "About Us | Nahj al-Balagha",
  description: "Learn about the mission, vision, and community impact of Nahj al-Balagha. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
  openGraph: {
    title: "About Us | Nahj al-Balagha",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balagha. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    url: "https://nahj-al-balagha.com/about-us",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balagha Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Nahj al-Balagha",
    description: "Learn about the mission, vision, and community impact of Nahj al-Balagha. Discover our dedication to preserving and sharing the wisdom of Imam Ali (AS).",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balagha Logo"
      }
    ]
  }
};

export default function Page() {
    return (
        <div>
            <AboutUsHero />
            <ImpactCommunitySection />
            <ServicesSection />
            <IslamicScholarsSection />
        </div>
    )
}