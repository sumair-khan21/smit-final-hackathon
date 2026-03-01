import { Lock, Crown } from "lucide-react";

const ProBadge = ({ feature, className = "" }) => {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium ${className}`}>
      <Crown className="h-3.5 w-3.5" />
      Pro Feature
      {feature && <span className="text-purple-500 dark:text-purple-500">— {feature}</span>}
    </div>
  );
};

export const ProLock = ({ onUpgrade }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
        <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Pro Feature</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        This feature requires a Pro subscription. Upgrade to unlock AI-powered analytics and risk flagging.
      </p>
      {onUpgrade && (
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  );
};

export default ProBadge;
