import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { useGetAppointmentsQuery, useUpdateAppointmentStatusMutation, useCancelAppointmentMutation } from "@/features/appointments/appointmentApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const AppointmentListPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const { isAdmin, isReceptionist, isDoctor } = useAuth();

  const { data, isLoading } = useGetAppointmentsQuery({ page, limit: 10, status: statusFilter });
  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination || {};

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Appointment ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(cancelId).unwrap();
      toast.success("Appointment cancelled");
      setCancelId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        {(isAdmin || isReceptionist) && (
          <Button asChild size="sm">
            <Link to={ROUTES.APPOINTMENTS + "/book"}>
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : appointments.length === 0 ? (
            <EmptyState title="No appointments" description="No appointments found for the selected filter." icon={Calendar} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Patient</th>
                    <th className="px-4 py-3 text-left font-medium">Doctor</th>
                    <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                    <th className="px-4 py-3 text-left font-medium">Reason</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{apt.patientId?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p>{apt.doctorId?.name}</p>
                          <p className="text-xs text-muted-foreground">{apt.doctorId?.specialization}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p>{new Date(apt.date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{apt.timeSlot}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{apt.reason || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {(isAdmin || isDoctor) && apt.status === "pending" && (
                            <Button variant="outline" size="xs" className="text-xs h-7 px-2"
                              onClick={() => handleStatusChange(apt._id, "confirmed")}>
                              Confirm
                            </Button>
                          )}
                          {(isAdmin || isDoctor) && apt.status === "confirmed" && (
                            <Button variant="outline" size="xs" className="text-xs h-7 px-2"
                              onClick={() => handleStatusChange(apt._id, "completed")}>
                              Complete
                            </Button>
                          )}
                          {(isAdmin || isReceptionist) && apt.status !== "cancelled" && apt.status !== "completed" && (
                            <Button variant="ghost" size="xs" className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => setCancelId(apt._id)}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
        confirmLabel="Cancel Appointment"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default AppointmentListPage;
