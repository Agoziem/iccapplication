/**
 * @fileoverview CBT (Computer Based Testing) API Integration Module
 * 
 * Comprehensive API integration for CBT system managing years, test types, questions,
 * subjects, tests, and test results with enhanced error handling, validation,
 * and timeout support.
 * 
 * Features:
 * - Years management for academic years
 * - Test types (JAMB, WAEC, etc.) management
 * - Questions and answers CRUD operations
 * - Subjects management within tests
 * - Tests creation and management
 * - Test submission and results handling
 * 
 * @see https://docs.innovationcybercafe.com/api/cbt
 * @version 2.0.0
 * @author Innovation CyberCafe Team
 */

import axios from "axios";
import { z } from "zod";
import {
  yearArraySchema,
  yearSchema,
  testTypeArraySchema,
  testTypeSchema,
  answerSchema,
  answerCreateSchema,
  questionSchema,
  createQuestionSchema,
  subjectSchema,
  createSubjectSchema,
  testSchema,
  createTestSchema,
  testArraySchema,
  studentTestRequestSchema,
  testSubmissionSchema,
  testScoreResponseSchema,
  testResultSchema,
  testResultArraySchema,
} from "@/schemas/cbt";

/**
 * Enhanced axios instance configured for CBT API operations
 * Includes timeout, interceptors, and error handling
 * @type {import('axios').AxiosInstance}
 */
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
  timeout: 15000, // 15 seconds timeout for CBT operations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging and auth
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`CBT API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('CBT API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for enhanced error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`CBT API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'CBT API Error';
    console.error('CBT API Response Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });
    
    // Enhanced error with context
    const enhancedError = new Error(errorMessage);
    // @ts-ignore - Adding custom properties to Error object
    enhancedError.status = error.response?.status;
    // @ts-ignore - Adding custom properties to Error object
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

/**
 * Organization ID from environment variables
 * @type {string}
 */
const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

/**
 * Base API endpoint for CBT operations
 * @type {string}
 */
export const cbtAPIendpoint = "/CBTapi";

// ------------------------------------------------------
// Years Management Functions
// ------------------------------------------------------

/**
 * Fetches all available years
 * Retrieves all academic years configured for CBT system with validation.
 * 
 * @async
 * @function fetchYears
 * @returns {Promise<YearsArray>} Array of year objects
 * @throws {Error} When API request fails or validation fails
 */
export const fetchYears = async () => {
  try {
    const response = await axiosInstance.get(`${cbtAPIendpoint}/years/`);
    const validation = yearArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Years validation failed:", validation.error.issues);
      throw new Error("Failed to validate years data: " + validation.error.issues.map(i => i.message).join(', '));
    }
    return validation.data;
  } catch (error) {
    console.error('Error fetching years:', error);
    throw new Error(`Failed to fetch years: ${error.message}`);
  }
};

/**
 * Fetches a single year by ID
 * Retrieves specific year details with validation.
 * 
 * @async
 * @function fetchYearById
 * @param {number} yearId - ID of the year to fetch
 * @returns {Promise<Years>} Year object
 * @throws {Error} When API request fails or validation fails
 */
export const fetchYearById = async (yearId) => {
  if (!yearId) {
    throw new Error('Year ID is required');
  }

  try {
    const response = await axiosInstance.get(`${cbtAPIendpoint}/year/${yearId}/`);
    const validation = yearSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Year validation failed:", validation.error.issues);
      throw new Error("Failed to validate year data: " + validation.error.issues.map(i => i.message).join(', '));
    }
    return validation.data;
  } catch (error) {
    console.error(`Error fetching year ${yearId}:`, error);
    throw new Error(`Failed to fetch year: ${error.message}`);
  }
};

/**
 * Creates a new year
 * Creates a new academic year with validation.
 * 
 * @async
 * @function createYear
 * @param {Object} yearData - Year data to create
 * @param {number} yearData.year - Year value (e.g., 2024)
 * @returns {Promise<Years>} Created year object
 * @throws {Error} When API request fails or validation fails
 */
