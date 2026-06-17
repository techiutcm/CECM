import { getAuthUser } from "@/lib/api/auth";
import { buildNavbarSession } from "@/lib/auth/navbar-session";
import { Navbar } from "@/components/site/navbar";

interface SiteNavbarProps {
  scrollProgress?: number;
  isMobile?: boolean;
}

export async function SiteNavbar({
  scrollProgress = 1,
  isMobile = false,
}: SiteNavbarProps) {
  const user = await getAuthUser();
  const session = user ? buildNavbarSession(user) : null;

  return (
    <Navbar
      scrollProgress={scrollProgress}
      isMobile={isMobile}
      session={session}
    />
  );
}
