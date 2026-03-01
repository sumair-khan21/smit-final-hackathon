import { useState } from "react";
import {
  useGetUsersQuery,
  useCreateStaffMutation,
  useDeleteUserMutation,
} from "@/features/users/userApi";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  UserCog, Plus, Trash2, Loader2, X, Eye, EyeOff, Stethoscope, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const STAFF_ROLES = ["doctor", "receptionist"];

const RoleIcon = ({ role }) =>
  role === "doctor"
    ? <Stethoscope className="w-3.5 h-3.5" />
    : <ClipboardList className="w-3.5 h-3.5" />;

const defaultForm = {
  name: "", email: "", password: "", role: "doctor", phone: "", specialization: "",
};

export default function StaffManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [showPwd, setShowPwd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  const { data, isLoading } = useGetUsersQuery({});
  const [createStaff, { isLoading: creating }] = useCreateStaffMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const allUsers = data?.data?.users || [];
  const staff = allUsers.filter((u) =>
    roleFilter === "all"
      ? STAFF_ROLES.includes(u.role)
      : u.role === roleFilter
  );

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStaff({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone || undefined,
        specialization: form.role === "doctor" ? form.specialization || undefined : undefined,
      }).unwrap();
      toast.success(`${form.role === "doctor" ? "Doctor" : "Receptionist"} added successfully`);
      setShowModal(false);
      setForm(defaultForm);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create staff member");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id).unwrap();
      toast.success(`${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <UserCog className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Staff Management</h1>
            <p className="text-sm text-slate-500">Add and manage doctors and receptionists</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: "all", label: "All Staff" },
          { id: "doctor", label: "Doctors" },
          { id: "receptionist", label: "Receptionists" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              roleFilter === tab.id
                ? "bg-white text-violet-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          </div>
        ) : staff.length === 0 ? (
          <div className="py-16 text-center">
            <UserCog className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No {roleFilter === "all" ? "staff" : roleFilter + "s"} found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-violet-600 hover:underline"
            >
              Add your first staff member
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">Role</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide hidden md:table-cell">Specialization</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <RoleIcon role={u.role} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      u.role === "doctor"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                    }`}>
                      <RoleIcon role={u.role} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-slate-500">{u.specialization || "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-slate-500">
                      {u.createdAt ? format(new Date(u.createdAt), "dd MMM yyyy") : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isActive ? "confirmed" : "cancelled"} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Add Staff Member</h2>
              <button onClick={() => { setShowModal(false); setForm(defaultForm); }}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {STAFF_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: r }))}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize flex items-center justify-center gap-2 ${
                        form.role === r
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-300 hover:border-violet-400"
                      }`}
                    >
                      <RoleIcon role={r} /> {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required name="name" value={form.name} onChange={handleChange}
                  placeholder="Dr. John Smith"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  required type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="doctor@clinic.com"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    required name="password" type={showPwd ? "text" : "password"}
                    value={form.password} onChange={handleChange}
                    placeholder="Min 8 characters"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+92-300-0000000"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Specialization — doctors only */}
              {form.role === "doctor" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization (optional)</label>
                  <input
                    name="specialization" value={form.specialization} onChange={handleChange}
                    placeholder="e.g. Cardiologist, General Physician"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setForm(defaultForm); }}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors">
                  {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><Plus className="w-4 h-4" /> Add {form.role}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Remove"
        confirmVariant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
