import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { useCreatePrescriptionMutation } from "@/features/prescriptions/prescriptionApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({ diagnosis: "", notes: "", followUpDate: "" });
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [errors, setErrors] = useState({});

  const { data: patientsData } = useGetPatientsQuery({ search: patientSearch, limit: 8 });
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const patients = patientsData?.data?.patients || [];

  const handleMedicineChange = (index, field, value) => {
    setMedicines(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const addMedicine = () => setMedicines(prev => [...prev, { ...emptyMedicine }]);
  const removeMedicine = (index) => setMedicines(prev => prev.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors = {};
    if (!selectedPatient) newErrors.patient = "Patient is required";
    if (!form.diagnosis.trim()) newErrors.diagnosis = "Diagnosis is required";
    if (medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      newErrors.medicines = "Please fill all required medicine fields";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await createPrescription({
        patientId: selectedPatient._id,
        diagnosis: form.diagnosis,
        notes: form.notes,
        followUpDate: form.followUpDate || undefined,
        medicines,
      }).unwrap();
      toast.success("Prescription created successfully");
      navigate(`${ROUTES.PRESCRIPTIONS}/${res.data.prescription._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create prescription");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRESCRIPTIONS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Write Prescription</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Selection */}
        <Card>
          <CardHeader><CardTitle className="text-base">Patient</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{selectedPatient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPatient.age} yrs • {selectedPatient.gender} • {selectedPatient.phone}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>Change</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Search patient by name or phone..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                {patientSearch && patients.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    {patients.map(p => (
                      <button key={p._id} type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between"
                        onClick={() => { setSelectedPatient(p); setPatientSearch(""); }}>
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground">{p.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {errors.patient && <p className="text-xs text-destructive">{errors.patient}</p>}
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card>
          <CardHeader><CardTitle className="text-base">Diagnosis & Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Diagnosis *</Label>
              <Input
                value={form.diagnosis}
                onChange={(e) => setForm(p => ({ ...p, diagnosis: e.target.value }))}
                placeholder="e.g., Upper Respiratory Tract Infection"
              />
              {errors.diagnosis && <p className="text-xs text-destructive">{errors.diagnosis}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any additional notes..." />
              </div>
              <div className="space-y-2">
                <Label>Follow-up Date (Optional)</Label>
                <Input type="date" value={form.followUpDate} onChange={(e) => setForm(p => ({ ...p, followUpDate: e.target.value }))} min={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Medicines</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
              <Plus className="h-4 w-4 mr-1" /> Add Medicine
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.medicines && <p className="text-xs text-destructive">{errors.medicines}</p>}
            {medicines.map((med, i) => (
              <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Medicine {i + 1}</p>
                  {medicines.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => removeMedicine(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Name *</Label>
                    <Input value={med.name} onChange={(e) => handleMedicineChange(i, "name", e.target.value)} placeholder="e.g., Amoxicillin" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dosage *</Label>
                    <Input value={med.dosage} onChange={(e) => handleMedicineChange(i, "dosage", e.target.value)} placeholder="500mg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Duration *</Label>
                    <Input value={med.duration} onChange={(e) => handleMedicineChange(i, "duration", e.target.value)} placeholder="7 days" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Frequency *</Label>
                    <Input value={med.frequency} onChange={(e) => handleMedicineChange(i, "frequency", e.target.value)} placeholder="Twice daily (morning & night)" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Instructions</Label>
                    <Input value={med.instructions} onChange={(e) => handleMedicineChange(i, "instructions", e.target.value)} placeholder="After meals" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PRESCRIPTIONS)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Prescription"}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePrescriptionPage;
