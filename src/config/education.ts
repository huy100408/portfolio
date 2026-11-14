/**
 * Education. The section stays hidden on the live site while this list is empty.
 *
 * Example:
 * {
 *   school: "School name",
 *   credential: "Program or diploma",
 *   period: "2024 – 2028",
 *   location: "City",            // optional
 *   notes: ["Relevant coursework…"], // optional
 * }
 */
export type EducationEntry = {
  school: string;
  credential: string;
  period: string;
  location?: string;
  notes?: string[];
};

export const education: EducationEntry[] = [];
