import { cn } from "@/lib/utils";
import { type LabelHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-montserrat text-sm font-medium text-[#083148]",
        className,
      )}
      {...props}
    />
  );
}
