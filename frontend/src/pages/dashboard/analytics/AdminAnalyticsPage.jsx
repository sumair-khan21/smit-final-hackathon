import { useGetAdminAnalyticsQuery } from "@/features/analytics/analyticsApi";
import StatsCard from "@/components/analytics/StatsCard";
import { useSelector } from "react-redux";
import { useGetDoctorAnalyticsQuery } from "@/features/analytics/analyticsApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, UserCheck, CalendarDays, Clock, CheckCircle2,
  DollarSign, Stethoscope, UserCog, Loader2, TrendingUp,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

function AdminView({ data }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Patients" value={data.totalPatients} icon={Users} color="blue" subtitle="Active patients" />
        <StatsCard title="Doctors" value={data.totalDoctors} icon={Stethoscope} color="green" subtitle="Active staff" />
        <StatsCard title="Receptionists" value={data.totalReceptionists} icon={UserCog} color="purple" subtitle="Active staff" />
        <StatsCard
          title="Simulated Revenue"
          value={`PKR ${(data.simulatedRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="orange"
          subtitle="Based on completed"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Appointments" value={data.todayAppointments} icon={CalendarDays} color="blue" />
        <StatsCard title="This Month" value={data.monthlyAppointments} icon={TrendingUp} color="green" />
        <StatsCard title="Pending" value={data.pendingAppointments} icon={Clock} color="orange" />
        <StatsCard title="Completed" value={data.completedAppointments} icon={CheckCircle2} color="green" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Appointments by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.appointmentsByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Diagnoses Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Top Diagnoses</h3>
          {data.topDiagnoses?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.topDiagnoses}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.topDiagnoses.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
              No diagnosis data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorView({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Today's Appointments" value={data.todayAppointments} icon={CalendarDays} color="blue" />
        <StatsCard title="This Month" value={data.monthlyAppointments} icon={TrendingUp} color="green" />
        <StatsCard title="Total Prescriptions" value={data.totalPrescriptions} icon={UserCheck} color="purple" />
        <StatsCard title="Pending Today" value={data.pendingToday} icon={Clock} color="orange" />
        <StatsCard title="Completed This Month" value={data.completedThisMonth} icon={CheckCircle2} color="green" />
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Daily Appointments This Month</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.dailyStats} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
              formatter={(v) => [v, "Appointments"]}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user?.role === "admin";

  const { data: adminData, isLoading: adminLoading } = useGetAdminAnalyticsQuery(undefined, { skip: !isAdmin });
  const { data: doctorData, isLoading: doctorLoading } = useGetDoctorAnalyticsQuery(undefined, { skip: isAdmin });

  const isLoading = isAdmin ? adminLoading : doctorLoading;
  const analyticsData = isAdmin ? adminData?.data : doctorData?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? "bg-blue-100" : "bg-emerald-100"}`}>
          <TrendingUp className={`w-5 h-5 ${isAdmin ? "text-blue-600" : "text-emerald-600"}`} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isAdmin ? "Admin Analytics" : "My Analytics"}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Clinic-wide performance overview" : "Your personal performance stats"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : !analyticsData ? (
        <div className="py-20 text-center text-slate-400 text-sm">Failed to load analytics</div>
      ) : isAdmin ? (
        <AdminView data={analyticsData} />
      ) : (
        <DoctorView data={analyticsData} />
      )}
    </div>
  );
}
