import { HomeHero } from "@/components/home-hero";
import { PopularToolsPreview } from "@/components/popular-tools-preview";
import { StatsStrip } from "@/components/stats-strip";
import { WhyGenRise } from "@/components/why-genrise";
import { KitsShowcase } from "@/components/kits-showcase";
import { NewsletterCapture } from "@/components/newsletter-capture";
import { AdSlot } from "@/components/ad-slot";
import { HomeFaq } from "@/components/home-faq";

export default function Home() {
  return (
    <>
      <StatsStrip />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-start justify-center gap-6 px-4">
        <AdSlot className="mt-24" />
        <main className="flex w-full max-w-6xl flex-1 flex-col pb-20">
          <HomeHero />
          <PopularToolsPreview />
          <KitsShowcase />
          <NewsletterCapture />
          <WhyGenRise />
          <HomeFaq />
        </main>
        <AdSlot className="mt-24" />
      </div>
    </>
  );
}
