import { SlotSelect } from "./SlotSelect";
import type { Award } from "../data/awards";
import type { Candidate } from "../data/candidates";
import { getSlotId } from "../data/awards";
import { PLACE_LABELS } from "../data/awards";
import { getDisabledIdsForSlot, type ValidationError } from "../lib/validation";
import type { Selections } from "../lib/validation";

interface AwardCardProps {
  award: Award;
  candidates: Candidate[];
  selections: Selections;
  onSelectionsChange: (slotId: string, selected: Candidate[]) => void;
  validationError?: ValidationError | null;
}

export function AwardCard({
  award,
  candidates,
  selections,
  onSelectionsChange,
  validationError,
}: AwardCardProps) {
  // 檢查是否有獎項級別的錯誤（incomplete 類型且 awardId 匹配）
  const awardLevelError =
    validationError &&
    validationError.type === "incomplete" &&
    validationError.awardId === award.id
      ? validationError.message
      : undefined;

  return (
    <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{award.title}</h2>
      {awardLevelError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {awardLevelError}
        </div>
      )}
      <div className="space-y-4">
        {([1, 2, 3] as const).map((place) => {
          const slotId = getSlotId(award.id, place);
          const label = PLACE_LABELS[place - 1];
          const disabledIds = getDisabledIdsForSlot(selections, slotId);
          const error =
            validationError && validationError.slotId === slotId
              ? validationError.message
              : undefined;
          return (
            <SlotSelect
              key={slotId}
              candidates={candidates}
              selected={selections[slotId] ?? []}
              onChange={(selected) => onSelectionsChange(slotId, selected)}
              disabledIds={disabledIds}
              label={label}
              error={error}
            />
          );
        })}
      </div>
    </div>
  );
}
