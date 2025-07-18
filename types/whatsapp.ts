import {
  WAContactSchema,
  WAContactWebsocketSchema,
  WAMessageSchema,
  WAMessageWebsocketSchema,
  WATemplateArraySchema,
  WATemplateSchema,
} from "@/schemas/whatsapp";

import { z } from "zod";

export type WAContact = z.infer<typeof WAContactSchema>;

export type WAContacts = WAContact[];

export type WAMessage = z.infer<typeof WAMessageSchema>;

export type WAMessages = WAMessage[];

export type WAContactSocket = z.infer<typeof WAContactWebsocketSchema>;

export type WAMessagesSocket = z.infer<typeof WAMessageWebsocketSchema>;

export type WATemplate = z.infer<typeof WATemplateSchema>;

export type WATemplateArray = z.infer<typeof WATemplateArraySchema>;
