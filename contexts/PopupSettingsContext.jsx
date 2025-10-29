"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const PopupSettingsContext = createContext({
    updateSettings: () => {},
    settings: {}
});

export function PopupSettingsProvider({ children }) {
    const initialSettings = {
        theme: "white",
        language: "en"
    };
    const [settings, setSettingsState] = useState(initialSettings);

    // Replaces the whole object or receives a function (prev => next)
    const setSettings = useCallback((next) => {
        setSettingsState(prev => (typeof next === "function" ? next(prev) : next));
    }, []);

    // Merges a partial object into the current state. Also accepts a function.
    const updateSettings = useCallback((partial) => {
        console.log(partial)
        setSettingsState(prev => {
            const patch = typeof partial === "function" ? partial(prev) : partial;
            return { ...prev, ...patch };
        });
    }, []);

    // Restores to the initialSettings provided when mounting the provider
    const resetSettings = useCallback(() => {
        setSettingsState(initialSettings);
    }, [initialSettings]);

    const value = { settings, setSettings, updateSettings, resetSettings };

    return (
        <PopupSettingsContext.Provider value={value}>
            {children}
        </PopupSettingsContext.Provider>
    );
}

export function usePopupSettings() {
    const ctx = useContext(PopupSettingsContext);
    return ctx;
}

export default PopupSettingsContext;