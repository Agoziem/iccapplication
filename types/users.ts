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

export interface UserListResponse {
  users: User[];
}

export interface PaginatedUserResponse {
  count: number;
  items: User[];
}

export interface UserMini {
  id: number;
  username: string;
  img?: string | null;
}

export interface UserMiniExtension {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  date_joined: string;
}


