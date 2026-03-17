import React, { useState } from "react";

import type {
  TenantScreeningFormData,
  EmploymentEntry,
  RentalHistoryEntry,
  ReferenceEntry,
} from "../api/tenantScreeningService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TenantScreeningFormProps {
  onSubmit: (data: TenantScreeningFormData) => Promise<void>;
  isSubmitting: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const emptyEmployment: EmploymentEntry = {
  employerName: "",
  startDate: "",
  endDate: "",
  position: "",
  salary: "",
};

const emptyRental: RentalHistoryEntry = {
  landlordName: "",
  address: "",
  startDate: "",
  endDate: "",
  reasonForLeaving: "",
};

const emptyReference: ReferenceEntry = {
  name: "",
  phoneNumber: "",
  email: "",
  relationship: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;

function maskSSN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function TenantScreeningForm({
  onSubmit,
  isSubmitting,
}: TenantScreeningFormProps) {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ssn, setSsn] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [previousAddress, setPreviousAddress] = useState("");
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentEntry[]>(
    [{ ...emptyEmployment }],
  );
  const [rentalHistory, setRentalHistory] = useState<RentalHistoryEntry[]>([
    { ...emptyRental },
  ]);
  const [references, setReferences] = useState<ReferenceEntry[]>([
    { ...emptyReference },
    { ...emptyReference },
  ]);
  const [consentBackgroundCheck, setConsentBackgroundCheck] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!currentAddress.trim())
      errs.currentAddress = "Current address is required";
    if (!consentBackgroundCheck)
      errs.consentBackgroundCheck =
        "You must consent to a background check to proceed";

    if (employmentHistory.length === 0) {
      errs.employmentHistory = "At least one employment entry is required";
    } else {
      employmentHistory.forEach((entry, i) => {
        if (!entry.employerName.trim())
          errs[`emp_${i}_employerName`] = "Employer name is required";
        if (!entry.startDate)
          errs[`emp_${i}_startDate`] = "Start date is required";
        if (!entry.endDate) errs[`emp_${i}_endDate`] = "End date is required";
        if (!entry.position.trim())
          errs[`emp_${i}_position`] = "Position is required";
        if (!entry.salary.trim())
          errs[`emp_${i}_salary`] = "Salary is required";
      });
    }

    if (rentalHistory.length === 0) {
      errs.rentalHistory = "At least one rental history entry is required";
    } else {
      rentalHistory.forEach((entry, i) => {
        if (!entry.landlordName.trim())
          errs[`rental_${i}_landlordName`] = "Landlord name is required";
        if (!entry.address.trim())
          errs[`rental_${i}_address`] = "Address is required";
        if (!entry.startDate)
          errs[`rental_${i}_startDate`] = "Start date is required";
        if (!entry.endDate)
          errs[`rental_${i}_endDate`] = "End date is required";
        if (!entry.reasonForLeaving.trim())
          errs[`rental_${i}_reasonForLeaving`] =
            "Reason for leaving is required";
      });
    }

    if (references.length < 2) {
      errs.references = "At least two references are required";
    } else {
      references.forEach((entry, i) => {
        if (!entry.name.trim()) errs[`ref_${i}_name`] = "Name is required";
        if (!entry.phoneNumber.trim()) {
          errs[`ref_${i}_phoneNumber`] = "Phone number is required";
        } else if (!PHONE_REGEX.test(entry.phoneNumber)) {
          errs[`ref_${i}_phoneNumber`] = "Invalid phone number format";
        }
        if (!entry.email.trim()) {
          errs[`ref_${i}_email`] = "Email is required";
        } else if (!EMAIL_REGEX.test(entry.email)) {
          errs[`ref_${i}_email`] = "Invalid email format";
        }
        if (!entry.relationship.trim())
          errs[`ref_${i}_relationship`] = "Relationship is required";
      });
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      ssn: ssn ? ssn.replace(/\D/g, "") : undefined,
      currentAddress: currentAddress.trim(),
      previousAddress: previousAddress.trim() || undefined,
      employmentHistory,
      rentalHistory,
      references,
      consentBackgroundCheck,
    });
  }

  function updateEmployment(
    index: number,
    field: keyof EmploymentEntry,
    value: string,
  ) {
    setEmploymentHistory((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  }

  function updateRental(
    index: number,
    field: keyof RentalHistoryEntry,
    value: string,
  ) {
    setRentalHistory((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  }

  function updateReference(
    index: number,
    field: keyof ReferenceEntry,
    value: string,
  ) {
    setReferences((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  }

  const labelClass =
    "block text-sm font-semibold text-[#091a2b] font-[Montserrat] mb-1";
  const inputClass = "font-[Open_Sans]";
  const errorClass = "text-red-600 text-xs mt-1";
  const sectionClass = "space-y-4 rounded-lg border border-[#091a2b]/10 p-5";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-[#f1f3f4] p-6 rounded-xl"
    >
      {/* Personal Information */}
      <fieldset className={sectionClass}>
        <legend className="text-lg font-bold text-[#091a2b] font-[Montserrat] px-2">
          Personal Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <Input
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
          </div>

          <div>
            <label className={labelClass}>Date of Birth *</label>
            <Input
              className={inputClass}
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            {errors.dateOfBirth && (
              <p className={errorClass}>{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Social Security Number{" "}
              <span className="font-normal text-xs text-gray-500">
                (optional)
              </span>
            </label>
            <Input
              className={inputClass}
              value={ssn}
              onChange={(e) => setSsn(maskSSN(e.target.value))}
              placeholder="XXX-XX-XXXX"
              autoComplete="off"
            />
          </div>

          <div>
            <label className={labelClass}>Current Address *</label>
            <Input
              className={inputClass}
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              placeholder="123 Main St, City, State ZIP"
            />
            {errors.currentAddress && (
              <p className={errorClass}>{errors.currentAddress}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Previous Address{" "}
              <span className="font-normal text-xs text-gray-500">
                (optional)
              </span>
            </label>
            <Input
              className={inputClass}
              value={previousAddress}
              onChange={(e) => setPreviousAddress(e.target.value)}
              placeholder="456 Oak Ave, City, State ZIP"
            />
          </div>
        </div>
      </fieldset>

      {/* Employment History */}
      <fieldset className={sectionClass}>
        <legend className="text-lg font-bold text-[#091a2b] font-[Montserrat] px-2">
          Employment History
        </legend>
        {errors.employmentHistory && (
          <p className={errorClass}>{errors.employmentHistory}</p>
        )}

        {employmentHistory.map((entry, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg relative"
          >
            {employmentHistory.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setEmploymentHistory((prev) =>
                    prev.filter((_, idx) => idx !== i),
                  )
                }
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
            <div>
              <label className={labelClass}>Employer Name *</label>
              <Input
                className={inputClass}
                value={entry.employerName}
                onChange={(e) =>
                  updateEmployment(i, "employerName", e.target.value)
                }
              />
              {errors[`emp_${i}_employerName`] && (
                <p className={errorClass}>{errors[`emp_${i}_employerName`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Position *</label>
              <Input
                className={inputClass}
                value={entry.position}
                onChange={(e) =>
                  updateEmployment(i, "position", e.target.value)
                }
              />
              {errors[`emp_${i}_position`] && (
                <p className={errorClass}>{errors[`emp_${i}_position`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Salary *</label>
              <Input
                className={inputClass}
                value={entry.salary}
                onChange={(e) => updateEmployment(i, "salary", e.target.value)}
                placeholder="$60,000/year"
              />
              {errors[`emp_${i}_salary`] && (
                <p className={errorClass}>{errors[`emp_${i}_salary`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Start Date *</label>
              <Input
                className={inputClass}
                type="date"
                value={entry.startDate}
                onChange={(e) =>
                  updateEmployment(i, "startDate", e.target.value)
                }
              />
              {errors[`emp_${i}_startDate`] && (
                <p className={errorClass}>{errors[`emp_${i}_startDate`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>End Date *</label>
              <Input
                className={inputClass}
                type="date"
                value={entry.endDate}
                onChange={(e) => updateEmployment(i, "endDate", e.target.value)}
              />
              {errors[`emp_${i}_endDate`] && (
                <p className={errorClass}>{errors[`emp_${i}_endDate`]}</p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setEmploymentHistory((prev) => [...prev, { ...emptyEmployment }])
          }
        >
          + Add Employment
        </Button>
      </fieldset>

      {/* Rental History */}
      <fieldset className={sectionClass}>
        <legend className="text-lg font-bold text-[#091a2b] font-[Montserrat] px-2">
          Rental History
        </legend>
        {errors.rentalHistory && (
          <p className={errorClass}>{errors.rentalHistory}</p>
        )}

        {rentalHistory.map((entry, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg relative"
          >
            {rentalHistory.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setRentalHistory((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
            <div>
              <label className={labelClass}>Landlord Name *</label>
              <Input
                className={inputClass}
                value={entry.landlordName}
                onChange={(e) =>
                  updateRental(i, "landlordName", e.target.value)
                }
              />
              {errors[`rental_${i}_landlordName`] && (
                <p className={errorClass}>
                  {errors[`rental_${i}_landlordName`]}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Address *</label>
              <Input
                className={inputClass}
                value={entry.address}
                onChange={(e) => updateRental(i, "address", e.target.value)}
              />
              {errors[`rental_${i}_address`] && (
                <p className={errorClass}>{errors[`rental_${i}_address`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Reason for Leaving *</label>
              <Input
                className={inputClass}
                value={entry.reasonForLeaving}
                onChange={(e) =>
                  updateRental(i, "reasonForLeaving", e.target.value)
                }
              />
              {errors[`rental_${i}_reasonForLeaving`] && (
                <p className={errorClass}>
                  {errors[`rental_${i}_reasonForLeaving`]}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Start Date *</label>
              <Input
                className={inputClass}
                type="date"
                value={entry.startDate}
                onChange={(e) => updateRental(i, "startDate", e.target.value)}
              />
              {errors[`rental_${i}_startDate`] && (
                <p className={errorClass}>{errors[`rental_${i}_startDate`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>End Date *</label>
              <Input
                className={inputClass}
                type="date"
                value={entry.endDate}
                onChange={(e) => updateRental(i, "endDate", e.target.value)}
              />
              {errors[`rental_${i}_endDate`] && (
                <p className={errorClass}>{errors[`rental_${i}_endDate`]}</p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setRentalHistory((prev) => [...prev, { ...emptyRental }])
          }
        >
          + Add Rental History
        </Button>
      </fieldset>

      {/* References */}
      <fieldset className={sectionClass}>
        <legend className="text-lg font-bold text-[#091a2b] font-[Montserrat] px-2">
          References
        </legend>
        {errors.references && <p className={errorClass}>{errors.references}</p>}

        {references.map((entry, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg relative"
          >
            {references.length > 2 && (
              <button
                type="button"
                onClick={() =>
                  setReferences((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
            <div>
              <label className={labelClass}>Name *</label>
              <Input
                className={inputClass}
                value={entry.name}
                onChange={(e) => updateReference(i, "name", e.target.value)}
              />
              {errors[`ref_${i}_name`] && (
                <p className={errorClass}>{errors[`ref_${i}_name`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <Input
                className={inputClass}
                value={entry.phoneNumber}
                onChange={(e) =>
                  updateReference(i, "phoneNumber", e.target.value)
                }
                placeholder="(555) 123-4567"
              />
              {errors[`ref_${i}_phoneNumber`] && (
                <p className={errorClass}>{errors[`ref_${i}_phoneNumber`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <Input
                className={inputClass}
                type="email"
                value={entry.email}
                onChange={(e) => updateReference(i, "email", e.target.value)}
                placeholder="reference@email.com"
              />
              {errors[`ref_${i}_email`] && (
                <p className={errorClass}>{errors[`ref_${i}_email`]}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Relationship *</label>
              <Input
                className={inputClass}
                value={entry.relationship}
                onChange={(e) =>
                  updateReference(i, "relationship", e.target.value)
                }
                placeholder="e.g. Former Landlord, Employer, Personal"
              />
              {errors[`ref_${i}_relationship`] && (
                <p className={errorClass}>{errors[`ref_${i}_relationship`]}</p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setReferences((prev) => [...prev, { ...emptyReference }])
          }
        >
          + Add Reference
        </Button>
      </fieldset>

      {/* Screening Services Info */}
      <div className={cn(sectionClass, "bg-[#005163]/5")}>
        <h3 className="text-lg font-bold text-[#091a2b] font-[Montserrat]">
          Screening Checks Included
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-[Open_Sans]">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-5 w-5 rounded-full bg-[#005163] text-white flex items-center justify-center text-xs flex-shrink-0">
              1
            </span>
            <div>
              <p className="font-semibold text-[#091a2b]">Credit Check</p>
              <p className="text-gray-500">
                via TransUnion / Experian / Equifax
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-5 w-5 rounded-full bg-[#005163] text-white flex items-center justify-center text-xs flex-shrink-0">
              2
            </span>
            <div>
              <p className="font-semibold text-[#091a2b]">
                Criminal Background
              </p>
              <p className="text-gray-500">National & county records</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-5 w-5 rounded-full bg-[#005163] text-white flex items-center justify-center text-xs flex-shrink-0">
              3
            </span>
            <div>
              <p className="font-semibold text-[#091a2b]">Eviction History</p>
              <p className="text-gray-500">Nationwide eviction records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Consent */}
      <div className={sectionClass}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentBackgroundCheck}
            onChange={(e) => setConsentBackgroundCheck(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#091a2b] focus:ring-[#091a2b]"
          />
          <span className="text-sm font-[Open_Sans] text-[#091a2b]">
            I consent to a background check, including credit check, criminal
            background check, and eviction history verification. I understand
            that this information will be used solely for tenant screening
            purposes. *
          </span>
        </label>
        {errors.consentBackgroundCheck && (
          <p className={errorClass}>{errors.consentBackgroundCheck}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#091a2b] hover:bg-[#091a2b]/90 text-white px-8 py-3 font-[Montserrat] font-semibold"
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit Screening Request"}
        </Button>
      </div>
    </form>
  );
}
