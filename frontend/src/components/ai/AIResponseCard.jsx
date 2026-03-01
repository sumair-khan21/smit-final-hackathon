import StatusBadge from "@/components/shared/StatusBadge";
import { AlertTriangle, CheckCircle, Info, Lightbulb, Stethoscope, FlaskConical, Clock, ShieldAlert } from "lucide-react";

// Reusable section component
const Section = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`rounded-lg border border-slate-200 p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
      <h4 className="font-semibold text-sm text-slate-700">{title}</h4>
    </div>
    {children}
  </div>
);

const ProbabilityDot = ({ level }) => {
  const color = level === "high" ? "bg-red-500" : level === "medium" ? "bg-yellow-500" : "bg-green-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-2 shrink-0`} />;
};

/**
 * AIResponseCard renders the AI response for symptom checker
 */
export const SymptomCheckerCard = ({ response }) => {
  if (!response) return null;
  if (response.parseError) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500 whitespace-pre-wrap">{response.raw}</p>
      </div>
    );
  }

  const urgencyColors = {
    routine: "bg-green-50 border-green-200 text-green-700",
    soon: "bg-yellow-50 border-yellow-200 text-yellow-700",
    urgent: "bg-orange-50 border-orange-200 text-orange-700",
    emergency: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Stethoscope className="w-5 h-5" />
          <h3 className="font-semibold">AI Symptom Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">Risk Level:</span>
          <StatusBadge status={response.riskLevel} />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgency Banner */}
        {response.urgency && (
          <div className={`md:col-span-2 rounded-lg border px-4 py-3 flex items-center gap-2 text-sm font-medium ${urgencyColors[response.urgency] || urgencyColors.routine}`}>
            <Clock className="w-4 h-4 shrink-0" />
            Urgency: <span className="capitalize">{response.urgency}</span>
          </div>
        )}

        {/* Possible Conditions */}
        {response.possibleConditions?.length > 0 && (
          <Section icon={Stethoscope} title="Possible Conditions" className="md:col-span-2">
            <div className="space-y-2">
              {response.possibleConditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <ProbabilityDot level={c.probability} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-800">{c.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 capitalize">{c.probability}</span>
                    </div>
                    {c.description && <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Recommended Tests */}
        {response.recommendedTests?.length > 0 && (
          <Section icon={FlaskConical} title="Recommended Tests">
            <ul className="space-y-1">
              {response.recommendedTests.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* General Advice */}
        {response.generalAdvice && (
          <Section icon={Lightbulb} title="Doctor's Guidance">
            <p className="text-sm text-slate-600 leading-relaxed">{response.generalAdvice}</p>
          </Section>
        )}
      </div>

      {/* Disclaimer */}
      {response.disclaimer && (
        <div className="mx-6 mb-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{response.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Prescription Explanation Card
 */
export const PrescriptionExplanationCard = ({ explanation }) => {
  if (!explanation) return null;
  if (explanation.parseError) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500 whitespace-pre-wrap">{explanation.raw}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center gap-2 text-white">
        <CheckCircle className="w-5 h-5" />
        <h3 className="font-semibold">Prescription Explanation</h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Summary */}
        {explanation.summary && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800 leading-relaxed">{explanation.summary}</p>
          </div>
        )}

        {/* Medicine Explanations */}
        {explanation.medicineExplanations?.length > 0 && (
          <Section icon={FlaskConical} title="Your Medicines">
            <div className="space-y-3">
              {explanation.medicineExplanations.map((m, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-sm text-slate-800 mb-1">{m.name}</div>
                  <div className="text-sm text-slate-600 mb-1"><span className="font-medium">Purpose:</span> {m.purpose}</div>
                  {m.importantTips && <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">{m.importantTips}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lifestyle Recommendations */}
          {explanation.lifestyleRecommendations?.length > 0 && (
            <Section icon={Lightbulb} title="Lifestyle Tips">
              <ul className="space-y-1">
                {explanation.lifestyleRecommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Preventive Advice */}
          {explanation.preventiveAdvice?.length > 0 && (
            <Section icon={ShieldAlert} title="Preventive Advice">
              <ul className="space-y-1">
                {explanation.preventiveAdvice.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0 mt-1.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* When to see doctor */}
        {explanation.whenToSeeDoctor && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">See a Doctor If:</p>
              <p className="text-xs text-red-600">{explanation.whenToSeeDoctor}</p>
            </div>
          </div>
        )}
      </div>

      {explanation.disclaimer && (
        <div className="mx-6 mb-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{explanation.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Risk Analysis Card
 */
export const RiskAnalysisCard = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;
  if (riskAnalysis.parseError) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500 whitespace-pre-wrap">{riskAnalysis.raw}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-semibold">Patient Risk Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs">Overall Risk:</span>
          <StatusBadge status={riskAnalysis.overallRisk} />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Summary */}
        {riskAnalysis.summary && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-700 leading-relaxed">{riskAnalysis.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Red Flags */}
          {riskAnalysis.redFlags?.length > 0 && (
            <Section icon={AlertTriangle} title="Red Flags">
              <ul className="space-y-1">
                {riskAnalysis.redFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Chronic Risks */}
          {riskAnalysis.chronicRisks?.length > 0 && (
            <Section icon={Info} title="Chronic Risks">
              <ul className="space-y-1">
                {riskAnalysis.chronicRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0 mt-1.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Recommendations */}
        {riskAnalysis.recommendations?.length > 0 && (
          <Section icon={Lightbulb} title="Recommendations">
            <ul className="space-y-1">
              {riskAnalysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Follow-up */}
        {riskAnalysis.followUpSuggested && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="font-medium">Follow-up appointment recommended</span>
          </div>
        )}
      </div>

      {riskAnalysis.disclaimer && (
        <div className="mx-6 mb-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{riskAnalysis.disclaimer}</p>
        </div>
      )}
    </div>
  );
};
