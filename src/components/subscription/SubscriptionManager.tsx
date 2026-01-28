import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown, Clock, AlertTriangle } from "lucide-react";
import { 
  Subscription, 
  getTrialDaysRemaining, 
  isTrialExpired 
} from "@/hooks/useSubscription";
import { PlanSelectionDialog } from "./PlanSelectionDialog";

interface SubscriptionManagerProps {
  subscription: Subscription | null;
  onChangePlan: (planId: string) => void;
  onCancelSubscription: () => void;
  loading?: boolean;
}

const planNames: Record<string, string> = {
  basic: "Basic",
  advanced: "Advanced",
  premium: "Premium",
};

const planPrices: Record<string, string> = {
  basic: "$29/month",
  advanced: "$1/month",
  premium: "$99/month",
};

export function SubscriptionManager({
  subscription,
  onChangePlan,
  onCancelSubscription,
  loading = false,
}: SubscriptionManagerProps) {
  const { t } = useTranslation();
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const trialExpired = isTrialExpired(subscription);
  const trialDaysRemaining = getTrialDaysRemaining(subscription);

  const getStatusBadge = () => {
    if (!subscription) return null;

    switch (subscription.status) {
      case "trialing":
        if (trialExpired) {
          return (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {t("subscription.trialExpired")}
            </Badge>
          );
        }
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {t("subscription.trialDaysLeft", { days: trialDaysRemaining })}
          </Badge>
        );
      case "active":
        return (
          <Badge variant="default" className="gap-1 bg-primary">
            <Crown className="w-3 h-3" />
            {t("subscription.active")}
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="gap-1">
            {t("subscription.canceled")}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">
              {subscription ? planNames[subscription.plan_type] : t("subscription.noPlan")}
            </h3>
            {getStatusBadge()}
          </div>
          {subscription && (
            <p className="text-sm text-muted-foreground mt-1">
              {planPrices[subscription.plan_type]}
            </p>
          )}
        </div>
      </div>

      {trialExpired && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">
                {t("subscription.trialExpiredTitle")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("subscription.trialExpiredDesc")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={() => setShowPlanDialog(true)} disabled={loading}>
          {subscription ? t("subscription.changePlan") : t("subscription.selectPlan")}
        </Button>
        {subscription && subscription.status !== "canceled" && (
          <Button
            variant="outline"
            onClick={() => setShowCancelDialog(true)}
            disabled={loading}
          >
            {t("subscription.cancelSubscription")}
          </Button>
        )}
      </div>

      <PlanSelectionDialog
        open={showPlanDialog}
        onOpenChange={setShowPlanDialog}
        currentSubscription={subscription}
        onSelectPlan={(planId) => {
          onChangePlan(planId);
          setShowPlanDialog(false);
        }}
        loading={loading}
        mode={trialExpired ? "trial-expired" : subscription ? "upgrade" : "select"}
      />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("subscription.cancelConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("subscription.cancelConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.no")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onCancelSubscription();
                setShowCancelDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("subscription.confirmCancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
