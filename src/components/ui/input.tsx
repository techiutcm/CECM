import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[#083148]/15 bg-white/90 px-4 text-sm text-[#083148] shadow-sm transition placeholder:text-[#083148]/40 focus-visible:border-[#083148]/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#083148]/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
