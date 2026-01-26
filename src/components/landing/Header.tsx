import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="glass-strong rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-serif font-semibold">LifeOS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.howItWorks')}
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.pricing')}
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">{t('common.signIn')}</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">{t('common.getStarted')}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSelector />
              <button
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border/50">
              <div className="flex flex-col gap-4">
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.howItWorks')}
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.pricing')}
                </a>
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">{t('common.signIn')}</Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/auth">{t('common.getStarted')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
