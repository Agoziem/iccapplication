import { z } from "zod";

export const optionalEmailSchema = z
  .union([z.string().email(), z.literal(""), z.undefined()])
  .optional();

export const optionalUrlSchema = z.union([
  z.string().url({ message: "Invalid URL." }),
  z.literal(""),
  z.undefined(),
]);

// Custom validation function
export const imageSchema = z.union([
  optionalUrlSchema,
  z.instanceof(File, { message: "Invalid file type" }), // Allowing File upload
]);

// Resuable optional number schema
export const optionalNumberSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? undefined : parsed;
}, z.number().optional());

export const NumberSchema = z.preprocess((val) => {
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? undefined : parsed;
}, z.number());

// Reusable Rating schema
export const optionalRatingSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? undefined : parsed;
}, z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").optional());

export const RatingSchema = z.preprocess((val) => {
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? undefined : parsed;
}, z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"));

// Reusable optional phone number schema
export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{11}$/.test(value), {
    message: "Invalid phone number.",
  });

export const PhoneSchema = z
  .string()
  .refine((value) => /^\d{11}$/.test(value), {
    message: "Invalid phone number.",
  });

// Reusable optional date schema
export const optionalDateSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Invalid date.",
  });

export const DateSchema = z
  .string()
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Invalid date.",
  });

// Reusable optional time schema
export const optionalTimeSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{2}:\d{2}$/.test(value), {
    message: "Invalid time.",
  });

export const TimeSchema = z
  .string()
  .refine((value) => /^\d{2}:\d{2}$/.test(value), {
    message: "Invalid time.",
  });

export const optionalAmountSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? undefined : parsed;
}, z.number().min(0.01, "Amount must be greater than 0.").optional());

export const AmountSchema = z.preprocess((val) => {
  if (typeof val === "string" || typeof val === "number") {
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}, z.number().min(0.01, "Amount must be greater than 0."));
