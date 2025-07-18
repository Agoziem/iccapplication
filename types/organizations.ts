export interface Organization {
  id?: number;
  name: string;
  description: string;
  logo?: string | null;
  Organizationlogoname?: string | null;
  Organizationlogo?: string | null;
  vision: string;
  mission: string;
  email: string;
  phone: string;
  address: string;
  whatsapplink?: string | null;
  facebooklink?: string | null;
  instagramlink?: string | null;
  twitterlink?: string | null;
  tiktoklink?: string | null;
  linkedinlink?: string | null;
  youtubechannel?: string | null;
  privacy_policy?: string | null;
  terms_of_use?: string | null;
  created_at: Date;
  last_updated_date: Date;
}

export type Organizations = Organization[];

export interface Staff {
  id?: number;
  organization?: number | null;
  first_name: string;
  last_name: string;
  other_names?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  img?: string | null;
  img_url?: string | null;
  img_name?: string | null;
  role?: string | null;
  facebooklink?: string | null;
  instagramlink?: string | null;
  twitterlink?: string | null;
  linkedinlink?: string | null;
  created_at: Date;
  last_updated_date: Date;
}

export interface Staffpaginated {
  count: number;
  next: string | null;
  previous: string | null;
  results: Staff[];
}

export type Staffs = Staff[];

export interface Testimony {
  id?: number;
  organization?: number | null;
  name: string;
  content: string;
  role?: string | null;
  img?: string | null;
  img_url?: string | null;
  img_name?: string | null;
  rating?: number | null;
  created_at: Date;
  last_updated_date: Date;
}

export interface Testimonypaginated {
  count: number;
  next: string | null;
  previous: string | null;
  results: Testimony[];
}

export type Testimonies = Testimony[];

export interface Subscription {
  id?: number;
  email: string;
  date_added: Date;
}

export interface Subscriptionpaginated {
  count: number;
  next: string | null;
  previous: string | null;
  results: Subscription[];
}

export type Subscriptions = Subscription[];

export interface Departmentservice {
  id?: number;
  name: string;
}

export interface DepartmentserviceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Departmentservice[];
}

export type Departmentservices = Departmentservice[];

export interface OrganizationMini {
  id?: number | null;
  name: string;
}

export interface StaffInCharge {
  id?: number | null;
  name: string;
  img_url?: string | null;
}

export interface ServiceMini {
  id?: number;
  name: string;
}

export interface Department {
  id?: number | null;
  organization: OrganizationMini | null;
  img?: string | null;
  img_url?: string | null;
  img_name?: string | null;
  name: string;
  description: string;
  staff_in_charge?: StaffInCharge | null;
  services?: ServiceMini[];
  created_at: Date;
  last_updated_date: Date;
}

export interface DepartmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Department[];
}

export type Departments = Department[];


