import { emailBrand } from "@/lib/email/brand";
import { escapeHtml } from "@/lib/email/escape";
import { getAbsoluteAssetUrl, getSiteUrl } from "@/lib/email/site-url";

export interface EmailCta {
  label: string;
  href: string;
}

export interface EmailLayoutOptions {
  title: string;
  previewText?: string;
  heading: string;
  bodyHtml: string;
  cta?: EmailCta;
}

function buildPreviewText(previewText: string) {
  const hidden = escapeHtml(previewText);
  return `
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
      ${hidden}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
  `;
}

function buildCta(cta: EmailCta) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
      <tr>
        <td align="center" style="border-radius:999px;background-color:${emailBrand.colors.gold};">
          <a
            href="${escapeHtml(cta.href)}"
            target="_blank"
            rel="noopener noreferrer"
            style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${emailBrand.colors.navy};text-decoration:none;border-radius:999px;"
          >
            ${escapeHtml(cta.label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function renderEmailLayout({
  title,
  previewText,
  heading,
  bodyHtml,
  cta,
}: EmailLayoutOptions) {
  const { colors } = emailBrand;
  const siteUrl = getSiteUrl();
  const logoUrl = getAbsoluteAssetUrl(emailBrand.logoPath);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.background};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${previewText ? buildPreviewText(previewText) : ""}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colors.background};">
    <tr>
      <td align="center" style="padding:24px 12px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td style="height:5px;border-radius:12px 12px 0 0;background:linear-gradient(90deg, ${colors.gold} 0%, ${colors.red} 50%, ${colors.purple} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="background-color:${colors.navy};border-radius:0 0 0 0;padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="56" valign="middle" style="padding-right:14px;">
                    <img
                      src="${logoUrl}"
                      alt="${escapeHtml(emailBrand.name)}"
                      width="48"
                      height="48"
                      style="display:block;width:48px;height:48px;border:0;outline:none;"
                    />
                  </td>
                  <td valign="middle">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${colors.gold};">
                      ${escapeHtml(emailBrand.shortName)}
                    </p>
                    <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.35;color:${colors.white};">
                      ${escapeHtml(emailBrand.name)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:${colors.white};border-left:1px solid ${colors.border};border-right:1px solid ${colors.border};padding:32px 28px 28px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${colors.purple};">
                Notificación institucional
              </p>
              <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;font-weight:700;color:${colors.navy};">
                ${escapeHtml(heading)}
              </h1>
              <div style="width:56px;height:4px;border-radius:999px;background-color:${colors.gold};margin:0 0 24px;"></div>

              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${colors.text};">
                ${bodyHtml}
              </div>

              ${cta ? buildCta(cta) : ""}
            </td>
          </tr>

          <tr>
            <td style="background-color:${colors.background};border:1px solid ${colors.border};border-top:none;border-radius:0 0 16px 16px;padding:24px 28px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${colors.textMuted};">
                ${escapeHtml(emailBrand.tagline)}
              </p>
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${colors.textMuted};">
                <a href="mailto:${emailBrand.contactEmail}" style="color:${colors.navy};text-decoration:none;font-weight:600;">
                  ${escapeHtml(emailBrand.contactEmail)}
                </a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}" style="color:${colors.navy};text-decoration:none;font-weight:600;">
                  ${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}
                </a>
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:${colors.textLight};">
                © ${year} ${escapeHtml(emailBrand.name)}. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderEmailParagraph(text: string) {
  return `<p style="margin:0 0 16px;">${escapeHtml(text)}</p>`;
}

export function renderEmailGreeting(name: string) {
  return `<p style="margin:0 0 16px;">Estimado/a <strong style="color:${emailBrand.colors.navy};">${escapeHtml(name)}</strong>,</p>`;
}

export function renderEmailDetailsTable(
  rows: Array<{ label: string; value: string }>,
) {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid ${emailBrand.colors.border};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:${emailBrand.colors.textMuted};width:38%;vertical-align:top;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid ${emailBrand.colors.border};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${emailBrand.colors.navy};vertical-align:top;">
            ${escapeHtml(row.value)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;border:1px solid ${emailBrand.colors.border};border-radius:12px;overflow:hidden;background-color:${emailBrand.colors.background};">
      ${rowsHtml}
    </table>
  `;
}

export function renderEmailNote(text: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
      <tr>
        <td style="padding:14px 16px;border-left:4px solid ${emailBrand.colors.gold};background-color:${emailBrand.colors.background};border-radius:0 10px 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${emailBrand.colors.textMuted};">
          ${escapeHtml(text)}
        </td>
      </tr>
    </table>
  `;
}
