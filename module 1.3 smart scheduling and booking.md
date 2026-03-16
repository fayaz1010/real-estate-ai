Module 1.3: Inspection Booking & Scheduling System - Complete Architecture Plan
Strategic Positioning: Beyond Zillow & Realtor.com
Market Gap Analysis:

Zillow/Realtor.com: Basic "Request Tour" forms with manual scheduling
Apartments.com: Simple contact forms, no real-time availability
Our Advantage: Full calendar integration, instant booking, virtual tours, automated reminders, check-in/out system


Module Overview
This module bridges the gap between property browsing and tenant applications. It's the critical touchpoint where interest converts to action.
Core Objectives

Seamless booking experience (3 clicks maximum)
Real-time availability with intelligent scheduling
Multiple inspection types (in-person, virtual, open house)
Automated communication (confirmations, reminders, follow-ups)
No-show prevention and rescheduling flexibility
Post-inspection feedback collection
Integration with calendar systems (Google, Outlook)


Directory Structure
src/modules/inspections/
├── types/
│   └── inspection.types.ts          # Type definitions
├── utils/
│   ├── timeSlotGenerator.ts         # Available time slot calculation
│   ├── calendarSync.ts              # Calendar integration helpers
│   ├── timezoneHandler.ts           # Timezone conversions
│   └── inspectionValidation.ts      # Validation rules
├── services/
│   ├── inspectionService.ts         # Inspection CRUD API
│   ├── availabilityService.ts       # Availability management
│   └── notificationService.ts       # Reminder/notification API
├── store/
│   ├── inspectionSlice.ts           # State management
│   └── availabilitySlice.ts         # Availability state
├── hooks/
│   ├── useInspections.ts            # Inspection operations
│   ├── useAvailability.ts           # Availability management
│   ├── useInspectionBooking.ts      # Booking workflow
│   └── useInspectionCalendar.ts     # Calendar integration
├── components/
│   ├── InspectionBooking/
│   │   ├── BookingWizard.tsx            # Multi-step booking
│   │   ├── PropertySelection.tsx        # Select property
│   │   ├── InspectionTypeSelector.tsx   # In-person/virtual/open house
│   │   ├── DateTimeSelector.tsx         # Calendar picker
│   │   ├── TimeSlotGrid.tsx             # Available time slots
│   │   ├── AttendeeForm.tsx             # Attendee details
│   │   ├── BookingConfirmation.tsx      # Success screen
│   │   └── BookingSummary.tsx           # Review before confirm
│   ├── InspectionCalendar/
│   │   ├── CalendarView.tsx             # Full calendar view
│   │   ├── DayView.tsx                  # Single day schedule
│   │   ├── WeekView.tsx                 # Week overview
│   │   ├── MonthView.tsx                # Month overview
│   │   └── TimeSlot.tsx                 # Individual slot component
│   ├── InspectionManagement/
│   │   ├── InspectionsList.tsx          # List of inspections
│   │   ├── InspectionCard.tsx           # Single inspection card
│   │   ├── InspectionDetails.tsx        # Detailed view
│   │   ├── InspectionStatus.tsx         # Status indicator
│   │   ├── RescheduleModal.tsx          # Reschedule dialog
│   │   ├── CancelModal.tsx              # Cancellation dialog
│   │   └── CheckInOut.tsx               # Check-in/out interface
│   ├── VirtualTour/
│   │   ├── VirtualTourLauncher.tsx      # Virtual tour interface
│   │   ├── VideoCallIntegration.tsx     # Video call (Zoom/Meet)
│   │   └── ScreenShareControls.tsx      # Host controls
│   ├── Availability/
│   │   ├── AvailabilityManager.tsx      # Set availability
│   │   ├── RecurringSchedule.tsx        # Recurring time slots
│   │   ├── BlackoutDates.tsx            # Blocked dates
│   │   └── BufferTimeSettings.tsx       # Buffer between bookings
│   ├── Notifications/
│   │   ├── InspectionReminders.tsx      # Reminder settings
│   │   ├── ReminderSettings.tsx         # Configure reminders
│   │   └── NotificationPreview.tsx      # Preview messages
│   └── Analytics/
│       ├── InspectionMetrics.tsx        # Booking analytics
│       ├── NoShowTracker.tsx            # No-show statistics
│       └── ConversionRate.tsx           # Inspection → Application rate

