"use client";

import { FadeIn, ViewportFadeSection } from "@/components/ui/motion";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function XIcon({ className, ...props }: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}

const links = [
  {
    name: "GitHub",
    href: "https://github.com/uveer18",
    icon: Github,
    label: "@uveer18",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/udayveersiingh",
    icon: Linkedin,
    label: "Udayveer Singh",
  },
  {
    name: "Email",
    href: "mailto:uveer.work@gmail.com",
    icon: Mail,
    label: "uveer.work@gmail.com",
  },
  {
    name: "X",
    href: "https://twitter.com/CS13231",
    icon: XIcon,
    label: "@CS13231",
  },
  {
    name: "Photography",
    href: "https://instagram.com/soltragrv",
    icon: Instagram,
    label: "@soltragrv",
  },
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:uday.work@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <ViewportFadeSection id="contact" className="px-[var(--page-gutter)] py-12 md:py-16">
      <div className="page-shell">

        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Contact
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="text-center">
            <p className="mb-2 text-lg text-muted-foreground md:text-xl">
              Interested in collaborating or just want to say hello?
            </p>
            <p className="mb-8 text-sm text-muted-foreground md:text-lg">
              Or got some crispy intern/project role?
            </p>
            <p className="mb-12 text-2xl font-medium text-foreground md:text-3xl">
              {"Let's connect."}
            </p>
          </div>
        </FadeIn>

        {/* Contact Form */}
        <FadeIn delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="card-lit mx-auto max-w-xl space-y-5 rounded-xl border p-8 transition-all duration-500 ease-out"
          >
            <div className="grid gap-4 sm:grid-cols-2">

              <input
                type="text"
                placeholder="Your name"
                aria-label="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-accent"
              />

              <input
                type="email"
                placeholder="Your email"
                aria-label="Your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-accent"
              />

            </div>

            <textarea
              rows={5}
              placeholder="Your message"
              aria-label="Your message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-accent"
            />

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn-lit w-full rounded-lg border border-border bg-muted px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Send Message
            </motion.button>
          </form>
        </FadeIn>

        {/* Social Links BELOW form */}
        <FadeIn delay={0.3}>
          <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            {links.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.name !== "Email" ? "_blank" : undefined}
                rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                whileHover={{ y: -2 }}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="h-5 w-5" />
                <span className="text-sm">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </FadeIn>

      </div>
    </ViewportFadeSection>
  );
}
