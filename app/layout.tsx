// RootLayout.tsx - TypeScript implementation
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapJs from "@/components/BootstrapJs";
import { SessionProvider } from "next-auth/react";
import OffCanvas from "@/components/custom/Offcanvas/OffCanvas";
import ContextProviders from "@/data/ContextProviders";
import Providers from "@/providers";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ICC Online Center",
  description:
    "Innovation Cybercafe is a platform that provides innovative solutions to all online and Offline related educational problems to students across the trans secondary to tertiary level.",
};

interface RootLayoutProps {
  children: ReactNode;
  session?: any; // You may want to type this more specifically based on your auth setup
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="body">
        <SessionProvider session={session}>
          <Providers>
            <ContextProviders>
              {children}
              <OffCanvas />
              <Toaster />
            </ContextProviders>
          </Providers>
        </SessionProvider>
        <BootstrapJs />
      </body>
    </html>
  );
}
