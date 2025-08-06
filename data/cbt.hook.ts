import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosinstanceAuth } from "./instance";
import {
  CreateAnswerDTO,
  CreateQuestionDTO,
  CreateSubjectDTO,
  CreateTestDTO,
  CreateTestTypeDTO,
  CreateYearDTO,
  StudentTestRequestDTO,
  TestSubmissionDTO,
  UpdateAnswerDTO,
  UpdateQuestionDTO,
  UpdateSubjectDTO,
  UpdateTestDTO,
  UpdateTestTypeDTO,
  UpdateYearDTO,
} from "@/schemas/cbt";
import { Answer, Question, StudentsTestListing, Subject, Test, TestResult, TestSummary, TestType, Year } from "@/types/cbt";

// Query Keys
export const CBT_QUERY_KEYS = {
  years: ['years'],
  testTypes: ['testTypes'],
  tests: ['tests'],
  test: (id: number) => ['test', id],
  testSummary: (id: number) => ['testSummary', id],
  testsByFilters: (yearId: number | null, testTypeId: number | null) => ['tests', yearId, testTypeId],
  subjects: (testId: number) => ['subjects', testId],
  subject: (id: number) => ['subject', id],
  questions: (subjectId: number) => ['questions', subjectId],
  question: (id: number) => ['question', id],
  answer: (id: number) => ['answer', id],
  availableTests: (yearId: number | null, subjectId: number | null) => ['availableTests', yearId, subjectId],
  testResults: ['testResults'],
  testResult: (id: number) => ['testResult', id],
};

// ------------------------ Year Hooks ------------------------
export const useGetYears = () => {
  return useQuery<Year[]>(CBT_QUERY_KEYS.years, async () => {
    console.log("Fetching years...");
    const response = await AxiosinstanceAuth.get(`/years/`);
    return response.data;
  });
};

export const useCreateYear = () => {
  const queryClient = useQueryClient();
  return useMutation<Year, Error, CreateYearDTO>(
    async (yearData: CreateYearDTO) => {
      console.log("Creating year...", yearData);
      const response = await AxiosinstanceAuth.post(`/years/`, yearData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.years);
      },
    }
  );
};

export const useUpdateYear = () => {
  const queryClient = useQueryClient();
  return useMutation<Year, Error, { id: number; yearData: UpdateYearDTO }>(
    async ({ id, yearData }) => {
      console.log("Updating year...", id, yearData);
      const response = await AxiosinstanceAuth.put(`/years/${id}/`, yearData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.years);
      },
    }
  );
};

export const useDeleteYear = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, number>(
    async (id: number) => {
      console.log("Deleting year...", id);
      await AxiosinstanceAuth.delete(`/years/${id}/`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.years);
      },
    }
  );
};

// --------------------- Test Type Hooks ---------------------
export const useGetTestTypes = () => {
  return useQuery<TestType[]>(CBT_QUERY_KEYS.testTypes, async () => {
    console.log("Fetching test types...");
    const response = await AxiosinstanceAuth.get(`/test-types/`);
    return response.data;
  });
};

export const useCreateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation<TestType, Error, CreateTestTypeDTO>(
    async (data: CreateTestTypeDTO) => {
      console.log("Creating test type...", data);
      const response = await AxiosinstanceAuth.post(`/test-types/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testTypes);
      },
    }
  );
};

export const useUpdateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation<TestType, Error, { id: number; data: UpdateTestTypeDTO }>(
    async ({ id, data }) => {
      console.log("Updating test type...", id, data);
      const response = await AxiosinstanceAuth.put(`/test-types/${id}/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testTypes);
      },
    }
  );
};

export const useDeleteTestType = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, number>(
    async (id: number) => {
      console.log("Deleting test type...", id);
      await AxiosinstanceAuth.delete(`/test-types/${id}/`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testTypes);
      },
    }
  );
};

// ------------------------ Test Hooks ------------------------
export const useGetTests = (year_id: number | null, test_type_id: number | null) => {
  return useQuery<Test[]>(
    CBT_QUERY_KEYS.testsByFilters(year_id, test_type_id), 
    async () => {
      console.log("Fetching tests...", { year_id, test_type_id });
      const response = await AxiosinstanceAuth.get(`/tests/`, {
        params: {
          year: year_id,
          test_type: test_type_id,
        },
      });
      return response.data;
    }
  );
};

export const useGetTestSummary = (test_id: number) => {
  return useQuery<TestSummary>(
    CBT_QUERY_KEYS.testSummary(test_id),
    async () => {
      console.log("Fetching test summary...", test_id);
      const response = await AxiosinstanceAuth.get(`/tests/${test_id}/summary`);
      return response.data;
    },
    {
      enabled: !!test_id,
    }
  );
};

