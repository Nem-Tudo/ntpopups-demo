"use client";
import PopupContext from "./PopupContext";
import { PopupSettingsProvider } from "./PopupSettingsContext";
export default function Providers({ children }) {
    return <>
        <PopupSettingsProvider>
            <PopupContext>
                {children}
            </PopupContext>
        </PopupSettingsProvider>
    </>
}