Type Definitions
typescript// Inspection Types
type InspectionType = 'in_person' | 'virtual' | 'open_house' | 'self_guided';

type InspectionStatus = 
  | 'pending'       // Awaiting approval
  | 'confirmed'     // Confirmed by landlord
  | 'checked_in'    // Tenant arrived
  | 'completed'     // Tour finished
  | 'cancelled'     // Cancelled by either party
  | 'no_show'       // Tenant didn't show up
  | 'rescheduled';  // Moved to new time

interface Inspection {
  id: string;
  propertyId: string;
  property?: Property; // Populated property details
  
  // Participants
  tenantId: string;
  tenant?: User;
  landlordId: string;
  landlord?: User;
  agentId?: string;
  agent?: User;
  
  // Scheduling
  type: InspectionType;
  scheduledDate: string; // ISO datetime
  duration: number; // minutes
  timezone: string;
  
  // Attendees (for group tours)
  attendees: InspectionAttendee[];
  maxAttendees?: number; // For open houses
  
  // Status & Tracking
  status: InspectionStatus;
  requestedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: 'tenant' | 'landlord' | 'system';
  
  // Reminders
  remindersSent: {
    type: '24h' | '2h' | '30m';
    sentAt: string;
  }[];
  
  // Virtual tour specific
  virtualMeetingUrl?: string;
  virtualMeetingId?: string;
  recordingUrl?: string;
  
  // Notes & Feedback
  landlordNotes?: string;
  tenantNotes?: string;
  tenantFeedback?: InspectionFeedback;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

interface InspectionAttendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: 'applicant' | 'co_applicant' | 'roommate' | 'family' | 'friend';
}

interface InspectionFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  likedFeatures: string[];
  concerns: string[];
  interestedInApplying: boolean;
  submittedAt: string;
}

// Availability Types
interface AvailabilitySlot {
  id: string;
  propertyId: string;
  landlordId: string;
  
  // Time slot
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
  
  // Capacity
  maxBookings: number; // For group tours
  currentBookings: number;
  
  // Slot type
  isRecurring: boolean;
  recurringRuleId?: string;
  
  // Status
  isAvailable: boolean;
  isBlocked: boolean;
  blockReason?: string;
  
  createdAt: string;
}

interface RecurringSchedule {
  id: string;
  propertyId: string;
  landlordId: string;
  
  // Recurrence pattern
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number; // minutes
  bufferTime: number; // minutes between bookings
  
  // Date range
  startDate: string;
  endDate?: string; // null = ongoing
  
  // Exceptions
  excludedDates: string[]; // Specific dates to skip
  
  isActive: boolean;
  createdAt: string;
}

interface BlackoutDate {
  id: string;
  propertyId: string;
  landlordId: string;
  
  startDate: string;
  endDate: string;
  reason: string;
  
  createdAt: string;
}

// Booking Request
interface InspectionBookingRequest {
  propertyId: string;
  type: InspectionType;
  preferredDate: string;
  preferredTimeSlot: string;
  attendees: Omit<InspectionAttendee, 'id'>[];
  tenantNotes?: string;
  requiresApproval?: boolean; // Instant booking vs approval needed
}

Key Features & Competitive Advantages
1. Smart Scheduling Engine
Problem: Zillow/Realtor use manual back-and-forth scheduling
Our Solution:

AI-powered optimal time slot suggestions
Auto-detect tenant timezone
Intelligent buffer time management
Conflict
RetryMFpls continueEditModule 1.3: Inspection Booking & Scheduling System - Architecture Plan (Continued)

Key Features & Competitive Advantages (Continued)
1. Smart Scheduling Engine
Problem: Zillow/Realtor use manual back-and-forth scheduling
Our Solution:

