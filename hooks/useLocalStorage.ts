import { useState, useEffect } from "react";

type SetValue<T> = (value: T | ((val: T) => T)) => void;

// Helper function to safely parse JSON
const safeParseJSON = <T>(value: string, fallback: T): T => {
    try {
        // Additional validation for common invalid values
        if (value === "undefined" || value === "null" || value === "" || value === "NaN") {
            return fallback;
        }
        
        const parsed = JSON.parse(value);
        
        // Check if parsed value is valid
        if (parsed === undefined || parsed === null) {
            return fallback;
        }
        
        return parsed;
    } catch (error) {
        console.warn(`Failed to parse JSON value: "${value}"`, error);
        return fallback;
    }
};

const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValue<T>] => {
    const isClient = typeof window !== 'undefined';

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (isClient) {
            try {
                const item = window.localStorage.getItem(key);
                
                // Handle null, undefined, or empty string cases
                if (item === null || item === undefined) {
                    return initialValue;
                }
                
                // Use the safe parser
                return safeParseJSON(item, initialValue);
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
                // Clear the corrupted value from localStorage
                if (isClient) {
                    try {
                        window.localStorage.removeItem(key);
                    } catch (removeError) {
                        console.error(`Error removing corrupted localStorage key "${key}":`, removeError);
                    }
                }
                return initialValue;
            }
        } else {
            return initialValue;
        }
    });

    // Function that sets the item to Local Storage 
    const setValue: SetValue<T> = (value: T | ((val: T) => T)): void => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            if (isClient) {
                // Handle undefined or null values
                if (valueToStore === undefined || valueToStore === null) {
                    window.localStorage.removeItem(key);
                    setStoredValue(initialValue);
                } else {
                    const serializedValue = JSON.stringify(valueToStore);
                    window.localStorage.setItem(key, serializedValue);
                    setStoredValue(valueToStore);
                }
            } else {
                console.warn("localStorage is not available - window object is not defined yet");
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
            // Clear the problematic key if JSON.stringify fails
            if (isClient) {
                try {
                    window.localStorage.removeItem(key);
                } catch (removeError) {
                    console.error(`Error removing localStorage key "${key}":`, removeError);
                }
            }
        }
    };

    // Effect to handle storage events and cleanup
    useEffect(() => {
        if (!isClient) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    const newValue = safeParseJSON(e.newValue, initialValue);
                    setStoredValue(newValue);
                } catch (error) {
                    console.error(`Error handling storage change for key "${key}":`, error);
                    setStoredValue(initialValue);
                }
            }
        };

        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue, isClient]);

    return [storedValue, setValue];
}

export default useLocalStorage;
