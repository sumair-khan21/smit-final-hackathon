import { useState } from "react";
import { useGetDiagnosisLogsQuery } from "@/features/ai/aiApi";
import { Brain, ClipboardList, Loader2, ChevronRight, ShieldAlert, FileText, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const TYPE_LABELS = {
  symptom_check: { label: "Symptom Check", icon: Brain, color: "bg-blue-100 text-blue-700" },
  prescription_explain: { label: "Rx Explain", icon: FileText, color: "bg-emerald-100 text-emerald-700" },
  risk_flag: { label: "Risk Flagging", icon: ShieldAlert, color: "bg-rose-100 text-rose-700" },
};

function LogCard({ log, onClick }) {
  const typeInfo = TYPE_LABELS[log.type] || TYPE_LABELS.symptom_check;
  const TypeIcon = typeInfo.icon;

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors"
    >
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
        <TypeIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {log.patientId?.name || "Unknown Patient"}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">
            {format(new Date(log.createdAt), "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {log.riskLevel && <StatusBadge status={log.riskLevel} />}
          {log.aiFailed && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> AI Failed
            </span>
          )}
        </div>
        {log.finalDiagnosis && (
          <p className="text-xs text-muted-foreground truncate">
            Diagnosis: {log.finalDiagnosis}
          </p>
        )}
        {log.symptoms?.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            Symptoms: {log.symptoms.slice(0, 4).join(", ")}{log.symptoms.length > 4 ? "..." : ""}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
    </div>
  );
}

function LogDetail({ log, onBack }) {
  const typeInfo = TYPE_LABELS[log.type] || TYPE_LABELS.symptom_check;
  const TypeIcon = typeInfo.icon;
  const ai = log.aiResponse;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
          <TypeIcon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-base font-semibold">{typeInfo.label}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "MMM d, yyyy • h:mm a")}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Patient", value: log.patientId?.name },
          { label: "Doctor", value: log.doctorId?.name },
          { label: "Risk Level", value: log.riskLevel ? <StatusBadge status={log.riskLevel} /> : "—" },
          { label: "AI Status", value: log.aiFailed ? <span className="text-orange-600 font-medium text-xs">Failed</span> : <span className="text-emerald-600 font-medium text-xs">Success</span> },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <div className="text-sm font-medium">{value || "—"}</div>
          </div>
        ))}
      </div>

      {/* Symptoms */}
      {log.symptoms?.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <p className="text-sm font-semibold">Symptoms Reported</p>
          <div className="flex flex-wrap gap-2">
            {log.symptoms.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Final Diagnosis & Notes */}
      {(log.finalDiagnosis || log.doctorNotes) && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold">Doctor's Assessment</p>
          {log.finalDiagnosis && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Final Diagnosis</p>
              <p className="text-sm">{log.finalDiagnosis}</p>
            </div>
          )}
          {log.doctorNotes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{log.doctorNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* AI Response */}
      {ai && !log.aiFailed && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800">AI Analysis</p>

          {ai.riskLevel && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Risk Level:</span>
              <StatusBadge status={ai.riskLevel} />
            </div>
          )}

          {ai.possibleConditions?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1.5">Possible Conditions</p>
              <div className="space-y-1">
                {ai.possibleConditions.map((c, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span><span className="font-medium">{c.name}</span>{c.likelihood ? ` — ${c.likelihood}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ai.recommendedTests?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1.5">Recommended Tests</p>
              <div className="flex flex-wrap gap-1.5">
                {ai.recommendedTests.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-white border border-blue-200 text-xs text-blue-700">{t}</span>
                ))}
              </div>
            </div>
          )}

          {ai.urgency && (
            <p className="text-xs text-slate-600">
              <span className="font-medium">Urgency:</span> {ai.urgency}
            </p>
          )}

          {ai.redFlags?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-rose-600 mb-1.5">Red Flags</p>
              <div className="space-y-1">
                {ai.redFlags.map((f, i) => (
                  <p key={i} className="text-xs text-rose-700 flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{f}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiagnosisLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const { data, isLoading } = useGetDiagnosisLogsQuery({ page, limit: 15 });
  const logs = data?.data?.logs ?? [];
  const pagination = data?.data?.pagination ?? {};

  if (selectedLog) {
    return <LogDetail log={selectedLog} onBack={() => setSelectedLog(null)} />;
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Diagnosis History</h1>
          <p className="text-sm text-muted-foreground">All AI diagnosis sessions and their results</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.values(TYPE_LABELS).map(({ label, color, icon: Icon }) => (
          <span key={label} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
            <Icon className="w-3 h-3" />{label}
          </span>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No diagnosis records yet"
          description="Run a Symptom Check or Risk Flagging to create diagnosis logs."
          icon={Brain}
        />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <LogCard key={log._id} log={log} onClick={() => setSelectedLog(log)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
