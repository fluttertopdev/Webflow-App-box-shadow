// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom/client";

// // Webflow API is exposed globally inside Designer Extensions
// declare const webflow: any;

// // Define common types
// interface ShadowPreset {
//   id: string;
//   name: string;
//   value: string;
//   preview: string;
// }

// interface ShadowControls {
//   x: number;
//   y: number;
//   blur: number;
//   color: string;
//   opacity: number;
// }

// interface BoxShadowControls extends ShadowControls {
//   spread: number;
//   inset: boolean;
// }

// interface GradientControls {
//   type: "linear" | "radial";
//   angle: number;
//   colors: { color: string; position: number }[];
// }

// // Default controls
// const defaultBoxControls: BoxShadowControls = {
//   x: 0,
//   y: 4,
//   blur: 8,
//   spread: 0,
//   color: "#000000",
//   opacity: 0.25,
//   inset: false
// };

// const defaultTextControls: ShadowControls = {
//   x: 0,
//   y: 2,
//   blur: 4,
//   color: "#000000",
//   opacity: 0.25
// };

// const defaultGradientControls: GradientControls = {
//   type: "linear",
//   angle: 90,
//   colors: [
//     { color: "#6e8efb", position: 0 },
//     { color: "#a777e3", position: 100 }
//   ]
// };

// // Predefined presets
// const boxPresets: ShadowPreset[] = [
//   {
//     id: "soft",
//     name: "Soft Shadow",
//     value: "0 4px 8px rgba(0, 0, 0, 0.12)",
//     preview: "0 4px 8px rgba(0, 0, 0, 0.12)"
//   },
//   {
//     id: "medium",
//     name: "Medium Shadow",
//     value: "0 6px 12px rgba(0, 0, 0, 0.15)",
//     preview: "0 6px 12px rgba(0, 0, 0, 0.15)"
//   },
//   {
//     id: "hard",
//     name: "Hard Shadow",
//     value: "0 8px 16px rgba(0, 0, 0, 0.2)",
//     preview: "0 8px 16px rgba(0, 0, 0, 0.2)"
//   },
//   {
//     id: "inner",
//     name: "Inner Shadow",
//     value: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
//     preview: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
//   },
//   {
//     id: "floating",
//     name: "Floating",
//     value: "0 10px 25px rgba(0, 0, 0, 0.15)",
//     preview: "0 10px 25px rgba(0, 0, 0, 0.15)"
//   },
//   {
//     id: "subtle",
//     name: "Subtle",
//     value: "0 1px 3px rgba(0, 0, 0, 0.1)",
//     preview: "0 1px 3px rgba(0, 0, 0, 0.1)"
//   },
//   {
//     id: "neon",
//     name: "Neon Glow",
//     value: "0 0 10px rgba(0, 255, 255, 0.7)",
//     preview: "0 0 10px rgba(0, 255, 255, 0.7)"
//   },
//   {
//     id: "elegant",
//     name: "Elegant",
//     value: "0 15px 35px rgba(0, 0, 0, 0.1)",
//     preview: "0 15px 35px rgba(0, 0, 0, 0.1)"
//   }
// ];

// const textPresets: ShadowPreset[] = [
//   {
//     id: "soft-text",
//     name: "Soft Text",
//     value: "0 1px 2px rgba(0, 0, 0, 0.2)",
//     preview: "0 1px 2px rgba(0, 0, 0, 0.2)"
//   },
//   {
//     id: "bold-text",
//     name: "Bold Text",
//     value: "0 2px 4px rgba(0, 0, 0, 0.3)",
//     preview: "0 2px 4px rgba(0, 0, 0, 0.3)"
//   },
//   {
//     id: "glow",
//     name: "Glow Effect",
//     value: "0 0 8px rgba(0, 150, 255, 0.7)",
//     preview: "0 0 8px rgba(0, 150, 255, 0.7)"
//   },
//   {
//     id: "outline",
//     name: "Text Outline",
//     value: "1px 1px 0 rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(0, 0, 0, 0.8), 1px -1px 0 rgba(0, 0, 0, 0.8), -1px 1px 0 rgba(0, 0, 0, 0.8)",
//     preview: "1px 1px 0 rgba(0, 0, 0, 0.8)"
//   },
//   {
//     id: "elegant-text",
//     name: "Elegant Text",
//     value: "2px 2px 4px rgba(0, 0, 0, 0.2)",
//     preview: "2px 2px 4px rgba(0, 0, 0, 0.2)"
//   },
//   {
//     id: "neon-text",
//     name: "Neon Text",
//     value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff",
//     preview: "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 0, 255, 0.5)"
//   }
// ];

// const gradientPresets = [
//   {
//     id: "sunset",
//     name: "Sunset",
//     value: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
//     preview: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%)"
//   },
//   {
//     id: "ocean",
//     name: "Ocean",
//     value: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
//     preview: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
//   },
//   {
//     id: "forest",
//     name: "Forest",
//     value: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)",
//     preview: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)"
//   },
//   {
//     id: "cotton-candy",
//     name: "Cotton Candy",
//     value: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
//     preview: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)"
//   },
//   {
//     id: "radial-sun",
//     name: "Radial Sun",
//     value: "radial-gradient(circle, #f6d365 0%, #fda085 100%)",
//     preview: "radial-gradient(circle, #f6d365 0%, #fda085 100%)"
//   },
//   {
//     id: "radial-moon",
//     name: "Radial Moon",
//     value: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)",
//     preview: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)"
//   }
// ];

