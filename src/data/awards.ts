/**
 * 獎項定義：6 個獎項，每個獎項有 第1名、第2名、第3名 共 18 個投票欄位
 */

export interface Award {
  id: string;
  title: string;
}

export const AWARDS: Award[] = [
  { id: "award1", title: "全能辦公桌改造王" },
  { id: "award2", title: "北歐極簡主義擁護者" },
  { id: "award3", title: "空間利用的收納魔術師" },
  { id: "award4", title: "台幣戰士" },
  { id: "award5", title: "五感療癒的支配者" },
  { id: "award6", title: "文藝青年" },
];

/** 名次標題 */
export const PLACE_LABELS = ["第1名", "第2名", "第3名"] as const;

/** 18 個槽位 id：award1_1, award1_2, award1_3, award2_1, ... */
export const SLOT_IDS: string[] = AWARDS.flatMap((a) =>
  [1, 2, 3].map((p) => `${a.id}_${p}`)
);

export function getSlotId(awardId: string, place: 1 | 2 | 3): string {
  return `${awardId}_${place}`;
}
