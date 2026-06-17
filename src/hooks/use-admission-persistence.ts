"use client";

import {
  ADMISSION_SESSION_KEY,
  ADMISSION_STORAGE_KEY,
} from "@/lib/admissions/constants";
import type { AdmissionDraft } from "@/lib/admissions/types";
import { getDefaultAdmissionValues } from "@/lib/admissions/schema";
import { useCallback, useEffect, useState } from "react";

function getOrCreateSessionId() {
  if (typeof window === "undefined") return crypto.randomUUID();

  const existing = window.localStorage.getItem(ADMISSION_SESSION_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(ADMISSION_SESSION_KEY, sessionId);
  return sessionId;
}

function readDraft(): AdmissionDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMISSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdmissionDraft;
  } catch {
    return null;
  }
}

export function useAdmissionPersistence() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [draft, setDraft] = useState<AdmissionDraft>(() => ({
    values: getDefaultAdmissionValues(),
    currentStep: 1,
    sessionId: "",
    updatedAt: new Date().toISOString(),
  }));

  useEffect(() => {
    const stored = readDraft();
    const sessionId = stored?.sessionId || getOrCreateSessionId();

    setDraft(
      stored
        ? { ...stored, sessionId }
        : {
            values: getDefaultAdmissionValues(),
            currentStep: 1,
            sessionId,
            updatedAt: new Date().toISOString(),
          },
    );
    setIsHydrated(true);
  }, []);

  const persistDraft = useCallback((next: AdmissionDraft) => {
    setDraft(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMISSION_STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMISSION_STORAGE_KEY);
      window.localStorage.removeItem(ADMISSION_SESSION_KEY);
    }
    setDraft({
      values: getDefaultAdmissionValues(),
      currentStep: 1,
      sessionId: getOrCreateSessionId(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  return {
    draft,
    isHydrated,
    persistDraft,
    clearDraft,
  };
}
