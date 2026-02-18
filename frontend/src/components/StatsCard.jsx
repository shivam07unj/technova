export default function StatsCard({ label, value, subtitle, trend }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5">
      <p className="text-sm font-medium text-text-muted mb-1">{label}</p>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
      {subtitle && (
        <p className="text-xs text-text-muted mt-1">{subtitle}</p>
      )}
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-success' : 'text-danger'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </p>
      )}
    </div>
  );
}
