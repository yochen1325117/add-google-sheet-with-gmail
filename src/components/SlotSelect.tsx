import type { Candidate } from "../data/candidates";

interface SlotSelectProps {
  candidates: Candidate[];
  selected: Candidate[];
  onChange: (selected: Candidate[]) => void;
  disabledIds: Set<string>;
  label: string;
  error?: string;
}

export function SlotSelect({
  candidates,
  selected,
  onChange,
  disabledIds,
  label,
  error,
}: SlotSelectProps) {
  const value = selected.length > 0 ? selected[0].id : "";

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          const id = e.target.value;
          if (!id) {
            onChange([]);
            return;
          }
          const c = candidates.find((x) => x.id === id);
          if (c) onChange([c]);
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      >
        <option value="">請選擇</option>
        {candidates.map((c) => (
          <option
            key={c.id}
            value={c.id}
            disabled={disabledIds.has(c.id)}
          >
            {c.name}
            {disabledIds.has(c.id) ? "（已被選取）" : ""}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
