"use client";
import { useState, useCallback, useEffect } from "react";
import useNtPopups from "ntpopups";
import { usePopupSettings } from "../../contexts/PopupSettingsContext";

// React Icons Imports
import { FaCopy, FaCheck, FaInfoCircle, FaQuestionCircle, FaEnvelope, FaCrop, FaHtml5, FaCog, FaMoon, FaSun, FaGlobe, FaChevronDown, FaChevronUp, FaTimes, FaTrashAlt, FaMagic, FaRocket, FaClock, FaBookOpen, FaBell, FaShoppingCart, FaUserCircle, FaExclamationTriangle, FaWrench, FaTags, FaLock, FaCalendarAlt, FaAddressCard, FaFileAlt, FaUserPlus, FaRegCreditCard, FaSitemap, FaKey, FaHourglassHalf, FaTimesCircle, FaChartPie, FaStar, FaPalette, FaMoneyBillWave } from 'react-icons/fa';
import { FaCode } from "react-icons/fa";
import { SiStagetimer } from "react-icons/si";

// Imports from react-simple-code-editor and Prism.js library
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Import languages and styles (example: JS and default theme)
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; // Default light style from Prism.js


import userPopupCode from "../../components/popups/MyUserPopup.txt"
import buyPopupCode from "../../components/popups/MyBuyPopup.txt"