export const createYear = async (yearData) => {
  if (!yearData || !yearData.year) {
    throw new Error('Year data with year value is required');
  }

  try {
    const response = await axiosInstance.post(`${cbtAPIendpoint}/addyear/`, yearData);
    const validation = yearSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Create year validation failed:", validation.error.issues);
      throw new Error("Failed to validate created year: " + validation.error.issues.map(i => i.message).join(', '));
    }
    return validation.data;
  } catch (error) {
    console.error('Error creating year:', error);
    throw new Error(`Failed to create year: ${error.message}`);
  }
};

/**
 * Updates an existing year
 * Updates an existing academic year with validation.
 * 
 * @async
 * @function updateYear
 * @param {number} yearId - ID of the year to update
 * @param {Object} yearData - Updated year data
 * @param {number} yearData.year - Year value
 * @returns {Promise<Years>} Updated year object
 * @throws {Error} When API request fails or validation fails
 */
export const updateYear = async (yearId, yearData) => {
  if (!yearId || !yearData) {
    throw new Error('Year ID and year data are required');
  }

  try {
    const response = await axiosInstance.put(`${cbtAPIendpoint}/updateyear/${yearId}/`, yearData);
    const validation = yearSchema.safeParse(response.data);
    if (!validation.success) {
      console.error("Update year validation failed:", validation.error.issues);
      throw new Error("Failed to validate updated year: " + validation.error.issues.map(i => i.message).join(', '));
    }
    return validation.data;
  } catch (error) {
    console.error(`Error updating year ${yearId}:`, error);
    throw new Error(`Failed to update year: ${error.message}`);
  }
};

/**
 * Deletes a year
 * Removes an academic year from the system.
 * 
 * @async
 * @function deleteYear
 * @param {number} yearId - ID of the year to delete
 * @returns {Promise<number>} ID of the deleted year
 * @throws {Error} When API request fails
 */
export const deleteYear = async (yearId) => {
  if (!yearId) {
    throw new Error('Year ID is required');
  }

  try {
    await axiosInstance.delete(`${cbtAPIendpoint}/deleteyear/${yearId}/`);
    return yearId;
  } catch (error) {
    console.error(`Error deleting year ${yearId}:`, error);
    throw new Error(`Failed to delete year: ${error.message}`);
  }
};

// ------------------------------------------------------
// Test Types Management Functions
// ------------------------------------------------------
// ------------------------------------------------------

/**
 * Fetches all test types
 * @async
 * @function fetchTestTypes
 * @returns {Promise<TestTypeArray>} Array of test type objects
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestTypes = async () => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testtypes/`);
  const validation = testTypeArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Test types validation failed:", validation.error.issues);
    throw new Error("Failed to validate test types data");
  }
  return validation.data;
};

/**
 * Fetches a single test type by ID
 * @async
 * @function fetchTestTypeById
 * @param {number} testTypeId - ID of the test type to fetch
 * @returns {Promise<TestType>} Test type object
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestTypeById = async (testTypeId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testtype/${testTypeId}/`);
  const validation = testTypeSchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Test type validation failed:", validation.error.issues);
    throw new Error("Failed to validate test type data");
  }
  return validation.data;
};

/**
 * Creates a new test type
 * @async
 * @function createTestType
 * @param {Object} testTypeData - Test type data to create
 * @param {string} testTypeData.testtype - Test type name
 * @returns {Promise<TestType>} Created test type object
 * @throws {Error} When API request fails or validation fails
 */
export const createTestType = async (testTypeData) => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/addtesttype/`, testTypeData);
  const validation = testTypeSchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Create test type validation failed:", validation.error.issues);
    throw new Error("Failed to validate created test type");
  }
  return validation.data;
};

/**
 * Updates an existing test type
 * @async
 * @function updateTestType
 * @param {number} testTypeId - ID of the test type to update
 * @param {Object} testTypeData - Updated test type data
 * @param {string} testTypeData.testtype - Test type name
 * @returns {Promise<TestType>} Updated test type object
 * @throws {Error} When API request fails or validation fails
 */
export const updateTestType = async (testTypeId, testTypeData) => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/updatetesttype/${testTypeId}/`, testTypeData);
  const validation = testTypeSchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Update test type validation failed:", validation.error.issues);
    throw new Error("Failed to validate updated test type");
  }
  return validation.data;
};