// const App: React.FC = () => {
//   const [hasSelectedElement, setHasSelectedElement] = useState(false);
//   const [selectedElement, setSelectedElement] = useState<any>(null);
//   const [activeTab, setActiveTab] = useState<"box" | "text" | "background">("box");
//   const [activeSubTab, setActiveSubTab] = useState<"presets" | "custom">("presets");
//   const [boxControls, setBoxControls] = useState<BoxShadowControls>(defaultBoxControls);
//   const [textControls, setTextControls] = useState<ShadowControls>(defaultTextControls);
//   const [gradientControls, setGradientControls] = useState<GradientControls>(defaultGradientControls);
//   const [isApplying, setIsApplying] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // Check for selected element on mount and set up selection listener
//   useEffect(() => {
//     const checkSelection = async () => {
//       try {
//         const element = await webflow.getSelectedElement();
//         updateSelectionState(element);
//       } catch (error) {
//         console.error("Error getting selected element:", error);
//         updateSelectionState(null);
//       }
//     };

//     // Set up selection change listener
//     const setupSelectionListener = () => {
//       if (webflow && webflow.onSelectionChange) {
//         webflow.onSelectionChange(async (elements: any[]) => {
//           if (elements && elements.length > 0) {
//             updateSelectionState(elements[0]);
//           } else {
//             updateSelectionState(null);
//           }
//         });
//       }
//     };

//     // Update selection state
//     const updateSelectionState = (element: any) => {
//       if (element) {
//         setSelectedElement(element);
//         setHasSelectedElement(true);
//       } else {
//         setSelectedElement(null);
//         setHasSelectedElement(false);
//       }
//     };

//     // Initial check
//     checkSelection();
    
//     // Set up listener
//     setupSelectionListener();

//     // Cleanup
//     return () => {
//       if (webflow && webflow.offSelectionChange) {
//         webflow.offSelectionChange(setupSelectionListener);
//       }
//     };
//   }, []);



// const applyStyle = async (property: string, value: string) => {
//   try {
//     // Always fetch the current selection
//     const element = await webflow.getSelectedElement();
//     if (!element) return;

//     setIsApplying(true);

//     // Get current styles
//     const styles = await element.getStyles();
//     let targetStyle = null;

//     for (const style of styles) {
//       const properties = await style.getProperties();
//       if (properties && property in properties) {
//         targetStyle = style;
//         break;
//       }
//     }

//     if (!targetStyle) {
//       const styleName = `${property}-${Date.now()}`;
//       targetStyle = await webflow.createStyle(styleName);
//       await targetStyle.setProperties({ [property]: value });
//       await element.setStyles([...styles, targetStyle]);
//     } else {
//       const currentProperties = await targetStyle.getProperties();
//       const newProperties = { ...currentProperties, [property]: value };
//       await targetStyle.setProperties(newProperties);
//     }

//     console.log(`Applied ${property}: ${value}`);
//   } catch (error) {
//     console.error(`Error applying ${property}:`, error);
//   } finally {
//     setIsApplying(false);
//   }
// };




//   // Apply a box shadow preset
//   const applyBoxPreset = async (preset: ShadowPreset) => {
//     await applyStyle("box-shadow", preset.value);
//   };

//   // Apply a text shadow preset
//   const applyTextPreset = async (preset: ShadowPreset) => {
//     await applyStyle("text-shadow", preset.value);
//   };

//   // Apply a gradient preset
//   const applyGradientPreset = async (preset: any) => {
//     await applyStyle("background-image", preset.value);
//   };

//   // Apply custom box shadow
//   const applyCustomBoxShadow = async () => {
//     const { x, y, blur, spread, color, opacity, inset } = boxControls;
//     const rgbColor = hexToRgb(color);
//     const shadowValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
    
//     await applyStyle("box-shadow", shadowValue);
//   };

//   // Apply custom text shadow
//   const applyCustomTextShadow = async () => {
//     const { x, y, blur, color, opacity } = textControls;
//     const rgbColor = hexToRgb(color);
//     const shadowValue = `${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
    
//     await applyStyle("text-shadow", shadowValue);
//   };

//   // Apply custom gradient
//   const applyCustomGradient = async () => {
//     const { type, angle, colors } = gradientControls;
//     const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
//     const gradientValue = `${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops})`;
    
//     await applyStyle("background-image", gradientValue);
//   };

//   // Convert hex color to RGB
//   const hexToRgb = (hex: string) => {
//     hex = hex.replace('#', '');
    
//     const r = parseInt(hex.substring(0, 2), 16);
//     const g = parseInt(hex.substring(2, 4), 16);
//     const b = parseInt(hex.substring(4, 6), 16);
    
//     return { r, g, b };
//   };

//   // Update box control value
//   const updateBoxControl = (key: keyof BoxShadowControls, value: string | number | boolean) => {
//     setBoxControls(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   // Update text control value
//   const updateTextControl = (key: keyof ShadowControls, value: string | number) => {
//     setTextControls(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   // Update gradient control value
//   const updateGradientControl = (key: keyof GradientControls, value: any) => {
//     setGradientControls(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   // Update gradient color
//   const updateGradientColor = (index: number, color: string) => {
//     const newColors = [...gradientControls.colors];
//     newColors[index].color = color;
//     updateGradientControl("colors", newColors);
//   };

//   // Add a new color to gradient
//   const addGradientColor = () => {
//     const newColors = [...gradientControls.colors, { color: "#000000", position: 100 }];
//     updateGradientControl("colors", newColors);
//   };

//   // Remove a color from gradient
//   const removeGradientColor = (index: number) => {
//     if (gradientControls.colors.length <= 2) return;
//     const newColors = [...gradientControls.colors];
//     newColors.splice(index, 1);
//     updateGradientControl("colors", newColors);
//   };

//   // Update gradient color position
//   const updateGradientPosition = (index: number, position: number) => {
//     const newColors = [...gradientControls.colors];
//     newColors[index].position = position;
//     updateGradientControl("colors", newColors);
//   };

//   // Reset controls to default
//   const resetControls = () => {
//     if (activeTab === "box") setBoxControls(defaultBoxControls);
//     if (activeTab === "text") setTextControls(defaultTextControls);
//     if (activeTab === "background") setGradientControls(defaultGradientControls);
//   };

