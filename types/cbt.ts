import {
  answerSchema,
  questionSchema,
  subjectSchema,
  testResultSchema,
  testSchema,
  testTypeSchema,
  yearSchema,
} from "@/schemas/cbt";
import { z } from "zod";

export type Year = z.infer<typeof yearSchema>;

export type Years = Year[];

export type Testtype = z.infer<typeof testTypeSchema>;

export type Testtypes = Testtype[];

export type Answer = z.infer<typeof answerSchema>;

export type Answers = Answer[];

export type Question = z.infer<typeof questionSchema>;

export type Questions = Question[];

export type Subject = z.infer<typeof subjectSchema>;

export type Subjects = Subject[];

export type Test = z.infer<typeof testSchema>;

export type Tests = Test[];

export type Testresult = z.infer<typeof testResultSchema>;

export type Testresulls = Testresult[];
