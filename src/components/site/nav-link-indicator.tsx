import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavLinkIndicatorProps {
  href: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavIndicatorBar({ active = false }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "mr-0 h-1 w-0 shrink-0 rounded-full bg-[#F9B214] transition-all duration-200 group-hover:mr-2 group-hover:w-3",
        active && "mr-2 w-3",
      )}
      aria-hidden
    />
  );
}

export function NavLinkIndicator({
  href,
  children,
  className,
  active = false,
  onClick,
}: NavLinkIndicatorProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center transition-all duration-200 hover:translate-x-0.5",
        className,
      )}
    >
      <NavIndicatorBar active={active} />
      {children}
    </Link>
  );
}