//   // Copy CSS code to clipboard
//   const copyCSSCode = () => {
//     let cssCode = "";
    
//     if (activeTab === "box") {
//       const { x, y, blur, spread, color, opacity, inset } = boxControls;
//       const rgbColor = hexToRgb(color);
//       cssCode = `box-shadow: ${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity});`;
//     } else if (activeTab === "text") {
//       const { x, y, blur, color, opacity } = textControls;
//       const rgbColor = hexToRgb(color);
//       cssCode = `text-shadow: ${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity});`;
//     } else if (activeTab === "background") {
//       const { type, angle, colors } = gradientControls;
//       const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
//       cssCode = `background-image: ${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops});`;
//     }
    
//     navigator.clipboard.writeText(cssCode).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   if (!hasSelectedElement) {
//     return (
//       <div className="app-container">
//         <div className="app-header">
//           <div className="title-section">
//             <h2>Shadow & Gradient Presets</h2>
//             <p>Apply beautiful effects to any element</p>
//           </div>
//           <div className="icon">✨</div>
//         </div>
        
//         <div className="no-selection">
//           <div className="no-selection-icon">👉</div>
//           <h3>Select an Element</h3>
//           <p>Please select an element in Webflow Designer to apply effects.</p>
//         </div>
//       </div>
//     );
//   }

//   // Generate preview values
//   let previewValue = "";
//   let cssCode = "";
  
//   if (activeTab === "box") {
//     const { x, y, blur, spread, color, opacity, inset } = boxControls;
//     const rgbColor = hexToRgb(color);
//     previewValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
//     cssCode = `box-shadow: ${previewValue};`;
//   } else if (activeTab === "text") {
//     const { x, y, blur, color, opacity } = textControls;
//     const rgbColor = hexToRgb(color);
//     previewValue = `${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
//     cssCode = `text-shadow: ${previewValue};`;
//   } else if (activeTab === "background") {
//     const { type, angle, colors } = gradientControls;
//     const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
//     previewValue = `${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops})`;
//     cssCode = `background-image: ${previewValue};`;
//   }

//   return (
//     <div className="app-container">
//       <div className="app-header">
//         <div className="title-section">
//           <h2>Shadow & Gradient Presets</h2>
//           <p>Apply beautiful effects to any element</p>
//         </div>
//         <div className="icon">✨</div>
//       </div>

//       <div className="tabs main-tabs">
//         <button 
//           className={activeTab === "box" ? "active" : ""}
//           onClick={() => setActiveTab("box")}
//         >
//           <span className="tab-icon">🔲</span>
//           Box Shadow
//         </button>
//         <button 
//           className={activeTab === "text" ? "active" : ""}
//           onClick={() => setActiveTab("text")}
//         >
//           <span className="tab-icon">✏️</span>
//           Text Shadow
//         </button>
//         <button 
//           className={activeTab === "background" ? "active" : ""}
//           onClick={() => setActiveTab("background")}
//         >
//           <span className="tab-icon">🎨</span>
//           Background
//         </button>
//       </div>

//       <div className="tabs">
//         <button 
//           className={activeSubTab === "presets" ? "active" : ""}
//           onClick={() => setActiveSubTab("presets")}
//         >
//           <span className="tab-icon">📦</span>
//           Presets
//         </button>
//         <button 
//           className={activeSubTab === "custom" ? "active" : ""}
//           onClick={() => setActiveSubTab("custom")}
//         >
//           <span className="tab-icon">⚙️</span>
//           Custom
//         </button>
//       </div>

//       {activeSubTab === "presets" ? (
//         <div className="presets-section">
//           <h3 className="section-title">
//             {activeTab === "box" ? "Box Shadow" : 
//              activeTab === "text" ? "Text Shadow" : "Gradient"} Presets
//           </h3>
//           <div className="presets-grid">
//             {(activeTab === "box" ? boxPresets : 
//               activeTab === "text" ? textPresets : gradientPresets).map(preset => (
//               <div 
//                 key={preset.id} 
//                 className="preset-item"
//                 onClick={() => !isApplying && (
//                   activeTab === "box" ? applyBoxPreset(preset) :
//                   activeTab === "text" ? applyTextPreset(preset) :
//                   applyGradientPreset(preset)
//                 )}
//               >
//                 <div 
//                   className="preset-preview"
//                   style={activeTab === "background" ? 
//                     { backgroundImage: preset.preview } : 
//                     activeTab === "text" ? 
//                     { textShadow: preset.preview, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" } :
//                     { boxShadow: preset.preview }
//                   }
//                 >
//                   {activeTab === "text" && "Text"}
//                 </div>
//                 <p>{preset.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="custom-section">
//           <h3 className="section-title">
//             Custom {activeTab === "box" ? "Box Shadow" : 
//                   activeTab === "text" ? "Text Shadow" : "Gradient"}
//           </h3>
          
//           {activeTab === "box" && (
//             <div className="controls-grid">
//               <div className="control-group">
//                 <label>
//                   <span className="control-label">X Offset</span>
//                   <span className="control-value">{boxControls.x}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="-20" 
//                   max="20" 
//                   value={boxControls.x}
//                   onChange={e => updateBoxControl("x", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Y Offset</span>
//                   <span className="control-value">{boxControls.y}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="-20" 
//                   max="20" 
//                   value={boxControls.y}
//                   onChange={e => updateBoxControl("y", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Blur</span>
//                   <span className="control-value">{boxControls.blur}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="50" 
//                   value={boxControls.blur}
//                   onChange={e => updateBoxControl("blur", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Spread</span>
//                   <span className="control-value">{boxControls.spread}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="-20" 
//                   max="20" 
//                   value={boxControls.spread}
//                   onChange={e => updateBoxControl("spread", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group color-group">
//                 <label className="control-label">Color</label>
//                 <div className="color-input-wrapper">
//                   <input 
//                     type="color" 
//                     value={boxControls.color}
//                     onChange={e => updateBoxControl("color", e.target.value)}
//                     className="color-input"
//                   />
//                   <span className="color-value">{boxControls.color}</span>
//                 </div>
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Opacity</span>
//                   <span className="control-value">{Math.round(boxControls.opacity * 100)}%</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="100" 
//                   value={boxControls.opacity * 100}
//                   onChange={e => updateBoxControl("opacity", parseInt(e.target.value) / 100)}
//                   className="slider"
//                 />
//               </div>
//             </div>
//           )}

