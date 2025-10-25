"use client";
import { useState, useCallback } from "react";
import useNtPopups from "ntpopups";
import { usePopupSettings } from "../../contexts/PopupSettingsContext";

// Importações da biblioteca react-simple-code-editor e Prism.js
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Importar linguagens e estilos (exemplo: JS e tema padrão)
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; // Estilo claro padrão do Prism.js

// Função utilitária para escapar strings (mantida do código original)
function escapeString(str) {
  // Escapa aspas duplas, mas não as strings de template literais (backticks)
  return String(str || "").replace(/"/g, '\\"').replace(/`/g, '\\`');
}

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


/**
 * Componente CodeBlock que utiliza react-simple-code-editor para visualização e cópia.
 */
const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const highlight = (code) =>
    Prism.highlight(code, Prism.languages.javascript, "javascript");

  return (
    <div className="codeBlockContainer">
      <Editor
        value={code}
        onValueChange={() => { }} // Não é editável, então a função é vazia
        highlight={highlight}
        padding={15}
        disabled={true} // Torna o editor não interativo
        style={{
          fontFamily: '"Fira Mono", "Roboto Mono", monospace',
          fontSize: 12,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          minHeight: "100px",
          backgroundColor: "#f9f9f9",
          overflowX: "auto",
        }}
      />

      <button onClick={copyToClipboard} className="copyButton">
        {copied ? "✅ Copiado!" : "📋 Copiar"}
      </button>

      <style jsx>{`
        .codeBlockContainer {
          position: relative;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .copyButton {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.3rem 0.6rem;
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
          opacity: 0.9;
          z-index: 10;
        }

        .copyButton:hover {
          background: #d4d4d4;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------
// Componente Principal Home
// ---------------------------------------------------------------------

// --- Constantes para o Form Builder ---
const componentTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'password', label: 'Password' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'select', label: 'Select' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' },
];

const processSingleComponent = (comp) => {
  const newComp = { ...comp };
  // Processa 'options' que pode estar como string JSON
  if ((newComp.type === 'radio' || newComp.type === 'select') && typeof newComp.options === 'string') {
    try {
      newComp.options = JSON.parse(newComp.options);
    } catch (e) {
      console.error("Invalid JSON in options for component:", newComp.id);
      newComp.options = []; // Default to empty
    }
  }
  // Converte datas de string para Objeto Date (necessário se o input type="date" foi usado)
  if (newComp.type === 'date') {
    if (newComp.minDate && typeof newComp.minDate === 'string') newComp.minDate = new Date(newComp.minDate);
    if (newComp.maxDate && typeof newComp.maxDate === 'string') newComp.maxDate = new Date(newComp.maxDate);
    if (newComp.defaultValue && typeof newComp.defaultValue === 'string') newComp.defaultValue = new Date(newComp.defaultValue);
  }
  return newComp;
};
// ---------------------------------------


export default function Home() {
  const { openPopup, closePopup, updatePopup } = useNtPopups();
  const { updateSettings } = usePopupSettings();

  // 1. Estado para controlar a visualização do código em Tipos de Popup e Configurações Avançadas
  const [showCode, setShowCode] = useState({}); // Para Tipos de Popup
  const [showAdvancedCode, setShowAdvancedCode] = useState({}); // Para Configurações Avançadas

  const [expandedProps, setExpandedProps] = useState({});
  const [currentTheme, setCurrentTheme] = useState("white");
  const [currentLang, setCurrentLang] = useState("en");

  // Estados para propriedades editáveis de cada tipo
  const [popupProps, setPopupProps] = useState({
    generic: {
      title: "Notificação",
      message: "Esta é uma mensagem informativa",
      icon: "ℹ️",
      closeLabel: "Fechar"
    },
    confirm: {
      title: "Confirmar ação",
      message: "Você tem certeza que deseja continuar?",
      icon: "❓",
      cancelLabel: "Cancelar",
      confirmLabel: "Confirmar",
      confirmStyle: "default"
    },
    form: {
      title: "Formulário Dinâmico",
      message: "",
      icon: "📩",
      doneLabel: "Enviar"
    },
    crop_image: {
      format: "circle",
      aspectRatio: "1:1",
      minZoom: 1,
      maxZoom: 4,
      image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNC9JTUFHRS8yMl8zOF80MF9fMTc2MTM1NjMyMDUyMi0zOTMyNzczMw.webp"
    },
    html: {
      html: `<div style={{ color: "black", padding: "20px", textAlign: "center" }}>
              <h2 style={{ marginBottom: "10px" }}>🎉 Olá!</h2>
              <p>Este é um popup com HTML totalmente customizado</p>
              <button
                onClick={() => closePopup(true)}
                style={{
                  marginTop: "15px",
                  padding: "8px 16px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Fechar
              </button>
            </div>`
    }
  });


  // --- NOVOS ESTADOS PARA O FORM BUILDER ---
  const [formComponents, setFormComponents] = useState([
    {
      id: 'name',
      type: 'text',
      label: 'Nome Completo',
      placeholder: 'Digite seu nome',
      required: true,
      minLength: 3,
      maxLength: 50
    },
    {
      id: 'country',
      type: 'select',
      label: 'País',
      options: [{ label: "Brasil", value: "br" }, { label: "Estados Unidos", value: "us" }, { label: "Outro", value: "other" }],
      required: true,
      defaultValue: "Brasil"
    },
    [
      {
        id: 'city',
        type: 'text',
        label: 'Cidade',
        placeholder: 'Nova Iorque'
      },
      {
        id: 'state',
        type: 'text',
        label: 'Estado',
        placeholder: 'NY',
        maxLength: 2
      }
    ]
  ]);

  // Caminho para o componente selecionado. Ex: [1] (segundo item) ou [3, 0] (primeiro item do quarto grupo)
  const [selectedComponentPath, setSelectedComponentPath] = useState(null);
  const [showFormBuilderCode, setShowFormBuilderCode] = useState(false);
  const [newComponentType, setNewComponentType] = useState("text");
  // -----------------------------------------


  const toggleCode = (id) => {
    setShowCode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Nova função para alternar o código avançado
  const toggleAdvancedCode = (id) => {
    setShowAdvancedCode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProps = (id) => {
    setExpandedProps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updatePopupProp = (type, key, value) => {
    setPopupProps(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    updateSettings({ theme });
  };

  const changeLang = (lang) => {
    setCurrentLang(lang);
    updateSettings({ language: lang });
  };

  const generateCode = (type) => {
    const props = popupProps[type];

    switch (type) {
      case 'generic':
        return `openPopup("generic", { 
  data: { 
    message: "${escapeString(props.message)}",
    title: "${escapeString(props.title)}",
    icon: "${escapeString(props.icon)}",
    closeLabel: "${escapeString(props.closeLabel)}"
  } 
})`;
      case 'confirm':
        return `openPopup("confirm", { 
  data: { 
    message: "${escapeString(props.message)}",
    title: "${escapeString(props.title)}",
    icon: "${escapeString(props.icon)}",
    cancelLabel: "${escapeString(props.cancelLabel)}",
    confirmLabel: "${escapeString(props.confirmLabel)}",
    confirmStyle: "${escapeString(props.confirmStyle)}",
    onChoose: (choice) => alert(choice ? "Confirmado!" : "Cancelado")
  } 
})`;
      case 'form': // Este é o código do demo simples, não o builder
        return `openPopup("form", { 
  data: { 
    title: "${escapeString(props.title)}",
    message: "${escapeString(props.message)}",
    icon: "${escapeString(props.icon)}",
    doneLabel: "${escapeString(props.doneLabel)}",
    components: [
      { id: "name", type: "text", label: "Nome", placeholder: "Seu nome", required: true },
      { id: "email", type: "email", label: "E-mail", placeholder: "seu@email.com", required: false },
    ],
    onSubmit: (data) => console.log(data)
  } 
})`;
      case 'crop_image':
        return `openPopup("crop_image", { 
  data: { 
    image: "${escapeString(props.image || "/demo/image01.png")}",
    format: "${escapeString(props.format)}",
    aspectRatio: "${(popupProps.crop_image.format != "square") ? "1:1" : escapeString(props.aspectRatio)}",
    minZoom: ${props.minZoom},
    maxZoom: ${props.maxZoom},
    onCrop: (data) => console.log(data)
  } 
})`;
      case 'html':
        return `openPopup("html", { 
  data: { 
    html: (
      <div style={{ color: "black", padding: "20px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "10px" }}>🎉 Olá!</h2>
        <p>Este é um popup com HTML totalmente customizado</p>
        {/* Você deve usar closePopup(true) se a ação fechar o popup */}
        <button onClick={() => closePopup(true)}>Fechar</button>
      </div>
    )
  } 
})`;
      default:
        return '';
    }
  };


  // --- NOVOS HANDLERS PARA O FORM BUILDER ---

  const handleSelectComponent = (path) => {
    setSelectedComponentPath(path);
  };

  // Função genérica para atualizar a propriedade de um componente (simples ou inline)
  const handlePropChange = (path, key, e, type = 'string') => {
    let value;

    let inputvalue = e.target.value;

    duplicatedIdChange()
    function duplicatedIdChange() {
      if (key === "id" && formComponents.find(c => c.id === inputvalue || (Array.isArray(c) && c.find(c => c.id === inputvalue)))) {
        inputvalue += "2";
        duplicatedIdChange()
      }
    }

    switch (type) {
      case 'string': value = inputvalue; break;
      case 'number': value = inputvalue === '' ? undefined : Number(inputvalue); break;
      case 'boolean': value = e.target.checked; break;
      case 'date': value = inputvalue === '' ? undefined : inputvalue; break; // Armazena como string, processa na abertura
      case 'json': value = inputvalue; break; // Armazena como string, processa na abertura
      default: value = inputvalue;
    }

    setFormComponents(prevComponents => {
      // Mapeia para criar cópias rasas e evitar mutação
      const newComponents = prevComponents.map(c => Array.isArray(c) ? [...c] : { ...c });

      let compRef;
      if (path.length === 1) { // Componente Nível Superior
        compRef = { ...newComponents[path[0]] };
        newComponents[path[0]] = compRef;
      } else { // Componente Inline
        compRef = { ...newComponents[path[0]][path[1]] };
        newComponents[path[0]][path[1]] = compRef;
      }

      if (value === undefined || value === null) {
        delete compRef[key];
      } else {
        compRef[key] = value;
      }

      return newComponents;
    });
  };

  const handleAddComponent = (type, groupIndex = null) => {
    const newId = randomString(6).toLocaleLowerCase();
    const newComponent = {
      id: newId,
      type: type,
      label: `Novo Campo (${type})`
    };

    if (groupIndex !== null) {
      // Adiciona a um grupo inline existente
      setFormComponents(prev => prev.map((group, index) => {
        if (index === groupIndex && Array.isArray(group)) {
          return [...group, newComponent];
        }
        return group;
      }));
    } else {
      // Adiciona ao nível superior
      setFormComponents(prev => [...prev, newComponent]);
    }
  };

  const handleAddInlineGroup = () => {
    setFormComponents(prev => [...prev, []]); // Adiciona um array vazio
  };

  const handleDeleteComponent = (path) => {
    setFormComponents(prev => {
      let newComponents = [...prev];
      if (path.length === 1) {
        // Deleta do nível superior
        newComponents.splice(path[0], 1);
      } else {
        // Deleta de um grupo inline
        newComponents[path[0]] = [...newComponents[path[0]]]; // Copia o grupo
        newComponents[path[0]].splice(path[1], 1);
      }
      return newComponents;
    });
    setSelectedComponentPath(null); // Desseleciona
  };

  // Helper para buscar o objeto do componente selecionado
  const getComponentByPath = (path) => {
    if (!path) return null;
    try {
      if (path.length === 1) return formComponents[path[0]];
      if (path.length === 2) return formComponents[path[0]][path[1]];
    } catch (e) {
      return null; // Pode acontecer se o item for deletado
    }
    return null;
  };

  // Gera o código para o Form Builder
  const generateFormBuilderCode = () => {
    const props = popupProps.form;

    // Custom stringifier para lidar com datas (que podem estar como string)
    const replacer = (key, value) => {
      if ((key === 'minDate' || key === 'maxDate' || key === 'defaultValue') && (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
        return `new Date('${value}')`; // Será envolvido em aspas
      }
      // Para 'options' que está como string (JSON)
      if (key === 'options' && typeof value === 'string' && value.trim().startsWith('[')) {
        try {
          // Tenta parsear para re-formatar
          return JSON.parse(value);
        } catch (e) {
          return value; // Mantém a string inválida
        }
      }
      return value;
    };

    let componentsString = JSON.stringify(formComponents, replacer, 2);

    // Pós-processamento para remover aspas de `new Date(...)`
    componentsString = componentsString.replace(/"new Date\('([^']*)'\)"/g, "new Date('$1')");

    return `openPopup("form", {
  data: {
    title: "${escapeString(props.title)}",
    message: "${escapeString(props.message)}",
    icon: "${escapeString(props.icon)}",
    doneLabel: "${escapeString(props.doneLabel)}",
    components: ${componentsString},
    onSubmit: (data) => {
      console.log('Form data:', data);
      alert('Dados enviados: ' + JSON.stringify(data));
    },
    onChange: ({ changedComponentState, formState }) => {
      console.log('Changed component:', changedComponentState.id);
      console.log('Current form values:', formState.values);
    }
  }
});`;
  };

  // Abre o popup do Form Builder
  const handleOpenFormPopup = () => {
    const props = popupProps.form;

    // Processa os componentes (ex: converte strings JSON de 'options' em arrays)
    const processedComponents = formComponents.map(comp => {
      if (Array.isArray(comp)) {
        return comp.map(inlineComp => processSingleComponent(inlineComp));
      }
      return processSingleComponent(comp);
    });

    openPopup("form", {
      data: {
        ...props,
        components: processedComponents,
        onSubmit: (data) => {
          console.log('Form data:', data);
          alert(`Dados enviados: ${JSON.stringify(data)}`);
        },
        onChange: (data) => console.log('Form Change:', data)
      }
    });
  };

  // Renderiza o editor de propriedades para o componente selecionado
  const renderPropertyEditor = () => {
    const component = getComponentByPath(selectedComponentPath);
    if (!component) {
      return <div className="propEditorPlaceholder">Selecione um componente à esquerda para editar suas propriedades.</div>;
    }

    const path = selectedComponentPath;
    const { type } = component;

    // Helper para formatar datas (input type="date" espera 'yyyy-mm-dd')
    const formatDate = (date) => {
      if (!date) return '';
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return String(date).split('T')[0]; // Se já for string
    };

    return (
      <div className="propEditorContent">
        <h4>Editando: <strong>{component.id}</strong></h4>
        <span className="propEditorTypeBadge">{component.type}</span>
        <hr className="propEditorHr" />

        {/* Propriedades Comuns */}
        <div className="propField">
          <label className="propLabel">ID (Chave Única)</label>
          <input type="text" value={component.id || ''} onChange={(e) => handlePropChange(path, 'id', e, 'string')} className="propInput" />
        </div>
        <div className="propField">
          <label className="propLabel">Label</label>
          <input type="text" value={component.label || ''} onChange={(e) => handlePropChange(path, 'label', e, 'string')} className="propInput" />
        </div>
        <div className="propGrid">
          <label className="propFieldCheck" htmlFor={`req-${path}`}>
            <input type="checkbox" id={`req-${path}`} checked={!!component.required} onChange={(e) => handlePropChange(path, 'required', e, 'boolean')} />
            <span>Required</span>
          </label>
          <label className="propFieldCheck" htmlFor={`dis-${path}`}>
            <input type="checkbox" id={`dis-${path}`} checked={!!component.disabled} onChange={(e) => handlePropChange(path, 'disabled', e, 'boolean')} />
            <span>Disabled</span>
          </label>
        </div>

        {/* Propriedades com base no Tipo */}
        {['text', 'textarea', 'email', 'number', 'password'].includes(type) && (
          <div className="propField">
            <label className="propLabel">Placeholder</label>
            <input type="text" value={component.placeholder || ''} onChange={(e) => handlePropChange(path, 'placeholder', e, 'string')} className="propInput" />
          </div>
        )}

        {['text', 'textarea', 'email', 'number', 'password', 'checkbox', 'radio', 'select', 'date'].includes(type) && (
          <div className="propField">
            <label className="propLabel">Default Value</label>
            {type === 'date' ? (
              <input type="date" value={formatDate(component.defaultValue)} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'date')} className="propInput" />
            ) : type === 'number' ? (
              <input type="number" value={component.defaultValue || ''} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'number')} className="propInput" />
            ) : type === 'checkbox' ? (
              // Checkbox de 'defaultValue' precisa ser estilizado como os outros
              <div className="propFieldCheck" style={{ background: 'white' }}>
                <input type="checkbox" id={`def-${path}`} checked={!!component.defaultValue} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'boolean')} />
                <label htmlFor={`def-${path}`}>Checked (Verdadeiro)</label>
              </div>
            ) : (
              <input type="text" value={component.defaultValue || ''} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'string')} className="propInput" />
            )}
          </div>
        )}

        {/* Checkboxes Booleanos */}
        <div className="propField">
          {type === 'textarea' && (
            <label className="propFieldCheck" htmlFor={`res-${path}`}>
              <input type="checkbox" id={`res-${path}`} checked={!!component.disableResize} onChange={(e) => handlePropChange(path, 'disableResize', e, 'boolean')} />
              <span>Disable Resize</span>
            </label>
          )}
          {type === 'file' && (
            <label className="propFieldCheck" htmlFor={`mul-${path}`}>
              <input type="checkbox" id={`mul-${path}`} checked={!!component.multiple} onChange={(e) => handlePropChange(path, 'multiple', e, 'boolean')} />
              <span>Multiple Files</span>
            </label>
          )}
        </div>

        {/* Propriedades Específicas */}
        {(type === 'text' || type === 'textarea' || type === 'password') && (
          <div className="propGrid">
            <div className="propField">
              <label className="propLabel">Min Length</label>
              <input type="number" value={component.minLength || ''} onChange={(e) => handlePropChange(path, 'minLength', e, 'number')} className="propInput" />
            </div>
            <div className="propField">
              <label className="propLabel">Max Length</label>
              <input type="number" value={component.maxLength || ''} onChange={(e) => handlePropChange(path, 'maxLength', e, 'number')} className="propInput" />
            </div>
          </div>
        )}

        {(type === 'text' || type === 'textarea') && (
          <div className="propField">
            <label className="propLabel">Match Regex</label>
            <input type="text" value={component.matchRegex || ''} onChange={(e) => handlePropChange(path, 'matchRegex', e, 'string')} className="propInput" />
          </div>
        )}

        {type === 'number' && (
          <div className="propGrid">
            <div className="propField">
              <label className="propLabel">Min</label>
              <input type="number" value={component.min || ''} onChange={(e) => handlePropChange(path, 'min', e, 'number')} className="propInput" />
            </div>
            <div className="propField">
              <label className="propLabel">Max</label>
              <input type="number" value={component.max || ''} onChange={(e) => handlePropChange(path, 'max', e, 'number')} className="propInput" />
            </div>
          </div>
        )}

        {(type === 'radio' || type === 'select') && (
          <div className="propField">
            <label className="propLabel">Options (Array JSON)</label>
            <textarea
              value={typeof component.options === 'string' ? component.options : JSON.stringify(component.options, null, 2)}
              onChange={(e) => handlePropChange(path, 'options', e, 'json')}
              className="propInput"
              rows={4}
              placeholder={`Ex: ["Opção 1", "Opção 2"]\n\nOu:\n\n[\n  {"label": "Opção A", "value": "a"},\n  {"label": "Opção B", "value": "b"}\n]`}
            />
          </div>
        )}

        {type === 'date' && (
          <div className="propGrid">
            <div className="propField">
              <label className="propLabel">Min Date</label>
              <input type="date" value={formatDate(component.minDate)} onChange={(e) => handlePropChange(path, 'minDate', e, 'date')} className="propInput" />
            </div>
            <div className="propField">
              <label className="propLabel">Max Date</label>
              <input type="date" value={formatDate(component.maxDate)} onChange={(e) => handlePropChange(path, 'maxDate', e, 'date')} className="propInput" />
            </div>
          </div>
        )}

        {type === 'file' && (
          <div className="propField">
            <label className="propLabel">Accept</label>
            <input type="text" value={component.accept || ''} onChange={(e) => handlePropChange(path, 'accept', e, 'string')} className="propInput" placeholder=".jpg, .png, .pdf" />
          </div>
        )}

      </div>
    );
  };

  // --- FIM DOS HANDLERS DO FORM BUILDER ---


  const demos = [
    {
      id: "generic",
      title: "Generic Popup",
      description: "Popup simples para exibir mensagens",
      type: "generic",
      action: () => {
        const props = popupProps.generic;
        openPopup("generic", {
          data: {
            message: props.message,
            title: props.title,
            icon: props.icon,
            closeLabel: props.closeLabel
          }
        });
      },
      properties: [
        { key: "title", label: "Title", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "closeLabel", label: "Close Label", type: "text" }
      ]
    },
    {
      id: "confirm",
      title: "Confirm Popup",
      description: "Popup de confirmação com ações",
      type: "confirm",
      action: () => {
        const props = popupProps.confirm;
        openPopup("confirm", {
          data: {
            message: props.message,
            title: props.title,
            icon: props.icon,
            cancelLabel: props.cancelLabel,
            confirmLabel: props.confirmLabel,
            confirmStyle: props.confirmStyle,
            onChoose: (choice) => alert(choice ? "Confirmado!" : "Cancelado")
          }
        });
      },
      properties: [
        { key: "title", label: "Title", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "cancelLabel", label: "Cancel Label", type: "text" },
        { key: "confirmLabel", label: "Confirm Label", type: "text" },
        { key: "confirmStyle", label: "Confirm Style", type: "select", options: ["default", "Secondary", "Success", "Danger"] }
      ]
    },
    {
      id: "form",
      title: "Form - Contato (Simples)",
      description: "Exemplo de formulário simples pré-definido",
      type: "form",
      action: () => {
        // Usa as props de "form" mas com componentes pré-definidos
        const props = popupProps.form;
        openPopup("form", {
          data: {
            title: props.title,
            message: props.message,
            icon: props.icon,
            doneLabel: props.doneLabel,
            components: [
              { id: "name", type: "text", label: "Nome", placeholder: "Seu nome", required: true },
              { id: "email", type: "email", label: "E-mail", placeholder: "seu@email.com", required: false },
            ],
            onSubmit: (data) => alert(`Dados enviados: ${JSON.stringify(data)}`)
          }
        });
      },
      properties: [
        { key: "title", label: "Title", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "doneLabel", label: "Done Label", type: "text" }
      ]
    },
    {
      id: "crop",
      title: "Crop Image",
      description: "Recorte de imagem",
      type: "crop_image",
      action: () => {
        const props = popupProps.crop_image;
        openPopup("crop_image", {
          data: {
            format: props.format,
            aspectRatio: props.format != "square" ? "1:1" : props.aspectRatio,
            minZoom: props.minZoom,
            maxZoom: props.maxZoom,
            image: props.image,
            onCrop: (data) => console.log("Imagem recortada:", data)
          }
        });
      },
      properties: [
        { key: "image", label: "Image", type: "text" },
        { key: "format", label: "Format", type: "select", options: ["circle", "square"] },
        { key: "aspectRatio", label: "Aspect Ratio", type: "text" },
        { key: "minZoom", label: "Min Zoom", type: "number" },
        { key: "maxZoom", label: "Max Zoom", type: "number" }
      ]
    },
    {
      id: "html",
      title: "HTML Popup",
      description: "Conteúdo HTML personalizado",
      type: "html",
      action: () => {
        openPopup("html", {
          data: {
            html: (
              <div style={{ color: "black", padding: "20px", textAlign: "center" }}>
                <h2 style={{ marginBottom: "10px" }}>🎉 Olá!</h2>
                <p>Este é um popup com HTML totalmente customizado</p>
                <button
                  onClick={() => closePopup(true)}
                  style={{
                    marginTop: "15px",
                    padding: "8px 16px",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Fechar
                </button>
              </div>
            )
          }
        });
      },
      properties: [
        { disabled: true, key: "html", label: "HTML", type: "text" }
      ]
    }
  ];

  const advancedDemos = [
    {
      id: "no-escape",
      title: "Sem fechar com ESC",
      description: "closeOnEscape: false",
      action: () => openPopup("confirm", {
        closeOnEscape: false,
        data: {
          message: "Não é possível fechar este popup com a tecla ESC",
          title: "Popup bloqueado"
        }
      }),
      code: `openPopup("confirm", { 
  closeOnEscape: false,
  data: { 
    message: "Não é possível fechar com ESC",
    title: "Popup bloqueado"
  } 
})`
    },
    {
      id: "no-outside-click",
      title: "Sem fechar clicando fora",
      description: "closeOnClickOutside: false",
      action: () => openPopup("confirm", {
        closeOnClickOutside: false,
        data: {
          message: "Você não pode fechar este popup clicando fora dele",
        }
      }),
      code: `openPopup("confirm", { 
  closeOnClickOutside: false,
  data: { 
    message: "Você não pode fechar este popup clicando fora dele",
  } 
})`
    },
    {
      id: "timeout",
      title: "Auto-fechar em 5s",
      description: "timeout: 5000",
      action: () => openPopup("generic", {
        timeout: 5000,
        data: {
          message: "Este popup será fechado automaticamente em 5 segundos",
          title: "⏱️ Temporizador"
        }
      }),
      code: `openPopup("generic", { 
  timeout: 5000,
  data: { 
    message: "Fecha em 5 segundos"
  } 
})`
    },
    {
      id: "require-action",
      title: "Requer ação",
      description: "requireAction: true",
      action: () => openPopup("confirm", {
        requireAction: true,
        data: {
          message: "Você deve escolher uma opção para continuar",
          title: "Escolha obrigatória",
          cancelLabel: "Não",
          confirmLabel: "Sim"
        }
      }),
      code: `openPopup("confirm", { 
  requireAction: true,
  data: { 
    message: "Você deve escolher uma opção"
  } 
})`
    },
    {
      id: "keep-last-false",
      title: "Substituir popup aberto",
      description: "keepLast: false",
      action: () => {
        openPopup("generic", { minWidth: "600px", data: { message: "Popup 1 - Aguarde 3 segundos..." } });
        setTimeout(() => {
          openPopup("generic", {
            keepLast: false,
            maxWidth: "400px",
            data: { message: "O primeiro popup só volta quando você fechar esse", title: "Popup 2" }
          });
        }, 3000);
      },
      code: `openPopup("generic", { 
  data: { message: "Popup 1" } 
});

setTimeout(() => {
  openPopup("generic", { 
    keepLast: false,
    data: { title: "Popup 2" } 
  });
}, 3000);`
    },
    {
      id: "keep-last",
      title: "Sobrepor popup aberto",
      description: "keepLast: true",
      action: () => {
        openPopup("generic", { minWidth: "600px", data: { message: "Popup 1 - Aguarde 3 segundos..." } });
        setTimeout(() => {
          openPopup("generic", {
            minWidth: "400px",
            keepLast: true,
            data: { message: "O primeiro popup ainda está aberto!", title: "Popup 2" }
          });
        }, 3000);
      },
      code: `openPopup("generic", { 
  data: { message: "Popup 1" } 
});

setTimeout(() => {
  openPopup("generic", { 
    keepLast: true,
    data: { title: "Popup 2" } 
  });
}, 3000);`
    },
    {
      id: "allow-scroll",
      title: "Permitir scroll da página",
      description: "allowPageBodyScroll: true",
      action: () => openPopup("generic", {
        allowPageBodyScroll: true,
        data: {
          message: "O scroll da página (body) está habilitado.",
          title: "Scroll Permitido"
        }
      }),
      code: `openPopup("generic", {
  allowPageBodyScroll: true,
  data: {
    message: "Scroll habilitado"
  }
})`
    },
    {
      id: "interactive-backdrop",
      title: "Fundo interativo",
      description: "interactiveBackdrop: true",
      action: () => openPopup("generic", {
        interactiveBackdrop: true,
        data: {
          message: "Você pode interagir com o conteúdo atrás deste popup",
          title: "Backdrop interativo"
        }
      }),
      code: `openPopup("generic", { 
  interactiveBackdrop: true,
  data: { 
    message: "Fundo interativo"
  } 
})`
    },
    {
      id: "hidden-backdrop",
      title: "Sem fundo escuro",
      description: "hiddenBackdrop: true",
      action: () => openPopup("generic", {
        hiddenBackdrop: true,
        data: {
          message: "Este popup não possui fundo escuro",
          title: "Sem backdrop"
        }
      }),
      code: `openPopup("generic", { 
  hiddenBackdrop: true,
  data: { 
    message: "Sem fundo escuro"
  } 
})`
    },
    {
      id: "hidden-footer",
      title: "Sem rodapé",
      description: "hiddenFooter: true",
      action: () => openPopup("generic", {
        hiddenFooter: true,
        data: {
          message: "O rodapé (footer) foi removido.",
          title: "Sem Rodapé"
        }
      }),
      code: `openPopup("generic", { 
  hiddenFooter: true,
  data: { 
    message: "Sem rodapé"
  } 
})`
    },
    {
      id: "hidden-header",
      title: "Sem cabeçalho",
      description: "hiddenHeader: true",
      action: () => openPopup("generic", {
        hiddenHeader: true,
        data: {
          message: "O cabeçalho (header) foi removido.",
          title: "Sem Cabeçalho"
        }
      }),
      code: `openPopup("generic", { 
  hiddenHeader: true,
  data: { 
    message: "Sem cabeçalho"
  } 
})`
    },
    {
      id: "no-animation",
      title: "Sem animação de abertura",
      description: "disableOpenAnimation: true",
      action: () => openPopup("generic", {
        disableOpenAnimation: true,
        data: {
          message: "O popup abre instantaneamente, sem a animação padrão.",
          title: "Sem Animação"
        }
      }),
      code: `openPopup("generic", { 
  disableOpenAnimation: true,
  data: { 
    message: "Sem animação de abertura"
  } 
})`
    },
    {
      id: "max-width",
      title: "Largura Máxima (400px)",
      description: "maxWidth: '400px'",
      action: () => openPopup("generic", {
        maxWidth: "400px",
        data: {
          message: "Este popup tem uma largura máxima definida em 400px. O conteúdo se ajusta.",
          title: "Máx. 400px"
        }
      }),
      code: `openPopup("generic", { 
  maxWidth: "400px",
  data: { 
    message: "Máx. 400px"
  } 
})`
    },
    {
      id: "min-width",
      title: "Largura Mínima (100px)",
      description: "minWidth: '100px'",
      action: () => openPopup("generic", {
        minWidth: "100px",
        data: {
          title: "Min",
          message: "100px"
        }
      }),
      code: `openPopup("generic", { 
  minWidth: "100px",
  data: { 
    title: "Min",
    message: "100px"
  } 
})`
    },
    {
      id: "on-open",
      title: "Callback ao Abrir",
      description: "onOpen()",
      action: () => openPopup("generic", {
        onOpen: (popup) => alert(`Popup aberto! ID: ${popup.id}`),
        data: {
          message: "Um 'alert' foi disparado com o ID do popup.",
          title: "Callback de Abertura"
        }
      }),
      code: `openPopup("generic", { 
  onOpen: (popup) => alert(\`Popup aberto! ID: \${popup.id}\`),
  data: { 
    message: "Callback onOpen() executado"
  } 
})`
    },
    {
      id: "on-close",
      title: "Callback ao Fechar",
      description: "onClose()",
      action: () => openPopup("confirm", {
        onClose: (hasAction, id) => alert(`Popup fechado! Teve ação (confirm/cancel): ${hasAction ? "Sim" : "Não"}`),
        data: {
          message: "Feche o popup clicando nas opções ou fora.",
          title: "Callback de Fechamento"
        }
      }),
      code: `openPopup("confirm", { 
  onClose: (hasAction, id) => alert(\`Popup fechado! Teve ação (confirm/cancel): \${hasAction ? "Sim" : "Não"}\`),
  data: { 
    title: "Callback de Fechamento"
  } 
})`
    },
    {
      id: "update-popup",
      title: "Update dinâmico",
      description: "updatePopup() - Cronômetro",
      action: async () => {
        const popup = await openPopup("generic", {
          onClose: () => stopInterval(),
          data: {
            title: "Cronômetro",
            icon: "⏱️",
            message: "Iniciando...",
          }
        });

        let count = 0;
        const interval = setInterval(() => {
          count++;
          updatePopup(popup.id, {
            data: {
              ...popup.settings.data,
              message: `${count}s`,
            }
          });
        }, 1000);

        function stopInterval() { // Boa prática: Garanta que o interval seja limpo ao fechar
          clearInterval(interval);
        }
      },
      code: `const popup = await openPopup("generic", {
        onClose: () => stopInterval(),
        data: {
          title: "Cronômetro",
          icon: "⏱️",
          message: "Iniciando...",
        }
      });

      let count = 0;
      const interval = setInterval(() => {
        count++;
        updatePopup(popup.id, {
          data: {
            ...popup.settings.data,
            message: \`\${count}s\`,
          }
        });
      }, 1000);

      function stopInterval() { // Boa prática: Garanta que o interval seja limpo ao fechar
        clearInterval(interval);
      }`
    }
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="headerContent">
          <h1 className="logo">
            <span className="logoIcon">✨</span>
            ntPopups
          </h1>
          <p className="subtitle">Biblioteca moderna de popups para React</p>
          <div className="headerActions">
            <a
              href="https://ntpopups.nemtudo.me"
              target="_blank"
              rel="noopener noreferrer"
              className="docLink"
            >
              📚 Documentação completa
            </a>
          </div>
        </div>
      </header>

      <section className="settingsSection">
        <div className="sectionContent">
          <h2 className="sectionTitle">⚙️ Configurações Globais</h2>
          <div className="settingsGrid">
            <div className="settingGroup">
              <span className="settingLabel">Tema do Popup</span>
              <div className="buttonGroup">
                <button
                  onClick={() => changeTheme("dark")}
                  className={`settingBtn ${currentTheme === "dark" ? "active" : ""}`}
                >
                  🌙 Dark
                </button>
                <button
                  onClick={() => changeTheme("white")}
                  className={`settingBtn ${currentTheme === "white" ? "active" : ""}`}
                >
                  ☀️ Light
                </button>
              </div>
            </div>
            <div className="settingGroup">
              <span className="settingLabel">Idioma</span>
              <div className="buttonGroup">
                <button
                  onClick={() => changeLang("ptbr")}
                  className={`settingBtn ${currentLang === "ptbr" ? "active" : ""}`}
                >
                  🇧🇷 PT-BR
                </button>
                <button
                  onClick={() => changeLang("en")}
                  className={`settingBtn ${currentLang === "en" ? "active" : ""}`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mainSection">
        <div className="sectionContent">
          <h2 className="sectionTitle">🎯 Tipos de Popup</h2>
          <p className="sectionDescription">
            Explore os diferentes tipos de popups pré-definidos.
          </p>
          <div className="demoGrid">
            {demos.map(demo => (
              <div key={demo.id} className="demoCard">
                <div className="demoHeader">
                  <div>
                    <h3 className="demoTitle">{demo.title}</h3>
                    <p className="demoDescription">{demo.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => toggleProps(demo.id)}
                      className="codeToggle"
                      title="Editar propriedades"
                    >
                      ⚙️
                    </button>
                    <button
                      onClick={() => toggleCode(demo.id)}
                      className="codeToggle"
                      title="Ver código"
                    >
                      {showCode[demo.id] ? "👁️" : "💻"}
                    </button>
                  </div>
                </div>

                {expandedProps[demo.id] && (
                  <div className="propsEditor">
                    <h4 className="propsTitle">Propriedades (data)</h4>
                    {
                      demo.type === "form" && <div className="formwarn"><span>Veja o editor completo de componentes de formulário logo abaixo nessa página</span></div>
                    }
                    {demo.properties.map(prop => {
                      return <div key={prop.key} className="propField">
                        <label className="propLabel">{prop.label} <span style={{ color: "gray", fontSize: "0.8rem", textTransform: "none", fontWeight: "100" }}>(data.{prop.key})</span></label>
                        {prop.type === "select" ? (
                          <select
                            value={popupProps[demo.type][prop.key]}
                            onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value)}
                            className="propInput"
                          >
                            {prop.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : prop.type === "number" ? (
                          <input
                            type="number"
                            value={popupProps[demo.type][prop.key]}
                            onChange={(e) => updatePopupProp(demo.type, prop.key, parseFloat(e.target.value))}
                            className="propInput"
                          />
                        ) : prop.type === "textarea" ? (
                          <textarea
                            value={popupProps[demo.type][prop.key]}
                            onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value)}
                            className="propInput"
                            rows={2}
                          />
                        ) : (
                          <input
                            type="text"
                            disabled={prop.disabled || (prop.key === "aspectRatio" && popupProps.crop_image.format != "square")}
                            value={(prop.key === "aspectRatio" && popupProps.crop_image.format != "square") ? "1:1" : popupProps[demo.type][prop.key]}
                            onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value)}
                            className="propInput"
                          />
                        )}
                      </div>
                    })}
                  </div>
                )}

                {(showCode[demo.id]) && (
                  <CodeBlock code={generateCode(demo.type)} />
                )}

                <button
                  onClick={demo.action}
                  className="demoBtn"
                >
                  Abrir Popup
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="advancedSection">
        <div className="sectionContent">
          <h2 className="sectionTitle">🚀 Configurações Gerais</h2>
          <p className="sectionDescription">
            Propriedades disponíveis em todos os tipos de popup!
          </p>
          <div className="demoGrid">
            {advancedDemos.map(demo => (
              <div key={demo.id} className="demoCard">
                <div className="demoHeader">
                  <div>
                    <h3 className="demoTitle">{demo.title}</h3>
                    <p className="demoDescription">{demo.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => toggleAdvancedCode(demo.id)}
                      className="codeToggle"
                      title="Ver código"
                    >
                      {showAdvancedCode[demo.id] ? "👁️" : "💻"}
                    </button>
                  </div>
                </div>

                {/* Exibição do CodeBlock nas Configurações Avançadas */}
                {(showAdvancedCode[demo.id]) && (
                  <CodeBlock code={demo.code} />
                )}

                <button
                  onClick={demo.action}
                  className="demoBtn"
                >
                  Testar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* // ---------------------------------------------------------------------
      // --- NOVA SEÇÃO: FORM BUILDER ---
      // ---------------------------------------------------------------------
      */}
      <section className="formBuilderSection">
        <div className="sectionContent">
          <h2 className="sectionTitle">🛠️ Editor de Formulário Dinâmico</h2>
          <p className="sectionDescription">
            Crie, configure e teste popups de formulário complexos em tempo real.
          </p>

          {/* Ações */}
          <div className="formBuilderActions">
            <button
              onClick={handleOpenFormPopup}
              className="demoBtn"
              style={{
                maxWidth: "200px"
              }}
            >
              🚀 Testar Formulário
            </button>
            <button
              onClick={() => setShowFormBuilderCode(p => !p)}
              className={`settingBtn ${showFormBuilderCode ? 'active' : ''}`}
              style={{ flex: '0 1 auto', padding: '0.75rem 1.5rem' }}
            >
              {showFormBuilderCode ? "Esconder" : "Ver"} Código
            </button>
          </div>
          {/* Toolbar de Propriedades Principais */}
          <div className="propsEditor mainPropsEditor">
            <h4 className="propsTitle">Propriedades Principais (data)</h4>
            <div className="propGrid threeCols">
              <div className="propField">
                <label className="propLabel">Title</label>
                <input type="text" value={popupProps.form.title} onChange={(e) => updatePopupProp('form', 'title', e.target.value)} className="propInput" />
              </div>
              <div className="propField">
                <label className="propLabel">Icon</label>
                <input type="text" value={popupProps.form.icon} onChange={(e) => updatePopupProp('form', 'icon', e.target.value)} className="propInput" />
              </div>
              <div className="propField">
                <label className="propLabel">Done Label</label>
                <input type="text" value={popupProps.form.doneLabel} onChange={(e) => updatePopupProp('form', 'doneLabel', e.target.value)} className="propInput" />
              </div>
            </div>
            <div className="propField">
              <label className="propLabel">Message</label>
              <textarea value={popupProps.form.message} onChange={(e) => updatePopupProp('form', 'message', e.target.value)} className="propInput" rows={2} />
            </div>
          </div>

          {/* Main Editor Layout (2 colunas) */}
          <div className="formBuilderEditor">

            {/* Coluna 1: Lista de Componentes */}
            <div className="componentListPanel">
              <h4 className="componentListTitle">Componentes do Formulário</h4>
              <div className="componentList">
                {formComponents.map((component, index) => {
                  const isSelected = selectedComponentPath && selectedComponentPath[0] === index && selectedComponentPath.length === 1;

                  // Renderiza Grupo Inline
                  if (Array.isArray(component)) {
                    return (
                      <div key={index} className="inlineGroup">
                        <div className="inlineGroupHeader">
                          <span>#{index + 1} - Grupo Inline</span>
                          <button onClick={() => handleDeleteComponent([index])} className="deleteBtn" title="Remover Grupo">🗑️</button>
                        </div>
                        <div className="inlineGroupContent">
                          {component.map((inlineComp, inlineIndex) => {
                            const isInlineSelected = selectedComponentPath && selectedComponentPath[0] === index && selectedComponentPath[1] === inlineIndex;
                            return (
                              <div
                                key={inlineIndex}
                                className={`componentItem inline ${isInlineSelected ? 'active' : ''}`}
                                onClick={() => handleSelectComponent([index, inlineIndex])}
                              >
                                <span>{inlineComp.label || inlineComp.id} <small>({inlineComp.id}) [{inlineComp.type}]</small></span>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteComponent([index, inlineIndex]); }} className="deleteBtn" title="Remover Item">❌</button>
                              </div>
                            );
                          })}
                          <button className="addBtn" onClick={() => handleAddComponent(newComponentType, index)}>+ Adicionar Item ao Grupo</button>
                        </div>
                      </div>
                    );
                  }

                  // Renderiza Item Normal
                  return (
                    <div
                      key={index}
                      className={`componentItem ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectComponent([index])}
                    >
                      <span>{component.label || component.id} <small>({component.id}) [{component.type}]</small></span>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteComponent([index]); }} className="deleteBtn" title="Remover Item">❌</button>
                    </div>
                  );
                })}
              </div>
              <div className="addComponentToolbar">
                <select value={newComponentType} onChange={(e) => setNewComponentType(e.target.value)} className="propInput">
                  {componentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <button className="addBtn" onClick={() => handleAddComponent(newComponentType)}>+ Adicionar</button>
                <button className="addBtn secondary" onClick={handleAddInlineGroup}>+ Grupo Inline</button>
              </div>
            </div>

            {/* Coluna 2: Editor de Propriedades */}
            <div className="propertyEditorPanel">
              {renderPropertyEditor()}
            </div>

          </div>
          {/* Bloco de Código */}
          {showFormBuilderCode && (
            <CodeBlock code={generateFormBuilderCode()} />
          )}
        </div>
      </section>

      <footer className="footer">
        <p>Feito com ❤️ usando ntpopups</p>
      </footer>
    </div>
  );
}