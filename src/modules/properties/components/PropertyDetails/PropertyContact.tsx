// FILE PATH: src/modules/properties/components/PropertyDetails/PropertyContact.tsx
// Module 1.2: Property Listings Management - Property Contact Component

import { Mail, Phone, MessageSquare, Home, Check, X } from "lucide-react";
import React, { useState } from "react";

import { Property, AgentInfo } from "../../types/property.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface PropertyContactProps {
  property: Property;
}

export const PropertyContact: React.FC<PropertyContactProps> = ({
  property,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in ${property.title}. Please contact me with more information.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"contact" | "schedule">("contact");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Mock agent data - in a real app, this would come from the property or API
  const agent = {
    id: property.agentInfo?.id || "1",
    name: property.agentInfo?.name || "Alex Johnson",
    phone: property.agentInfo?.phone || "(555) 123-4567",
    email: property.agentInfo?.email || "alex.johnson@premierrealty.com",
    avatar:
      property.agentInfo?.avatar ||
      "https://randomuser.me/api/portraits/men/42.jpg",
    licenseNumber: property.agentInfo?.licenseNumber || "LIC12345678",
    brokerageName: property.agentInfo?.brokerageName || "Premier Realty",
    rating: 4.8,
    reviewsCount: 127,
    responseTime: "Within 1 hour",
    activeListings: 12,
    // Additional properties for UI
    role: property.agentInfo?.brokerageName
      ? "Broker"
      : "Licensed Real Estate Agent",
    company: property.agentInfo?.brokerageName || "Premier Realty",
    yearsExperience: 8,
    propertiesListed: 243,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }) as FormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Hi, I'm interested in ${property.title}. Please contact me with more information.`,
        });
      }, 3000);
    }, 1000);
  };

  const handleScheduleTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Tour scheduled:", {
        ...formData,
        tourDate: selectedDate,
        tourTime: selectedTime,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after submission
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedDate("");
        setSelectedTime("");
      }, 3000);
    }, 1000);
  };

  // Generate time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ];

  // Generate next 7 days for scheduling
  const today = new Date();
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    return date;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Agent/Broker Info */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b">
        <div className="flex-shrink-0">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
          <p className="text-gray-600">
            {agent.licenseNumber ? "Licensed Agent" : agent.role}
          </p>
          <p className="text-sm text-gray-500">
            {agent.brokerageName || agent.company}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(agent.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">
                {agent.rating} ({agent.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <Check className="w-3 h-3 mr-1 text-green-500" />
              {agent.yearsExperience}+ years experience
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Home className="w-3 h-3 mr-1 text-blue-500" />
              {agent.propertiesListed}+ properties listed
            </Badge>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
          <a
            href={`tel:${agent.phone}`}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            title="Call Agent"
          >
            <Phone size={18} />
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
            title="Email Agent"
          >
            <Mail size={18} />
          </a>
          <button
            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            title="Message Agent"
            onClick={() => setActiveTab("contact")}
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("contact")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "contact"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Contact Agent
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "schedule"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Schedule a Tour
          </button>
        </nav>
      </div>

      {/* Contact Form */}
      {activeTab === "contact" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSubmitted ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-medium">Message Sent!</p>
                <p className="text-sm">We&apos;ll get back to you soon.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[120px]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </>
          )}
        </form>
      ) : (
        /* Schedule Tour Form */
        <form onSubmit={handleScheduleTour} className="space-y-4">
          {isSubmitted ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-medium">Tour Scheduled!</p>
                <p className="text-sm">
                  We&apos;ll confirm your appointment shortly.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tour-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="tour-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tour-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="tour-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tour-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="tour-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableDates.map((date, index) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const dayName = date.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const dayNum = date.getDate();
                    const month = date.toLocaleDateString("en-US", {
                      month: "short",
                    });

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3 text-center rounded-lg border ${
                          selectedDate === dateStr
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-sm font-medium">{dayName}</div>
                        <div className="text-lg font-bold">{dayNum}</div>
                        <div className="text-xs text-gray-500">{month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 text-sm rounded-lg border ${
                          selectedTime === time
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Tour"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By scheduling a tour, you agree to our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </>
          )}
        </form>
      )}

      {/* Office Hours */}
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Office Hours</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Monday - Friday</span>
            <span className="font-medium">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span>Saturday</span>
            <span className="font-medium">10:00 AM - 4:00 PM</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Sunday</span>
            <span className="font-medium">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyContact;
