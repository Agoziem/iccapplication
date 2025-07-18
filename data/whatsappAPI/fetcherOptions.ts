/**
 * @param {WAMessage} WAmessage
 */
export const sendWAMessageOptions = (WAmessage) => {
  return {
    /** @param {WAMessages} responses */
    optimisticData: (responses) => [...(responses || []), WAmessage],
    rollbackOnError: true,
    /**
     * @param {WAMessages} responses
     * @param {WAMessage} addedResponse
     */
    populateCache: (addedResponse, responses) => {
      const messageExists = responses.some(
        (message) => message.id === addedResponse.id
      );
      if (messageExists) {
        return responses.map((message) =>
          message.id === addedResponse.id
            ? { ...message, status: "sent" }
            : message
        );
      }
      return [...responses, { ...addedResponse, status: "sent" }];
    },
    revalidate: false,
  };
};

/**
 * @param {WATemplate} WATemplateMessage
 */
export const createTemplateMessageOptions = (WATemplateMessage) => {
  return {
    /** @param {WATemplateArray} responses */
    optimisticData: (responses) => [WATemplateMessage, ...(responses || [])],
    rollbackOnError: true,
    /**
     * @param {WATemplateArray} responses
     * @param {WATemplate} addedResponse
     */
    populateCache: (addedResponse, responses) => {
      const messageExists = responses.some(
        (message) => message.id === addedResponse.id
      );
      if (messageExists) {
        return responses.map((message) =>
          message.id === addedResponse.id ? addedResponse : message
        );
      }
      return [{ ...addedResponse, status: "sent" }, ...responses];
    },
    revalidate: false,
  };
};
