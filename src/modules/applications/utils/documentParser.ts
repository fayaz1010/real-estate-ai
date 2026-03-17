// PLACEHOLDER FILE: utils\documentParser.ts
// TODO: Add your implementation here

import { Address } from "../types/application.types";

export interface ParsedDocument {
  type:
    | "paystub"
    | "id"
    | "bank_statement"
    | "lease"
    | "tax_return"
    | "employment_letter"
    | "unknown";
  confidence: number; // 0-100
  extractedData: Record<string, unknown>;
  rawText?: string;
}

export interface PaystubData {
  employerName: string;
  employeeName: string;
  grossPay: number;
  netPay: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  ytdGrossPay?: number;
  payFrequency?: "weekly" | "biweekly" | "monthly";
}

export interface IDData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  idNumber: string;
  expirationDate: string;
  address: Partial<Address>;
  idType: "drivers_license" | "passport" | "state_id";
}

export interface BankStatementData {
  accountHolderName: string;
  accountNumber: string;
  statementPeriod: {
    start: string;
    end: string;
  };
  beginningBalance: number;
  endingBalance: number;
  averageBalance: number;
  deposits: number;
  withdrawals: number;
}

export interface LeaseData {
  landlordName: string;
  landlordPhone?: string;
  landlordEmail?: string;
  tenantName: string;
  propertyAddress: Partial<Address>;
  monthlyRent: number;
  leaseStartDate: string;
  leaseEndDate: string;
  securityDeposit?: number;
}

/**
 * Main document parsing function
 * In production, this would call an OCR/AI service like:
 * - AWS Textract
 * - Google Cloud Vision API
 * - Azure Form Recognizer
 * - Custom ML model
 */
export const parseDocument = async (
  file: File,
  documentType?: string,
): Promise<ParsedDocument> => {
  try {
    // Extract text from document (mock implementation)
    const rawText = await extractTextFromFile(file);

    // Detect document type if not provided
    const detectedType = documentType || detectDocumentType(rawText);

    // Parse based on type
    let extractedData: Record<string, unknown> = {};
    let confidence = 0;

    switch (detectedType) {
      case "paystub":
        extractedData = parsePaystub(rawText);
        confidence = calculateConfidence(extractedData, [
          "employerName",
          "grossPay",
          "payDate",
        ]);
        break;

      case "id":
        extractedData = parseID(rawText);
        confidence = calculateConfidence(extractedData, [
          "firstName",
          "lastName",
          "dateOfBirth",
          "idNumber",
        ]);
        break;

      case "bank_statement":
        extractedData = parseBankStatement(rawText);
        confidence = calculateConfidence(extractedData, [
          "accountHolderName",
          "endingBalance",
        ]);
        break;

      case "lease":
        extractedData = parseLease(rawText);
        confidence = calculateConfidence(extractedData, [
          "landlordName",
          "monthlyRent",
          "leaseStartDate",
        ]);
        break;

      default:
        confidence = 0;
    }

    return {
      type: detectedType as ParsedDocument["type"],
      confidence,
      extractedData,
      rawText,
    };
  } catch (error) {
    console.error("Document parsing error:", error);
    return {
      type: "unknown",
      confidence: 0,
      extractedData: {},
    };
  }
};

/**
 * Extract text from file (mock - in production use OCR service)
 */
const extractTextFromFile = async (file: File): Promise<string> => {
  // In production, call OCR service here
  // For now, return mock text for demonstration
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // This is a mock - actual implementation would use OCR
      resolve((e.target?.result as string) || "");
    };
    reader.readAsText(file);
  });
};

/**
 * Detect document type from text content
 */
