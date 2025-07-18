import { Article, ArticleComment } from "@/types/articles";
import { Product, Service, Video } from "@/types/items";
import {
  Department,
  Organization,
  Staff,
  Testimony,
} from "@/types/organizations";
import { User } from "@/types/users";
import { WAMessage } from "@/types/whatsapp";
import { ComponentType } from "react";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { PiGearBold, PiGraduationCapBold } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbBooks } from "react-icons/tb";

export const WAMessageDefault: WAMessage = {
  id: null,
  message_id: "", 
  contact: null,
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

export const OrganizationDefault: Organization = {
  id: undefined,
  logo: null,
  Organizationlogoname: null,
  Organizationlogo: null,
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
  created_at: new Date(),
  last_updated_date: new Date(),
};

export const testimonialDefault: Testimony = {
  id: undefined,
  name: "",
  content: "",
  role: "",
  rating: 0,
  img: null,
  img_url: null,
  img_name: null,
  created_at: new Date(),
  last_updated_date: new Date(),
};

export const staffdefault: Staff = {
  id: undefined,
  first_name: "",
  last_name: "",
  other_names: "",
  email: "",
  phone: "",
  address: "",
  img: null,
  img_url: null,
  img_name: "",
  role: "",
  facebooklink: "",
  instagramlink: "",
  twitterlink: "",
  linkedinlink: "",
  created_at: new Date(),
  last_updated_date: new Date(),
};

export const deptDefault: Department = {
  id: 1,
  img: null,
  img_url: null,
  img_name: null,
  staff_in_charge: {
    id: null,
    name: "",
    img_url: "",
  },
  organization: {
    id: undefined,
    name: "",
  },
  services: [],
  name: "",
  description: "",
  created_at: new Date(),
  last_updated_date: new Date(),
};

export const ArticleDefault: Article = {
  id: undefined,
  img: null,
  img_url: null,
  img_name: null,
  title: "",
  subtitle: "",
  body: "",
  readTime: 0,
  author: {
    id: undefined,
    username: "",
    img: null,
  },
  tags: [],
  slug: null,
  category: {
    id: undefined,
    category: "",
    description: null,
  },
  date: new Date(),
  updated_at: new Date(),
  views: 0,
};

export const ArticleCommentDefault: ArticleComment = {
  id: undefined,
  user: {
    id: undefined,
    username: "",
    img: null,
  },
  blog: 1, // Assuming blog is a number ID
  comment: "",
  date: new Date(),
  updated_at: new Date(),
};

export const VideoDefault: Video = {
  id: undefined,
  organization: null,
  thumbnail: null,
  video: null,
  video_url: null,
  video_name: null,
  img_url: null,
  img_name: null,
  category: {
    id: undefined,
    category: "",
    description: null,
  },
  subcategory: {
    id: undefined,
    category: {
      id: undefined,
      category: "",
      description: null,
    },
    subcategory: "",
  },
  title: "",
  description: "",
  price: "",
  video_token: "",
  created_at: new Date(),
  updated_at: new Date(),
  free: false,
  userIDs_that_bought_this_video: [],
};

export const serviceDefault: Service = {
  id: undefined,
  organization: null,
  preview: null,
  img_url: null,
  img_name: null,
  category: null,
  subcategory: null,
  name: "",
  description: null,
  service_flow: null,
  price: "",
  number_of_times_bought: 0,
  userIDs_that_bought_this_service: [],
  userIDs_whose_services_is_in_progress: [],
  userIDs_whose_services_have_been_completed: [],
  details_form_link: null,
  created_at: new Date(),
  updated_at: new Date(),
};

/**
 * Default for a Product
 */
export const defaultProduct: Product = {
  id: undefined,
  organization: null,
  preview: null,
  img_url: null,
  img_name: null,
  product: null,
  product_url: null,
  product_name: null,
  category: null,
  subcategory: null,
  name: null,
  description: "No description available",
  price: "",
  rating: 0,
  product_token: "",
  digital: true,
  created_at: new Date(),
  last_updated_date: new Date(),
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
export const orderDefault = {
  id: undefined,
  organization: null,
  customer: null,
  services: [],
  products: [],
  videos: [],
  amount: null,
  status: null,
  reference: null,
  created_at: new Date(),
  service_delivered: false,
  last_updated_date: new Date(),
};

/**
 * Default for Order Report to Admin
 */
export const orderReportDefault = {
  totalorders: null,
  totalcustomers: null,
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
