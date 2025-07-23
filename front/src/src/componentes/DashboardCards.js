export default function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="flex items-center p-4 rounded-xl shadow-md text-white w-full" style={{ backgroundColor: color }}>
      <div className="text-4xl mr-4">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
