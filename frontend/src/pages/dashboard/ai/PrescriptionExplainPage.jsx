import { useState } from "react";
import { useExplainPrescriptionMutation } from "@/features/ai/aiApi";
import { useGetPrescriptionsQuery } from "@/features/prescriptions/prescriptionApi";
import { PrescriptionExplanationCard } from "@/components/ai/AIResponseCard";
import { BookOpen, Loader2, AlertTriangle, Languages } from "lucide-react";
import { format } from "date-fns";

export default function PrescriptionExplainPage() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState(null);

  const { data: rxData } = useGetPrescriptionsQuery({ limit: 100 });
  const [explain, { isLoading }] = useExplainPrescriptionMutation();

  const prescriptions = rxData?.data?.prescriptions || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prescriptionId) return;

    const res = await explain({ prescriptionId, language }).unwrap().catch(() => null);
    if (res?.data) setResult(res.data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Prescription Explainer</h1>
          <p className="text-sm text-slate-500">AI-powered patient-friendly prescription explanations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Select Prescription</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prescription select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prescription</label>
              <select
                required
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select prescription...</option>
                {prescriptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.diagnosis} — {p.patientId?.name || "Patient"} ({format(new Date(p.createdAt), "dd MMM yyyy")})
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Languages className="w-4 h-4" /> Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["english", "urdu"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                      language === lang
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
                    }`}
                  >
                    {lang === "urdu" ? "اردو (Urdu)" : "English"}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected prescription preview */}
            {prescriptionId && (() => {
              const rx = prescriptions.find((p) => p._id === prescriptionId);
              if (!rx) return null;
              return (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                  <p className="font-medium text-slate-700">{rx.diagnosis}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {rx.medicines?.length || 0} medicine(s) •
                    Patient: {rx.patientId?.name || "—"} •
                    Dr. {rx.doctorId?.name || "—"}
                  </p>
                </div>
              );
            })()}

            <button
              type="submit"
              disabled={isLoading || !prescriptionId}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating explanation...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Explain Prescription
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div>
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">
                Select a prescription and click<br />
                <strong>Explain Prescription</strong> to get<br />
                a patient-friendly explanation
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-3" />
              <p className="text-slate-500 text-sm">Generating explanation{language === "urdu" ? " in Urdu" : ""}...</p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {result.aiFailed ? (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">AI Unavailable</p>
                    <p className="text-xs text-amber-600 mt-0.5">The AI explanation service is temporarily unavailable. Please try again later.</p>
                  </div>
                </div>
              ) : (
                <PrescriptionExplanationCard explanation={result.explanation} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
