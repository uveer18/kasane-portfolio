import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { MotionConfig } from "framer-motion";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { HeroProvider } from "@/components/hero-context";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://udayveersingh.vercel.app"),
  title: "Udayveer Singh",
  description:
    "Portfolio of Udayveer Singh specializing in image deep learning and artistic photography. Building AI tools that bridge technology and visual art.",
  keywords: [
    "Machine Learning",
    "AI",
    "Deep Learning",
    "Photography",
    "Computer Vision",
    "Image Processing",
  ],
  authors: [{ name: "Udayveer Singh" }],

  icons: {
    icon: "/favicon.svg",
  },

  openGraph: {
    title: "Udayveer Singh",
    description:
      "Building AI tools and capturing artistic photography. Specializing in image deep learning and visual art.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Udayveer Singh",
    description: "Building systems. Seeing things differently.",
  },
};

export const viewport: Viewport = {
  themeColor: "#EAE5D9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        geist.variable,
        newsreader.variable,
        ibmPlexMono.variable,
        "font-sans"
      )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="min-h-screen antialiased transition-colors duration-300">
        <Script id="kasane-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: "try { if (localStorage.getItem('theme') === 'dark') { document.documentElement.classList.add('dark'); document.querySelector('meta[name=theme-color]')?.setAttribute('content', '#121617'); } } catch {}" }} />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
          <HeroProvider>
            {children}
          </HeroProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
