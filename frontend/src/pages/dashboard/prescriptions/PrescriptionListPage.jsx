import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import useAuth from "@/hooks/useAuth";
import { useGetPrescriptionsQuery } from "@/features/prescriptions/prescriptionApi";
import { ROUTES } from "@/utils/constants";

const PrescriptionListPage = () => {
  const [page, setPage] = useState(1);
  const { isDoctor } = useAuth();

  const { data, isLoading } = useGetPrescriptionsQuery({ page, limit: 10 });
  const prescriptions = data?.data?.prescriptions || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        {isDoctor && (
          <Button asChild size="sm">
            <Link to={ROUTES.PRESCRIPTIONS + "/create"}>
              <Plus className="h-4 w-4 mr-2" />
              Write Prescription
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : prescriptions.length === 0 ? (
            <EmptyState title="No prescriptions" description="No prescriptions found." icon={FileText} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Patient</th>
                    <th className="px-4 py-3 text-left font-medium">Doctor</th>
                    <th className="px-4 py-3 text-left font-medium">Diagnosis</th>
                    <th className="px-4 py-3 text-left font-medium">Medicines</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx) => (
                    <tr key={rx._id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{rx.patientId?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <p>{rx.doctorId?.name}</p>
                        <p className="text-xs text-muted-foreground">{rx.doctorId?.specialization}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[150px] truncate">{rx.diagnosis}</td>
                      <td className="px-4 py-3">{rx.medicines?.length || 0} medicine(s)</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(rx.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`${ROUTES.PRESCRIPTIONS}/${rx._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionListPage;
