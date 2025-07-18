export interface Year {
  id?: number;
  year: number;
}

export type Years = Year[];

export interface Testtype {
  id?: number;
  testtype: string;
}

export type Testtypes = Testtype[];

export interface Answer {
  id?: number;
  answertext: string;
}

export type Answers = Answer[];

export interface Question {
  id?: number;
  questiontext: string;
  questionMark?: number;
  required?: boolean;
  answers: number[];
  correctAnswer: number | null;
  correctAnswerdescription?: string | null;
}

export type Questions = Question[];

export interface Subject {
  id?: number;
  subjectduration?: number;
  subjectname: string;
  questions: number[];
}

export type Subjects = Subject[];

export interface Test {
  id?: number;
  testorganization: number | null;
  texttype: number | null;
  testSubject: number[];
  testYear: number | null;
}

export type Tests = Test[];

export interface Testresult {
  id?: number;
  organization: number | null;
  tests: number[];
  user: number | null;
  mark?: number;
  date?: Date;
}

export type Testresulls = Testresult[];
