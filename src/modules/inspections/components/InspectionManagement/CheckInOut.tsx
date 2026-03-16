// PLACEHOLDER FILE: src/modules/inspections/components/InspectionManagement/CheckInOut.tsx
// TODO: Add your implementation here

import { MapPin, Camera, CheckCircle, Star } from "lucide-react";
import React, { useState } from "react";

import { useInspections } from "../../hooks/useInspections";
import { Inspection, CheckOutDto } from "../../types/inspection.types";

interface CheckInOutProps {
  inspection: Inspection;
}

export const CheckInOut: React.FC<CheckInOutProps> = ({ inspection }) => {
  const { checkIn, checkOut } = useInspections();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Feedback form state
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [comment, setComment] = useState("");
  const [likedFeatures, setLikedFeatures] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [interestedInApplying, setInterestedInApplying] = useState(true);

  const featureOptions = [
    "Kitchen",
    "Bathroom",
    "Living Space",
    "Bedrooms",
    "Storage",
    "Natural Light",
    "Location",
    "Building Amenities",
    "Outdoor Space",
    "Parking",
  ];

  const handleCheckIn = async () => {
    if ("geolocation" in navigator) {
      setIsCheckingIn(true);
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          },
        );

        await checkIn(inspection.id, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error("Failed to check in:", error);
        alert("Failed to check in. Please enable location services.");
      } finally {
        setIsCheckingIn(false);
      }
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleCheckOut = () => {
    setShowFeedbackForm(true);
  };

  const submitFeedback = async () => {
    setIsCheckingOut(true);
    try {
      const feedbackData = {
        rating,
        comment,
        likedFeatures,
        concerns,
        interestedInApplying,
      };

      await checkOut(inspection.id, feedbackData);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Failed to check out:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const toggleFeature = (
    feature: string,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    if (list.includes(feature)) {
      setList(list.filter((f) => f !== feature));
    } else {
      setList([...list, feature]);
    }
  };

  // Already checked in
  if (inspection.status === "checked_in") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Checked In</h3>
            <p className="text-sm text-gray-600">
              {new Date(inspection.checkedInAt!).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckOut}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Check Out & Leave Feedback
        </button>

        {/* Feedback Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How was your inspection?
              </h2>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Liked Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What did you like? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() =>
                        toggleFeature(feature, likedFeatures, setLikedFeatures)
                      }
                      className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                        likedFeatures.includes(feature)
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Any concerns?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() =>
                        toggleFeature(feature, concerns, setConcerns)
                      }
                      className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                        concerns.includes(feature)
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share more details about your experience..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500
                </p>
              </div>

              {/* Interest in Applying */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interestedInApplying}
                    onChange={(e) => setInterestedInApplying(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    I&apos;m interested in applying for this property
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={isCheckingOut}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCheckingOut ? "Submitting..." : "Submit & Check Out"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Check-in available
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Inspection Check-In</h3>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Ready to check in?</p>
            <p>
              When you arrive at the property, tap the button below to check in.
              We&apos;ll verify your location to confirm you&apos;re at the right place.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckIn}
        disabled={isCheckingIn}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        {isCheckingIn ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Checking In...
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            Check In Now
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Check-in will use your location to confirm you&apos;re at the property
      </div>
    </div>
  );
};
