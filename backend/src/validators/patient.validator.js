const { z } = require("zod");

const createPatientSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  age: z
    .number({ required_error: "Age is required", invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(150, "Age cannot exceed 150"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be male, female, or other",
  }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, "Phone number must be at least 10 digits"),

  email: z.string().trim().email("Please provide a valid email").optional().or(z.literal("")),

  address: z.string().trim().optional(),

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ""]).optional(),

  allergies: z.array(z.string().trim()).optional(),

  chronicConditions: z.array(z.string().trim()).optional(),

  emergencyContact: z
    .object({
      name: z.string().trim().optional(),
      phone: z.string().trim().optional(),
      relation: z.string().trim().optional(),
    })
    .optional(),

  userId: z.string().optional(),
});

const updatePatientSchema = createPatientSchema.partial();

module.exports = { createPatientSchema, updatePatientSchema };
