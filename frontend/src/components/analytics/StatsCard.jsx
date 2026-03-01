import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
    green: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-600" },
    purple: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", text: "text-violet-600" },
    orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", text: "text-orange-600" },
    red: { bg: "bg-red-50", icon: "bg-red-100 text-red-600", text: "text-red-600" },
    slate: { bg: "bg-slate-50", icon: "bg-slate-100 text-slate-600", text: "text-slate-600" },
  };

  const c = colorMap[color] || colorMap.blue;

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-slate-400";

  return (
    <div className={`${c.bg} rounded-xl p-5 border border-white shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-600">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
