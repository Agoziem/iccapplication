// RootLayout.js (or RootLayout.tsx if using TypeScript)
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapJs from "@/components/BootstrapJs";
import OffCanvas from "@/components/custom/Offcanvas/OffCanvas";
import Providers from "@/providers";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ICC Online Center",
  description:
    "Innovation Cybercafe is a platform that provides innovative solutions to all online and Offline related educational problems to students across the trans secondary to tertiary level.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="body">
        <Providers>
          {children}
          <OffCanvas />
          <Toaster />
        </Providers>
        <BootstrapJs />
      </body>
    </html>
  );
}
