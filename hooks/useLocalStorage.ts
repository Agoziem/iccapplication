import { useState, useEffect } from "react";

type SetValue<T> = (value: T | ((val: T) => T)) => void;

const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValue<T>] => {
    const isClient = typeof window !== 'undefined';

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (isClient) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.error(`Error reading localStorage key "${key}":`, error);
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
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                setStoredValue(valueToStore);
            } else {
                console.warn("localStorage is not available - window object is not defined yet");
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
