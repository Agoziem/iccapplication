import { Blog, Comment } from "@/types/articles";
import { DepartmentSchema, OrganizationSchema, StaffSchema, TestimonialSchema } from "@/types/organizations";
import { OrderReportSchema, OrderSchema } from "@/types/payments";
import { Product } from "@/types/products";
import { Service } from "@/types/services";
import { User } from "@/types/users";
import { Video } from "@/types/videos";
import { WAMessage } from "@/types/whatsapp";
import { ComponentType } from "react";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { PiGearBold, PiGraduationCapBold } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbBooks } from "react-icons/tb";

// Constants for environment variables and default values
export const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "iccauth_token";
export const API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api";
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000";
export const SITE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || "your-resend-api-key";
export const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "1";
export const WHATSAPPAPI_ACCESS_TOKEN = process.env.NEXT_PUBLIC_WHATSAPPAPI_ACCESS_TOKEN || "your-whatsapp-api-access-token";
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_paystack_public_key";


export const WAMessageDefault: WAMessage = {
  id: 0,
  message_id: "", 
  contact: 0,
  message_type: "text",
  body: "", 
  media_id: "", 
  mime_type: "",
  filename: "",
  animated: false,
  caption: "",
  timestamp: new Date().toISOString(),
  message_mode: "received",
  seen: false,
  link: "https://www.example.com",
  status: "pending",
};

export const OrganizationDefault: OrganizationSchema = {
  id: 0,
  logo: null,
  name: "",
  description: "",
  vision: "",
  mission: "",
  email: "",
  phone: "",
  address: "",
  whatsapplink: null,
  facebooklink: null,
  instagramlink: null,
  twitterlink: null,
  tiktoklink: null,
  linkedinlink: null,
  youtubechannel: null,
  privacy_policy: "",
  terms_of_use: "",
  created_at: new Date().toLocaleDateString(),
  last_updated_date: new Date().toLocaleDateString(),
};

export const testimonialDefault: TestimonialSchema = {
  id: 0,
  name: "",
  content: "",
  role: "",
  rating: 0,
  img: null,
  created_at: new Date().toLocaleDateString(),
  last_updated_date: new Date().toLocaleDateString(),
};

export const staffdefault: StaffSchema = {
  id: 0,
  first_name: "",
  last_name: "",
  other_names: "",
  email: "",
  phone: "",
  address: "",
  img: null,
  role: "",
  facebooklink: "",
  instagramlink: "",
  twitterlink: "",
  linkedinlink: "",
  created_at: new Date().toLocaleDateString(),
  last_updated_date: new Date().toLocaleDateString(),
};

export const deptDefault: DepartmentSchema = {
  id: 1,
  img: null,
  staff_in_charge: null,
  organization: null,
  services: [],
  name: "",
  description: "",
  created_at: new Date().toLocaleDateString(),
  last_updated_date: new Date().toLocaleDateString(),
};

export const ArticleDefault: Blog = {
  id: 0,
  img: null,
  title: "",
  subtitle: "",
  body: "",
  readTime: 0,
  author: undefined,
  tags: [],
  slug: "",
  category: undefined,
  views: 0,
  organization: null,
  likes: [],
  likes_count: 0,
  date: new Date().toDateString(),
  updated_at: new Date().toDateString(),
};

export const ArticleCommentDefault: Comment = {
  id: 0,
  user: {
    id: 0,
    username: "",
    img: null,
  },
  blog_id: 0,
  comment: "",
  created_at: new Date().toDateString(),
  updated_at: new Date().toDateString(),
};

export const VideoDefault: Video = {
  id: 0,
  organization: null,
  thumbnail: null,
  video: null,
  category: null,
  subcategory: null,
  title: "",
  description: "",
  price: 0,
  video_token: "",
  created_at: new Date().toDateString(),
  updated_at: new Date().toDateString(),
  free: false,
  userIDs_that_bought_this_video: [],
  number_of_times_bought: 0,
};

export const serviceDefault: Service = {
  id: 0,
  organization: null,
  preview: null,
  category: null,
  subcategory: null,
  name: "",
  description: null,
  service_flow: null,
  price: 0,
  number_of_times_bought: 0,
  userIDs_that_bought_this_service: [],
  userIDs_whose_services_is_in_progress: [],
  userIDs_whose_services_have_been_completed: [],
  details_form_link: null,
  created_at: new Date().toDateString(),
  updated_at: new Date().toDateString(),
};

/**
 * Default for a Product
 */
export const defaultProduct: Product = {
  id: 0,
  organization: null,
  preview: null,
  product: null,
  category: null,
  subcategory: null,
  name: "",
  description: "No description available",
  price: 0,
  rating: 0,
  product_token: "",
  digital: true,
  created_at: new Date().toDateString(),
  last_updated_date: new Date().toDateString(),
  free: false,
  userIDs_that_bought_this_product: [],
};

/**
 * Default for Subscription
 */
export const subscriptionDefault = {
  id: undefined,
  email: "",
  date_added: new Date(),
};

/**
 * Default for Message
 */
export const messageDefault = {
  id: undefined,
  name: "",
  subject: "",
  message: "",
  email: "",
  created_at: "",
  organization: null,
  read: false,
};

export const dept_icons: Array<{ id: number; icon: ComponentType }> = [
  {
    id: 1,
    icon: MdOutlineQuestionAnswer,
  },
  {
    id: 2,
    icon: PiGraduationCapBold,
  },
  {
    id: 3,
    icon: TbBooks,
  },
  {
    id: 4,
    icon: RiCustomerService2Line,
  },
  {
    id: 5,
    icon: PiGearBold,
  },
];

/**
 * Default for Order
 */
export const orderDefault: OrderSchema = {
  id: 0,
  organization: null,
  customer: null,
  services: [],
  products: [],
  videos: [],
  amount: 0,
  status: "pending",
  reference: null,
  created_at: new Date().toLocaleDateString(),
  service_delivered: false,
  last_updated_date: new Date().toLocaleDateString(),
};

/**
 * Default for Order Report to Admin
 */
export const orderReportDefault: OrderReportSchema = {
  totalorders: 0,
  totalcustomers: 0,
  customers: [],
};

/**
 * Default User Data
 */
export const userDefault: User = {
  id: undefined,
  avatar: null,
  avatar_url: null,
  avatar_name: null,
  is_superuser: false,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  is_staff: false,
  is_active: true,
  isOauth: false,
  Oauthprovider: null,
  emailIsVerified: false,
  twofactorIsEnabled: false,
  verificationToken: null,
  expiryTime: null,
  address: null,
  Sex: null,
  phone: null,
  last_login: null,
  date_joined: new Date(),
};

/**
 * Default for Sub-Category
 */
export const SubCategorydefault = {
  id: undefined,
  category: null,
  subcategory: "",
};
