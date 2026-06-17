import type { FooterSocialLink } from "@/lib/site/footer";

function FooterSocialIcon({ icon }: { icon: FooterSocialLink["icon"] }) {
  if (icon === "facebook") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5C10 6.6 11.2 5 14 5h3v3h-2c-.8 0-1 .4-1 1.1V10z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3h-3.2l-.2 1.2a7.5 7.5 0 0 0-3.1 1.3l-1-.8-2.3 2.3.8 1a7.6 7.6 0 0 0-1.3 3.1L5 9.5v3.2l1.2.2a7.5 7.5 0 0 0 1.3 3.1l-.8 1 2.3 2.3 1-.8a7.5 7.5 0 0 0 3.1 1.3l.2 1.2h3.2l.2-1.2a7.5 7.5 0 0 0 3.1-1.3l1 .8 2.3-2.3-.8-1a7.5 7.5 0 0 0 1.3-3.1l1.2-.2V9.5l-1.2-.2a7.5 7.5 0 0 0-1.3-3.1l.8-1-2.3-2.3-1 .8a7.5 7.5 0 0 0-3.1-1.3L16.5 3zm-4.5 11.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

interface FooterSocialProps {
  items: FooterSocialLink[];
}

export function FooterSocial({ items }: FooterSocialProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#083148]/10 bg-[#083148] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F9B214]/40 hover:bg-[#0d3045] hover:shadow-md"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <FooterSocialIcon icon={item.icon} />
          </span>
        </a>
      ))}
    </div>
  );
}
