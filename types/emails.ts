import {
  emailMessageSchema,
  emailResponseSchema,
  emailSchema,
  messageSchema,
  MessageWebsocketSchema,
} from "@/schemas/emails";
import { z } from "zod";

  export type Email = z.infer<typeof emailSchema>;

  export type EmailArrays = Email[];

  export type EmailResponse = z.infer<typeof emailResponseSchema>;

  export type EmailResponseArray = EmailResponse[];

  export type EmailWebsocket = z.infer<typeof MessageWebsocketSchema>;

  export type EmailMessage = z.infer<typeof emailMessageSchema>;

  export type EmailMessageArray = EmailMessage[];

  export type Message = z.infer<typeof messageSchema>;

