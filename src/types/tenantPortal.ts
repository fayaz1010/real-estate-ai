export interface UnitInfo {
  address: string;
  rent: number;
  leaseEndDate: Date;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

export interface PaymentDue {
  amount: number;
  dueDate: Date;
  description: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "completed";
  urgency: "Low" | "Medium" | "High";
  photoUrls?: string[];
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  author: string;
  date: Date;
  content: string;
}

export interface TenantHome {
  unitInfo: UnitInfo;
  upcomingPayment: PaymentDue;
  activeRequest: MaintenanceRequest | null;
  communityPosts: CommunityPost[];
}

export interface PaymentHistoryItem {
  id?: string;
  date: Date;
  amount: number;
  description: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Failed";
  receiptUrl?: string;
}

export interface UpcomingPayment {
  dueDate: Date;
  amount: number;
  paymentMethod: string;
}

export interface LeaseDetails {
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  securityDeposit: number;
  petPolicy: string;
  otherTerms: string;
  documentUrl: string;
  address: string;
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;
}

export interface TenantProfileDetails {
  name: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}
