import { SetupGuide } from "../types/onboarding";

export const setupGuides: SetupGuide[] = [
  {
    slug: "verify-email",
    title: "Verify Your Email Address",
    category: "account",
    content: `# Verify Your Email Address

Confirming your email address is the first step to securing your account and unlocking all platform features.

## Steps

1. **Check your inbox** for an email from RealEstateAI with the subject line "Verify your email address."
2. **Click the verification link** in the email. The link will redirect you to the platform and confirm your email.
3. **Didn't receive it?** Click the "Resend verification email" button on your dashboard. Be sure to check your spam or junk folder.

## Why This Matters

- Ensures you receive important notifications about your properties, tenants, and payments.
- Required for account recovery if you ever lose access.
- Unlocks full platform functionality including messaging and document signing.

## Troubleshooting

- **Link expired?** Verification links expire after 24 hours. Request a new one from your account settings.
- **Wrong email?** Update your email address in Settings > Account before requesting a new link.
`,
  },
  {
    slug: "setup-two-factor",
    title: "Set Up Two-Factor Authentication",
    category: "account",
    content: `# Set Up Two-Factor Authentication

Two-factor authentication (2FA) adds a critical layer of security to your account by requiring a second form of verification when you log in.

## Steps

1. Navigate to **Settings > Security**.
2. Click **Enable Two-Factor Authentication**.
3. Choose your preferred method:
   - **Authenticator app** (recommended): Scan the QR code with Google Authenticator, Authy, or a similar app.
   - **SMS verification**: Enter your phone number to receive codes via text message.
4. Enter the verification code to confirm setup.
5. **Save your backup codes** in a secure location. These are single-use codes you can use if you lose access to your 2FA device.

## Why This Matters

- Protects your account even if your password is compromised.
- Required for Professional and Business tier accounts.
- Safeguards sensitive financial and tenant data.

## Tips

- Use an authenticator app instead of SMS for better security.
- Store backup codes in a password manager, not as a screenshot.
`,
  },
  {
    slug: "add-first-property",
    title: "Add Your First Property",
    category: "properties",
    content: `# Add Your First Property

Getting your first property listed is the foundation for managing your real estate portfolio on our platform.

## Steps

1. From your dashboard, click **Properties > Add Property**.
2. Fill in the property details:
   - **Address**: Full street address, city, state, and zip code.
   - **Property type**: Apartment, house, condo, townhouse, or commercial.
   - **Bedrooms and bathrooms**: Number of each.
   - **Square footage**: Total living area.
   - **Rent amount**: Monthly rent in your local currency.
3. **Upload photos**: Add at least 3 high-quality photos. Include exterior, kitchen, living area, and bathrooms.
4. **Set amenities**: Check all that apply (parking, pool, gym, pet-friendly, etc.).
5. **Review and publish** your listing.

## Tips for a Great Listing

- Use natural lighting for photos.
- Write a detailed description highlighting unique features.
- Set competitive rent by checking comparable listings in your area.
- Keep your listing updated with current availability.

## What Happens Next

Once published, your property appears in search results and is ready to receive applications from prospective tenants.
`,
  },
  {
    slug: "setup-rent-collection",
    title: "Set Up Rent Collection",
    category: "properties",
    content: `# Set Up Rent Collection

Automate your rent collection to ensure timely payments and reduce administrative work.

## Steps

1. Navigate to **Properties > Select a Property > Rent Settings**.
2. Set the **rent amount** and **due date** (e.g., 1st of each month).
3. Configure **late fee policies**:
   - Grace period (e.g., 5 days).
   - Late fee amount (flat fee or percentage).
4. Enable **auto-pay**: Allow tenants to set up recurring payments.
5. Set up **payment methods**: ACH bank transfer, credit/debit card, or both.

## Notifications

The system automatically sends:
- **Rent due reminders** 3 days before the due date.
- **Payment confirmations** when rent is received.
- **Late payment alerts** when rent is overdue.

## Tracking Payments

View all payment history under **Billing > Payment History**. Export reports for tax preparation and accounting.
`,
  },
  {
    slug: "invite-tenants",
    title: "Invite Your Tenants to the Portal",
    category: "tenants",
    content: `# Invite Your Tenants to the Portal

Give your tenants access to their own portal where they can pay rent, submit maintenance requests, and communicate with you.

## Steps

1. Go to **Tenants > Invite Tenant**.
2. Enter the tenant's **name** and **email address**.
3. Assign them to a **property and unit**.
4. Set their **lease start and end dates**.
5. Click **Send Invitation**.

The tenant will receive an email with instructions to create their account and access the portal.

## Bulk Invitations

For multiple tenants:
1. Go to **Tenants > Bulk Import**.
2. Download the **CSV template**.
3. Fill in tenant details and upload the file.
4. Review and confirm the import.

## What Tenants Can Do

- Pay rent online and view payment history.
- Submit and track maintenance requests.
- Access lease documents and important notices.
- Update their contact information.
`,
  },
  {
    slug: "setup-tenant-screening",
    title: "Set Up Tenant Screening",
    category: "tenants",
    content: `# Set Up Tenant Screening

Tenant screening helps you make informed decisions by providing background checks, credit reports, and rental history verification.

## Steps

1. Navigate to **Settings > Screening**.
2. Choose your **screening package**:
   - **Basic**: Credit check and eviction history.
   - **Standard**: Credit, criminal background, and eviction history.
   - **Comprehensive**: All of the above plus income verification and rental references.
3. Set your **minimum criteria** (optional):
   - Minimum credit score.
   - Maximum debt-to-income ratio.
   - No eviction history.
4. Enable **automatic screening** for new applications, or screen manually per application.

## How It Works

1. A prospective tenant submits an application.
2. They authorize the screening through a secure consent form.
3. Results are delivered to your dashboard within minutes.
4. Review the AI-powered risk assessment alongside the raw data.

## Privacy and Compliance

All screening is conducted in compliance with the Fair Credit Reporting Act (FCRA) and local regulations. Tenant data is encrypted and never shared without consent.
`,
  },
  {
    slug: "connect-bank-account",
    title: "Connect Your Bank Account",
    category: "billing",
    content: `# Connect Your Bank Account

Link your bank account to receive rent payments, process refunds, and manage your property finances all in one place.

## Steps

1. Go to **Settings > Billing > Bank Accounts**.
2. Click **Add Bank Account**.
3. Choose your connection method:
   - **Instant verification** (recommended): Log in to your bank through our secure partner (Plaid) to verify instantly.
   - **Manual verification**: Enter your routing and account numbers. Two micro-deposits will be sent within 1-2 business days for confirmation.
4. Once verified, set the account as your **default payout account**.

## Security

- Bank connections use 256-bit encryption.
- We never store your bank login credentials.
- All transfers are processed through PCI-compliant payment processors.

## Payout Schedule

- Standard payouts arrive in 2-3 business days.
- Professional and Business tier accounts can enable next-day payouts.
`,
  },
  {
    slug: "setup-payment-reminders",
    title: "Set Up Payment Reminders",
    category: "billing",
    content: `# Set Up Payment Reminders

Automated payment reminders help ensure on-time rent payments and reduce the need for manual follow-ups.

## Steps

1. Navigate to **Settings > Notifications > Payment Reminders**.
2. Configure your reminder schedule:
   - **Pre-due reminders**: 7 days, 3 days, and 1 day before rent is due.
   - **Due day reminder**: On the day rent is due.
   - **Overdue reminders**: 1 day, 3 days, and 7 days after the due date.
3. Customize the **message template** for each reminder type.
4. Choose delivery channels: **email**, **SMS**, or both.
5. Click **Save** to activate.

## Customization

- Adjust the tone and content of reminder messages.
- Add your property name and contact details to templates.
- Set different schedules for different properties if needed.

## Best Practices

- Keep reminder messages professional and friendly.
- Include payment links in every reminder for easy access.
- Review reminder effectiveness in your analytics dashboard.
`,
  },
  {
    slug: "connect-google-calendar",
    title: "Connect Your Google Calendar",
    category: "integrations",
    content: `# Connect Your Google Calendar

Sync your RealEstateAI events with Google Calendar to keep all your property management activities in one place.

## Steps

1. Go to **Settings > Integrations > Google Calendar**.
2. Click **Connect Google Calendar**.
3. Sign in to your Google account and grant calendar access.
4. Choose which events to sync:
   - **Property inspections**
   - **Lease renewals and expirations**
   - **Maintenance appointments**
   - **Payment due dates**
   - **Tenant move-in/move-out dates**
5. Select the calendar to sync with (or create a new dedicated calendar).
6. Click **Save** to start syncing.

## How It Works

- New events created in RealEstateAI automatically appear in your Google Calendar.
- Changes to synced events update in both directions.
- Color-coded events help you distinguish between event types.

## Tips

- Create a dedicated "Property Management" calendar in Google for cleaner organization.
- Enable notifications in Google Calendar for timely reminders on your phone.
`,
  },
  {
    slug: "connect-stripe",
    title: "Connect Your Stripe Account",
    category: "integrations",
    content: `# Connect Your Stripe Account

Stripe integration enables secure online payment processing for rent collection, deposits, and fees.

## Steps

1. Navigate to **Settings > Integrations > Stripe**.
2. Click **Connect with Stripe**.
3. If you already have a Stripe account, log in. Otherwise, create one during the setup process.
4. Complete the Stripe onboarding:
   - Verify your business information.
   - Add your bank account for payouts.
   - Confirm your identity.
5. Once connected, Stripe will be available as a payment method for your tenants.

## Supported Payment Methods

Through Stripe, your tenants can pay with:
- Credit and debit cards (Visa, Mastercard, Amex).
- ACH bank transfers.
- Apple Pay and Google Pay.

## Fees

- Standard processing fees apply (typically 2.9% + 30 cents per card transaction).
- ACH transfers have lower fees (typically 0.8% capped at $5).
- You can choose to absorb fees or pass them to tenants.

## Dashboard

Access your Stripe dashboard directly from **Billing > Stripe Dashboard** to view detailed transaction reports, manage disputes, and track payouts.
`,
  },
];
