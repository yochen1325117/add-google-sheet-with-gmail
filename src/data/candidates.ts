/**
 * 投票選項：1～103 流水號
 */

export interface Candidate {
  id: string;
  name: string;
}

export const CANDIDATES: Candidate[] = Array.from({ length: 103 }, (_, i) => {
  const n = i + 1;
  return { id: String(n), name: String(n) };
});