// Utility function to escape strings
function escapeString(str) {
  // Escapes double quotes, but not template literal strings (backticks)
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
 * CodeBlock Component that uses react-simple-code-editor for visualization and copying.
 */
const CodeBlock = ({ code, fullHeight }) => {
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
        onValueChange={() => { }}
        highlight={highlight}
        padding={15}
        style={{
          fontFamily: '"Fira Mono", "Roboto Mono", monospace',
          fontSize: 12,
          border: "1px solid #2d2d2d",
          borderRadius: "8px",
          minHeight: "100px",
          backgroundColor: "#1e1e1e", // Dark background
          color: "#d4d4d4", // Light text
          overflow: "auto",
          ...fullHeight ? { height: "100dvh", maxHeight: "100%" } : {}
        }}
      />

      <button onClick={copyToClipboard} className="copyButton">
        {copied ? <><FaCheck size={14} style={{ marginRight: '0.4rem' }} /> Copied!</> : <><FaCopy size={14} style={{ marginRight: '0.4rem' }} /> Copy</>}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// Main Component Home
// ---------------------------------------------------------------------

// --- Constants for Form Builder (kept) ---
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
  // Processes 'options' which may be a JSON string
  if ((newComp.type === 'radio' || newComp.type === 'select') && typeof newComp.options === 'string') {
    try {
      newComp.options = JSON.parse(newComp.options);
    } catch (e) {
      console.error("Invalid JSON in options for component:", newComp.id);
      newComp.options = []; // Default to empty
    }
  }
  // Converts dates from string to Date Object (necessary if input type="date" was used)
  if (newComp.type === 'date') {
    if (newComp.minDate && typeof newComp.minDate === 'string') newComp.minDate = new Date(newComp.minDate);
    if (newComp.maxDate && typeof newComp.maxDate === 'string') newComp.maxDate = new Date(newComp.maxDate);
    if (newComp.defaultValue && typeof newComp.defaultValue === 'string') newComp.defaultValue = new Date(newComp.defaultValue);
  }
  return newComp;
};
// ---------------------------------------


export default function Home() {
  const { openPopup, updatePopup, popups } = useNtPopups();
  const { updateSettings } = usePopupSettings();

  // 1. State to control code visualization in Popup Types and Advanced Settings
  const [showCode, setShowCode] = useState({}); // For Popup Types
  const [showAdvancedCode, setShowAdvancedCode] = useState({}); // For Advanced Settings

  const [expandedProps, setExpandedProps] = useState({});
  const [currentTheme, setCurrentTheme] = useState("white");
  const [currentLang, setCurrentLang] = useState("en");

  // States for editable properties of each type
  const [popupProps, setPopupProps] = useState({
    generic: {
      title: "Notification",
      message: "This is an informative message",
      icon: "ⓘ",
      closeLabel: "Close"
    },
    confirm: {
      title: "Confirm Action",
      message: "Are you sure you want to proceed?",
      icon: "❓",
      cancelLabel: "Cancel",
      confirmLabel: "Confirm",
      confirmStyle: "default",
      onChoose: `(choice) => alert(choice ? "Confirmed!" : "Canceled")`
    },
    form: {
      title: "Dynamic Form",
      message: "",
      icon: "📩",
      doneLabel: "Submit",
      onSubmit: `(data) => alert(data)`,
      onChange: `(data) => console.log(data)`
    },
    crop_image: {
      format: "circle",
      aspectRatio: "1:1",
      minZoom: 1,
      maxZoom: 4,
      image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNC9JTUFHRS8yMl8zOF80MF9fMTc2MTM1NjMyMDUyMi0zOTMyNzczMw.webp",
      onCrop: `(data) => console.log(data)`
    },
    html: {
      html: `({ closePopup }) => <div style={{ color: "black", padding: "20px", textAlign: "center" }}>
              <h2 style={{ marginBottom: "10px" }}>🎉 Hello!</h2>
              <p>This is a popup with fully customized HTML</p>
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
                Close
              </button>
            </div>`
    },
    my_user_popup: {
      userName: "John",
      userId: "user_123456",
      userBio: "I play Minecraft",
      onAddFriend: "(id) => alert(`New friend: ${id}`)"
    },
    my_buy_popup: {
      productName: "Example Product",
      productId: "prod_123",
      productPrice: 99.90,
      productImage: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNS9JTUFHRS8xOF80Nl8zNl9fMTc2MTQyODc5NjcwNC00MzE2MTAxMDY.webp",
      productDescription: "Detailed description of the product with its main features and benefits.",
      productStock: 10,
      allowQuantityChange: true,
      showShipping: true,
      shippingPrice: 15.00,
      freeShippingThreshold: 150.00,
      acceptedPaymentMethods: ["Credit Card", "PIX"],
      allowCoupon: true,
      getCoupon: `async (code) => {
        // simulate your api latency
        await new Promise(resolve => setTimeout(resolve, 500));

        // coupon list
        const coupons = {
          "PERC10": { discount: 10, type: "percent" },
          "FIX20": { discount: 20, type: "fixed" }
        };

        // get current coupon object
        const coupon = coupons[code];

        // if the coupon is valid
        if (coupon) {
          // if is, returns the coupon object
          return { coupon: coupon }
        } else {
          // if not, returns error: true and errorMessage
          return { error: true, errorMessage: "Invalid Coupon" }
        }
        }`,
      onBuy: "(purchase) => alert(JSON.stringify(purchase))"
    }
  });

  // --- NEW STATES FOR FORM BUILDER ---
  const [formComponents, setFormComponents] = useState([
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true,
      minLength: 3,
      maxLength: 50
    },
    {
      id: 'country',
      type: 'select',
      label: 'Country',
      options: [{ label: "Brazil", value: "br" }, { label: "United States", value: "us" }, { label: "Other", value: "other" }],
      required: true,
      defaultValue: "Brazil"
    },
    [
      {
        id: 'city',
        type: 'text',
        label: 'City',
        placeholder: 'New York'
      },
      {
        id: 'state',
        type: 'text',
        label: 'State',
        placeholder: 'NY',
        maxLength: 2
      }
    ]
  ]);

  // Path to the selected component. Ex: [1] (second item) or [3, 0] (first item of the fourth group)
  const [selectedComponentPath, setSelectedComponentPath] = useState(null);
  const [newComponentType, setNewComponentType] = useState("text");
  // -----------------------------------------


  const toggleCode = (id) => {
    setShowCode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. New function to toggle advanced code
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

    const icon = props.icon;

    switch (type) {
      case 'generic':
        return `openPopup("generic", { 
  data: { 
    message: "${escapeString(props.message)}",
    title: "${escapeString(props.title)}",
    icon: "${escapeString(icon)}",
    closeLabel: "${escapeString(props.closeLabel)}"
  } 
})`;
      case 'confirm':
        return `openPopup("confirm", { 
  data: { 
    message: "${escapeString(props.message)}",
    title: "${escapeString(props.title)}",
    icon: "${escapeString(icon)}",
    cancelLabel: "${escapeString(props.cancelLabel)}",
    confirmLabel: "${escapeString(props.confirmLabel)}",
    confirmStyle: "${escapeString(props.confirmStyle)}",
    onChoose: (choice) => alert(choice ? "Confirmed!" : "Canceled")
  } 
})`;
      case 'form': // This is the simple demo code, not the builder
        return `openPopup("form", { 
  data: { 
    title: "${escapeString(props.title)}",
    message: "${escapeString(props.message)}",
    icon: "${escapeString(icon)}",
    doneLabel: "${escapeString(props.doneLabel)}",
    components: [
      { id: "name", type: "text", label: "Name", placeholder: "Your name", required: true },
      { id: "email", type: "email", label: "E-mail", placeholder: "your@email.com", required: false },
    ],
    onSubmit: (data) => alert(data),
    onChange: (data) => console.log(data),
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
    html: ({ closePopup }) => <div style={{ color: "black", padding: "20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "10px" }}>🎉 Hello!</h2>
      <p>This is a popup with fully customized HTML</p>
      {/* You should use closePopup(true) if it is a completion action */}
      <button onClick={() => closePopup(true)}>Close</button>
    </div>
  } 
})`;
      case 'my_user_popup':
        return [`// components/popups/MyUserPopup.jsx

${userPopupCode}`, `// PopupContext.jsx

import MyUserPopup from "./components/popups/MyUserPopup.jsx"

<NtPopupProvider customPopups={{ "my_user_popup": MyUserPopup }}>
    {children}
</NtPopupProvider>`, `// Your open code

openPopup("my_user_popup", {
  data: {
    userId: "${escapeString(props.userId)}",
    userName: "${escapeString(props.userName)}",
    userBio: "${escapeString(props.userBio)}",
    onAddFriend: (id) => alert(\`New friend: \${id}\`)
  }
});
`]

      case 'my_buy_popup':
        return [`// components/popups/MyBuyPopup.jsx

${buyPopupCode}`, `// PopupContext.jsx

import MyBuyPopup from "./components/popups/MyBuyPopup.jsx"

<NtPopupProvider customPopups={{ "my_buy_popup": MyBuyPopup }}>
    {children}
</NtPopupProvider>`, `// Your open code

openPopup("my_buy_popup", {
  data: {
    productName: "${escapeString(props.productName)}",
    productId: "${escapeString(props.productId)}",
    productPrice: ${props.productPrice},
    productImage: "${escapeString(props.productImage)}",
    productDescription: "${escapeString(props.productDescription)}",
    productStock: ${props.productStock},
    allowQuantityChange: ${props.allowQuantityChange},
    showShipping: ${props.showShipping},
    shippingPrice: ${props.shippingPrice},
    freeShippingThreshold: ${props.freeShippingThreshold},
    acceptedPaymentMethods: ${JSON.stringify(props.acceptedPaymentMethods)},
    allowCoupon: ${props.allowCoupon},
    getCoupon: ${props.getCoupon}`]
      default:
        return '';
    }
  };


  // --- NEW HANDLERS FOR FORM BUILDER (kept) ---

  const handleSelectComponent = (path) => {
    setSelectedComponentPath(path);
  };

  // Generic function to update a component's property (simple or inline)
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
      case 'date': value = inputvalue === '' ? undefined : inputvalue; break; // Stores as string, processes on open
      case 'json': value = inputvalue; break; // Stores as string, processes on open
      default: value = inputvalue;
    }

    setFormComponents(prevComponents => {
      // Maps to create shallow copies and prevent mutation
      const newComponents = prevComponents.map(c => Array.isArray(c) ? [...c] : { ...c });

      let compRef;
      if (path.length === 1) { // Top-Level Component
        compRef = { ...newComponents[path[0]] };
        newComponents[path[0]] = compRef;
      } else { // Inline Component
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
      label: `New Field (${type})`
    };

    if (groupIndex !== null) {
      // Adds to an existing inline group
      setFormComponents(prev => prev.map((group, index) => {
        if (index === groupIndex && Array.isArray(group)) {
          return [...group, newComponent];
        }
        return group;
      }));
    } else {
      // Adds to the top level
      setFormComponents(prev => [...prev, newComponent]);
    }
  };

  const handleAddInlineGroup = () => {
    setFormComponents(prev => [...prev, []]); // Adds an empty array
  };

  const handleDeleteComponent = (path) => {
    setFormComponents(prev => {
      let newComponents = [...prev];
      if (path.length === 1) {
        // Deletes from the top level
        newComponents.splice(path[0], 1);
      } else {
        // Deletes from an inline group
        newComponents[path[0]] = [...newComponents[path[0]]]; // Copies the group
        newComponents[path[0]].splice(path[1], 1);
      }
      return newComponents;
    });
    if (JSON.stringify(path) === JSON.stringify(selectedComponentPath)) {
      console.log(`Deleted selected component: ${path}`)
      setSelectedComponentPath(null); // Deselects
    }
  };

  // Helper to fetch the selected component object
  const getComponentByPath = (path) => {
    if (!path) return null;
    try {
      if (path.length === 1) return formComponents[path[0]];
      if (path.length === 2) return formComponents[path[0]][path[1]];
    } catch (e) {
      return null; // May happen if the item is deleted
    }
    return null;
  };

  // Generates the code for the Form Builder
  const generateFormBuilderCode = () => {
    const props = popupProps.form;
    const icon = props.icon;

    // Custom stringifier to handle dates (which may be as a string)
    const replacer = (key, value) => {
      if ((key === 'minDate' || key === 'maxDate' || key === 'defaultValue') && (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
        return `new Date('${value}')`; // Will be enclosed in quotes
      }
      // For 'options' which is a string (JSON)
      if (key === 'options' && typeof value === 'string' && value.trim().startsWith('[')) {
        try {
          // Tries to parse to re-format
          return JSON.parse(value);
        } catch (e) {
          return value; // Keeps the invalid string
        }
      }
      return value;
    };

    let componentsString = JSON.stringify(formComponents, replacer, 5);

    // Post-processing to remove quotes from `new Date(...)`
    componentsString = componentsString.replace(/"new Date\('([^']*)'\)"/g, "new Date('$1')");

    return `openPopup("form", {
  data: {
    title: "${escapeString(props.title)}",
    message: "${escapeString(props.message)}",
    icon: "${escapeString(icon)}",
    doneLabel: "${escapeString(props.doneLabel)}",
    onSubmit: (data) => {
      console.log('Form data:', data);
      alert('Submitted data: ' + JSON.stringify(data));
    },
    onChange: ({ changedComponentState, formState }) => {
      console.log('Changed component:', changedComponentState.id);
      console.log('Current form values:', formState.values);
    },
    components: ${componentsString}
}
});`;
  };

  // Opens the Form Builder popup
  const handleOpenFormPopup = () => {
    const props = popupProps.form;

    // Processes components (e.g., converts JSON strings of 'options' to arrays)
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
          alert(`Submitted data: ${JSON.stringify(data)}`);
        },
        onChange: (data) => console.log('Form Change:', data)
      }
    });
  };

  // Renders the property editor for the selected component
  const renderPropertyEditor = () => {
    const component = getComponentByPath(selectedComponentPath);
    if (!component) {
      return <div className="propEditorPlaceholder">Select a component on the left to edit its properties.</div>;
    }

    const path = selectedComponentPath;
    const { type } = component;

    // Helper to format dates (input type="date" expects 'yyyy-mm-dd')
    const formatDate = (date) => {
      if (!date) return '';
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return String(date).split('T')[0]; // If it's already a string
    };

    return (
      <div className="propEditorContent">
        <h4>Editing: <strong>{component.id}</strong></h4>
        <span className="propEditorTypeBadge">{component.type}</span>
        <hr className="propEditorHr" />

        {/* Common Properties */}
        <div className="propField">
          <label className="propLabel">ID (Unique Key)</label>
          <input type="text" value={component.id || ''} onChange={(e) => handlePropChange(path, 'id', e, 'string')} className="propInput" />
          {component.id && formComponents.some(c => c.id === component.id && c !== component) && <p className="errorText">Duplicate ID!</p>}
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

        {/* Type-Based Properties (kept) */}
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
              // 'defaultValue' checkbox needs to be styled like the others
              <div className="propFieldCheck" style={{ background: 'white' }}>
                <input type="checkbox" id={`def-${path}`} checked={!!component.defaultValue} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'boolean')} />
                <label htmlFor={`def-${path}`}>Checked (True)</label>
              </div>
            ) : (
              <input type="text" value={component.defaultValue || ''} onChange={(e) => handlePropChange(path, 'defaultValue', e, 'string')} className="propInput" />
            )}
          </div>
        )}

        {/* Boolean Checkboxes */}
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

        {/* Specific Properties (kept) */}
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
            <label className="propLabel">Options (JSON Array)</label>
            <textarea
              value={typeof component.options === 'string' ? component.options : JSON.stringify(component.options, null, 2)}
              onChange={(e) => handlePropChange(path, 'options', e, 'json')}
              className="propInput"
              rows={4}
              placeholder={`Ex: ["Option 1", "Option 2"]\n\nOr:\n\n[\n  {"label": "Option A", "value": "a"},\n  {"label": "Option B", "value": "b"}\n]`}
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

  // --- END OF FORM BUILDER HANDLERS ---


  const demos = [
    {
      id: "generic",
      title: "Generic Popup",
      description: "Simple popup to display messages",
      type: "generic",
      action: () => {
        const props = popupProps.generic;
        openPopup("generic", {
          data: {
            message: props.message,
            title: props.title,
            icon: props.icon, // string 'i'
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
      description: "Confirmation popup with actions",
      type: "confirm",
      action: () => {
        const props = popupProps.confirm;
        openPopup("confirm", {
          data: {
            message: props.message,
            title: props.title,
            icon: props.icon, // string '?'
            cancelLabel: props.cancelLabel,
            confirmLabel: props.confirmLabel,
            confirmStyle: props.confirmStyle,
            onChoose: (choice) => alert(choice ? "Confirmed!" : "Canceled")
          }
        });
      },
      properties: [
        { key: "title", label: "Title", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "cancelLabel", label: "Cancel Label", type: "text" },
        { key: "confirmLabel", label: "Confirm Label", type: "text" },
        { key: "confirmStyle", label: "Confirm Style", type: "select", options: ["default", "Secondary", "Success", "Danger"] },
        { disabled: true, key: "onChoose", label: "Action on choosing", type: "textarea" },
      ]
    },
    {
      id: "form",
      title: "Form - Contact (Simple)",
      description: "Example of simple pre-defined form",
      type: "form",
      action: () => {
        // Uses "form" props but with pre-defined components
        const props = popupProps.form;
        openPopup("form", {
          data: {
            title: props.title,
            message: props.message,
            icon: props.icon, // string '@'
            doneLabel: props.doneLabel,
            components: [
              { id: "name", type: "text", label: "Name", placeholder: "Your name", required: true },
              { id: "email", type: "email", label: "E-mail", placeholder: "your@email.com", required: false },
            ],
            onSubmit: (data) => alert(JSON.stringify(data)),
            onChange: (data) => console.log(data),
          }
        });
      },
      properties: [
        { key: "title", label: "Title", type: "text" },
        { key: "message", label: "Message", type: "textarea" },
        { key: "icon", label: "Icon", type: "text" },
        { key: "doneLabel", label: "Done Label", type: "text" },
        { disabled: true, key: "onSubmit", label: "Action on submit", type: "textarea" },
        { disabled: true, key: "onChange", label: "Action on change", type: "textarea" },
      ]
    },
    {
      id: "crop",
      title: "Crop Image",
      description: "Image cropping",
      type: "crop_image",
      action: () => {
        const props = popupProps.crop_image;
        openPopup("crop_image", {
          data: {
            format: props.format,
            aspectRatio: props.format != "square" ? "1:1" : props.aspectRatio,
            minZoom: props.minZoom,
            maxZoom: props.maxZoom,
            image: props.image || "/demo/image01.png",
            onCrop: (data) => alert(data)
          }
        });
      },
      properties: [
        { key: "image", label: "Image", type: "text" },
        { key: "format", label: "Format", type: "select", options: ["circle", "square"] },
        { key: "aspectRatio", label: "Aspect Ratio", type: "text" },
        { key: "minZoom", label: "Min Zoom", type: "number" },
        { key: "maxZoom", label: "Max Zoom", type: "number" },
        { disabled: true, key: "onCrop", label: "Action on crop confirmation", type: "textarea" },
      ]
    },
    {
      id: "html",
      title: "HTML Popup",
      description: "Custom HTML content",
      type: "html",
      action: () => {
        openPopup("html", {
          data: {
            html: ({ closePopup }) => (
              <div style={{ color: "black", padding: "20px", textAlign: "center" }}>
                <h2 style={{ marginBottom: "10px" }}>🎉 Hello!</h2>
                <p>This is a popup with fully customized HTML</p>
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
                  Close
                </button>
              </div>
            )
          }
        });
      },
      properties: [
        { disabled: true, key: "html", label: "HTML", type: "textarea" }
      ]
    },
    {
      id: "custom-simple",
      title: "Custom Popup",
      description: "User profile (simple example)",
      type: "my_user_popup",
      action: () => {
        const props = popupProps.my_user_popup;
        openPopup("my_user_popup", {
          data: {
            userId: props.userId,
            userName: props.userName,
            userBio: props.userBio,
            onAddFriend: (id) => alert(`New friend: ${id}`)
          }
        });
      },
      properties: [
        { key: "userId", label: "User ID", type: "text" },
        { key: "userName", label: "User Name", type: "text" },
        { key: "userBio", label: "User Bio", type: "text" },
        { disabled: true, key: "onAddFriend", label: "Action on adding friend", type: "text" },
      ]
    },
    {
      id: "custom-complex",
      title: "Custom Popup",
      description: "Buy product (complete example)",
      type: "my_buy_popup",
      action: () => {
        const props = popupProps.my_buy_popup;
        openPopup("my_buy_popup", {
          data: {
            productName: props.productName,
            productId: props.productId,
            productPrice: props.productPrice,
            productImage: props.productImage,
            productDescription: props.productDescription,
            productStock: props.productStock,
            allowQuantityChange: props.allowQuantityChange,
            showShipping: props.showShipping,
            shippingPrice: props.shippingPrice,
            freeShippingThreshold: props.freeShippingThreshold,
            acceptedPaymentMethods: props.acceptedPaymentMethods,
            allowCoupon: props.allowCoupon,
            getCoupon: async (code) => {
              // simulate your api latency
              await new Promise(resolve => setTimeout(resolve, 500));

              // coupon list
              const coupons = {
                "PERC10": { discount: 10, type: "percent" },
                "FIX20": { discount: 20, type: "fixed" }
              };

              // get current coupon object
              const coupon = coupons[code];

              // if the coupon is valid
              if (coupon) {
                // if is, returns the coupon object
                return { coupon: coupon }
              } else {
                // if not, returns error: true and errorMessage
                return { error: true, errorMessage: "Invalid Coupon" }
              }
            },
            onBuy: (purchase) => alert(JSON.stringify(purchase))
          }
        });
      },
      properties: [
        { key: "productName", label: "Product Name", type: "text" },
        { key: "productId", label: "Product ID", type: "text" },
        { key: "productPrice", label: "Product Price", type: "number" },
        { key: "productImage", label: "Image URL", type: "text" },
        { key: "productDescription", label: "Product Description", type: "textarea" },
        { key: "productStock", label: "Stock", type: "number" },
        { key: "allowQuantityChange", label: "Allow Quantity Change", type: "boolean" },
        { key: "showShipping", label: "Enable Shipping", type: "boolean" },
        { key: "shippingPrice", label: "Shipping Price", type: "number" },
        { key: "freeShippingThreshold", label: "Free Shipping Threshold", type: "number" },
        { key: "acceptedPaymentMethods", label: "Accepted Payment Methods", type: "array" },
        { key: "allowCoupon", label: "Allow Coupon", type: "boolean" },
        { disabled: true, key: "getCoupon", label: "Coupon retrieval logic", type: "textarea" },
        { disabled: true, key: "onBuy", label: "Action on purchase", type: "textarea" }
      ]
    }
  ];

  const advancedDemos = [
    {
      id: "no-escape",
      title: "No ESC close",
      description: "closeOnEscape: false",
      action: () => openPopup("confirm", {
        closeOnEscape: false,
        data: {
          message: "It's not possible to close this popup with the ESC key",
          title: "Locked Popup"
        }
      }),
      code: `openPopup("confirm", { 
  closeOnEscape: false,
  data: { 
    message: "Cannot close with ESC",
    title: "Locked Popup"
  } 
})`
    },
    {
      id: "no-outside-click",
      title: "No closing on outside click",
      description: "closeOnClickOutside: false",
      action: () => openPopup("confirm", {
        closeOnClickOutside: false,
        data: {
          message: "You cannot close this popup by clicking outside of it",
        }
      }),
      code: `openPopup("confirm", { 
  closeOnClickOutside: false,
  data: { 
    message: "You cannot close this popup by clicking outside of it",
  } 
})`
    },
    {
      id: "timeout",
      title: "Auto-close in 5s",
      description: "timeout: 5000",
      action: () => openPopup("generic", {
        timeout: 5000,
        data: {
          message: "This popup will automatically close in 5 seconds",
          title: "Timer",
          icon: "⏰" // custom string
        }
      }),
      code: `openPopup("generic", { 
  timeout: 5000,
  data: { 
    message: "Closes in 5 seconds",
    icon: "⏰"
  } 
})`
    },
    {
      id: "require-action",
      title: "Requires action",
      description: "requireAction: true",
      action: () => openPopup("confirm", {
        requireAction: true,
        data: {
          message: "You must choose an option to continue",
          title: "Mandatory Choice",
          cancelLabel: "No",
          confirmLabel: "Yes"
        }
      }),
      code: `openPopup("confirm", { 
  requireAction: true,
  data: { 
    message: "You must choose an option"
  } 
})`
    },
    {
      id: "keep-last-false",
      title: "Replace open popup",
      description: "keepLast: false",
      action: () => {
        openPopup("generic", { minWidth: "600px", data: { message: "Popup 1 - Wait 3 seconds..." } });
        setTimeout(() => {
          openPopup("generic", {
            keepLast: false,
            maxWidth: "400px",
            data: { message: "The first popup only returns when you close this one", title: "Popup 2" }
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
      title: "Overlay open popup",
      description: "keepLast: true",
      action: () => {
        openPopup("generic", { minWidth: "600px", data: { message: "Popup 1 - Wait 3 seconds..." } });
        setTimeout(() => {
          openPopup("generic", {
            minWidth: "400px",
            keepLast: true,
            data: { message: "The first popup is still open!", title: "Popup 2" }
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
      title: "Allow page scroll",
      description: "allowPageBodyScroll: true",
      action: () => openPopup("generic", {
        allowPageBodyScroll: true,
        data: {
          message: "The page body scroll is enabled.",
          title: "Scroll Allowed"
        }
      }),
      code: `openPopup("generic", {
  allowPageBodyScroll: true,
  data: {
    message: "Scroll enabled"
  }
})`
    },
    {
      id: "interactive-backdrop",
      title: "Interactive backdrop",
      description: "interactiveBackdrop: true",
      action: () => openPopup("generic", {
        interactiveBackdrop: true,
        data: {
          message: "You can interact with the content behind this popup",
          title: "Interactive Backdrop"
        }
      }),
      code: `openPopup("generic", { 
  interactiveBackdrop: true,
  data: { 
    message: "Interactive backdrop"
  } 
})`
    },
    {
      id: "hidden-backdrop",
      title: "No dark background",
      description: "hiddenBackdrop: true",
      action: () => openPopup("generic", {
        hiddenBackdrop: true,
        data: {
          message: "This popup does not have a dark background",
          title: "No Backdrop"
        }
      }),
      code: `openPopup("generic", { 
  hiddenBackdrop: true,
  data: { 
    message: "No dark background"
  } 
})`
    },
    {
      id: "hidden-footer",
      title: "No footer",
      description: "hiddenFooter: true",
      action: () => openPopup("generic", {
        hiddenFooter: true,
        data: {
          message: "The footer has been removed.",
          title: "No Footer"
        }
      }),
      code: `openPopup("generic", { 
  hiddenFooter: true,
  data: { 
    message: "No footer"
  } 
})`
    },
    {
      id: "hidden-header",
      title: "No header",
      description: "hiddenHeader: true",
      action: () => openPopup("generic", {
        hiddenHeader: true,
        data: {
          message: "The header has been removed.",
          title: "No Header"
        }
      }),
      code: `openPopup("generic", { 
  hiddenHeader: true,
  data: { 
    message: "No header"
  } 
})`
    },
    {
      id: "no-animation",
      title: "No animation",
      description: "disableAnimation: true",
      action: () => openPopup("generic", {
        disableAnimation: true,
        data: {
          message: "The popup opens and closes instantly, without the default animation.",
          title: "No Animation"
        }
      }),
      code: `openPopup("generic", { 
  disableAnimation: true,
  data: { 
    message: "No animation"
  } 
})`
    },
    {
      id: "max-width",
      title: "Max Width (400px)",
      description: "maxWidth: '400px'",
      action: () => openPopup("generic", {
        maxWidth: "400px",
        data: {
          message: "This popup has a maximum width defined at 400px. The content adjusts.",
          title: "Max 400px"
        }
      }),
      code: `openPopup("generic", { 
  maxWidth: "400px",
  data: { 
    message: "Max 400px"
  } 
})`
    },
    {
      id: "min-width",
      title: "Min Width (100px)",
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
      codeInPopup: true,
      title: "Callback on Open",
      description: "onOpen()",
      action: () => openPopup("generic", {
        onOpen: (popup) => alert(`Popup opened! ID: ${popup.id}`),
        data: {
          message: "An 'alert' was fired with the popup ID.",
          title: "Open Callback"
        }
      }),
      code: `openPopup("generic", { 
  onOpen: (popup) => alert(\`Popup opened! ID: \${popup.id}\`),
  data: { 
    message: "onOpen() callback executed"
  } 
})`
    },
    {
      id: "on-close",
      title: "Callback on Close",
      codeInPopup: true,
      description: "onClose()",
      action: () => openPopup("confirm", {
        onClose: (hasAction, id) => alert(`Popup closed! Had action (confirm/cancel): ${hasAction ? "Yes" : "No"}`),
        data: {
          message: "Close the popup by clicking the options or outside.",
          title: "Close Callback"
        }
      }),
      code: `openPopup("confirm", { 
  onClose: (hasAction, id) => alert(\`Popup closed! Had action (confirm/cancel): \${hasAction ? "Yes" : "No"}\`),
  data: { 
    title: "Close Callback"
  } 
})`
    },
    {
      id: "update-popup",
      title: "Dynamic Update",
      codeInPopup: true,
      description: "updatePopup() - Stopwatch",
      action: async () => {
        const popup = await openPopup("generic", {
          onClose: () => stopInterval(),
          data: {
            title: "Stopwatch",
            icon: "⏰", // custom string
            message: "Starting...",
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

        function stopInterval() { // Best practice: Ensure the interval is cleared on close
          clearInterval(interval);
        }
      },
      code: `// Hook
const { openPopup, updatePopup } = useNtPopups();

// Your open code
const popup = await openPopup("generic", {
  onClose: () => stopInterval(),
  data: {
    title: "Stopwatch",
    icon: "⏰",
    message: "Starting...",
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

function stopInterval() { // Best practice: ensure the interval is cleared on close
  clearInterval(interval);
}`
    }
  ];


  // --- NEW ARRAY FOR CAROUSEL ---
  /*
    This complete array combines the initial 8 examples,
    the 10 intermediate examples, and the 10 advanced examples.
  
    Assuming icon imports:
    import { FaTrashAlt, FaCheck, FaUserCircle, FaCrop, FaEnvelope, FaHtml5, FaQuestionCircle, FaExclamationTriangle, FaShoppingCart, FaInfoCircle,
             FaWrench, FaTags, FaLock, FaCalendarAlt, FaAddressCard, FaSlidersH, FaFileAlt, FaGlobe, FaUserPlus, FaRegCreditCard,
             FaSitemap, FaKey, FaChartPie, FaBroadcastTower, FaMicrophoneAlt, FaPalette, FaMoneyBillWave, FaStar, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
  */

  const carouselDemos = [
    // ====================================================================
    // 🟢 Set 1: Initial Examples
    // ====================================================================
    {
      id: 'confirm-del',
      label: 'Confirm Deletion',
      icon: <FaTrashAlt size={24} color="#e53e3e" />,
      type: "confirm",
      props: { title: "Delete item?", message: "This action is permanent and cannot be undone.", icon: "🗑️", confirmLabel: "Yes, Delete", confirmStyle: "Danger" }
    },
    {
      id: 'generic-success',
      label: 'Success',
      icon: <FaCheck size={24} color="#48bb78" />,
      type: "generic",
      props: { title: "Action Complete!", message: "Your profile has been successfully updated.", icon: "✅" }
    },
    {
      id: 'loading',
      label: 'Loading',
      icon: <SiStagetimer />,
      type: "generic",
      hiddenFooter: true,
      hiddenHeader: true,
      minWidth: "0px",
      timeout: 3000,
      closeOnClickOutside: false,
      closeOnEscape: false,
      onClose: () => {
        openPopup("generic", {
          hiddenFooter: true,
          hiddenHeader: true,
          minWidth: "0px",
          timeout: 3000,
          closeOnClickOutside: false,
          closeOnEscape: false,
          onClose: () => {
            openPopup("generic", {
              data: {
                message: "Updated successfully!",
                icon: "✅",
                title: "Success!"
              }
            })
          },
          data: {
            message: "Thinking..."
          }
        })
      },
      props: { message: <span className="loader"></span> }
    },
    {
      id: 'crop-avatar',
      label: 'Crop Avatar (Circle)',
      icon: <FaUserCircle size={24} color="#6366f1" />,
      type: "crop_image",
      props: { title: "Crop Avatar", format: "circle", image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNC9JTUFHRS8yMl8zOF80MF9fMTc2MTM1NjMyMDUyMi0zOTMyNzczMw.webp" }
    },
    {
      id: 'crop-banner',
      label: 'Crop Banner (16:4)',
      icon: <FaCrop size={24} color="#f6ad55" />,
      type: "crop_image",
      props: { title: "Crop Banner", format: "square", aspectRatio: "16:4", image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNy9JTUFHRS8yMl81MV81NV9fMTc2MTYxNjMxNTM4NC01NDE1Mzc5OTg.webp" }
    },
    {
      id: 'form-email',
      label: 'Contact Form',
      icon: <FaEnvelope size={24} color="#3182ce" />,
      type: "form",
      props: { title: "Get in Touch", message: "Send your message and we'll get back to you shortly.", icon: "💬", components: [{ id: "name", type: "text", label: "Name", required: true, placeholder: "First name" }, { id: "email", type: "email", label: "E-mail", required: true, placeholder: "email" }, { id: "message", type: "textarea", label: "Message" }] }
    },
    {
      id: 'html-custom',
      label: 'Custom HTML',
      icon: <FaHtml5 size={24} color="#dd6b20" />,
      type: "html",
      props: {
        html: ({ closePopup }) => (
          <div style={{ color: "black", padding: "20px", textAlign: "center", background: "#fefcbf", borderRadius: "8px" }}>
            <h2>Attention! 🚨</h2>
            <p>This popup was rendered using inline HTML and CSS.</p>
            <button onClick={() => closePopup(true)} style={{ marginTop: "10px", background: "#f6e05e", border: "1px solid #ecc94b", padding: "8px", borderRadius: "4px", cursor: "pointer" }}>OK</button>
          </div>
        )
      }
    },
    {
      id: 'confirm-logout',
      label: 'Logout Confirmation',
      icon: <FaQuestionCircle size={24} color="#319795" />,
      type: "confirm",
      props: { title: "Log out of account?", message: "Your unsaved data will be lost.", icon: "👋", confirmLabel: "Logout", cancelLabel: "Stay Logged In" }
    },
    {
      id: 'generic-alert',
      label: 'Error Alert',
      icon: <FaExclamationTriangle size={24} color="#e53e3e" />,
      type: "generic",
      props: { title: "Transaction Failed", message: "An error occurred. Please try again.", icon: "❌" }
    },
    {
      id: 'buy-product',
      label: 'Custom: Buy Product',
      icon: <FaShoppingCart size={24} color="#9f7aea" />,
      type: "my_buy_popup", // Custom type not built-in
      props: {
        productName: "Super Console",
        productPrice: 499.90,
        productImage: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNy9JTUFHRS8yMl8xNl8wOF9fMTc2MTYxNDE2ODE1Mi0zNzU0NDExNDY.webp",
        productDescription: "The best console of the new generation. Enjoy!",
        productStock: 5
      }
    },
    {
      id: 'generic-info',
      label: 'Important Notice',
      icon: <FaInfoCircle size={24} color="#3182ce" />,
      type: "generic",
      props: { title: "Update", message: <p>Our <a href="#" ntpopups-css="true">terms of service</a> have been updated.</p>, icon: "🔔" }
    },

    // ====================================================================
    // 🟡 Set 2: Intermediate Examples
    // ====================================================================
    {
      id: 'form-settings',
      label: 'Form: User Settings',
      icon: <FaWrench size={24} color="#a0aec0" />,
      type: "form",
      props: {
        title: "Account Preferences",
        message: "Customize how your account behaves.",
        icon: "⚙️",
        components: [
          { id: "theme", type: "select", label: "Theme", defaultValue: "Dark", options: ["Light", "Dark", "System"], required: true },
          [ // Inline Fields
            { id: "age", type: "number", label: "Age", min: 18, max: 99, placeholder: "Minimum 18" },
            { id: "timezone", type: "text", label: "Timezone", required: true, defaultValue: "UTC-3" }
          ]
        ]
      }
    },
    {
      id: 'generic-discount',
      label: 'Generic: Offer Popup',
      icon: <FaTags size={24} color="#ed64a6" />,
      type: "generic",
      props: {
        title: "Exclusive Offer! 🎉",
        message: <p>Use coupon <b>NTPOPUPS20</b> for 20% OFF your first purchase!</p>,
        closeLabel: "Claim Now",
        icon: "🎁"
      }
    },
    {
      id: 'form-appointment',
      label: 'Form: Service Appointment',
      icon: <FaCalendarAlt size={24} color="#d53f8c" />,
      type: "form",
      width: "400px",
      props: {
        title: "Schedule Meeting",
        doneLabel: "Schedule",
        icon: "📅",
        components: [
          { id: "service", type: "select", label: "Service", required: true, options: ["Technical Support", "Consulting", "Demo"] },
          { id: "date", type: "date", label: "Preferred Date", required: true, minDate: new Date() },
          { id: "time", type: "time", label: "Time", required: true }
        ]
      }
    },
    {
      id: 'form-address',
      label: 'Form: Address Registration',
      icon: <FaAddressCard size={24} color="#38a169" />,
      type: "form",
      props: {
        title: "New Shipping Address",
        message: "Fill in all required fields (*).",
        icon: "🏠",
        doneLabel: "Save Address",
        components: [
          [
            { id: "zipcode", type: "text", label: "Zip Code", required: true, placeholder: "00000-000", minLength: 8, maxLength: 9 },
            { id: "state", type: "select", label: "State", required: true, options: ["SP", "RJ", "MG", "Other"] }
          ],
          { id: "street", type: "text", label: "Street/Avenue", required: true, placeholder: "Street..." },
          [
            { id: "number", type: "number", label: "Number", required: true, min: 1, placeholder: "01" },
            { id: "complement", type: "text", label: "Complement (Optional)", required: false, placeholder: "Complement" }
          ]
        ]
      }
    },
    {
      id: 'generic-terms',
      label: 'Generic: Accept Terms',
      icon: <FaFileAlt size={24} color="#805ad5" />,
      type: "generic",
      requireAction: true,
      maxHeight: "min(500px, 90dvh)",
      maxWidth: "min(500px, 50dvw)",
      props: {
        title: "Read the Terms of Service",
        message: <>
          <h4>Section 1: Platform Use</h4>
          <p>By using our platform, you agree not to infringe third-party rights...</p>
          <p>...</p>
          <h4>Section 2: Data Privacy</h4>
          <p>We collect and process your data according to our Privacy Policy...</p>
          <p>...</p>
          <h4>Section 3: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 4: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 5: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 6: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 7: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 8: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 9: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 10: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
          <h4>Section 11: Lorem ipsum dolor</h4>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi nesciunt nulla vitae sint ut, delectus est quidem quos hic. Voluptatum expedita voluptatem minima iure! Dicta aut error nemo itaque doloremque?</p>
          <p>...</p>
        </>,
        closeLabel: "I have read and agree",
        icon: "📜"
      }
    },
    {
      id: 'form-lang',
      label: 'Form: Language Selection',
      icon: <FaGlobe size={24} color="#4c51bf" />,
      type: "form",
      props: {
        title: "Choose Language",
        doneLabel: "Save",
        icon: "🌐",
        components: [
          {
            id: "language",
            type: "select",
            label: "Interface Language",
            required: true,
            defaultValue: 'pt',
            options: [
              { label: 'Portuguese (Brazil)', value: 'pt' },
              { label: 'English (US)', value: 'en' },
              { label: 'Español', value: 'es' }
            ]
          }
        ]
      }
    },
    {
      id: 'form-signup',
      label: 'Form: Quick Sign Up',
      icon: <FaUserPlus size={24} color="#e65100" />,
      type: "form",
      props: {
        title: "Create your Free Account",
        doneLabel: "Sign Up",
        icon: "✨",
        components: [
          { id: "email", type: "email", label: "E-mail", required: true },
          { id: "password", type: "password", label: "Password", required: true, minLength: 8 },
          { id: "accept_terms", type: "checkbox", label: "I accept the Terms of Use", required: true }
        ]
      }
    },
    {
      id: 'confirm-payment',
      label: 'Confirm: Finalize Purchase',
      icon: <FaRegCreditCard size={24} color="#f6e05e" />,
      type: "confirm",
      props: {
        title: "Confirm Payment",
        message: "The amount of R$ 99.90 will be debited from your card. Do you confirm the transaction?",
        icon: "💳",
        confirmLabel: "Pay R$ 99.90",
        cancelLabel: "Review Order",
        confirmStyle: "Success"
      }
    },
    {
      id: 'crop-article-image',
      label: 'Crop Article Image (4:3)',
      icon: <FaCrop size={24} color="#90cdf4" />,
      type: "crop_image",
      props: {
        title: "Article Image",
        format: "square",
        aspectRatio: "4:3",
        image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNC9JTUFHRS8yMl8zOF80MF9fMTc2MTM1NjMyMDUyMi0zOTMyNzczMw.webp",
        requireAction: true
      }
    },

    // ====================================================================
    // 🔴 Set 3: Advanced Examples
    // ====================================================================
    {
      id: 'form-url-config',
      label: 'Form: Configure Slug/URL',
      icon: <FaSitemap size={24} color="#f6ad55" />,
      type: "form",
      props: {
        title: "Define Friendly URL",
        message: "Use only lowercase letters, numbers, and hyphens.",
        icon: "🔗",
        doneLabel: "Save Slug",
        components: [
          {
            id: "slug",
            type: "text",
            label: "URL Slug",
            required: true,
            placeholder: "my-excellent-article",
            matchRegex: '^[a-z0-9-]+$',
            minLength: 5
          }
        ]
      }
    },
    {
      id: 'form-revalidate-pass',
      label: 'Form: Password Revalidation',
      icon: <FaKey size={24} color="#718096" />,
      type: "form",
      requireAction: true,
      props: {
        title: "Confirm Your Identity",
        message: "Enter your current password to proceed with the critical change.",
        icon: "🔒",
        doneLabel: "Confirm Password",
        components: [
          {
            id: "current_password",
            type: "password",
            label: "Current Password",
            required: true,
            minLength: 8
          }
        ]
      }
    },
    {
      id: 'generic-maintenance',
      label: 'Generic: Maintenance Notice',
      icon: <FaHourglassHalf size={24} color="#ecc94b" />,
      type: "generic",
      props: {
        title: "System Under Maintenance",
        message: "We will be offline for about 30 minutes for improvements. We apologize for the inconvenience.",
        closeLabel: "Understood",
        icon: "⏳"
      }
    },
    {
      id: 'confirm-cancel-sub',
      label: 'Confirm: Cancel Subscription',
      icon: <FaTimesCircle size={24} color="#c53030" />,
      type: "confirm",
      props: {
        title: "Cancel Subscription?",
        message: "You will lose premium access at the end of the billing cycle. Do you wish to proceed?",
        icon: "💔",
        confirmLabel: "Yes, Cancel",
        confirmStyle: "Danger",
        cancelLabel: "Keep Subscription"
      }
    },
    {
      id: 'form-multi-upload',
      label: 'Form: Multiple File Upload',
      icon: <FaFileAlt size={24} color="#48bb78" />,
      type: "form",
      props: {
        title: "Send Documents",
        message: "Attach all necessary proofs.",
        icon: "📂",
        components: [
          {
            id: "documents",
            type: "file",
            label: "Proofs (PDF/JPG)",
            accept: '.pdf,.jpg,.jpeg',
            multiple: true,
            required: true
          }
        ]
      }
    },
    {
      id: 'form-rating',
      label: 'Form: Send Feedback (Custom Rating)',
      icon: <FaStar size={24} color="#f6e05e" />,
      type: "form",
      props: {
        title: "Rate Our Service",
        message: "Give your rating and a brief comment.",
        icon: "⭐",
        doneLabel: "Submit Review",
        customComponents: {
          'star_rating': {
            emptyValue: 0,
            validator: (value) => value < 1 ? "Rating is required" : null,
            render: (props) => {
              const positiveStars = [];
              const emptyStars = [];

              for (let i = 0; i < 5; i++) {
                if (i < props.value) {
                  positiveStars.push(
                    <span style={{ cursor: "pointer", color: "#ffc80" }} key={`filled-${i}`} onClick={() => props.changeValue(i + 1)}>
                      ★
                    </span>
                  );
                } else {
                  emptyStars.push(
                    <span style={{ cursor: "pointer" }} key={`empty-${i}`} onClick={() => props.changeValue(i + 1)}>
                      ☆
                    </span>
                  );
                }
              }

              return (
                <div style={{ fontSize: "2rem" }}>
                  {[...positiveStars, ...emptyStars]}
                </div>
              );
            }
          }
        },
        components: [
          { id: "rating", type: "star_rating", label: "Rating (1-5)", required: true, defaultValue: 0 },
          { id: "comment", type: "textarea", label: "Comment (Optional)", maxLength: 150 }
        ]
      }
    },
    {
      id: 'crop-social-post',
      label: 'Crop Image (Social Post 1:1)',
      icon: <FaCrop size={24} color="#90cdf4" />,
      type: "crop_image",
      props: {
        title: "Crop for Social Media",
        format: "square",
        aspectRatio: "1:1",
        image: "https://cdn.nemtudo.me/f/nemtudo/MjAyNS8xMC8yNC9JTUFHRS8yMl8zOF80MF9fMTc2MTM1NjMyMDUyMi0zOTMyNzczMw.webp",
        minZoom: 1.5
      }
    },
    {
      id: 'generic-billing-warning',
      label: 'Generic: Billing Warning',
      icon: <FaMoneyBillWave size={24} color="#008000" />,
      type: "generic",
      props: {
        title: "Pending Payment!",
        message: "Your invoice is overdue. Update your payment method immediately to avoid service interruption.",
        closeLabel: "Go to Payment",
        icon: "⚠️"
      }
    },
  ];

  // Helper function to open the carousel popup
  const handleOpenCarouselPopup = (demo) => {
    openPopup(demo.type, {
      data: demo.props,
      ...demo,
    });
  }

  return (
    <>
      <div className="container">
        <header className="header">
          <div className="headerContent">
            <h1 className="logo">
              <span className="logoIcon"><FaMagic /></span>
              ntPopups
            </h1>
            <p className="subtitle">Modern popup library for React</p>
            <div className="headerActions">
              <a
                href="https://ntpopups.nemtudo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="docLink"
              >
                <FaBookOpen size={16} /> View full documentation
              </a>
            </div>
          </div>
        </header>

        <section className="settingsSection">
          <div className="sectionContent">
            <h2 className="sectionTitle"><FaCog size={22} style={{ marginRight: '0.75rem' }} /> Global Settings</h2>
            <div className="settingsGrid">
              <div className="settingGroup">
                <span className="settingLabel">Popup Theme</span>
                <div className="buttonGroup">
                  <button
                    onClick={() => changeTheme("dark")}
                    className={`settingBtn ${currentTheme === "dark" ? "active" : ""}`}
                  >
                    <FaMoon size={14} style={{ marginRight: '0.4rem' }} /> Dark
                  </button>
                  <button
                    onClick={() => changeTheme("white")}
                    className={`settingBtn ${currentTheme === "white" ? "active" : ""}`}
                  >
                    <FaSun size={14} style={{ marginRight: '0.4rem' }} /> Light
                  </button>
                </div>
              </div>
              <div className="settingGroup">
                <span className="settingLabel">Language</span>
                <div className="buttonGroup">
                  <button
                    onClick={() => changeLang("ptbr")}
                    className={`settingBtn ${currentLang === "ptbr" ? "active" : ""}`}
                  >
                    <FaGlobe size={14} style={{ marginRight: '0.4rem' }} /> PT-BR
                  </button>
                  <button
                    onClick={() => changeLang("en")}
                    className={`settingBtn ${currentLang === "en" ? "active" : ""}`}
                  >
                    <FaGlobe size={14} style={{ marginRight: '0.4rem' }} /> EN
                  </button>
                </div>
                <span style={{ color: "gray" }}>The language updates default texts, errors, and native popup texts</span>
              </div>
            </div>
            <CodeBlock code={`"use client";
import { NtPopupProvider } from "ntpopups";
import "ntpopups/dist/styles.css"

export default function PopupContext({ children }) {

  return (
    <NtPopupProvider language={"${currentLang}"} theme={"${currentTheme}"}>
        {children}
    </NtPopupProvider>
    )
}`} />
          </div>
        </section>
        <section className="examplesSection">
          <div className="sectionContent">
            <h2 className="sectionTitle"><FaRocket size={22} style={{ marginRight: '0.75rem' }} /> Popup Examples</h2>
            <p className="sectionDescription">
              Click on the cards below to test several common popup use cases.
            </p>
          </div>

          <div className="carouselWrapper">
            <div className="carouselContainer">
              {/* Duplicate the list to ensure smooth infinite loop */}
              {carouselDemos.map((demo, index) => (
                <div key={`1-${index}`} className="carouselCard" onClick={() => handleOpenCarouselPopup(demo)}>
                  <div className="cardIcon">{demo.icon}</div>
                  <h4 className="cardTitle">{demo.label}</h4>
                  <span className={`cardType ${demo.type}`}>{demo.type}</span>
                </div>
              ))}
              {carouselDemos.map((demo, index) => (
                <div key={`2-${index}`} className="carouselCard" onClick={() => handleOpenCarouselPopup(demo)}>
                  <div className="cardIcon">{demo.icon}</div>
                  <h4 className="cardTitle">{demo.label}</h4>
                  <span className={`cardType ${demo.type}`}>{demo.type}</span>
                </div>
              ))}
              {carouselDemos.map((demo, index) => (
                <div key={`2-${index}`} className="carouselCard" onClick={() => handleOpenCarouselPopup(demo)}>
                  <div className="cardIcon">{demo.icon}</div>
                  <h4 className="cardTitle">{demo.label}</h4>
                  <span className={`cardType ${demo.type}`}>{demo.type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* // ---------------------------------------------------------------------
        // --- END OF NEW SECTION ---
        // ---------------------------------------------------------------------
        */}

        <section className="mainSection">
          <div className="sectionContent">
            <h2 className="sectionTitle">🎯 Popup Types</h2>
            <p className="sectionDescription">
              Explore and edit the different predefined popup types.
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
                        title="Edit properties"
                      >
                        <FaCog size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (demo.codeInline) {
                            toggleCode(demo.id)
                          } else {
                            const code = generateCode(demo.type);
                            const finalCodeArray = Array.isArray(code) ? code : [code];
                            openPopup("show_code", {
                              maxWidth: "100dvw",
                              data: {
                                content: <>
                                  {
                                    finalCodeArray.map((code, index) => <CodeBlock key={index} fullHeight={true} code={code} />)
                                  }
                                </>
                              }
                            })
                          }
                        }}
                        className="codeToggle"
                        title="View code"
                      >
                        {showCode[demo.id] ? <FaChevronUp size={16} /> : <FaCode />}
                      </button>
                    </div>
                  </div>

                  {expandedProps[demo.id] && (
                    <div className="propsEditor">
                      <h4 className="propsTitle">Properties (data)</h4>
                      {
                        demo.type === "form" && <div className="propwarn"><span>See the full form component editor further down on this page</span></div>
                      }
                      {
                        demo.type.startsWith("my") && <div className="propwarn"><span>Learn all about custom popups by reading the <a target="_blank" href="https://ntpopups.nemtudo.me/custom-popups/">Official Documentation</a></span></div>
                      }
                      {demo.properties.map(prop => {
                        return <div key={prop.key} className="propField">
                          <label className="propLabel">{prop.label} <span style={{ color: "gray", fontSize: "0.8rem", textTransform: "none", fontWeight: "100" }}>(data.{prop.key})</span></label>
                          {prop.type === "select" ? (
                            <select
                              value={popupProps[demo.type][prop.key]}
                              onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value)}
                              className="propInput"
                              disabled={prop.disabled}
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
                              disabled={prop.disabled}
                            />
                          ) : prop.type === "boolean" ? (
                            <select
                              value={popupProps[demo.type][prop.key] ? "true" : "false"}
                              onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value === "true")}
                              className="propInput"
                              disabled={prop.disabled}
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          ) : prop.type === "array" ? (
                            <textarea
                              value={JSON.stringify(popupProps[demo.type][prop.key], null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  updatePopupProp(demo.type, prop.key, parsed);
                                } catch (err) {
                                  // Allows editing even with invalid JSON
                                }
                              }}
                              className="propInput"
                              rows={3}
                              disabled={prop.disabled}
                              placeholder='["item1", "item2"]'
                            />
                          ) : prop.type === "object" ? (
                            <textarea
                              value={JSON.stringify(popupProps[demo.type][prop.key], null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  updatePopupProp(demo.type, prop.key, parsed);
                                } catch (err) {
                                  // Allows editing even with invalid JSON
                                }
                              }}
                              className="propInput"
                              rows={4}
                              disabled={prop.disabled}
                              placeholder='{"key": "value"}'
                            />
                          ) : prop.type === "textarea" ? (
                            <textarea
                              value={popupProps[demo.type][prop.key]}
                              onChange={(e) => updatePopupProp(demo.type, prop.key, e.target.value)}
                              className="propInput"
                              rows={2}
                              disabled={prop.disabled}
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
                    Open Popup
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="advancedSection">
          <div className="sectionContent">
            <h2 className="sectionTitle"><FaRocket size={22} style={{ marginRight: '0.75rem' }} /> General Settings</h2>
            <p className="sectionDescription">
              Properties automatically available in all popup types (Including those you create!)
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
                        onClick={() => {
                          if (demo.codeInPopup) {
                            openPopup("show_code", {
                              maxWidth: "100dvw",
                              data: {
                                content: <>
                                  <CodeBlock code={demo.code} fullHeight={true} />
                                </>
                              }
                            })
                          } else {
                            toggleAdvancedCode(demo.id)
                          }
                        }}
                        className="codeToggle"
                        title="View code"
                      >
                        {showAdvancedCode[demo.id] ? <FaChevronUp size={16} /> : <FaCode size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Advanced Settings CodeBlock Display */}
                  {(showAdvancedCode[demo.id]) && (
                    <CodeBlock code={demo.code} />
                  )}

                  <button
                    onClick={demo.action}
                    className="demoBtn"
                  >
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* // ---------------------------------------------------------------------
      // --- NEW SECTION: FORM BUILDER ---
      // ---------------------------------------------------------------------
      */}
        <section className="formBuilderSection">
          <div className="sectionContent">
            <h2 className="sectionTitle"><FaMagic size={22} style={{ marginRight: '0.75rem' }} /> Dynamic Form Editor</h2>
            <p className="sectionDescription">
              Create, configure, and test complex form popups in real-time.
            </p>

            {/* Actions */}
            <div className="formBuilderActions">
              <button
                onClick={handleOpenFormPopup}
                className="demoBtn"
                style={{
                  maxWidth: "200px"
                }}
              >
                <FaRocket size={16} style={{ marginRight: '0.4rem' }} /> Test Form
              </button>
              <button
                onClick={() => {
                  openPopup("show_code", {
                    data: {
                      content: <>
                        <CodeBlock fullHeight={true} code={generateFormBuilderCode()} />
                      </>
                    }
                  })
                }}
                className={`settingBtn`}
                style={{ flex: '0 1 auto', padding: '0.75rem 1.5rem', minWidth: '150px' }}
              >
                View Code
              </button>
            </div>
            {/* Main Properties Toolbar */}
            <div className="propsEditor mainPropsEditor">
              <h4 className="propsTitle">Main Properties (data)</h4>
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

            {/* Main Editor Layout (2 columns) */}
            <div className="formBuilderEditor">

              {/* Column 1: Component List */}
              <div className="componentListPanel">
                <h4 className="componentListTitle">Form Components</h4>
                <div className="componentList">
                  {formComponents.map((component, index) => {
                    const isSelected = selectedComponentPath && selectedComponentPath[0] === index && selectedComponentPath.length === 1;

                    // Renders Inline Group
                    if (Array.isArray(component)) {
                      return (
                        <div key={index} className="inlineGroup">
                          <div className="inlineGroupHeader">
                            <span>#{index + 1} - Inline Group</span>
                            <button onClick={() => handleDeleteComponent([index])} className="deleteBtn" title="Remove Group"><FaTrashAlt /></button>
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
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteComponent([index, inlineIndex]); }} className="deleteBtn" title="Remove Item"><FaTimes /></button>
                                </div>
                              );
                            })}
                            <button className="addBtn" onClick={() => handleAddComponent(newComponentType, index)}>+ Add Item to Group</button>
                          </div>
                        </div>
                      );
                    }

                    // Renders Normal Item
                    return (
                      <div
                        key={index}
                        className={`componentItem ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectComponent([index])}
                      >
                        <span>{component.label || component.id} <small>({component.id}) [{component.type}]</small></span>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteComponent([index]); }} className="deleteBtn" title="Remove Item"><FaTimes /></button>
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
                  <button className="addBtn" onClick={() => handleAddComponent(newComponentType)}>+ Add</button>
                  <button className="addBtn secondary" onClick={handleAddInlineGroup}>+ Inline Group</button>
                </div>
              </div>

              {/* Column 2: Property Editor */}
              <div className="propertyEditorPanel">
                {renderPropertyEditor()}
              </div>

            </div>
          </div>
        </section>

        <footer className="footer">
          <p>Made with ❤️ using ntpopups</p>
        </footer>
      </div>
    </>
  );
}