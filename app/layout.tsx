// RootLayout.js (or RootLayout.tsx if using TypeScript)
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import OffCanvas from "@/components/custom/Offcanvas/OffCanvas";
import Providers from "@/providers";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { Metadata } from "next";
import BootstrapJs from "@/components/BootstrapJs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GOOGLE_MEASUREMENT_ID, SITE_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "ICC Online Center",
  description:
    "Innovation Cybercafe is a platform that provides innovative solutions to all online and Offline related educational problems to students across the trans secondary to tertiary level.",
  openGraph: {
    title: "ICC Online Center",
    description:
      "Innovation Cybercafe is a platform that provides innovative solutions to all online and Offline related educational problems to students across the trans secondary to tertiary level.",
    url: SITE_URL,
    siteName: "ICC Online Center",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="body">
        <Providers>
          {children}
          <OffCanvas />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
          <BootstrapJs />
          <GoogleAnalytics gaId={GOOGLE_MEASUREMENT_ID} />
        </Providers>
      </body>
    </html>
  );
}
