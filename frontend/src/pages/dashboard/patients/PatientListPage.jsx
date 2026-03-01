import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { useGetPatientsQuery, useDeletePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const PatientListPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useGetPatientsQuery({ search, page, limit: 10 });
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  const patients = data?.data?.patients || [];
  const pagination = data?.data?.pagination || {};

  const handleDelete = async () => {
    try {
      await deletePatient(deleteId).unwrap();
      toast.success("Patient deleted successfully");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete patient");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button asChild size="sm">
          <Link to={ROUTES.PATIENTS + "/add"}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : patients.length === 0 ? (
            <EmptyState title="No patients found" description={search ? "Try a different search term" : "No patients registered yet"} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Age / Gender</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">Blood Group</th>
                    <th className="px-4 py-3 text-left font-medium">Registered</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary">{patient.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{patient.age} yrs / {patient.gender}</td>
                      <td className="px-4 py-3">{patient.phone}</td>
                      <td className="px-4 py-3">{patient.bloodGroup || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`${ROUTES.PATIENTS}/${patient._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`${ROUTES.PATIENTS}/${patient._id}`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(patient._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? All associated records will also be removed."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PatientListPage;