AI-powered optimal time slot suggestions based on property type, location, tenant history
Auto-detect tenant timezone for multi-location searches
Intelligent buffer time management (travel time between properties for agents)
Conflict detection with existing bookings
Dynamic slot generation based on demand patterns
Weather-aware scheduling (outdoor property features)

2. Instant Booking vs Approval-Based
Zillow: Everything requires landlord approval (slow)
Our Platform:

Landlords toggle "Instant Booking" for pre-approved time slots
Approval-based for outside business hours or special requests
Auto-decline after 24hrs if landlord doesn't respond
Priority booking for verified tenants with complete profiles

3. Multiple Inspection Types
A. In-Person Tours

GPS-based check-in when tenant arrives
Digital check-in form with photo ID verification
Automated door code/lockbox access for self-guided
Safety features: Share tour details with emergency contact
Late arrival notifications
Post-tour property condition check

B. Virtual Tours (Live)

Integrated video calls (Zoom/Google Meet/Microsoft Teams)
Screen sharing for floor plans/documents
Recording option (with consent)
Interactive 3D model navigation during call
Chat for questions during tour
Virtual background removal for landlord privacy

C. Open Houses

Multiple time slots per day
Group capacity management (max attendees per slot)
Digital sign-in sheet with QR codes
Automated waitlist if slots fill up
Mass email/SMS to all attendees with updates
Social distancing time buffers

D. Self-Guided Tours

Smart lock integration (August, Yale, Schlage)
Temporary access codes via SMS
Time-limited entry (valid only during booked slot)
Property walk-through checklist in app
Panic button for emergencies
Automated lights/thermostat control

4. No-Show Prevention System 🌟 DIFFERENTIATOR
Industry Problem: 30-40% no-show rate wastes landlord time
Our Solution:

Deposit Hold: Refundable $25 hold (released after attendance)
Progressive Reminders:

24 hours before: Email + SMS + Push
2 hours before: SMS + Push
30 minutes before: Final SMS with directions
On-time: "Are you on your way?" if not checked in


Reputation System: Track no-show history, require deposit for repeat offenders
Easy Rescheduling: One-click reschedule up to 2 hours before
Incentives: Discount on application fee if on-time for inspection

5. Advanced Calendar Management
For Landlords/Agents:

Multi-Property Dashboard: See all bookings across portfolio
Recurring Availability: "Every weekday 2-6pm" auto-generates slots
Blackout Dates: Block holidays, maintenance days, personal time
Buffer Time Settings: 15-30 min breaks between tours
Travel Time Calculation: Auto-add drive time between properties
Sync with Personal Calendar: 2-way sync with Google/Outlook/Apple
Team Scheduling: Property managers assign tours to agents
Bulk Operations: Apply schedules to multiple properties

For Tenants:

My Inspections Dashboard: Upcoming, past, cancelled
Add to Calendar: One-click export to Google/Apple/Outlook
Directions Integration: Google Maps/Waze navigation
Reminders Control: Customize notification preferences
Companion Invites: Send calendar invite to co-viewers

6. Check-In/Check-Out System 🌟 DIFFERENTIATOR
Zillow doesn't have this - it's pure gold
Check-In Process:

Tenant arrives at property (GPS detected)
App prompts: "You're near [Property]. Check in now?"
Snap photo of property exterior (timestamp + GPS metadata)
Answer: "Condition matches listing photos?" (Yes/No/Report issues)
Landlord gets real-time notification: "John Doe checked in"
Unlock access code or meet landlord

During Tour:

In-app timer showing remaining time
Ability to request extension (5-10 min)
Emergency contact button (speed dial landlord/property manager)
Take notes/photos for personal reference

Check-Out Process:

"Tour complete? Check out now"
Quick feedback form (3 questions, 30 seconds max):

How was the property? (1-5 stars)
Matched listing description? (Yes/No)
Interested in applying? (Yes/Maybe/No)


Thank you message + "Apply Now" CTA if interested
Landlord notified of check-out

Benefits:

