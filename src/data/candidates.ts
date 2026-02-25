/**
 * 投票選項：1～200 流水號
 */

export interface Candidate {
  id: string;
  name: string;
}

export const CANDIDATES: Candidate[] = Array.from({ length: 200 }, (_, i) => {
  const n = i + 1;
  return { id: String(n), name: String(n) };
});
