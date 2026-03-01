import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import {
  Brain,
  Shield,
  CalendarDays,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Crown,
  Zap,
  Star,
  Activity,
  Clock,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: "AI Symptom Checker",
    desc: "Gemini-powered analysis returns risk levels, possible conditions, and recommended tests in seconds.",
    color: "blue",
    badge: "Free",
  },
  {
    icon: FileText,
    title: "Smart Prescriptions",
    desc: "Digital prescriptions with AI patient-friendly explanations in English and Urdu.",
    color: "emerald",
    badge: "Free",
  },
  {
    icon: CalendarDays,
    title: "Appointment Management",
    desc: "Conflict-free scheduling with role-based access for doctors and receptionists.",
    color: "violet",
    badge: "Free",
  },
  {
    icon: Users,
    title: "Patient Records",
    desc: "Complete medical history timeline with appointments, prescriptions, and diagnoses.",
    color: "orange",
    badge: "Free",
  },
  {
    icon: Shield,
    title: "AI Risk Flagging",
    desc: "Analyze patient history for risk patterns, red flags, and chronic condition monitoring.",
    color: "rose",
    badge: "Pro",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    desc: "Real-time clinic insights with revenue tracking, monthly charts, and diagnosis trends.",
    color: "indigo",
    badge: "Pro",
  },
];

const colorMap = {
  blue:   { bg: "bg-blue-500/10",   icon: "bg-blue-500",   text: "text-blue-600",   border: "border-blue-500/20",   glow: "shadow-blue-500/20" },
  emerald:{ bg: "bg-emerald-500/10",icon: "bg-emerald-500",text: "text-emerald-600",border: "border-emerald-500/20",glow: "shadow-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", icon: "bg-violet-500", text: "text-violet-600", border: "border-violet-500/20", glow: "shadow-violet-500/20" },
  orange: { bg: "bg-orange-500/10", icon: "bg-orange-500", text: "text-orange-600", border: "border-orange-500/20", glow: "shadow-orange-500/20" },
  rose:   { bg: "bg-rose-500/10",   icon: "bg-rose-500",   text: "text-rose-600",   border: "border-rose-500/20",   glow: "shadow-rose-500/20" },
  indigo: { bg: "bg-indigo-500/10", icon: "bg-indigo-500", text: "text-indigo-600", border: "border-indigo-500/20", glow: "shadow-indigo-500/20" },
};

const roles = [
  {
    icon: "🏥",
    title: "Admin",
    color: "blue",
    perks: ["Manage doctors & staff", "Full analytics access", "Subscription control", "System-wide oversight"],
  },
  {
    icon: "🩺",
    title: "Doctor",
    color: "emerald",
    perks: ["AI Symptom Checker", "Create prescriptions", "View own patients", "AI Risk Flagging (Pro)"],
  },
  {
    icon: "🗓️",
    title: "Receptionist",
    color: "violet",
    perks: ["Register patients", "Book appointments", "Daily schedule view", "Patient search"],
  },
  {
    icon: "👤",
    title: "Patient",
    color: "orange",
    perks: ["View own records", "My prescriptions", "AI Rx explanations", "Appointment history"],
  },
];

const stats = [
  { value: "4", label: "User Roles", icon: Users },
  { value: "3+", label: "AI Features", icon: Brain },
  { value: "EN+UR", label: "Languages", icon: Sparkles },
  { value: "99.9%", label: "Uptime SLA", icon: Activity },
];

const freePros = [
  "Patient registration & records",
  "Appointment booking & scheduling",
  "Digital prescription creation",
  "AI Symptom Checker",
  "AI Prescription Explanation",
  "Role-based access control",
];

const proExtras = [
  "AI Risk Flagging & Analysis",
  "Advanced predictive analytics",
  "Priority support",
  "Unlimited AI queries",
];

