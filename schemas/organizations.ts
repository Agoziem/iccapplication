import { z } from "zod";

// Organization
export const CreateOrganizationSchema = z.object({
  name: z.string(),
  description: z.string(),
  vision: z.string(),
  mission: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  whatsapplink: z.string().optional(),
  facebooklink: z.string().optional(),
  instagramlink: z.string().optional(),
  twitterlink: z.string().optional(),
  tiktoklink: z.string().optional(),
  linkedinlink: z.string().optional(),
  youtubechannel: z.string().optional(),
  privacy_policy: z.string().optional(),
  terms_of_use: z.string().optional(),
});

export type CreateOrganizationType = z.infer<typeof CreateOrganizationSchema>;

export const UpdateOrganizationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapplink: z.string().optional(),
  facebooklink: z.string().optional(),
  instagramlink: z.string().optional(),
  twitterlink: z.string().optional(),
  tiktoklink: z.string().optional(),
  linkedinlink: z.string().optional(),
  youtubechannel: z.string().optional(),
  privacy_policy: z.string().optional(),
  terms_of_use: z.string().optional(),
});
export type UpdateOrganizationType = z.infer<typeof UpdateOrganizationSchema>;

// Staff
export const CreateStaffSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  other_names: z.string().optional(),
  role: z.string().optional().default("none"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  facebooklink: z.string().optional(),
  instagramlink: z.string().optional(),
  twitterlink: z.string().optional(),
  linkedinlink: z.string().optional(),
});

export type CreateStaffType = z.infer<typeof CreateStaffSchema>;

export const UpdateStaffSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  other_names: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  facebooklink: z.string().optional(),
  instagramlink: z.string().optional(),
  twitterlink: z.string().optional(),
  linkedinlink: z.string().optional(),
});
export type UpdateStaffType = z.infer<typeof UpdateStaffSchema>;

// Testimonial
export const CreateTestimonialSchema = z.object({
  name: z.string().default("Anonymous"),
  content: z.string(),
  role: z.string().optional(),
  rating: z.number().optional(),
});
export type CreateTestimonialType = z.infer<typeof CreateTestimonialSchema>;

export const UpdateTestimonialSchema = z.object({
  name: z.string().optional(),
  content: z.string().optional(),
  role: z.string().optional(),
  rating: z.number().optional(),
});
export type UpdateTestimonialType = z.infer<typeof UpdateTestimonialSchema>;

// Subscription
export const CreateSubscriptionSchema = z.object({
  email: z.string().email(),
});
export type CreateSubscriptionType = z.infer<typeof CreateSubscriptionSchema>;

// Department Service
export const CreateDepartmentServiceSchema = z.object({
  name: z.string(),
});
export type CreateDepartmentServiceType = z.infer<typeof CreateDepartmentServiceSchema>;

export const UpdateDepartmentServiceSchema = z.object({
  name: z.string().optional(),
});
export type UpdateDepartmentServiceType = z.infer<typeof UpdateDepartmentServiceSchema>;

// Department
export const CreateDepartmentSchema = z.object({
  name: z.string(),
  description: z.string(),
  staff_in_charge: z.number().optional(),
  services: z.array(z.string()),
});
export type CreateDepartmentType = z.infer<typeof CreateDepartmentSchema>;

export const UpdateDepartmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  staff_in_charge: z.number().optional(),
  services: z.array(z.string()),
});
export type UpdateDepartmentType = z.infer<typeof UpdateDepartmentSchema>;
