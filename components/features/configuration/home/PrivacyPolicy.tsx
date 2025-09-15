"use client";
import React, { useTransition, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PulseLoader } from "react-spinners";
import Tiptap from "@/components/custom/Richtexteditor/Tiptap";
import {
  useOrganization,
  useUpdateOrganization,
} from "@/data/hooks/organization.hooks";
import { ORGANIZATION_ID } from "@/data/constants";

type PrivacyPolicyFormData = {
  privacy_policy: string;
};

const PrivacyPolicy = () => {
  const { data: OrganizationData } = useOrganization(
    parseInt(ORGANIZATION_ID || "0")
  );
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  // Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<PrivacyPolicyFormData>({
    defaultValues: {
      privacy_policy: "",
    },
  });

  // Initialize form with organization data
  useEffect(() => {
    if (OrganizationData) {
      setValue("privacy_policy", OrganizationData.privacy_policy || "");
    }
  }, [OrganizationData, setValue]);

  // Watch the privacy_policy value
  const privacyPolicyValue = watch("privacy_policy");

  // Handle form submission
  const onSubmit = async (data: PrivacyPolicyFormData) => {
    if (!OrganizationData) return;
    startTransition(async () => {
      try {
        await updateOrganization({
          organizationId: OrganizationData.id || 0,
          updateData: {
            privacy_policy: data.privacy_policy,
          },
        });

        // Show success feedback (you might want to add a toast notification here)
        console.log("Privacy Policy updated successfully");
      } catch (error) {
        console.error("Error updating Privacy Policy:", error);
      }
    });
  };

  return (
    <div className="card p-4 py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Privacy Policy</h5>
        {isSubmitting && (
          <div className="d-flex align-items-center text-muted">
            <PulseLoader
              size={8}
              color={"#0d6efd"}
              loading={true}
              className="me-2"
            />
            <small>Saving...</small>
          </div>
        )}
      </div>
      <hr />
      <p className="text-muted mb-4">
        Add or edit Privacy Policy for your organization
      </p>

      <form onSubmit={handleFormSubmit(onSubmit)}>
        <div className="mb-4">
          <Controller
            name="privacy_policy"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Tiptap
                item={value || ""}
                setItem={(newValue: string) => {
                  onChange(newValue);
                }}
              />
            )}
          />
          {errors.privacy_policy && (
            <div className="text-danger mt-2">
              <small>{errors.privacy_policy.message}</small>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="d-inline-flex align-items-center justify-content-center gap-2">
                <div>Saving Changes...</div>
                <PulseLoader size={8} color={"#ffffff"} loading={true} />
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivacyPolicy;
