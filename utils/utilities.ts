/**
 * Returns a human-readable time difference like "8 days ago", "2 weeks ago", "3 months ago", etc.
 *
 * @param {Date | string | number} date - The date to compare with the current time.
 * @returns {string} - A string representing how long ago the date was.
 */
export const timeSince = (date) => {
  // Ensure the 'date' is converted to a valid number (timestamp) before performing any operations
  const timeStamp = new Date(date).getTime();

  // If the date is invalid, handle the error
  if (isNaN(timeStamp)) {
    return "Invalid date";
  }

  // Calculate the time difference in seconds
  const seconds = Math.floor((Date.now() - timeStamp) / 1000);

  let interval = seconds / 31536000; // seconds in a year
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
 * Shortens the message
 *
 * @param {string} message
 * @param {number} limit
 * @returns {string}
 */
export const shortenMessage = (message, limit) => {
  if (message.length > limit) {
    return message.substring(0, limit) + "...";
  }
  return message;
};
