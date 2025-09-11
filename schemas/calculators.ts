import { z } from "zod";

// Validation schema for JAMB and Post-UTME scores
export const jamb_postutme_schema = z.object({
  jamb: z
    .string()
    .min(1, "JAMB score is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 400, {
      message: "JAMB score must be a number between 0 and 400"
    }),
  postUTME: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true; // Optional field
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 400;
    }, {
      message: "Post-UTME score must be a number between 0 and 400"
    })
});

// O-Level subject schema
export const olevel_subject_schema = z.object({
  id: z.string(),
  subject: z.string().min(1, "Subject name is required"),
  grade: z.enum(["A1", "B2", "B3", "C4", "C5", "C6"], {
    required_error: "Grade is required",
    invalid_type_error: "Please select a valid grade"
  })
});

// Aggregator calculator schema
export const aggregator_schema = z.object({
  jamb: z
    .string()
    .min(1, "JAMB score is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 400, {
      message: "JAMB score must be between 0 and 400"
    }),
  postUTME: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 400;
    }, {
      message: "Post-UTME score must be between 0 and 400"
    }),
  olevelSubjects: z.array(olevel_subject_schema).optional(),
  usePostUTME: z.boolean(),
  useOLevel: z.boolean(),
  isPostUTMEOver100: z.boolean()
});

// CGPA course schema
export const cgpa_course_schema = z.object({
  _id: z.string(),
  CourseCode: z.string().min(1, "Course code is required"),
  CreditUnit: z
    .string()
    .min(1, "Credit unit is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 6, {
      message: "Credit unit must be a positive number between 1 and 6"
    }),
  Grade: z.enum(["5", "4", "3", "2", "1", "0"], {
    required_error: "Grade is required",
    invalid_type_error: "Please select a valid grade"
  })
});

// CGPA calculator schema
export const cgpa_schema = z.object({
  courses: z
    .array(cgpa_course_schema)
    .min(1, "At least one course is required")
    .refine((courses) => {
      const totalCredits = courses.reduce((sum, course) => {
        return sum + (isNaN(Number(course.CreditUnit)) ? 0 : Number(course.CreditUnit));
      }, 0);
      return totalCredits > 0;
    }, {
      message: "Total credit units must be greater than 0"
    })
});

export default {
  jamb_postutme_schema,
  olevel_subject_schema,
  aggregator_schema,
  cgpa_course_schema,
  cgpa_schema
};
