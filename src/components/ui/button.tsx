import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const variants = {
  default:
    "bg-[#083148] text-white shadow-md hover:bg-[#0a3d5c] focus-visible:ring-[#083148]/30",
  outline:
    "border border-[#083148]/15 bg-white/80 text-[#083148] hover:bg-white focus-visible:ring-[#083148]/20",
  ghost: "text-[#083148] hover:bg-[#083148]/5",
  destructive: "bg-[#DB2B2C] text-white hover:bg-[#c42526] shadow-md",
};

const sizes = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-montserrat font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
