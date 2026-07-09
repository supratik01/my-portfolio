import { motion } from "framer-motion";
import { skills } from "../data";
import { SectionKicker, Reveal, staggerParent, staggerChild, AnimatedHeading } from "./ui/motion-primitives";

const levelColor: Record<string, string> = {
  Expert: "text-mint",
  Advanced: "text-cyan",
  Pro: "text-ink-dim",
  Intermediate: "text-gold",
};

export default function TechStack() {
  return (
    <section id="stack" className="border-t border-line">
      <div className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-32">
        <SectionKicker>Engineering Stack</SectionKicker>
        <div className="mt-8 max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            <AnimatedHeading inView text="The tools I build with." />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 leading-relaxed text-ink-dim">
              A stack refined over 7+ years shipping high-traffic consumer platforms — from canvas
              editors to REST backends.
            </p>
          </Reveal>
        </div>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {skills.map((s) => (
            <motion.li
              key={s.name}
              variants={staggerChild}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group rounded-xl border border-line bg-surface p-5 transition-colors hover:border-cyan/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display font-bold text-ink">{s.name}</span>
                <span className={`font-mono text-[10px] uppercase tracking-wide ${levelColor[s.level]}`}>
                  {s.level}
                </span>
              </div>
              <div className="mt-1 text-xs text-ink-faint">{s.note}</div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
