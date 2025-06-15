import AboutSection from "./sections/about";
import BlogEventsSection from "./sections/blogs";
import CausesSection from "./sections/causes";
import DonationSection from "./sections/donation";
import HeroSection from "./sections/hero";
import PillarsSection from "./sections/pillars";
import IslamicScholarsSection from "./sections/scholars";
import ServicesSection from "./sections/services";
import TimingsSection from "./sections/timings";

export default function Home() {
  return (
    <div className="" >
      <HeroSection />
      <AboutSection />
      <TimingsSection />
      <DonationSection />
      <ServicesSection />
      <PillarsSection />
      <CausesSection />
      <BlogEventsSection />
      <IslamicScholarsSection />
    </div>
  );
}
