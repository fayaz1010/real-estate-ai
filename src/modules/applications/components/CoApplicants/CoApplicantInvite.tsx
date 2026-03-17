// PLACEHOLDER FILE: components\CoApplicants\CoApplicantInvite.tsx
// TODO: Add your implementation here

import { UserPlus, Mail, Send, CheckCircle, X } from "lucide-react";
import React, { useState } from "react";

import { useApplication } from "../../hooks/useApplication";
import { applicationService } from "../../services/applicationService";

interface CoApplicantInviteProps {
  applicationId: string;
  onInviteSent?: () => void;
}

const CoApplicantInvite: React.FC<CoApplicantInviteProps> = ({
  applicationId,
  onInviteSent,
}) => {
  const { application } = useApplication(applicationId);
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState<
    "spouse" | "partner" | "roommate" | "family" | "other"
  >("roommate");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const coApplicants = application?.coApplicants || [];

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (
      coApplicants.some((ca) => ca.email.toLowerCase() === email.toLowerCase())
    ) {
      alert("This email has already been invited");
      return;
    }

    setSending(true);
    try {
      await applicationService.inviteCoApplicant(
        applicationId,
        email,
        relationship,
      );
      setShowSuccess(true);
      setEmail("");
      setTimeout(() => setShowSuccess(false), 3000);
      onInviteSent?.();
    } catch (error) {
      alert("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const handleRemove = async (coApplicantId: string) => {
    if (!confirm("Remove this co-applicant?")) return;

    try {
      await applicationService.removeCoApplicant(applicationId, coApplicantId);
    } catch (error) {
      alert("Failed to remove co-applicant");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Invite Co-Applicants
        </h3>
        <p className="text-sm text-gray-600">
          Add additional applicants to strengthen your application
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">Invitation sent successfully!</span>
        </div>
      )}

      {/* Invite Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship *
            </label>
            <select
              value={relationship}
              onChange={(e) =>
                setRelationship(
                  e.target.value as
                    | "spouse"
                    | "partner"
                    | "roommate"
                    | "family"
                    | "other",
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="spouse">Spouse</option>
              <option value="partner">Partner</option>
              <option value="roommate">Roommate</option>
              <option value="family">Family Member</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            onClick={handleInvite}
            disabled={!email || sending}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invited Co-Applicants */}
      {coApplicants.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Invited Co-Applicants ({coApplicants.length})
          </h4>
          <div className="space-y-3">
            {coApplicants.map((coApp) => (
              <div
                key={coApp.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center flex-1">
                  <UserPlus className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{coApp.email}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {coApp.relationship} • {coApp.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      coApp.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : coApp.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {coApp.status === "completed"
                      ? "Completed"
                      : coApp.status === "in_progress"
                        ? "In Progress"
                        : "Invited"}
                  </span>
                  <button
                    onClick={() => handleRemove(coApp.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          About Co-Applicants
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Co-applicants will receive an email invitation</li>
          <li>• They&apos;ll fill out their own section of the application</li>
          <li>• All co-applicants&apos; information will be combined</li>
          <li>• Joint responsibility for the lease</li>
        </ul>
      </div>
    </div>
  );
};

export default CoApplicantInvite;
