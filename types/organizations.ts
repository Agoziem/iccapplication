import { z } from "zod";
import {
  OrganizationSchema,
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  StaffSchema,
  CreateStaffSchema,
  UpdateStaffSchema,
  PaginatedStaffSerializer,
  DepartmentSchema,
  CreateDepartmentSchema,
  PaginatedDepartmentSerializer,
  TestimonialSchema,
  CreateTestimonialSchema,
  PaginatedTestimonialSerializer,
  SubscriptionSchema,
  CreateSubscriptionSchema,
  PaginatedSubscriptionSerializer,
  OrganizationArraySchema,
  StaffArraySchema,
  DepartmentArraySchema,
  TestimonialArraySchema,
  SubscriptionArraySchema,
  UpdateDepartmentSchema,
  UpdateTestimonialSchema,
  UpdateSubscriptionSchema,
  CreateRichTextEditorImagesSchema,
  RichTextEditorImagesSchema
} from "../schemas/organizations";

// Extract TypeScript types from Zod schemas
export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;

export type Staff = z.infer<typeof StaffSchema>;
export type CreateStaff = z.infer<typeof CreateStaffSchema>;
export type UpdateStaff = z.infer<typeof UpdateStaffSchema>;
export type PaginatedStaff = z.infer<typeof PaginatedStaffSerializer>;

export type Department = z.infer<typeof DepartmentSchema>;
export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartment = z.infer<typeof UpdateDepartmentSchema>;
export type PaginatedDepartment = z.infer<typeof PaginatedDepartmentSerializer>;

export type Testimonial = z.infer<typeof TestimonialSchema>;
export type CreateTestimonial = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof UpdateTestimonialSchema>;
export type PaginatedTestimonial = z.infer<typeof PaginatedTestimonialSerializer>;

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;
export type PaginatedSubscription = z.infer<typeof PaginatedSubscriptionSerializer>;


export type RichTextEditorImages = z.infer<typeof RichTextEditorImagesSchema>;
export type CreateRichTextEditorImages = z.infer<typeof CreateRichTextEditorImagesSchema>;


// Array types
export type OrganizationArray = z.infer<typeof OrganizationArraySchema>;
export type StaffArray = z.infer<typeof StaffArraySchema>;
export type DepartmentArray = z.infer<typeof DepartmentArraySchema>;
export type TestimonialArray = z.infer<typeof TestimonialArraySchema>;
export type SubscriptionArray = z.infer<typeof SubscriptionArraySchema>;

// Additional utility types
export type OrganizationProfile = Pick<Organization, 'id' | 'name' | 'description' | 'logo' | 'email' | 'phone' | 'address'>;
export type StaffProfile = Pick<Staff, 'id' | 'first_name' | 'last_name' | 'role' | 'email' | 'phone' | 'img_url'>;
export type DepartmentSummary = Pick<Department, 'id' | 'name' | 'description' | 'img_url'>;
export type TestimonialPreview = Pick<Testimonial, 'id' | 'name' | 'content' | 'role' | 'rating' | 'img_url'>;