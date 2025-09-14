import { z } from "zod";

export const yearSchema = z.object({
  id: z.number().optional(),
  year: z.number().min(1900),
});


export const yearArraySchema = z.array(yearSchema);


export const testTypeSchema = z.object({
  id: z.number().optional(),
  testtype: z.string().min(1, { message: "Test type is required" }).max(255),
});


export const testTypeArraySchema = z.array(testTypeSchema);


export const answerSchema = z.object({
  id: z.number().optional(),
  answertext: z.string().min(1, { message: "Answer text is required" }).max(255),
  isCorrect: z.boolean().default(false),
});


export const answerArraySchema = z.array(answerSchema);


export const answerCreateSchema = z.object({
  answertext: z.string().min(1, { message: "Answer text is required" }).max(255),
  isCorrect: z.boolean().default(false),
});


export const questionSchema = z.object({
  id: z.number().optional(),
  answers: z.array(answerSchema).default([]),
  correctAnswerdescription: z.string().optional(),
  questiontext: z.string(),
  questionMark: z.number().default(0),
  required: z.boolean().default(false),
});


export const questionArraySchema = z.array(questionSchema);


export const createQuestionSchema = z.object({
  questiontext: z.string(),
  questionMark: z.number().default(0),
  correctAnswerdescription: z.string().optional(),
  answers: z.array(answerCreateSchema).min(1, { message: "At least one answer is required" }),
});


export const subjectSchema = z.object({
  id: z.number().optional(),
  questions: z.array(questionSchema).default([]),
  subjectduration: z.number().default(0),
  subjectname: z.string().min(1, { message: "Subject name is required" }).max(255),
});


export const subjectArraySchema = z.array(subjectSchema);


export const createSubjectSchema = z.object({
  subjectname: z.string().min(1, { message: "Subject name is required" }).max(255),
  subjectduration: z.number().default(0),
  questions: z.array(z.object({}).passthrough()).default([]),
});


export const testSchema = z.object({
  id: z.number().optional(),
  testYear: yearSchema,
  texttype: testTypeSchema,
  testSubject: z.array(subjectSchema).default([]),
  testorganization: z.number(),
});


export const testArraySchema = z.array(testSchema);


// test subjects can be optionally included during test creation
export const createTestSchema = z.object({
  testYear: z.number(),
  texttype: z.number(),
  testSubject: z.array(z.number()).optional(),
});

export const subjectidSchema = z.object({
  id: z.number(),
});

export const studentTestRequestSchema = z.object({
  user_id: z.number(),
  test_id: z.number(),
  examSubjects: z.array(subjectidSchema),
});


export const questionAnswerSchema = z.object({
  question_id: z.number(),
  answer_id: z.number(),
});

export const testSubmissionSchema = z.object({
  student_test_id: z.number(),
  questions: z.array(questionAnswerSchema),
});


export const testScoreResponseSchema = z.object({
  Total: z.number(),
});


export const testResultSchema = z.object({
  id: z.number().optional(),
  tests: z.array(testSchema),
  mark: z.number().default(0),
  date: z.coerce.date().optional(),
  organization: z.number(),
  user: z.number(),
});


export const testResultArraySchema = z.array(testResultSchema);
