"use client";

import { cn } from "@/lib/utils";

export function AdmissionFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[900px] animate-pulse space-y-6 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
      <div className="space-y-3">
        <div className="h-3 w-32 rounded-full bg-[#083148]/10" />
        <div className="h-2 w-full rounded-full bg-[#083148]/10" />
      </div>
      <div className="space-y-3">
        <div className="h-10 w-2/3 rounded-xl bg-[#083148]/10" />
        <div className="h-4 w-full rounded-lg bg-[#083148]/8" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-[#083148]/8" />
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <div className="h-11 w-28 rounded-xl bg-[#083148]/10" />
        <div className="h-11 w-40 rounded-xl bg-[#083148]/15" />
      </div>
    </div>
  );
}

interface DocumentUploadSkeletonProps {
  className?: string;
}

export function DocumentUploadSkeleton({ className }: DocumentUploadSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border border-dashed border-[#083148]/15 bg-white/60 p-6",
        className,
      )}
    >
      <div className="mx-auto h-10 w-10 rounded-full bg-[#083148]/10" />
      <div className="mx-auto mt-4 h-4 w-40 rounded bg-[#083148]/10" />
      <div className="mx-auto mt-2 h-3 w-56 rounded bg-[#083148]/8" />
    </div>
  );
}
