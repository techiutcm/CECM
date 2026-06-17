import { LoginAsidePanel } from "@/components/auth/login-aside-panel";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthUser } from "@/lib/api/auth";
import { getPostLoginRedirect } from "@/lib/auth/post-login";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Iniciar sesión | Panel administrativo",
  description: "Accede al panel de blog o admisiones del Complejo Educativo",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

function LoginFormFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#083148] border-t-transparent" />
    </div>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const user = await getAuthUser();

  if (user) {
    const supabase = await createClient();
    const { data: staff } = await supabase
      .from("staff_users")
      .select("department")
      .eq("profile_id", user.id)
      .maybeSingle();

    redirect(
      getPostLoginRedirect(user, {
        explicitRedirect: params.redirect,
        staffDepartment: staff?.department ?? null,
      }),
    );
  }

  return (
    <div className="flex min-h-screen bg-[#eef2f6]">
      <LoginAsidePanel />

      <main className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/logo-navbar.png"
              alt="Complejo Educativo Dr. Cristóbal Mendoza"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <div>
              <p className="font-montserrat text-xs font-semibold uppercase tracking-wide text-[#083148]/55">
                Panel administrativo
              </p>
              <h1 className="font-bebas text-2xl uppercase tracking-wide text-[#083148]">
                Cristóbal Mendoza
              </h1>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#083148]/10 bg-white p-8 shadow-xl shadow-[#083148]/5">
            <div className="mb-8">
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#F9B214]">
                Ingreso seguro
              </p>
              <h2 className="font-bebas mt-3 text-3xl uppercase tracking-wide text-[#083148]">
                Iniciar sesión
              </h2>
              <p className="font-montserrat mt-3 text-sm leading-relaxed text-[#083148]/65">
                Ingresa tus credenciales. El sistema te llevará al dashboard de blog o
                admisiones según tu cuenta.
              </p>
            </div>

            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="font-montserrat mt-6 text-center text-xs text-[#083148]/45">
            Acceso restringido a personal autorizado.
          </p>
        </div>
      </main>
    </div>
  );
}
