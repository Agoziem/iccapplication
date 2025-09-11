// ContextProviders.js

import { OrganizationProvider } from "@/data/organization/Organizationalcontextdata";
import { CartProvider } from "@/data/carts/Cartcontext";
import { AdminContextProvider } from "@/data/payments/Admincontextdata";
import { Subcategoriesprovider } from "@/data/categories/Subcategoriescontext";
import { ChatroomContextProvider } from "@/data/chatroomAPI/ChatroomContext";
import { ChatroomSocketProvider } from "@/data/chatroomAPI/ChatroomSocket";
import { WhatsappAPIProvider } from "@/data/whatsappAPI/WhatsappContext";

const ContextProviders = ({ children }) => (
  <OrganizationProvider>
    <AdminContextProvider>
        <CartProvider>
          <Subcategoriesprovider>
            <ChatroomContextProvider>
              <ChatroomSocketProvider>
                <WhatsappAPIProvider>{children}</WhatsappAPIProvider>
              </ChatroomSocketProvider>
            </ChatroomContextProvider>
          </Subcategoriesprovider>
        </CartProvider>
    </AdminContextProvider>
  </OrganizationProvider>
);

export default ContextProviders;
