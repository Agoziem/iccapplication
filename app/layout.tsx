import "./globals.css";
import OffCanvas from "@/components/custom/Offcanvas/OffCanvas";
import Providers from "@/providers";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ICC Online Center",
  description:
    "Innovation Cybercafe is a platform that provides innovative solutions to all online and Offline related educational problems to students across the trans secondary to tertiary level.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
