import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using LifeOS, you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground">
              LifeOS provides AI-powered filtering and prioritization of digital communications. We help you
              focus on what matters by intelligently managing your inbox and messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the security of your account and for all activities that
              occur under your account. You must not misuse the service or attempt to access it using
              unauthorized methods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Subscription and Billing</h2>
            <p className="text-muted-foreground">
              Paid subscriptions are billed in advance. You may cancel at any time, and your subscription
              will remain active until the end of your billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              LifeOS is provided "as is" without warranties of any kind. We are not liable for any damages
              arising from your use of the service, including missed messages or incorrect filtering.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at legal@lifeos.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
