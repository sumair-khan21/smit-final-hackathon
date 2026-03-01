import { Link, useNavigate, NavLink } from "react-router-dom";
import { LogOut, User, Menu, X, Stethoscope, Crown, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const Header = () => {
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      setMobileOpen(false);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { label: "Home", path: ROUTES.HOME },
    { label: "Features", path: "/#features" },
    { label: "Pricing", path: "/#pricing" },
    { label: "Contact", path: ROUTES.CONTACT },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-sm"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold text-foreground tracking-tight">AI Clinic</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Health Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive && link.path !== "/#features" && link.path !== "/#pricing"
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/40">
                <div className="h-7 w-7 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold leading-none text-foreground">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize mt-0.5 flex items-center gap-1">
                    {user?.role}
                    {user?.subscriptionPlan === "pro" && (
                      <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold">
                        <Crown className="w-2.5 h-2.5" /> Pro
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button size="sm" asChild className="gap-1.5 h-8">
                <Link to={ROUTES.DASHBOARD}>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="gap-1.5 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                {isLoggingOut ? "..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="h-8 px-4">
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button size="sm" asChild className="h-8 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-sm shadow-blue-500/25">
                <Link to={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/98 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1 max-w-7xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border/40 my-3" />

            {isAuthenticated ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border/40">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                      {user?.role}
                      {user?.subscriptionPlan === "pro" && (
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <Crown className="w-3 h-3" /> Pro
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button className="w-full gap-2 bg-linear-to-r from-blue-600 to-indigo-600 border-0" asChild>
                  <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 border-0" asChild>
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
