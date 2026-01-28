import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Subscription } from "@/hooks/useSubscription";

interface Plan {
  id: string;
  name: string;
  nameKey: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  trialDays?: number;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    nameKey: "pricing.basic",
    price: "$29",
    period: "/month",
    features: [
      "Manual filtering controls",
      "Limited AI summaries",
      "1 integration (Gmail or Outlook)",
      "30-day message memory",
      "Basic dashboard",
    ],
    popular: false,
    trialDays: 7,
  },
  {
    id: "advanced",
    name: "Advanced",
    nameKey: "pricing.advanced",
    price: "$1",
    period: "/month",
    features: [
      "Full AI filtering & classification",
      "Multiple integrations",
      "Unlimited decision memory",
      "Custom auto-replies",
      "Priority processing",
      "Advanced insights",
      "Email + chat support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    nameKey: "pricing.premium",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Advanced",
      "White-glove onboarding",
      "Deep AI personalization",
      "Long-term memory & learning",
      "Advanced analytics",
      "Early access to agent features",
      "Dedicated support",
    ],
    popular: false,
  },
];

interface PlanSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSubscription: Subscription | null;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
  mode?: "upgrade" | "select" | "trial-expired";
}

export function PlanSelectionDialog({
  open,
  onOpenChange,
  currentSubscription,
  onSelectPlan,
  loading = false,
  mode = "select",
}: PlanSelectionDialogProps) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleConfirm = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "trial-expired":
        return t("subscription.trialExpiredTitle");
      case "upgrade":
        return t("subscription.changePlan");
      default:
        return t("subscription.selectPlan");
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case "trial-expired":
        return t("subscription.trialExpiredDesc");
      case "upgrade":
        return t("subscription.changePlanDesc");
      default:
        return t("subscription.selectPlanDesc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 py-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_type === plan.id;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                className={`relative rounded-xl p-6 cursor-pointer transition-all border-2 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : isCurrentPlan
                    ? "border-muted bg-muted/50 cursor-not-allowed"
                    : plan.popular
                    ? "border-primary/50 hover:border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      {t("pricing.popular")}
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">
                      {t("subscription.currentPlan")}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{t(plan.nameKey)}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{t("pricing.perMonth")}</span>
                  </div>
                  {plan.trialDays && mode === "select" && (
                    <p className="text-xs text-primary mt-1">
                      {t("subscription.freeTrial", { days: plan.trialDays })}
                    </p>
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPlan || loading}
          >
            {loading ? t("common.loading") : t("subscription.confirmSelection")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
