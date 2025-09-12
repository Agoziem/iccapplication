/**
 * Returns a human-readable time difference like "8 days ago", "2 weeks ago", "3 months ago", etc.
 *
 * @param {Date | string | number} date - The date to compare with the current time.
 * @returns {string} - A string representing how long ago the date was.
 */
export const timeSince = (date: Date | string | number): string => {
  // Ensure the 'date' is converted to a valid number (timestamp) before performing any operations
  const timeStamp: number = new Date(date).getTime();

  // If the date is invalid, handle the error
  if (isNaN(timeStamp)) {
    return "Invalid date";
  }

  // Calculate the time difference in seconds
  const seconds: number = Math.floor((Date.now() - timeStamp) / 1000);

  let interval: number = seconds / 31536000; // seconds in a year
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " year ago" : " years ago")
    );
  }

  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " month ago" : " months ago")
    );
  }

  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " day ago" : " days ago")
    );
  }

  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " hour ago" : " hours ago")
    );
  }

  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " minute ago" : " minutes ago")
    );
  }

  
  return (
    Math.floor(seconds) +
    (Math.floor(seconds) === 1 ? " second ago" : " seconds ago")
  );
};

/**
 * Shortens the message by truncating it to a specified limit and adding ellipsis
 *
 * @param {string} message - The message to shorten
 * @param {number} limit - The maximum length of the message
 * @returns {string} - The shortened message with ellipsis if truncated, or original message if within limit
 */
export const shortenMessage = (message: string, limit: number): string => {
  if (message.length > limit) {
    return message.substring(0, limit) + "...";
  }
  return message;
};
