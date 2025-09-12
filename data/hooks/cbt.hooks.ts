import { AxiosInstance, AxiosInstancemultipart, AxiosInstanceWithToken, AxiosInstancemultipartWithToken } from "../instance";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "react-query";
import {
  Year,
  YearArray,
  TestType,
  TestTypeArray,
  Question,
  CreateQuestion,
  Subject,
  SubjectArray,
  CreateSubject,
  Test,
  TestArray,
  CreateTest,
  TestSubmission,
  TestScoreResponse,
  TestResultArray,
  StudentTestRequest,
  QuestionAnswer,
  TestResult,
  QuestionPreview,
  SubjectSummary,
  TestSummary,
  AnswerOption,
  TestScore
} from "@/types/cbt";

export const cbtAPIendpoint = "/CBTapi";

// Query Keys
export const CBT_KEYS = {
  all: ['cbt'] as const,
  years: () => [...CBT_KEYS.all, 'years'] as const,
  year: (id: number) => [...CBT_KEYS.years(), id] as const,
  testTypes: () => [...CBT_KEYS.all, 'testTypes'] as const,
  testType: (id: number) => [...CBT_KEYS.testTypes(), id] as const,
  subjects: (testId?: number) => testId ? [...CBT_KEYS.all, 'subjects', testId] as const : [...CBT_KEYS.all, 'subjects'] as const,
  subject: (id: number) => [...CBT_KEYS.subjects(), id] as const,
  tests: () => [...CBT_KEYS.all, 'tests'] as const,
  test: (id: number) => [...CBT_KEYS.tests(), id] as const,
  questions: (testId: number) => [...CBT_KEYS.all, 'questions', testId] as const,
  results: () => [...CBT_KEYS.all, 'results'] as const,
} as const;



export const fetchYears = async (): Promise<YearArray> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/years/`);
  return response.data;
};

export const fetchYearById = async (yearId: number): Promise<Year> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/year/${yearId}/`);
  return response.data;
};

export const createYear = async (yearData: Omit<Year, 'id'>): Promise<Year> => {
  const response = await AxiosInstanceWithToken.post(`${cbtAPIendpoint}/addyear/`, yearData);
  return response.data;
};

export const updateYear = async (yearId: number, yearData: Partial<Year>): Promise<Year> => {
  const response = await AxiosInstanceWithToken.put(`${cbtAPIendpoint}/updateyear/${yearId}/`, yearData);
  return response.data;
};

export const deleteYear = async (yearId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${cbtAPIendpoint}/deleteyear/${yearId}/`);
};

export const fetchTestTypes = async (): Promise<TestTypeArray> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/testtypes/`);
  return response.data;
};

export const fetchTestTypeById = async (testTypeId: number): Promise<TestType> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/testtype/${testTypeId}/`);
  return response.data;
};

export const createTestType = async (testTypeData: Omit<TestType, 'id'>): Promise<TestType> => {
  const response = await AxiosInstanceWithToken.post(`${cbtAPIendpoint}/addtesttype/`, testTypeData);
  return response.data;
};

export const updateTestType = async (testTypeId: number, testTypeData: Partial<TestType>): Promise<TestType> => {
  const response = await AxiosInstanceWithToken.put(`${cbtAPIendpoint}/updatetesttype/${testTypeId}/`, testTypeData);
  return response.data;
};

export const deleteTestType = async (testTypeId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${cbtAPIendpoint}/deletetesttype/${testTypeId}/`);
};

export const createQuestion = async (subjectId: number, questionData: CreateQuestion): Promise<Question> => {
  const response = await AxiosInstanceWithToken.post(
    `${cbtAPIendpoint}/addQuestion/${subjectId}/`,
    questionData
  );
  return response.data;
};

export const updateQuestion = async (questionId: number, questionData: Partial<CreateQuestion>): Promise<Question> => {
  const response = await AxiosInstanceWithToken.put(
    `${cbtAPIendpoint}/updateQuestion/${questionId}/`,
    questionData
  );
  return response.data;
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${cbtAPIendpoint}/deleteQuestion/${questionId}/`);
};

export const getTestQuestions = async (testId?: string | number): Promise<Question[]> => {
  if (!testId) return [];
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/questions/${testId}/`);
  return response.data;
};

