export default function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}