//           {activeTab === "text" && (
//             <div className="controls-grid">
//               <div className="control-group">
//                 <label>
//                   <span className="control-label">X Offset</span>
//                   <span className="control-value">{textControls.x}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="-10" 
//                   max="10" 
//                   value={textControls.x}
//                   onChange={e => updateTextControl("x", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Y Offset</span>
//                   <span className="control-value">{textControls.y}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="-10" 
//                   max="10" 
//                   value={textControls.y}
//                   onChange={e => updateTextControl("y", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Blur</span>
//                   <span className="control-value">{textControls.blur}px</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="20" 
//                   value={textControls.blur}
//                   onChange={e => updateTextControl("blur", parseInt(e.target.value))}
//                   className="slider"
//                 />
//               </div>

//               <div className="control-group color-group">
//                 <label className="control-label">Color</label>
//                 <div className="color-input-wrapper">
//                   <input 
//                     type="color" 
//                     value={textControls.color}
//                     onChange={e => updateTextControl("color", e.target.value)}
//                     className="color-input"
//                   />
//                   <span className="color-value">{textControls.color}</span>
//                 </div>
//               </div>

//               <div className="control-group">
//                 <label>
//                   <span className="control-label">Opacity</span>
//                   <span className="control-value">{Math.round(textControls.opacity * 100)}%</span>
//                 </label>
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="100" 
//                   value={textControls.opacity * 100}
//                   onChange={e => updateTextControl("opacity", parseInt(e.target.value) / 100)}
//                   className="slider"
//                 />
//               </div>
//             </div>
//           )}

//           {activeTab === "background" && (
//             <div className="controls-grid">
//               <div className="control-group">
//                 <label className="control-label">Gradient Type</label>
//                 <select 
//                   value={gradientControls.type}
//                   onChange={e => updateGradientControl("type", e.target.value as "linear" | "radial")}
//                   className="select-input"
//                 >
//                   <option value="linear">Linear</option>
//                   <option value="radial">Radial</option>
//                 </select>
//               </div>

//               {gradientControls.type === "linear" && (
//                 <div className="control-group">
//                   <label>
//                     <span className="control-label">Angle</span>
//                     <span className="control-value">{gradientControls.angle}°</span>
//                   </label>
//                   <input 
//                     type="range" 
//                     min="0" 
//                     max="360" 
//                     value={gradientControls.angle}
//                     onChange={e => updateGradientControl("angle", parseInt(e.target.value))}
//                     className="slider"
//                   />
//                 </div>
//               )}

//               {gradientControls.colors.map((color, index) => (
//                 <React.Fragment key={index}>
//                   <div className="control-group color-group">
//                     <label className="control-label">Color {index + 1}</label>
//                     <div className="color-input-wrapper">
//                       <input 
//                         type="color" 
//                         value={color.color}
//                         onChange={e => updateGradientColor(index, e.target.value)}
//                         className="color-input"
//                       />
//                       <span className="color-value">{color.color}</span>
//                     </div>
//                   </div>

//                   <div className="control-group">
//                     <label>
//                       <span className="control-label">Position</span>
//                       <span className="control-value">{color.position}%</span>
//                     </label>
//                     <input 
//                       type="range" 
//                       min="0" 
//                       max="100" 
//                       value={color.position}
//                       onChange={e => updateGradientPosition(index, parseInt(e.target.value))}
//                       className="slider"
//                     />
//                     {gradientControls.colors.length > 2 && (
//                       <button 
//                         onClick={() => removeGradientColor(index)}
//                         className="remove-color-button"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
//                 </React.Fragment>
//               ))}

