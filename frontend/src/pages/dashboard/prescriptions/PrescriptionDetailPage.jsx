import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { useGetPrescriptionQuery } from "@/features/prescriptions/prescriptionApi";
import { generatePrescriptionPDF } from "@/utils/generatePrescriptionPDF";
import { ROUTES } from "@/utils/constants";
import { FileText } from "lucide-react";

const PrescriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetPrescriptionQuery(id);
  const prescription = data?.data?.prescription;

  const handleDownloadPDF = () => {
    generatePrescriptionPDF(prescription, prescription.patientId, prescription.doctorId);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!prescription) return <EmptyState title="Prescription not found" icon={FileText} />;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRESCRIPTIONS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Prescription</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`${ROUTES.AI_PRESCRIPTION_EXPLAIN}?id=${id}`)}>
            <Brain className="h-4 w-4 mr-2" />
            AI Explain
          </Button>
        </div>
      </div>

      {/* Prescription Header */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Doctor</p>
              <p className="font-semibold">Dr. {prescription.doctorId?.name}</p>
              <p className="text-sm text-muted-foreground">{prescription.doctorId?.specialization}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Patient</p>
              <p className="font-semibold">{prescription.patientId?.name}</p>
              <p className="text-sm text-muted-foreground">{prescription.patientId?.age} yrs • {prescription.patientId?.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Date</p>
              <p className="font-medium">{new Date(prescription.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
            </div>
            {prescription.followUpDate && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Follow-up</p>
                <p className="font-medium text-primary">{new Date(prescription.followUpDate).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card>
        <CardHeader><CardTitle className="text-base">Diagnosis</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm">{prescription.diagnosis}</p>
        </CardContent>
      </Card>

      {/* Medicines */}
      <Card>
        <CardHeader><CardTitle className="text-base">Medications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {prescription.medicines.map((med, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start justify-between">
                <p className="font-medium">{i + 1}. {med.name}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{med.dosage}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>Frequency: <span className="text-foreground">{med.frequency}</span></span>
                <span>Duration: <span className="text-foreground">{med.duration}</span></span>
                {med.instructions && <span>Instructions: <span className="text-foreground">{med.instructions}</span></span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      {prescription.notes && (
        <Card>
          <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">{prescription.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionDetailPage;
