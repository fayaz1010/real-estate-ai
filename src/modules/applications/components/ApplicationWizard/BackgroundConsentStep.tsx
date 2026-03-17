// PLACEHOLDER FILE: components\ApplicationWizard\BackgroundConsentStep.tsx
// TODO: Add your implementation here

import { Shield, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import React, { useState } from "react";

import { useApplicationForm } from "../../hooks/useApplicationForm";

const BackgroundConsentStep: React.FC = () => {
  const { formData, updateField } = useApplicationForm();
  const [signature, setSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const hasConsented = formData.backgroundConsentGiven || false;

  const handleConsent = () => {
    if (!signature) {
      alert("Please provide your full legal name as signature");
      return;
    }

    updateField("backgroundConsentGiven", true);
  };

  const handleRevoke = () => {
    if (
      confirm(
        "Are you sure you want to revoke consent? This is required to proceed.",
      )
    ) {
      updateField("backgroundConsentGiven", false);
      setSignature("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Background & Credit Check Consent
        </h2>
        <p className="text-gray-600">
          We require your consent to conduct background and credit checks as
          part of the application process.
        </p>
      </div>

      {/* What We Check */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          What We&apos;ll Check
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Credit History</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Credit score</li>
              <li>• Payment history</li>
              <li>• Outstanding debts</li>
              <li>• Public records (bankruptcies, liens)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Background Check</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Criminal history</li>
              <li>• Eviction records</li>
              <li>• Sex offender registry</li>
              <li>• Identity verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Disclosure */}
      <div className="border border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Authorization and Disclosure
        </h3>

        <div className="prose prose-sm text-gray-700 space-y-4">
          <p>
            <strong>DISCLOSURE REGARDING BACKGROUND INVESTIGATION</strong>
          </p>

          <p>
            In connection with your application for housing,{" "}
            {"{Property Management Company}"} may obtain information about you
            from a consumer reporting agency for employment purposes. Thus, you
            may be the subject of a &quot;consumer report&quot; and/or an
            &quot;investigative consumer report&quot; which may include
            information about your character, general reputation, personal
            characteristics, and/or mode of living. These reports may contain
            information regarding your credit history, criminal history, social
            security verification, motor vehicle records (&quot;driving
            records&quot;), verification of your education or employment
            history, or other background checks.
          </p>

          <p>
            <strong>
              SUMMARY OF YOUR RIGHTS UNDER THE FAIR CREDIT REPORTING ACT
            </strong>
          </p>

          <p>
            The federal Fair Credit Reporting Act (FCRA) promotes the accuracy,
            fairness, and privacy of information in the files of consumer
            reporting agencies. You have the right to:
          </p>

          <ul className="list-disc list-inside space-y-1">
            <li>Know if information in your file has been used against you</li>
            <li>Know what is in your file</li>
            <li>Ask for a credit score</li>
            <li>Dispute incomplete or inaccurate information</li>
            <li>
              Limit &quot;prescreened&quot; offers of credit and insurance
            </li>
            <li>Seek damages from violators</li>
          </ul>

          <p>
            <strong>A SUMMARY OF YOUR RIGHTS UNDER FCRA</strong> is available at{" "}
            <a
              href="https://www.consumer.ftc.gov/articles/pdf-0096-fair-credit-reporting-act.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              www.consumer.ftc.gov
            </a>
          </p>

          <p>
            <strong>STATE LAW NOTICES</strong>
          </p>

          <p className="text-xs">
            California: Under California Civil Code section 1786.22, you are
            entitled to find out what is in the investigative consumer report by
            making a written request to the consumer reporting agency. You have
            a right to request and promptly receive a copy of any such report.
            You also have the right to dispute the accuracy or completeness of
            information in the report.
          </p>

          <p className="text-xs">
            New York: Upon request, you will be informed whether or not a
            consumer report was requested, and if such report was requested,
            informed of the name and address of the consumer reporting agency
            that furnished the report.
          </p>

          <p className="text-xs">
            Washington: If we request an investigative consumer report, you have
            the right, upon written request made within a reasonable time, to
            receive a complete and accurate disclosure of the nature and scope
            of the investigation.
          </p>
        </div>
      </div>

      {/* Consent Form */}
      {!hasConsented ? (
        <div className="border-2 border-blue-300 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Authorization for Background Check
          </h3>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <p className="text-sm text-yellow-800">
                  By signing below, you certify that you have read and
                  understand the disclosure and authorize{" "}
                  {"{Property Management Company}"} to obtain consumer reports
                  and/or investigative consumer reports at any time during your
                  tenancy for any legitimate purpose.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Legal Name (as Signature) *
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Michael Doe"
              />
              <p className="mt-1 text-xs text-gray-500">
                Type your full legal name to serve as your electronic signature
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <button
              onClick={handleConsent}
              disabled={!signature}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />I Consent to Background
              Check
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
          <div className="flex items-start mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                Consent Provided
              </h3>
              <p className="text-sm text-green-800">
                You have authorized background and credit checks. This consent
                will remain in effect throughout the application process and, if
                approved, during your tenancy.
              </p>
            </div>
          </div>

          <div className="border-t border-green-200 pt-4 mt-4">
            <p className="text-sm text-green-900 mb-2">
              <strong>Signed by:</strong>{" "}
              {signature ||
                formData.personalInfo?.firstName +
                  " " +
                  formData.personalInfo?.lastName}
            </p>
            <p className="text-sm text-green-900 mb-4">
              <strong>Date:</strong> {signatureDate}
            </p>

            <button
              onClick={handleRevoke}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Revoke Consent
            </button>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Important Information
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            • <strong>Cost:</strong> Background and credit check fees may apply
            (typically $30-$50) and are non-refundable
          </li>
          <li>
            • <strong>Processing Time:</strong> Checks usually take 24-48 hours
            to complete
          </li>
          <li>
            • <strong>Adverse Action:</strong> If your application is denied
            based on the report, you will receive written notice with
            information on how to dispute inaccuracies
          </li>
          <li>
            • <strong>Privacy:</strong> Your information is protected and will
            only be used for application evaluation purposes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackgroundConsentStep;
