import { MdOutlineQuestionAnswer } from "react-icons/md";
import { PiGearBold, PiGraduationCapBold } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbBooks } from "react-icons/tb";

/**
 * @type {WAMessage}
 */
export const WAMessageDefault = {
  id: null, // Default to null, since it's optional
  message_id: "", // Default to an empty string
  contact: null, // Default to null for optional positive number
  message_type: "text", // Default to "text"
  body: "", // Default to an empty string for the text message body
  media_id: "", // Default to an empty string for the media message ID
  mime_type: "", // Default to an empty string for MIME type
  filename: "", // Default to an empty string for filename
  animated: false, // Default to false for stickers
  caption: "", // Default to an empty string for media caption
  timestamp: new Date().toISOString(), // Default to the current timestamp
  message_mode: "received", // Default to "received"
  seen: false, // Default to false for seen status
  link: "https://www.example.com", // Default to an empty string for media link
  status: "pending", // Default to "pending" for message status
};

/**
 * Default for Organization Data
 * @type {Organization }}
 */
export const OrganizationDefault = {
  id: null,
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

/**
 * Default for Testimonials
 * @type {Testimony}
 */
export const testimonialDefault = {
  id: null,
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

/**
 * Default for Staff
 * @type {Staff}
 */
export const staffdefault = {
  id: null,
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

/**
 * Default for Department
 * @type {Department}
 */
export const deptDefault = {
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
    id: null,
    name: "",
  },
  services: [],
  name: "",
  description: "",
  created_at: new Date(),
  last_updated_date: new Date(),
};

/**
 * Default for Article
 * @type {Article}
 */
export const ArticleDefault = {
  id: null,
  img: null,
  img_url: null,
  img_name: "",
  title: "",
  subtitle: "",
  body: null,
  // author_id: null,
  author: {
    id: null,
    username: "",
    img: "",
  },
  // tag_ids: [],
  tags: [],
  slug: "",
  // category_id: null,
  category: {
    id: null,
    category: "",
    description: "",
  },
  readTime: 0,
};

/**
 * Artcle Comment Default
 * @type {ArticleComment}
 */
export const ArticleCommentDefault = {
  id: null,
  user: {},
  blog: null,
  comment: "",
  date: new Date(),
  updated_at: new Date()
};

/**
 * Description placeholder
 *
 * @type {Video}
 */
export const VideoDefault = {
  id: null,
  organization: {},
  thumbnail: null,
  video: null,
  video_url: null,
  video_name: null,
  img_url: null,
  img_name: null,
  category: {},
  subcategory: {},
  title: "",
  description: "",
  price: "",
  video_token: "",
  created_at: new Date(),
  updated_at: new Date(),
  free: false,
  userIDs_that_bought_this_video: [],
};

/**
 * Default of Service
 * @type {Service}
 */
export const serviceDefault = {
  id: null,
  organization: {},
  preview: null,
  img_url: null,
  img_name: null,
  category: {},
  subcategory: {},
  name: "",
  description: "",
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
 * @type {Product}
 */
export const defaultProduct = {
  id: 3,
  organization: {},
  preview: null,
  img_url: null,
  img_name: null,
  product: null,
  product_url: null,
  product_name: null,
  category: {},
  subcategory: {},
  name: "",
  description: "",
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
 * @type {Subscription}
 */
export const subscriptionDefault = {
  id: null,
  email: "",
  date_added: new Date(),
};

/**
 * Default for Message
 * @type {Email}
 */
export const messageDefault = {
  id: null,
  name: "",
  subject: "",
  message: "",
  email: "",
  created_at: "",
  organization: null,
  read: false,
};

export const dept_icons = [
  {
    id: 1,
    icon: <MdOutlineQuestionAnswer />,
  },
  {
    id: 2,
    icon: <PiGraduationCapBold />,
  },
  {
    id: 3,
    icon: <TbBooks />,
  },
  {
    id: 4,
    icon: <RiCustomerService2Line />,
  },
  {
    id: 5,
    icon: <PiGearBold />,
  },
];

/**
 * Default for Order
 * @type {Order}
 */
export const orderDefault = {
  id: null,
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
 * @type {OrderReport}
 */

export const orderReportDefault = {
  totalorders: null,
  totalcustomers: null,
  customers: [],
};

/**
 * Default User Data
 *
 * @type {User}
 */
export const userDefault = {
  id: null,
  avatar: null,
  avatar_url: null,
  avatar_name: null,
  is_superuser: true,
  username: null,
  first_name: null,
  last_name: null,
  email: null,
  is_staff: true,
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
  last_login: new Date(),
  date_joined: new Date(),
};

/**
 * Default for Sub-Category
 *
 * @type {SubCategory}
 */
export const SubCategorydefault = {
  id: null,
  category: null,
  subcategory: "",
};
