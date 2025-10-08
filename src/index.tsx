import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";

declare const webflow: any;

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

interface GradientPreset extends ShadowPreset { }

const DEFAULT_BOX_CONTROLS: BoxShadowControls = {
  x: 10,
  y: 10,
  blur: 10,
  spread: 0,
  color: "#000000",
  opacity: 0.5,
  inset: false
};

const DEFAULT_TEXT_CONTROLS: ShadowControls = {
  x: 0,
  y: 2,
  blur: 4,
  color: "#000000",
  opacity: 0.25
};

const DEFAULT_GRADIENT_CONTROLS: GradientControls = {
  type: "linear",
  angle: 90,
  colors: [
    { color: "#6e8efb", position: 0 },
    { color: "#a777e3", position: 100 }
  ]
};

const BOX_PRESETS: ShadowPreset[] = [
  { id: "soft", name: "Soft", value: "0 4px 8px rgba(0, 0, 0, 0.25)", preview: "0 4px 8px rgba(0, 0, 0, 0.25)" },
  { id: "medium", name: "Medium", value: "0 6px 12px rgba(0, 0, 0, 0.35)", preview: "0 6px 12px rgba(0, 0, 0, 0.35)" },
  { id: "hard", name: "Hard", value: "0 8px 16px rgba(0, 0, 0, 0.45)", preview: "0 8px 16px rgba(0, 0, 0, 0.45)" },
  { id: "inner", name: "Inner", value: "inset 0 2px 6px rgba(0, 0, 0, 0.35)", preview: "inset 0 2px 6px rgba(0, 0, 0, 0.35)" },
  { id: "floating", name: "Floating", value: "0 12px 30px rgba(0, 0, 0, 0.4)", preview: "0 12px 30px rgba(0, 0, 0, 0.4)" },
  { id: "subtle", name: "Subtle", value: "0 2px 4px rgba(0, 0, 0, 0.2)", preview: "0 2px 4px rgba(0, 0, 0, 0.2)" },
  { id: "light-inset", name: "Light Inset", value: "rgb(230,230,230) 0px 55px 25px -25px inset", preview: "rgb(230,230,230) 0px 55px 25px -25px inset" },
  { id: "elegant", name: "Elegant", value: "0 18px 40px rgba(0, 0, 0, 0.35)", preview: "0 18px 40px rgba(0, 0, 0, 0.35)" },
  { id: "soft-dark", name: "Soft Dark", value: "rgba(0,0,0,0.357) 1.6px 1.6px 3.2px 0px", preview: "rgba(0,0,0,0.357) 1.6px 1.6px 3.2px 0px" },
  { id: "dark-shadow", name: "Dark Shadow", value: "rgba(0,0,0,0.8) 4px 4px 10px 0px", preview: "rgba(0,0,0,0.8) 4px 4px 10px 0px" },
  { id: "double-glow", name: "Double Glow", value: "0 3px 9px 4px rgba(200,85,238,0.56)", preview: "0 3px 9px 4px rgba(200,85,238,0.56)" },
  { id: "green-glow", name: "Green Glow", value: "0 4px 28px 0 rgba(26,188,72,0.5)", preview: "0 4px 28px 0 rgba(26,188,72,0.5)" },
  { id: "blue-glow", name: "Blue Glow", value: "0 0 10px 10px #5b95e5", preview: "0 0 10px 10px #5b95e5" },
  { id: "inner-red", name: "Inner Red", value: "inset 0 0 10px 7px #ff0000, 0 0 0 currentColor, 0 0 0 currentColor", preview: "inset 0 0 10px 7px #ff0000, 0 0 0 currentColor, 0 0 0 currentColor" },
  { id: "blue", name: "Blue", value: "2px 29px 29px -1px rgba(94, 120, 179, 0.53)", preview: "2px 29px 29px -1px rgba(94, 120, 179, 0.53)" },
  { id: "multi-color", name: "Multi Color", value: "14px 3px 10px 5px #f4eb0d50, -1px -12px 10px 5px #0deebf50, -10px 12px 10px 5px #ee0d4350", preview: "14px 3px 10px 5px #f4eb0d50, -1px -12px 10px 5px #0deebf50, -10px 12px 10px 5px #ee0d4350" },
  { id: "blue-outline", name: "Blue Outline", value: "rgba(16,155,172,0.2) 0px 0px 0px 2px", preview: "rgba(16,155,172,0.2) 0px 0px 0px 2px" },
  { id: "orange-outline", name: "Orange Outline", value: "rgba(202,74,31,0.12) 0px 0px 0px 7.58316px", preview: "rgba(202,74,31,0.12) 0px 0px 0px 7.58316px" },
  { id: "double-border", name: "Double Border", value: "rgb(195,196,199) 0px 0px 0px 1px,rgba(0,0,0,0.07) 0px 2px 4px 0px", preview: "rgb(195,196,199) 0px 0px 0px 1px,rgba(0,0,0,0.07) 0px 2px 4px 0px" },
  { id: "orange-border", name: "Orange Border", value: "rgb(226,119,48) 0px 0px 0px 2px,rgba(0,0,0,0.15) 0px 2px 4px 0px", preview: "rgb(226,119,48) 0px 0px 0px 2px,rgba(0,0,0,0.15) 0px 2px 4px 0px" },
  { id: "cyan-outline", name: "Cyan Outline", value: "rgb(51,180,206) 0px 0px 0px 4px", preview: "rgb(51,180,206) 0px 0px 0px 4px" },
  { id: "double-outline", name: "Double Outline", value: "rgb(30,30,30) 0px 0px 0px 3px,rgb(0,124,186) 0px 0px 0px 6px", preview: "rgb(30,30,30) 0px 0px 0px 3px,rgb(0,124,186) 0px 0px 0px 6px" },
  { id: "complex-multi", name: "Complex Multi", value: "rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgb(255,255,255) 0px 1px 0px 0px inset,rgba(213,217,232,0.88) 0px 0px 0px 1px,rgba(29,33,48,0.04) 0px 5px 5px -2.5px,rgba(255,129,112,0.16) 0px 10px 10px -5px,rgba(255,129,112,0.08) 0px 24px 24px -8px", preview: "rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgb(255,255,255) 0px 1px 0px 0px inset,rgba(213,217,232,0.88) 0px 0px 0px 1px,rgba(29,33,48,0.04) 0px 5px 5px -2.5px,rgba(255,129,112,0.16) 0px 10px 10px -5px,rgba(255,129,112,0.08) 0px 24px 24px -8px" },
  { id: "orange-inset", name: "Orange Inset", value: "rgb(248,161,0) 0px 0px 10px 0px inset", preview: "rgb(248,161,0) 0px 0px 10px 0px inset" },
  { id: "glow-combo", name: "Glow Combo", value: "0 0 2px 0 #000000, 0 0 0 currentColor,inset 0 0 16px currentColor", preview: "0 0 2px 0 #000000, 0 0 0 currentColor,inset 0 0 16px currentColor" },
  { id: "top-dark", name: "Top Dark", value: "rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgb(17,17,17) 0px -12px 16px 0px", preview: "rgba(0,0,0,0) 0px 0px 0px 0px,rgba(0,0,0,0) 0px 0px 0px 0px,rgb(17,17,17) 0px -12px 16px 0px" },
  { id: "dark-deep", name: "Dark Deep", value: "rgb(4,0,17) 0px 0px 300px 0px inset", preview: "rgb(4,0,17) 0px 0px 300px 0px inset" }
];

