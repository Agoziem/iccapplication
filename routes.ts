export const publicRoutes = [
  "/",
  "/about",
  "/photos",
  "/articles",
  "/department",
  "/feedback",
  "/services",
  "/products",
  "/videos"
];

export const isPublicRouteOrIncludes = (pathname : string) => {
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

export const authRoutes = [
  "/accounts/signin",
  "/accounts/signup",
  "/accounts/reset-password",
  "/accounts/new-password",
  "/accounts/new-verification",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
