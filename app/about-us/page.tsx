import PillarsSection from "../sections/pillars";
import IslamicScholarsSection from "../sections/scholars";
import ServicesSection from "../sections/services";
import ImpactCommunitySection from "./sections/community";
import AboutUsHero from "./sections/hero";
import TestimonialSection from "./sections/testimonial";

export default function Page() {
    return (
        <div>
            <AboutUsHero />
            <ImpactCommunitySection />
            <ServicesSection />
            <IslamicScholarsSection />
            <PillarsSection />
            <TestimonialSection />
        </div>
    )
}