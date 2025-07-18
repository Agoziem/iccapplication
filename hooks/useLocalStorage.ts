"use client";
import { useState, useEffect } from "react";

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;
type UseLocalStorageReturn<T> = [T, SetValue<T>];

const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
    const isClient = typeof window !== 'undefined';

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (isClient) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.error("Error reading from localStorage:", error);
                return initialValue;
            }
        } else {
            return initialValue;
        }
    });

    // Function that sets the item to Local Storage 
    const setValue: SetValue<T> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            if (isClient) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                setStoredValue(valueToStore);
            } else {
                console.warn("window object is not defined yet");
            }
        } catch (error) {
            console.error("Error setting localStorage:", error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
