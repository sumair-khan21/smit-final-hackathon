const { z } = require("zod");

const createAppointmentSchema = z.object({
  patientId: z
    .string({ required_error: "Patient is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid patient ID"),

  doctorId: z
    .string({ required_error: "Doctor is required" })
    .regex(/^[a-f\d]{24}$/i, "Invalid doctor ID"),

  date: z
    .string({ required_error: "Date is required" })
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),

  timeSlot: z
    .string({ required_error: "Time slot is required" })
    .trim()
    .min(1, "Time slot is required"),

  reason: z.string().trim().optional(),

  notes: z.string().trim().optional(),
});

const updateAppointmentSchema = createAppointmentSchema.partial().omit({ patientId: true, doctorId: true });

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
  notes: z.string().trim().optional(),
});

module.exports = { createAppointmentSchema, updateAppointmentSchema, updateStatusSchema };
