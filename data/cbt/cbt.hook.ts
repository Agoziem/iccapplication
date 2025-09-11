/**
 * @fileoverview React Query hooks for CBT (Computer Based Testing) management
 * 
 * Provides comprehensive CRUD operations for CBT system components including:
 * - Years management for academic years
 * - Test types (JAMB, WAEC, etc.) management  
 * - Questions and answers CRUD operations
 * - Subjects management within tests
 * - Tests creation and management
 * - Test submission and results handling
 * 
 * All hooks include automatic cache invalidation, error handling, and optimistic updates.
 * 
 * @see https://docs.innovationcybercafe.com/api/cbt
 * @author Innovation CyberCafe Frontend Team
 * @version 2.0.0
 */

"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  // Years management
  fetchYears,
  fetchYearById,
  createYear,
  updateYear,
  deleteYear,
  
  // Test types management
  fetchTestTypes,
  fetchTestTypeById,
  createTestType,
  updateTestType,
  deleteTestType,
  
  // Questions management
  createQuestion,
  updateQuestion,
  deleteQuestion,
  
  // Subjects management
  fetchSubjects,
  fetchSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  
  // Tests management
  fetchTests,
  fetchTestById,
  createTest,
  updateTest,
  deleteTest,
  
  // Test taking and results
  requestPracticeTest,
  submitTest,
  fetchTestResults,
} from "@/data/cbt/fetcher";

// =================== Years Management Hooks =================== //

/**
 * Hook to fetch all years with caching and automatic refetching
 * Retrieves all available academic years for CBT system.
 * 
 * @function useFetchYears
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with years array
 */
export const useFetchYears = (options = {}) =>
  useQuery(
    ["cbtYears"],
    fetchYears,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );

/**
 * Hook to fetch a single year by ID
 * Retrieves specific year details with caching.
 * 
 * @function useFetchYearById
 * @param {number} yearId - ID of the year to fetch
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with single year
 */
export const useFetchYearById = (yearId, options = {}) =>
  useQuery(
    ["cbtYear", "id", yearId],
    () => fetchYearById(yearId),
    {
      enabled: !!yearId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to create a new year
 * Creates a new academic year with automatic cache invalidation.
 * 
 * @function useCreateYear
 * @returns {Object} React Query mutation object for year creation
 */
export const useCreateYear = () => {
  const queryClient = useQueryClient();
  return useMutation(createYear, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cbtYears"]);
    },
    onError: (error) => {
      console.error('Failed to create year:', error);
    },
  });
};

/**
 * Hook to update an existing year
 * Updates year information with automatic cache invalidation.
 * 
 * @function useUpdateYear
 * @returns {Object} React Query mutation object for year updates
 */
export const useUpdateYear = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateYear(variables[0], variables[1]),
    {
      onSuccess: (updatedYear, variables) => {
        // Invalidate years list
        queryClient.invalidateQueries(["cbtYears"]);
        // Update specific year cache
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtYear", "id", variables[0]]);
        }
      },
      onError: (error) => {
        console.error('Failed to update year:', error);
      },
    }
  );
};

/**
 * Hook to delete a year
 * Removes a year with comprehensive cache invalidation.
 * 
 * @function useDeleteYear
 * @returns {Object} React Query mutation object for year deletion
 */
export const useDeleteYear = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteYear, {
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries(["cbtYears"]);
      // Remove specific year from cache
      queryClient.removeQueries(["cbtYear", "id", deletedId]);
    },
    onError: (error) => {
      console.error('Failed to delete year:', error);
    },
  });
};

// =================== Test Types Management Hooks =================== //

/**
 * Hook to fetch all test types with caching
 * Retrieves all available test types (JAMB, WAEC, etc.).
 * 
 * @function useFetchTestTypes
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with test types array
 */
export const useFetchTestTypes = (options = {}) =>
  useQuery(
    ["cbtTestTypes"],
    fetchTestTypes,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );

/**
 * Hook to fetch a single test type by ID
 * Retrieves specific test type details with caching.
 * 
 * @function useFetchTestTypeById
 * @param {number} testTypeId - ID of the test type to fetch
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with single test type
 */
export const useFetchTestTypeById = (testTypeId, options = {}) =>
  useQuery(
    ["cbtTestType", "id", testTypeId],
    () => fetchTestTypeById(testTypeId),
    {
      enabled: !!testTypeId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to create a new test type
 * Creates a new test type with automatic cache invalidation.
 * 
 * @function useCreateTestType
 * @returns {Object} React Query mutation object for test type creation
 */
export const useCreateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation(createTestType, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cbtTestTypes"]);
    },
    onError: (error) => {
      console.error('Failed to create test type:', error);
    },
  });
};

/**
 * Hook to update an existing test type
 * Updates test type information with automatic cache invalidation.
 * 
 * @function useUpdateTestType
 * @returns {Object} React Query mutation object for test type updates
 */
