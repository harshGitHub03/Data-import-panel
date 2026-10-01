const COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Sent: 'bg-blue-100 text-blue-700',
  Downloaded: 'bg-green-100 text-green-700',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}