//               <div className="control-group">
//                 <button onClick={addGradientColor} className="add-color-button">
//                   + Add Color
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === "box" && (
//             <div className="checkbox-group">
//               <label className="checkbox-label">
//                 <input 
//                   type="checkbox" 
//                   checked={boxControls.inset}
//                   onChange={e => updateBoxControl("inset", e.target.checked)}
//                   className="checkbox-input"
//                 />
//                 <span className="checkbox-custom"></span>
//                 Inset Shadow
//               </label>
//             </div>
//           )}

//           <div className="preview-section">
//             <h4>Preview</h4>
//             <div 
//               className="preview-box"
//               style={
//                 activeTab === "background" ? 
//                 { backgroundImage: previewValue } : 
//                 activeTab === "text" ? 
//                 { textShadow: previewValue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" } :
//                 { boxShadow: previewValue }
//               }
//             >
//               {activeTab === "text" ? "Text Shadow" : "Content"}
//             </div>
//           </div>

//           <div className="code-section">
//             <h4>CSS Code</h4>
//             <div className="code-block">
//               <textarea
//                 readOnly
//                 value={cssCode}
//                 onFocus={(e) => e.target.select()}
//                 className="code-textarea"
//               />
//               <p className="note">Click and press Ctrl+C / ⌘+C to copy</p>
//             </div>
//           </div>

//           <div className="actions">
//             <button onClick={resetControls} className="secondary-button">
//               Reset
//             </button>
//             <button 
//               onClick={
//                 activeTab === "box" ? applyCustomBoxShadow :
//                 activeTab === "text" ? applyCustomTextShadow :
//                 applyCustomGradient
//               }
//               disabled={isApplying}
//               className="primary-button"
//             >
//               {isApplying ? (
//                 <>
//                   <span className="spinner"></span>
//                   Applying...
//                 </>
//               ) : (
//                 `Apply ${activeTab === "box" ? "Box Shadow" : 
//                 activeTab === "text" ? "Text Shadow" : "Gradient"}`
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(<App />);














// new code



import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Webflow API is exposed globally inside Designer Extensions
declare const webflow: any;

// Define common types
interface ShadowPreset {
  id: string;
  name: string;
  value: string;
  preview: string;
}

interface ShadowControls {
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
}

interface BoxShadowControls extends ShadowControls {
  spread: number;
  inset: boolean;
}

interface GradientControls {
  type: "linear" | "radial";
  angle: number;
  colors: { color: string; position: number }[];
}

// Default controls based on the new UI's values
const defaultBoxControls: BoxShadowControls = {
  x: 10,
  y: 10,
  blur: 10,
  spread: 0,
  color: "#000000",
  opacity: 0.5,
  inset: false
};

const defaultTextControls: ShadowControls = {
  x: 0,
  y: 2,
  blur: 4,
  color: "#000000",
  opacity: 0.25
};

const defaultGradientControls: GradientControls = {
  type: "linear",
  angle: 90,
  colors: [
    { color: "#6e8efb", position: 0 },
    { color: "#a777e3", position: 100 }
  ]
};

// Predefined presets
const boxPresets: ShadowPreset[] = [
  {
    id: "soft",
    name: "Soft Shadow",
    value: "0 4px 8px rgba(0, 0, 0, 0.12)",
    preview: "0 4px 8px rgba(0, 0, 0, 0.12)"
  },
  {
    id: "medium",
    name: "Medium Shadow",
    value: "0 6px 12px rgba(0, 0, 0, 0.15)",
    preview: "0 6px 12px rgba(0, 0, 0, 0.15)"
  },
  {
    id: "hard",
    name: "Hard Shadow",
    value: "0 8px 16px rgba(0, 0, 0, 0.2)",
    preview: "0 8px 16px rgba(0, 0, 0, 0.2)"
  },
  {
    id: "inner",
    name: "Inner Shadow",
    value: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    preview: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
  },
  {
    id: "floating",
    name: "Floating",
    value: "0 10px 25px rgba(0, 0, 0, 0.15)",
    preview: "0 10px 25px rgba(0, 0, 0, 0.15)"
  },
  {
    id: "subtle",
    name: "Subtle",
    value: "0 1px 3px rgba(0, 0, 0, 0.1)",
    preview: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  {
    id: "neon",
    name: "Neon Glow",
    value: "0 0 10px rgba(0, 255, 255, 0.7)",
    preview: "0 0 10px rgba(0, 255, 255, 0.7)"
  },
  {
    id: "elegant",
    name: "Elegant",
    value: "0 15px 35px rgba(0, 0, 0, 0.1)",
    preview: "0 15px 35px rgba(0, 0, 0, 0.1)"
  }
];

const textPresets: ShadowPreset[] = [
  {
    id: "soft-text",
    name: "Soft Text",
    value: "0 1px 2px rgba(0, 0, 0, 0.2)",
    preview: "0 1px 2px rgba(0, 0, 0, 0.2)"
  },
  {
    id: "bold-text",
    name: "Bold Text",
    value: "0 2px 4px rgba(0, 0, 0, 0.3)",
    preview: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },
  {
    id: "glow",
    name: "Glow Effect",
    value: "0 0 8px rgba(0, 150, 255, 0.7)",
    preview: "0 0 8px rgba(0, 150, 255, 0.7)"
  },
  {
    id: "outline",
    name: "Text Outline",
    value: "1px 1px 0 rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(0, 0, 0, 0.8), 1px -1px 0 rgba(0, 0, 0, 0.8), -1px 1px 0 rgba(0, 0, 0, 0.8)",
    preview: "1px 1px 0 rgba(0, 0, 0, 0.8)"
  },
  {
    id: "elegant-text",
    name: "Elegant Text",
    value: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    preview: "2px 2px 4px rgba(0, 0, 0, 0.2)"
  },
  {
    id: "neon-text",
    name: "Neon Text",
    value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff",
    preview: "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 0, 255, 0.5)"
  }
];

const gradientPresets = [
  {
    id: "sunset",
    name: "Sunset",
    value: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    preview: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%)"
  },
  {
    id: "ocean",
    name: "Ocean",
    value: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    preview: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    id: "forest",
    name: "Forest",
    value: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)",
    preview: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)"
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    value: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    preview: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)"
  },
  {
    id: "radial-sun",
    name: "Radial Sun",
    value: "radial-gradient(circle, #f6d365 0%, #fda085 100%)",
    preview: "radial-gradient(circle, #f6d365 0%, #fda085 100%)"
  },
  {
    id: "radial-moon",
    name: "Radial Moon",
    value: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)",
    preview: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)"
  }
];

