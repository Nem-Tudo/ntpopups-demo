"use client";
import useNtPopups from "ntpopups";
import { usePopupSettings } from "../../contexts/PopupSettingsContext";
import styles from "./page.module.css"

export default function Home() {
  const { openPopup, closePopup } = useNtPopups();
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
          <button onClick={() => openPopup("html", { data: { html: <h1 style={{ color: "black" }}>Hello world</h1> } })}>html</button>
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
            <button onClick={() => openPopup("confirm", { requireAction: true, data: { cancelLabel: "Sim", confirmLabel: "Claro", message: "hahaha vai ter q responder", title: "Você é gay?" } })}>confirm</button>
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
          <div>
            <button onClick={() => {
              openPopup("generic", { allowPageBodyScroll: true, data: { message: "vc pode scrollar a página agr" } });
            }}>generic</button>
            <span>allowPageBodyScroll: true (permite scroll na página)</span>
          </div>
          <div>
            <button onClick={() => {
              openPopup("generic", { interactiveBackdrop: true, data: { message: "agr vc pode interagir com o fundo" } });
            }}>generic</button>
            <span>interactiveBackdrop: true (permite interação com o fundo)</span>
          </div>
          <br />
          <h3>Visual (também é alteravel por css)</h3>
          <div>
            <button onClick={() => {
              openPopup("generic", { hiddenBackdrop: true, data: { message: "Não tem fundo omg" } });
            }}>generic</button>
            <span>hiddenBackdrop: true (Remove o fundo)</span>
          </div>
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
          <div>
            <button onClick={() => openPopup("generic")}>generic</button>
            <span>Default</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { data: { title: "Oi eu sou o título" } })}>generic</button>
            <span>title (texto ou elemento)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { data: { message: "Oi eu sou a mensagem" } })}>generic</button>
            <span>message (texto ou elemento)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { data: { icon: "✅" } })}>generic</button>
            <span>icon (texto ou elemento)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", { data: { closeLabel: "oi eu sou o closeLabel" } })}>generic</button>
            <span>closeLabel (texto ou elemento)</span>
          </div>
          <div>
            <button onClick={() => openPopup("generic", {
              requireAction: true,
              data:
              {
                icon: "✅",
                title: "Novos termos",
                message: <span>Nossos <a href="#">termos de serviço</a> foram atualizados!</span>,
                closeLabel: "Entendi"
              }
            })}>generic</button>
            <span>exemplo</span>
          </div>
          <br />
          <h3>confirm</h3>
          <div>
            <button onClick={() => openPopup("confirm")}>confirm</button>
            <span>Default</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                title: "Oi eu sou o título"
              }
            })}>confirm</button>
            <span>title</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                message: "Oi eu sou a mensagem"
              }
            })}>confirm</button>
            <span>message</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                icon: "❓"
              }
            })}>confirm</button>
            <span>icon</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                cancelLabel: "oi eu sou o cancelLabel"
              }
            })}>confirm</button>
            <span>cancelLabel</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                confirmLabel: "oi eu sou o confirmLabel"
              }
            })}>confirm</button>
            <span>confirmLabel</span>
          </div>
          <div>
            <span>confirmStyle</span>
            <button onClick={() => openPopup("confirm", {
              data: {
                confirmStyle: "Danger"
              }
            })}>"Danger"</button>
            <button onClick={() => openPopup("confirm", {
              data: {
                confirmStyle: "Success"
              }
            })}>"Success"</button>
            <button onClick={() => openPopup("confirm", {
              data: {
                confirmStyle: "Secondary"
              }
            })}>"Secondary"</button>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                onChoose: (choice) => alert(`Escolheu: ${choice ? "Confirmar" : "Cancelar"}`),
              }
            })}>confirm</button>
            <span>onChoose()</span>
          </div>
          <div>
            <button onClick={() => openPopup("confirm", {
              data: {
                confirmStyle: "Danger",
                icon: "🗑",
                title: "Excluir item",
                message: "Tem certeza que deseja excluir este item?",
                cancelLabel: "Cancelar",
                confirmLabel: "Excluir",
                onChoose: (choice) => choice && alert(`Excluído!`),
              }
            })}>confirm</button>
            <span>exemplo</span>
          </div>
          <br />
          <h3>form</h3>
          <div>
            <button onClick={() => openPopup("form")}>form</button>
            <span>Default</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  title: "Oi eu sou o título"
                }
              }
            )}>form</button>
            <span>title</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  message: "Oi eu sou a message",
                }
              }
            )}>form</button>
            <span>message</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  icon: "📩",
                }
              }
            )}>form</button>
            <span>icon</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  doneLabel: "aquii",
                }
              }
            )}>form</button>
            <span>doneLabel</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  onSubmit: (formData) => alert(`Dados enviados: ${JSON.stringify(formData)}`),
                }
              }
            )}>form</button>
            <span>onSubmit()</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  onChange: (formData) => alert(`Dados atualizados: ${JSON.stringify(formData)}`),
                }
              }
            )}>form</button>
            <span>onChange()</span>
          </div>
          <h4>components tipos</h4>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "text", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>text</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "textarea", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>textarea</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "checkbox", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>checkbox</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "file", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>file</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "email", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>email</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "date", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>date</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "number", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>number</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "password", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>password</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "time", label: "label", placeholder: "placeholder" },
                  ]
                }
              }
            )}>form</button>
            <span>time</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "radio", label: "Selecione", placeholder: "placeholder", options: ["Opção 1", "Opção 2"] },
                  ]
                }
              }
            )}>form</button>
            <span>radio</span>
          </div>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "01", type: "select", label: "Selecione", placeholder: "placeholder", options: ["Opção 1", "Opção 2"] },
                  ]
                }
              }
            )}>form</button>
            <span>select</span>
          </div>
          <h4>components configurações</h4>
          <br />
          <div>
            <div>
              <h4>text</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", disabled: true, placeholder: "placeholder" },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", placeholder: "placeholder", defaultValue: "oiii" },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "oiii"</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", placeholder: "placeholder", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", placeholder: "placeholder", minLength: 5 },
                      ]
                    }
                  }
                )}>form</button>
                <span>minLength: 5</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", placeholder: "placeholder", maxLength: 10 }
                      ]
                    }
                  }
                )}>form</button>
                <span>maxLength: 10</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "text", label: "label", placeholder: "placeholder", matchRegex: /\bgato\b/ }
                      ]
                    }
                  }
                )}>form</button>
                <span>matchRegex: /\bgato\b/ (texto tem que incluir a palavra "gato")</span>
              </div>
            </div>
            <div>
              <h4>textarea</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", disabled: true, placeholder: "placeholder" },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", defaultValue: "oiii" },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "oiii"</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", disableResize: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>disableResize: true (usuário não pode aumentar/diminuir)</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", minLength: 5 },
                      ]
                    }
                  }
                )}>form</button>
                <span>minLength: 5</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", maxLength: 10 }
                      ]
                    }
                  }
                )}>form</button>
                <span>maxLength: 10</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "textarea", label: "label", placeholder: "placeholder", matchRegex: /\bgato\b/ }
                      ]
                    }
                  }
                )}>form</button>
                <span>matchRegex: /\bgato\b/ (texto tem que incluir a palavra "gato")</span>
              </div>
            </div>
            <div>
              <h4>checkbox</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "checkbox", label: "label", disabled: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "checkbox", label: "label", defaultValue: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "checkbox", label: "label", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true (deve estar marcado)</span>
              </div>
            </div>
            <div>
              <h4>file</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "file", label: "label", disabled: true, defaultValue: [] },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "file", label: "label", accept: "image/*" },
                      ]
                    }
                  }
                )}>form</button>
                <span>accept: "image/*" (somente imagens)</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "file", label: "label", multiple: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>multiple: true (múltiplos arquivos)</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "file", label: "label", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true (pelo menos um arquivo)</span>
              </div>
            </div>
            <div>
              <h4>email</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "email", label: "label", disabled: true, placeholder: "placeholder" },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "email", label: "label", placeholder: "placeholder", defaultValue: "a@b.com" },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "a@b.com"</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "email", label: "label", placeholder: "placeholder", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
            </div>
            <div>
              <h4>number</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "number", label: "label", disabled: true, placeholder: "placeholder" },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "number", label: "label", placeholder: "placeholder", defaultValue: 42 },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: 42</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "number", label: "label", placeholder: "placeholder", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "number", label: "label", placeholder: "placeholder", min: 10 },
                      ]
                    }
                  }
                )}>form</button>
                <span>min: 10</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "number", label: "label", placeholder: "placeholder", max: 50 },
                      ]
                    }
                  }
                )}>form</button>
                <span>max: 50</span>
              </div>
            </div>
            <div>
              <h4>password</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "password", label: "label", disabled: true, placeholder: "placeholder" },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "password", label: "label", placeholder: "placeholder", defaultValue: "secreta" },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "secreta" (Não recomendado para senhas reais!)</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "password", label: "label", placeholder: "placeholder", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "password", label: "label", placeholder: "placeholder", minLength: 8 },
                      ]
                    }
                  }
                )}>form</button>
                <span>minLength: 8</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "password", label: "label", placeholder: "placeholder", maxLength: 16 },
                      ]
                    }
                  }
                )}>form</button>
                <span>maxLength: 16</span>
              </div>
            </div>
            <div>
              <h4>radio</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "radio", label: "label", disabled: true, options: ["Opção 1", "Opção 2"] },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "radio", label: "label", defaultValue: "valor2", options: [{ label: "Opção A", value: "valor1" }, { label: "Opção B", value: "valor2" }] },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "valor2" e options com label/value</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "radio", label: "label", required: true, options: ["Opção A", "Opção B"] },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true (uma opção deve ser selecionada)</span>
              </div>
            </div>
            <div>
              <h4>select</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "select", label: "label", disabled: true, options: ["Opção 1", "Opção 2"] },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "select", label: "label", defaultValue: "valor2", options: [{ label: "Opção A", value: "valor1" }, { label: "Opção B", value: "valor2" }] },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "valor2" e options com label/value</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "select", label: "label", required: true, options: ["Opção A", "Opção B"] },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true (uma opção deve ser selecionada)</span>
              </div>
            </div>
            <div>
              <h4>date</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "date", label: "label", disabled: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "date", label: "label", defaultValue: new Date("2007-01-25") },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: new Date("2007-01-25")</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "date", label: "label", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "date", label: "label", minDate: new Date(2023, 0, 5) },
                      ]
                    }
                  }
                )}>form</button>
                <span>minDate: new Date(2023, 0, 5)</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "date", label: "label", maxDate: new Date(2023, 11, 31) },
                      ]
                    }
                  }
                )}>form</button>
                <span>maxDate: new Date(2023, 11, 31)</span>
              </div>
            </div>
            <div>
              <h4>time</h4>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "time", label: "label", disabled: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>disabled: true</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "time", label: "label", defaultValue: "14:30" },
                      ]
                    }
                  }
                )}>form</button>
                <span>defaultValue: "14:30"</span>
              </div>
              <div>
                <button onClick={() => openPopup("form",
                  {
                    data: {
                      components: [
                        { id: "01", type: "time", label: "label", required: true },
                      ]
                    }
                  }
                )}>form</button>
                <span>required: true</span>
              </div>
            </div>
          </div>
          <h4>components em linha</h4>
          <div>
            <button onClick={() => openPopup("form",
              {
                data: {
                  components: [
                    { id: "a", type: "text", label: "label A", placeholder: "placeholder A" },
                    [{ id: "b", type: "text", label: "label B", placeholder: "placeholder B" }, { id: "c", type: "text", label: "label C", placeholder: "placeholder C" }],
                    { id: "d", type: "text", label: "label D", placeholder: "placeholder D" },
                    [{ id: "e", type: "text", label: "label E", placeholder: "placeholder E" }, { id: "f", type: "text", label: "label F", placeholder: "placeholder F" }, { id: "g", type: "text", label: "label G", placeholder: "placeholder G" }]
                  ]
                }
              }
            )}>form</button>
            <span>components: {`[{type: "text"}, [{type: "text"}, {type: "text"}], {type: "text"}, [{type: "text"}, {type: "text"}, {type: "text"}]}]`}</span>
          </div>
          <br />
          <h3>crop_image</h3>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                onCrop: (...data) => alert(`onCrop data:\n${JSON.stringify(data)}`),
              }
            })}>crop_image</button>
            <span>onCrop</span>
          </div>
          <h4>format: "circle"</h4>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
              }
            })}>crop_image</button>
            <span>Default</span>
          </div>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                minZoom: 0.5,
              }
            })}>crop_image</button>
            <span>minZoom: 0.5</span>
          </div>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                maxZoom: 10,
              }
            })}>crop_image</button>
            <span>maxZoom: 10</span>
          </div>
          <h4>format: "square"</h4>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                format: "square",
              }
            })}>crop_image</button>
            <span>Default</span>
          </div>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                format: "square",
                minZoom: 0.5,
              }
            })}>crop_image</button>
            <span>minZoom: 0.5</span>
          </div>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                format: "square",
                maxZoom: 10,
              }
            })}>crop_image</button>
            <span>maxZoom: 10</span>
          </div>
          <div>
            <button onClick={() => openPopup("crop_image", {
              data: {
                image: "/image01.png",
                format: "square",
                aspectRatio: "16:9",
              }
            })}>crop_image</button>
            <span>aspectRatio: 16:9</span>
          </div>
          <br />
          <h3>html</h3>
          <span>Atenção! Todos os outros popups também suportam HTML em suas propriedades! Só é recomendado o uso do popup tipo "html" em casos muito específicos.</span>
          <br />
          <br />
          <div>
            <button onClick={() => openPopup("html", {
              data: {
                html: <div style={{ color: "black" }}><h1>Olá, mundo!</h1><p>Este é um popup exibindo conteúdo HTML personalizado.</p><button onClick={() => closePopup(true)}>fechar</button></div>,
              }
            })}>html</button>
            <span>html: {`<div style={{ color: "black" }}><h1>Olá, mundo!</h1><p>Este é um popup exibindo conteúdo HTML personalizado.</p><button onClick={() => closePopup(true)}>fechar</button></div>`}</span>
          </div>
          <br />
          <br />
        </section>
        <section>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
          <h1>scroll</h1>
        </section>
      </main >
    </>
  );
}
