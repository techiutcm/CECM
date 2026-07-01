import { PaymentMethodsContent } from "@/components/pagos/payment-methods-content";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métodos de pago",
  description:
    "Cuentas bancarias, pago móvil y opciones en divisas para las sedes Mérida y El Vigía del Complejo Educativo Dr. Cristóbal Mendoza.",
};

export default function PagosPage() {
  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <SiteNavbar scrollProgress={1} />
      <PaymentMethodsContent />
      <SiteFooter />
    </div>
  );
}