Accountability for both parties
Reduces property damage claims
Data for landlords (actual vs scheduled duration)
Conversion tracking (tour → application rate)

7. Post-Inspection Engagement 🌟 DIFFERENTIATOR
Immediate Follow-Up (Within 5 minutes of check-out):
For Tenant:
"Thanks for viewing [Property]! 
🏠 Ready to apply? Start your application now and skip the waitlist.
💾 Not sure yet? Save to favorites and we'll notify you of price changes.
🔍 Want to see similar properties? Here are 3 matches..."
For Landlord:
"John Doe completed the tour!
⭐ Property Rating: 4.5/5
📝 Feedback: 'Loved the kitchen, concerned about parking'
✅ Interested in applying: Yes
🎯 Quick Actions:
   - Send application link
   - Schedule follow-up call
   - View tenant's saved properties"
24-Hour Follow-Up:

If interested but didn't apply: "Still thinking about [Property]? Here's what you need to know about the application process..."
If not interested: "What didn't work for you?" Survey for landlord insights

7-Day Follow-Up:

If no application: "This property may not be available much longer. [X] people have viewed it this week."

8. Inspection Analytics Dashboard 🌟 DIFFERENTIATOR
For Landlords:

Booking Metrics:

Total inspection requests
Conversion rate (request → confirmed → completed)
No-show rate
Average time to book after listing published
Peak booking days/times


Property Performance:

Inspection-to-application conversion %
Average property rating from viewers
Common concerns mentioned in feedback
Comparison vs similar properties


Tenant Insights:

Who's viewing your properties
Viewing patterns (time spent, questions asked)
Profile completeness of viewers
Follow-up action rates



For Tenants:

Properties viewed
Upcoming tours
Tour history with notes
Favorite properties from tours
Application status for viewed properties

9. Communication Features
Pre-Inspection:

Automated Confirmation Email/SMS:

  ✅ Inspection Confirmed!
  
  Property: 123 Main St, Apt 2B
  Date: Friday, Oct 15, 2025
  Time: 2:00 PM - 2:30 PM
  Type: In-Person Tour
  
  📍 Directions: [Map Link]
  📞 Contact: Jane Doe - (555) 123-4567
  ⏰ Add to Calendar: [Link]
  
  What to bring:
  • Valid photo ID
  • List of questions
  • Camera/phone for photos (with permission)
  
  Need to reschedule? [Link]

Pre-Inspection Checklist (24hrs before):

View property listing again
Prepare questions
Check traffic/parking info
Weather forecast
Confirm attendance (Yes/No)



During Inspection:

In-App Chat: Quick questions without phone calls
Note Taking: Jot down observations
Photo Tagging: Attach photos to specific rooms
Voice Memos: Record thoughts immediately

Post-Inspection:

Thank You Messages: Auto-sent after check-out
Follow-Up Questions: Direct messaging channel for 48 hours
Document Sharing: Landlord can share HOA docs, utility info, etc.

10. Smart Features
A. Intelligent Recommendations

"Based on your tour of Property A, you might like Property B (similar size, better price)"
"You viewed 3 properties in [Neighborhood]. Here are 5 more in your budget."

B. Route Optimization

Planning multiple tours in one day? App suggests optimal route
"You have 3 tours today. Here's the best order to minimize drive time."

C. Weather Integration

"Rain expected during your outdoor property tour. Reschedule or bring umbrella?"
Auto-suggest indoor-focused tours during bad weather

D. Predictive Availability

AI learns booking patterns: "Weekends fill up fast for this property. Book now!"
"This landlord typically responds within 2 hours"


Technical Implementation Details
Real-Time Sync Architecture
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     WebSocket      ┌──────────────┐
│  API Layer  │ ◄─────────────────► │ Notification │
│   (Node.js) │                     │   Service    │
└──────┬──────┘                     └──────────────┘
       │
       ▼
