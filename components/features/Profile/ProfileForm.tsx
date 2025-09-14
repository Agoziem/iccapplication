import React, { useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUploader from "../../custom/Imageuploader/ImageUploader";
import { UserUpdateSchema } from "@/schemas/users";
import { UserUpdate, User } from "@/types/users";
import { useMyProfile, useUpdateUser } from "@/data/hooks/user.hooks";

interface ProfileFormProps {
  setAlert: (alert: { show: boolean; message: string; type: "success" | "danger" | "info" | "warning" }) => void;
  setEditMode: (editMode: boolean) => void;
}

// Enhanced UserUpdate schema for the form
const ProfileUpdateSchema = UserUpdateSchema.extend({
  Sex: z.enum(["male", "female", "other"]).optional(),
}).refine((data) => {
  // Custom validation: at least one field should be filled
  const hasData = Object.values(data).some(value => 
    value !== undefined && value !== null && value !== ''
  );
  return hasData;
}, {
  message: "At least one field must be filled to update profile",
});

type ProfileFormData = z.infer<typeof ProfileUpdateSchema>;

/**
 * Enhanced ProfileForm component with comprehensive TypeScript and react-hook-form
 * Uses proper schema validation and improved user experience
 * Optimized with React.memo and proper error handling
 */
const ProfileForm: React.FC<ProfileFormProps> = React.memo(({ setAlert, setEditMode }) => {
  // Data fetching
  const { data: userData, isLoading: isUserLoading } = useMyProfile();
  const { mutateAsync: updateUserMutation, isLoading: isUpdating } = useUpdateUser();

  // Form setup with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid, touchedFields }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      Sex: undefined,
      avatar: undefined,
    }
  });

  // Watch avatar field for the ImageUploader component
  const watchedAvatar = watch('avatar');

  // Populate form with user data when available
  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        Sex: (userData.Sex as "male" | "female" | "other") || undefined,
        avatar: userData.avatar || undefined,
      });
    }
  }, [userData, reset]);

  // Handle successful alert display
  const showAlert = useCallback((message: string, type: "success" | "danger" | "info" | "warning") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 4000);
  }, [setAlert]);

  // Handle form submission
  const onSubmit = useCallback(async (data: ProfileFormData) => {
    if (!userData?.id) {
      showAlert("User data not available. Please refresh and try again.", "danger");
      return;
    }

    try {
      // Only send fields that have been touched/changed
      const changedData: Partial<UserUpdate> = {};
      
      Object.keys(data).forEach((key) => {
        const fieldKey = key as keyof ProfileFormData;
        if (touchedFields[fieldKey] && data[fieldKey] !== '' && data[fieldKey] !== undefined) {
          // Type guard for Sex field
          if (fieldKey === 'Sex' && data[fieldKey]) {
            (changedData as any)[fieldKey] = data[fieldKey];
          } else if (fieldKey !== 'Sex') {
            (changedData as any)[fieldKey] = data[fieldKey];
          }
        }
      });

      if (Object.keys(changedData).length === 0) {
        showAlert("No changes were made to your profile.", "info");
        setEditMode(false);
        return;
      }

      await updateUserMutation({
        userId: userData.id,
        userData: changedData
      });

      showAlert(
        "Profile updated successfully! Changes may take a moment to reflect across the application.",
        "success"
      );
      setEditMode(false);
    } catch (error) {
      console.error('Profile update error:', error);
      showAlert(
        "An error occurred while updating your profile. Please try again.",
        "danger"
      );
    }
  }, [userData?.id, updateUserMutation, showAlert, setEditMode, touchedFields]);

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmCancel) return;
    }
    
    reset();
    setEditMode(false);
  }, [isDirty, reset, setEditMode]);

  // Handle image upload for the ImageUploader component
  const handleImageChange = useCallback((file: File | null) => {
    if (file) {
      // Convert file to base64 or handle as needed for your API
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('avatar', result, { shouldDirty: true, shouldTouch: true });
      };
      reader.readAsDataURL(file);
    } else {
      setValue('avatar', undefined, { shouldDirty: true, shouldTouch: true });
    }
  }, [setValue]);

  // Loading state
  if (isUserLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card p-4 p-md-4 mx-auto" style={{ maxWidth: "600px" }}>
        <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <button
              type="button"
              className="btn-close float-end"
              aria-label="Close"
              onClick={handleCancel}
              disabled={isUpdating}
            />
            <h4 className="text-center">Edit Profile</h4>
            <p className="text-center">Update your profile information</p>
          </div>

          <hr />

          {/* Profile Picture Upload */}
          <div className="form-profile mb-4">
            <div className="text-center">
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    name="avatar"
                    value={field.value}
                    onChange={handleImageChange}
                    onBlur={field.onBlur}
                    error={errors.avatar?.message}
                    disabled={isUpdating}
                    placeholder="Upload profile picture"
                  />
                )}
              />
              {errors.avatar && (
                <div className="text-danger small mt-1">
                  {errors.avatar.message}
                </div>
              )}
            </div>
          </div>

          <div className="row mt-2">
            {/* First Name */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="first_name" className="form-label text-primary fw-bold">
                <i className="bi bi-person-fill me-2" aria-hidden="true" />
                First Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.first_name ? 'is-invalid' : touchedFields.first_name ? 'is-valid' : ''}`}
                id="first_name"
                placeholder="Enter your first name"
                disabled={isUpdating}
                {...register('first_name')}
                aria-describedby={errors.first_name ? 'first_name_error' : undefined}
              />
              {errors.first_name && (
                <div id="first_name_error" className="invalid-feedback">
                  {errors.first_name.message}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="last_name" className="form-label text-primary fw-bold">
                <i className="bi bi-person-fill me-2" aria-hidden="true" />
                Last Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.last_name ? 'is-invalid' : touchedFields.last_name ? 'is-valid' : ''}`}
                id="last_name"
                placeholder="Enter your last name"
                disabled={isUpdating}
                {...register('last_name')}
                aria-describedby={errors.last_name ? 'last_name_error' : undefined}
              />
              {errors.last_name && (
                <div id="last_name_error" className="invalid-feedback">
                  {errors.last_name.message}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="col-12 col-md-6 mb-4">
              <p className="text-primary fw-bold mb-2">
                <i className="bi bi-gender-ambiguous me-2" aria-hidden="true" />
                Gender
              </p>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="male"
                    id="gender_male"
                    disabled={isUpdating}
                    {...register('Sex')}
                  />
                  <label className="form-check-label" htmlFor="gender_male">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="female"
                    id="gender_female"
                    disabled={isUpdating}
                    {...register('Sex')}
                  />
                  <label className="form-check-label" htmlFor="gender_female">
                    Female
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="other"
                    id="gender_other"
                    disabled={isUpdating}
                    {...register('Sex')}
                  />
                  <label className="form-check-label" htmlFor="gender_other">
                    Other
                  </label>
                </div>
              </div>
              {errors.Sex && (
                <div className="text-danger small mt-1">
                  {errors.Sex.message}
                </div>
              )}
            </div>

            {/* Email (Read Only) */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="email" className="form-label text-primary fw-bold">
                <i className="bi bi-envelope-at-fill me-2" aria-hidden="true" />
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={userData?.email || ""}
                readOnly
                disabled
                aria-label="Email address (read-only)"
              />
              <div className="form-text">
                <small>Email cannot be changed. Contact support if needed.</small>
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="phone" className="form-label text-primary fw-bold">
                <i className="bi bi-telephone-fill me-2" aria-hidden="true" />
                Phone Number
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : touchedFields.phone ? 'is-valid' : ''}`}
                id="phone"
                placeholder="Enter your phone number"
                disabled={isUpdating}
                {...register('phone')}
                aria-describedby={errors.phone ? 'phone_error' : undefined}
              />
              {errors.phone && (
                <div id="phone_error" className="invalid-feedback">
                  {errors.phone.message}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="address" className="form-label text-primary fw-bold">
                <i className="bi bi-geo-alt-fill me-2" aria-hidden="true" />
                Address
              </label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : touchedFields.address ? 'is-valid' : ''}`}
                id="address"
                placeholder="Enter your address"
                disabled={isUpdating}
                {...register('address')}
                aria-describedby={errors.address ? 'address_error' : undefined}
              />
              {errors.address && (
                <div id="address_error" className="invalid-feedback">
                  {errors.address.message}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex flex-column flex-md-row justify-content-end gap-2 my-3">
            <button
              type="button"
              className="btn btn-secondary rounded"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <i className="bi bi-x-circle me-2" aria-hidden="true" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded"
              disabled={isUpdating || !isValid || !isDirty}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2" aria-hidden="true" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger mt-3" role="alert">
              <h6 className="alert-heading">
                <i className="bi bi-exclamation-triangle me-2" />
                Please fix the following errors:
              </h6>
              <ul className="mb-0">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

ProfileForm.displayName = 'ProfileForm';

export default ProfileForm;
