import { z } from "zod";

// CreateYearSchema
export const CreateYearSchema = z.object({
  year: z.number(),
});

// UpdateYearSchema
export const UpdateYearSchema = z.object({
  year: z.number().optional(),
});

// CreateTestTypeSchema
export const CreateTestTypeSchema = z.object({
  testtype: z.string(),
});

// UpdateTestTypeSchema
export const UpdateTestTypeSchema = z.object({
  testtype: z.string().optional(),
});

// CreateAnswerSchema
export const CreateAnswerSchema = z.object({
  answertext: z.string(),
  isCorrect: z.boolean().optional().default(false),
});

// UpdateAnswerSchema
export const UpdateAnswerSchema = z.object({
  answertext: z.string().optional(),
  isCorrect: z.boolean().optional(),
});

// CreateQuestionSchema
export const CreateQuestionSchema = z.object({
  questiontext: z.string(),
  questionMark: z.number().optional().default(0),
  required: z.boolean().optional().default(true),
  correctAnswerdescription: z.string().nullable().optional(),
  answers: z.array(CreateAnswerSchema),
});

// UpdateQuestionSchema
export const UpdateQuestionSchema = z.object({
  questiontext: z.string().optional(),
  questionMark: z.number().optional(),
  required: z.boolean().optional(),
  correctAnswerdescription: z.string().nullable().optional(),
  answers: z.array(CreateAnswerSchema),
});

// CreateSubjectSchema
export const CreateSubjectSchema = z.object({
  subjectname: z.string(),
  subjectduration: z.number().optional().default(0),
});

// UpdateSubjectSchema
export const UpdateSubjectSchema = z.object({
  subjectname: z.string().optional(),
  subjectduration: z.number().optional(),
});

// CreateTestSchema
export const CreateTestSchema = z.object({
  testYear: z.number(),
  texttype: z.number(),
  testorganization: z.number().nullable().optional(),
});

// UpdateTestSchema
export const UpdateTestSchema = z.object({
  testYear: z.number().optional(),
  texttype: z.number().optional(),
  testorganization: z.number().nullable().optional(),
});


// ======================================================
// Additional schemas for test submission and student requests
// ======================================================

// Individual Question + Answer pairing
export const QuestionAnswerSchema = z.object({
  question_id: z.number(),
  selected_answer_id: z.number().nullable().optional(),
});

// Student submitting answers for a test
export const TestSubmissionSchema = z.object({
  student_test_id: z.number(),
  questions: z.array(QuestionAnswerSchema),
});

// Student requesting to begin a test
export const StudentTestRequestSchema = z.object({
  user_id: z.number(),
  test_id: z.number(),
  subject_ids: z.array(z.number()),
});


// Auto-inferred types from Zod:
export type CreateYearDTO = z.infer<typeof CreateYearSchema>;
export type UpdateYearDTO = z.infer<typeof UpdateYearSchema>;

export type CreateTestTypeDTO = z.infer<typeof CreateTestTypeSchema>;
export type UpdateTestTypeDTO = z.infer<typeof UpdateTestTypeSchema>;

export type CreateAnswerDTO = z.infer<typeof CreateAnswerSchema>;
export type UpdateAnswerDTO = z.infer<typeof UpdateAnswerSchema>;

export type CreateQuestionDTO = z.infer<typeof CreateQuestionSchema>;
export type UpdateQuestionDTO = z.infer<typeof UpdateQuestionSchema>;

export type CreateSubjectDTO = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectDTO = z.infer<typeof UpdateSubjectSchema>;

export type CreateTestDTO = z.infer<typeof CreateTestSchema>;
export type UpdateTestDTO = z.infer<typeof UpdateTestSchema>;

export type QuestionAnswerDTO = z.infer<typeof QuestionAnswerSchema>;
export type TestSubmissionDTO = z.infer<typeof TestSubmissionSchema>;
export type StudentTestRequestDTO = z.infer<typeof StudentTestRequestSchema>;