// Detect whether the app is running on the Published site (custom or *.lovable.app)
// vs the Lovable Preview/dev environment. Published needs larger UI for legibility.
export function isPublishedHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname || "";
  const isPreview =
    h.indexOf("id-preview--") === 0 ||
    h.endsWith(".lovableproject.com") ||
    h.endsWith(".lovable.dev") ||
    h === "localhost" ||
    h === "127.0.0.1";
  return !isPreview;
}
