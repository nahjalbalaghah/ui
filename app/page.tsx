import OrationsLettersSayingsSection from "./sections/content";
import ExploreHero from "./sections/hero";
import IndexesSection from "./sections/indexes";
import ResourcesSection from "./sections/resources";

export const metadata = {
  title: "Explore | Nahj al-Balaghah",
  description: "Explore sermons, letters, sayings, and Resources in Nahj al-Balaghah. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
  openGraph: {
    title: "Explore | Nahj al-Balaghah",
    description: "Explore sermons, letters, sayings, and Resources in Nahj al-Balaghah. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
    url: "https://nahj-al-balagha.com/explore",
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
    title: "Explore | Nahj al-Balaghah",
    description: "Explore sermons, letters, sayings, and Resources in Nahj al-Balaghah. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
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
            <ExploreHero />
            {/* <OrationsLettersSayingsSection /> */}
            <IndexesSection />
            {/* <ResourcesSection /> */}
        </div>        
    )
}