const TEXT_PRESETS: ShadowPreset[] = [
  { id: "soft-text", name: "Soft Text", value: "0 1px 2px rgba(0, 0, 0, 0.35)", preview: "0 1px 2px rgba(0, 0, 0, 0.35)" },
  { id: "bold-text", name: "Bold Text", value: "0 2px 4px rgba(0, 0, 0, 0.45)", preview: "0 2px 4px rgba(0, 0, 0, 0.45)" },
  { id: "glow", name: "Glow Effect", value: "0 0 8px rgba(0, 150, 255, 0.85)", preview: "0 0 8px rgba(0, 150, 255, 0.85)" },
  { id: "outline", name: "Text Outline", value: "1px 1px 0 rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(0, 0, 0, 0.8), 1px -1px 0 rgba(0, 0, 0, 0.8), -1px 1px 0 rgba(0, 0, 0, 0.8)", preview: "1px 1px 0 rgba(0, 0, 0, 0.8)" },
  { id: "elegant-text", name: "Elegant Text", value: "2px 2px 4px rgba(0, 0, 0, 0.2)", preview: "2px 2px 4px rgba(0, 0, 0, 0.2)" },
  { id: "neon-text", name: "Neon Text", value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff", preview: "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 0, 255, 0.5)" },
  { id: "Distant-text", name: "Distant Text", value: "0px 3px 0px #b2a98f, 0px 14px 10px rgba(0,0,0,0.15), 0px 24px 2px rgba(0,0,0,0.1), 0px 24px 30px rgba(0,0,0,0.1)", preview: "0px 3px 0px #b2a98f, 0px 14px 10px rgba(0,0,0,0.15), 0px 24px 2px rgba(0,0,0,0.1), 0px 24px 30px rgba(0,0,0,0.1)" },
  { id: "Heavy-text", name: "Heavy Text", value: "0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)", preview: "0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)" },
  { id: "seventies-style", name: "70's Style Text", value: "-10px 10px 0px #00e6e6", preview: "-10px 10px 0px #00e6e6" },
  { id: "multiple-light", name: "Multiple Light", value: "0px 15px 5px rgba(0,0,0,0.1), 10px 20px 5px rgba(0,0,0,0.05), -10px 20px 5px rgba(0,0,0,0.05)", preview: "0px 15px 5px rgba(0,0,0,0.1), 10px 20px 5px rgba(0,0,0,0.05), -10px 20px 5px rgba(0,0,0,0.05)" }
];