export const useUpdateTestType = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateTestType(variables[0], variables[1]),
    {
      onSuccess: (updatedTestType, variables) => {
        // Invalidate test types list
        queryClient.invalidateQueries(["cbtTestTypes"]);
        // Update specific test type cache
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtTestType", "id", variables[0]]);
        }
      },
      onError: (error) => {
        console.error('Failed to update test type:', error);
      },
    }
  );
};

/**
 * Hook to delete a test type
 * Removes a test type with comprehensive cache invalidation.
 * 
 * @function useDeleteTestType
 * @returns {Object} React Query mutation object for test type deletion
 */
export const useDeleteTestType = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTestType, {
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries(["cbtTestTypes"]);
      // Remove specific test type from cache
      queryClient.removeQueries(["cbtTestType", "id", deletedId]);
    },
    onError: (error) => {
      console.error('Failed to delete test type:', error);
    },
  });
};

// =================== Questions Management Hooks =================== //

/**
 * Hook to create a new question
 * Creates a question for a subject with automatic cache invalidation.
 * 
 * @function useCreateQuestion
 * @returns {Object} React Query mutation object for question creation
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => createQuestion(variables[0], variables[1]),
    {
      onSuccess: (newQuestion, variables) => {
        // Invalidate subjects to refresh questions
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtSubject", "id", variables[0]]);
          queryClient.invalidateQueries(["cbtSubjects"]);
        }
      },
      onError: (error) => {
        console.error('Failed to create question:', error);
      },
    }
  );
};

/**
 * Hook to update an existing question
 * Updates question information with automatic cache invalidation.
 * 
 * @function useUpdateQuestion
 * @returns {Object} React Query mutation object for question updates
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateQuestion(variables[0], variables[1]),
    {
      onSuccess: (updatedQuestion) => {
        // Invalidate subjects to refresh questions
        queryClient.invalidateQueries(["cbtSubjects"]);
        // Safe property access for subject ID
        const subjectId = updatedQuestion && typeof updatedQuestion === 'object' && 'subject' in updatedQuestion 
          ? updatedQuestion.subject : null;
        if (subjectId) {
          queryClient.invalidateQueries(["cbtSubject", "id", subjectId]);
        }
      },
      onError: (error) => {
        console.error('Failed to update question:', error);
      },
    }
  );
};

/**
 * Hook to delete a question
 * Removes a question with comprehensive cache invalidation.
 * 
 * @function useDeleteQuestion
 * @returns {Object} React Query mutation object for question deletion
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteQuestion, {
    onSuccess: () => {
      // Invalidate subjects to refresh questions
      queryClient.invalidateQueries(["cbtSubjects"]);
    },
    onError: (error) => {
      console.error('Failed to delete question:', error);
    },
  });
};

// =================== Subjects Management Hooks =================== //

/**
 * Hook to fetch subjects for a test
 * Retrieves all subjects associated with a specific test.
 * 
 * @function useFetchSubjects
 * @param {number} testId - ID of the test
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with subjects array
 */
export const useFetchSubjects = (testId, options = {}) =>
  useQuery(
    ["cbtSubjects", testId],
    () => fetchSubjects(testId),
    {
      enabled: !!testId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to fetch a single subject by ID
 * Retrieves specific subject details including questions.
 * 
 * @function useFetchSubjectById
 * @param {number} subjectId - ID of the subject to fetch
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with single subject
 */
export const useFetchSubjectById = (subjectId, options = {}) =>
  useQuery(
    ["cbtSubject", "id", subjectId],
    () => fetchSubjectById(subjectId),
    {
      enabled: !!subjectId,
      staleTime: 3 * 60 * 1000, // 3 minutes
      ...options,
    }
  );

/**
 * Hook to create a new subject
 * Creates a subject for a test with automatic cache invalidation.
 * 
 * @function useCreateSubject
 * @returns {Object} React Query mutation object for subject creation
 */
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => createSubject(variables[0], variables[1]),
    {
      onSuccess: (newSubject, variables) => {
        // Invalidate subjects list for the test
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtSubjects", variables[0]]);
        }
        // Safe property access for test ID
        const testId = newSubject && typeof newSubject === 'object' && 'test' in newSubject 
          ? newSubject.test : null;
        if (testId) {
          queryClient.invalidateQueries(["cbtTest", "id", testId]);
        }
      },
      onError: (error) => {
        console.error('Failed to create subject:', error);
      },
    }
  );
};

/**
 * Hook to update an existing subject
 * Updates subject information with automatic cache invalidation.
 * 
 * @function useUpdateSubject
 * @returns {Object} React Query mutation object for subject updates
 */
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateSubject(variables[0], variables[1]),
    {
      onSuccess: (updatedSubject, variables) => {
        // Invalidate subjects list
        queryClient.invalidateQueries(["cbtSubjects"]);
        // Update specific subject cache
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtSubject", "id", variables[0]]);
        }
        // Safe property access for test ID
        const testId = updatedSubject && typeof updatedSubject === 'object' && 'test' in updatedSubject 
          ? updatedSubject.test : null;
        if (testId) {
          queryClient.invalidateQueries(["cbtTest", "id", testId]);
        }
      },
      onError: (error) => {
        console.error('Failed to update subject:', error);
      },
    }
  );
};

