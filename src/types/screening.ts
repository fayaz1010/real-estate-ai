export interface ScreeningRequest {
  id: string;
  tenantName: string;
  email: string;
  phone: string;
  propertyId: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  creditScore?: number;
  backgroundCheck?: boolean;
  evictionHistory?: boolean;
  employmentVerification?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