/**
 * Deletes a test type
 * @async
 * @function deleteTestType
 * @param {number} testTypeId - ID of the test type to delete
 * @returns {Promise<number>} ID of the deleted test type
 * @throws {Error} When API request fails
 */
export const deleteTestType = async (testTypeId) => {
  await axiosInstance.delete(`${cbtAPIendpoint}/deletetesttype/${testTypeId}/`);
  return testTypeId;
};

// ------------------------------------------------------
// Questions Management Functions
// ------------------------------------------------------

/**
 * Creates a new question for a subject
 * @async
 * @function createQuestion
 * @param {number} subjectId - ID of the subject to add question to
 * @param {CreateQuestion} questionData - Question data to create
 * @returns {Promise<Question>} Created question object
 * @throws {Error} When API request fails or validation fails
 * @example
 * ```javascript
 * const newQuestion = await createQuestion(123, {
 *   questiontext: "What is 2 + 2?",
 *   questionMark: 5,
 *   correctAnswerdescription: "Simple addition",
 *   answers: [
 *     { answertext: "4", isCorrect: true },
 *     { answertext: "3", isCorrect: false },
 *     { answertext: "5", isCorrect: false }
 *   ]
 * });
 * ```
 */
export const createQuestion = async (subjectId, questionData) => {
  const validation = createQuestionSchema.safeParse(questionData);
  if (!validation.success) {
    console.error("Question creation validation failed:", validation.error.issues);
    throw new Error("Invalid question data");
  }

  const response = await axiosInstance.post(
    `${cbtAPIendpoint}/addQuestion/${subjectId}/`,
    validation.data
  );
  
  const questionValidation = questionSchema.safeParse(response.data);
  if (!questionValidation.success) {
    console.error("Question response validation failed:", questionValidation.error.issues);
    throw new Error("Failed to validate created question");
  }
  return questionValidation.data;
};

/**
 * Updates an existing question
 * @async
 * @function updateQuestion
 * @param {number} questionId - ID of the question to update
 * @param {CreateQuestion} questionData - Updated question data
 * @returns {Promise<Question>} Updated question object
 * @throws {Error} When API request fails or validation fails
 */
export const updateQuestion = async (questionId, questionData) => {
  const validation = createQuestionSchema.safeParse(questionData);
  if (!validation.success) {
    console.error("Question update validation failed:", validation.error.issues);
    throw new Error("Invalid question data");
  }

  const response = await axiosInstance.put(
    `${cbtAPIendpoint}/updateQuestion/${questionId}/`,
    validation.data
  );
  
  const questionValidation = questionSchema.safeParse(response.data);
  if (!questionValidation.success) {
    console.error("Question response validation failed:", questionValidation.error.issues);
    throw new Error("Failed to validate updated question");
  }
  return questionValidation.data;
};

/**
 * Deletes a question
 * @async
 * @function deleteQuestion
 * @param {number} questionId - ID of the question to delete
 * @returns {Promise<number>} ID of the deleted question
 * @throws {Error} When API request fails
 */
export const deleteQuestion = async (questionId) => {
  await axiosInstance.delete(`${cbtAPIendpoint}/deleteQuestion/${questionId}/`);
  return questionId;
};

// ------------------------------------------------------
// Subjects Management Functions
// ------------------------------------------------------

/**
 * Fetches all subjects for a test
 * @async
 * @function fetchSubjects
 * @param {number} testId - ID of the test
 * @returns {Promise<SubjectArray>} Array of subject objects
 * @throws {Error} When API request fails or validation fails
 */
