"use client";

import React from "react";
import { OrganizationProvider } from "@/providers/context/Organizationalcontextdata";
import { CartProvider } from "@/providers/context/Cartcontext";
import { AdminContextProvider } from "@/providers/context/Admincontextdata";
import { ChatroomContextProvider } from "@/providers/context/ChatroomContext";
import { ChatroomSocketProvider } from "@/providers/context/ChatroomSocket";
import { WhatsappAPIProvider } from "@/providers/context/WhatsappContext";
import { SidebartoggleRefProvider } from "@/components/blocks/sidebar/sideBarTogglerContext";
import { HasCheckedProvider } from "./NotificationChecked";

type ReactNode = React.ReactNode;

interface ContextProvidersProps {
  children: ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => (
  <OrganizationProvider>
    <AdminContextProvider>
      <SidebartoggleRefProvider>
        <CartProvider>
          <ChatroomContextProvider>
            <ChatroomSocketProvider>
              <WhatsappAPIProvider>
                <HasCheckedProvider>
                  {children}
                </HasCheckedProvider>
              </WhatsappAPIProvider>
            </ChatroomSocketProvider>
          </ChatroomContextProvider>
        </CartProvider>
      </SidebartoggleRefProvider>
    </AdminContextProvider>
  </OrganizationProvider>
);

export default ContextProviders;
