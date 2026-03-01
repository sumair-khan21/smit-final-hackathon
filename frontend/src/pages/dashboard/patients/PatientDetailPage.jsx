import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, MapPin, Activity, Calendar, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useGetPatientQuery, useGetPatientHistoryQuery, useUpdatePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value || "—"}</p>
  </div>
);

const TimelineItem = ({ item }) => {
  const icons = { appointment: Calendar, prescription: FileText, diagnosis: Activity };
  const colors = { appointment: "blue", prescription: "green", diagnosis: "purple" };
  const Icon = icons[item.type] || Activity;
  const color = colors[item.type] || "gray";

  return (
    <div className="flex gap-4">
      <div className={`h-8 w-8 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div className="flex-1 pb-4 border-b border-border last:border-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium capitalize">{item.type}</p>
            {item.type === "appointment" && (
              <p className="text-xs text-muted-foreground">Dr. {item.doctorId?.name} • {item.timeSlot} • <StatusBadge status={item.status} /></p>
            )}
            {item.type === "prescription" && (
              <p className="text-xs text-muted-foreground">By Dr. {item.doctorId?.name} • {item.diagnosis}</p>
            )}
            {item.type === "diagnosis" && (
              <p className="text-xs text-muted-foreground">By Dr. {item.doctorId?.name} • <StatusBadge status={item.riskLevel} /></p>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex-shrink-0">{new Date(item.date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isReceptionist } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const { data: patientData, isLoading } = useGetPatientQuery(id);
  const { data: historyData } = useGetPatientHistoryQuery(id);
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

  const patient = patientData?.data?.patient;
  const timeline = historyData?.data?.timeline || [];

  const handleEditSave = async () => {
    try {
      await updatePatient({ id, ...editForm }).unwrap();
      toast.success("Patient updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!patient) return (
    <EmptyState title="Patient not found" description="This patient record could not be found." />
  );

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PATIENTS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
        </div>
        {(isAdmin || isReceptionist) && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => { setEditForm({ name: patient.name, phone: patient.phone, email: patient.email, address: patient.address }); setIsEditing(true); }}>
            Edit
          </Button>
        )}
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{patient.age} years old • {patient.gender} • {patient.bloodGroup || "Blood group unknown"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={editForm.name || ""} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={editForm.phone || ""} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={editForm.email || ""} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input value={editForm.address || ""} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleEditSave} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <InfoRow label="Phone" value={patient.phone} />
              <InfoRow label="Email" value={patient.email} />
              <InfoRow label="Address" value={patient.address} />
              <InfoRow label="Registered" value={new Date(patient.createdAt).toLocaleDateString()} />
            </div>
          )}

          {/* Medical Info */}
          {(patient.allergies?.length > 0 || patient.chronicConditions?.length > 0) && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
              {patient.allergies?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-orange-500" /> Allergies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {patient.chronicConditions?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical History Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Medical History Timeline</CardTitle>
          <Link to={`${ROUTES.APPOINTMENTS}/book`} className="text-xs text-primary hover:underline">
            Book Appointment
          </Link>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <EmptyState title="No history yet" description="This patient has no recorded visits." icon={Activity} />
          ) : (
            <div className="space-y-2">
              {timeline.map((item, i) => <TimelineItem key={i} item={item} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetailPage;
