import { about, facts } from "../data";
import { SectionKicker, AnimatedHeading } from "./ui/motion-primitives";
import { ContainerScroll } from "./ui/container-scroll";
import { HandSignature } from "./ui/hand-signature";

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-32">
        <SectionKicker>Profile</SectionKicker>

        {/* whole profile in one scroll-driven perspective card */}
        <ContainerScroll
          title={
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
              <AnimatedHeading inView text="Engineering with precision," className="block" />
              <AnimatedHeading
                inView
                delay={0.15}
                text="shipped with empathy."
                className="block text-mint"
              />
            </h2>
          }
        >
          <div className="grid md:h-[32rem] md:grid-cols-[0.82fr_1.18fr]">
            {/* portrait — 5:4 on mobile keeps ~60% of the frame in view (a fixed
                height cropped it to under half on narrow screens); the desktop
                grid row height takes over from md up. */}
            <div className="relative aspect-[5/4] md:aspect-auto md:min-h-[15rem]">
              <img
                src="/ai_profile.png"
                alt="Supratik Das, Senior Full Stack Engineer"
                width={480}
                height={640}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/50 via-transparent to-transparent" />
            </div>

            {/* bio + facts */}
            <div className="flex flex-col border-t border-line md:border-l md:border-t-0">
              <div className="space-y-3 p-6 sm:p-8">
                {about.map((p, i) => (
                  <p key={i} className="text-[13px] leading-relaxed text-ink-dim sm:text-sm">
                    {p}
                  </p>
                ))}

                {/* Personal sign-off — draws itself in when scrolled into view */}
                <div className="flex justify-end pt-3">
                  <HandSignature src="/my-signature.png" alt="Supratik Das signature" />
                </div>
              </div>
              <div className="mt-auto grid gap-px border-t border-line bg-line sm:grid-cols-2">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="bg-surface p-5 transition-colors duration-300 hover:bg-surface-2"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-cyan">
                      {f.label}
                    </div>
                    <div className="mt-1 font-display text-sm font-bold text-ink">{f.value}</div>
                    <div className="mt-0.5 text-xs text-ink-faint">{f.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}
