import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../components/seo";

export const TermsPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Terms of Service — RealEstate AI"
        description="Read the terms and conditions governing your use of the RealEstate AI property management platform."
        canonicalUrl="https://realestate-ai.com/terms"
      />
      <div className="min-h-screen bg-[#F0F9FF]">
        <div className="section-container py-20">
          <h1 className="text-4xl font-space-grotesk font-bold text-realestate-primary mb-8">
            Terms of Service
          </h1>
          <p className="text-realestate-secondary mb-4">
            Last updated: March 18, 2026
          </p>

          <div className="prose prose-lg max-w-none text-realestate-secondary space-y-6">
            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the RealEstate AI platform, you agree to be bound by
                these Terms of Service. If you do not agree, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                2. Description of Service
              </h2>
              <p>
                RealEstate AI provides an AI-powered property management platform that includes
                tenant screening, rent collection, maintenance management, communication tools,
                and analytics for landlords and property managers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                3. User Accounts
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account. You must
                provide accurate and complete information when creating an account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                4. Acceptable Use
              </h2>
              <p>
                You agree not to misuse the platform, including attempting unauthorized access,
                transmitting harmful code, or using the service for any unlawful purpose.
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                5. Payment Terms
              </h2>
              <p>
                Paid subscriptions are billed in advance on a recurring basis. You authorize
                us to charge your payment method for all applicable fees. Refunds are handled
                in accordance with our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                6. Limitation of Liability
              </h2>
              <p>
                RealEstate AI is provided &quot;as is&quot; without warranties of any kind.
                We shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                7. Contact
              </h2>
              <p>
                For questions about these Terms, please{" "}
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

export default TermsPage;
