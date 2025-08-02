// ContextProviders.js

import { OrganizationProvider } from "@/data/Organizationalcontextdata";
import { CartProvider } from "@/data/Cartcontext";
import { AdminContextProvider } from "@/data/payments/Admincontextdata";
import { Subcategoriesprovider } from "@/data/categories/Subcategoriescontext";
import { WhatsappAPIProvider } from "@/data/whatsappAPI/WhatsappContext";

const ContextProviders = ({ children }: { children: React.ReactNode }) => (
  <OrganizationProvider>
    <AdminContextProvider>
      <CartProvider>
        <Subcategoriesprovider>
            <WhatsappAPIProvider>{children}</WhatsappAPIProvider>
        </Subcategoriesprovider>
      </CartProvider>
    </AdminContextProvider>
  </OrganizationProvider>
);

export default ContextProviders;
