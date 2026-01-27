import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

export const Footer = forwardRef<HTMLElement>((props, ref) => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-border/50 py-16" ref={ref}>
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-serif font-semibold">LifeOS</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              {t("footer.description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.howItWorks")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.pricing")}
                </a>
              </li>
              <li>
                <Link to="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.integrations")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.gdpr")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
