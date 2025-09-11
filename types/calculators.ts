import { z } from "zod";
import {
  jamb_postutme_schema,
  olevel_subject_schema,
  aggregator_schema,
  cgpa_course_schema,
  cgpa_schema
} from "../schemas/calculators";

// Extract TypeScript types from Zod schemas
export type JambPostUtme = z.infer<typeof jamb_postutme_schema>;
export type OLevelSubject = z.infer<typeof olevel_subject_schema>;
export type Aggregator = z.infer<typeof aggregator_schema>;
export type CgpaCourse = z.infer<typeof cgpa_course_schema>;
export type Cgpa = z.infer<typeof cgpa_schema>;

// Additional utility types
export type OLevelGrade = "A1" | "B2" | "B3" | "C4" | "C5" | "C6";
export type CgpaGrade = "5" | "4" | "3" | "2" | "1" | "0";

export type CalculatorResult = {
  score: number;
  percentage?: number;
  grade?: string;
  remarks?: string;
};

export type AggregatorResult = CalculatorResult & {
  jambContribution: number;
  postUtmeContribution?: number;
  olevelContribution?: number;
  breakdown: {
    jamb: number;
    postUTME?: number;
    oLevel?: number;
  };
};

export type CgpaResult = CalculatorResult & {
  totalCreditUnits: number;
  totalQualityPoints: number;
  cgpa: number;
  classification?: string;
};

export type CourseGradePoint = {
  grade: CgpaGrade;
  points: number;
  description: string;
};

export type OLevelGradePoint = {
  grade: OLevelGrade;
  points: number;
  description: string;
};
