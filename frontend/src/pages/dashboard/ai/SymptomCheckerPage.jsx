import { useState } from "react";
import { useRunSymptomCheckerMutation, useGetDiagnosisLogsQuery } from "@/features/ai/aiApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { SymptomCheckerCard } from "@/components/ai/AIResponseCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Brain, Plus, X, Loader2, AlertTriangle, ChevronRight, ClipboardList } from "lucide-react";
import { format } from "date-fns";

const GENDER_OPTIONS = ["male", "female", "other"];

export default function SymptomCheckerPage() {
  const [form, setForm] = useState({
    patientId: "",
    age: "",
    gender: "",
    medicalHistory: "",
    doctorNotes: "",
  });
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState("checker"); // checker | logs

  const { data: patientsData } = useGetPatientsQuery({ limit: 100 });
  const { data: logsData, isLoading: logsLoading } = useGetDiagnosisLogsQuery(
    { page: 1, limit: 20 },
    { skip: activeTab !== "logs" }
  );
  const [runCheck, { isLoading }] = useRunSymptomCheckerMutation();

  const patients = patientsData?.data?.patients || [];

  const addSymptom = () => {
    const s = symptomInput.trim();
    if (s && !symptoms.includes(s)) {
      setSymptoms((prev) => [...prev, s]);
      setSymptomInput("");
    }
  };

  const removeSymptom = (s) => setSymptoms((prev) => prev.filter((x) => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptoms.length === 0) return;

    const payload = {
      patientId: form.patientId,
      symptoms,
      age: parseInt(form.age),
      gender: form.gender,
      medicalHistory: form.medicalHistory || undefined,
      doctorNotes: form.doctorNotes || undefined,
    };

    const res = await runCheck(payload).unwrap().catch(() => null);
    if (res?.data) {
      setAiResult(res.data);
    }
  };

  const logs = logsData?.data?.logs || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Symptom Checker</h1>
          <p className="text-sm text-slate-500">Get AI-assisted preliminary analysis based on patient symptoms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: "checker", label: "Symptom Checker" },
          { id: "logs", label: "Diagnosis History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "checker" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-700">Patient Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                <select
                  required
                  value={form.patientId}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select patient...</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.age}y, {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="150"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    placeholder="35"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g} className="capitalize">{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Symptoms <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type symptom and press Enter..."
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSymptom}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((s) => (
                      <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full">
                        {s}
                        <button type="button" onClick={() => removeSymptom(s)} className="hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medical History (optional)</label>
                <textarea
                  value={form.medicalHistory}
                  onChange={(e) => setForm((f) => ({ ...f, medicalHistory: e.target.value }))}
                  rows={2}
                  placeholder="Past surgeries, chronic conditions..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Doctor Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor's Notes (optional)</label>
                <textarea
                  value={form.doctorNotes}
                  onChange={(e) => setForm((f) => ({ ...f, doctorNotes: e.target.value }))}
                  rows={2}
                  placeholder="Additional clinical observations..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || symptoms.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result */}
          <div>
            {!aiResult && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <Brain className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm">Fill in the form and click<br /><strong>Analyze Symptoms</strong> to get AI-assisted analysis</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-slate-500 text-sm">AI is analyzing symptoms...</p>
              </div>
            )}

            {aiResult && !isLoading && (
              <>
                {aiResult.aiFailed ? (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 text-sm">AI Unavailable</p>
                      <p className="text-xs text-amber-600 mt-0.5">The AI service is temporarily unavailable. Diagnosis logged.</p>
                    </div>
                  </div>
                ) : (
                  <SymptomCheckerCard response={aiResult.aiResponse} />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-700">Diagnosis History</h2>
          </div>
          {logsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No diagnosis logs yet</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{log.patientId?.name || "—"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {log.symptoms?.join(", ") || "Risk Flag"} • {format(new Date(log.createdAt), "dd MMM yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {log.riskLevel && <StatusBadge status={log.riskLevel} />}
                    {log.aiFailed && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">AI Failed</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
