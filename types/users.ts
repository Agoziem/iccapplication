import { UserSchema } from "@/schemas/users";
import { z } from "zod";

export type User = z.infer<typeof UserSchema>;

export type Users = User[];
