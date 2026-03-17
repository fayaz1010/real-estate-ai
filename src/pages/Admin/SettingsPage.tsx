import {
  Settings,
  Save,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import apiClient from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { UserRole } from "@/modules/auth/types/auth.types";

interface PlatformSettings {
  general: {
    platformName: string;
    supportEmail: string;
    timezone: string;
    currency: string;
    maintenanceMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    inspectionReminders: boolean;
    paymentReminders: boolean;
    leaseExpiryAlerts: boolean;
  };
  properties: {
    maxImagesPerProperty: number;
    requireVerification: boolean;
    autoPublish: boolean;
    defaultLeaseTerm: number;
    lateFeePercentage: number;
    lateFeeGraceDays: number;
  };
  security: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
  };
}

const DEFAULT_SETTINGS: PlatformSettings = {
  general: {
    platformName: "",
    supportEmail: "",
    timezone: "America/New_York",
    currency: "USD",
    maintenanceMode: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    inspectionReminders: true,
    paymentReminders: true,
    leaseExpiryAlerts: true,
  },
  properties: {
    maxImagesPerProperty: 20,
    requireVerification: true,
    autoPublish: false,
    defaultLeaseTerm: 12,
    lateFeePercentage: 5,
    lateFeeGraceDays: 5,
  },
  security: {
    requireTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
  },
};

type SettingsSection = "general" | "notifications" | "properties" | "security";

const SECTION_TABS: { key: SettingsSection; label: string }[] = [
  { key: "general", label: "General" },
  { key: "notifications", label: "Notifications" },
  { key: "properties", label: "Properties" },
  { key: "security", label: "Security" },
];

const SettingsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/admin/settings");
        const data = res.data as { data: PlatformSettings };
        setSettings(data.data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load settings";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await apiClient.put("/admin/settings", settings);
      setSuccess("Settings saved successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save settings";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const updateGeneral = (
    key: keyof PlatformSettings["general"],
    value: string | boolean,
  ) => {
    setSettings((s) => ({ ...s, general: { ...s.general, [key]: value } }));
  };

  const updateNotifications = (
    key: keyof PlatformSettings["notifications"],
    value: boolean,
  ) => {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [key]: value },
    }));
  };

  const updateProperties = (
    key: keyof PlatformSettings["properties"],
    value: number | boolean,
  ) => {
    setSettings((s) => ({
      ...s,
      properties: { ...s.properties, [key]: value },
    }));
  };

  const updateSecurity = (
    key: keyof PlatformSettings["security"],
    value: number | boolean,
  ) => {
    setSettings((s) => ({ ...s, security: { ...s.security, [key]: value } }));
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-text_primary">{label}</p>
        {description && (
          <p className="text-xs text-text_primary/50 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  if (
    !currentUser ||
    (currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== ("super_admin" as UserRole))
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-text_primary mb-2">
            Access Denied
          </h2>
          <p className="text-text_primary/60">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const renderSkeletonForm = () => (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`toggle-${i}`}
          className="flex items-center justify-between py-3"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Settings className="text-gray-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text_primary font-display">
                Platform Settings
              </h1>
              <p className="text-sm text-text_primary/60 font-body">
                Configure platform behavior and defaults
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-emerald-500 shrink-0" size={20} />
            <p className="text-sm text-emerald-700">{success}</p>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-primary/10 p-1">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === tab.key
                  ? "bg-primary text-white"
                  : "text-text_primary/60 hover:text-text_primary hover:bg-primary/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl border border-primary/10 p-6">
          {loading ? (
            renderSkeletonForm()
          ) : (
            <>
              {/* General Settings */}
              {activeSection === "general" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">
                      Platform Name
                    </label>
                    <Input
                      value={settings.general.platformName}
                      onChange={(e) =>
                        updateGeneral("platformName", e.target.value)
                      }
                      placeholder="RealEstate AI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">
                      Support Email
                    </label>
                    <Input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) =>
                        updateGeneral("supportEmail", e.target.value)
                      }
                      placeholder="support@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) =>
                          updateGeneral("timezone", e.target.value)
                        }
                        className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                      >
                        <option value="America/New_York">Eastern (ET)</option>
                        <option value="America/Chicago">Central (CT)</option>
                        <option value="America/Denver">Mountain (MT)</option>
                        <option value="America/Los_Angeles">
                          Pacific (PT)
                        </option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Currency
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) =>
                          updateGeneral("currency", e.target.value)
                        }
                        className="w-full h-10 rounded-md border border-primary/30 bg-background px-3 text-sm text-text_primary"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-primary/10 pt-4">
                    <ToggleSwitch
                      checked={settings.general.maintenanceMode}
                      onChange={(v) => updateGeneral("maintenanceMode", v)}
                      label="Maintenance Mode"
                      description="When enabled, non-admin users will see a maintenance page"
                    />
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === "notifications" && (
                <div className="divide-y divide-primary/5">
                  <ToggleSwitch
                    checked={settings.notifications.emailNotifications}
                    onChange={(v) =>
                      updateNotifications("emailNotifications", v)
                    }
                    label="Email Notifications"
                    description="Send email notifications for important events"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.smsNotifications}
                    onChange={(v) => updateNotifications("smsNotifications", v)}
                    label="SMS Notifications"
                    description="Send SMS alerts for urgent matters"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.pushNotifications}
                    onChange={(v) =>
                      updateNotifications("pushNotifications", v)
                    }
                    label="Push Notifications"
                    description="Enable browser push notifications"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.marketingEmails}
                    onChange={(v) => updateNotifications("marketingEmails", v)}
                    label="Marketing Emails"
                    description="Allow marketing and promotional emails"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.inspectionReminders}
                    onChange={(v) =>
                      updateNotifications("inspectionReminders", v)
                    }
                    label="Inspection Reminders"
                    description="Remind tenants and agents about upcoming inspections"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.paymentReminders}
                    onChange={(v) => updateNotifications("paymentReminders", v)}
                    label="Payment Reminders"
                    description="Send reminders before rent is due"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.leaseExpiryAlerts}
                    onChange={(v) =>
                      updateNotifications("leaseExpiryAlerts", v)
                    }
                    label="Lease Expiry Alerts"
                    description="Alert landlords and tenants when leases are expiring soon"
                  />
                </div>
              )}

              {/* Property Settings */}
              {activeSection === "properties" && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">
                      Max Images Per Property
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={settings.properties.maxImagesPerProperty}
                      onChange={(e) =>
                        updateProperties(
                          "maxImagesPerProperty",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Default Lease Term (months)
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={settings.properties.defaultLeaseTerm}
                        onChange={(e) =>
                          updateProperties(
                            "defaultLeaseTerm",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Late Fee Grace Days
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={settings.properties.lateFeeGraceDays}
                        onChange={(e) =>
                          updateProperties(
                            "lateFeeGraceDays",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">
                      Late Fee Percentage (%)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={settings.properties.lateFeePercentage}
                      onChange={(e) =>
                        updateProperties(
                          "lateFeePercentage",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="border-t border-primary/10 pt-4 space-y-0 divide-y divide-primary/5">
                    <ToggleSwitch
                      checked={settings.properties.requireVerification}
                      onChange={(v) =>
                        updateProperties("requireVerification", v)
                      }
                      label="Require Verification"
                      description="Properties must be verified by admin before going live"
                    />
                    <ToggleSwitch
                      checked={settings.properties.autoPublish}
                      onChange={(v) => updateProperties("autoPublish", v)}
                      label="Auto Publish"
                      description="Automatically publish properties after verification"
                    />
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === "security" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        min={5}
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          updateSecurity(
                            "sessionTimeout",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_primary mb-1">
                        Max Login Attempts
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) =>
                          updateSecurity(
                            "maxLoginAttempts",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text_primary mb-1">
                      Minimum Password Length
                    </label>
                    <Input
                      type="number"
                      min={6}
                      max={32}
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        updateSecurity(
                          "passwordMinLength",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="border-t border-primary/10 pt-4">
                    <ToggleSwitch
                      checked={settings.security.requireTwoFactor}
                      onChange={(v) => updateSecurity("requireTwoFactor", v)}
                      label="Require Two-Factor Authentication"
                      description="Force all users to enable 2FA on their accounts"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