┌─────────────┐
│  Database   │
│ (PostgreSQL)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Redis     │ ◄── Cache availability slots
│   (Cache)   │     for instant lookup
└─────────────┘
Key Algorithms
1. Time Slot Generation Algorithm
typescriptfunction generateAvailableSlots(params: {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  recurringSchedule: RecurringSchedule;
  existingBookings: Inspection[];
  blackoutDates: BlackoutDate[];
  bufferTime: number;
}): AvailabilitySlot[] {
  // 1. Generate raw slots from recurring schedule
  // 2. Remove blackout dates
  // 3. Remove already booked slots
  // 4. Add buffer time between bookings
  // 5. Check minimum advance notice (e.g., 2 hours)
  // 6. Return available slots
}
2. No-Show Prediction Algorithm
typescriptfunction calculateNoShowRisk(tenant: User, inspection: Inspection): {
  risk: 'low' | 'medium' | 'high';
  requireDeposit: boolean;
} {
  // Factors:
  // - Past no-show history
  // - Profile completeness
  // - Verification status
  // - Advance booking time (last-minute = higher risk)
  // - Response time to reminders
  // - Multiple bookings on same day
}
3. Optimal Inspection Time Suggestion
typescriptfunction suggestOptimalTimes(params: {
  propertyId: string;
  tenantId: string;
  preferredDates: Date[];
}): TimeSlot[] {
  // Consider:
  // - Tenant's timezone
  // - Historical conversion data (which times lead to applications)
  // - Property availability
  // - Weather forecast
  // - Traffic patterns
  // - Tenant's past booking preferences
}

API Endpoints Required
Inspection Endpoints
POST   /api/inspections/request
Body: InspectionBookingRequest
Returns: Inspection (pending status)

GET    /api/inspections
Query: ?status=confirmed&propertyId=xxx&tenantId=xxx
Returns: Inspection[]

GET    /api/inspections/:id
Returns: Inspection

PATCH  /api/inspections/:id
Body: Partial<Inspection>
Returns: Inspection

POST   /api/inspections/:id/confirm
Returns: Inspection (confirmed status)

POST   /api/inspections/:id/reschedule
Body: { newDate: string, newTime: string }
Returns: Inspection

POST   /api/inspections/:id/cancel
Body: { reason: string }
Returns: Inspection

POST   /api/inspections/:id/check-in
Body: { location: {lat, lng}, photo?: string }
Returns: Inspection

POST   /api/inspections/:id/check-out
Body: { feedback: InspectionFeedback }
Returns: Inspection

POST   /api/inspections/:id/feedback
Body: InspectionFeedback
Returns: Inspection

GET    /api/inspections/:id/access-code
Returns: { code: string, expiresAt: string }
Availability Endpoints
GET    /api/availability/slots
Query: ?propertyId=xxx&startDate=2025-10-01&endDate=2025-10-31
Returns: AvailabilitySlot[]

POST   /api/availability/recurring
Body: RecurringSchedule
Returns: RecurringSchedule

GET    /api/availability/recurring
Query: ?propertyId=xxx
Returns: RecurringSchedule[]

PATCH  /api/availability/recurring/:id
Body: Partial<RecurringSchedule>
Returns: RecurringSchedule

DELETE /api/availability/recurring/:id
Returns: { success: true }

POST   /api/availability/blackout
Body: BlackoutDate
Returns: BlackoutDate

GET    /api/availability/blackout
Query: ?propertyId=xxx
Returns: BlackoutDate[]

DELETE /api/availability/blackout/:id
Returns: { success: true }
Notification Endpoints
POST   /api/inspections/:id/reminders/send
Body: { type: '24h' | '2h' | '30m' }
Returns: { success: true }

PATCH  /api/inspections/:id/reminders/settings
Body: { email: boolean, sms: boolean, push: boolean }
Returns: { success: true }
Analytics Endpoints
GET    /api/inspections/analytics/landlord
Query: ?landlordId=xxx&startDate=xxx&endDate=xxx
Returns: {
  totalInspections: number,
  conversionRate: number,
  noShowRate: number,
  averageRating: number,
  peakBookingTimes: {day: string, hour: number}[]
}

