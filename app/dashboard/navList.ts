import { v4 as uuidv4 } from 'uuid';

const navList = [
  {
    _id: uuidv4(),
    name: "Dashboard",
    icon: "bi bi-speedometer2",
    link: "/dashboard",
  },
  {
    _id: uuidv4(),
    name: "Services",
    icon: "bi bi-person-gear",
    link: "/dashboard/services",
  },
  {
    _id: uuidv4(),
    name: "Products",
    icon: "bi bi-basket2",
    link: "/dashboard/products",
  },
  {
    _id: uuidv4(),
    name: "Videos",
    icon: "bi bi-camera-reels",
    link: "/dashboard/videos",
  },
  {
    _id: uuidv4(),
    name: "My Orders",
    icon: "bi bi-cart3",
    link: "/dashboard/my-orders",
  },
  {
    _id: uuidv4(),
    name: "Calculator",
    icon: "bi bi-calculator",
    link: "/dashboard/calculator",
  },
  {
    _id: uuidv4(),
    name: "CBT Practice",
    icon: "bi bi-laptop",
    link: "/dashboard/cbt",
  },
  {
    _id: uuidv4(),
    name: "Chat",
    icon: "bi bi-wechat",
    link: "/dashboard/chat",
  },
  {
    _id: uuidv4(),
    name: "Payments",
    icon: "bi bi-cash-coin",
    link: "/dashboard/payments",
  },
  {
    _id: uuidv4(),
    name: "Customers",
    icon: "bi bi-people",
    link: "/dashboard/customers",
  },
  {
    _id: uuidv4(),
    name: "Configurations",
    icon: "bi bi-gear",
    link: "#",
    content: [
      {
        _id: uuidv4(),
        name: "Homepage",
        icon: "bi bi-house",
        link: "/dashboard/configuration/homepage",
      },
      {
        _id: uuidv4(),
        name: "Services & Applications",
        icon: "bi bi-person-gear",
        link: "/dashboard/configuration/services",
      },
      {
        _id: uuidv4(),
        name: "Products",
        icon: "bi bi-basket2",
        link: "/dashboard/configuration/products",
      },
      {
        _id: uuidv4(),
        name: "Videos",
        icon: "bi bi-camera-reels",
        link: "/dashboard/configuration/videos",
      },
      {
        _id: uuidv4(),
        name: "Articles",
        icon: "bi bi-journal-bookmark-fill",
        link: "/dashboard/configuration/articles",
      },
      {
        _id: uuidv4(),
        name: "CBTPractice",
        icon: "bi bi-laptop",
        link: "/dashboard/configuration/cbt",
      },
      {
        _id: uuidv4(),
        name: "Messaging & notifications",
        icon: "bi bi-bell",
        link: "/dashboard/configuration/messaging",
      },
      {
        _id: uuidv4(),
        name: "Emails",
        icon: "bi bi-envelope-paper",
        link: "/dashboard/configuration/emails",
      },
      {
        _id: uuidv4(),
        name: "WhatsappAPI",
        icon: "bi bi-whatsapp",
        link: "/dashboard/configuration/whatsapp",
      },
    ],
  },
  {
    _id: uuidv4(),
    name: "Profile",
    icon: "bi bi-person-circle",
    link: "/dashboard/profile",
  },
  {
    _id: uuidv4(),
    name: "Logout",
    icon: "bi bi-box-arrow-in-right",
    link: "#",
  },
];

export default navList;
