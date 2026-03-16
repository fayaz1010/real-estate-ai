# Module 2.1: Application Management System - API Integration Guide

## Overview
This document provides the complete API specification for integrating the Application Management System backend.

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.yourplatform.com/api
```

## Authentication
All endpoints require JWT authentication unless specified otherwise.

```http
Authorization: Bearer {access_token}
```

---

## Application Endpoints

### Create Application
```http
POST /applications
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "propertyId": "uuid"
}

Response: 201 Created
{
  "id": "uuid",
  "propertyId": "uuid",
  "primaryApplicantId": "uuid",
  "status": "draft",
  "score": 0,
  "createdAt": "2025-01-15T10:00:00Z",
  ...
}
```

### Get Application
```http
GET /applications/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "propertyId": "uuid",
  "status": "submitted",
  "score": 85,
  "personalInfo": {...},
  "employment": [...],
  "income": [...],
  ...
}
```

### Update Application (Autosave)
```http
PATCH /applications/:id
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    ...
  },
  "employment": [...],
  "income": [...]
}

Response: 200 OK
{
  "id": "uuid",
  "lastModified": "2025-01-15T10:05:00Z",
  ...
}
```

### Submit Application
```http
POST /applications/:id/submit
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "status": "submitted",
  "submittedAt": "2025-01-15T10:10:00Z",
  ...
}
```

### Delete Application
```http
DELETE /applications/:id
Authorization: Bearer {token}

Response: 204 No Content
```

### Get My Applications
```http
GET /applications/my-applications
Authorization: Bearer {token}

Query Parameters:
- status: array (optional)
- propertyId: string (optional)
- minScore: number (optional)
- maxScore: number (optional)
- dateFrom: string (optional)
- dateTo: string (optional)
- search: string (optional)

Response: 200 OK
[
  {
    "id": "uuid",
    "propertyId": "uuid",
    "status": "submitted",
    "score": 85,
    ...
  }
]
```

### Apply to Multiple Properties
```http
POST /applications/multi
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "propertyIds": ["uuid1", "uuid2", "uuid3"],
  "applicationData": {
    "personalInfo": {...},
    "employment": [...],
    ...
  }
}

Response: 200 OK
[
  {"id": "uuid1", ...},
  {"id": "uuid2", ...},
  {"id": "uuid3", ...}
]
```

---

## Landlord Review Endpoints

### Get Property Applications
```http
GET /applications?propertyId={uuid}
Authorization: Bearer {token}

Query Parameters:
- status: array (optional)
- minScore: number (optional)

Response: 200 OK
[...]
```

### Approve Application
```http
POST /applications/:id/approve
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "conditions": ["Provide renters insurance", "..."] // optional
}

Response: 200 OK
{
  "id": "uuid",
  "status": "approved",
  "conditions": [...],
  "reviewedAt": "2025-01-15T11:00:00Z",
  ...
}
```

### Reject Application
```http
POST /applications/:id/reject
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "reason": "Insufficient income"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "rejected",
  "rejectionReason": "Insufficient income",
  "reviewedAt": "2025-01-15T11:00:00Z",
  ...
}
```

### Request More Information
```http
POST /applications/:id/request-more-info
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "message": "Please provide additional paystubs",
  "requiredFields": ["income", "documents"]
}

Response: 200 OK
```

---

## Verification Endpoints

### Verify Identity
```http
POST /applications/:id/verify-identity
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "ssn": "123-45-6789",
  "idType": "drivers_license",
  "idNumber": "D1234567",
  "idFrontImage": "base64...",
  "idBackImage": "base64...",
  "selfieImage": "base64..."
}

Response: 200 OK
{
  "status": "verified",
  "verified": true,
  "matchScore": 95,
  "verifiedAt": "2025-01-15T10:15:00Z",
  ...
}
```

### Verify Income
```http
POST /applications/:id/verify-income
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "employerName": "Acme Corp",
  "annualIncome": 75000,
  "employmentStartDate": "2020-01-01",
  "documents": ["doc-id-1", "doc-id-2"]
}