const detectDocumentType = (text: string): string => {
  const lowerText = text.toLowerCase();

  // Paystub indicators
  if (
    lowerText.includes("pay stub") ||
    lowerText.includes("paystub") ||
    lowerText.includes("earnings statement") ||
    (lowerText.includes("gross pay") && lowerText.includes("net pay"))
  ) {
    return "paystub";
  }

  // ID indicators
  if (
    lowerText.includes("driver") ||
    lowerText.includes("license") ||
    lowerText.includes("passport") ||
    lowerText.includes("identification card")
  ) {
    return "id";
  }

  // Bank statement indicators
  if (
    lowerText.includes("bank statement") ||
    lowerText.includes("account summary") ||
    (lowerText.includes("beginning balance") &&
      lowerText.includes("ending balance"))
  ) {
    return "bank_statement";
  }

  // Lease indicators
  if (
    lowerText.includes("lease agreement") ||
    lowerText.includes("rental agreement") ||
    (lowerText.includes("landlord") &&
      lowerText.includes("tenant") &&
      lowerText.includes("rent"))
  ) {
    return "lease";
  }

  return "unknown";
};

/**
 * Parse paystub data
 */
const parsePaystub = (text: string): Partial<PaystubData> => {
  const data: Partial<PaystubData> = {};

  // Extract employer name (usually at top)
  const employerMatch = text.match(
    /(?:company|employer)[:|\s]+([A-Za-z\s&.,]+)/i,
  );
  if (employerMatch) {
    data.employerName = employerMatch[1].trim();
  }

  // Extract employee name
  const employeeMatch = text.match(/(?:employee|name)[:|\s]+([A-Za-z\s]+)/i);
  if (employeeMatch) {
    data.employeeName = employeeMatch[1].trim();
  }

  // Extract gross pay
  const grossPayMatch = text.match(/gross\s*pay[:|\s]+\$?([\d,]+\.?\d*)/i);
  if (grossPayMatch) {
    data.grossPay = parseFloat(grossPayMatch[1].replace(/,/g, ""));
  }

  // Extract net pay
  const netPayMatch = text.match(/net\s*pay[:|\s]+\$?([\d,]+\.?\d*)/i);
  if (netPayMatch) {
    data.netPay = parseFloat(netPayMatch[1].replace(/,/g, ""));
  }

  // Extract pay date
  const payDateMatch = text.match(
    /pay\s*date[:|\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  );
  if (payDateMatch) {
    data.payDate = payDateMatch[1];
  }

  // Extract YTD gross pay
  const ytdMatch = text.match(/ytd\s*gross[:|\s]+\$?([\d,]+\.?\d*)/i);
  if (ytdMatch) {
    data.ytdGrossPay = parseFloat(ytdMatch[1].replace(/,/g, ""));
  }

  return data;
};

/**
 * Parse ID data
 */
const parseID = (text: string): Partial<IDData> => {
  const data: Partial<IDData> = {};

  // Determine ID type
  if (text.toLowerCase().includes("driver")) {
    data.idType = "drivers_license";
  } else if (text.toLowerCase().includes("passport")) {
    data.idType = "passport";
  } else {
    data.idType = "state_id";
  }

  // Extract name
  const nameMatch = text.match(/(?:name|full name)[:|\s]+([A-Za-z\s]+)/i);
  if (nameMatch) {
    const nameParts = nameMatch[1].trim().split(/\s+/);
    data.firstName = nameParts[0];
    data.lastName = nameParts[nameParts.length - 1];
    if (nameParts.length > 2) {
      data.middleName = nameParts.slice(1, -1).join(" ");
    }
  }

  // Extract DOB
  const dobMatch = text.match(
    /(?:dob|date of birth|born)[:|\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  );
  if (dobMatch) {
    data.dateOfBirth = dobMatch[1];
  }

  // Extract ID number
  const idMatch = text.match(/(?:id|license|dl|number)[:|\s#]+([A-Z0-9-]+)/i);
  if (idMatch) {
    data.idNumber = idMatch[1];
  }

  // Extract expiration
  const expMatch = text.match(
    /(?:exp|expiration|expires)[:|\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  );
  if (expMatch) {
    data.expirationDate = expMatch[1];
  }

  // Extract address (simplified)
  const addressMatch = text.match(/(?:address|addr)[:|\s]+(.+?)(?:\n|$)/i);
  if (addressMatch) {
    data.address = {
      street: addressMatch[1].trim(),
    };
  }

  return data;
};

/**
 * Parse bank statement data
 */
const parseBankStatement = (text: string): Partial<BankStatementData> => {
  const data: Partial<BankStatementData> = {};

  // Extract account holder
  const holderMatch = text.match(
    /(?:account holder|name)[:|\s]+([A-Za-z\s]+)/i,
  );
  if (holderMatch) {
    data.accountHolderName = holderMatch[1].trim();
  }

  // Extract account number (last 4 digits for security)
  const accountMatch = text.match(/(?:account|acct)[:|\s#]+\*+(\d{4})/i);
  if (accountMatch) {
    data.accountNumber = `****${accountMatch[1]}`;
  }

  // Extract beginning balance
  const beginMatch = text.match(
    /(?:beginning|opening)\s*balance[:|\s]+\$?([\d,]+\.?\d*)/i,
  );
  if (beginMatch) {
    data.beginningBalance = parseFloat(beginMatch[1].replace(/,/g, ""));
  }

  // Extract ending balance
  const endMatch = text.match(
    /(?:ending|closing)\s*balance[:|\s]+\$?([\d,]+\.?\d*)/i,
  );
  if (endMatch) {
    data.endingBalance = parseFloat(endMatch[1].replace(/,/g, ""));
  }

  // Calculate average balance (simplified)
  if (data.beginningBalance && data.endingBalance) {
    data.averageBalance = (data.beginningBalance + data.endingBalance) / 2;
  }

  return data;
};

/**
 * Parse lease agreement data
 */
const parseLease = (text: string): Partial<LeaseData> => {
  const data: Partial<LeaseData> = {};

  // Extract landlord name
  const landlordMatch = text.match(
    /(?:landlord|lessor|owner)[:|\s]+([A-Za-z\s]+)/i,
  );
  if (landlordMatch) {
    data.landlordName = landlordMatch[1].trim();
  }

  // Extract tenant name
  const tenantMatch = text.match(
    /(?:tenant|lessee|renter)[:|\s]+([A-Za-z\s]+)/i,
  );
  if (tenantMatch) {
    data.tenantName = tenantMatch[1].trim();
  }

  // Extract monthly rent
  const rentMatch = text.match(
    /(?:monthly rent|rent amount)[:|\s]+\$?([\d,]+\.?\d*)/i,
  );
  if (rentMatch) {
    data.monthlyRent = parseFloat(rentMatch[1].replace(/,/g, ""));
  }

  // Extract lease start date
  const startMatch = text.match(
    /(?:lease start|start date|commencement)[:|\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  );
  if (startMatch) {
    data.leaseStartDate = startMatch[1];
  }

  // Extract lease end date
  const endMatch = text.match(
    /(?:lease end|end date|termination)[:|\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  );
  if (endMatch) {
    data.leaseEndDate = endMatch[1];
  }

  // Extract security deposit
  const depositMatch = text.match(
    /(?:security deposit|deposit)[:|\s]+\$?([\d,]+\.?\d*)/i,
  );
  if (depositMatch) {
    data.securityDeposit = parseFloat(depositMatch[1].replace(/,/g, ""));
  }

  return data;
};

/**
 * Calculate confidence score based on required fields
 */
const calculateConfidence = (
  data: Record<string, unknown>,
  requiredFields: string[],
): number => {
  const foundFields = requiredFields.filter((field) => {
    const value = data[field];
    return value !== undefined && value !== null && value !== "";
  });

  const confidence = (foundFields.length / requiredFields.length) * 100;
  return Math.round(confidence);
};

/**
 * Validate parsed data quality
 */
export const validateParsedData = (
  parsed: ParsedDocument,
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (parsed.confidence < 50) {
    issues.push("Low confidence in parsed data - manual review recommended");
  }

  if (parsed.type === "paystub") {
    const data = parsed.extractedData as Partial<PaystubData>;
    if (!data.employerName) issues.push("Missing employer name");
    if (!data.grossPay) issues.push("Missing gross pay amount");
    if (!data.payDate) issues.push("Missing pay date");
  }

  if (parsed.type === "id") {
    const data = parsed.extractedData as Partial<IDData>;
    if (!data.firstName || !data.lastName) issues.push("Missing name");
    if (!data.dateOfBirth) issues.push("Missing date of birth");
    if (!data.idNumber) issues.push("Missing ID number");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};
