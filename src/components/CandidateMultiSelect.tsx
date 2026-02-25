import { useMemo, useState, useRef, useEffect } from "react";
import type { Candidate } from "../data/candidates";

interface CandidateMultiSelectProps {
  candidates: Candidate[];
  selected: Candidate[];
  onChange: (selected: Candidate[]) => void;
  min: number;
  max: number;
  disabledIds: Set<string>;
  disabledReason?: string;
  awardTitle: string;
  error?: string;
}

export function CandidateMultiSelect({
  candidates,
  selected,
  onChange,
  min,
  max,
  disabledIds,
  disabledReason = "已被其他獎項選取",
  awardTitle,
  error,
}: CandidateMultiSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => c.name.toLowerCase().includes(q));
  }, [candidates, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (c: Candidate) => {
    if (disabledIds.has(c.id)) return;
    const idx = selected.findIndex((x) => x.id === c.id);
    let next: Candidate[];
    if (idx >= 0) {
      next = selected.filter((_, i) => i !== idx);
    } else {
      if (selected.length >= max) return;
      next = [...selected, c];
    }
    onChange(next);
  };

  const remove = (c: Candidate) => {
    onChange(selected.filter((x) => x.id !== c.id));
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {awardTitle}（可選 {min}～{max} 位）
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="搜尋流水號..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-sm text-sky-800"
            >
              {c.name}
              <button
                type="button"
                onClick={() => remove(c)}
                className="ml-0.5 rounded-full hover:bg-sky-200"
                aria-label={`移除 ${c.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {open && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-slate-500">無符合的選項</li>
          ) : (
            filtered.map((c) => {
              const isSelected = selected.some((x) => x.id === c.id);
              const isDisabled = disabledIds.has(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => toggle(c)}
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 text-left text-sm ${
                      isDisabled
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : isSelected
                          ? "bg-sky-50 text-sky-800"
                          : "hover:bg-slate-50 text-slate-800"
                    }`}
                    title={isDisabled ? disabledReason : undefined}
                  >
                    {c.name}
                    {isDisabled && (
                      <span className="ml-2 text-xs text-slate-400">（{disabledReason}）</span>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
