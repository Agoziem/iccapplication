import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  fetchYears,
  createYear,
  updateYear,
  deleteYear,
  fetchTestTypes,
  createTestType,
  updateTestType,
  deleteTestType,
  fetchAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  fetchQuestions,
  fetchQuestionsBySubject,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchSubjects,
  fetchSubjectsByTest,
  createSubject,
  updateSubject,
  deleteSubject,
  fetchTests,
  fetchTestsByOrganization,
  fetchTestById,
  createTest,
  updateTest,
  deleteTest,
  fetchTestResults,
  fetchTestResultsByUser,
  fetchTestResultsByTest,
  createTestResult,
  updateTestResult,
  deleteTestResult,
} from "./fetcher";
import type {
  Year,
  Years,
  Testtype,
  Testtypes,
  Answer,
  Answers,
  Question,
  Questions,
  Subject,
  Subjects,
  Test,
  Tests,
  Testresult,
  Testresulls,
} from "@/types/cbt";

// Year Hooks
export const useFetchYears = (): UseQueryResult<Years, Error> => {
  return useQuery(["years"], fetchYears);
};

export const useCreateYear = (): UseMutationResult<Year, Error, Omit<Year, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createYear, {
    onSuccess: () => {
      queryClient.invalidateQueries(["years"]);
    },
  });
};

export const useUpdateYear = (): UseMutationResult<Year, Error, { id: number; yearData: Partial<Year> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, yearData }: { id: number; yearData: Partial<Year> }) => updateYear(id, yearData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["years"]);
      },
    }
  );
};

export const useDeleteYear = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteYear, {
    onSuccess: () => {
      queryClient.invalidateQueries(["years"]);
    },
  });
};

// Test Type Hooks
export const useFetchTestTypes = (): UseQueryResult<Testtypes, Error> => {
  return useQuery(["testTypes"], fetchTestTypes);
};

export const useCreateTestType = (): UseMutationResult<Testtype, Error, Omit<Testtype, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createTestType, {
    onSuccess: () => {
      queryClient.invalidateQueries(["testTypes"]);
    },
  });
};

export const useUpdateTestType = (): UseMutationResult<Testtype, Error, { id: number; testTypeData: Partial<Testtype> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, testTypeData }: { id: number; testTypeData: Partial<Testtype> }) => updateTestType(id, testTypeData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["testTypes"]);
      },
    }
  );
};

export const useDeleteTestType = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestType, {
    onSuccess: () => {
      queryClient.invalidateQueries(["testTypes"]);
    },
  });
};

// Answer Hooks
export const useFetchAnswers = (): UseQueryResult<Answers, Error> => {
  return useQuery(["answers"], fetchAnswers);
};

export const useCreateAnswer = (): UseMutationResult<Answer, Error, Omit<Answer, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["answers"]);
    },
  });
};

export const useUpdateAnswer = (): UseMutationResult<Answer, Error, { id: number; answerData: Partial<Answer> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, answerData }: { id: number; answerData: Partial<Answer> }) => updateAnswer(id, answerData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["answers"]);
      },
    }
  );
};

export const useDeleteAnswer = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["answers"]);
    },
  });
};

// Question Hooks
export const useFetchQuestions = (): UseQueryResult<Questions, Error> => {
  return useQuery(["questions"], fetchQuestions);
};

export const useFetchQuestionsBySubject = (subjectId: number): UseQueryResult<Questions, Error> => {
  return useQuery(["questions", "subject", subjectId], () => fetchQuestionsBySubject(subjectId), {
    enabled: !!subjectId,
  });
};

export const useCreateQuestion = (): UseMutationResult<Question, Error, Omit<Question, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });
};

export const useUpdateQuestion = (): UseMutationResult<Question, Error, { id: number; questionData: Partial<Question> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, questionData }: { id: number; questionData: Partial<Question> }) => updateQuestion(id, questionData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["questions"]);
      },
    }
  );
};

export const useDeleteQuestion = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });
};

// Subject Hooks
export const useFetchSubjects = (): UseQueryResult<Subjects, Error> => {
  return useQuery(["subjects"], fetchSubjects);
};

export const useFetchSubjectsByTest = (testId: number): UseQueryResult<Subjects, Error> => {
  return useQuery(["subjects", "test", testId], () => fetchSubjectsByTest(testId), {
    enabled: !!testId,
  });
};

export const useCreateSubject = (): UseMutationResult<Subject, Error, Omit<Subject, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createSubject, {
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
    },
  });
};

export const useUpdateSubject = (): UseMutationResult<Subject, Error, { id: number; subjectData: Partial<Subject> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, subjectData }: { id: number; subjectData: Partial<Subject> }) => updateSubject(id, subjectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["subjects"]);
      },
    }
  );
};

export const useDeleteSubject = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteSubject, {
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
    },
  });
};

// Test Hooks
export const useFetchTests = (): UseQueryResult<Tests, Error> => {
  return useQuery(["tests"], fetchTests);
};

export const useFetchTestsByOrganization = (organizationId: number): UseQueryResult<Tests, Error> => {
  return useQuery(["tests", "organization", organizationId], () => fetchTestsByOrganization(organizationId), {
    enabled: !!organizationId,
  });
};

export const useFetchTestById = (id: number): UseQueryResult<Test, Error> => {
  return useQuery(["tests", id], () => fetchTestById(id), {
    enabled: !!id,
  });
};

export const useCreateTest = (): UseMutationResult<Test, Error, Omit<Test, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createTest, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
    },
  });
};

export const useUpdateTest = (): UseMutationResult<Test, Error, { id: number; testData: Partial<Test> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, testData }: { id: number; testData: Partial<Test> }) => updateTest(id, testData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tests"]);
      },
    }
  );
};

export const useDeleteTest = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteTest, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tests"]);
    },
  });
};

// Test Result Hooks
export const useFetchTestResults = (): UseQueryResult<Testresulls, Error> => {
  return useQuery(["testResults"], fetchTestResults);
};

export const useFetchTestResultsByUser = (userId: number): UseQueryResult<Testresulls, Error> => {
  return useQuery(["testResults", "user", userId], () => fetchTestResultsByUser(userId), {
    enabled: !!userId,
  });
};

export const useFetchTestResultsByTest = (testId: number): UseQueryResult<Testresulls, Error> => {
  return useQuery(["testResults", "test", testId], () => fetchTestResultsByTest(testId), {
    enabled: !!testId,
  });
};

export const useCreateTestResult = (): UseMutationResult<Testresult, Error, Omit<Testresult, "id">> => {
  const queryClient = useQueryClient();
  return useMutation(createTestResult, {
    onSuccess: () => {
      queryClient.invalidateQueries(["testResults"]);
    },
  });
};

export const useUpdateTestResult = (): UseMutationResult<Testresult, Error, { id: number; testResultData: Partial<Testresult> }> => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, testResultData }: { id: number; testResultData: Partial<Testresult> }) => updateTestResult(id, testResultData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["testResults"]);
      },
    }
  );
};

export const useDeleteTestResult = (): UseMutationResult<number, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestResult, {
    onSuccess: () => {
      queryClient.invalidateQueries(["testResults"]);
    },
  });
};
