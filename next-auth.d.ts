import NextAuth, { type DefaultSession } from "next-auth";

// Define the ExtendedUser type based on CustomUser schema
export type ExtendedUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null; // If avatar image URL or path
  is_staff: boolean;
  date_joined: Date; // Can be Date or string format
  isOauth: boolean;
  emailIsVerified: boolean;
  twofactorIsEnabled: boolean;
  sex: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null; // The image file URL for the avatar
  avatar_name: string | null; // Optional if you have a name for avatar
  avatar_url: string | null; // Optional if you have a different URL for avatar
} & DefaultSession["user"];

// Extend NextAuth session to include ExtendedUser type
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}