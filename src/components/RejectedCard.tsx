interface RejectedCardProps {
  email: string;
  allowedDomain: string;
}

export function RejectedCard({ email, allowedDomain }: RejectedCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
      <h1 className="mb-2 text-xl font-semibold text-slate-800 sm:text-2xl">
        無法參與投票
      </h1>
      <p className="mb-4 text-slate-600">
        本投票僅限 <strong className="text-slate-800">{allowedDomain}</strong> 網域之帳號參與。
      </p>
      <p className="text-sm text-slate-500">
        您目前登入的帳號：<span className="font-mono text-slate-700">{email}</span>
      </p>
      <p className="mt-4 text-sm text-slate-500">
        請使用符合資格的公司帳號登入，或聯絡主辦單位。
      </p>
    </div>
  );
}
