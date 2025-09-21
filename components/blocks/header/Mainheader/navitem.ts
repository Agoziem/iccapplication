import { v4 as uuidv4 } from "uuid";

interface NavItem {
  id: string;
  title: string;
  link: string;
}

const navlist: NavItem[] = [
  {
    id: uuidv4(),
    title: "Home",
    link: "/",
  },
  {
    id: uuidv4(),
    title: "Services",
    link: "/services",
  },
  {
    id: uuidv4(),
    title: "Products",
    link: "/products",
  },
  {
    id: uuidv4(),
    title: "Videos",
    link: "/videos",
  },
  {
    id: uuidv4(),
    title: "Departments",
    link: "/#staffs",
  },
  {
    id: uuidv4(),
    title: "Articles",
    link: "/articles",
  },
  {
    id: uuidv4(),
    title: "Contact",
    link: "/#contact",
  },
];

export default navlist;
