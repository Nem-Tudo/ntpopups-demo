"use client";
import { NtPopupProvider } from "ntpopups";
import { usePopupSettings } from "./PopupSettingsContext";
import "ntpopups/dist/styles.css"
import MyPopup from "../components/popups/MyPopup";

export default function PopupContext({ children }) {

    const { settings } = usePopupSettings();

    return <NtPopupProvider customPopups={
        { "my_popup": MyPopup }
    } language={settings.language} theme={settings.theme} >
        {children}
    </NtPopupProvider >
}