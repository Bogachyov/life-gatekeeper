import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, such as your email address and account preferences.
              When you connect integrations, we access only the data necessary to provide our filtering and
              prioritization services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              Your data is used to train your personal AI model and provide intelligent filtering. We do not
              sell your personal information to third parties. All data processing happens securely and in
              accordance with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. All communications are
              encrypted, and we regularly audit our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal data at any time. You can also
              export your data or request account deletion through your settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at privacy@lifeos.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
