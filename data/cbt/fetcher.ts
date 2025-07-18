import axios from "axios";
import {
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
import { converttoformData } from "@/utils/formutils";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}`,
});

const Organizationid = process.env.NEXT_PUBLIC_ORGANIZATION_ID;
export const cbtAPIendpoint = "/CBTapi";

// ------------------------ Year ------------------------
export const fetchYears = async (): Promise<Years> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/years/`);
  return response.data;
};

export const createYear = async (yearData: Omit<Year, "id">): Promise<Year> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/years/create/`, converttoformData(yearData));
  return response.data;
};

export const updateYear = async (id: number, yearData: Partial<Year>): Promise<Year> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/years/${id}/update/`, converttoformData(yearData));
  return response.data;
};

export const deleteYear = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/years/${id}/delete/`);
  return id;
};

// --------------------- Test Type ---------------------
export const fetchTestTypes = async (): Promise<Testtypes> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testtypes/`);
  return response.data;
};

export const createTestType = async (data: Omit<Testtype, "id">): Promise<Testtype> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/testtypes/create/`, converttoformData(data));
  return response.data;
};

export const updateTestType = async (id: number, data: Partial<Testtype>): Promise<Testtype> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/testtypes/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteTestType = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/testtypes/${id}/delete/`);
  return id;
};

// ------------------------ Answer ------------------------
export const fetchAnswers = async (): Promise<Answers> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/answers/`);
  return response.data;
};

export const createAnswer = async (data: Omit<Answer, "id">): Promise<Answer> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/answers/create/`, converttoformData(data));
  return response.data;
};

export const updateAnswer = async (id: number, data: Partial<Answer>): Promise<Answer> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/answers/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteAnswer = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/answers/${id}/delete/`);
  return id;
};

// ------------------------ Question ------------------------
export const fetchQuestions = async (): Promise<Questions> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/questions/`);
  return response.data;
};

export const fetchQuestionsBySubject = async (subjectId: number): Promise<Questions> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/questions/?subject=${subjectId}`);
  return response.data;
};

export const createQuestion = async (data: Omit<Question, "id">): Promise<Question> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/questions/create/`, converttoformData(data));
  return response.data;
};

export const updateQuestion = async (id: number, data: Partial<Question>): Promise<Question> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/questions/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteQuestion = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/questions/${id}/delete/`);
  return id;
};

// ------------------------ Subject ------------------------
export const fetchSubjects = async (): Promise<Subjects> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/subjects/`);
  return response.data;
};

export const fetchSubjectsByTest = async (testId: number): Promise<Subjects> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/subjects/?test=${testId}`);
  return response.data;
};

export const createSubject = async (data: Omit<Subject, "id">): Promise<Subject> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/subjects/create/`, converttoformData(data));
  return response.data;
};

export const updateSubject = async (id: number, data: Partial<Subject>): Promise<Subject> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/subjects/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteSubject = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/subjects/${id}/delete/`);
  return id;
};

// ------------------------ Test ------------------------
export const fetchTests = async (): Promise<Tests> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/tests/`);
  return response.data;
};

export const fetchTestsByOrganization = async (organizationId: number): Promise<Tests> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/tests/?organization=${organizationId}`);
  return response.data;
};

export const fetchTestById = async (id: number): Promise<Test> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/tests/${id}/`);
  return response.data;
};

export const createTest = async (data: Omit<Test, "id">): Promise<Test> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/tests/create/`, converttoformData(data));
  return response.data;
};

export const updateTest = async (id: number, data: Partial<Test>): Promise<Test> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/tests/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteTest = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/tests/${id}/delete/`);
  return id;
};

// ------------------------ Test Result ------------------------
export const fetchTestResults = async (): Promise<Testresulls> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testresults/`);
  return response.data;
};

export const fetchTestResultsByUser = async (userId: number): Promise<Testresulls> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testresults/?user=${userId}`);
  return response.data;
};

export const fetchTestResultsByTest = async (testId: number): Promise<Testresulls> => {
  const response = await axiosInstance.get(`${cbtAPIendpoint}/testresults/?test=${testId}`);
  return response.data;
};

export const createTestResult = async (data: Omit<Testresult, "id">): Promise<Testresult> => {
  const response = await axiosInstance.post(`${cbtAPIendpoint}/testresults/create/`, converttoformData(data));
  return response.data;
};

export const updateTestResult = async (id: number, data: Partial<Testresult>): Promise<Testresult> => {
  const response = await axiosInstance.put(`${cbtAPIendpoint}/testresults/${id}/update/`, converttoformData(data));
  return response.data;
};

export const deleteTestResult = async (id: number): Promise<number> => {
  await axiosInstance.delete(`${cbtAPIendpoint}/testresults/${id}/delete/`);
  return id;
};
