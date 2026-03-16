// PLACEHOLDER FILE: components\Verification\IncomeVerification.tsx
// TODO: Add your implementation here

import React, { useState } from 'react';
import { DollarSign, Upload, CheckCircle, AlertCircle, FileText, Link as LinkIcon } from 'lucide-react';
import { useVerification } from '../../hooks/useVerification';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import { calculateMonthlyIncome } from '../../utils/scoringAlgorithm';

interface IncomeVerificationProps {
  applicationId: string;
}

const IncomeVerification: React.FC<IncomeVerificationProps> = ({ applicationId }) => {
  const { incomeStatus, startIncomeVerification, initializePlaid, connectPlaid, loading } = useVerification(applicationId);
  const { formData } = useApplicationForm();
  
  const [method, setMethod] = useState<'documents' | 'plaid' | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  const income = formData.income || [];
  const employment = formData.employment || [];
  const monthlyIncome = calculateMonthlyIncome(income as any);

  const handleDocumentUpload = (files: FileList) => {
    const docNames = Array.from(files).map(f => f.name);
    setUploadedDocs([...uploadedDocs, ...docNames]);
  };

  const handlePlaidVerification = async () => {
    try {
      const linkToken = await initializePlaid();
      // In production, integrate with Plaid Link SDK
      alert('Plaid integration coming soon! For demo, this would open Plaid Link.');
    } catch (error) {
      console.error('Plaid init failed:', error);
    }
  };

  const handleSubmitDocuments = async () => {
    if (uploadedDocs.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    try {
      await startIncomeVerification({
        employerName: employment[0]?.employerName || '',
        annualIncome: monthlyIncome * 12,
        employmentStartDate: employment[0]?.startDate || '',
        documents: uploadedDocs,
      });
      alert('Documents submitted for verification');
    } catch (error) {
      alert('Verification failed');
    }
  };

  if (incomeStatus === 'verified') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Income Verified</h3>
            <p className="text-sm text-green-700">
              Verified monthly income: ${monthlyIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Income Verification</h2>
        <p className="text-gray-600">
          Verify your income to strengthen your application
        </p>
      </div>

      {/* Income Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-800 mb-1">Total Monthly Income</p>
            <p className="text-3xl font-bold text-blue-900">
              ${monthlyIncome.toLocaleString()}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Annual: ${(monthlyIncome * 12).toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      {/* Verification Method Selection */}
      {!method && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Choose Verification Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('documents')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <Upload className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Upload Documents</h4>
              <p className="text-sm text-gray-600">
                Upload paystubs, bank statements, or tax returns
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Processing time: 1-2 business days
              </p>
            </button>

            <button
              onClick={() => setMethod('plaid')}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
            >
              <LinkIcon className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
              <p className="text-sm text-gray-600">
                Connect your bank account securely with Plaid
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Processing time: Instant
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Document Upload Method */}
      {method === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Upload Income Documents</h3>
            <button
              onClick={() => setMethod(null)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Change Method
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mb-2" />
            <p className="text-sm text-yellow-800">
              Upload documents from the last 2-3 months for best results
            </p>
          </div>

          {/* Document Types */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-600">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {/* Uploaded Documents */}
            {uploadedDocs.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  Uploaded Documents ({uploadedDocs.length})
                </p>
                {uploadedDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm text-gray-900">{doc}</span>
                    </div>
                    <button
                      onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Accepted Documents</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Recent paystubs (last 2 months)</li>
              <li>• Bank statements (last 3 months)</li>
              <li>• Tax returns (W-2, 1099, or full return)</li>
              <li>• Employment verification letter</li>
              <li>• Social Security or benefit statements</li>
            </ul>
          </div>

          <button
            onClick={handleSubmitDocuments}
            disabled={uploadedDocs.length === 0 || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </div>
      )}

      {/* Plaid Method */}
      {method === 'plaid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Instant Bank Verification</h3>
            <button
              onClick={() => setMethod(null)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Change Method
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-green-900 mb-2">Why Use Instant Verification?</h4>
            <ul className="text-sm text-green-800 space-y-2">
              <li>✓ Get verified instantly - no waiting</li>
              <li>✓ Securely connect your bank account</li>
              <li>✓ Automatic income calculation</li>
              <li>✓ Bank-level encryption and security</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">How It Works</h4>
            <ol className="text-sm text-gray-700 space-y-2">
              <li>1. Click "Connect Bank Account" below</li>
              <li>2. Search for and select your bank</li>
              <li>3. Log in with your online banking credentials</li>
              <li>4. We'll securely verify your income and account</li>
            </ol>
          </div>

          <button
            onClick={handlePlaidVerification}
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center text-lg font-semibold"
          >
            <LinkIcon className="w-6 h-6 mr-2" />
            {loading ? 'Connecting...' : 'Connect Bank Account'}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Powered by Plaid • Bank-level security • Your credentials are never stored
            </p>
          </div>
        </div>
      )}

      {/* Income Sources Listed */}
      {income.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Income Sources to Verify</h3>
          <div className="space-y-2">
            {income.map((inc, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {inc.source?.replace('_', ' ') || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${(inc.amount || 0).toLocaleString()} / {inc.frequency || 'monthly'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inc.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                    inc.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inc.verificationStatus?.replace('_', ' ') || 'Not Started'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeVerification;