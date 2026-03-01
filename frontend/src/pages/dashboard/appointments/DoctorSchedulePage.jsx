import { useState } from "react";
import { CalendarDays, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import useAuth from "@/hooks/useAuth";
import { useGetDoctorScheduleQuery } from "@/features/appointments/appointmentApi";
import { useGetUsersQuery } from "@/features/users/userApi";

const DoctorSchedulePage = () => {
  const { user, isDoctor, isReceptionist } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  // Receptionists pick a doctor; doctors see their own
  const { data: usersData } = useGetUsersQuery({}, { skip: !isReceptionist });
  const doctors = (usersData?.data?.users || []).filter((u) => u.role === "doctor");

  const doctorId = isDoctor ? user?._id : selectedDoctorId;

  const { data, isLoading } = useGetDoctorScheduleQuery(
    { doctorId, date },
    { skip: !doctorId || !date }
  );

  const appointments = data?.data?.appointments || [];
  const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isDoctor ? "My Schedule" : "Daily Schedule"}
          </h1>
          <p className="text-sm text-slate-500">
            {isDoctor ? "Your appointments for the selected date" : "View any doctor's appointments by date"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Doctor picker — receptionist only */}
        {isReceptionist && (
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm font-medium text-slate-700 mb-1 block">Select Doctor</Label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a doctor...</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Date picker */}
        <div className="flex-1 min-w-[180px]">
          <Label className="text-sm font-medium text-slate-700 mb-1 block">Select Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Schedule Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>
              {isReceptionist && selectedDoctor
                ? `Dr. ${selectedDoctor.name}'s Schedule`
                : isDoctor
                ? "My Schedule"
                : "Schedule"}
            </span>
            <span className="text-sm font-normal text-slate-500">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Receptionist: no doctor selected yet */}
          {isReceptionist && !selectedDoctorId ? (
            <EmptyState
              title="Select a doctor"
              description="Choose a doctor above to view their daily schedule"
              icon={Stethoscope}
            />
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : appointments.length === 0 ? (
            <EmptyState
              title="No appointments"
              description="No appointments scheduled for this date."
              icon={CalendarDays}
            />
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px] bg-blue-50 rounded-lg py-1.5 px-2">
                      <p className="text-sm font-bold text-blue-700">{apt.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{apt.patientId?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.patientId?.phone && `${apt.patientId.phone} • `}
                        {apt.reason || "General consultation"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))}
              <p className="text-xs text-slate-400 text-right pt-1">
                {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSchedulePage;
