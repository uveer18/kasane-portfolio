import Link from "next/link";
import { SiteFrame } from "@/components/layout/site-frame";

export default function NotFound() {
  return <SiteFrame><main className="page-shell flex min-h-[75vh] flex-col justify-center pt-24"><p className="meta-label text-accent">404 · Not found</p><h1 className="editorial-title mt-5 text-6xl">This page is missing.</h1><p className="mt-4 max-w-md text-sm text-muted-foreground">[Add this page to the portfolio when its content is ready.]</p><Link href="/" className="mt-7 w-fit text-sm text-accent underline underline-offset-4">Return home ↗</Link></main></SiteFrame>;
}
