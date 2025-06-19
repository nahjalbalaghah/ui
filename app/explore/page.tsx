import ExploreHero from "./sections/hero";
import IndexesSection from "./sections/indexes";
import ManuscriptsSection from "./sections/manuscripts";

export default function Page() {
    return (
        <div>
            <ExploreHero />
            <IndexesSection />
            <ManuscriptsSection />
        </div>        
    )
}