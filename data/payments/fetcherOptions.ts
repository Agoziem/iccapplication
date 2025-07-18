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
 * add Email Message Configuration
 * @param {EmailMessage} newSentEmail
 */
export const createEmailOptions = (newSentEmail) => {
  return {
    /** @param {EmailMessageArray} sentemails */
    optimisticData: (sentemails) => {
      const updatedSentEmails = sentemails ? [...sentemails] : [];
      return [newSentEmail, ...updatedSentEmails];
    },

    rollbackOnError: true,

    /**
     * @param {EmailMessageArray} responses
     * @param {EmailMessage} addedResponse
     */
    populateCache: (addedResponse, responses) => {
      const emailExists = responses.some(
        (email) => email.id === addedResponse.id
      );
      if (emailExists) {
        return responses.map((email) =>
          email.id === addedResponse.id ? addedResponse : email
        );
      }
      return [addedResponse, ...responses];
    },

    revalidate: false,
  };
};
