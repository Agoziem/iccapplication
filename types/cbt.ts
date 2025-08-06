export interface Answer {
  id: number;
  answertext: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  questiontext: string;
  questionMark: number;
  required: boolean;
  correctAnswerdescription?: string | null;
  answers: Answer[];
}

export interface Subject {
  id: number;
  subjectname: string;
  subjectduration: number;
  questions: Question[];
}

export interface TestType {
  id: number;
  testtype: string;
}

export interface Year {
  id: number;
  year: number;
}

export interface Test {
  id: number;
  testYear: Year | null;
  texttype: TestType | null;
  testSubject: Subject[];
}

export interface TestSummary {
  id: number;
  testYear: Year | null;
  texttype: TestType | null;
  subjects_count: number;
}

export interface TestSubmissionDetail {
  subject_name: string;
  selected_answers: number[];
  subject_score: number;
}

export interface TestResult {
  id: number;
  test: Test;
  user: number;
  mark: number;
  date: string;
  test_submission_details: TestSubmissionDetail[];
}

// SubjectSummarySchema
export type SubjectSummary = {
  id: number;
  subjectname: string;
  subjectduration: number;
  questions_count: number;
  questions: Question[];
};

// StudentsTestListing
export type StudentsTestListing = {
  test_id: number;
  test_name: string;
  subjects: SubjectSummary[];
  total_questions: number;
  total_marks: number;
  duration: number;
};