const GRADIENT_PRESETS: GradientPreset[] = [
  { id: "sunset", name: "Sunset", value: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", preview: "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%)" },
  { id: "ocean", name: "Ocean", value: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)", preview: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "forest", name: "Forest", value: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)", preview: "linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)" },
  { id: "cotton-candy", name: "Cotton Candy", value: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", preview: "linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)" },
  { id: "radial-sun", name: "Radial Sun", value: "radial-gradient(circle, #f6d365 0%, #fda085 100%)", preview: "radial-gradient(circle, #f6d365 0%, #fda085 100%)" },
  { id: "radial-moon", name: "Radial Moon", value: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)", preview: "radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)" },
  { id: "fresh-green", name: "Fresh Green", value: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", preview: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)" },
  { id: "cool-gray", name: "Cool Gray", value: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)", preview: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)" },
  { id: "ocean-deep", name: "Ocean Deep", value: "linear-gradient(to top, #30cfd0 0%, #330867 100%)", preview: "linear-gradient(to top, #30cfd0 0%, #330867 100%)" },
  { id: "sunny-sky", name: "Sunny Sky", value: "linear-gradient(to top, #fddb92 0%, #d1fdff 100%)", preview: "linear-gradient(to top, #fddb92 0%, #d1fdff 100%)" },
  { id: "purple-blue", name: "Purple Blue", value: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)", preview: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)" },
  { id: "rainbow-pastel", name: "Rainbow Pastel", value: "linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)", preview: "linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)" },
  { id: "multicolor-blend", name: "Multicolor Blend", value: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)", preview: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)" },
  { id: "purple-mono", name: "Purple Mono", value: "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)", preview: "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)" },
  { id: "pink-coral", name: "Pink Coral", value: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)", preview: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)" },
  { id: "olive-gold", name: "Olive Gold", value: "linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)", preview: "linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)" },
  { id: "blue-sky", name: "Blue Sky", value: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)", preview: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)" },
  { id: "neon-mix", name: "Neon Mix", value: "linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)", preview: "linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)" }
];