export const fetchSubjects = async (testId: number): Promise<SubjectArray> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/subjects/${testId}/`);
  return response.data;
};

export const fetchSubjectById = async (subjectId: number): Promise<Subject> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/subject/${subjectId}/`);
  return response.data;
};

export const createSubject = async (testId: number, subjectData: CreateSubject): Promise<Subject> => {
  const response = await AxiosInstanceWithToken.post(
    `${cbtAPIendpoint}/addsubject/${testId}/`,
    subjectData
  );
  return response.data;
};

export const updateSubject = async (subjectId: number, subjectData: Partial<CreateSubject>): Promise<Subject> => {
  const response = await AxiosInstanceWithToken.put(
    `${cbtAPIendpoint}/updatesubject/${subjectId}/`,
    subjectData
  );
  return response.data;
};

export const deleteSubject = async (subjectId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${cbtAPIendpoint}/deletesubject/${subjectId}/`);
};

export const fetchTests = async (organizationId: number): Promise<TestArray> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/tests/${organizationId}/`);
  return response.data;
};

export const fetchTestById = async (testId: number): Promise<Test> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/test/${testId}/`);
  return response.data;
};

export const createTest = async (organizationId: number, createTestData: CreateTest): Promise<Test> => {
  const response = await AxiosInstanceWithToken.post(
    `${cbtAPIendpoint}/addtest/${organizationId}/`,
    createTestData
  );
  return response.data;
};

export const updateTest = async (testId: number, testData: Partial<CreateTest>): Promise<Test> => {
  const response = await AxiosInstanceWithToken.put(`${cbtAPIendpoint}/updatetest/${testId}/`, testData);
  return response.data;
};

export const deleteTest = async (testId: number): Promise<void> => {
  await AxiosInstanceWithToken.delete(`${cbtAPIendpoint}/deletetest/${testId}/`);
};

export const practiceTest = async (practiceData: any): Promise<any> => {
  const response = await AxiosInstanceWithToken.post(`${cbtAPIendpoint}/practicetest/`, practiceData);
  return response.data;
};

export const submitTest = async (organizationId: number, testSubmission: TestSubmission): Promise<TestScoreResponse> => {
  const response = await AxiosInstanceWithToken.post(`${cbtAPIendpoint}/submittest/${organizationId}/`, testSubmission);
  return response.data;
};

export const fetchTestResults = async (organizationId: number): Promise<TestResultArray> => {
  const response = await AxiosInstance.get(`${cbtAPIendpoint}/testresult/${organizationId}/`);
  return response.data;
};

// React Query Hooks

// Years Hooks
export const useYears = (): UseQueryResult<YearArray, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.years(),
    queryFn: fetchYears,
    onError: (error: Error) => {
      console.error('Error fetching years:', error);
      throw error;
    },
  });
};

export const useYear = (yearId: number): UseQueryResult<Year, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.year(yearId),
    queryFn: () => fetchYearById(yearId),
    enabled: !!yearId,
    onError: (error: Error) => {
      console.error('Error fetching year:', error);
      throw error;
    },
  });
};

// Test Types Hooks
export const useTestTypes = (): UseQueryResult<TestTypeArray, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.testTypes(),
    queryFn: fetchTestTypes,
    onError: (error: Error) => {
      console.error('Error fetching test types:', error);
      throw error;
    },
  });
};

// Subjects Hooks
export const useSubjects = (testId: number): UseQueryResult<SubjectArray, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.subjects(testId),
    queryFn: () => fetchSubjects(testId),
    enabled: !!testId,
    onError: (error: Error) => {
      console.error('Error fetching subjects:', error);
      throw error;
    },
  });
};

// Tests Hooks
export const useTests = (organizationId: number): UseQueryResult<TestArray, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.tests(),
    queryFn: () => fetchTests(organizationId),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching tests:', error);
      throw error;
    },
  });
};

export const useTest = (testId: number): UseQueryResult<Test, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.test(testId),
    queryFn: () => fetchTestById(testId),
    enabled: !!testId,
    onError: (error: Error) => {
      console.error('Error fetching test:', error);
      throw error;
    },
  });
};

// Test Questions Hooks
export const useTestQuestions = (testId: number): UseQueryResult<Question[], Error> => {
  return useQuery({
    queryKey: CBT_KEYS.questions(testId),
    queryFn: () => getTestQuestions(testId),
    enabled: !!testId,
    onError: (error: Error) => {
      console.error('Error fetching test questions:', error);
      throw error;
    },
  });
};

// Test Results Hooks
export const useTestResults = (organizationId: number): UseQueryResult<TestResultArray, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.results(),
    queryFn: () => fetchTestResults(organizationId),
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching test results:', error);
      throw error;
    },
  });
};

// Test Management Mutations
export const useCreateTest = (): UseMutationResult<Test, Error, { organizationId: number; testData: CreateTest }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, testData }) => createTest(organizationId, testData),
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.tests());
    },
    onError: (error: Error) => {
      console.error('Error creating test:', error);
      throw error;
    },
  });
};

export const useUpdateTest = (): UseMutationResult<Test, Error, { testId: number; testData: Partial<CreateTest> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, testData }) => updateTest(testId, testData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(CBT_KEYS.test(data.id));
      }
      queryClient.invalidateQueries(CBT_KEYS.tests());
    },
    onError: (error: Error) => {
      console.error('Error updating test:', error);
      throw error;
    },
  });
};

export const useDeleteTest = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTest,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.tests());
    },
    onError: (error: Error) => {
      console.error('Error deleting test:', error);
      throw error;
    },
  });
};

export const useSubmitTest = (): UseMutationResult<TestScoreResponse, Error, { organizationId: number; testSubmission: TestSubmission }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, testSubmission }) => submitTest(organizationId, testSubmission),
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.results());
    },
    onError: (error: Error) => {
      console.error('Error submitting test:', error);
      throw error;
    },
  });
};

// Year Management Mutations
export const useCreateYear = (): UseMutationResult<Year, Error, Omit<Year, 'id'>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createYear,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.years());
    },
    onError: (error: Error) => {
      console.error('Error creating year:', error);
      throw error;
    },
  });
};

export const useUpdateYear = (): UseMutationResult<Year, Error, { yearId: number; yearData: Partial<Year> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ yearId, yearData }) => updateYear(yearId, yearData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(CBT_KEYS.year(data.id));
      }
      queryClient.invalidateQueries(CBT_KEYS.years());
    },
    onError: (error: Error) => {
      console.error('Error updating year:', error);
      throw error;
    },
  });
};

export const useDeleteYear = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteYear,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.years());
    },
    onError: (error: Error) => {
      console.error('Error deleting year:', error);
      throw error;
    },
  });
};

// Test Type Management Mutations
export const useTestType = (testTypeId: number): UseQueryResult<TestType, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.testType(testTypeId),
    queryFn: () => fetchTestTypeById(testTypeId),
    enabled: !!testTypeId,
    onError: (error: Error) => {
      console.error('Error fetching test type:', error);
      throw error;
    },
  });
};

export const useCreateTestType = (): UseMutationResult<TestType, Error, Omit<TestType, 'id'>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTestType,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.testTypes());
    },
    onError: (error: Error) => {
      console.error('Error creating test type:', error);
      throw error;
    },
  });
};

export const useUpdateTestType = (): UseMutationResult<TestType, Error, { testTypeId: number; testTypeData: Partial<TestType> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testTypeId, testTypeData }) => updateTestType(testTypeId, testTypeData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(CBT_KEYS.testType(data.id));
      }
      queryClient.invalidateQueries(CBT_KEYS.testTypes());
    },
    onError: (error: Error) => {
      console.error('Error updating test type:', error);
      throw error;
    },
  });
};

export const useDeleteTestType = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTestType,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.testTypes());
    },
    onError: (error: Error) => {
      console.error('Error deleting test type:', error);
      throw error;
    },
  });
};

// Subject Management Hooks and Mutations
export const useSubject = (subjectId: number): UseQueryResult<Subject, Error> => {
  return useQuery({
    queryKey: CBT_KEYS.subject(subjectId),
    queryFn: () => fetchSubjectById(subjectId),
    enabled: !!subjectId,
    onError: (error: Error) => {
      console.error('Error fetching subject:', error);
      throw error;
    },
  });
};

export const useCreateSubject = (): UseMutationResult<Subject, Error, { testId: number; subjectData: CreateSubject }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, subjectData }) => createSubject(testId, subjectData),
    onSuccess: (_, { testId }) => {
      queryClient.invalidateQueries(CBT_KEYS.subjects(testId));
    },
    onError: (error: Error) => {
      console.error('Error creating subject:', error);
      throw error;
    },
  });
};

export const useUpdateSubject = (): UseMutationResult<Subject, Error, { subjectId: number; subjectData: Partial<CreateSubject> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subjectId, subjectData }) => updateSubject(subjectId, subjectData),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries(CBT_KEYS.subject(data.id));
      }
      queryClient.invalidateQueries(CBT_KEYS.subjects());
    },
    onError: (error: Error) => {
      console.error('Error updating subject:', error);
      throw error;
    },
  });
};

export const useDeleteSubject = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.subjects());
    },
    onError: (error: Error) => {
      console.error('Error deleting subject:', error);
      throw error;
    },
  });
};

// Question Management Mutations
export const useCreateQuestion = (): UseMutationResult<Question, Error, { subjectId: number; questionData: CreateQuestion }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subjectId, questionData }) => createQuestion(subjectId, questionData),
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.all); // Invalidate all questions since we don't know which test they belong to
    },
    onError: (error: Error) => {
      console.error('Error creating question:', error);
      throw error;
    },
  });
};

export const useUpdateQuestion = (): UseMutationResult<Question, Error, { questionId: number; questionData: Partial<CreateQuestion> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ questionId, questionData }) => updateQuestion(questionId, questionData),
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.all); // Invalidate all questions since we don't know which test they belong to
    },
    onError: (error: Error) => {
      console.error('Error updating question:', error);
      throw error;
    },
  });
};

export const useDeleteQuestion = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(CBT_KEYS.all); // Invalidate all questions since we don't know which test they belong to
    },
    onError: (error: Error) => {
      console.error('Error deleting question:', error);
      throw error;
    },
  });
};

// Practice Test Hook
export const usePracticeTest = (): UseMutationResult<TestScoreResponse, Error, StudentTestRequest> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: practiceTest,
    onError: (error: Error) => {
      console.error('Error with practice test:', error);
      throw error;
    },
  });
};

// ==============================================
// Utility Hooks for better UX
// ==============================================

// Test Summaries for listing
export const useTestSummaries = (organizationId: number): UseQueryResult<TestSummary[], Error> => {
  return useQuery({
    queryKey: [...CBT_KEYS.tests(), 'summaries'],
    queryFn: async () => {
      const tests = await fetchTests(organizationId);
      return tests.map(test => ({
        id: test.id,
        testYear: test.testYear,
        texttype: test.texttype
      }));
    },
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching test summaries:', error);
      throw error;
    },
  });
};

// Subject Summaries for a specific test
export const useSubjectSummaries = (testId: number): UseQueryResult<SubjectSummary[], Error> => {
  return useQuery({
    queryKey: [...CBT_KEYS.subjects(testId), 'summaries'],
    queryFn: async () => {
      const subjects = await fetchSubjects(testId);
      return subjects.map(subject => ({
        id: subject.id,
        subjectname: subject.subjectname,
        subjectduration: subject.subjectduration
      }));
    },
    enabled: !!testId,
    onError: (error: Error) => {
      console.error('Error fetching subject summaries:', error);
      throw error;
    },
  });
};

// Question Previews for a test (without full question data)
export const useQuestionPreviews = (testId: number): UseQueryResult<QuestionPreview[], Error> => {
  return useQuery({
    queryKey: [...CBT_KEYS.questions(testId), 'previews'],
    queryFn: async () => {
      const questions = await getTestQuestions(testId);
      return questions.map(question => ({
        id: question.id,
        questiontext: question.questiontext,
        questionMark: question.questionMark
      }));
    },
    enabled: !!testId,
    onError: (error: Error) => {
      console.error('Error fetching question previews:', error);
      throw error;
    },
  });
};

// Test Statistics Hook
export const useTestStats = (organizationId: number) => {
  return useQuery({
    queryKey: [...CBT_KEYS.tests(), 'stats'],
    queryFn: async () => {
      const tests = await fetchTests(organizationId);
      const results = await fetchTestResults(organizationId);
      
      return {
        totalTests: tests.length,
        totalResults: results.length,
        activeTests: tests.filter(test => test.id).length, // Assuming active tests have IDs
        averageScore: results.length > 0 
          ? results.reduce((sum, result) => sum + (result.mark || 0), 0) / results.length 
          : 0
      };
    },
    enabled: !!organizationId,
    onError: (error: Error) => {
      console.error('Error fetching test statistics:', error);
      throw error;
    },
  });
};



