import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  dateString: string,
  includeTime: boolean = false,
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function calculateMortgage(
  principal: number,
  years: number = 30,
  rate: number = 0.04,
): number {
  const monthlyRate = rate / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getPricePerSqft(price: number, sqft: number): number {
  return sqft > 0 ? Math.round(price / sqft) : 0;
}

export function getBedBathText(bedrooms: number, bathrooms: number): string {
  return `${bedrooms} bed${bedrooms !== 1 ? "s" : ""} • ${bathrooms} bath${bathrooms !== 1 ? "s" : ""}`;
}

export function getPropertyStatusBadgeVariant(status: string): string {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "sold":
    case "rented":
      return "bg-gray-100 text-gray-800";
    case "new":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getShareableLink(propertyId: string): string {
  return `${window.location.origin}/properties/${propertyId}`;
}
