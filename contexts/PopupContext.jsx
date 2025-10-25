"use client";
import { NtPopupProvider } from "ntpopups";
import { usePopupSettings } from "./PopupSettingsContext";
import "ntpopups/dist/styles.css"

import MyBuyPopup from "../components/popups/MyBuyPopup";
import MyUserPopup from "../components/popups/MyUserPopup";
import ShowCodePopup from "../components/popups/ShowCodePopup";

export default function PopupContext({ children }) {

    const { settings } = usePopupSettings();

    return <NtPopupProvider customPopups={
        {
            "my_buy_popup": MyBuyPopup,
            "my_user_popup": MyUserPopup,
            "show_code": ShowCodePopup
        }
    } language={settings.language} theme={settings.theme} >
        {children}
    </NtPopupProvider >
}