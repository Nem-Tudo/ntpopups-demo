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

    // Substitui o objeto todo ou recebe uma função (prev => next)
    const setSettings = useCallback((next) => {
        setSettingsState(prev => (typeof next === "function" ? next(prev) : next));
    }, []);

    // Mescla um objeto parcial ao estado atual. Aceita função também.
    const updateSettings = useCallback((partial) => {
        console.log(partial)
        setSettingsState(prev => {
            const patch = typeof partial === "function" ? partial(prev) : partial;
            return { ...prev, ...patch };
        });
    }, []);

    // Restaura para o initialSettings fornecido ao montar o provider
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