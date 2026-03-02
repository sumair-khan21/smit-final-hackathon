import { useState } from "react";
import { useGetUsersQuery, useUpdateUserSubscriptionMutation } from "@/features/users/userApi";
import { useGetAdminAnalyticsQuery } from "@/features/analytics/analyticsApi";
import {
  Crown, Zap, Users, Stethoscope, UserCog, User, CheckCircle2,
  Loader2, Activity, TrendingUp, CalendarDays, FileText, Brain,
  ShieldAlert, ArrowUpDown, Search,
} from "lucide-react";
import { toast } from "sonner";

const PLAN_COLORS = {
  pro: "bg-amber-100 text-amber-700 border border-amber-300",
  free: "bg-slate-100 text-slate-600 border border-slate-200",
};

const ROLE_ICONS = {
  admin: UserCog,
  doctor: Stethoscope,
  receptionist: UserCog,
  patient: User,
};

const ROLE_COLORS = {
  admin: "text-blue-600 bg-blue-50",
  doctor: "text-emerald-600 bg-emerald-50",
  receptionist: "text-violet-600 bg-violet-50",
  patient: "text-orange-600 bg-orange-50",
};

/* ─── Subscription Management Tab ─────────────────────────── */
function SubscriptionTab() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const { data, isLoading, refetch } = useGetUsersQuery({ limit: 100 });
  const [updateSubscription] = useUpdateUserSubscriptionMutation();

  const allUsers = data?.data?.users ?? [];

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || u.subscriptionPlan === filterPlan;
    return matchSearch && matchPlan;
  });

  const proCount = allUsers.filter((u) => u.subscriptionPlan === "pro").length;
  const freeCount = allUsers.filter((u) => u.subscriptionPlan === "free" || !u.subscriptionPlan).length;

  const handleTogglePlan = async (user) => {
    const newPlan = user.subscriptionPlan === "pro" ? "free" : "pro";
    setUpdatingId(user._id);
    try {
      await updateSubscription({ userId: user._id, subscriptionPlan: newPlan }).unwrap();
      await refetch();
      toast.success(`${user.name} moved to ${newPlan.toUpperCase()} plan`);
    } catch {
      toast.error("Failed to update subscription");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{allUsers.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Users</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700 flex items-center justify-center gap-1">
            <Crown className="w-5 h-5" />{proCount}
          </p>
          <p className="text-xs text-amber-600 mt-0.5">Pro Plan</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-600">{freeCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Free Plan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pro", "free"].map((plan) => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filterPlan === plan
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {plan === "all" ? "All" : plan === "pro" ? "🏆 Pro" : "Free"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No users found</div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const RoleIcon = ROLE_ICONS[u.role] || User;
                  const roleColor = ROLE_COLORS[u.role] || "text-slate-600 bg-slate-50";
                  const isPro = u.subscriptionPlan === "pro";
                  const isUpdating = updatingId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">{u.name}</p>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleColor}`}>
                          <RoleIcon className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${PLAN_COLORS[u.subscriptionPlan] || PLAN_COLORS.free}`}>
                          {isPro ? <Crown className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {isPro ? "Pro" : "Free"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleTogglePlan(u)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isPro
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                              : "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                          }`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3" />
                          )}
                          {isPro ? "Downgrade" : "Upgrade to Pro"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filtered.map((u) => {
              const RoleIcon = ROLE_ICONS[u.role] || User;
              const roleColor = ROLE_COLORS[u.role] || "text-slate-600 bg-slate-50";
              const isPro = u.subscriptionPlan === "pro";
              const isUpdating = updatingId === u._id;

              return (
                <div key={u._id} className="px-4 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 truncate">{u.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${roleColor}`}>
                        <RoleIcon className="w-2.5 h-2.5" />{u.role}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${PLAN_COLORS[u.subscriptionPlan] || PLAN_COLORS.free}`}>
                        {isPro ? <Crown className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                        {isPro ? "Pro" : "Free"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePlan(u)}
                    disabled={isUpdating}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isPro
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : "bg-amber-500 text-white shadow-sm"
                    }`}
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : isPro ? "↓ Free" : "↑ Pro"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── System Usage Tab ─────────────────────────────────────── */
function SystemUsageTab() {
  const { data, isLoading } = useGetAdminAnalyticsQuery();
  const d = data?.data;

  const usageMetrics = d
    ? [
        {
          label: "Total Appointments",
          value: (d.todayAppointments ?? 0) + (d.monthlyAppointments ?? 0),
          sub: `${d.todayAppointments ?? 0} today · ${d.monthlyAppointments ?? 0} this month`,
          icon: CalendarDays,
          color: "blue",
        },
        {
          label: "Completed Appointments",
          value: d.completedAppointments ?? 0,
          sub: `${d.pendingAppointments ?? 0} still pending`,
          icon: CheckCircle2,
          color: "green",
        },
        {
          label: "Total Prescriptions",
          value: d.totalPrescriptions ?? 0,
          sub: "All-time prescriptions created",
          icon: FileText,
          color: "violet",
        },
        {
          label: "Total Patients",
          value: d.totalPatients ?? 0,
          sub: `${d.totalDoctors ?? 0} doctors · ${d.totalReceptionists ?? 0} reception`,
          icon: Users,
          color: "orange",
        },
        {
          label: "Simulated Revenue",
          value: `PKR ${(d.simulatedRevenue ?? 0).toLocaleString()}`,
          sub: "Based on completed appointments",
          icon: TrendingUp,
          color: "emerald",
        },
        {
          label: "AI Features Active",
          value: "3",
          sub: "Symptom Checker · Risk Flagging · Rx Explain",
          icon: Brain,
          color: "indigo",
        },
      ]
    : [];

  const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   border: "border-blue-200" },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  border: "border-green-200" },
    violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-200" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-200" },
    emerald:{ bg: "bg-emerald-50",icon: "text-emerald-600",border: "border-emerald-200" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-200" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!d) {
    return <div className="py-16 text-center text-slate-400 text-sm">Failed to load usage data</div>;
  }

  return (
    <div className="space-y-5">
      {/* Status Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">All Systems Operational</p>
          <p className="text-xs text-emerald-600">Backend API · MongoDB · Gemini AI · Auth Service</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {usageMetrics.map(({ label, value, sub, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className={`rounded-xl border ${c.border} ${c.bg} p-4 space-y-2`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <Icon className={`w-4 h-4 ${c.icon}`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
          );
        })}
      </div>

      {/* Top diagnoses summary */}
      {d.topDiagnoses?.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-700">Most Common Diagnoses</h3>
          </div>
          <div className="space-y-2.5">
            {d.topDiagnoses.slice(0, 6).map((item, i) => {
              const max = d.topDiagnoses[0]?.count || 1;
              const pct = Math.round((item.count / max) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-xs" title={item.name}>{item.name}</span>
                    <span className="font-semibold text-slate-700 ml-2 shrink-0">{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function SystemManagementPage() {
  const [activeTab, setActiveTab] = useState("subscriptions");

  const tabs = [
    { id: "subscriptions", label: "Subscription Plans", icon: Crown },
    { id: "usage", label: "System Usage", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">System Management</h1>
          <p className="text-sm text-slate-500">Manage subscriptions and monitor system usage</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{id === "subscriptions" ? "Plans" : "Usage"}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "subscriptions" ? <SubscriptionTab /> : <SystemUsageTab />}
    </div>
  );
}
