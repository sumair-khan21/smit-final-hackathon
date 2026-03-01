import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { useCreateAppointmentMutation } from "@/features/appointments/appointmentApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const TIME_SLOTS = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
  "11:00-11:30", "11:30-12:00", "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00",
];

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", timeSlot: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const { data: patientsData } = useGetPatientsQuery({ search: patientSearch, limit: 10 });
  const { data: usersData } = useGetUsersQuery({ role: "doctor", search: doctorSearch, limit: 10 });
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const patients = patientsData?.data?.patients || [];
  const doctors = usersData?.data?.users || [];

  const validate = () => {
    const newErrors = {};
    if (!form.patientId) newErrors.patientId = "Patient is required";
    if (!form.doctorId) newErrors.doctorId = "Doctor is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.timeSlot) newErrors.timeSlot = "Time slot is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createAppointment(form).unwrap();
      toast.success("Appointment booked successfully");
      navigate(ROUTES.APPOINTMENTS);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to book appointment");
    }
  };

  const selectedPatient = patients.find(p => p._id === form.patientId);
  const selectedDoctor = doctors.find(d => d._id === form.doctorId);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.APPOINTMENTS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Book Appointment</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Appointment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label>Patient *</Label>
              <Input
                placeholder="Search patient by name or phone..."
                value={selectedPatient ? selectedPatient.name : patientSearch}
                onChange={(e) => { setPatientSearch(e.target.value); setForm(p => ({ ...p, patientId: "" })); }}
              />
              {patientSearch && !form.patientId && patients.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  {patients.map(patient => (
                    <button
                      key={patient._id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      onClick={() => { setForm(p => ({ ...p, patientId: patient._id })); setPatientSearch(""); }}
                    >
                      <span className="font-medium">{patient.name}</span>
                      <span className="text-muted-foreground ml-2">{patient.phone}</span>
                    </button>
                  ))}
                </div>
              )}
              {errors.patientId && <p className="text-xs text-destructive">{errors.patientId}</p>}
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label>Doctor *</Label>
              <Input
                placeholder="Search doctor by name..."
                value={selectedDoctor ? selectedDoctor.name : doctorSearch}
                onChange={(e) => { setDoctorSearch(e.target.value); setForm(p => ({ ...p, doctorId: "" })); }}
              />
              {doctorSearch && !form.doctorId && doctors.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                  {doctors.map(doctor => (
                    <button
                      key={doctor._id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      onClick={() => { setForm(p => ({ ...p, doctorId: doctor._id })); setDoctorSearch(""); }}
                    >
                      <span className="font-medium">{doctor.name}</span>
                      {doctor.specialization && <span className="text-muted-foreground ml-2">({doctor.specialization})</span>}
                    </button>
                  ))}
                </div>
              )}
              {errors.doctorId && <p className="text-xs text-destructive">{errors.doctorId}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label>Time Slot *</Label>
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm(p => ({ ...p, timeSlot: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select time slot</option>
                  {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.timeSlot && <p className="text-xs text-destructive">{errors.timeSlot}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason for Visit</Label>
              <Input
                value={form.reason}
                onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Brief reason for the appointment"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.APPOINTMENTS)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Booking..." : "Book Appointment"}</Button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
