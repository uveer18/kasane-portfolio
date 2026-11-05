import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/uveer18" },
  { label: "LinkedIn", href: "https://linkedin.com/in/udayveersiingh" },
  { label: "Instagram", href: "https://instagram.com/soltragrv" },
];

export function Footer() {
  return <><div className="closing-mark" aria-label="The end"><span>{"\u7d42"}</span></div><footer className="site-footer footer-transition section-rule relative px-6 py-7"><div className="page-shell flex flex-col items-center justify-between gap-5 text-xs text-muted-foreground sm:flex-row"><p>© {new Date().getFullYear()} Udayveer Singh</p><nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"><Link href="/">Home</Link><Link href="/work">Work</Link><Link href="/photography">Photography</Link><Link href="/games">Games</Link><Link href="/about">About</Link></nav><div className="flex flex-wrap items-center justify-center gap-5">{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">{social.label}</a>)}<a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">Résumé</a><a href="mailto:uveer.work@gmail.com" className="transition-colors hover:text-foreground">Email</a><Link href="/colophon" className="meta-label text-accent transition-colors hover:text-foreground">Colophon ↗</Link></div></div></footer></>;
}
