import { profile } from "../data";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-base">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
        <span className="font-mono text-xs tracking-wider text-ink-dim">Supratik Das</span>
        <span className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} · Engineered with precision.
        </span>
        <div className="flex gap-5">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider text-ink-faint transition-colors hover:text-mint"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider text-ink-faint transition-colors hover:text-cyan"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="font-mono text-xs uppercase tracking-wider text-ink-faint transition-colors hover:text-mint"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
