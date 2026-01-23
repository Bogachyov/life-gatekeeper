import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-16">
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
              The first layer of a new operating system for life. 
              AI that protects your attention and surfaces what truly matters.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LifeOS. All rights reserved.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Integrations
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  GDPR
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
