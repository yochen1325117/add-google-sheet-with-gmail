import type { Candidate } from "../data/candidates";
import type { Award } from "../data/awards";
import { getSlotId, PLACE_LABELS } from "../data/awards";

interface DoneCardProps {
  email: string;
  employeeId: string;
  submittedAt: string;
  awards: Award[];
  selections: Record<string, Candidate[]>;
}

function getSlotSelection(selections: Record<string, Candidate[]>, slotId: string): string {
  const list = selections[slotId] ?? [];
  return list.length > 0 ? list[0].name : "—";
}

export function DoneCard({
  email,
  employeeId,
  submittedAt,
  awards,
  selections,
}: DoneCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="mb-2 text-xl font-semibold text-slate-800 sm:text-2xl">
        投票已完成
      </h1>
      <p className="mb-6 text-slate-600">感謝您的參與。</p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Email</dt>
          <dd className="text-slate-800">{email || "未填寫"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">員工編號</dt>
          <dd className="text-slate-800">{employeeId || "未填寫"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">提交時間</dt>
          <dd className="text-slate-800">{submittedAt}</dd>
        </div>
        <div>
          <dt className="mb-2 font-medium text-slate-500">各獎項名次選擇</dt>
          <dd className="space-y-2">
            {awards.map((a) => (
              <div key={a.id} className="rounded bg-slate-50 p-2">
                <span className="font-medium text-slate-700">{a.title}</span>
                <ul className="mt-1 ml-2 text-slate-800">
                  {([1, 2, 3] as const).map((place) => (
                    <li key={place}>
                      {PLACE_LABELS[place - 1]}：{getSlotSelection(selections, getSlotId(a.id, place))}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