export const fetchSubjects = async (testId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/subjects/${testId}/`);
  const validation = z.array(subjectSchema).safeParse(response.data);
  if (!validation.success) {
    console.error("Subjects validation failed:", validation.error.issues);
    throw new Error("Failed to validate subjects data");
  }
  return validation.data;
};

/**
 * Fetches a single subject by ID
 * @async
 * @function fetchSubjectById
 * @param {number} subjectId - ID of the subject to fetch
 * @returns {Promise<Subject>} Subject object
 * @throws {Error} When API request fails or validation fails
 */
export const fetchSubjectById = async (subjectId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/subject/${subjectId}/`);
  const validation = subjectSchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Subject validation failed:", validation.error.issues);
    throw new Error("Failed to validate subject data");
  }
  return validation.data;
};

/**
 * Creates a new subject for a test
 * @async
 * @function createSubject
 * @param {number} testId - ID of the test to add subject to
 * @param {CreateSubject} subjectData - Subject data to create
 * @returns {Promise<Subject>} Created subject object
 * @throws {Error} When API request fails or validation fails
 */
export const createSubject = async (testId, subjectData) => {
  const validation = createSubjectSchema.safeParse(subjectData);
  if (!validation.success) {
    console.error("Subject creation validation failed:", validation.error.issues);
    throw new Error("Invalid subject data");
  }

  const response = await axiosInstance.post(
    `${cbtAPIendpoint}/addsubject/${testId}/`,
    validation.data
  );
  
  const subjectValidation = subjectSchema.safeParse(response.data);
  if (!subjectValidation.success) {
    console.error("Subject response validation failed:", subjectValidation.error.issues);
    throw new Error("Failed to validate created subject");
  }
  return subjectValidation.data;
};

/**
 * Updates an existing subject
 * @async
 * @function updateSubject
 * @param {number} subjectId - ID of the subject to update
 * @param {CreateSubject} subjectData - Updated subject data
 * @returns {Promise<Subject>} Updated subject object
 * @throws {Error} When API request fails or validation fails
 */
export const updateSubject = async (subjectId, subjectData) => {
  const validation = createSubjectSchema.safeParse(subjectData);
  if (!validation.success) {
    console.error("Subject update validation failed:", validation.error.issues);
    throw new Error("Invalid subject data");
  }

  const response = await axiosInstance.put(
    `${cbtAPIendpoint}/updatesubject/${subjectId}/`,
    validation.data
  );
  
  const subjectValidation = subjectSchema.safeParse(response.data);
  if (!subjectValidation.success) {
    console.error("Subject response validation failed:", subjectValidation.error.issues);
    throw new Error("Failed to validate updated subject");
  }
  return subjectValidation.data;
};

/**
 * Deletes a subject
 * @async
 * @function deleteSubject
 * @param {number} subjectId - ID of the subject to delete
 * @returns {Promise<number>} ID of the deleted subject
 * @throws {Error} When API request fails
 */
export const deleteSubject = async (subjectId) => {
  await axiosInstance.delete(`${cbtAPIendpoint}/deletesubject/${subjectId}/`);
  return subjectId;
};

// ------------------------------------------------------
// Tests Management Functions
// ------------------------------------------------------

/**
 * Fetches all tests for an organization
 * @async
 * @function fetchTests
 * @param {number} organizationId - ID of the organization
 * @returns {Promise<TestArray>} Array of test objects
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTests = async (organizationId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/tests/${organizationId}/`);
  const validation = testArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Tests validation failed:", validation.error.issues);
    throw new Error("Failed to validate tests data");
  }
  return validation.data;
};

/**
 * Fetches a single test by ID
 * @async
 * @function fetchTestById
 * @param {number} testId - ID of the test to fetch
 * @returns {Promise<Test>} Test object
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestById = async (testId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/test/${testId}/`);
  const validation = testSchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Test validation failed:", validation.error.issues);
    throw new Error("Failed to validate test data");
  }
  return validation.data;
};

/**
 * Creates a new test
 * @async
 * @function createTest
 * @param {number} organizationId - ID of the organization
 * @param {CreateTest} testData - Test data to create
 * @returns {Promise<Test>} Created test object
 * @throws {Error} When API request fails or validation fails
 */
