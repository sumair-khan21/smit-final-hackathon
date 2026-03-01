const { z } = require("zod");

const symptomCheckerSchema = z.object({
  patientId: z.string({ required_error: "Patient is required" }).regex(/^[a-f\d]{24}$/i, "Invalid patient ID"),
  symptoms: z.array(z.string().trim().min(1)).min(1, "At least one symptom is required"),
  age: z.number({ required_error: "Age is required" }).min(0).max(150),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  medicalHistory: z.string().optional(),
  doctorNotes: z.string().optional(),
});

const prescriptionExplainSchema = z.object({
  prescriptionId: z.string({ required_error: "Prescription ID is required" }).regex(/^[a-f\d]{24}$/i, "Invalid prescription ID"),
  language: z.enum(["english", "urdu"]).optional().default("english"),
});

const riskFlagSchema = z.object({
  doctorNotes: z.string().optional(),
});

module.exports = { symptomCheckerSchema, prescriptionExplainSchema, riskFlagSchema };
