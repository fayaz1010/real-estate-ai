import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../components/seo";

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Privacy Policy — RealEstate AI"
        description="Learn how RealEstate AI collects, uses, and protects your personal information. Our privacy policy outlines your rights and our data practices."
        canonicalUrl="https://realestate-ai.com/privacy"
      />
      <div className="min-h-screen bg-[#F0F9FF]">
        <div className="section-container py-20">
          <h1 className="text-4xl font-space-grotesk font-bold text-realestate-primary mb-8">
            Privacy Policy
          </h1>
          <p className="text-realestate-secondary mb-4">
            Last updated: March 18, 2026
          </p>

          <div className="prose prose-lg max-w-none text-realestate-secondary space-y-6">
            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly, such as your name, email address,
                phone number, and property details when you create an account or use our services.
                We also collect usage data automatically, including browser type, IP address,
                and interactions with our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p>
                We use your information to provide and improve our property management services,
                process transactions, communicate with you about your account, and comply with
                legal obligations. We may also use aggregated, anonymized data for analytics
                and product improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                3. Data Sharing and Disclosure
              </h2>
              <p>
                We do not sell your personal information. We may share data with trusted
                service providers (such as payment processors and cloud hosting) who assist
                in operating our platform, and when required by law or to protect our rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                4. Data Security
              </h2>
              <p>
                We implement industry-standard security measures including encryption in transit
                and at rest, regular security audits, and access controls to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                5. Your Rights
              </h2>
              <p>
                You have the right to access, correct, or delete your personal information.
                You may also opt out of marketing communications at any time. To exercise
                these rights, contact us at{" "}
                <a
                  href="mailto:privacy@realestate-ai.com"
                  className="text-realestate-accent hover:underline"
                >
                  privacy@realestate-ai.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                6. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please{" "}
                <Link to="/contact" className="text-realestate-accent hover:underline">
                  contact us
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
