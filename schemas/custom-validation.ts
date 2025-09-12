import { z } from "zod";

// File upload constraints
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
// 📄 Document MIME types
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf", // PDF
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/plain", // .txt
  "text/csv", // .csv
  "application/rtf", // .rtf
];

// 🎥 Video MIME types
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4", // .mp4
  "video/x-msvideo", // .avi
  "video/x-matroska", // .mkv
  "video/webm", // .webm
  "video/quicktime", // .mov
  "video/x-flv", // .flv
  "video/mpeg", // .mpeg
];

// 🎵 Audio MIME types
export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg", // .mp3
  "audio/wav", // .wav
  "audio/ogg", // .ogg
  "audio/mp4", // .m4a
  "audio/aac", // .aac
  "audio/flac", // .flac
  "audio/webm", // .weba
];

export const optionalEmailSchema = z
  .union([z.string().email(), z.literal(""), z.undefined()])
  .optional();

export const optionalUrlSchema = z.union([
  z.string().url({ message: "Invalid URL." }),
  z.literal(""),
  z.undefined(),
]);


// Custom validation function
export const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, and .png files are allowed",
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
          message: "File size must not exceed 5 MB",
        }),
      z.string(),
    ])
    .optional();

export const videoSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => ALLOWED_VIDEO_TYPES.includes(file.type), {
        message: "Only .mp4, .avi, .mkv, .webm, .mov, .flv, and .mpeg files are allowed",
      })
      .refine((file) => file.size <= MAX_VIDEO_SIZE, {
        message: "File size must not exceed 100 MB",
      }),
    z.string(),
  ])
  .optional();

export const audioSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => ALLOWED_AUDIO_TYPES.includes(file.type), {
        message: "Only .mp3, .wav, .ogg, .m4a, .aac, .flac, and .weba files are allowed",
      })
      .refine((file) => file.size <= MAX_AUDIO_SIZE, {
        message: "File size must not exceed 10 MB",
      }),
    z.string(),
  ])
  .optional();


export const documentSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => ALLOWED_DOCUMENT_TYPES.includes(file.type), {
        message: "Invalid document type.",
      })
      .refine((file) => file.size <= MAX_DOCUMENT_SIZE, {
        message: "File size must not exceed 5 MB",
      }),
    z.string(),
  ])
  .optional();

// Reusable optional number schema
export const optionalNumberSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Value must be a valid number.",
  })
  .transform((val) => parseFloat(val!)); // Convert string to number

export const NumberSchema = z
  .string()
  .refine((value) => !isNaN(parseFloat(value)), {
    message: "Value must be a valid number.",
  })
  .transform((val) => parseFloat(val)); // Convert string to number

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
  .refine((value) => !value || /^\d{2}:\d{2}(:\d{2})?$/.test(value), {
    message: "Invalid time.",
  });

export const TimeSchema = z
  .string()
  .refine((value) => !value || /^\d{2}:\d{2}(:\d{2})?Z?$/.test(value), {
    message: "Invalid time.",
  });

// Reusable optional amount schema
export const optionalAmountSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Amount must be a valid number.",
  })
  .transform((val) => (val ? parseFloat(val) : undefined))
  .refine((val) => val === undefined || val >= 0.01, {
    message: "Amount must be greater than 0.",
  });

export const AmountSchema = z
  .string()
  .refine((value) => !isNaN(parseFloat(value)), {
    message: "Amount must be a valid number.",
  })
  .transform((val) => parseFloat(val)) // Convert string to number
  .refine((val) => val === undefined || val >= 0.01, {
    message: "Amount must be greater than 0.",
  });
