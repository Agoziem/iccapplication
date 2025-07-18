// User mini interface for references
export interface UserMini {
  id?: number;
  username: string;
  img?: string | null;
}

// Main user interface with all authentication and profile fields
export interface User {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string | null;
  avatar_url?: string | null;
  avatar_name?: string | null;
  isOauth?: boolean;
  Oauthprovider?: string | null;
  emailIsVerified?: boolean;
  twofactorIsEnabled?: boolean;
  verificationToken?: string | null;
  expiryTime?: Date | null;
  address?: string | null;
  Sex?: string | null;
  phone?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  date_joined?: Date;
  last_login?: Date | null;
}

// Array of users
export type Users = User[];

// Response interface for paginated user results
export interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
