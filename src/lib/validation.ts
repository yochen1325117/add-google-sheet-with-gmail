/**
 * 18 個槽位（6 獎項 × 3 名次）皆為選填，每槽最多選 1 個流水號，跨槽位不可重複
 */

import type { Candidate } from "../data/candidates";
import { SLOT_IDS } from "../data/awards";

export type Selections = Record<string, Candidate[]>;

export interface ValidationError {
  type: "duplicate" | "count";
  message: string;
  slotId?: string;
}

/** 收集所有已選的 id（跨槽位） */
export function getSelectedIds(selections: Selections): Set<string> {
  const ids = new Set<string>();
  for (const list of Object.values(selections)) {
    for (const c of list) ids.add(c.id);
  }
  return ids;
}

/** 檢查是否有跨槽位重複選擇 */
export function findDuplicate(selections: Selections): ValidationError | null {
  const ids = new Set<string>();
  for (const slotId of SLOT_IDS) {
    const list = selections[slotId] ?? [];
    for (const c of list) {
      if (ids.has(c.id)) {
        return {
          type: "duplicate",
          slotId,
          message: `流水號「${c.name}」已在其他獎項/名次中被選擇，不可重複。`,
        };
      }
      ids.add(c.id);
    }
  }
  return null;
}

/** 綜合驗證：僅檢查跨槽位是否重複（獎項皆為選填） */
export function validate(selections: Selections): ValidationError | null {
  return findDuplicate(selections);
}

/** 取得某槽位以外已被選走的 id 集合（供 UI 將該槽選單中選項 disable） */
export function getDisabledIdsForSlot(
  selections: Selections,
  currentSlotId: string
): Set<string> {
  const ids = new Set<string>();
  for (const slotId of SLOT_IDS) {
    if (slotId === currentSlotId) continue;
    const list = selections[slotId] ?? [];
    for (const c of list) ids.add(c.id);
  }
  return ids;
}