const App: React.FC = () => {
  const [hasSelectedElement, setHasSelectedElement] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"box" | "text" | "background">("box");
  const [activeSubTab, setActiveSubTab] = useState<"presets" | "custom">("presets");
  const [boxControls, setBoxControls] = useState<BoxShadowControls>(DEFAULT_BOX_CONTROLS);
  const [textControls, setTextControls] = useState<ShadowControls>(DEFAULT_TEXT_CONTROLS);
  const [gradientControls, setGradientControls] = useState<GradientControls>(DEFAULT_GRADIENT_CONTROLS);
  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkApiReady = useCallback(() =>
    typeof webflow !== "undefined" && webflow && typeof webflow.getSelectedElement === "function", []);

  useEffect(() => {
    let stopped = false;
    let timer: NodeJS.Timeout;

    const tick = async () => {
      try {
        if (!checkApiReady()) {
          if (!stopped) timer = setTimeout(tick, 300);
          return;
        }

        const element = await webflow.getSelectedElement();
        const hasElement = !!element;

        setHasSelectedElement(hasElement);
        setSelectedElement(hasElement ? element : null);
      } catch (error) {
        setHasSelectedElement(false);
        setSelectedElement(null);
      } finally {
        if (!stopped) timer = setTimeout(tick, 400);
      }
    };

    tick();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [checkApiReady]);

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
      let stylesArray = [];

      if (Array.isArray(styles)) {
        stylesArray = styles;
      } else if (styles && typeof styles[Symbol.iterator] === 'function') {
        stylesArray = Array.from(styles);
      } else {
        stylesArray = [];
      }

      let targetStyle = null;
      let existingStyleWithProperty = null;

      for (const style of stylesArray) {
        const properties = await style.getProperties();
        if (properties && property in properties) {
          existingStyleWithProperty = style;
          break;
        }
      }

      if (existingStyleWithProperty) {
        targetStyle = existingStyleWithProperty;
      } else if (stylesArray.length === 1) {
        targetStyle = stylesArray[0];
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
          } catch (error: any) {
            if (error.code === 404) {
              nameIsUnique = true;
            } else {
              styleName = `${property}-${Date.now()}`;
              nameIsUnique = true;
            }
          }
        }

        const newStyle = await webflow.createStyle(styleName);
        await newStyle.setProperties({ [property]: value });

        const updatedStyles = [...stylesArray, newStyle];
        await element.setStyles(updatedStyles);
        targetStyle = newStyle;
      }

      if (targetStyle) {
        const currentProperties = await targetStyle.getProperties();
        const newProperties = { ...currentProperties, [property]: value };
        await targetStyle.setProperties(newProperties);
      }
    } catch (error) {
      alert(`Failed to apply the ${property}. Please try again.`);
    } finally {
      setIsApplying(false);
    }
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

  const applyGradientPreset = async (preset: GradientPreset) => {
    await applyStyle("background-image", preset.value);

    const isLinear = preset.value.includes('linear-gradient');
    const gradientContent = preset.value.split('(')[1]?.split(')')[0];
    const colorStops = gradientContent ? gradientContent.split(',') : [];
    const colors = [];

    for (const stop of colorStops) {
      const trimmedStop = stop.trim();
      const colorMatch = trimmedStop.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)|rgba\([^)]+\)/);
      const positionMatch = trimmedStop.match(/(\d+)%/);

      if (colorMatch) {
        const color = colorMatch[0];
        const position = positionMatch ? parseInt(positionMatch[1]) : colors.length * 50;
        colors.push({ color, position });
      }
    }

    if (colors.length === 0) {
      colors.push(
        { color: "#6e8efb", position: 0 },
        { color: "#a777e3", position: 100 }
      );
    }

    let angle = 90;
    if (isLinear) {
      const angleMatch = preset.value.match(/linear-gradient\((\d+)deg/);
      angle = angleMatch ? parseInt(angleMatch[1]) : 90;
    }

    setGradientControls({
      type: isLinear ? "linear" : "radial",
      angle: angle,
      colors: colors
    });
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

  const updateBoxControl = (key: keyof BoxShadowControls, value: string | number | boolean) => {
    setBoxControls(prev => ({ ...prev, [key]: value }));
  };

  const updateTextControl = (key: keyof ShadowControls, value: string | number) => {
    setTextControls(prev => ({ ...prev, [key]: value }));
  };

  const updateGradientControl = (key: keyof GradientControls, value: any) => {
    setGradientControls(prev => ({ ...prev, [key]: value }));
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

  const resetControls = async () => {
    if (!selectedElement) return;

    setIsApplying(true);
    try {
      if (activeTab === "box") {
        setBoxControls(DEFAULT_BOX_CONTROLS);
        await applyStyle("box-shadow", "none");
      } else if (activeTab === "text") {
        setTextControls(DEFAULT_TEXT_CONTROLS);
        await applyStyle("text-shadow", "none");
      } else if (activeTab === "background") {

        setGradientControls({
          type: "linear",
          angle: 90,
          colors: [
            { color: "#6e8efb", position: 0 },
            { color: "#a777e3", position: 100 }
          ]
        });
        await applyStyle("background-image", "none");
      }
    } catch (error) {
      alert("Failed to reset. Please try again.");
    } finally {
      setIsApplying(false);
    }
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

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cssCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = cssCode;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          alert("Failed to copy CSS. Please copy manually.");
        }
        document.body.removeChild(textarea);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = cssCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      return { style, code, text: "Webflow" };
    } else if (activeTab === "text") {
      const { x, y, blur, color, opacity } = textControls;
      const rgbColor = hexToRgb(color);
      const style = {
        textShadow: `${x}px ${y}px ${blur}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`,
        boxShadow: 'none',
        backgroundImage: 'none'
      };
      const code = `text-shadow: ${style.textShadow};`;
      return { style, code, text: "Webflow" };
    } else {
      const { type, angle, colors } = gradientControls;
      const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
      const gradientValue = `${type}-gradient(${type === 'linear' ? `${angle}deg` : 'circle'}, ${colorStops})`;
      const style = {
        backgroundImage: gradientValue,
        boxShadow: 'none',
        textShadow: 'none'
      };
      const code = `background-image: ${gradientValue};`;
      return { style, code, text: "Webflow" };
    }
  };

  const { style: previewStyle, text: previewTextContent } = generatePreview();

  if (!hasSelectedElement) {
    return (
      <div className="h-[460px] bg-white shadow-xl overflow-hidden flex flex-col">
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

  const currentPresets = activeTab === "box" ? BOX_PRESETS : activeTab === "text" ? TEXT_PRESETS : GRADIENT_PRESETS;

  return (
    <div className="h-[460px] bg-white shadow-xl overflow-hidden flex flex-col">
      <div className="p-1 bg-gray-100">
        <div className="grid grid-cols-3 gap-1">
          {(["box", "text", "background"] as const).map(tab => (
            <button
              key={tab}
              className={`tab-btn py-1 text-xs rounded-md transition-colors ${activeTab === tab ? 'bg-blue-200 text-blue-700 font-semibold' : 'text-gray-500 hover:text-blue-600'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "box" ? "Box Shadow" : tab === "text" ? "Text Shadow" : "Gradient"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center flex-shrink-0 h-40 bg-gray-200 m-2 p-4 overflow-hidden">
        <div
          className="w-24 h-24 bg-white rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-semibold"
          style={previewStyle}
        >
          <span>{previewTextContent}</span>
        </div>
      </div>

      <div className="flex gap-1 m-2">
        {(["presets", "custom"] as const).map(subTab => (
          <button
            key={subTab}
            className={`flex-1 py-1 text-xs rounded shadow transition-colors ${activeSubTab === subTab ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'
              }`}
            onClick={() => setActiveSubTab(subTab)}
          >
            {subTab === "presets" ? "Presets" : "Custom"}
          </button>
        ))}
      </div>

      <section className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
        {activeSubTab === 'presets' ? (
          <div className="grid grid-cols-3 gap-2 overflow-hidden">
            {currentPresets.map(preset => (
              <div key={preset.id} className="overflow-hidden rounded-lg">
                <button
                  className="preset-card p-1 bg-white border border-gray-200 border-solid hover:shadow-md transition-shadow w-full h-full"
                  onClick={() => {
                    if (activeTab === 'box') applyBoxPreset(preset);
                    else if (activeTab === 'text') applyTextPreset(preset);
                    else if (activeTab === 'background') applyGradientPreset(preset);
                  }}
                >
                  <div
                    className="h-16 rounded-md flex items-center justify-center text-[11px] mx-auto"
                    style={
                      activeTab === 'box' ? { boxShadow: preset.preview, width: '80%' } :
                        activeTab === 'text' ? { textShadow: preset.preview, width: '80%' } :
                          { backgroundImage: preset.preview, width: '80%' }
                    }
                  >
                    {activeTab === 'text' && 'Webflow'}
                  </div>
                  <div className="mt-1 text-[11px] text-center px-1">{preset.name}</div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === 'box' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-12 text-[11px] text-center">Outset</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
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
                <div className="space-y-2">
                  {[
                    { id: "xOffset", label: "X Offset", key: "x" as const, min: -100, max: 100, value: boxControls.x },
                    { id: "yOffset", label: "Y Offset", key: "y" as const, min: -100, max: 100, value: boxControls.y },
                    { id: "blur", label: "Blur", key: "blur" as const, min: 0, max: 100, value: boxControls.blur },
                    { id: "spread", label: "Spread", key: "spread" as const, min: -50, max: 50, value: boxControls.spread }
                  ].map(({ id, label, key, min, max, value }) => (
                    <div key={id} className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                      <label className="slider-label w-[55px] text-[11px]">{label}</label>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={e => updateBoxControl(key, parseInt(e.target.value, 10))}
                        className="slider-input flex-1"
                      />
                      <div className="slider-value w-[30px] text-right text-[11px]">{value}</div>
                    </div>
                  ))}
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label className="slider-label w-[55px] text-[11px]">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={boxControls.opacity}
                      onChange={e => updateBoxControl('opacity', parseFloat(e.target.value))}
                      className="slider-input flex-1"
                    />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.opacity.toFixed(2)}</div>
                  </div>
                  <div className="slider-container flex items-center gap-2">
                    <label className="slider-label text-[11px]">Color</label>
                    <input
                      type="color"
                      value={boxControls.color}
                      onChange={e => updateBoxControl('color', e.target.value)}
                      className="color-input"
                    />
                    <div className="ml-2 text-sm text-gray-700">{boxControls.color}</div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'text' && (
              <div className="space-y-2">
                {[
                  { id: "textX", label: "X Offset", key: "x" as const, min: -20, max: 20, value: textControls.x },
                  { id: "textY", label: "Y Offset", key: "y" as const, min: -20, max: 20, value: textControls.y },
                  { id: "textBlur", label: "Blur", key: "blur" as const, min: 0, max: 20, value: textControls.blur }
                ].map(({ id, label, key, min, max, value }) => (
                  <div key={id} className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label className="slider-label w-[55px] text-[11px]">{label}</label>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      onChange={e => updateTextControl(key, parseInt(e.target.value, 10))}
                      className="slider-input flex-1"
                    />
                    <div className="slider-value w-[30px] text-right text-[11px]">{value}</div>
                  </div>
                ))}
                <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                  <label className="slider-label w-[55px] text-[11px]">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={textControls.opacity}
                    onChange={e => updateTextControl('opacity', parseFloat(e.target.value))}
                    className="slider-input flex-1"
                  />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.opacity.toFixed(2)}</div>
                </div>
                <div className="slider-container flex items-center gap-2">
                  <label className="slider-label text-[11px]">Color</label>
                  <input
                    type="color"
                    value={textControls.color}
                    onChange={e => updateTextControl('color', e.target.value)}
                    className="color-input"
                  />
                  <div className="ml-2 text-sm text-gray-700">{textControls.color}</div>
                </div>
              </div>
            )}
            {activeTab === 'background' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded shadow-sm">
                  <label className="w-[90px] text-[11px]">Gradient Type</label>
                  <select
                    className="flex-1 text-xs border rounded px-2 py-1"
                    value={gradientControls.type}
                    onChange={e => updateGradientControl('type', e.target.value)}
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
                {gradientControls.type === 'linear' && (
                  <div className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label className="w-[55px] text-[11px]">Angle</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={gradientControls.angle}
                      onChange={e => updateGradientControl('angle', parseInt(e.target.value, 10))}
                      className="slider-input flex-1"
                    />
                    <div className="slider-value w-[30px] text-right text-[11px]">{gradientControls.angle}°</div>
                  </div>
                )}
                <div className="space-y-1">
                  {gradientControls.colors.map((colorStop, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-1 rounded shadow-sm">
                      <label className="w-[60px] text-[11px]">Color {index + 1}</label>
                      <input
                        type="color"
                        value={colorStop.color}
                        onChange={e => updateGradientColor(index, e.target.value)}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={colorStop.position}
                        onChange={e => updateGradientPosition(index, parseInt(e.target.value, 10))}
                        className="flex-1 slider-input"
                      />
                      <div className="slider-value">{colorStop.position}%</div>
                      {gradientControls.colors.length > 2 && (
                        <button
                          className="ml-2 text-[11px] px-2 py-1 rounded border"
                          onClick={() => removeGradientColor(index)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <button
                    className="w-full text-xs py-1 rounded border hover:bg-gray-100"
                    onClick={addGradientColor}
                  >
                    + Add Color
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="p-2 bg-gray-900 text-white flex gap-1">
        <button
          className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
          onClick={resetControls}
          disabled={isApplying}
        >
          Reset
        </button>
        <button
          className={`flex-1 py-1 text-xs rounded hover:bg-blue-700 transition-colors ${copied ? 'bg-green-600' : 'bg-blue-600'}`}
          onClick={copyCSSCode}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
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