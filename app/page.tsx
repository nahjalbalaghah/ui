import OrationsLettersSayingsSection from "./sections/content";
import ExploreHero from "./sections/hero";
import IndexesSection from "./sections/indexes";
import ManuscriptsSection from "./sections/manuscripts";

export const metadata = {
  title: "Explore | Nahj al-Balagha",
  description: "Explore sermons, letters, sayings, and manuscripts in Nahj al-Balagha. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
  openGraph: {
    title: "Explore | Nahj al-Balagha",
    description: "Explore sermons, letters, sayings, and manuscripts in Nahj al-Balagha. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
    url: "https://nahj-al-balagha.com/explore",
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
    title: "Explore | Nahj al-Balagha",
    description: "Explore sermons, letters, sayings, and manuscripts in Nahj al-Balagha. Search, read, and discover the timeless wisdom of Imam Ali (AS).",
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
            <ExploreHero />
            <OrationsLettersSayingsSection />
            <IndexesSection />
            <ManuscriptsSection />
        </div>        
    )
}