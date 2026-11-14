/**
 * Achievements and certifications. The section stays hidden on the live site
 * while this list is empty.
 *
 * Example:
 * {
 *   title: "Certificate name",
 *   issuer: "Issuing organization",
 *   date: "2026",
 *   kind: "Certification",
 *   href: "https://link-to-credential", // optional
 * }
 */
export type Achievement = {
  title: string;
  issuer: string;
  date: string;
  kind: "Certification" | "Award" | "Competition";
  description?: string;
  href?: string;
};

export const achievements: Achievement[] = [];
