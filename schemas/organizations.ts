import { z } from "zod";
import { imageSchema } from "./custom-validation";

// ---------------------------------------------------------------------
// Core Organization Schema (Based on API Organization model)
// ---------------------------------------------------------------------

export const OrganizationSchema = z.object({
  id: z.number().int().positive().optional(),
  logo: imageSchema,
  Organizationlogoname: z.string().optional(),
  Organizationlogo: z.string().optional(),
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(200, "Name must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  vision: z.string().min(1, "Vision is required"),
  mission: z.string().min(1, "Mission is required"),
  email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .min(1),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must be less than 20 characters"),
  address: z.string().min(1, "Address is required"),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
  whatsapplink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  facebooklink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  instagramlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  twitterlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  tiktoklink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  linkedinlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  youtubechannel: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  privacy_policy: z.string().optional(),
  terms_of_use: z.string().optional(),
});

export const OrganizationMiniSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(200, "Name must be less than 200 characters"),
  logo: imageSchema,
  Organizationlogoname: z.string().optional(),
  Organizationlogo: z.string().optional(),
});

/**
 * Schema for creating organizations (omits readonly fields)
 */
export const CreateOrganizationSchema = z.object({
  logo: imageSchema,
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(200, "Name must be less than 200 characters"),
  description: z.string().min(1, "Description is required"),
  vision: z.string().min(1, "Vision is required"),
  mission: z.string().min(1, "Mission is required"),
  email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .min(1),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must be less than 20 characters"),
  address: z.string().min(1, "Address is required"),
  whatsapplink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  facebooklink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  instagramlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  twitterlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  tiktoklink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  linkedinlink: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  youtubechannel: z
    .string()
    .max(200, "Link must be less than 200 characters")
    .optional(),
  privacy_policy: z.string().optional(),
  terms_of_use: z.string().optional(),
});

/**
 * Schema for updating organizations (all fields optional except required fields)
 */
export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

// ---------------------------------------------------------------------
// Staff Schema (Based on API Staff model)
// ---------------------------------------------------------------------

export const StaffSchema = z.object({
  id: z.number().int().positive().optional(),
  img: z.string().optional(),
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  other_names: z
    .string()
    .max(100, "Other names must be less than 100 characters")
    .optional(),
  role: z
    .string()
    .max(100, "Role must be less than 100 characters")
    .min(1)
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  address: z.string().optional(),
  facebooklink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  instagramlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  twitterlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  linkedinlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
  organization: z.number().int().positive().optional(),
});

/**
 * Schema for creating staff members (omits readonly fields)
 */
export const CreateStaffSchema = z.object({
  img: imageSchema,
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  other_names: z
    .string()
    .max(100, "Other names must be less than 100 characters")
    .optional(),
  role: z
    .string()
    .max(100, "Role must be less than 100 characters")
    .min(1)
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  address: z.string().optional(),
  facebooklink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  instagramlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  twitterlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
  linkedinlink: z
    .string()
    .max(100, "Link must be less than 100 characters")
    .optional(),
});

/**
 * Schema for updating staff members
 */
export const UpdateStaffSchema = CreateStaffSchema.partial();

/**
 * Paginated staff response schema
 */
export const PaginatedStaffSerializer = z.object({
  count: z.number().int().min(0),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(StaffSchema),
});

// -----------------------------------------------------
// DepartmentService Schema (Based on API DepartmentService model)
// -----------------------------------------------------
export const DepartmentServiceSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Name must be less than 100 characters"),
});

// ---------------------------------------------------------------------
// Department Schema (Based on API Department model)
// ---------------------------------------------------------------------

export const DepartmentSchema = z.object({
  id: z.number().int().positive().optional(),
  img: imageSchema,
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  staff_in_charge: StaffSchema,
  organization: OrganizationMiniSchema,
  services: z.array(DepartmentServiceSchema),
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Department description is required"),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
});

/**
 * Schema for creating departments (omits readonly fields)
 */
export const CreateDepartmentSchema = z.object({
  img: imageSchema,
  staff_in_charge: z.number().int().positive().optional(),
  services: z.array(z.string()).optional(),
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Department description is required"),
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

/**
 * Paginated department response schema
 */
export const PaginatedDepartmentSerializer = z.object({
  count: z.number().int().min(0),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(DepartmentSchema),
});

// ---------------------------------------------------------------------
// Testimonial Schema (Based on API Testimonial model)
// ---------------------------------------------------------------------

export const TestimonialSchema = z.object({
  id: z.number().int().positive().optional(),
  img: imageSchema,
  img_url: z.string().optional(),
  img_name: z.string().optional(),
  name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .min(1)
    .optional(),
  content: z.string().min(1, "Content is required"),
  role: z.string().max(100, "Role must be less than 100 characters").optional(),
  rating: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  last_updated_date: z.coerce.date().optional(),
  organization: z.number().int().positive().optional(),
});

/**
 * Schema for creating testimonials (omits readonly fields)
 */
export const CreateTestimonialSchema = z.object({
  img: imageSchema,
  name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .min(1)
    .optional(),
  content: z.string().min(1, "Content is required"),
  role: z.string().max(100, "Role must be less than 100 characters").optional(),
  rating: z.number().int().optional(),
});

export const UpdateTestimonialSchema = CreateTestimonialSchema.partial();

/**
 * Paginated testimonials response schema
 */
export const PaginatedTestimonialSerializer = z.object({
  count: z.number().int().min(0),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(TestimonialSchema),
});

// ---------------------------------------------------------------------
// Subscription Schema (Based on API Subscription model)
// ---------------------------------------------------------------------

export const SubscriptionSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be less than 254 characters")
    .min(1),
  date_added: z.coerce.date().optional(),
  organization: z.number().int().positive().optional(),
});

/**
 * Schema for creating subscriptions (omits readonly fields)
 */
export const CreateSubscriptionSchema = SubscriptionSchema.omit({
  id: true,
  date_added: true,
  organization: true,
});

export const UpdateSubscriptionSchema = CreateSubscriptionSchema.partial();

/**
 * Paginated subscriptions response schema
 */
export const PaginatedSubscriptionSerializer = z.object({
  count: z.number().int().min(0),
  next: z.string().url().optional(),
  previous: z.string().url().optional(),
  results: z.array(SubscriptionSchema),
});

// RichTextImage Schema (Based on API RichTextImage model)
export const RichTextEditorImagesSchema = z.object({
  id: z.number().or(z.string().uuid()), // depending on your model PK type
  image: imageSchema,
  image_url: z.string().url().nullable().optional(), // computed field
  image_name: z.string().nullable().optional(), // computed field
  uploaded_at: z.string().datetime(), // ISO datetime string
});

export const CreateRichTextEditorImagesSchema = z.object({
  image: imageSchema,
});

// ---------------------------------------------------------------------
// Array Schemas for bulk operations
// ---------------------------------------------------------------------

/**
 * Schema for arrays of organizations
 */
export const OrganizationArraySchema = z.array(OrganizationSchema);

/**
 * Schema for arrays of staff
 */
export const StaffArraySchema = z.array(StaffSchema);

/**
 * Schema for arrays of departments
 */
export const DepartmentArraySchema = z.array(DepartmentSchema);

/**
 * Schema for arrays of testimonials
 */
export const TestimonialArraySchema = z.array(TestimonialSchema);

/**
 * Schema for arrays of subscriptions
 */
export const SubscriptionArraySchema = z.array(SubscriptionSchema);
