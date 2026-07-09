import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { sections, profile } from "../data";
import { EXPO } from "./ui/motion-primitives";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Center-line scroll-spy: a section is active when it crosses the viewport
    // middle. Works for any height (the hero is 250vh, so a 0.5 threshold never fires).
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EXPO, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`mx-auto flex h-16 max-w-content items-center justify-between px-5 transition-colors duration-300 sm:px-8 ${
          scrolled
            ? "border-b border-line/70 bg-base/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <a href="#home" className="font-mono text-sm font-medium tracking-wider text-cyan">
          SD<span className="text-ink-faint">.dev</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                  active === s.id ? "text-ink" : "text-ink-dim hover:text-ink"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan to-mint px-4 py-2 text-sm font-semibold text-base transition-transform duration-200 hover:scale-[1.03] sm:inline-flex"
          >
            Get in touch
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-dim transition-colors hover:text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
            className="overflow-hidden border-b border-line bg-base/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col px-5 py-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/50 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-dim last:border-0"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
