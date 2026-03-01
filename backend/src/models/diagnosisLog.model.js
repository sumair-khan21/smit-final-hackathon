const mongoose = require("mongoose");
const { RISK_LEVELS } = require("../constants");

const diagnosisLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
    symptoms: [{ type: String, trim: true }],
    age: { type: Number },
    gender: { type: String },
    medicalHistory: { type: String },
    aiResponse: { type: mongoose.Schema.Types.Mixed },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVELS),
    },
    doctorNotes: { type: String, trim: true },
    finalDiagnosis: { type: String, trim: true },
    type: {
      type: String,
      enum: ["symptom_check", "prescription_explain", "risk_flag"],
      default: "symptom_check",
    },
    aiFailed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.model("DiagnosisLog", diagnosisLogSchema);
