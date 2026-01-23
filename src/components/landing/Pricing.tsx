import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Get started with essential filtering",
    features: [
      "Manual filtering controls",
      "Limited AI summaries",
      "1 integration (Gmail or Outlook)",
      "30-day message memory",
      "Basic dashboard",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Advanced",
    price: "$29",
    period: "/month",
    description: "Full AI-powered opportunity filtering",
    features: [
      "Full AI filtering & classification",
      "Multiple integrations",
      "Unlimited decision memory",
      "Custom auto-replies",
      "Priority processing",
      "Advanced insights",
      "Email + chat support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    description: "White-glove experience for executives",
    features: [
      "Everything in Advanced",
      "White-glove onboarding",
      "Deep AI personalization",
      "Long-term memory & learning",
      "Advanced analytics",
      "Early access to agent features",
      "Dedicated support",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <span className="text-foreground">Simple,</span>{" "}
            <span className="text-gradient-gold">Transparent</span>{" "}
            <span className="text-foreground">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. Cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
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
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold font-serif mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
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
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include: Secure data encryption • GDPR compliance • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
