import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type SubjectOption =
  | ""
  | "General Inquiry"
  | "Sales"
  | "Support"
  | "Partnership"
  | "Enterprise";

interface FormData {
  name: string;
  email: string;
  subject: SubjectOption;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const subjectOptions: SubjectOption[] = [
  "General Inquiry",
  "Sales",
  "Support",
  "Partnership",
  "Enterprise",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@realestate-ai.com",
    href: "mailto:hello@realestate-ai.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "1-800-555-0199",
    href: "tel:+18005550199",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "100 Market Street, Suite 400\nSan Francisco, CA 94105",
    href: "https://maps.google.com/?q=100+Market+Street+San+Francisco+CA+94105",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday - Friday: 9:00 AM - 6:00 PM PST\nSaturday: 10:00 AM - 2:00 PM PST\nSunday: Closed",
    href: null,
  },
];

const faqs = [
  {
    question: "How quickly can I get started with RealEstate AI?",
    answer:
      "You can sign up and start managing your first property in under 15 minutes. Our onboarding wizard walks you through connecting your existing listings, setting up automated responses, and configuring your dashboard. No technical expertise required.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial with full access to all features, including AI-powered tenant screening, automated maintenance scheduling, and financial reporting. No credit card is required to start your trial.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support with a guaranteed 24-hour response time. Our Professional and Enterprise plans include priority live chat and phone support during business hours, plus a dedicated account manager for Enterprise customers.",
  },
  {
    question: "Can RealEstate AI integrate with my existing tools?",
    answer:
      "Absolutely. We integrate with popular accounting software like QuickBooks and Xero, listing platforms such as Zillow and Realtor.com, and communication tools like Slack and Microsoft Teams. Our open API also allows custom integrations for Enterprise clients.",
  },
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white" role="main">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-16 bg-realestate-primary overflow-hidden"
        aria-labelledby="contact-hero-heading"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 right-10 w-80 h-80 bg-realestate-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-realestate-secondary rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1
            id="contact-hero-heading"
            className="text-display text-white font-space-grotesk mb-4"
          >
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Have a question, want a demo, or ready to get started? We are here
            to help. Reach out and our team will respond within one business day.
          </p>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section className="py-20 bg-gray-50" aria-labelledby="contact-form-heading">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2
                id="contact-form-heading"
                className="text-heading text-realestate-primary font-space-grotesk mb-8"
              >
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div
                  className="card-elevated p-10 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                    <CheckCircle
                      className="w-8 h-8 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-realestate-primary font-space-grotesk mb-3">
                    Message Sent Successfully
                  </h3>
                  <p className="text-gray-600 font-inter mb-6 max-w-md mx-auto">
                    Thank you for reaching out. A member of our team will review
                    your message and get back to you within one business day.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="btn-primary px-6 py-2.5 text-sm font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="card-elevated p-6 md:p-8 space-y-6"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-realestate-primary font-inter mb-1.5"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl border font-inter text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-realestate-accent/40 ${
                        errors.name
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-realestate-accent"
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-1.5 text-sm text-red-500 font-inter flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-realestate-primary font-inter mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={`w-full px-4 py-3 rounded-xl border font-inter text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-realestate-accent/40 ${
                        errors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-realestate-accent"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1.5 text-sm text-red-500 font-inter flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-realestate-primary font-inter mb-1.5"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.subject}
                      aria-describedby={
                        errors.subject ? "subject-error" : undefined
                      }
                      className={`w-full px-4 py-3 rounded-xl border font-inter text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-realestate-accent/40 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] ${
                        errors.subject
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-realestate-accent"
                      } ${!formData.subject ? "text-gray-400" : "text-gray-900"}`}
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p
                        id="subject-error"
                        className="mt-1.5 text-sm text-red-500 font-inter flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-realestate-primary font-inter mb-1.5"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      className={`w-full px-4 py-3 rounded-xl border font-inter text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-realestate-accent/40 resize-vertical ${
                        errors.message
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-realestate-accent"
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="mt-1.5 text-sm text-red-500 font-inter flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar - Contact Information */}
            <aside aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-heading text-realestate-primary font-space-grotesk mb-8"
              >
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const IconComponent = item.icon;
                  const content = (
                    <div className="card p-5 flex items-start gap-4 hover:shadow-realestate-md transition-shadow duration-300">
                      <div className="flex-shrink-0 w-11 h-11 bg-realestate-accent/10 rounded-xl flex items-center justify-center">
                        <IconComponent
                          className="w-5 h-5 text-realestate-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-realestate-primary font-space-grotesk">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-600 font-inter whitespace-pre-line mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.label === "Address" ? "_blank" : undefined}
                      rel={
                        item.label === "Address"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block group"
                      aria-label={`${item.label}: ${item.value.replace(/\n/g, ", ")}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="mt-8 p-5 bg-realestate-primary rounded-2xl">
                <h3 className="text-white font-semibold font-space-grotesk mb-3">
                  Looking for Something Else?
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-realestate-accent font-inter text-sm transition-colors duration-200"
                    >
                      Learn more about us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/properties"
                      className="text-gray-300 hover:text-realestate-accent font-inter text-sm transition-colors duration-200"
                    >
                      Browse properties
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-gray-300 hover:text-realestate-accent font-inter text-sm transition-colors duration-200"
                    >
                      Create a free account
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-20 bg-white"
        aria-labelledby="faq-heading"
      >
        <div className="section-container max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-realestate-accent/10 text-realestate-accent font-semibold text-sm rounded-full mb-4 font-inter">
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="text-heading text-realestate-primary font-space-grotesk"
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4" role="list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="card overflow-hidden"
                  role="listitem"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors duration-200"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-base font-semibold text-realestate-primary font-space-grotesk pr-4">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp
                        className="w-5 h-5 text-realestate-accent flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="px-5 pb-5 text-gray-600 font-inter leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
