// ContextProviders.tsx

import React, { ReactNode } from "react";
import { OrganizationProvider } from "@/providers/context/Organizationalcontextdata";
import { CartProvider } from "@/providers/context/Cartcontext";
import { AdminContextProvider } from "@/providers/context/Admincontextdata";
import { ChatroomContextProvider } from "@/providers/context/ChatroomContext";
import { ChatroomSocketProvider } from "@/providers/context/ChatroomSocket";
import { WhatsappAPIProvider } from "@/providers/context/WhatsappContext";

interface ContextProvidersProps {
  children: ReactNode;
}

const ContextProviders: React.FC<ContextProvidersProps> = ({ children }) => (
  <OrganizationProvider>
    <AdminContextProvider>
        <CartProvider>
            <ChatroomContextProvider>
              <ChatroomSocketProvider>
                <WhatsappAPIProvider>{children}</WhatsappAPIProvider>
              </ChatroomSocketProvider>
            </ChatroomContextProvider>
        </CartProvider>
    </AdminContextProvider>
  </OrganizationProvider>
);

export default ContextProviders;
