import { useCallback, useEffect, useState } from "react";
import { AwardCard } from "./components/AwardCard";
import { DoneCard } from "./components/DoneCard";
import { RejectedCard } from "./components/RejectedCard";
import { ALLOWED_DOMAIN } from "./config";
import { AWARDS } from "./data/awards";
import { CANDIDATES } from "./data/candidates";
import { submitToGoogleForm } from "./lib/formSubmit";
import { validate, type Selections, type ValidationError } from "./lib/validation";
import type { Candidate } from "./data/candidates";

const STORAGE_KEY = "voting_submitted";

interface StoredResult {
  email: string;
  employeeId: string;
  submittedAt: string;
  selections: Record<string, { id: string; name: string }[]>;
}

function loadSubmitted(): StoredResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredResult;
  } catch {
    return null;
  }
}

function isAllowedEmail(email: string): boolean {
  return email.trim().length > 0 && email.trim().endsWith(ALLOWED_DOMAIN);
}

export default function App() {
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selections, setSelections] = useState<Selections>({});
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<StoredResult | null>(() => loadSubmitted());

  const emailTrimmed = email.trim();
  const employeeIdTrimmed = employeeId.trim();
  const allowed = isAllowedEmail(emailTrimmed);
  const requiredFieldsOk = emailTrimmed.length > 0 && employeeIdTrimmed.length > 0;

  const handleSelectionsChange = useCallback((slotId: string, selected: Candidate[]) => {
    setSelections((prev) => ({ ...prev, [slotId]: selected }));
    setValidationError(null);
  }, []);

  useEffect(() => {
    const err = validate(selections);
    setValidationError(err ?? null);
  }, [selections]);

  const handleSubmit = useCallback(async () => {
    if (!emailTrimmed) {
      setValidationError({ type: "count", message: "請填寫 Email。" });
      return;
    }
    if (!employeeIdTrimmed) {
      setValidationError({ type: "count", message: "請填寫員工編號。" });
      return;
    }
    if (!allowed) return;
    const err = validate(selections);
    if (err) {
      setValidationError(err);
      return;
    }
    setSubmitStatus("loading");
    setSubmitError(null);
    const submittedAt = new Date().toISOString();
    const payload = {
      email: emailTrimmed,
      employeeId: employeeIdTrimmed,
      submittedAt,
      slots: selections,
    };
    try {
      await submitToGoogleForm(payload);
      const toStore: StoredResult = {
        email: emailTrimmed,
        employeeId: employeeIdTrimmed,
        submittedAt,
        selections: Object.fromEntries(
          Object.entries(selections).map(([k, v]) => [
            k,
            v.map((c) => ({ id: c.id, name: c.name })),
          ])
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      setSubmitted(toStore);
      setSubmitStatus("success");
    } catch (e) {
      setSubmitStatus("error");
      setSubmitError(e instanceof Error ? e.message : "送出失敗，請稍後再試");
    }
  }, [selections, emailTrimmed, employeeIdTrimmed, allowed]);

  const handleVoteAgain = useCallback(() => {
    setSubmitted(null);
    setEmail("");
    setEmployeeId("");
    setSelections({});
    setValidationError(null);
    setSubmitStatus("idle");
    setSubmitError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const canSubmit =
    requiredFieldsOk && allowed && !validate(selections);

  // 完成頁
  if (submitted) {
    const sel: Record<string, Candidate[]> = {};
    for (const [k, v] of Object.entries(submitted.selections)) {
      sel[k] = (v as { id: string; name: string }[]).map(({ id, name }) => ({ id, name }));
    }
    return (
      <div className="min-h-screen bg-slate-100 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <DoneCard
            email={submitted.email}
            employeeId={submitted.employeeId}
            submittedAt={submitted.submittedAt}
            awards={AWARDS}
            selections={sel}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleVoteAgain}
              className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
            >
              再投一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 已輸入 email 但網域不符（必填後一定會先有 email）
  if (emailTrimmed.length > 0 && !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 py-8 px-4">
        <div className="w-full max-w-md">
          <RejectedCard email={emailTrimmed} allowedDomain={ALLOWED_DOMAIN} />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setEmail("")}
              className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300"
            >
              重新輸入 Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 投票表單
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
          <h1 className="mb-4 text-xl font-semibold text-slate-800">投票</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">Email（必填）</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`請輸入公司網域 ${ALLOWED_DOMAIN}`}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">員工編號（必填）</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="請輸入員工編號"
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {AWARDS.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              candidates={CANDIDATES}
              selections={selections}
              onSelectionsChange={handleSelectionsChange}
              validationError={validationError}
            />
          ))}
        </div>

        {validationError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {validationError.message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={!canSubmit || submitStatus === "loading"}
            onClick={handleSubmit}
            className="rounded-xl bg-sky-600 px-6 py-3 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitStatus === "loading" ? "送出中…" : "送出投票"}
          </button>
          {submitStatus === "error" && submitError && (
            <p className="text-sm text-red-600">{submitError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
