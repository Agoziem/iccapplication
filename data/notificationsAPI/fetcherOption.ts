/**
 * add Notification Configuration
 * @param {NotificationMessage} newnotification
 */
export const createnotificationoption = (newnotification) => {
  return {
    /** @param {NotificationMessages} sentnotifications */
    optimisticData: (sentnotifications) => {
      const updatedSentEmails = sentnotifications ? [...sentnotifications] : [];
      console.log(newnotification);
      return [...updatedSentEmails, newnotification].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    rollbackOnError: true,

    /**
     * @param {NotificationMessages} responses
     * @param {NotificationMessage} addedResponse
     */
    populateCache: (addedResponse, responses) => {
      const updatedResponses = responses ? [...responses] : [];
      // Add the new response and sort by `created_at`
      return [...updatedResponses, addedResponse].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    revalidate: false,
  };
};

/**
 * update Notification Configuration
 * @param {NotificationMessage} updatedNotification
 */
export const updateNotificationOption = (updatedNotification) => {
  // Helper function to update or add a notification and sort by `created_at`
  const updateAndSortNotifications = (notifications, newNotification) => {
    const updatedNotifications = notifications ? [...notifications] : [];

    // Find index of the existing notification
    const index = updatedNotifications.findIndex(
      (notification) => notification.id === newNotification.id
    );

    if (index > -1) {
      // Update the existing notification
      updatedNotifications[index] = {
        ...updatedNotifications[index],
        ...newNotification,
      };
    } else {
      // Add new notification if not found
      updatedNotifications.push(newNotification);
    }

    // Return sorted notifications by `created_at`
    return updatedNotifications.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  return {
    // Optimistically update notifications
    optimisticData: (sentNotifications) =>
      updateAndSortNotifications(sentNotifications, updatedNotification),

    // Rollback if there's an error
    rollbackOnError: true,

    // Update the cache after receiving the server response
    populateCache: (addedResponse, responses) =>
      updateAndSortNotifications(responses, addedResponse),

    // Disable revalidation after cache update
    revalidate: false,
  };
};

/**
 * Delete notification Message Configuration
 * @param {string} notificationId - ID of the notification to be deleted
 */
export const deleteNotificationOption = (notificationId) => {
  // Helper function to delete a notification by ID and sort the remaining notifications
  const deleteNotification = (notifications, notificationId) => {
    const updatedNotifications = notifications ? [...notifications] : [];

    // Filter out the notification to delete
    return updatedNotifications
      .filter((notification) => notification.id !== notificationId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  };

  return {
    // Optimistically delete the notification
    optimisticData: (sentNotifications) =>
      deleteNotification(sentNotifications, notificationId),

    // Rollback if there's an error
    rollbackOnError: true,

    // Update the cache after receiving the server response
    populateCache: (id, responses) => deleteNotification(responses, id),

    // Disable revalidation after cache update
    revalidate: false,
  };
};
