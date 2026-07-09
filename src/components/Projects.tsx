import { SectionKicker, AnimatedHeading, Reveal } from "./ui/motion-primitives";
import ProjectTimeline from "./ui/project-timeline";

export default function Projects() {
  return (
    <section id="projects" className="border-t border-line">
      <div className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-32">
        <SectionKicker>Selected Work</SectionKicker>
        <div className="mt-8 max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            <AnimatedHeading inView text="Things I've built." />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 leading-relaxed text-ink-dim">
              A closer look at the work — scroll through; each project opens up as it reaches the
              centre of the screen.
            </p>
          </Reveal>
        </div>

        <ProjectTimeline />
      </div>
    </section>
  );
}
