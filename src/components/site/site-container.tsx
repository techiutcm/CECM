interface SiteContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Contenedor compartido para alinear textos entre secciones */
export function SiteContainer({ children, className = "" }: SiteContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