/* ─── Component ─────────────────────────────────── */
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center px-4 py-16 md:py-24">
        {/* Ambient background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/6 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/6 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/4 blur-[80px]" />
        </div>

        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col items-center text-center gap-8">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/8 px-4 py-1.5 text-sm font-medium text-blue-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AI-Powered Clinic Management
              <span className="h-px w-4 bg-blue-400/40" />
              Powered by Gemini
            </div>

            {/* Headline */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                The Smarter Way to{" "}
                <span className="relative">
                  <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Run Your Clinic
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Digitize patient records, appointments, and prescriptions — then layer in AI-powered diagnosis, risk analysis, and real-time analytics. Everything your clinic needs, in one place.
              </p>
            </div>

            {/* CTA */}
            {isAuthenticated ? (
              <div className="space-y-3 w-full max-w-sm">
                <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm px-5 py-4">
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <p className="text-lg font-bold mt-0.5 flex items-center justify-center gap-2">
                    {user?.name}
                    {user?.subscriptionPlan === "pro" && (
                      <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-semibold">
                        <Crown className="w-4 h-4" /> Pro
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role} account</p>
                </div>
                <Button size="lg" className="w-full gap-2 bg-linear-to-r from-blue-600 to-indigo-600 border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow" asChild>
                  <Link to={ROUTES.DASHBOARD}>
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Button size="lg" className="gap-2 px-8 bg-linear-to-r from-blue-600 to-indigo-600 border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow" asChild>
                  <Link to={ROUTES.LOGIN}>
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
                  <Link to={ROUTES.REGISTER}>Create Account</Link>
                </Button>
              </div>
            )}

            {/* Trust line */}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                No credit card required · Free plan available · Setup in minutes
              </p>
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl pt-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm px-4 py-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="h-4 w-4 text-primary/60" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" className="px-4 py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-500/8 border border-blue-500/20 px-3 py-1.5 rounded-full">
              <Stethoscope className="w-3.5 h-3.5" />
              Clinical Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything Your Clinic Needs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              From first registration to AI-powered diagnostics — purpose-built for modern healthcare practices.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, badge }) => {
              const c = colorMap[color];
              return (
                <div
                  key={title}
                  className={`group relative rounded-2xl border ${c.border} bg-card hover:bg-card/80 p-6 transition-all hover:shadow-lg ${c.glow} space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`h-11 w-11 rounded-xl ${c.icon} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      badge === "Pro"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}>
                      {badge === "Pro" ? (
                        <span className="flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> Pro</span>
                      ) : (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Free</span>
                      )}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-base text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Learn more <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────── */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-500/8 border border-violet-500/20 px-3 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5" />
              Role-Based Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for Every Role</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fine-grained permissions so each team member sees exactly what they need — nothing more.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map(({ icon, title, color, perks }) => {
              const c = colorMap[color];
              return (
                <div key={title} className={`rounded-2xl border ${c.border} bg-card p-6 space-y-5`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl ${c.bg} flex items-center justify-center text-xl`}>
                      {icon}
                    </div>
                    <span className={`text-base font-bold ${c.text}`}>{title}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${c.text}`} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className={`w-full text-xs ${c.text} border ${c.border} hover:${c.bg}`} asChild>
                    <Link to={ROUTES.LOGIN}>Sign in as {title}</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="px-4 py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-500/8 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              Quick Setup
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Up and Running in Minutes</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Sign up as a clinic admin. Set up your profile and invite your team.",
                icon: Users,
                color: "blue",
              },
              {
                step: "02",
                title: "Add Patients & Staff",
                desc: "Register patients, add doctors and receptionists with role-based access.",
                icon: Stethoscope,
                color: "emerald",
              },
              {
                step: "03",
                title: "Start Using AI",
                desc: "Book appointments, create prescriptions, and let AI assist with diagnosis.",
                icon: Brain,
                color: "violet",
              },
            ].map(({ step, title, desc, icon: Icon, color }) => {
              const c = colorMap[color];
              return (
                <div key={step} className="relative rounded-2xl border border-border/50 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-4xl font-black ${c.text} opacity-20 leading-none`}>{step}</span>
                    <div className={`h-10 w-10 rounded-xl ${c.icon} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-base">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-500/8 border border-amber-500/20 px-3 py-1.5 rounded-full">
              <Crown className="w-3.5 h-3.5" />
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start Free, Scale as You Grow</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All core clinic features are free forever. Upgrade to Pro for AI-powered advanced features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-border/50 bg-card p-7 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Free</span>
                </div>
                <p className="text-3xl font-black mt-3">$0<span className="text-base font-normal text-muted-foreground"> / mo</span></p>
                <p className="text-sm text-muted-foreground">Perfect for small clinics getting started</p>
              </div>

              <ul className="space-y-3">
                {freePros.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full" asChild>
                <Link to={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-blue-500/40 bg-linear-to-br from-blue-600/5 via-indigo-600/5 to-violet-600/5 p-7 space-y-6 shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                </div>
                <p className="text-3xl font-black mt-3">$9<span className="text-base font-normal text-muted-foreground"> / mo</span></p>
                <p className="text-sm text-muted-foreground">For growing clinics that need AI power</p>
              </div>

              <ul className="space-y-3">
                {[...freePros, ...proExtras].map((item, i) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${i >= freePros.length ? "text-blue-500" : "text-emerald-500"}`} />
                    <span className={i >= freePros.length ? "font-medium text-foreground" : ""}>{item}</span>
                    {i >= freePros.length && (
                      <span className="ml-auto text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded">NEW</span>
                    )}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 border-0 shadow-md shadow-blue-500/25" asChild>
                <Link to={isAuthenticated ? ROUTES.SUBSCRIPTION : ROUTES.REGISTER}>
                  <Zap className="h-4 w-4 mr-2" />
                  {isAuthenticated ? "Upgrade to Pro" : "Start with Pro"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="px-4 py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 md:p-14 text-center space-y-6">
            {/* Glow orbs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500/15 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Modernize Your Clinic?
                </h2>
                <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  Join clinics already using AI Clinic to deliver better patient care, save time, and grow smarter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                {isAuthenticated ? (
                  <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100 border-0 shadow-xl px-8" asChild>
                    <Link to={ROUTES.DASHBOARD}>
                      <Activity className="h-5 w-5" /> Open Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100 border-0 shadow-xl px-8" asChild>
                      <Link to={ROUTES.LOGIN}>
                        Get Started Free <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10 px-8" asChild>
                      <Link to={ROUTES.REGISTER}>
                        <Lock className="h-4 w-4" /> Create Account
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <p className="text-slate-500 text-sm">
                No setup fees · Cancel anytime · Free plan forever
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
