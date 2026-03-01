import { useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateUserSubscriptionMutation } from "@/features/users/userApi";
import { useGetMeQuery } from "@/features/auth/authApi";
import { Crown, Check, Loader2, Zap, ShieldAlert, Brain, TrendingUp, FileText } from "lucide-react";

const FREE_FEATURES = [
  { icon: Brain, text: "AI Symptom Checker" },
  { icon: FileText, text: "Prescription Explanation" },
  { icon: TrendingUp, text: "Basic Analytics" },
  { icon: Check, text: "Patient Management" },
  { icon: Check, text: "Appointment Booking" },
  { icon: Check, text: "Prescription System" },
];

const PRO_FEATURES = [
  { icon: ShieldAlert, text: "AI Risk Flagging", highlight: true },
  { icon: TrendingUp, text: "Advanced Analytics", highlight: true },
  { icon: Brain, text: "All AI Features" },
  { icon: FileText, text: "Full Prescription PDF" },
  { icon: Check, text: "All Free Features" },
  { icon: Zap, text: "Priority Support" },
];

export default function SubscriptionPage() {
  const user = useSelector((s) => s.auth.user);
  const currentPlan = user?.subscriptionPlan || "free";

  const [updating, setUpdating] = useState(null); // 'free' | 'pro' | null
  const [updateSubscription] = useUpdateUserSubscriptionMutation();
  const { refetch } = useGetMeQuery();

  const handleUpgrade = async (plan) => {
    if (plan === currentPlan) return;
    setUpdating(plan);
    try {
      await updateSubscription({ userId: user._id, subscriptionPlan: plan }).unwrap();
      await refetch();
    } catch {
      // Silently handle
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Subscription Plans</h1>
        <p className="text-slate-500 mt-1">Choose the plan that fits your clinic's needs</p>
      </div>

      {/* Current plan badge */}
      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 rounded-full w-fit mx-auto text-sm text-slate-600">
        <span>Current plan:</span>
        <span className={`font-semibold capitalize ${currentPlan === "pro" ? "text-amber-600" : "text-slate-700"}`}>
          {currentPlan}
        </span>
        {currentPlan === "pro" && <Crown className="w-4 h-4 text-amber-500" />}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
          currentPlan === "free" ? "border-blue-400 shadow-md shadow-blue-100" : "border-slate-200"
        }`}>
          {currentPlan === "free" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Current Plan
            </div>
          )}

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Free</h2>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-slate-800">PKR 0</span>
              <span className="text-slate-400 text-sm mb-1">/month</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Perfect for small clinics getting started</p>
          </div>

          <ul className="space-y-3 mb-6">
            {FREE_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 text-blue-600" />
                </div>
                {text}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade("free")}
            disabled={currentPlan === "free" || updating !== null}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentPlan === "free"
                ? "bg-blue-50 text-blue-600 cursor-default border border-blue-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {currentPlan === "free" ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Active
              </span>
            ) : updating === "free" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Switching...
              </span>
            ) : (
              "Downgrade to Free"
            )}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 p-6 transition-all ${
          currentPlan === "pro" ? "border-amber-400 shadow-lg shadow-amber-100" : "border-slate-700"
        }`}>
          {/* Popular badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            {currentPlan === "pro" ? "Current Plan" : "Recommended"}
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              Pro <Crown className="w-4 h-4 text-amber-400" />
            </h2>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-white">PKR 2,999</span>
              <span className="text-slate-400 text-sm mb-1">/month</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">Full AI power for growing clinics</p>
          </div>

          <ul className="space-y-3 mb-6">
            {PRO_FEATURES.map(({ icon: Icon, text, highlight }) => (
              <li key={text} className={`flex items-center gap-2.5 text-sm ${highlight ? "text-amber-300 font-medium" : "text-slate-300"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-amber-400/20" : "bg-slate-700"}`}>
                  <Icon className={`w-3 h-3 ${highlight ? "text-amber-400" : "text-slate-400"}`} />
                </div>
                {text}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade("pro")}
            disabled={currentPlan === "pro" || updating !== null}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentPlan === "pro"
                ? "bg-amber-400/20 text-amber-300 cursor-default border border-amber-400/30"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg"
            }`}
          >
            {currentPlan === "pro" ? (
              <span className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" /> Pro Active
              </span>
            ) : updating === "pro" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Upgrading...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Upgrade to Pro
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Info note */}
      <p className="text-center text-xs text-slate-400">
        This is a demo subscription system for the hackathon. No real payment is required.
        Changes take effect immediately.
      </p>
    </div>
  );
}
