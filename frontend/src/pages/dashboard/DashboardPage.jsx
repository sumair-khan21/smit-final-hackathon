import { Link } from "react-router-dom";
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES, ROLES } from "@/utils/constants";
import { useGetAppointmentsQuery } from "@/features/appointments/appointmentApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";

const StatCard = ({ title, value, icon: Icon, description, color = "primary" }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user, role, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();

  const { data: appointmentsData } = useGetAppointmentsQuery({ limit: 5 });
  const { data: patientsData } = useGetPatientsQuery({ limit: 1 }, { skip: isPatient });

  const appointments = appointmentsData?.data?.appointments || [];
  const totalPatients = patientsData?.data?.pagination?.total || 0;
  const totalAppointments = appointmentsData?.data?.pagination?.total || 0;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(isAdmin || isReceptionist) && (
          <StatCard title="Total Patients" value={totalPatients} icon={Users} description="Registered patients" />
        )}
        <StatCard title="Total Appointments" value={totalAppointments} icon={Calendar} description="All appointments" />
        {isAdmin && (
          <>
            <StatCard title="Pending Review" value={appointments.filter(a => a.status === "pending").length} icon={Clock} description="Awaiting confirmation" />
            <StatCard title="Completed Today" value={appointments.filter(a => a.status === "completed").length} icon={CheckCircle} description="Consultations done" />
          </>
        )}
        {isDoctor && (
          <>
            <StatCard title="My Appointments" value={totalAppointments} icon={Activity} description="Assigned to you" />
            <StatCard title="Pending" value={appointments.filter(a => a.status === "pending").length} icon={Clock} description="Need confirmation" />
          </>
        )}
        {isPatient && (
          <StatCard title="My Appointments" value={totalAppointments} icon={Calendar} description="Your appointments" />
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {(isAdmin || isReceptionist) && (
            <>
              <Button asChild size="sm">
                <Link to={ROUTES.PATIENTS + "/add"}>
                  <Users className="h-4 w-4 mr-2" />
                  Register Patient
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={ROUTES.APPOINTMENTS + "/book"}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
            </>
          )}
          {isDoctor && (
            <>
              <Button asChild size="sm">
                <Link to={ROUTES.PRESCRIPTIONS + "/create"}>
                  <FileText className="h-4 w-4 mr-2" />
                  Write Prescription
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={ROUTES.AI_SYMPTOM_CHECKER}>
                  <Activity className="h-4 w-4 mr-2" />
                  AI Symptom Check
                </Link>
              </Button>
            </>
          )}
          {isAdmin && (
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.ANALYTICS}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Appointments */}
      {appointments.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Appointments</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to={ROUTES.APPOINTMENTS}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt) => (
                <div key={apt._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{apt.patientId?.name || "Unknown Patient"}</p>
                    <p className="text-xs text-muted-foreground">
                      Dr. {apt.doctorId?.name} • {apt.timeSlot}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(apt.date).toLocaleDateString()}
                    </p>
                    <span className={`text-xs font-medium capitalize ${
                      apt.status === "completed" ? "text-green-600" :
                      apt.status === "confirmed" ? "text-blue-600" :
                      apt.status === "cancelled" ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
