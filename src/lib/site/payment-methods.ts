export interface PaymentField {
  label: string;
  value: string;
}

export interface PaymentMethodGroup {
  id: string;
  title: string;
  icon: "bank" | "mobile" | "currency";
  fields: PaymentField[];
  bullets?: string[];
}

export interface CampusPaymentInfo {
  id: string;
  name: string;
  subtitle: string;
  groups: PaymentMethodGroup[];
}

export const paymentPageContent = {
  heroImageSrc: "/pagos/payment-methods-hero.jpg",
  eyebrow: "Información institucional",
  title: "Métodos de pago",
  description:
    "Opciones disponibles para realizar tus pagos en nuestras sedes. Revisa los datos según la ubicación de tu representado y conserva el comprobante.",
  proofNotice:
    "Al finalizar tu pago, envía el comprobante por WhatsApp junto al nombre completo y grado del alumno.",
  whatsappLabel: "Enviar comprobante por WhatsApp",
  whatsappHref: "https://wa.me/584247800557",
};

const foreignCurrencyOptions = [
  "Recepción de efectivo directamente en la taquilla de administración de la sede El Vigía (Sector Coco Frío).",
];

const foreignCurrencyFields: PaymentField[] = [
  { label: "Binance", value: "yolberrojas@hotmail.com" },
  { label: "Zelle", value: "cursosiutcm@gmail.com — IUTCM LLC" },
  { label: "PayPal", value: "@iutcmonline — IUTCM LLC" },
];

export const paymentCampuses: CampusPaymentInfo[] = [
  {
    id: "merida",
    name: "Sede Mérida",
    subtitle: "Complejo Educativo Dr. Cristóbal Mendoza, C.A.",
    groups: [
      {
        id: "transfer",
        title: "Transferencia bancaria",
        icon: "bank",
        fields: [
          { label: "Banco", value: "Banco Nacional de Crédito (BNC)" },
          { label: "Cuenta corriente", value: "0191 0031 63 2131128852" },
          { label: "A nombre de", value: "Complejo Educativo Dr. Cristóbal Mendoza, C.A." },
          { label: "RIF", value: "J-508298128" },
        ],
      },
      {
        id: "mobile",
        title: "Pago móvil",
        icon: "mobile",
        fields: [
          { label: "Banco", value: "BNC — Banco Nacional de Crédito" },
          { label: "Teléfono", value: "0424-7800557" },
          { label: "RIF", value: "J-508298128" },
        ],
      },
      {
        id: "foreign",
        title: "Pagos en divisas",
        icon: "currency",
        fields: foreignCurrencyFields,
        bullets: foreignCurrencyOptions,
      },
    ],
  },
  {
    id: "el-vigia",
    name: "Sede El Vigía",
    subtitle: "Liceo Dr. Cristóbal Mendoza, C.A.",
    groups: [
      {
        id: "transfer",
        title: "Transferencia bancaria",
        icon: "bank",
        fields: [
          { label: "Banco", value: "Banco Nacional de Crédito (BNC)" },
          { label: "Cuenta corriente", value: "0191 0031 67 2131128847" },
          { label: "A nombre de", value: "Liceo Dr. Cristóbal Mendoza, C.A." },
          { label: "RIF", value: "J-506999544" },
        ],
      },
      {
        id: "mobile",
        title: "Pago móvil",
        icon: "mobile",
        fields: [
          { label: "Banco", value: "BNC — Banco Nacional de Crédito" },
          { label: "Teléfono", value: "0424-6772960" },
          { label: "RIF", value: "J-506999544" },
        ],
      },
      {
        id: "foreign",
        title: "Pagos en divisas",
        icon: "currency",
        fields: foreignCurrencyFields,
        bullets: foreignCurrencyOptions,
      },
    ],
  },
];
