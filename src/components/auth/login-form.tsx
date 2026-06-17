"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

async function resolveDashboardRedirect(explicitRedirect: string) {
  const params = new URLSearchParams();
  if (explicitRedirect && explicitRedirect !== "/") {
    params.set("redirect", explicitRedirect);
  }

  const response = await fetch(`/api/auth/dashboard-redirect?${params.toString()}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "No se pudo determinar el panel de acceso");
  }

  return payload.data.path as string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError === "auth_callback_failed"
      ? "No se pudo completar la autenticación. Intenta de nuevo."
      : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos"
          : signInError.message,
      );
      setIsLoading(false);
      return;
    }

    try {
      const destination = await resolveDashboardRedirect(redirectTo);
      router.push(destination);
      router.refresh();
    } catch (redirectError) {
      setError(
        redirectError instanceof Error
          ? redirectError.message
          : "No tienes permisos para acceder al panel administrativo.",
      );
      await supabase.auth.signOut();
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="space-y-2">
        <label htmlFor="email" className="font-montserrat text-sm font-medium text-[#083148]">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="font-montserrat h-12 w-full rounded-xl border border-[#083148]/15 bg-[#f7f9fc] px-4 text-[#083148] outline-none transition focus:border-[#5B3E8C]/40 focus:ring-4 focus:ring-[#5B3E8C]/10"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="font-montserrat text-sm font-medium text-[#083148]">
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="font-montserrat text-sm text-[#5B3E8C] hover:text-[#083148]"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="font-montserrat h-12 w-full rounded-xl border border-[#083148]/15 bg-[#f7f9fc] px-4 text-[#083148] outline-none transition focus:border-[#5B3E8C]/40 focus:ring-4 focus:ring-[#5B3E8C]/10"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="font-montserrat flex h-12 items-center justify-center rounded-xl bg-[#083148] text-sm font-semibold text-white transition hover:bg-[#0a3d5c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="font-montserrat text-center text-sm text-[#083148]/55">
        <Link href="/" className="font-semibold text-[#5B3E8C] hover:text-[#083148] hover:underline">
          Volver al inicio
        </Link>
      </p>
    </form>
  );
}
