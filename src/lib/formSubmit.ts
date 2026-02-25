/**
 * 將投票結果以 application/x-www-form-urlencoded POST 到 Google Form
 */

import { FORM } from "../config";
import { SLOT_IDS } from "../data/awards";
import type { Candidate } from "../data/candidates";

export interface SubmitPayload {
  email: string;
  employeeId: string;
  submittedAt: string;
  slots: Record<string, Candidate[]>;
}

function buildFormBody(payload: SubmitPayload): string {
  const e = FORM.entry;
  const params = new URLSearchParams();
  params.append(e.email, payload.email);
  params.append(e.employeeId, payload.employeeId);
  params.append(e.submittedAt, payload.submittedAt);

  for (const slotId of SLOT_IDS) {
    const entryKey = slotId as keyof typeof e;
    const entryId = e[entryKey];
    if (!entryId) continue;
    const list = payload.slots[slotId] ?? [];
    const value = list.length > 0 ? list[0].id : "";
    params.append(entryId, value);
  }
  return params.toString();
}

export async function submitToGoogleForm(payload: SubmitPayload): Promise<void> {
  const url = FORM.action(FORM.id);
  const body = buildFormBody(payload);
  const res = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok && res.type !== "opaque") {
    if (res.status === 401) {
      throw new Error(
        "送出失敗: 401 Unauthorized。請確認 Google 表單未限制「僅登入者填寫」，表單設定 → 回覆 → 改為「任何人都可回覆」。"
      );
    }
    throw new Error(`送出失敗: ${res.status}`);
  }
}
