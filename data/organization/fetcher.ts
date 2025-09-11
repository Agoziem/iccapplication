/**
 * @fileoverview Organization Management API Integration
 * 
 * Comprehensive API integration for organization system operations including
 * organizations, staff, departments, testimonials, subscriptions with enhanced
 * error handling, validation, and performance optimizations.
 * 
 * Features:
 * - Enhanced axios configuration with 15-second timeouts
 * - Request/response interceptors for comprehensive logging
 * - Zod validation for all API responses
 * - Production-ready error handling and recovery
 * - Support for bulk operations and complex queries
 * - File upload handling for images and documents
 * - Comprehensive filtering and pagination support
 * 
 * @version 3.0.0
 * @author Innovation CyberCafe Team
 */

import axios from "axios";
import {
  OrganizationSchema,
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  OrganizationArraySchema,
  StaffSchema,
  CreateStaffSchema,
  UpdateStaffSchema,
  StaffArraySchema,
  PaginatedStaffSerializer,
  DepartmentSchema,
  CreateDepartmentSchema,
  DepartmentArraySchema,
  PaginatedDepartmentSerializer,
  TestimonialSchema,
  CreateTestimonialSchema,
  TestimonialArraySchema,
  PaginatedTestimonialSerializer,
  SubscriptionSchema,
  CreateSubscriptionSchema,
  SubscriptionArraySchema,
  PaginatedSubscriptionSerializer,
} from "@/schemas/organizations";
import { converttoformData } from "@/utils/formutils";

// =================== ENHANCED AXIOS CONFIGURATION =================== //

/**
 * Enhanced axios instance with comprehensive configuration
 * Features timeout, interceptors, and production-ready error handling
 */
