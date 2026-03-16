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
  status: 'open' | 'in progress' | 'completed';
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
  date: Date;
  amount: number;
  description: string;
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
}

export interface TenantProfileDetails {
  name: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}
