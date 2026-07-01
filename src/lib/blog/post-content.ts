import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "hr",
  "code",
  "pre",
];

export function sanitizePostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "title", "target", "rel", "class"],
      img: ["src", "alt", "title", "class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
  });
}

export function isHtmlContent(content: string) {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}

export function toEditorHtml(content: string) {
  if (!content.trim()) return "";
  if (isHtmlContent(content)) return content;

  const paragraphs = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`);

  return paragraphs.join("");
}