export const organizationApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/api`,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for enhanced logging and debugging
organizationApi.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(`🏢 [${timestamp}] Organization API Request:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      hasData: !!config.data,
    });
    return config;
  },
  (error) => {
    console.error('🏢 [API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for enhanced logging and error handling
organizationApi.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString();
    console.log(`🏢 [${timestamp}] Organization API Response:`, {
      status: response.status,
      url: response.config.url,
      dataSize: response.data ? JSON.stringify(response.data).length : 0,
    });
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`🏢 [${timestamp}] Organization API Error:`, {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    
    // Enhanced error handling with specific messages
    if (error.response?.status === 404) {
      error.message = 'Organization resource not found';
    } else if (error.response?.status === 403) {
      error.message = 'Access denied to organization resource';
    } else if (error.response?.status === 500) {
      error.message = 'Organization server error. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Organization request timeout. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Organization ID from environment variables
 */
const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

// =================== CORE ORGANIZATION OPERATIONS =================== //

/**
 * Fetches the main organization data
 * Retrieves comprehensive organization information with enhanced validation.
 * 
 * Endpoint: GET /api/organization/{organization_id}/
 * API Name: api_organization_read
 * 
 * @async
 * @function fetchOrganization
 * @returns {Promise<OrganizationData>} Validated organization data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganization = async () => {
  try {
    const response = await organizationApi.get(`/organization/${organizationId}/`);
    
    const validation = OrganizationSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Organization data validation failed:', validation.error.issues);
      throw new Error(`Invalid organization data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization fetched successfully:', validation.data.name);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch organization:', error);
    throw new Error(`Failed to fetch organization: ${error.message}`);
  }
};

/**
 * Fetches multiple organizations with filtering and pagination
 * Supports advanced filtering and validation.
 * 
 * Endpoint: GET /api/organization/
 * API Name: api_organization_list
 * 
 * @async
 * @function fetchOrganizations
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Promise<OrganizationArray>} Array of validated organizations
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizations = async (filters = {}) => {
  try {
    const response = await organizationApi.get('/organization/', { params: filters });
    
    const validation = OrganizationArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Organizations array validation failed:', validation.error.issues);
      throw new Error(`Invalid organizations data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏢 [SUCCESS] ${validation.data.length} organizations fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch organizations:', error);
    throw new Error(`Failed to fetch organizations: ${error.message}`);
  }
};

/**
 * Fetches a single organization by ID
 * Retrieves detailed organization information.
 * 
 * Endpoint: GET /api/organization/{organization_id}/
 * API Name: api_organization_read
 * 
 * @async
 * @function fetchOrganizationById
 * @param {number} id - Organization ID
 * @returns {Promise<OrganizationData>} Validated organization data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationById = async (id) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('Valid organization ID is required');
    }

    const response = await organizationApi.get(`/organization/${id}/`);
    
    const validation = OrganizationSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Organization validation failed:', validation.error.issues);
      throw new Error(`Invalid organization data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization fetched by ID:', validation.data.name);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch organization by ID:', error);
    throw new Error(`Failed to fetch organization: ${error.message}`);
  }
};

/**
 * Creates a new organization
 * Validates input data and handles file uploads.
 * 
 * Endpoint: POST /api/organization/add/
 * API Name: api_organization_add_create
 * 
 * @async
 * @function createOrganization
 * @param {CreateOrganizationData} organizationData - Organization data to create
 * @returns {Promise<OrganizationData>} Created organization data
 * @throws {Error} When validation fails or API request fails
 */
export const createOrganization = async (organizationData) => {
  try {
    // Validate input data
    const validation = CreateOrganizationSchema.safeParse(organizationData);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Create organization validation failed:', validation.error.issues);
      throw new Error(`Invalid organization data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.post('/organization/add/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = OrganizationSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('🏢 [VALIDATION] Created organization validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid created organization data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization created successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to create organization:', error);
    throw new Error(`Failed to create organization: ${error.message}`);
  }
};

/**
 * Updates an existing organization
 * Supports partial updates with validation.
 * 
 * Endpoint: PUT /api/organization/update/{organization_id}/
 * API Name: api_organization_update_update
 * 
 * @async
 * @function updateOrganization
 * @param {number} id - Organization ID
 * @param {UpdateOrganizationData} organizationData - Updated organization data
 * @returns {Promise<OrganizationData>} Updated organization data
 * @throws {Error} When validation fails or API request fails
 */
export const updateOrganization = async (id, organizationData) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('Valid organization ID is required');
    }

    // Validate input data
    const validation = UpdateOrganizationSchema.safeParse(organizationData);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Update organization validation failed:', validation.error.issues);
      throw new Error(`Invalid organization data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.put(`/organization/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = OrganizationSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('🏢 [VALIDATION] Updated organization validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated organization data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization updated successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to update organization:', error);
    throw new Error(`Failed to update organization: ${error.message}`);
  }
};

/**
 * Updates organization privacy policy
 * 
 * Endpoint: PUT /api/organization/editprivacypolicy/{organization_id}/
 * API Name: api_organization_editprivacypolicy_update
 * 
 * @async
 * @function updateOrganizationPrivacyPolicy
 * @param {number} id - Organization ID
 * @param {Object} privacyPolicyData - Privacy policy data
 * @param {string} privacyPolicyData.privacy_policy - Privacy policy content
 * @returns {Promise<OrganizationData>} Updated organization data
 * @throws {Error} When validation fails or API request fails
 */
export const updateOrganizationPrivacyPolicy = async (id, privacyPolicyData) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('Valid organization ID is required');
    }
    if (!privacyPolicyData || !privacyPolicyData.privacy_policy) {
      throw new Error('Privacy policy content is required');
    }

    const response = await organizationApi.put(`/organization/editprivacypolicy/${id}/`, privacyPolicyData);
    
    const resultValidation = OrganizationSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('🏢 [VALIDATION] Updated organization privacy policy validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated organization data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization privacy policy updated successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to update organization privacy policy:', error);
    throw new Error(`Failed to update organization privacy policy: ${error.message}`);
  }
};

/**
 * Updates organization terms of use
 * 
 * Endpoint: PUT /api/organization/edittermsofuse/{organization_id}/
 * API Name: api_organization_edittermsofuse_update
 * 
 * @async
 * @function updateOrganizationTermsOfUse
 * @param {number} id - Organization ID
 * @param {Object} termsOfUseData - Terms of use data
 * @param {string} termsOfUseData.terms_of_use - Terms of use content
 * @returns {Promise<OrganizationData>} Updated organization data
 * @throws {Error} When validation fails or API request fails
 */
export const updateOrganizationTermsOfUse = async (id, termsOfUseData) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('Valid organization ID is required');
    }
    if (!termsOfUseData || !termsOfUseData.terms_of_use) {
      throw new Error('Terms of use content is required');
    }

    const response = await organizationApi.put(`/organization/edittermsofuse/${id}/`, termsOfUseData);
    
    const resultValidation = OrganizationSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('🏢 [VALIDATION] Updated organization terms of use validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated organization data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('🏢 [SUCCESS] Organization terms of use updated successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to update organization terms of use:', error);
    throw new Error(`Failed to update organization terms of use: ${error.message}`);
  }
};

/**
 * Deletes an organization
 * Permanently removes organization data.
 * 
 * Endpoint: DELETE /api/organization/delete/{organization_id}/
 * API Name: api_organization_delete_delete
 * 
 * @async
 * @function deleteOrganization
 * @param {number} id - Organization ID
 * @returns {Promise<number>} Deleted organization ID
 * @throws {Error} When API request fails
 */
export const deleteOrganization = async (id) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('Valid organization ID is required');
    }

    await organizationApi.delete(`/organization/delete/${id}/`);
    
    console.log('🏢 [SUCCESS] Organization deleted successfully:', id);
    return id;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to delete organization:', error);
    throw new Error(`Failed to delete organization: ${error.message}`);
  }
};

// =================== STAFF MANAGEMENT OPERATIONS =================== //

/**
 * Fetches all staff members for an organization
 * Retrieves complete staff listing with validation.
 * 
 * Endpoint: GET /api/staff/{organization_id}/
 * API Name: api_staff_list
 * 
 * @async
 * @function fetchOrganizationStaff
 * @param {number} organizationId - Organization ID
 * @returns {Promise<StaffArray>} Array of validated staff members
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationStaff = async (organizationId) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    const response = await organizationApi.get(`/staff/${organizationId}/`);
    
    const validation = StaffArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('👥 [VALIDATION] Staff array validation failed:', validation.error.issues);
      throw new Error(`Invalid staff data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`👥 [SUCCESS] ${validation.data.length} staff members fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('👥 [ERROR] Failed to fetch organization staff:', error);
    throw new Error(`Failed to fetch organization staff: ${error.message}`);
  }
};

/**
 * Fetches organization staff members with filtering (legacy support)
 * Supports pagination and advanced filtering.
 * 
 * @async
 * @function fetchStaff
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Promise<PaginatedStaffResponse>} Paginated staff data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchStaff = async (filters = {}) => {
  try {
    const response = await organizationApi.get(`/staff/${organizationId}/`, { params: filters });
    
    const validation = PaginatedStaffSerializer.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Staff data validation failed:', validation.error.issues);
      throw new Error(`Invalid staff data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏢 [SUCCESS] ${validation.data.results?.length || 0} staff members fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch staff:', error);
    throw new Error(`Failed to fetch staff: ${error.message}`);
  }
};

/**
 * Fetches a single staff member by ID
 * Retrieves detailed staff information.
 * 
 * Endpoint: GET /api/staff/{staff_id}/
 * API Name: api_staff_read
 * 
 * @async
 * @function fetchStaffById
 * @param {number} staffId - Staff member ID
 * @returns {Promise<StaffData>} Validated staff member data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchStaffById = async (staffId) => {
  try {
    if (!staffId || isNaN(Number(staffId))) {
      throw new Error('Valid staff ID is required');
    }

    const response = await organizationApi.get(`/staff/${staffId}/`);
    
    const validation = StaffSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('👥 [VALIDATION] Staff validation failed:', validation.error.issues);
      throw new Error(`Invalid staff data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('👥 [SUCCESS] Staff member fetched by ID:', `${validation.data.first_name} ${validation.data.last_name}`);
    return validation.data;
  } catch (error) {
    console.error('👥 [ERROR] Failed to fetch staff by ID:', error);
    throw new Error(`Failed to fetch staff member: ${error.message}`);
  }
};

/**
 * Creates a new staff member for an organization
 * Validates input data and handles file uploads.
 * 
 * Endpoint: POST /api/staff/add/{organization_id}/
 * API Name: api_staff_add_create
 * 
 * @async
 * @function createStaff
 * @param {number} organizationId - Organization ID
 * @param {CreateStaffData} staffData - Staff data to create
 * @returns {Promise<StaffData>} Created staff member data
 * @throws {Error} When validation fails or API request fails
 */
export const createStaff = async (organizationId, staffData) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    // Validate input data
    const validation = CreateStaffSchema.safeParse(staffData);
    if (!validation.success) {
      console.error('👥 [VALIDATION] Create staff validation failed:', validation.error.issues);
      throw new Error(`Invalid staff data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.post(`/staff/add/${organizationId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = StaffSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('👥 [VALIDATION] Created staff validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid created staff data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('👥 [SUCCESS] Staff member created successfully:', `${resultValidation.data.first_name} ${resultValidation.data.last_name}`);
    return resultValidation.data;
  } catch (error) {
    console.error('👥 [ERROR] Failed to create staff member:', error);
    throw new Error(`Failed to create staff member: ${error.message}`);
  }
};

/**
 * Updates an existing staff member
 * Supports partial updates with validation.
 * 
 * Endpoint: PUT /api/staff/update/{staff_id}/
 * API Name: api_staff_update_update
 * 
 * @async
 * @function updateStaff
 * @param {number} staffId - Staff member ID
 * @param {UpdateStaffData} staffData - Updated staff data
 * @returns {Promise<StaffData>} Updated staff member data
 * @throws {Error} When validation fails or API request fails
 */
export const updateStaff = async (staffId, staffData) => {
  try {
    if (!staffId || isNaN(Number(staffId))) {
      throw new Error('Valid staff ID is required');
    }

    // Validate input data - use partial staff schema for updates
    const validation = StaffSchema.partial().safeParse(staffData);
    if (!validation.success) {
      console.error('👥 [VALIDATION] Update staff validation failed:', validation.error.issues);
      throw new Error(`Invalid staff data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.put(`/staff/update/${staffId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = StaffSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('👥 [VALIDATION] Updated staff validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated staff data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('👥 [SUCCESS] Staff member updated successfully:', `${resultValidation.data.first_name} ${resultValidation.data.last_name}`);
    return resultValidation.data;
  } catch (error) {
    console.error('👥 [ERROR] Failed to update staff member:', error);
    throw new Error(`Failed to update staff member: ${error.message}`);
  }
};

/**
 * Deletes a staff member
 * Permanently removes staff member data.
 * 
 * Endpoint: DELETE /api/staff/delete/{staff_id}/
 * API Name: api_staff_delete_delete
 * 
 * @async
 * @function deleteStaff
 * @param {number} staffId - Staff member ID
 * @returns {Promise<number>} Deleted staff member ID
 * @throws {Error} When API request fails
 */
export const deleteStaff = async (staffId) => {
  try {
    if (!staffId || isNaN(Number(staffId))) {
      throw new Error('Valid staff ID is required');
    }

    await organizationApi.delete(`/staff/delete/${staffId}/`);
    
    console.log('👥 [SUCCESS] Staff member deleted successfully:', staffId);
    return staffId;
  } catch (error) {
    console.error('👥 [ERROR] Failed to delete staff member:', error);
    throw new Error(`Failed to delete staff member: ${error.message}`);
  }
};

// =================== DEPARTMENT MANAGEMENT OPERATIONS =================== //

/**
 * Fetches all departments for an organization
 * Retrieves complete department listing with validation.
 * 
 * Endpoint: GET /api/department/{organization_id}/
 * API Name: api_department_read
 * 
 * @async
 * @function fetchOrganizationDepartments
 * @param {number} organizationId - Organization ID
 * @returns {Promise<DepartmentArray>} Array of validated departments
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationDepartments = async (organizationId) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    const response = await organizationApi.get(`/department/${organizationId}/`);
    
    const validation = DepartmentArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('🏛️ [VALIDATION] Department array validation failed:', validation.error.issues);
      throw new Error(`Invalid department data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏛️ [SUCCESS] ${validation.data.length} departments fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏛️ [ERROR] Failed to fetch organization departments:', error);
    throw new Error(`Failed to fetch organization departments: ${error.message}`);
  }
};

/**
 * Fetches organization departments with filtering (legacy support)
 * Supports pagination and advanced filtering.
 * 
 * @async
 * @function fetchDepartments
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Promise<Object>} Paginated department data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchDepartments = async (filters = {}) => {
  try {
    const response = await organizationApi.get(`/department/${organizationId}/`, { params: filters });
    
    const validation = PaginatedDepartmentSerializer.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Department data validation failed:', validation.error.issues);
      throw new Error(`Invalid department data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏢 [SUCCESS] ${validation.data.results?.length || 0} departments fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch departments:', error);
    throw new Error(`Failed to fetch departments: ${error.message}`);
  }
};

/**
 * Fetches a single department by ID
 * Retrieves detailed department information.
 * 
 * Endpoint: GET /api/department/{department_id}/
 * API Name: api_department_read (specific department)
 * 
 * @async
 * @function fetchDepartmentById
 * @param {number} departmentId - Department ID
 * @returns {Promise<DepartmentData>} Validated department data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchDepartmentById = async (departmentId) => {
  try {
    if (!departmentId || isNaN(Number(departmentId))) {
      throw new Error('Valid department ID is required');
    }

    const response = await organizationApi.get(`/department/${departmentId}/`);
    
    const validation = DepartmentSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('�️ [VALIDATION] Department validation failed:', validation.error.issues);
      throw new Error(`Invalid department data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('�️ [SUCCESS] Department fetched by ID:', validation.data.name);
    return validation.data;
  } catch (error) {
    console.error('�️ [ERROR] Failed to fetch department by ID:', error);
    throw new Error(`Failed to fetch department: ${error.message}`);
  }
};

/**
 * Creates a new department for an organization
 * Validates input data and handles file uploads.
 * 
 * Endpoint: POST /api/department/add/{organization_id}/
 * API Name: api_department_add_create
 * 
 * @async
 * @function createDepartment
 * @param {number} organizationId - Organization ID
 * @param {CreateDepartmentData} departmentData - Department data to create
 * @returns {Promise<DepartmentData>} Created department data
 * @throws {Error} When validation fails or API request fails
 */
export const createDepartment = async (organizationId, departmentData) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    // Validate input data
    const validation = CreateDepartmentSchema.safeParse(departmentData);
    if (!validation.success) {
      console.error('�️ [VALIDATION] Create department validation failed:', validation.error.issues);
      throw new Error(`Invalid department data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.post(`/department/add/${organizationId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = DepartmentSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('�️ [VALIDATION] Created department validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid created department data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('�️ [SUCCESS] Department created successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('�️ [ERROR] Failed to create department:', error);
    throw new Error(`Failed to create department: ${error.message}`);
  }
};

/**
 * Updates an existing department
 * Supports partial updates with validation.
 * 
 * Endpoint: PUT /api/department/update/{department_id}/
 * API Name: api_department_update_update
 * 
 * @async
 * @function updateDepartment
 * @param {number} departmentId - Department ID
 * @param {UpdateDepartmentData} departmentData - Updated department data
 * @returns {Promise<DepartmentData>} Updated department data
 * @throws {Error} When validation fails or API request fails
 */
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    if (!departmentId || isNaN(Number(departmentId))) {
      throw new Error('Valid department ID is required');
    }

    // Validate input data - use partial department schema for updates
    const validation = DepartmentSchema.partial().safeParse(departmentData);
    if (!validation.success) {
      console.error('�️ [VALIDATION] Update department validation failed:', validation.error.issues);
      throw new Error(`Invalid department data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.put(`/department/update/${departmentId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = DepartmentSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('�️ [VALIDATION] Updated department validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated department data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('�️ [SUCCESS] Department updated successfully:', resultValidation.data.name);
    return resultValidation.data;
  } catch (error) {
    console.error('�️ [ERROR] Failed to update department:', error);
    throw new Error(`Failed to update department: ${error.message}`);
  }
};

/**
 * Deletes a department
 * Permanently removes department data.
 * 
 * Endpoint: DELETE /api/department/delete/{department_id}/
 * API Name: api_department_delete_delete
 * 
 * @async
 * @function deleteDepartment
 * @param {number} departmentId - Department ID
 * @returns {Promise<number>} Deleted department ID
 * @throws {Error} When API request fails
 */
export const deleteDepartment = async (departmentId) => {
  try {
    if (!departmentId || isNaN(Number(departmentId))) {
      throw new Error('Valid department ID is required');
    }

    await organizationApi.delete(`/department/delete/${departmentId}/`);
    
    console.log('�️ [SUCCESS] Department deleted successfully:', departmentId);
    return departmentId;
  } catch (error) {
    console.error('�️ [ERROR] Failed to delete department:', error);
    throw new Error(`Failed to delete department: ${error.message}`);
  }
};

// =================== TESTIMONIAL MANAGEMENT OPERATIONS =================== //

/**
 * Fetches all testimonials for an organization
 * Retrieves complete testimonial listing with validation.
 * 
 * Endpoint: GET /api/testimonial/{organization_id}/
 * API Name: api_testimonial_list
 * 
 * @async
 * @function fetchOrganizationTestimonials
 * @param {number} organizationId - Organization ID
 * @returns {Promise<TestimonialArray>} Array of validated testimonials
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationTestimonials = async (organizationId) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    const response = await organizationApi.get(`/testimonial/${organizationId}/`);
    
    const validation = TestimonialArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💬 [VALIDATION] Testimonial array validation failed:', validation.error.issues);
      throw new Error(`Invalid testimonial data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`💬 [SUCCESS] ${validation.data.length} testimonials fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('💬 [ERROR] Failed to fetch organization testimonials:', error);
    throw new Error(`Failed to fetch organization testimonials: ${error.message}`);
  }
};

/**
 * Fetches organization testimonials with filtering (legacy support)
 * Supports pagination and advanced filtering.
 * 
 * @async
 * @function fetchTestimonials
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Promise<Object>} Paginated testimonial data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestimonials = async (filters = {}) => {
  try {
    const response = await organizationApi.get(`/testimonial/${organizationId}/`, { params: filters });
    
    const validation = PaginatedTestimonialSerializer.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Testimonial data validation failed:', validation.error.issues);
      throw new Error(`Invalid testimonial data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏢 [SUCCESS] ${validation.data.results?.length || 0} testimonials fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch testimonials:', error);
    throw new Error(`Failed to fetch testimonials: ${error.message}`);
  }
};

/**
 * Fetches a single testimonial by ID
 * Retrieves detailed testimonial information.
 * 
 * Endpoint: GET /api/testimonial/{testimonial_id}/
 * API Name: api_testimonial_read
 * 
 * @async
 * @function fetchTestimonialById
 * @param {number} testimonialId - Testimonial ID
 * @returns {Promise<TestimonialData>} Validated testimonial data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchTestimonialById = async (testimonialId) => {
  try {
    if (!testimonialId || isNaN(Number(testimonialId))) {
      throw new Error('Valid testimonial ID is required');
    }

    const response = await organizationApi.get(`/testimonial/${testimonialId}/`);
    
    const validation = TestimonialSchema.safeParse(response.data);
    if (!validation.success) {
      console.error('💬 [VALIDATION] Testimonial validation failed:', validation.error.issues);
      throw new Error(`Invalid testimonial data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('💬 [SUCCESS] Testimonial fetched by ID:', validation.data.name || validation.data.id);
    return validation.data;
  } catch (error) {
    console.error('💬 [ERROR] Failed to fetch testimonial by ID:', error);
    throw new Error(`Failed to fetch testimonial: ${error.message}`);
  }
};

/**
 * Creates a new testimonial for an organization
 * Validates input data and handles file uploads.
 * 
 * Endpoint: POST /api/testimonial/add/{organization_id}/
 * API Name: api_testimonial_add_create
 * 
 * @async
 * @function createTestimonial
 * @param {number} organizationId - Organization ID
 * @param {CreateTestimonialData} testimonialData - Testimonial data to create
 * @returns {Promise<TestimonialData>} Created testimonial data
 * @throws {Error} When validation fails or API request fails
 */
export const createTestimonial = async (organizationId, testimonialData) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    // Validate input data
    const validation = CreateTestimonialSchema.safeParse(testimonialData);
    if (!validation.success) {
      console.error('💬 [VALIDATION] Create testimonial validation failed:', validation.error.issues);
      throw new Error(`Invalid testimonial data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.post(`/testimonial/add/${organizationId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = TestimonialSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('💬 [VALIDATION] Created testimonial validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid created testimonial data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('💬 [SUCCESS] Testimonial created successfully:', resultValidation.data.name || resultValidation.data.id);
    return resultValidation.data;
  } catch (error) {
    console.error('💬 [ERROR] Failed to create testimonial:', error);
    throw new Error(`Failed to create testimonial: ${error.message}`);
  }
};

/**
 * Updates an existing testimonial
 * Supports partial updates with validation.
 * 
 * Endpoint: PUT /api/testimonial/update/{testimonial_id}/
 * API Name: api_testimonial_update_update
 * 
 * @async
 * @function updateTestimonial
 * @param {number} testimonialId - Testimonial ID
 * @param {Object} testimonialData - Updated testimonial data
 * @returns {Promise<TestimonialData>} Updated testimonial data
 * @throws {Error} When validation fails or API request fails
 */
export const updateTestimonial = async (testimonialId, testimonialData) => {
  try {
    if (!testimonialId || isNaN(Number(testimonialId))) {
      throw new Error('Valid testimonial ID is required');
    }

    // Validate input data - use partial testimonial schema for updates
    const validation = TestimonialSchema.partial().safeParse(testimonialData);
    if (!validation.success) {
      console.error('💬 [VALIDATION] Update testimonial validation failed:', validation.error.issues);
      throw new Error(`Invalid testimonial data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    // Convert to FormData for file uploads
    const formData = converttoformData(validation.data);
    
    const response = await organizationApi.put(`/testimonial/update/${testimonialId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resultValidation = TestimonialSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('💬 [VALIDATION] Updated testimonial validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated testimonial data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('💬 [SUCCESS] Testimonial updated successfully:', resultValidation.data.name || resultValidation.data.id);
    return resultValidation.data;
  } catch (error) {
    console.error('💬 [ERROR] Failed to update testimonial:', error);
    throw new Error(`Failed to update testimonial: ${error.message}`);
  }
};

/**
 * Deletes a testimonial
 * Permanently removes testimonial data.
 * 
 * Endpoint: DELETE /api/testimonial/delete/{testimonial_id}/
 * API Name: api_testimonial_delete_delete
 * 
 * @async
 * @function deleteTestimonial
 * @param {number} testimonialId - Testimonial ID
 * @returns {Promise<number>} Deleted testimonial ID
 * @throws {Error} When API request fails
 */
export const deleteTestimonial = async (testimonialId) => {
  try {
    if (!testimonialId || isNaN(Number(testimonialId))) {
      throw new Error('Valid testimonial ID is required');
    }

    await organizationApi.delete(`/testimonial/delete/${testimonialId}/`);
    
    console.log('💬 [SUCCESS] Testimonial deleted successfully:', testimonialId);
    return testimonialId;
  } catch (error) {
    console.error('💬 [ERROR] Failed to delete testimonial:', error);
    throw new Error(`Failed to delete testimonial: ${error.message}`);
  }
};

// =================== SUBSCRIPTION MANAGEMENT OPERATIONS =================== //

/**
 * Fetches all subscriptions for an organization
 * Retrieves complete subscription listing with validation.
 * 
 * Endpoint: GET /api/subscription/{organization_id}/
 * API Name: api_subscription_list
 * 
 * @async
 * @function fetchOrganizationSubscriptions
 * @param {number} organizationId - Organization ID
 * @returns {Promise<SubscriptionArray>} Array of validated subscriptions
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationSubscriptions = async (organizationId) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    const response = await organizationApi.get(`/subscription/${organizationId}/`);
    
    const validation = SubscriptionArraySchema.safeParse(response.data);
    if (!validation.success) {
      console.error('📧 [VALIDATION] Subscription array validation failed:', validation.error.issues);
      throw new Error(`Invalid subscription data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`📧 [SUCCESS] ${validation.data.length} subscriptions fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('📧 [ERROR] Failed to fetch organization subscriptions:', error);
    throw new Error(`Failed to fetch organization subscriptions: ${error.message}`);
  }
};

/**
 * Fetches organization subscriptions with filtering (legacy support)
 * Supports pagination and advanced filtering.
 * 
 * @async
 * @function fetchSubscriptions
 * @param {Object} [filters={}] - Filter parameters
 * @returns {Promise<Object>} Paginated subscription data
 * @throws {Error} When API request fails or validation fails
 */
export const fetchSubscriptions = async (filters = {}) => {
  try {
    const response = await organizationApi.get(`/subscription/${organizationId}/`, { params: filters });
    
    const validation = PaginatedSubscriptionSerializer.safeParse(response.data);
    if (!validation.success) {
      console.error('🏢 [VALIDATION] Subscription data validation failed:', validation.error.issues);
      throw new Error(`Invalid subscription data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log(`🏢 [SUCCESS] ${validation.data.results?.length || 0} subscriptions fetched successfully`);
    return validation.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch subscriptions:', error);
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }
};

/**
 * Creates a new subscription for an organization
 * Validates input data for subscription creation.
 * 
 * Endpoint: POST /api/subscription/add/{organization_id}/
 * API Name: api_subscription_add_create
 * 
 * @async
 * @function createSubscription
 * @param {number} organizationId - Organization ID
 * @param {CreateSubscriptionData} subscriptionData - Subscription data to create
 * @returns {Promise<SubscriptionData>} Created subscription data
 * @throws {Error} When validation fails or API request fails
 */
export const createSubscription = async (organizationId, subscriptionData) => {
  try {
    if (!organizationId || isNaN(Number(organizationId))) {
      throw new Error('Valid organization ID is required');
    }

    // Validate input data
    const validation = CreateSubscriptionSchema.safeParse(subscriptionData);
    if (!validation.success) {
      console.error('📧 [VALIDATION] Create subscription validation failed:', validation.error.issues);
      throw new Error(`Invalid subscription data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    const response = await organizationApi.post(`/subscription/add/${organizationId}/`, validation.data);
    
    const resultValidation = SubscriptionSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('📧 [VALIDATION] Created subscription validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid created subscription data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('📧 [SUCCESS] Subscription created successfully:', resultValidation.data.email);
    return resultValidation.data;
  } catch (error) {
    console.error('📧 [ERROR] Failed to create subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Updates an existing subscription
 * Supports partial updates with validation.
 * 
 * Endpoint: PUT /api/subscription/update/{subscription_id}/
 * API Name: api_subscription_update_update
 * 
 * @async
 * @function updateSubscription
 * @param {number} subscriptionId - Subscription ID
 * @param {Object} subscriptionData - Updated subscription data
 * @returns {Promise<SubscriptionData>} Updated subscription data
 * @throws {Error} When validation fails or API request fails
 */
export const updateSubscription = async (subscriptionId, subscriptionData) => {
  try {
    if (!subscriptionId || isNaN(Number(subscriptionId))) {
      throw new Error('Valid subscription ID is required');
    }

    // Validate input data - use partial subscription schema for updates
    const validation = SubscriptionSchema.partial().safeParse(subscriptionData);
    if (!validation.success) {
      console.error('📧 [VALIDATION] Update subscription validation failed:', validation.error.issues);
      throw new Error(`Invalid subscription data: ${validation.error.issues.map(i => i.message).join(', ')}`);
    }

    const response = await organizationApi.put(`/subscription/update/${subscriptionId}/`, validation.data);
    
    const resultValidation = SubscriptionSchema.safeParse(response.data);
    if (!resultValidation.success) {
      console.error('📧 [VALIDATION] Updated subscription validation failed:', resultValidation.error.issues);
      throw new Error(`Invalid updated subscription data: ${resultValidation.error.issues.map(i => i.message).join(', ')}`);
    }
    
    console.log('📧 [SUCCESS] Subscription updated successfully:', resultValidation.data.email);
    return resultValidation.data;
  } catch (error) {
    console.error('📧 [ERROR] Failed to update subscription:', error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

/**
 * Deletes a subscription
 * Permanently removes subscription data.
 * 
 * Endpoint: DELETE /api/subscription/delete/{subscription_id}/
 * API Name: api_subscription_delete_delete
 * 
 * @async
 * @function deleteSubscription
 * @param {number} subscriptionId - Subscription ID
 * @returns {Promise<number>} Deleted subscription ID
 * @throws {Error} When API request fails
 */
export const deleteSubscription = async (subscriptionId) => {
  try {
    if (!subscriptionId || isNaN(Number(subscriptionId))) {
      throw new Error('Valid subscription ID is required');
    }

    await organizationApi.delete(`/subscription/delete/${subscriptionId}/`);
    
    console.log('📧 [SUCCESS] Subscription deleted successfully:', subscriptionId);
    return subscriptionId;
  } catch (error) {
    console.error('📧 [ERROR] Failed to delete subscription:', error);
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }
};

// =================== BULK OPERATIONS =================== //

/**
 * Bulk delete staff members
 * Efficiently deletes multiple staff members.
 * 
 * @async
 * @function bulkDeleteStaff
 * @param {number[]} staffIds - Array of staff IDs to delete
 * @returns {Promise<Object>} Bulk operation result
 * @throws {Error} When API request fails
 */
export const bulkDeleteStaff = async (staffIds) => {
  try {
    if (!Array.isArray(staffIds) || staffIds.length === 0) {
      throw new Error('Valid array of staff IDs is required');
    }

    const response = await organizationApi.post(`/organization/${organizationId}/staff/bulk-delete/`, {
      ids: staffIds
    });
    
    console.log('🏢 [SUCCESS] Bulk staff deletion completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to bulk delete staff:', error);
    throw new Error(`Failed to bulk delete staff: ${error.message}`);
  }
};

/**
 * Bulk delete departments
 * Efficiently deletes multiple departments.
 * 
 * @async
 * @function bulkDeleteDepartments
 * @param {number[]} departmentIds - Array of department IDs to delete
 * @returns {Promise<Object>} Bulk operation result
 * @throws {Error} When API request fails
 */
export const bulkDeleteDepartments = async (departmentIds) => {
  try {
    if (!Array.isArray(departmentIds) || departmentIds.length === 0) {
      throw new Error('Valid array of department IDs is required');
    }

    const response = await organizationApi.post(`/organization/${organizationId}/departments/bulk-delete/`, {
      ids: departmentIds
    });
    
    console.log('🏢 [SUCCESS] Bulk department deletion completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to bulk delete departments:', error);
    throw new Error(`Failed to bulk delete departments: ${error.message}`);
  }
};

// =================== STATISTICS AND ANALYTICS =================== //

/**
 * Fetches organization statistics
 * Retrieves comprehensive organization analytics data.
 * 
 * @async
 * @function fetchOrganizationStats
 * @param {Object} [options={}] - Statistics options
 * @returns {Promise<Object>} Organization statistics
 * @throws {Error} When API request fails or validation fails
 */
export const fetchOrganizationStats = async (options = {}) => {
  try {
    const response = await organizationApi.get(`/organization/${organizationId}/stats/`, { params: options });
    
    console.log('🏢 [SUCCESS] Organization statistics fetched successfully');
    return response.data;
  } catch (error) {
    console.error('🏢 [ERROR] Failed to fetch organization stats:', error);
    throw new Error(`Failed to fetch organization statistics: ${error.message}`);
  }
};
