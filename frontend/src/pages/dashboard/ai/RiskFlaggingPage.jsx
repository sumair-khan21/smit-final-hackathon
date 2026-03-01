import { useState } from "react";
import { useRunRiskFlaggingMutation } from "@/features/ai/aiApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { RiskAnalysisCard } from "@/components/ai/AIResponseCard";
import { ProLock } from "@/components/shared/ProBadge";
import { useSelector } from "react-redux";
import { ShieldAlert, Loader2, AlertTriangle, Search } from "lucide-react";

export default function RiskFlaggingPage() {
  const user = useSelector((s) => s.auth.user);
  const isPro = user?.subscriptionPlan === "pro";

  const [patientId, setPatientId] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  const { data: patientsData } = useGetPatientsQuery({ limit: 100 }, { skip: !isPro });
  const [runRisk, { isLoading }] = useRunRiskFlaggingMutation();

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <ProLock
          feature="AI Risk Flagging"
          description="Analyze patient health history for risk patterns, red flags, and chronic condition monitoring with AI-powered insights."
        />
      </div>
    );
  }

  const patients = (patientsData?.data?.patients || []).filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPatient = patients.find((p) => p._id === patientId) ||
    (patientsData?.data?.patients || []).find((p) => p._id === patientId);

  const handleAnalyze = async () => {
    if (!patientId) return;
    const res = await runRisk(patientId).unwrap().catch(() => null);
    if (res?.data) setResult(res.data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Risk Flagging</h1>
          <p className="text-sm text-slate-500">Analyze patient health history for risk patterns and early warning signs</p>
        </div>
        <span className="ml-auto px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full">
          PRO
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700">Select Patient</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Patient list */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {patients.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No patients found</p>
            ) : (
              patients.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => { setPatientId(p._id); setResult(null); }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    patientId === p._id ? "bg-red-50 border-l-4 border-l-red-500" : ""
                  }`}
                >
                  <div className="text-sm font-medium text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {p.age}y • {p.gender} • {p.bloodGroup || "Blood group N/A"}
                    {p.chronicConditions?.length > 0 && (
                      <span className="ml-1 text-orange-600">• {p.chronicConditions.join(", ")}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Selected patient summary */}
          {selectedPatient && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm">
              <p className="font-medium text-red-800">{selectedPatient.name}</p>
              <p className="text-xs text-red-600 mt-0.5">
                Age: {selectedPatient.age} | Gender: {selectedPatient.gender}
                {selectedPatient.allergies?.length > 0 && ` | Allergies: ${selectedPatient.allergies.join(", ")}`}
              </p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !patientId}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing risk...
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                Analyze Risk
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">
                Select a patient and click<br />
                <strong>Analyze Risk</strong> to get<br />
                AI-powered risk analysis
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-3" />
              <p className="text-slate-500 text-sm">AI is analyzing patient history...</p>
            </div>
          )}

          {result && !isLoading && (
            <>
              {result.aiFailed ? (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">AI Unavailable</p>
                    <p className="text-xs text-amber-600 mt-0.5">The AI service is temporarily unavailable. Please try again later.</p>
                  </div>
                </div>
              ) : (
                <RiskAnalysisCard riskAnalysis={result.riskAnalysis} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
