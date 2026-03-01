import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const GENDERS = ["male", "female", "other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const [form, setForm] = useState({
    name: "", age: "", gender: "", phone: "", email: "",
    address: "", bloodGroup: "", allergies: "", chronicConditions: "",
    emergencyContact: { name: "", phone: "", relation: "" },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ec_")) {
      const field = name.replace("ec_", "");
      setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      age: parseInt(form.age),
      allergies: form.allergies ? form.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
      chronicConditions: form.chronicConditions ? form.chronicConditions.split(",").map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      const res = await createPatient(payload).unwrap();
      toast.success("Patient registered successfully");
      navigate(`${ROUTES.PATIENTS}/${res.data.patient._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register patient");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PATIENTS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Register New Patient</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Age *</Label>
              <Input name="age" type="number" value={form.age} onChange={handleChange} placeholder="25" min="0" max="150" />
              {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
              </select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="patient@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Address</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Street, City" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Medical Info</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Allergies <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder="Penicillin, Dust" />
            </div>
            <div className="space-y-2">
              <Label>Chronic Conditions <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input name="chronicConditions" value={form.chronicConditions} onChange={handleChange} placeholder="Diabetes, Hypertension" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Emergency Contact</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="ec_name" value={form.emergencyContact.name} onChange={handleChange} placeholder="Contact name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="ec_phone" value={form.emergencyContact.phone} onChange={handleChange} placeholder="+92 300 0000000" />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <Input name="ec_relation" value={form.emergencyContact.relation} onChange={handleChange} placeholder="Father, Spouse, etc." />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PATIENTS)}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Patient"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientPage;
