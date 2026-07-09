import { SectionKicker, Reveal, AnimatedHeading } from "./ui/motion-primitives";
import CareerTimeline from "./ui/career-timeline";

export default function Experience() {
  return (
    <section id="work" className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-32">
        <SectionKicker>Career</SectionKicker>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-16">
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            <AnimatedHeading inView text="Seven years, three teams." />
          </h2>
          <Reveal delay={0.1} className="self-end">
            <p className="max-w-md leading-relaxed text-ink-dim">
              Seven years across product companies and enterprise clients — the line below fills in
              as you walk the journey.
            </p>
          </Reveal>
        </div>

        <CareerTimeline />
      </div>
    </section>
  );
}
