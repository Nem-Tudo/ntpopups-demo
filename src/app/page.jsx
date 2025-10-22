"use client";
import useNtPopups from "ntpopups";
import { usePopupSettings } from "../../contexts/PopupSettingsContext";
import styles from "./page.module.css"

export default function Home() {
  const { openPopup } = useNtPopups();
  const { updateSettings } = usePopupSettings();

  function updateTheme(theme) {
    updateSettings({ theme })
  }
  function updateLanguage(language) {
    updateSettings({ language })
  }
  return (
    <>
      <main className={styles.main}>
        <a style={{ color: "#1168ff" }} href="https://ntpopups.nemtudo.me">Ler documentação completa (https://ntpopups.nemtudo.me)</a>
        <section>
          <span>Configurações</span>
          <button onClick={() => updateLanguage("en")}>Alterar idioma pra EN</button>
          <button onClick={() => updateTheme("dark")}>Alterar tema pra DARK</button>
          <button onClick={() => updateLanguage("ptbr")}>Alterar idioma pra PTBR</button>
          <button onClick={() => updateTheme("white")}>Alterar tema pra WHITE</button>
        </section>
        <section>
          <span>Tipos</span>
          <button onClick={() => openPopup("generic", { data: { message: "Oi eu sou um popup generico", title: "Salve" } })}>Generic</button>
          <button onClick={() => openPopup("confirm", { data: { message: "Você deseja continuar?", title: "E então..." } })}>Confirm</button>
          <button onClick={() => openPopup("form", { data: { message: "Oi eu sou o form eu pareço assustador mas sou fácil", components: [{ id: "01", type: "text", placeholder: "Texto", required: true, label: "Qual meu nome?" }] } })}>form</button>

          <button onClick={() => openPopup("crop_image", { data: { format: "circle", image: "/image02.png" } })}>crop image (circle)</button>
          <button onClick={() => openPopup("crop_image", { data: { format: "square", image: "/image01.png" } })}>crop image (square)</button>
        </section >
        {/* <section>
          <span>Configurações gerais</span>

        </section> */}
      </main>
    </>
  );
}
