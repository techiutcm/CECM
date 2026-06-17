import { SiteFooter } from "@/components/site/site-footer";

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-200/60">
      {children}
      <SiteFooter />
    </div>
  );
}
