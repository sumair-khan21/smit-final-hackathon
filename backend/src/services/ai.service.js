const { model } = require("../config/gemini.config");
const DiagnosisLog = require("../models/diagnosisLog.model");
const Prescription = require("../models/prescription.model");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class AIService {
  /**
   * Parse JSON safely from AI response text
   */
  _parseJSON(text) {
    try {
      // Strip markdown code blocks if present
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }

  /**
   * Smart Symptom Checker
   */
  async symptomChecker({ patientId, symptoms, age, gender, medicalHistory, doctorNotes }, doctorId) {
    const logData = {
      patientId,
      doctorId,
      symptoms,
      age,
      gender,
      medicalHistory,
      doctorNotes,
      type: "symptom_check",
    };

    if (!model) {
      const log = await DiagnosisLog.create({ ...logData, aiFailed: true, aiResponse: { error: "AI service not configured" } });
      return { log, aiResponse: null, aiFailed: true };
    }

    try {
      const prompt = `You are a medical AI assistant helping a doctor (not replacing one). Analyze the following patient information and provide a structured response.

Patient Information:
- Symptoms: ${symptoms.join(", ")}
- Age: ${age} years
- Gender: ${gender}
- Medical History: ${medicalHistory || "None provided"}
- Doctor's Notes: ${doctorNotes || "None"}

Respond with a valid JSON object (no markdown) with this exact structure:
{
  "possibleConditions": [
    { "name": "condition name", "probability": "high/medium/low", "description": "brief description" }
  ],
  "riskLevel": "low|medium|high|critical",
  "recommendedTests": ["test 1", "test 2"],
  "urgency": "routine|soon|urgent|emergency",
  "generalAdvice": "brief advice for the doctor",
  "disclaimer": "This AI suggestion is not a diagnosis. Always use clinical judgment."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const aiResponse = this._parseJSON(text) || { raw: text, parseError: true };
      const riskLevel = aiResponse.riskLevel;

      const log = await DiagnosisLog.create({ ...logData, aiResponse, riskLevel, aiFailed: false });
      return { log, aiResponse, aiFailed: false };
    } catch (err) {
      const log = await DiagnosisLog.create({ ...logData, aiFailed: true, aiResponse: { error: err.message } });
      return { log, aiResponse: null, aiFailed: true };
    }
  }

  /**
   * Prescription Explanation for patients
   */
  async prescriptionExplanation({ prescriptionId, language = "english" }, userId) {
    const prescription = await Prescription.findById(prescriptionId)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialization");

    if (!prescription) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");

    if (!model) {
      return { explanation: null, aiFailed: true };
    }

    try {
      const medicinesList = prescription.medicines.map(m =>
        `${m.name} (${m.dosage}) - ${m.frequency} for ${m.duration}${m.instructions ? ", " + m.instructions : ""}`
      ).join("\n");

      const langInstruction = language === "urdu" ? "Respond in simple Urdu language." : "Respond in simple English suitable for a patient.";

      const prompt = `You are a medical assistant helping patients understand their prescription. ${langInstruction}

Diagnosis: ${prescription.diagnosis}
Medicines:
${medicinesList}
${prescription.notes ? "Doctor's Notes: " + prescription.notes : ""}

Provide a simple patient-friendly explanation as a JSON object (no markdown):
{
  "summary": "simple 2-3 sentence explanation of the diagnosis",
  "medicineExplanations": [
    { "name": "medicine name", "purpose": "what it does in simple terms", "importantTips": "key tips" }
  ],
  "lifestyleRecommendations": ["tip 1", "tip 2"],
  "preventiveAdvice": ["advice 1", "advice 2"],
  "whenToSeeDoctor": "brief warning signs to watch for",
  "disclaimer": "This explanation is for understanding only. Follow your doctor's instructions."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const explanation = this._parseJSON(text) || { raw: text, parseError: true };
      return { explanation, aiFailed: false, prescription };
    } catch (err) {
      return { explanation: null, aiFailed: true, error: err.message, prescription };
    }
  }

  /**
   * Risk Flagging — analyze patient's history for patterns
   */
  async riskFlagging(patientId, doctorId) {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");

    if (!model) {
      return { riskAnalysis: null, aiFailed: true };
    }

    try {
      const [recentAppointments, recentPrescriptions, recentDiagnoses] = await Promise.all([
        Appointment.find({ patientId }).sort("-date").limit(10).lean(),
        Prescription.find({ patientId }).sort("-createdAt").limit(10).lean(),
        DiagnosisLog.find({ patientId }).sort("-createdAt").limit(10).lean(),
      ]);

      const diagnosesList = recentPrescriptions.map(p => p.diagnosis).filter(Boolean).join(", ");
      const symptomsList = recentDiagnoses.flatMap(d => d.symptoms || []).join(", ");

      const prompt = `You are a medical AI analyzing a patient's health history for risk patterns.

Patient: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}
Chronic Conditions: ${patient.chronicConditions?.join(", ") || "None"}
Allergies: ${patient.allergies?.join(", ") || "None"}
Recent Diagnoses (last 10 visits): ${diagnosesList || "None"}
Recurring Symptoms: ${symptomsList || "None"}
Total Visits: ${recentAppointments.length}

Analyze and return a JSON object (no markdown):
{
  "overallRisk": "low|medium|high|critical",
  "redFlags": ["concerning pattern 1", "concerning pattern 2"],
  "chronicRisks": ["identified chronic risk"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "followUpSuggested": true/false,
  "summary": "brief overall health risk summary",
  "disclaimer": "AI analysis only. Clinical judgment required."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const riskAnalysis = this._parseJSON(text) || { raw: text, parseError: true };

      const log = await DiagnosisLog.create({
        patientId,
        doctorId,
        type: "risk_flag",
        aiResponse: riskAnalysis,
        riskLevel: riskAnalysis.overallRisk,
        aiFailed: false,
      });

      return { riskAnalysis, log, aiFailed: false };
    } catch (err) {
      return { riskAnalysis: null, aiFailed: true, error: err.message };
    }
  }

  /**
   * Get diagnosis logs
   */
  async getDiagnosisLogs(query, userRole, userId) {
    const { page = 1, limit = 10 } = query;
    const filter = {};
    if (userRole === "doctor") filter.doctorId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await DiagnosisLog.countDocuments(filter);
    const logs = await DiagnosisLog.find(filter)
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    return { logs, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } };
  }

  async getDiagnosisLogById(id) {
    const log = await DiagnosisLog.findById(id)
      .populate("patientId", "name age gender")
      .populate("doctorId", "name specialization");
    if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis log not found");
    return log;
  }
}

module.exports = new AIService();
