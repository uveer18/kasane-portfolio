import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/sections/footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return <><Navigation />{children}<Footer /></>;
}
