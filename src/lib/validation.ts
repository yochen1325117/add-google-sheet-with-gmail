/**
 * 18 個槽位（6 獎項 × 3 名次），每槽最多選 1 個流水號，跨槽位不可重複
 * 當有填寫某一獎項時，該獎項的 1-3 名都必須填寫
 */

import type { Candidate } from "../data/candidates";
import { AWARDS, SLOT_IDS, getSlotId } from "../data/awards";

export type Selections = Record<string, Candidate[]>;

export interface ValidationError {
  type: "duplicate" | "count" | "incomplete";
  message: string;
  slotId?: string;
  awardId?: string;
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

/** 檢查每個獎項是否完整填寫（如果開始填寫，必須填完 1-3 名） */
export function findIncompleteAward(selections: Selections): ValidationError | null {
  for (const award of AWARDS) {
    const slot1 = selections[getSlotId(award.id, 1)] ?? [];
    const slot2 = selections[getSlotId(award.id, 2)] ?? [];
    const slot3 = selections[getSlotId(award.id, 3)] ?? [];
    
    const hasAnySelection = slot1.length > 0 || slot2.length > 0 || slot3.length > 0;
    const hasAllSelections = slot1.length > 0 && slot2.length > 0 && slot3.length > 0;
    
    if (hasAnySelection && !hasAllSelections) {
      const missingPlaces: string[] = [];
      if (slot1.length === 0) missingPlaces.push("第1名");
      if (slot2.length === 0) missingPlaces.push("第2名");
      if (slot3.length === 0) missingPlaces.push("第3名");
      
      return {
        type: "incomplete",
        awardId: award.id,
        message: `「${award.title}」已填寫部分名次，請完整填寫該獎項的 1-3 名（缺少：${missingPlaces.join("、")}）。`,
      };
    }
  }
  return null;
}

/** 綜合驗證：檢查跨槽位是否重複，以及獎項是否完整填寫 */
export function validate(selections: Selections): ValidationError | null {
  // 先檢查重複
  const duplicateError = findDuplicate(selections);
  if (duplicateError) return duplicateError;
  
  // 再檢查完整性
  const incompleteError = findIncompleteAward(selections);
  if (incompleteError) return incompleteError;
  
  return null;
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