export const useGetTestById = (id: number) => {
  return useQuery<Test>(
    CBT_QUERY_KEYS.test(id),
    async () => {
      console.log("Fetching test by ID...", id);
      const response = await AxiosinstanceAuth.get(`/tests/${id}/`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation<Test, Error, CreateTestDTO>(
    async (data: CreateTestDTO) => {
      console.log("Creating test...", data);
      const response = await AxiosinstanceAuth.post(`/tests/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.tests);
      },
    }
  );
};

export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation<Test, Error, { id: number; data: UpdateTestDTO }>(
    async ({ id, data }) => {
      console.log("Updating test...", id, data);
      const response = await AxiosinstanceAuth.put(`/tests/${id}/update/`, data);
      return response.data;
    },
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.tests);
        queryClient.invalidateQueries(CBT_QUERY_KEYS.test(id));
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testSummary(id));
      },
    }
  );
};

export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, number>(
    async (id: number) => {
      console.log("Deleting test...", id);
      await AxiosinstanceAuth.delete(`/tests/${id}/`);
      return id;
    },
    {
      onSuccess: (id) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.tests);
        queryClient.removeQueries(CBT_QUERY_KEYS.test(id));
        queryClient.removeQueries(CBT_QUERY_KEYS.testSummary(id));
      },
    }
  );
};

// ------------------------ Subject Hooks ------------------------
export const useGetSubjects = (test_id: number) => {
  return useQuery<Subject[]>(
    CBT_QUERY_KEYS.subjects(test_id),
    async () => {
      console.log("Fetching subjects...", test_id);
      const response = await AxiosinstanceAuth.get(`/subjects/test_id/${test_id}`);
      return response.data;
    },
    {
      enabled: !!test_id,
    }
  );
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, { subject: CreateSubjectDTO; test_id: number }>(
    async (data) => {
      console.log("Creating subject...", data);
      const response = await AxiosinstanceAuth.post(
        `/subjects/test_id/${data.test_id}`,
        data.subject
      );
      return response.data;
    },
    {
      onSuccess: (_, { test_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.subjects(test_id));
      },
    }
  );
};

export const useGetSubjectById = (id: number) => {
  return useQuery<Subject>(
    CBT_QUERY_KEYS.subject(id),
    async () => {
      console.log("Fetching subject by ID...", id);
      const response = await AxiosinstanceAuth.get(`/subjects/subject_id/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<Subject, Error, { id: number; data: UpdateSubjectDTO; test_id?: number }>(
    async ({ id, data }) => {
      console.log("Updating subject...", id, data);
      const response = await AxiosinstanceAuth.put(`/subjects/subject_id/${id}`, data);
      return response.data;
    },
    {
      onSuccess: (result, { id, test_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.subject(id));
        if (test_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.subjects(test_id));
        }
      },
    }
  );
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { id: number; test_id?: number }>(
    async ({ id }) => {
      console.log("Deleting subject...", id);
      await AxiosinstanceAuth.delete(`/subjects/subject_id/${id}`);
      return id;
    },
    {
      onSuccess: (id, { test_id }) => {
        queryClient.removeQueries(CBT_QUERY_KEYS.subject(id));
        if (test_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.subjects(test_id));
        }
      },
    }
  );
};

// ------------------------ Question Hooks ------------------------
export const useGetQuestions = (subject_id: number) => {
  return useQuery<Question[]>(
    CBT_QUERY_KEYS.questions(subject_id),
    async () => {
      console.log("Fetching questions...", subject_id);
      const response = await AxiosinstanceAuth.get(`/questions/subject_id/${subject_id}`);
      return response.data;
    },
    {
      enabled: !!subject_id,
    }
  );
};

export const useGetQuestionById = (id: number) => {
  return useQuery<Question>(
    CBT_QUERY_KEYS.question(id),
    async () => {
      console.log("Fetching question by ID...", id);
      const response = await AxiosinstanceAuth.get(`/questions/question_id/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, { question: CreateQuestionDTO; subject_id: number }>(
    async (data) => {
      console.log("Creating question...", data);
      const response = await AxiosinstanceAuth.post(
        `/questions/subject_id/${data.subject_id}`,
        data.question
      );
      return response.data;
    },
    {
      onSuccess: (_, { subject_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
      },
    }
  );
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, { id: number; data: UpdateQuestionDTO; subject_id?: number }>(
    async ({ id, data }) => {
      console.log("Updating question...", id, data);
      const response = await AxiosinstanceAuth.put(`/questions/question_id/${id}`, data);
      return response.data;
    },
    {
      onSuccess: (result, { id, subject_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.question(id));
        if (subject_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
        }
      },
    }
  );
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { id: number; subject_id?: number }>(
    async ({ id }) => {
      console.log("Deleting question...", id);
      await AxiosinstanceAuth.delete(`/questions/question_id/${id}`);
      return id;
    },
    {
      onSuccess: (id, { subject_id }) => {
        queryClient.removeQueries(CBT_QUERY_KEYS.question(id));
        if (subject_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
        }
      },
    }
  );
};

export const useAddAnswerToQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<Question, Error, { questionId: number; answer: CreateAnswerDTO; subject_id?: number }>(
    async ({ questionId, answer }) => {
      console.log("Adding answer to question...", questionId, answer);
      const response = await AxiosinstanceAuth.post(
        `/questions/question_id/${questionId}/answers`,
        answer
      );
      return response.data;
    },
    {
      onSuccess: (result, { questionId, subject_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.question(questionId));
        if (subject_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
        }
      },
    }
  );
};

// ------------------------ Answer Hooks ------------------------
export const useGetAnswerById = (id: number) => {
  return useQuery<Answer>(
    CBT_QUERY_KEYS.answer(id),
    async () => {
      console.log("Fetching answer by ID...", id);
      const response = await AxiosinstanceAuth.get(`/answers/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation<Answer, Error, Omit<Answer, "id">>(
    async (data) => {
      console.log("Creating answer...", data);
      const response = await AxiosinstanceAuth.post(`/answers/create/`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        // Note: You may want to add more specific cache invalidation based on question relationship
        console.log("Answer created successfully");
      },
    }
  );
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation<Answer, Error, { id: number; data: UpdateAnswerDTO; questionId?: number; subject_id?: number }>(
    async ({ id, data }) => {
      console.log("Updating answer...", id, data);
      const response = await AxiosinstanceAuth.put(`/answers/${id}/`, data);
      return response.data;
    },
    {
      onSuccess: (result, { id, questionId, subject_id }) => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.answer(id));
        if (questionId) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.question(questionId));
        }
        if (subject_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
        }
      },
    }
  );
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { id: number; questionId?: number; subject_id?: number }>(
    async ({ id }) => {
      console.log("Deleting answer...", id);
      await AxiosinstanceAuth.delete(`/answers/${id}/`);
      return id;
    },
    {
      onSuccess: (id, { questionId, subject_id }) => {
        queryClient.removeQueries(CBT_QUERY_KEYS.answer(id));
        if (questionId) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.question(questionId));
        }
        if (subject_id) {
          queryClient.invalidateQueries(CBT_QUERY_KEYS.questions(subject_id));
        }
      },
    }
  );
};

// ------------------------ Practice Test Hooks ------------------------
export const useGetAvailableTests = (year_id: number | null, subject_id: number | null) => {
  return useQuery<Test[]>(
    CBT_QUERY_KEYS.availableTests(year_id, subject_id),
    async () => {
      console.log("Fetching available tests...", { year_id, subject_id });
      const response = await AxiosinstanceAuth.get(`/practice/available-tests`, {
        params: {
          year: year_id,
          subject: subject_id,
        },
      });
      return response.data;
    }
  );
};

export const useStartTest = () => {
  const queryClient = useQueryClient();
  return useMutation<StudentsTestListing, Error, StudentTestRequestDTO>(
    async (data) => {
      console.log("Starting test...", data);
      const response = await AxiosinstanceAuth.post(`/practice/start-test`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testResults);
      },
    }
  );
};

export const useSubmitTest = () => {
  const queryClient = useQueryClient();
  return useMutation<TestResult, Error, TestSubmissionDTO>(
    async (data) => {
      console.log("Submitting test...", data);
      const response = await AxiosinstanceAuth.post(`/practice/submit-test`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(CBT_QUERY_KEYS.testResults);
      },
    }
  );
};

export const useGetTestResult = (result_id: number) => {
  return useQuery<TestResult>(
    CBT_QUERY_KEYS.testResult(result_id),
    async () => {
      console.log("Fetching test result...", result_id);
      const response = await AxiosinstanceAuth.get(`/practice/result/${result_id}`);
      return response.data;
    },
    {
      enabled: !!result_id,
    }
  );
};

export const useGetStudentTestResults = () => {
  return useQuery<TestResult[]>(CBT_QUERY_KEYS.testResults, async () => {
    console.log("Fetching student test results...");
    const response = await AxiosinstanceAuth.get(`/practice/my-results`);
    return response.data;
  });
};