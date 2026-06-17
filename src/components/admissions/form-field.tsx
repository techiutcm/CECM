"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  icon: Icon,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-[#083148]/55" aria-hidden />}
        {label}
      </Label>
      {children}
      {error && (
        <p className="font-montserrat text-xs font-medium text-[#DB2B2C]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
