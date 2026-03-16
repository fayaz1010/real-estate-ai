// Swagger/OpenAPI Configuration
import { config } from "./env";

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Real Estate Platform API",
    version: "1.0.0",
    description:
      "Comprehensive API for managing properties, inspections, applications, and user authentication.",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http" as const,
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object" as const,
        properties: {
          success: { type: "boolean" as const, example: false },
          error: {
            type: "object" as const,
            properties: {
              code: { type: "string" as const },
              message: { type: "string" as const },
            },
          },
        },
      },
      Property: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const },
          title: { type: "string" as const },
          description: { type: "string" as const },
          propertyType: {
            type: "string" as const,
            enum: [
              "HOUSE",
              "APARTMENT",
              "CONDO",
              "TOWNHOUSE",
              "LAND",
              "COMMERCIAL",
            ],
          },
          status: {
            type: "string" as const,
            enum: ["DRAFT", "ACTIVE", "RENTED", "SOLD", "INACTIVE", "ARCHIVED"],
          },
          price: { type: "number" as const },
          bedrooms: { type: "integer" as const },
          bathrooms: { type: "number" as const },
          sqft: { type: "number" as const },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object" as const,
                required: ["email", "password", "firstName", "lastName"],
                properties: {
                  email: { type: "string" as const, format: "email" },
                  password: { type: "string" as const, minLength: 8 },
                  firstName: { type: "string" as const },
                  lastName: { type: "string" as const },
                  role: {
                    type: "string" as const,
                    enum: ["TENANT", "LANDLORD", "AGENT"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation error" },
          "409": { description: "Email already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object" as const,
                required: ["email", "password"],
                properties: {
                  email: { type: "string" as const, format: "email" },
                  password: { type: "string" as const },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User profile" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/properties": {
      get: {
        tags: ["Properties"],
        summary: "List properties",
        parameters: [
          {
            name: "page",
            in: "query" as const,
            schema: { type: "integer" as const, default: 1 },
          },
          {
            name: "limit",
            in: "query" as const,
            schema: { type: "integer" as const, default: 20 },
          },
          {
            name: "status",
            in: "query" as const,
            schema: { type: "string" as const },
          },
          {
            name: "propertyType",
            in: "query" as const,
            schema: { type: "string" as const },
          },
          {
            name: "minPrice",
            in: "query" as const,
            schema: { type: "number" as const },
          },
          {
            name: "maxPrice",
            in: "query" as const,
            schema: { type: "number" as const },
          },
        ],
        responses: {
          "200": { description: "List of properties" },
        },
      },
      post: {
        tags: ["Properties"],
        summary: "Create a new property",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Property" },
            },
          },
        },
        responses: {
          "201": { description: "Property created" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get property by ID",
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            schema: { type: "string" as const },
          },
        ],
        responses: {
          "200": { description: "Property details" },
          "404": { description: "Property not found" },
        },
      },
    },
    "/inspections": {
      get: {
        tags: ["Inspections"],
        summary: "List inspections",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of inspections" },
        },
      },
      post: {
        tags: ["Inspections"],
        summary: "Schedule an inspection",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Inspection scheduled" },
        },
      },
    },
    "/applications": {
      get: {
        tags: ["Applications"],
        summary: "List applications",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of applications" },
        },
      },
      post: {
        tags: ["Applications"],
        summary: "Submit an application",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Application submitted" },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User registration, login, and profile management",
    },
    { name: "Properties", description: "Property listings and management" },
    { name: "Inspections", description: "Property inspection scheduling" },
    { name: "Applications", description: "Rental application management" },
  ],
};
