import React, { useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUploader from "../../custom/Imageuploader/ImageUploader";
import { UserUpdateSchema } from "@/schemas/users";
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
      avatar: "",
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
        avatar: userData.avatar_url || undefined,
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
      await updateUserMutation({
        userId: userData.id,
        userData: data
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
    <div className="p-3">
      <h5 className="text-center mb-4">
        Edit Profile
      </h5>
      <hr />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Profile Picture */}
        <div className="mb-2">
          <label htmlFor="avatar" className="form-label">
            Profile Picture
          </label>
          <Controller
            name="avatar"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <ImageUploader
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Upload profile picture"
                  error={fieldState.error?.message}
                  disabled={isUpdating}
                />
              </>
            )}
          />
        </div>

        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
            id="first_name"
            placeholder="Enter your first name"
            disabled={isUpdating}
            {...register('first_name')}
          />
          {errors.first_name && (
            <div className="invalid-feedback">
              {errors.first_name.message}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
            id="last_name"
            placeholder="Enter your last name"
            disabled={isUpdating}
            {...register('last_name')}
          />
          {errors.last_name && (
            <div className="invalid-feedback">
              {errors.last_name.message}
            </div>
          )}
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label className="form-label">
            Gender
          </label>
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
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={userData?.email || ""}
            readOnly
            disabled
          />
          <div className="form-text">
            <small>Email cannot be changed. Contact support if needed.</small>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            id="phone"
            placeholder="Enter your phone number"
            disabled={isUpdating}
            {...register('phone')}
          />
          {errors.phone && (
            <div className="invalid-feedback">
              {errors.phone.message}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            placeholder="Enter your address"
            disabled={isUpdating}
            {...register('address')}
          />
          {errors.address && (
            <div className="invalid-feedback">
              {errors.address.message}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUpdating || !isValid || !isDirty}
          >
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

ProfileForm.displayName = 'ProfileForm';

export default ProfileForm;
