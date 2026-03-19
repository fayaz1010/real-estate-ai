import React from "react";
import { Link } from "react-router-dom";

import { PageMeta } from "../components/seo";

export const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Cookie Policy — RealEstate AI"
        description="Understand how RealEstate AI uses cookies and similar technologies to improve your experience on our property management platform."
        canonicalUrl="https://realestate-ai.com/cookies"
      />
      <div className="min-h-screen bg-[#F0F9FF]">
        <div className="section-container py-20">
          <h1 className="text-4xl font-space-grotesk font-bold text-realestate-primary mb-8">
            Cookie Policy
          </h1>
          <p className="text-realestate-secondary mb-4">
            Last updated: March 18, 2026
          </p>

          <div className="prose prose-lg max-w-none text-realestate-secondary space-y-6">
            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                1. What Are Cookies
              </h2>
              <p>
                Cookies are small text files stored on your device when you visit a website.
                They help us recognize your browser, remember your preferences, and improve
                your experience on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                2. How We Use Cookies
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for the platform to function,
                  including authentication and security tokens.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how users interact
                  with our platform so we can improve it.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences
                  for a personalized experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                3. Managing Cookies
              </h2>
              <p>
                You can control and delete cookies through your browser settings. Please note
                that disabling essential cookies may affect the functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-space-grotesk font-semibold text-realestate-primary mt-8 mb-4">
                4. Contact
              </h2>
              <p>
                For questions about our cookie practices, please{" "}
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

export default CookiePolicyPage;
