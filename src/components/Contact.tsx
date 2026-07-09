import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Download } from "lucide-react";
import { profile } from "../data";
import { AnimatedHeading, Reveal, SectionKicker, Magnetic } from "./ui/motion-primitives";
import { VolumetricStudio } from "./ui/volumetric-studio";

const socials = [
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail, external: false },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: Linkedin, external: true },
  { label: "GitHub", href: profile.links.github, Icon: Github, external: true },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <VolumetricStudio className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-content px-5 py-28 text-center sm:px-8 sm:py-36">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center">
            <SectionKicker>Let's Connect</SectionKicker>
          </div>

          <h2 className="mt-8 font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
            <AnimatedHeading text="Let's build" className="block" />
            <AnimatedHeading text="something great." className="block text-mint" />
          </h2>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-7 max-w-md leading-relaxed text-ink-dim">
              Open to new opportunities, freelance projects, and interesting conversations. Whether
              you have a role in mind or just want to talk tech, reach out.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-mint px-7 py-3.5 text-sm font-semibold text-base"
            >
              <Mail size={16} /> Say hello
            </Magnetic>
            <Magnetic
              href={profile.links.cv}
              download
              strength={0.25}
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
            >
              <Download size={15} /> Download CV
            </Magnetic>
          </Reveal>

          <Reveal delay={0.35} className="mt-14 flex justify-center gap-3">
            {socials.map(({ label, href, Icon, external }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                whileHover={{ y: -5, scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-dim hover:border-line-bright hover:text-cyan"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
