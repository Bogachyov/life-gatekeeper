import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function GDPR() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">GDPR Compliance</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights Under GDPR</h2>
            <p className="text-muted-foreground">
              If you are a resident of the European Economic Area (EEA), you have certain data protection
              rights under the General Data Protection Regulation (GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Right to Access</h2>
            <p className="text-muted-foreground">
              You have the right to request copies of your personal data. We may charge a small fee for this
              service in certain circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Right to Rectification</h2>
            <p className="text-muted-foreground">
              You have the right to request that we correct any information you believe is inaccurate or
              complete information you believe is incomplete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Right to Erasure</h2>
            <p className="text-muted-foreground">
              You have the right to request that we erase your personal data under certain conditions. This
              is also known as the "right to be forgotten."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Right to Data Portability</h2>
            <p className="text-muted-foreground">
              You have the right to request that we transfer the data we have collected to another
              organization, or directly to you, under certain conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Processing</h2>
            <p className="text-muted-foreground">
              We process your data based on your consent and our legitimate interests in providing the
              service. You can withdraw consent at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Protection Officer</h2>
            <p className="text-muted-foreground">
              For GDPR-related inquiries, please contact our Data Protection Officer at dpo@lifeos.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
