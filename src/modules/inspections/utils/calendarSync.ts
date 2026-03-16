// PLACEHOLDER FILE: src/modules/inspections/utils/calendarSync.ts
// TODO: Add your implementation here

import { Inspection, CalendarEvent } from '../types/inspection.types';

/**
 * Generate iCalendar (.ics) format for inspection
 */
export function generateICalendar(inspection: Inspection): string {
  const startDate = new Date(inspection.scheduledDate);
  const endDate = new Date(startDate.getTime() + inspection.duration * 60 * 1000);

  const formatDateTime = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const attendeeList = inspection.attendees
    .map((a) => `ATTENDEE;CN=${a.name}:mailto:${a.email}`)
    .join('\n');

  const property = inspection.property;
  const location = property
    ? `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
    : '';

  const description = [
    `Property Inspection - ${inspection.type}`,
    '',
    property ? `Property: ${property.title}` : '',
    `Duration: ${inspection.duration} minutes`,
    inspection.tenantNotes ? `\nNotes: ${inspection.tenantNotes}` : '',
    '',
    inspection.virtualMeetingUrl
      ? `Virtual Meeting Link: ${inspection.virtualMeetingUrl}`
      : '',
  ]
    .filter(Boolean)
    .join('\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Real Estate Platform//Inspection Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${inspection.id}@realestate-platform.com`,
    `DTSTAMP:${formatDateTime(new Date())}`,
    `DTSTART:${formatDateTime(startDate)}`,
    `DTEND:${formatDateTime(endDate)}`,
    `SUMMARY:Property Inspection - ${property?.title || 'Property Tour'}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    attendeeList,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Property inspection in 2 hours',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Property inspection in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Generate download link for iCalendar file
 */
export function getCalendarDownloadUrl(inspection: Inspection): string {
  const icsContent = generateICalendar(inspection);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}

/**
 * Trigger download of calendar file
 */
export function downloadCalendarFile(inspection: Inspection): void {
  const url = getCalendarDownloadUrl(inspection);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inspection-${inspection.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar URL
 */
export function getGoogleCalendarUrl(inspection: Inspection): string {
  const startDate = new Date(inspection.scheduledDate);
  const endDate = new Date(startDate.getTime() + inspection.duration * 60 * 1000);

  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const property = inspection.property;
  const title = encodeURIComponent(
    `Property Inspection - ${property?.title || 'Property Tour'}`
  );

  const location = property
    ? encodeURIComponent(
        `${property.address.street}, ${property.address.city}, ${property.address.state}`
      )
    : '';

  const details = encodeURIComponent([
    `Property Inspection - ${inspection.type}`,
    '',
    property ? `Property: ${property.title}` : '',
    `Duration: ${inspection.duration} minutes`,
    inspection.tenantNotes ? `\nNotes: ${inspection.tenantNotes}` : '',
    '',
    inspection.virtualMeetingUrl
      ? `Virtual Meeting Link: ${inspection.virtualMeetingUrl}`
      : '',
  ].filter(Boolean).join('\n'));

  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generate Outlook Calendar URL
 */
export function getOutlookCalendarUrl(inspection: Inspection): string {
  const startDate = new Date(inspection.scheduledDate);
  const endDate = new Date(startDate.getTime() + inspection.duration * 60 * 1000);

  const formatOutlookDate = (date: Date): string => {
    return date.toISOString();
  };

  const property = inspection.property;
  const subject = encodeURIComponent(
    `Property Inspection - ${property?.title || 'Property Tour'}`
  );

  const location = property
    ? encodeURIComponent(
        `${property.address.street}, ${property.address.city}, ${property.address.state}`
      )
    : '';

  const body = encodeURIComponent([
    `Property Inspection - ${inspection.type}`,
    '',
    property ? `Property: ${property.title}` : '',
    `Duration: ${inspection.duration} minutes`,
    inspection.tenantNotes ? `\nNotes: ${inspection.tenantNotes}` : '',
    '',
    inspection.virtualMeetingUrl
      ? `Virtual Meeting Link: ${inspection.virtualMeetingUrl}`
      : '',
  ].filter(Boolean).join('\n'));

  const startTime = formatOutlookDate(startDate);
  const endTime = formatOutlookDate(endDate);

  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}&location=${location}&startdt=${startTime}&enddt=${endTime}&path=/calendar/action/compose&rru=addevent`;
}

/**
 * Generate Apple Calendar URL (webcal)
 */
export function getAppleCalendarUrl(inspection: Inspection): string {
  // Apple Calendar uses the same .ics format
  // For web, we can use a data URI
  const icsContent = generateICalendar(inspection);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

/**
 * Convert inspection to calendar event format
 */
export function inspectionToCalendarEvent(inspection: Inspection): CalendarEvent {
  const startDate = new Date(inspection.scheduledDate);
  const endDate = new Date(startDate.getTime() + inspection.duration * 60 * 1000);

  const property = inspection.property;
  const location = property
    ? `${property.address.street}, ${property.address.city}, ${property.address.state}`
    : '';

  const description = [
    `Property Inspection - ${inspection.type}`,
    property ? `Property: ${property.title}` : '',
    inspection.tenantNotes ? `Notes: ${inspection.tenantNotes}` : '',
    inspection.virtualMeetingUrl
      ? `Virtual Meeting: ${inspection.virtualMeetingUrl}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    id: inspection.id,
    title: `Property Inspection - ${property?.title || 'Property Tour'}`,
    description,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    location,
    attendees: [
      inspection.tenant?.email,
      inspection.landlord?.email,
      ...inspection.attendees.map((a) => a.email),
    ].filter(Boolean) as string[],
    start: startDate,
    end: endDate,
    type: inspection.type,
    status: inspection.status,
    propertyId: inspection.propertyId,
    tenantName: inspection.tenant?.name || 'Unknown',
  };
}

/**
 * Open calendar app based on user's preference
 */
export function openCalendarApp(
  inspection: Inspection,
  provider: 'google' | 'outlook' | 'apple' | 'ics'
): void {
  let url: string;

  switch (provider) {
    case 'google':
      url = getGoogleCalendarUrl(inspection);
      break;
    case 'outlook':
      url = getOutlookCalendarUrl(inspection);
      break;
    case 'apple':
      downloadCalendarFile(inspection);
      return;
    case 'ics':
      downloadCalendarFile(inspection);
      return;
    default:
      downloadCalendarFile(inspection);
      return;
  }

  window.open(url, '_blank');
}

/**
 * Detect user's preferred calendar provider
 */
export function detectCalendarProvider(): 'google' | 'outlook' | 'apple' | 'unknown' {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'apple';
  }

  // Check if user is logged into Google
  if (document.cookie.includes('google')) {
    return 'google';
  }

  // Check if user is using Outlook/Microsoft
  if (document.cookie.includes('microsoft') || document.cookie.includes('outlook')) {
    return 'outlook';
  }

  return 'unknown';
}