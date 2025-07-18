/**
 * add Message Responses Configuration
 * @param {EmailResponse} newResponse
 */
export const addMessageResponseOptions = (newResponse) => {
  return {
    /** @param {EmailResponseArray} responses */
    optimisticData: (responses) =>
      [...responses, newResponse].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),

    rollbackOnError: true,
    /**
     * @param {EmailResponseArray} responses
     * @param {EmailResponse} addedResponse
     */
    populateCache: (addedResponse, responses) =>
      [...responses, addedResponse].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    revalidate: false,
  };
};

/**
 * Add Email Message Configuration
 * @param {EmailMessage | null} newSentEmail - New email to add or null if no subscription exists.
 */
export const createEmailOptions = (newSentEmail) => {
  return {
    /** 
     * Handle optimistic updates to reflect changes immediately in the UI.
     * @param {EmailMessageArray} sentemails 
     */
    optimisticData: (sentemails) => {
      if (!newSentEmail) return sentemails || []; // No changes if newSentEmail is null

      const updatedSentEmails = sentemails ? [...sentemails] : [];
      return [newSentEmail, ...updatedSentEmails];
    },

    rollbackOnError: true,

    /**
     * Update the cache with the latest data or handle scenarios where no email was created.
     * @param {EmailMessage | null} addedResponse - New response or null.
     * @param {EmailMessageArray} responses - Existing cached emails.
     * @returns {EmailMessageArray} Updated email list.
     */
    populateCache: (addedResponse, responses) => {
      if (!addedResponse) return responses; // No change if the response is null

      const emailExists = responses.some(
        (email) => email.id === addedResponse.id
      );

      if (emailExists) {
        return responses.map((email) =>
          email.id === addedResponse.id ? addedResponse : email
        );
      }

      return [{ ...addedResponse, status: "sent" }, ...responses];
    },

    revalidate: false,
  };
};

