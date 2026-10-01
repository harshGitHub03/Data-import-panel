export default function TypeBadge({ type }: { type: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">{type}</span>
  );
}
