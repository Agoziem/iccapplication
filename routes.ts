
export const isPublicRouteOrIncludes = (pathname: string) => {
  return publicRoutes.some((route) => {
    if (pathname === route) {
      return true;
    }
    if (route !== "/" && pathname.startsWith(route)) {
      return true;
    }
    return false;
  });
};

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const authRoutes = [
  "/accounts/signin",
  "/accounts/signup",
  "/accounts/reset-password",
  "/accounts/new-password",
  "/accounts/new-verification",
  "/oauth_success"
];

export const publicRoutes = [
   "/",
  "/about",
  "/photos",
  "/articles",
  "/department",
  "/feedback",
];
