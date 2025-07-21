import AboutSection from "@/app/sections/about";
import HeroSection from "@/app/sections/hero";
import IslamicScholarsSection from "@/app/sections/scholars";
import ServicesSection from "@/app/sections/services";
import ExploreHero from "./sections/hero";

export const metadata = {
  title: "Home | Nahj al-Balagha",
  description: "Discover the wisdom and eloquence of Imam Ali (AS) through Nahj al-Balagha. Explore sermons, letters, and sayings with translations and commentary.",
  openGraph: {
    title: "Home | Nahj al-Balagha",
    description: "Discover the wisdom and eloquence of Imam Ali (AS) through Nahj al-Balagha. Explore sermons, letters, and sayings with translations and commentary.",
    url: "https://nahj-al-balagha.com/",
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
    title: "Home | Nahj al-Balagha",
    description: "Discover the wisdom and eloquence of Imam Ali (AS) through Nahj al-Balagha. Explore sermons, letters, and sayings with translations and commentary.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balagha Logo"
      }
    ]
  }
};

export default function Home() {
  return (
    <div className="" >
      <ExploreHero />
      <AboutSection /> 
      <ServicesSection />
      <IslamicScholarsSection />
    </div>
  );
}
