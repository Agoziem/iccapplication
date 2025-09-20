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

export const shortenMessage = (message: string, limit: number): string => {
  if (message.length > limit) {
    return message.substring(0, limit) + "...";
  }
  return message;
};

export const formatPrice = (price: string) => {
    try {
      return parseFloat(price).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    } catch {
      return `₦${price}`;
    }
  };

// ===============================
// LocalStorage Utilities
// ===============================

/**
 * Safely clear corrupted localStorage entries
 */
export const clearCorruptedLocalStorageEntries = (): void => {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];

  // Check all localStorage keys for corrupted values
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value === "undefined" || value === "null" || value === "NaN" || value === "") {
        keysToRemove.push(key);
      } else {
        try {
          JSON.parse(value || "");
        } catch (error) {
          console.warn(`Corrupted localStorage entry found for key: ${key}`, error);
          keysToRemove.push(key);
        }
      }
    }
  }

  // Remove corrupted entries
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`Removed corrupted localStorage entry: ${key}`);
    } catch (error) {
      console.error(`Failed to remove corrupted localStorage entry: ${key}`, error);
    }
  });

  if (keysToRemove.length > 0) {
    console.log(`Cleaned up ${keysToRemove.length} corrupted localStorage entries`);
  }
};

/**
 * Get localStorage item safely with fallback
 */
export const getLocalStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const item = localStorage.getItem(key);
    if (item === null || item === "undefined" || item === "null" || item === "") {
      return fallback;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    // Clear the corrupted entry
    try {
      localStorage.removeItem(key);
    } catch (removeError) {
      console.error(`Error removing corrupted localStorage key "${key}":`, removeError);
    }
    return fallback;
  }
};

/**
 * Set localStorage item safely
 */
export const setLocalStorageItem = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return true;
    }
    
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