const App: React.FC = () => {
  const [hasSelectedElement, setHasSelectedElement] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"box" | "text" | "background">("box");
  const [activeSubTab, setActiveSubTab] = useState<"presets" | "custom">("presets");
  
  // Use a different set of default values for the new UI ranges
  const [boxControls, setBoxControls] = useState<BoxShadowControls>({
    x: 10, y: 10, blur: 10, spread: 0, color: "#000000", opacity: 0.5, inset: false
  });
  const [textControls, setTextControls] = useState<ShadowControls>({
    x: 0, y: 2, blur: 4, color: "#000000", opacity: 0.25
  });
  const [gradientControls, setGradientControls] = useState<GradientControls>(defaultGradientControls);

  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for selected element on mount and set up selection listener
  useEffect(() => {
    const onSelectionChange = (elements: any[]) => {
      const selected = elements && elements.length > 0;
      setHasSelectedElement(selected);
      setSelectedElement(selected ? elements[0] : null);
    };

    if (webflow && webflow.onSelectionChange) {
      webflow.onSelectionChange(onSelectionChange);
    }
    
    webflow.getSelectedElement().then((element: any) => {
      if (element) {
        onSelectionChange([element]);
      } else {
        onSelectionChange([]);
      }
    });

    return () => {
      if (webflow && webflow.offSelectionChange) {
        webflow.offSelectionChange(onSelectionChange);
      }
    };
  }, []);

  const applyStyle = async (property: string, value: string) => {
    const element = await webflow.getSelectedElement();
    if (!element) {
      alert("No element selected. Please select an element in the Webflow Designer.");
      return;
    }

    setIsApplying(true);
    try {
      if (!element.styles) {
        alert("This element does not support styles.");
        return;
      }

      const styles = await element.getStyles();
      let targetStyle = null;

      for (const style of styles) {
        const properties = await style.getProperties();
        if (properties && property in properties) {
          targetStyle = style;
          break;
        }
      }

      if (targetStyle) {
        const currentProperties = await targetStyle.getProperties();
        const newProperties = { ...currentProperties, [property]: value };
        await targetStyle.setProperties(newProperties);
      } else {
        let baseStyleName = property.replace('-', '_') + '_style';
        let styleName = baseStyleName;
        let count = 1;
        let nameIsUnique = false;
        
        while (!nameIsUnique) {
          try {
            const existingStyle = await webflow.getStyleByName(styleName);
            if (existingStyle) {
              styleName = `${baseStyleName}-${count}`;
              count++;
            } else {
              nameIsUnique = true;
            }
          } catch (error) {
            if (error.code === 404) {
              nameIsUnique = true;
            } else {
              console.error("Error checking for existing style:", error);
              styleName = `${property}-${Date.now()}`;
              nameIsUnique = true;
            }
          }
        }
        
        const newStyle = await webflow.createStyle(styleName);
        await newStyle.setProperties({ [property]: value });
        await element.setStyles([...styles, newStyle]);
      }
      
      console.log(`Applied ${property}: ${value}`);
    } catch (error) {
      console.error(`Error applying ${property}:`, error);
      alert(`Failed to apply the ${property}. Please try again. Check the console for details.`);
    } finally {
      setIsApplying(false);
    }
  };


  // Functions to apply presets and custom values
  const applyBoxPreset = async (preset: ShadowPreset) => {
    await applyStyle("box-shadow", preset.value);
    const [x, y, blur, spread] = preset.value.split(' ').filter(val => !isNaN(parseInt(val, 10)) && !val.includes('rgba')).map(val => parseInt(val.replace('px', ''), 10));
    const isInset = preset.value.includes('inset');
    const color = preset.value.match(/rgba?\(.*?\)/)?.[0] || "#000000";
    const opacityMatch = color.match(/[\d\.]+\)/)?.[0];
    const opacity = opacityMatch ? parseFloat(opacityMatch.replace(')', '')) : 0.25;

    setBoxControls(prev => ({
      ...prev,
      x: x || 0,
      y: y || 0,
      blur: blur || 0,
      spread: spread || 0,
      inset: isInset,
      color: hexToRgb(color).hex,
      opacity: opacity
    }));
  };

  const applyTextPreset = async (preset: ShadowPreset) => {
    await applyStyle("text-shadow", preset.value);
    const [x, y, blur] = preset.value.split(' ').filter(val => !isNaN(parseInt(val, 10)) && !val.includes('rgba')).map(val => parseInt(val.replace('px', ''), 10));
    const color = preset.value.match(/rgba?\(.*?\)/)?.[0] || "#000000";
    const opacityMatch = color.match(/[\d\.]+\)/)?.[0];
    const opacity = opacityMatch ? parseFloat(opacityMatch.replace(')', '')) : 0.25;

    setTextControls(prev => ({
      ...prev,
      x: x || 0,
      y: y || 0,
      blur: blur || 0,
      color: hexToRgb(color).hex,
      opacity: opacity
    }));
  };

  const applyGradientPreset = async (preset: any) => {
    await applyStyle("background-image", preset.value);
  };

  const applyCustomBoxShadow = async () => {
    const { x, y, blur, spread, color, opacity, inset } = boxControls;
    const rgbColor = hexToRgb(color);
    const shadowValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
    
    await applyStyle("box-shadow", shadowValue);
  };

  const applyCustomTextShadow = async () => {
    const { x, y, blur, color, opacity } = textControls;
    const rgbColor = hexToRgb(color);
    const shadowValue = `${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
    
    await applyStyle("text-shadow", shadowValue);
  };

  const applyCustomGradient = async () => {
    const { type, angle, colors } = gradientControls;
    const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
    const gradientValue = `${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops})`;
    
    await applyStyle("background-image", gradientValue);
  };

  const hexToRgb = (hex: string) => {
    if (hex.startsWith('#')) {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return { r, g, b, hex };
    } else if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
      const parts = hex.match(/\d+/g);
      if (!parts || parts.length < 3) return { r: 0, g: 0, b: 0, hex: '#000000' };
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      return { r, g, b, hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}` };
    }
    return { r: 0, g: 0, b: 0, hex: '#000000' };
  };

  const updateBoxControl = (key: keyof BoxShadowControls, value: string | number | boolean) => {
    setBoxControls(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateTextControl = (key: keyof ShadowControls, value: string | number) => {
    setTextControls(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateGradientControl = (key: keyof GradientControls, value: any) => {
    setGradientControls(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateGradientColor = (index: number, color: string) => {
    const newColors = [...gradientControls.colors];
    newColors[index].color = color;
    updateGradientControl("colors", newColors);
  };

  const addGradientColor = () => {
    const newColors = [...gradientControls.colors, { color: "#000000", position: 100 }];
    updateGradientControl("colors", newColors);
  };

  const removeGradientColor = (index: number) => {
    if (gradientControls.colors.length <= 2) return;
    const newColors = [...gradientControls.colors];
    newColors.splice(index, 1);
    updateGradientControl("colors", newColors);
  };

  const updateGradientPosition = (index: number, position: number) => {
    const newColors = [...gradientControls.colors];
    newColors[index].position = position;
    updateGradientControl("colors", newColors);
  };

  const resetControls = () => {
    if (activeTab === "box") setBoxControls(defaultBoxControls);
    if (activeTab === "text") setTextControls(defaultTextControls);
    if (activeTab === "background") setGradientControls(defaultGradientControls);
  };

  const copyCSSCode = () => {
    let cssCode = "";
    
    if (activeTab === "box") {
      const { x, y, blur, spread, color, opacity, inset } = boxControls;
      const rgbColor = hexToRgb(color);
      cssCode = `box-shadow: ${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity});`;
    } else if (activeTab === "text") {
      const { x, y, blur, color, opacity } = textControls;
      const rgbColor = hexToRgb(color);
      cssCode = `text-shadow: ${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity});`;
    } else if (activeTab === "background") {
      const { type, angle, colors } = gradientControls;
      const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
      cssCode = `background-image: ${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops});`;
    }
    
    navigator.clipboard.writeText(cssCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generatePreview = () => {
    if (activeTab === "box") {
      const { x, y, blur, spread, color, opacity, inset } = boxControls;
      const rgbColor = hexToRgb(color);
      const style = {
        boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`,
        backgroundImage: 'none',
        textShadow: 'none'
      };
      const code = `box-shadow: ${style.boxShadow};`;
      return { style, code, text: null };
    } else if (activeTab === "text") {
      const { x, y, blur, color, opacity } = textControls;
      const rgbColor = hexToRgb(color);
      const style = {
        textShadow: `${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`,
        boxShadow: 'none',
        backgroundImage: 'none'
      };
      const code = `text-shadow: ${style.textShadow};`;
      return { style, code, text: "Text" };
    } else { // background
      const { type, angle, colors } = gradientControls;
      const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
      const gradientValue = `${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops})`;
      const style = {
        backgroundImage: gradientValue,
        boxShadow: 'none',
        textShadow: 'none'
      };
      const code = `background-image: ${gradientValue};`;
      return { style, code, text: null };
    }
  };

  const { style: previewStyle, text: previewTextContent, code: cssCode } = generatePreview();

  if (!hasSelectedElement) {
    return (
      <div className="w-[320px] h-[500px] bg-white shadow-xl overflow-hidden flex flex-col">
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <div className="space-y-2">
            <div className="text-4xl">👉</div>
            <h3 className="font-semibold text-lg">Select an Element</h3>
            <p className="text-sm text-gray-500">Please select an element in Webflow Designer to apply effects.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] h-[500px] bg-white shadow-xl overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="p-1 bg-gray-100">
        <div className="grid grid-cols-3 gap-1">
          <button 
            id="tab-box" 
            className={`tab-btn py-1 text-xs rounded-md transition-colors ${activeTab === 'box' ? 'bg-blue-200 text-blue-700 font-semibold' : 'text-gray-500 hover:text-blue-600'}`} 
            onClick={() => setActiveTab('box')}
          >
            Box Shadow
          </button>
          <button 
            id="tab-text" 
            className={`tab-btn py-1 text-xs rounded-md transition-colors ${activeTab === 'text' ? 'bg-blue-200 text-blue-700 font-semibold' : 'text-gray-500 hover:text-blue-600'}`} 
            onClick={() => setActiveTab('text')}
          >
            Text Shadow
          </button>
          <button 
            id="tab-bg" 
            className={`tab-btn py-1 text-xs rounded-md transition-colors ${activeTab === 'background' ? 'bg-blue-200 text-blue-700 font-semibold' : 'text-gray-500 hover:text-blue-600'}`} 
            onClick={() => setActiveTab('background')}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center flex-shrink-0 h-32 bg-gray-200 m-2">
        <div 
          id="previewBox" 
          className="w-24 h-24 bg-white rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-semibold"
          style={previewStyle}
        >
          {previewTextContent && <span id="previewText">{previewTextContent}</span>}
        </div>
      </div>

      {/* Presets / Custom */}
      <div className="flex gap-1 m-2">
        <button 
          id="btn-presets" 
          className={`flex-1 py-1 text-xs rounded shadow transition-colors ${activeSubTab === 'presets' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`} 
          onClick={() => setActiveSubTab('presets')}
        >
          Presets
        </button>
        <button 
          id="btn-custom" 
          className={`flex-1 py-1 text-xs rounded shadow transition-colors ${activeSubTab === 'custom' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}
          onClick={() => setActiveSubTab('custom')}
        >
          Custom
        </button>
      </div>

      {/* Controls (scrollable) */}
      <section id="controls" className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
        {activeSubTab === 'presets' ? (
          <div id="presetsGrid" className="grid grid-cols-3 gap-2">
            {(activeTab === "box" ? boxPresets : 
              activeTab === "text" ? textPresets : gradientPresets).map(preset => (
              <button
                key={preset.id}
                className="preset-card p-1 rounded-lg bg-white border hover:shadow-md transition-shadow"
                onClick={() => {
                  if (activeTab === 'box') applyBoxPreset(preset);
                  else if (activeTab === 'text') applyTextPreset(preset);
                  else if (activeTab === 'background') applyGradientPreset(preset);
                }}
              >
                <div 
                  className="h-12 rounded-md w-full flex items-center justify-center text-[11px]"
                  style={activeTab === 'box' ? {boxShadow: preset.preview} : activeTab === 'text' ? {textShadow: preset.preview} : {backgroundImage: preset.preview}}
                >
                  {activeTab === 'text' && 'Text'}
                </div>
                <div className="mt-1 text-[11px] text-center">{preset.name}</div>
              </button>
            ))}
          </div>
        ) : (
          <div id="customControls" className="space-y-2">
            {activeTab === 'box' && (
              <>
                <div id="insetRow" className="flex items-center gap-2 mb-2">
                  <span className="w-12 text-[11px] text-center">Outset</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id="insetToggle" 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={boxControls.inset}
                      onChange={e => updateBoxControl('inset', e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-all"></div>
                  </label>
                  <span className="w-12 text-[11px] text-center">Inset</span>
                </div>
                <div id="boxControls" className="space-y-2">
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="xOffset" className="slider-label w-[55px] text-[11px]">X Offset</label>
                    <input type="range" id="xOffset" min="-100" max="100" value={boxControls.x} onChange={e => updateBoxControl('x', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.x}</div>
                  </div>
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="yOffset" className="slider-label w-[55px] text-[11px]">Y Offset</label>
                    <input type="range" id="yOffset" min="-100" max="100" value={boxControls.y} onChange={e => updateBoxControl('y', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.y}</div>
                  </div>
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="blur" className="slider-label w-[55px] text-[11px]">Blur</label>
                    <input type="range" id="blur" min="0" max="100" value={boxControls.blur} onChange={e => updateBoxControl('blur', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.blur}</div>
                  </div>
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="spread" className="slider-label w-[55px] text-[11px]">Spread</label>
                    <input type="range" id="spread" min="-50" max="50" value={boxControls.spread} onChange={e => updateBoxControl('spread', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.spread}</div>
                  </div>
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="opacity" className="slider-label w-[55px] text-[11px]">Opacity</label>
                    <input type="range" id="opacity" min="0" max="1" step="0.01" value={boxControls.opacity} onChange={e => updateBoxControl('opacity', parseFloat(e.target.value))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.opacity.toFixed(2)}</div>
                  </div>
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label htmlFor="shadowColor" className="slider-label w-[55px] text-[11px]">Color</label>
                    <input type="color" id="shadowColor" value={boxControls.color} onChange={e => updateBoxControl('color', e.target.value)} className="h-8 w-10 border-0" />
                    <div className="ml-2 text-[11px]">{boxControls.color}</div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'text' && (
              <div id="textControls" className="space-y-2">
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">X Offset</label>
                  <input type="range" id="textX" min="-20" max="20" value={textControls.x} onChange={e => updateTextControl('x', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.x}</div>
                </div>
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">Y Offset</label>
                  <input type="range" id="textY" min="-20" max="20" value={textControls.y} onChange={e => updateTextControl('y', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.y}</div>
                </div>
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">Blur</label>
                  <input type="range" id="textBlur" min="0" max="20" value={textControls.blur} onChange={e => updateTextControl('blur', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.blur}</div>
                </div>
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">Color</label>
                  <input type="color" id="textColor" value={textControls.color} onChange={e => updateTextControl('color', e.target.value)} className="h-8 w-10 border-0" />
                </div>
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">Opacity</label>
                  <input type="range" id="textOpacity" min="0" max="1" step="0.01" value={textControls.opacity} onChange={e => updateTextControl('opacity', parseFloat(e.target.value))} className="slider-input flex-1" />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.opacity.toFixed(2)}</div>
                </div>
              </div>
            )}
            {activeTab === 'background' && (
              <div id="bgControls" className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded shadow-sm">
                  <label className="w-[90px] text-[11px]">Gradient Type</label>
                  <select 
                    id="gradType" 
                    className="flex-1 text-xs border rounded px-2 py-1"
                    value={gradientControls.type}
                    onChange={e => updateGradientControl('type', e.target.value)}
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
                {gradientControls.type === 'linear' && (
                  <div id="angleRow" className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label className="w-[55px] text-[11px]">Angle</label>
                    <input type="range" id="gradAngle" min="0" max="360" value={gradientControls.angle} onChange={e => updateGradientControl('angle', parseInt(e.target.value, 10))} className="slider-input flex-1" />
                    <div className="slider-value w-[30px] text-right text-[11px]">{gradientControls.angle}°</div>
                  </div>
                )}
                <div id="gradColors" className="space-y-1">
                  {gradientControls.colors.map((colorStop, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-1 rounded shadow-sm">
                      <label className="w-[60px] text-[11px]">Color {index + 1}</label>
                      <input type="color" className="grad-color" value={colorStop.color} onChange={e => updateGradientColor(index, e.target.value)} />
                      <input type="range" min="0" max="100" value={colorStop.position} onChange={e => updateGradientPosition(index, parseInt(e.target.value, 10))} className="grad-pos flex-1" />
                      <div className="w-[36px] text-[11px] text-right">{colorStop.position}%</div>
                      {gradientControls.colors.length > 2 && (
                        <button className="ml-2 text-[11px] px-2 py-1 rounded border remove-grad" onClick={() => removeGradientColor(index)}>Remove</button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <button id="addGradColor" className="w-full text-xs py-1 rounded border hover:bg-gray-100" onClick={addGradientColor}>+ Add Color</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Generated CSS */}
      <div className="bg-gray-100 text-xs font-mono p-2 mx-3 border code-scroll" style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
        <code id="generatedCode">{cssCode}</code>
      </div>

      {/* Footer */}
      <footer className="p-2 bg-gray-900 text-white flex gap-1">
        <button 
          id="resetButton" 
          className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
          onClick={resetControls}
        >
          Reset
        </button>
        <button 
          id="copyButton" 
          className={`flex-1 py-1 text-xs rounded hover:bg-blue-700 transition-colors ${copied ? 'bg-green-600' : 'bg-blue-600'}`}
          onClick={copyCSSCode}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button 
          id="applyButton" 
          className={`flex-1 py-1 text-xs bg-green-600 rounded hover:bg-green-700`}
          onClick={() => {
            if (activeTab === 'box') applyCustomBoxShadow();
            else if (activeTab === 'text') applyCustomTextShadow();
            else if (activeTab === 'background') applyCustomGradient();
          }}
          disabled={isApplying}
        >
          {isApplying ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
              Applying...
            </span>
          ) : (
            'Apply'
          )}
        </button>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);