GET    /api/inspections/analytics/property/:propertyId
Returns: {
  totalViews: number,
  inspectionToApplication: number,
  averageFeedbackRating: number,
  commonConcerns: string[]
}

Database Schema
sql-- Inspections table
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES users(id),
    landlord_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES users(id),
    
    -- Scheduling
    type VARCHAR(20) NOT NULL CHECK (type IN ('in_person', 'virtual', 'open_house', 'self_guided')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- minutes
    timezone VARCHAR(50) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20),
    
    -- Virtual tour
    virtual_meeting_url TEXT,
    virtual_meeting_id VARCHAR(255),
    recording_url TEXT,
    
    -- Notes
    landlord_notes TEXT,
    tenant_notes TEXT,
    
    -- Check-in data
    check_in_location JSONB, -- {lat, lng}
    check_in_photo TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inspection attendees
CREATE TABLE inspection_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    relationship VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inspection feedback
CREATE TABLE inspection_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    liked_features TEXT[],
    concerns TEXT[],
    interested_in_applying BOOLEAN NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inspection reminders log
CREATE TABLE inspection_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('24h', '2h', '30m')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recurring schedules
CREATE TABLE recurring_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id),
    
    days_of_week INTEGER[] NOT NULL, -- 0-6
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER NOT NULL, -- minutes
    buffer_time INTEGER NOT NULL DEFAULT 0, -- minutes
    
    start_date DATE NOT NULL,
    end_date DATE,
    
    excluded_dates DATE[],
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blackout dates
CREATE TABLE blackout_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_inspections_tenant ON inspections(tenant_id);
CREATE INDEX idx_inspections_landlord ON inspections(landlord_id);
CREATE INDEX idx_inspections_scheduled_date ON inspections(scheduled_date);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_recurring_schedules_property ON recurring_schedules(property_id);
CREATE INDEX idx_blackout_dates_property ON blackout_dates(property_id);

Files to Create (40 files)
Phase 1: Types & Utils (5 files)

inspection.types.ts
timeSlotGenerator.ts
calendarSync.ts
timezoneHandler.ts
inspectionValidation.ts

Phase 2: Services (3 files)

inspectionService.ts
availabilityService.ts
notificationService.ts

Phase 3: Store (2 files)

inspectionSlice.ts
availabilitySlice.ts

Phase 4: Hooks (4 files)

useInspections.ts
useAvailability.ts
useInspectionBooking.ts
useInspectionCalendar.ts

Phase 5: Booking Components (8 files)

BookingWizard.tsx
InspectionTypeSelector.tsx
DateTimeSelector.tsx
TimeSlotGrid.tsx
AttendeeForm.tsx
BookingConfirmation.tsx
BookingSummary.tsx
PropertySelection.tsx

Phase 6: Calendar Components (5 files)

CalendarView.tsx
DayView.tsx
WeekView.tsx
MonthView.tsx
TimeSlot.tsx

Phase 7: Management Components (7 files)

InspectionsList.tsx
InspectionCard.tsx
InspectionDetails.tsx
InspectionStatus.tsx
RescheduleModal.tsx
CancelModal.tsx
CheckInOut.tsx

Phase 8: Availability Components (4 files)

AvailabilityManager.tsx
RecurringSchedule.tsx
BlackoutDates.tsx
BufferTimeSettings.tsx

Phase 9: Virtual & Analytics (3 files)

VirtualTourLauncher.tsx
InspectionMetrics.tsx


Success Metrics
Beating the Competition:

Booking Speed: 3 clicks vs Zillow's 5+ clicks + phone calls
Response Time: Instant confirmation vs 24-48 hour wait
No-Show Rate: Target <10% vs industry 30-40%
Conversion Rate: Inspection → Application >50% vs industry 20-30%
User Satisfaction: 4.8+ stars vs Zillow's 3.2 average for showing experience


Ready to build Module 1.3? I'll create all 40 files with production-ready code!RetryMFgreat please proceed, please create all files as separate filesEditI'll create all 40 files for Module 1.3. Let me start with the foundation files and work through each phase systematically.
Phase 1: Types & Utils