export const createTest = async (organizationId, testData) => {
  const validation = createTestSchema.safeParse(testData);
  if (!validation.success) {
    console.error("Test creation validation failed:", validation.error.issues);
    throw new Error("Invalid test data");
  }

  const response = await axiosInstance.post(
    `${cbtAPIendpoint}/addtest/${organizationId}/`,
    validation.data
  );
  
  const testValidation = testSchema.safeParse(response.data);
  if (!testValidation.success) {
    console.error("Test response validation failed:", testValidation.error.issues);
    throw new Error("Failed to validate created test");
  }
  return testValidation.data;
};

/**
 * Updates an existing test
 * @async
 * @function updateTest
 * @param {number} testId - ID of the test to update
 * @param {CreateTest} testData - Updated test data
 * @returns {Promise<void>} Success confirmation
 * @throws {Error} When API request fails or validation fails
 */
export const updateTest = async (testId, testData) => {
  const validation = createTestSchema.safeParse(testData);
  if (!validation.success) {
    console.error("Test update validation failed:", validation.error.issues);
    throw new Error("Invalid test data");
  }

  await axiosInstance.put(`${cbtAPIendpoint}/updatetest/${testId}/`, validation.data);
};

/**
 * Deletes a test
 * @async
 * @function deleteTest
 * @param {number} testId - ID of the test to delete
 * @returns {Promise<number>} ID of the deleted test
 * @throws {Error} When API request fails
 */
export const deleteTest = async (testId) => {
  await axiosInstance.delete(`${cbtAPIendpoint}/deletetest/${testId}/`);
  return testId;
};

// ------------------------------------------------------
// Test Taking Functions
// ------------------------------------------------------

/**
 * Requests a practice test for a student
 * @async
 * @function requestPracticeTest
 * @param {StudentTestRequest} requestData - Test request data
 * @returns {Promise<Test>} Test object for practice
 * @throws {Error} When API request fails or validation fails
 */
export const requestPracticeTest = async (requestData) => {
  const validation = studentTestRequestSchema.safeParse(requestData);
  if (!validation.success) {
    console.error("Practice test request validation failed:", validation.error.issues);
    throw new Error("Invalid test request data");
  }

  const response = await axiosInstance.post(`${cbtAPIendpoint}/practicetest/`, validation.data);
  const testValidation = testSchema.safeParse(response.data);
  if (!testValidation.success) {
    console.error("Practice test response validation failed:", testValidation.error.issues);
    throw new Error("Failed to validate practice test");
  }
  return testValidation.data;
};

/**
 * Submits test answers for grading
 * @async
 * @function submitTest
 * @param {number} organizationId - ID of the organization
 * @param {TestSubmission[]} submissions - Array of test submissions
 * @returns {Promise<TestScoreResponse>} Test score response
 * @throws {Error} When API request fails or validation fails
 */
export const submitTest = async (organizationId, submissions) => {
  const validation = z.array(testSubmissionSchema).safeParse(submissions);
  if (!validation.success) {
    console.error("Test submission validation failed:", validation.error.issues);
    throw new Error("Invalid test submission data");
  }

  const response = await axiosInstance.post(
    `${cbtAPIendpoint}/submittest/${organizationId}/`,
    validation.data
  );
  
  const scoreValidation = testScoreResponseSchema.safeParse(response.data);
  if (!scoreValidation.success) {
    console.error("Test score validation failed:", scoreValidation.error.issues);
    throw new Error("Failed to validate test score");
  }
  return scoreValidation.data;
};

/**
 * Fetches test results for an organization
 * @async
 * @function fetchTestResults
 * @param {number} organizationId - ID of the organization
 * @returns {Promise<TestResultArray>} Array of test result objects
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestResults = async (organizationId) => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testresult/${organizationId}/`);
  const validation = testResultArraySchema.safeParse(response.data);
  if (!validation.success) {
    console.error("Test results validation failed:", validation.error.issues);
    throw new Error("Failed to validate test results data");
  }
  return validation.data;
};


