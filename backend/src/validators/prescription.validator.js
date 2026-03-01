const { z } = require("zod");

const medicineSchema = z.object({
  name: z.string({ required_error: "Medicine name is required" }).trim().min(1),
  dosage: z.string({ required_error: "Dosage is required" }).trim().min(1),
  frequency: z.string({ required_error: "Frequency is required" }).trim().min(1),
  duration: z.string({ required_error: "Duration is required" }).trim().min(1),
  instructions: z.string().trim().optional(),
});

const createPrescriptionSchema = z.object({
  patientId: z.string({ required_error: "Patient is required" }).regex(/^[a-f\d]{24}$/i, "Invalid patient ID"),
  doctorId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid doctor ID").optional(),
  appointmentId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  diagnosis: z.string({ required_error: "Diagnosis is required" }).trim().min(2),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
  notes: z.string().trim().optional(),
  followUpDate: z.string().optional().refine((v) => !v || !isNaN(Date.parse(v)), "Invalid date"),
});

const updatePrescriptionSchema = createPrescriptionSchema.partial().omit({ patientId: true });

module.exports = { createPrescriptionSchema, updatePrescriptionSchema };
