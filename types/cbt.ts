import { z } from "zod";
import {
  yearSchema,
  yearArraySchema,
  testTypeSchema,
  testTypeArraySchema,
  answerSchema,
  answerArraySchema,
  answerCreateSchema,
  questionSchema,
  questionArraySchema,
  createQuestionSchema,
  subjectSchema,
  subjectArraySchema,
  createSubjectSchema,
  testSchema,
  testArraySchema,
  createTestSchema,
  studentTestRequestSchema,
  questionAnswerSchema,
  testSubmissionSchema,
  testScoreResponseSchema,
  testResultSchema,
  testResultArraySchema
} from "../schemas/cbt";

// Extract TypeScript types from Zod schemas
export type Year = z.infer<typeof yearSchema>;
export type YearArray = z.infer<typeof yearArraySchema>;

export type TestType = z.infer<typeof testTypeSchema>;
export type TestTypeArray = z.infer<typeof testTypeArraySchema>;

export type Answer = z.infer<typeof answerSchema>;
export type AnswerArray = z.infer<typeof answerArraySchema>;
export type AnswerCreate = z.infer<typeof answerCreateSchema>;

export type Question = z.infer<typeof questionSchema>;
export type QuestionArray = z.infer<typeof questionArraySchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;

export type Subject = z.infer<typeof subjectSchema>;
export type SubjectArray = z.infer<typeof subjectArraySchema>;
export type CreateSubject = z.infer<typeof createSubjectSchema>;

export type Test = z.infer<typeof testSchema>;
export type TestArray = z.infer<typeof testArraySchema>;
export type CreateTest = z.infer<typeof createTestSchema>;

export type StudentTestRequest = z.infer<typeof studentTestRequestSchema>;
export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;
export type TestSubmission = z.infer<typeof testSubmissionSchema>;
export type TestScoreResponse = z.infer<typeof testScoreResponseSchema>;

export type TestResult = z.infer<typeof testResultSchema>;
export type TestResultArray = z.infer<typeof testResultArraySchema>;

// Additional utility types
export type QuestionPreview = Pick<Question, 'id' | 'questiontext' | 'questionMark'>;
export type SubjectSummary = Pick<Subject, 'id' | 'subjectname' | 'subjectduration'>;
export type TestSummary = Pick<Test, 'id' | 'testYear' | 'texttype'>;
export type AnswerOption = Pick<Answer, 'id' | 'answertext'>;
export type TestScore = {
  subjectName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
};