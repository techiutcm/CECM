import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-zinc-50">
      <SiteNavbar scrollProgress={1} />
      <div className="pt-24 sm:pt-28">{children}</div>
      <SiteFooter />
    </div>
  );
}
