import {
  departmentResponseSchema,
  departmentSchema,
  departmentServiceResponseSchema,
  departmentServiceSchema,
  organizationSchema,
  staffResponseSchema,
  staffSchema,
  subscriptionSchema,
  subscriptionsResponseSchema,
  testimonialSchema,
  testimonialsResponseSchema,
} from "@/schemas/organizations";
import { z } from "zod";

  export type Organization = z.infer<typeof organizationSchema>;

  export type Organizations = Organization[];

  export type Staff = z.infer<typeof staffSchema>;

  export type Staffpaginated = z.infer<typeof staffResponseSchema>;

  export type Staffs = Staff[];

  export type Testimony = z.infer<typeof testimonialSchema>;

  export type Testimonypaginated = z.infer<typeof testimonialsResponseSchema>;

  export type Testimonies = Testimony[];

  export type Subscription = z.infer<typeof subscriptionSchema>;

  export type Subscriptionpaginated = z.infer<typeof subscriptionsResponseSchema>;

  export type Subscriptions = Subscription[];

  export type Departmentservice = z.infer<typeof departmentServiceSchema>;

  export type DepartmentserviceResponse = z.infer<typeof departmentServiceResponseSchema>;

  export type Departmentservices = Department[];

  export type Department = z.infer<typeof departmentSchema>;

  export type DepartmentResponse = z.infer<typeof departmentResponseSchema>;

  export type Departments = Subscription[];


