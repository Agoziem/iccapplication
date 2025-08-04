// ContextProviders.js

import { CartProvider } from "@/data/Cartcontext";
import { AdminContextProvider } from "@/data/payments/Admincontextdata";
import { WhatsappAPIProvider } from "@/data/whatsappAPI/WhatsappContext";

const ContextProviders = ({ children }: { children: React.ReactNode }) => (
  <AdminContextProvider>
    <CartProvider>
      <WhatsappAPIProvider>{children}</WhatsappAPIProvider>
    </CartProvider>
  </AdminContextProvider>
);

export default ContextProviders;
