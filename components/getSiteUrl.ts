/**
 * Return localhost in development and the live site URL in production
 */
export function getSiteUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://css-magnetic-poetry.tone-row.com";
}
