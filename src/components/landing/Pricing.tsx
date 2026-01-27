import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

const plans = [
  {
    nameKey: "pricing.basic",
    price: "$1",
    period: "/month",
    descriptionKey: "pricing.basicDesc",
    features: [
      "Manual filtering controls",
      "Limited AI summaries",
      "1 integration (Gmail or Outlook)",
      "30-day message memory",
      "Basic dashboard",
    ],
    ctaKey: "pricing.startFree",
    popular: false,
  },
  {
    nameKey: "pricing.advanced",
    price: "$49",
    period: "/month",
    descriptionKey: "pricing.advancedDesc",
    features: [
      "Full AI filtering & classification",
      "Multiple integrations",
      "Unlimited decision memory",
      "Custom auto-replies",
      "Priority processing",
      "Advanced insights",
      "Email + chat support",
    ],
    ctaKey: "pricing.getStarted",
    popular: true,
  },
  {
    nameKey: "pricing.premium",
    price: "$99",
    period: "/month",
    descriptionKey: "pricing.premiumDesc",
    features: [
      "Everything in Advanced",
      "White-glove onboarding",
      "Deep AI personalization",
      "Long-term memory & learning",
      "Advanced analytics",
      "Early access to agent features",
      "Dedicated support",
    ],
    ctaKey: "pricing.getStarted",
    popular: false,
  },
];

export const Pricing = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useTranslation();
  
  return (
    <section id="pricing" className="relative py-32" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <span className="text-foreground">{t("pricing.title1")}</span>{" "}
            <span className="text-gradient-gold">{t("pricing.title2")}</span>{" "}
            <span className="text-foreground">{t("pricing.title3")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.nameKey}
              className={`relative rounded-2xl p-8 transition-all duration-300 animate-fade-in ${
                plan.popular
                  ? "bg-card border-2 border-primary shadow-gold-lg scale-105"
                  : "bg-card/50 border border-border/50 hover:border-border"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    {t("pricing.popular")}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold font-serif mb-2">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{t("pricing.perMonth")}</span>}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{t(plan.descriptionKey)}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.popular ? "hero" : "outline"}
                className="w-full"
                asChild
              >
                <Link to="/auth">{t(plan.ctaKey)}</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("pricing.allPlansInclude")}
          </p>
        </div>
      </div>
    </section>
  );
});

Pricing.displayName = "Pricing";
