import { Brain, Filter, MessageSquare, Zap, Eye, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

export const Features = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Filter,
      titleKey: "features.intelligentFiltering",
      descriptionKey: "features.intelligentFilteringDesc",
    },
    {
      icon: Brain,
      titleKey: "features.decisionProfile",
      descriptionKey: "features.decisionProfileDesc",
    },
    {
      icon: Zap,
      titleKey: "features.highLeverageFocus",
      descriptionKey: "features.highLeverageFocusDesc",
    },
    {
      icon: MessageSquare,
      titleKey: "features.smartAutoResponses",
      descriptionKey: "features.smartAutoResponsesDesc",
    },
    {
      icon: Eye,
      titleKey: "features.executiveDashboard",
      descriptionKey: "features.executiveDashboardDesc",
    },
    {
      icon: Lock,
      titleKey: "features.privacyFirst",
      descriptionKey: "features.privacyFirstDesc",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <span className="text-foreground">{t("features.title1")}</span>{" "}
            <span className="text-gradient-gold">{t("features.title2")}</span>{" "}
            <span className="text-foreground">{t("features.title3")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 font-serif">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = "Features";
