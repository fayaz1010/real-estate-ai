// PLACEHOLDER FILE: components\ApplicationWizard\RentalHistoryStep.tsx
// TODO: Add your implementation here

import { Home, Plus, Trash2, Phone, Mail } from "lucide-react";
import React from "react";

import { useApplicationForm } from "../../hooks/useApplicationForm";
import { RentalHistoryEntry } from "../../types/application.types";

const RentalHistoryStep: React.FC = () => {
  const { formData, addArrayItem, updateArrayItem, removeArrayItem } =
    useApplicationForm();
  const rentalHistory = formData.rentalHistory || [];

  const emptyRental: Partial<RentalHistoryEntry> = {
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    landlordName: "",
    landlordPhone: "",
    landlordEmail: "",
    monthlyRent: 0,
    startDate: "",
    endDate: "",
    reasonForLeaving: "",
    canContact: true,
    verificationStatus: "not_started",
  };

  const handleAdd = () => {
    addArrayItem("rentalHistory", emptyRental);
  };

  const handleUpdate = (index: number, field: string, value: unknown) => {
    const updated = { ...rentalHistory[index], [field]: value };
    updateArrayItem("rentalHistory", index, updated);
  };

  const handleAddressUpdate = (index: number, field: string, value: string) => {
    const updated = {
      ...rentalHistory[index],
      address: {
        ...rentalHistory[index].address,
        [field]: value,
      },
    };
    updateArrayItem("rentalHistory", index, updated);
  };

  const handleRemove = (index: number) => {
    if (confirm("Remove this rental history entry?")) {
      removeArrayItem("rentalHistory", index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rental History
        </h2>
        <p className="text-gray-600">
          Provide details about your previous rental properties. At least one
          entry is required.
        </p>
      </div>

      {/* Rental History List */}
      <div className="space-y-4">
        {rentalHistory.map(
          (rental: Partial<RentalHistoryEntry>, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {rental.address?.street || "Property Address"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {rental.address?.city && rental.address?.state
                        ? `${rental.address.city}, ${rental.address.state}`
                        : "Location"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Property Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    value={rental.address?.street || ""}
                    onChange={(e) =>
                      handleAddressUpdate(index, "street", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="123 Main Street"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={rental.address?.city || ""}
                      onChange={(e) =>
                        handleAddressUpdate(index, "city", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={rental.address?.state || ""}
                      onChange={(e) =>
                        handleAddressUpdate(
                          index,
                          "state",
                          e.target.value.toUpperCase(),
                        )
                      }
                      maxLength={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={rental.address?.zipCode || ""}
                      onChange={(e) =>
                        handleAddressUpdate(index, "zipCode", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                {/* Landlord Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Landlord/Property Manager
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landlord Name *
                      </label>
                      <input
                        type="text"
                        value={rental.landlordName || ""}
                        onChange={(e) =>
                          handleUpdate(index, "landlordName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="John Smith"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={rental.landlordPhone || ""}
                            onChange={(e) =>
                              handleUpdate(
                                index,
                                "landlordPhone",
                                e.target.value,
                              )
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={rental.landlordEmail || ""}
                            onChange={(e) =>
                              handleUpdate(
                                index,
                                "landlordEmail",
                                e.target.value,
                              )
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="landlord@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Rental Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          value={rental.monthlyRent || ""}
                          onChange={(e) =>
                            handleUpdate(
                              index,
                              "monthlyRent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={rental.startDate || ""}
                        onChange={(e) =>
                          handleUpdate(index, "startDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={rental.endDate || ""}
                        onChange={(e) =>
                          handleUpdate(index, "endDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Reason for Leaving */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Leaving *
                  </label>
                  <textarea
                    value={rental.reasonForLeaving || ""}
                    onChange={(e) =>
                      handleUpdate(index, "reasonForLeaving", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="e.g., Lease ended, Moving for work, Buying a home"
                  />
                </div>

                {/* Can Contact */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rental.canContact ?? true}
                    onChange={(e) =>
                      handleUpdate(index, "canContact", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    You may contact this landlord for verification
                  </label>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Add Rental History Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Rental History
      </button>

      {rentalHistory.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No rental history added yet. If this is your first rental, you can
          skip this or add details about your current living situation.
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>First-time renter?</strong> If you don&apos;t have rental history,
          that&apos;s okay! You may need to provide additional verification or a
          co-signer. Focus on building a strong application with your employment
          and income information.
        </p>
      </div>
    </div>
  );
};

export default RentalHistoryStep;
