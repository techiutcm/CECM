import Script from "next/script";

const DEFAULT_LOADER_URL =
  "https://smartarget.online/loader.js?u=2fd5e6a99f42868e56cecb65f41b816aa689abb2";

function getLoaderUrl() {
  return (
    process.env.NEXT_PUBLIC_SMARTARGET_LOADER_URL?.trim() || DEFAULT_LOADER_URL
  );
}

export function SmartargetScript() {
  if (process.env.NEXT_PUBLIC_SMARTARGET_ENABLED === "false") {
    return null;
  }

  return (
    <Script
      id="smartarget-loader"
      src={getLoaderUrl()}
      strategy="afterInteractive"
    />
  );
}