Response: 200 OK
{
  "status": "verified",
  "verified": true,
  "verifiedIncome": 75000,
  "confidence": 90,
  ...
}
```

### Credit Check
```http
POST /applications/:id/credit-check
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "packageId": "experian-basic",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "ssn": "123-45-6789",
  "currentAddress": {...},
  "consentGiven": true,
  "consentDate": "2025-01-15",
  "purpose": "rental_application"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "pending",
  "orderedAt": "2025-01-15T10:20:00Z",
  ...
}
```

### Get Credit Check Status
```http
GET /applications/:id/credit-check
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "status": "completed",
  "completedAt": "2025-01-15T10:25:00Z",
  "result": {
    "score": 720,
    "provider": "experian",
    "reportUrl": "https://..."
  }
}
```

### Background Check
```http
POST /applications/:id/background-check
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "packageId": "checkr-standard",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "ssn": "123-45-6789",
  "currentAddress": {...},
  "consentGiven": true,
  "consentDate": "2025-01-15",
  "consentSignature": "John Doe"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "pending",
  "orderedAt": "2025-01-15T10:30:00Z",
  ...
}
```

---

## Co-Applicant Endpoints

### Invite Co-Applicant
```http
POST /applications/:id/co-applicants
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "email": "jane@example.com",
  "relationship": "spouse"
}

Response: 200 OK
{
  "id": "uuid",
  "email": "jane@example.com",
  "status": "invited",
  "invitedAt": "2025-01-15T10:35:00Z",
  ...
}
```

### Update Co-Applicant
```http
PATCH /applications/:id/co-applicants/:coAppId
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "personalInfo": {...},
  "employment": [...],
  "income": [...]
}

Response: 200 OK
```

### Remove Co-Applicant
```http
DELETE /applications/:id/co-applicants/:coAppId
Authorization: Bearer {token}

Response: 204 No Content
```

---

## Document Endpoints

### Upload Document
```http
POST /applications/:id/documents
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- file: File
- type: string (id|paystub|bank_statement|tax_return|employment_letter|other)

Response: 200 OK
{
  "id": "uuid",
  "type": "paystub",
  "filename": "paystub.pdf",
  "url": "https://...",
  "uploadedAt": "2025-01-15T10:40:00Z",
  "size": 153600,
  "parsed": false
}
```

### Parse Document
```http
POST /applications/:id/documents/:docId/parse
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "parsed": true,
  "extractedData": {
    "employerName": "Acme Corp",
    "grossPay": 6250,
    "payDate": "2025-01-10",
    ...
  }
}
```

### Delete Document
```http
DELETE /applications/:id/documents/:docId
Authorization: Bearer {token}

Response: 204 No Content
```

---

## Scoring Endpoint

### Get Application Score
```http
GET /applications/:id/score
Authorization: Bearer {token}

Response: 200 OK
{
  "score": 85,
  "breakdown": {
    "creditScore": {"value": 720, "weight": 0.30, "score": 88},
    "incomeRatio": {"value": 3.2, "weight": 0.25, "score": 100},
    ...
  },
  "rating": "Good"
}
```

---

## Response Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## Webhooks (Optional)

If you want to implement real-time notifications, register webhook endpoints:

```http
POST https://your-server.com/webhooks/applications

Body:
{
  "event": "application.submitted",
  "applicationId": "uuid",
  "timestamp": "2025-01-15T10:00:00Z",
  "data": {...}
}
```

Events:
- `application.created`
- `application.submitted`
- `application.approved`
- `application.rejected`
- `verification.completed`
- `credit_check.completed`
- `background_check.completed`

---

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user
- Headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Testing

Use the following test data in development:

**Test Credit Scores:**
- SSN ending in 0000-0999: Score 300-599
- SSN ending in 1000-4999: Score 600-699
- SSN ending in 5000-7999: Score 700-799
- SSN ending in 8000-9999: Score 800-850

**Test Background Checks:**
- SSN ending in 0000: Clean record
- SSN ending in 1111: 1 misdemeanor
- SSN ending in 2222: 1 eviction

---

For questions or support, contact: dev@yourplatform.com