/**
 * Hook to delete a subject
 * Removes a subject with comprehensive cache invalidation.
 * 
 * @function useDeleteSubject
 * @returns {Object} React Query mutation object for subject deletion
 */
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSubject, {
    onSuccess: (deletedId) => {
      // Invalidate subjects list
      queryClient.invalidateQueries(["cbtSubjects"]);
      // Remove specific subject from cache
      queryClient.removeQueries(["cbtSubject", "id", deletedId]);
      // Invalidate tests to refresh subject counts
      queryClient.invalidateQueries(["cbtTests"]);
    },
    onError: (error) => {
      console.error('Failed to delete subject:', error);
    },
  });
};

// =================== Tests Management Hooks =================== //

/**
 * Hook to fetch tests for an organization
 * Retrieves all tests created by the organization.
 * 
 * @function useFetchTests
 * @param {number} organizationId - ID of the organization
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with tests array
 */
export const useFetchTests = (organizationId, options = {}) =>
  useQuery(
    ["cbtTests", organizationId],
    () => fetchTests(organizationId),
    {
      enabled: !!organizationId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );

/**
 * Hook to fetch a single test by ID
 * Retrieves specific test details including subjects and questions.
 * 
 * @function useFetchTestById
 * @param {number} testId - ID of the test to fetch
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with single test
 */
export const useFetchTestById = (testId, options = {}) =>
  useQuery(
    ["cbtTest", "id", testId],
    () => fetchTestById(testId),
    {
      enabled: !!testId,
      staleTime: 3 * 60 * 1000, // 3 minutes
      ...options,
    }
  );

/**
 * Hook to create a new test
 * Creates a test for an organization with automatic cache invalidation.
 * 
 * @function useCreateTest
 * @returns {Object} React Query mutation object for test creation
 */
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => createTest(variables[0], variables[1]),
    {
      onSuccess: (newTest, variables) => {
        // Invalidate tests list for the organization
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtTests", variables[0]]);
        }
      },
      onError: (error) => {
        console.error('Failed to create test:', error);
      },
    }
  );
};

/**
 * Hook to update an existing test
 * Updates test information with automatic cache invalidation.
 * 
 * @function useUpdateTest
 * @returns {Object} React Query mutation object for test updates
 */
export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => updateTest(variables[0], variables[1]),
    {
      onSuccess: (_, variables) => {
        // Invalidate tests list
        queryClient.invalidateQueries(["cbtTests"]);
        // Update specific test cache
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtTest", "id", variables[0]]);
        }
      },
      onError: (error) => {
        console.error('Failed to update test:', error);
      },
    }
  );
};

/**
 * Hook to delete a test
 * Removes a test with comprehensive cache invalidation.
 * 
 * @function useDeleteTest
 * @returns {Object} React Query mutation object for test deletion
 */
export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTest, {
    onSuccess: (deletedId) => {
      // Invalidate tests list
      queryClient.invalidateQueries(["cbtTests"]);
      // Remove specific test from cache
      queryClient.removeQueries(["cbtTest", "id", deletedId]);
      // Remove related subjects
      queryClient.removeQueries(["cbtSubjects", deletedId]);
    },
    onError: (error) => {
      console.error('Failed to delete test:', error);
    },
  });
};

// =================== Test Taking and Results Hooks =================== //

/**
 * Hook to request a practice test
 * Requests a practice test for students with automatic cache management.
 * 
 * @function useRequestPracticeTest
 * @returns {Object} React Query mutation object for practice test request
 */
export const useRequestPracticeTest = () => {
  const queryClient = useQueryClient();
  return useMutation(requestPracticeTest, {
    onSuccess: (practiceTest) => {
      // Cache the practice test
      if (practiceTest.id) {
        queryClient.setQueryData(["cbtTest", "id", practiceTest.id], practiceTest);
      }
    },
    onError: (error) => {
      console.error('Failed to request practice test:', error);
    },
  });
};

/**
 * Hook to submit test answers
 * Submits test answers for grading with automatic cache invalidation.
 * 
 * @function useSubmitTest
 * @returns {Object} React Query mutation object for test submission
 */
export const useSubmitTest = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (/** @type {any} */ variables) => submitTest(variables[0], variables[1]),
    {
      onSuccess: (testScore, variables) => {
        // Invalidate test results to include new submission
        if (variables[0]) {
          queryClient.invalidateQueries(["cbtTestResults", variables[0]]);
        }
      },
      onError: (error) => {
        console.error('Failed to submit test:', error);
      },
    }
  );
};

/**
 * Hook to fetch test results
 * Retrieves test results for an organization with caching.
 * 
 * @function useFetchTestResults
 * @param {number} organizationId - ID of the organization
 * @param {Object} [options] - Query configuration options
 * @returns {Object} React Query result with test results array
 */
export const useFetchTestResults = (organizationId, options = {}) =>
  useQuery(
    ["cbtTestResults", organizationId],
    () => fetchTestResults(organizationId),
    {
      enabled: !!organizationId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for real-time results
      ...options,
    }
  );
