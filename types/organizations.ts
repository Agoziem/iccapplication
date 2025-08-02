
// -------------------------------------
// Organization
// -------------------------------------
export type OrganizationSchema = {
  id: number;
  name: string;
  description: string;
  vision: string;
  mission: string;
  email: string;
  phone: string;
  address: string;
  logo?: string | null;
  whatsapplink?: string | null;
  facebooklink?: string | null;
  instagramlink?: string | null;
  twitterlink?: string | null;
  tiktoklink?: string | null;
  linkedinlink?: string | null;
  youtubechannel?: string | null;
  privacy_policy?: string | null;
  terms_of_use?: string | null;
  created_at: string;
  last_updated_date: string;
};

export type OrganizationMiniSchema = {
  id: number;
  name: string;
};

// Staff
export type StaffSchema = {
  id: number;
  first_name: string;
  last_name: string;
  other_names?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  facebooklink?: string | null;
  instagramlink?: string | null;
  twitterlink?: string | null;
  linkedinlink?: string | null;
  img?: string | null;
  created_at: string;
  last_updated_date: string;
};

export type StaffMiniSchema = {
  id: number;
  first_name: string;
  last_name: string;
  role?: string | null;
};

// Testimonial
export type TestimonialSchema = {
  id: number;
  name: string;
  content: string;
  role?: string | null;
  rating?: number | null;
  img?: string | null;
  created_at: string;
  last_updated_date: string;
};

// Subscription
export type SubscriptionSchema = {
  id: number;
  email: string;
  created_at: string;
};

// Department Service
export type DepartmentServiceSchema = {
  id: number;
  name: string;
  created_at: string;
};

// Department
export type DepartmentSchema = {
  id: number;
  name: string;
  img?: string | null;
  description: string;
  staff_in_charge?: StaffMiniSchema | null;
  organization?: OrganizationMiniSchema | null;
  services: DepartmentServiceSchema[];
  created_at: string;
  last_updated_date: string;
};


// Success/Error
export type SuccessResponseSchema = {
  message: string;
};

export type ErrorResponseSchema = {
  error: string;
};

// Paginated
export type PaginatedOrganizationResponseSchema = {
  count: number;
  items: OrganizationSchema[];
};

export type PaginatedStaffResponseSchema = {
  count: number;
  items: StaffSchema[];
};

export type PaginatedTestimonialResponseSchema = {
  count: number;
  items: TestimonialSchema[];
};

export type PaginatedSubscriptionResponseSchema = {
  count: number;
  items: SubscriptionSchema[];
};

export type PaginatedDepartmentResponseSchema = {
  count: number;
  items: DepartmentSchema[];
};

export type PaginatedDepartmentServiceResponseSchema = {
  count: number;
  items: DepartmentServiceSchema[];
};
