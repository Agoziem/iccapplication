import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue) => {
    const isClient = typeof window !== 'undefined';

    const [storedValue, setStoredValue] = useState(() => {
        if (isClient) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.log(error);
                return initialValue;
            }
        } else {
            return initialValue;
        }
    });

    // Function that sets the item to Local Storage 
    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            if (isClient) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                setStoredValue(valueToStore);
            } else {
                console.log("window object is not defined yet");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
