import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Brain,
  BarChart3,
  CreditCard,
  LogOut,
  X,
  Stethoscope,
  User,
  ClipboardList,
  UserCog,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROLES, ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const navConfig = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
    { label: "Staff", path: ROUTES.STAFF, icon: UserCog },
    { label: "Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
    { label: "Subscription", path: ROUTES.SUBSCRIPTION, icon: CreditCard },
  ],
  [ROLES.DOCTOR]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "My Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
    { label: "Symptom Checker", path: ROUTES.AI_SYMPTOM_CHECKER, icon: Brain },
    { label: "AI Explain Rx", path: ROUTES.AI_PRESCRIPTION_EXPLAIN, icon: Stethoscope },
    
    { label: "My Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
  ],
  [ROLES.RECEPTIONIST]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Daily Schedule", path: ROUTES.SCHEDULE, icon: CalendarDays },
  ],
  [ROLES.PATIENT]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "My Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "My Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
  ],
};

const Sidebar = ({ onClose }) => {
  const { user, role, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const links = navConfig[role] || [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">AI Clinic</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === ROUTES.DASHBOARD || link.path === ROUTES.APPOINTMENTS}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
