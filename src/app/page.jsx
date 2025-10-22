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
          <button onClick={() => openPopup("generic", { data: { message: "Oi eu sou um popup generico", title: "Salve" } })}>generic</button>
          <button onClick={() => openPopup("confirm", { data: { message: "Você deseja continuar?", title: "E então..." } })}>confirm</button>
          <button onClick={() => openPopup("form", { data: { message: "Oi eu sou o form eu pareço assustador mas sou fácil", components: [{ id: "01", type: "text", placeholder: "Texto", required: true, label: "Qual meu nome?" }] } })}>form</button>

          <button onClick={() => openPopup("crop_image", { data: { format: "circle", image: "/image02.png" } })}>crop_image (circle)</button>
          <button onClick={() => openPopup("crop_image", { data: { format: "square", image: "/image01.png" } })}>crop_image (square)</button>
        </section >
        <section>
          <h1>Configurações gerais (de TODOS os popups)</h1>
          <h3>Propriedades</h3>
          <div>
            <button onClick={() => openPopup("confirm", { closeOnEscape: false, data: { message: "Duvido me fechar com ESC", title: "confirma isso?" } })}>confirm</button>
            <span>closeOnEscape: false (popup nao fecha ao apertar esc)</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", { closeOnClickOutside: false, data: { message: "Duvido me fechar clicando fora", title: "confirma isso?" } })}>confirm</button>
            <span>closeOnClickOutsite: false (popup nao fecha ao clicar fora)</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", { timeout: 5000, data: { message: "Tenho só 5s de vida :(", title: "confirma isso?" } })}>confirm</button>
            <span>timeout: 5000 (popup fecha dps de 5s)</span>
          </div>
         <div>
            <button onClick={() => openPopup("confirm", { requireAction: true, data: {cancelLabel: "Sim", confirmLabel: "Claro", message: "hahaha vai ter q responder", title: "Você é gay?" } })}>confirm</button>
            <span>requireAction: true (usuário TEM q fazer alguma ação)</span>
          </div>
          <div>
            <button onClick={() => {
              openPopup("generic", { data: { message: "Espereeeeeeeeeeeeeeeeeeeee um pouco" } });
              setTimeout(() => {
                openPopup("generic", { data: { message: "Oi eu sou um novo popup" } })
              }, 3000)
            }}>generic</button>
            <span>keepLast: false (popup aberto some e só volta quando o ultimo é fechado)</span>
          </div>
          <div>
            <button onClick={() => {
              openPopup("generic", { data: { message: "Espereeeeeeeeeeeeeeeeeeeee um pouco" } });
              setTimeout(() => {
                openPopup("generic", { keepLast: true, data: { message: "Oi eu sou um novo popup" } })
              }, 3000)
            }}>generic</button>
            <span>keepLast: true (popup aberto NÃO some)</span>
          </div>
          <br />
          <h3>Visual (também é alteravel por css)</h3>
          <div>
            <button onClick={() => openPopup("generic", { hiddenFooter: true, data: { message: "Oi eu sou um popup sem footer", title: "Salve" } })}>generic</button>
            <span>hiddenFooter: true</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { hiddenHeader: true, data: { message: "Oi eu sou um popup sem header", title: "Salve" } })}>generic</button>
            <span>hiddenHeader: true</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { disableOpenAnimation: true, data: { message: "nao tem pulinho agr :(", title: "Salve" } })}>generic</button>
            <span>disableOpenAnimation: true</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { maxWidth: "1000px", data: { message: "TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO", title: "1000px (default)" } })}>generic</button>
            <span>maxWidth: "1000px" (default)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { maxWidth: "400px", data: { message: "TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO", title: "400px" } })}>generic</button>
            <span>maxWidth: "400px"</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { maxWidth: "100dvw", data: { message: "TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO TEXTO MUITO LONGO", title: "100dvw" } })}>generic</button>
            <span>maxWidth: "100dvw"</span>
          </div>
          <br />
          <div>
            <button onClick={() => openPopup("generic", { minWidth: "300px", data: { message: "curto", title: "300px" } })}>generic</button>
            <span>minWidth: "300px" (default)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { minWidth: "100px", data: { message: "curto", title: "100px" } })}>generic</button>
            <span>minWidth: "100px"</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { minWidth: "0px", data: { message: "curto", title: "0px", icon: "" } })}>generic</button>
            <span>minWidth: "0px"</span>
          </div>
          <br />
          <h3>Callbacks</h3>
          <div>
            <button onClick={() => openPopup("generic", { onOpen: (id) => alert(`Aberto! ID: ${id}`), data: { message: "viu???" } })}>generic</button>
            <span>onOpen()</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { onClose: (hasAction, id) => alert(`Fechado! Teve ação: ${hasAction} / ID: ${id}`), data: { message: "Me feche e verá." } })}>generic</button>
            <span>onClose()</span>
          </div>
        </section>
        <section>
          <h1>Configurações Especificas (de cada tipo)</h1>
          <h3>generic</h3>
          <p>dps escrevo</p>
          <br />
          <h3>confirm</h3>
          <p>dps escrevo</p>
          <br />
          <h3>form</h3>
          <p>dps escrevo</p>
          <br />
          <h3>crop_image</h3>
          <p>dps escrevo</p>
          <br />
        </section>
      </main>
    </>
  );
}
