import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import {
  validateUser,
  fetchOAuthUserData,
  authorizeCredentials,
  mapOAuthUserData,
  mapNonOAuthUserData,
} from "@/utils/authutils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "credentials") {
        const registeredUser = await validateUser(user.id);
        return registeredUser?.emailIsVerified !== false;
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        if (account.provider === "google" || account.provider === "github") {
          try {
            const oauthUserData = await fetchOAuthUserData(
              account.provider,
              profile
            );
            mapOAuthUserData(oauthUserData, token);
          } catch (error) {
            console.error("error:", error);
          }
        } else {
          mapNonOAuthUserData(user, token);
        }
      }
      return token;
    },
    async session({ session, token }) {
      const {
        id,
        username,
        first_name,
        last_name,
        picture,
        email,
        is_staff,
        date_joined,
        isOauth,
        emailIsVerified,
        twofactorIsEnabled,
        sex,
        phone,
        address,
        avatar,
        avatar_name,
        avatar_url,
      } = token;

      Object.assign(session.user, {
        id,
        username,
        first_name,
        last_name,
        image: picture,
        email,
        is_staff,
        date_joined,
        isOauth,
        emailIsVerified,
        twofactorIsEnabled,
        sex,
        phone,
        address,
        avatar,
        avatar_name,
        avatar_url,
      });

      return session;
    },
  },
});
