import React, { useState, useEffect, useCallback, useRef } from "react";
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
  inset: false,
};

const DEFAULT_TEXT_CONTROLS: ShadowControls = {
  x: 0,
  y: 0,
  blur: 4,
  color: "#000000", 
  opacity: 0.25,
};

const DEFAULT_GRADIENT_CONTROLS: GradientControls = {
  type: "linear",
  angle: 90,
  colors: [
    { color: "#6e8efb", position: 0 },
    { color: "#a777e3", position: 100 },
  ],
};

// ALL PRESETS
const BOX_PRESETS: ShadowPreset[] = [
  { id: "soft", name: "Purple", value: "rgba(110,20,179,0.5) 0px 1.99146px 15.4338px 0px", preview: "rgba(110,20,179,0.5) 0px 1.99146px 15.4338px 0px" },
  { id: "soft-light", name: "Soft Light", value: "rgb(255,255,255) -8px 0px 15px 5px", preview: "rgb(255,255,255) -8px 0px 15px 5px" },
  { id: "inner-soft-dark", name: "Inner", value: "rgba(0,0,0,0.08) 0px 0px 20px 0px inset", preview: "rgba(0,0,0,0.08) 0px 0px 20px 0px inset" },
  { id: "deep", name: "Deep", value: "rgba(24,21,27,0.2) 0px 5px 0px 0px", preview: "rgba(24,21,27,0.2) 0px 5px 0px 0px" }, // FIX: removed stray extra comma
  { id: "subtle", name: "Subtle", value: "0 2px 4px rgba(0, 0, 0, 0.2)", preview: "0 2px 4px rgba(0, 0, 0, 0.2)" },
  { id: "light-inset", name: "Light Inset", value: "rgb(230,230,230) 0px 55px 25px -25px inset", preview: "rgb(230,230,230) 0px 55px 25px -25px inset" },
  { id: "strong", name: "Strong Shadow", value: "rgba(0,0,0,0.4) 0px 8px 32px 0px", preview: "rgba(0,0,0,0.4) 0px 8px 32px 0px" },
  { id: "soft-dark", name: "Soft Dark", value: "rgba(0,0,0,0.357) 1.6px 1.6px 3.2px 0px", preview: "rgba(0,0,0,0.357) 1.6px 1.6px 3.2px 0px" },
  { id: "dark-shadow", name: "Dark Shadow", value: "rgba(0,0,0,0.8) 4px 4px 10px 0px", preview: "rgba(0,0,0,0.8) 4px 4px 10px 0px" },
  { id: "blue-soft", name: "Blue Soft", value: "rgba(0,160,210,0.2) 0px 0px 100px 0px", preview: "rgba(0,160,210,0.2) 0px 0px 100px 0px" },
  { id: "medium-dark", name: "Medium Dark", value: "rgba(0,0,0,0.6) 0px 2px 12px 0px", preview: "rgba(0,0,0,0.6) 0px 2px 12px 0px" },
  { id: "soft-depth", name: "Soft Depth", value: "rgba(0,0,0,0.2) 0px 5px 10px 20px", preview: "rgba(0,0,0,0.2) 0px 5px 10px 20px" },
  { id: "blue-drop", name: "Blue Drop", value: "rgb(21,180,252) 0px 12px 12px 0px", preview: "rgb(21,180,252) 0px 12px 12px 0px" },
  { id: "blue", name: "Blue", value: "2px 29px 29px -1px rgba(94, 120, 179, 0.53)", preview: "2px 29px 29px -1px rgba(94, 120, 179, 0.53)" },
  { id: "inner-fade", name: "Inner Fade", value: "rgba(0,0,0,0.1) 0px 0px 0px 150px inset", preview: "rgba(0,0,0,0.1) 0px 0px 0px 150px inset" },
  { id: "inner-soft", name: "Inner Soft", value: "inset 0 10px 50px rgba(0,0,0,0.1)", preview: "inset 0 10px 50px rgba(0,0,0,0.1)" },
  { id: "orange-outline", name: "Orange Outline", value: "rgba(202,74,31,0.12) 0px 0px 0px 7.58316px", preview: "rgba(202,74,31,0.12) 0px 0px 0px 7.58316px" },
  { id: "double-border", name: "Double Border", value: "rgb(195,196,199) 0px 0px 0px 1px, rgba(0,0,0,0.07) 0px 2px 4px 0px", preview: "rgb(195,196,199) 0px 0px 0px 1px, rgba(0,0,0,0.07) 0px 2px 4px 0px" },
  { id: "top-light", name: "Top Light", value: "rgba(0,0,0,0.2) 1px -4px 6px 0px", preview: "rgba(0,0,0,0.2) 1px -4px 6px 0px" },
  { id: "light-gray", name: "Light Gray", value: "rgb(229,229,229) 0px 1px 8px 0px", preview: "rgb(229,229,229) 0px 1px 8px 0px" },
  { id: "cyan-outline", name: "Cyan Outline", value: "rgb(51,180,206) 0px 0px 0px 4px", preview: "rgb(51,180,206) 0px 0px 0px 4px" },
  { id: "orange-inset", name: "Orange Inset", value: "rgb(248,161,0) 0px 0px 10px 0px inset", preview: "rgb(248,161,0) 0px 0px 10px 0px inset" },
  { id: "midnight-shadow", name: "Midnight", value: "rgb(46,48,62) 0px 0px 8.8px 8.8px", preview: "rgb(46,48,62) 0px 0px 8.8px 8.8px" },
  { id: "heavy-drop", name: "Heavy Drop", value: "rgba(0,0,0,0.4) 40px 50px 50px 10px", preview: "rgba(0,0,0,0.4) 40px 50px 50px 10px" },
  { id: "dark-deep", name: "Dark Deep", value: "rgb(4,0,17) 0px 0px 300px 0px inset", preview: "rgb(4,0,17) 0px 0px 300px 0px inset" },
  { id: "orange-border", name: "Orange Border", value: "rgb(226,119,48) 0px 0px 0px 2px, rgba(0,0,0,0.15) 0px 2px 4px 0px", preview: "rgb(226,119,48) 0px 0px 0px 2px, rgba(0,0,0,0.15) 0px 2px 4px 0px" },
];

const TEXT_PRESETS: ShadowPreset[] = [
  { id: "outline", name: "Text Outline", value: "1px 1px 0 rgba(0, 0, 0, 0.8), -1px -1px 0 rgba(0, 0, 0, 0.8), 1px -1px 0 rgba(0, 0, 0, 0.8), -1px 1px 0 rgba(0, 0, 0, 0.8)", preview: "1px 1px 0 rgba(0, 0, 0, 0.8)" },
  { id: "elegant-text", name: "Elegant Text", value: "2px 2px 4px rgba(0, 0, 0, 0.2)", preview: "2px 2px 4px rgba(0, 0, 0, 0.2)" },
  { id: "soft-text-shadow", name: "Soft Text", value: "3px 3px 5px rgba(128, 0, 0, 1)", preview: "3px 3px 5px rgba(128, 0, 0, 1)" },
  { id: "Distant-text", name: "Distant Text", value: "0px 3px 0px #b2a98f, 0px 14px 10px rgba(0,0,0,0.15), 0px 24px 2px rgba(0,0,0,0.1), 0px 24px 30px rgba(0,0,0,0.1)", preview: "0px 3px 0px #b2a98f, 0px 14px 10px rgba(0,0,0,0.15), 0px 24px 2px rgba(0,0,0,0.1), 0px 24px 30px rgba(0,0,0,0.1)" },
  { id: "Heavy-text", name: "Heavy Text", value: "0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)", preview: "0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)" },
  { id: "seventies-style", name: "70's Style Text", value: "-10px 10px 0px #00e6e6", preview: "-10px 10px 0px #00e6e6" },
  { id: "multiple-light", name: "Multiple Light", value: "0px 15px 5px rgba(0,0,0,0.1), 10px 20px 5px rgba(0,0,0,0.05), -10px 20px 5px rgba(0,0,0,0.05)", preview: "0px 15px 5px rgba(0,0,0,0.1), 10px 20px 5px rgba(0,0,0,0.05), -10px 20px 5px rgba(0,0,0,0.05)" },
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
  { id: "rainbow-pastel", name: "Rainbow Pastel", value: "linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)", preview: "linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)" },
  { id: "multicolor-blend", name: "Multicolor", value: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)", preview: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)" },
  { id: "purple-mono", name: "Purple Mono", value: "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)", preview: "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)" },
  { id: "pink-coral", name: "Pink Coral", value: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)", preview: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)" },
  { id: "olive-gold", name: "Olive Gold", value: "linear-gradient(to right, #c1c161 0%, #d4d4b1 100%)", preview: "linear-gradient(to right, #c1c161 0%, #d4d4b1 100%)" },
  { id: "blue-sky", name: "Blue Sky", value: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)", preview: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)" },
  { id: "neon-mix", name: "Neon Mix", value: "linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)", preview: "linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)" },
];

const canon = (s: string) =>
  (s || "")
    .replace(/\s+/g, " ")
    .replace(/\s*px/g, "px")
    .replace(/\s*,\s*/g, ", ")
    .trim();

const splitShadowLayers = (s: string) =>
  (s || "").split(/,(?![^(]*\))/).map(t => t.trim()).filter(Boolean);

const extractColor = (layer: string) => {
  const m = layer.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|currentColor)/i);
  return m ? m[1] : "#000000";
};

const parseBoxLayer = (layer: string) => {
  const inset = /\binset\b/i.test(layer);
  let color = extractColor(layer);
  let opacity = 1;

  if (/^rgba\(/i.test(color)) {
    const parts = color.match(/rgba\(([^)]+)\)/)![1].split(",").map(p => p.trim());
    opacity = parts[3] ? parseFloat(parts[3]) : 1;
    color = `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
  } else if (/^#/.test(color) && color.length === 9) {
    opacity = parseInt(color.slice(7, 9), 16) / 255;
    color = color.slice(0, 7);
  }

  const nums = (layer.match(/-?\d*\.?\d+(?=px)/g) || []).map(parseFloat);
  const [x = 0, y = 0, blur = 0, spread = 0] = nums;

  return { x, y, blur, spread, color, opacity, inset };
};

const parseTextLayer = (layer: string) => {
  let color = extractColor(layer);
  let opacity = 1;

  if (/^rgba\(/i.test(color)) {
    const parts = color.match(/rgba\(([^)]+)\)/)![1].split(",").map(p => p.trim());
    opacity = parts[3] ? parseFloat(parts[3]) : 1;
    color = `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
  } else if (/^#/.test(color) && color.length === 9) {
    opacity = parseInt(color.slice(7, 9), 16) / 255;
    color = color.slice(0, 7);
  }

  const nums = (layer.match(/-?\d*\.?\d+(?=px)/g) || []).map(parseFloat);
  const [x = 0, y = 0, blur = 0] = nums;

  return { x, y, blur, color, opacity };
};

const parseGradient = (val: string) => {
  const isRadial = /radial-gradient/i.test(val);
  const type: "linear" | "radial" = isRadial ? "radial" : "linear";
  let angle = 90;
  const a = val.match(/(-?\d+(?:\.\d+)?)deg/);
  if (a) angle = Math.round(parseFloat(a[1]));

  const stopRegex = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|currentColor)(?:\s+(\d{1,3})%)?/gi;
  const colors: { color: string; position: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = stopRegex.exec(val))) {
    const color = m[1];
    const pos = m[2] !== undefined ? Math.max(0, Math.min(100, parseInt(m[2], 10))) : NaN;
    colors.push({ color, position: pos });
  }
  if (colors.length >= 2) {
    colors.forEach((c, idx) => {
      if (Number.isNaN(c.position)) c.position = Math.round((idx / (colors.length - 1)) * 100);
    });
  } else {
    colors.push({ color: "#000000", position: 0 }, { color: "#ffffff", position: 100 });
  }
  return { type, angle, colors };
};


const PresetGrid: React.FC<{
  presets: ShadowPreset[];
  activeTab: "box" | "text" | "background";
  onApplyBoxPreset: (preset: ShadowPreset) => void;
  onApplyTextPreset: (preset: ShadowPreset) => void;
  onApplyGradientPreset: (preset: GradientPreset) => void;
  currentAppliedStyle?: string;
}> = React.memo(({ presets, activeTab, onApplyBoxPreset, onApplyTextPreset, onApplyGradientPreset, currentAppliedStyle }) => (
  <div className="grid grid-cols-3 gap-2 overflow-hidden">
    {presets.map((preset) => {
      const isApplied = currentAppliedStyle === preset.value;
      return (
        <div key={preset.id} className="overflow-hidden rounded-lg">
          <button
            className={`preset-card p-1 border border-solid transition-shadow w-full h-full ${isApplied ? "bg-green-100 border-green-500 cursor-not-allowed" : "bg-white border-gray-200 hover:shadow-md"
              }`}
            onClick={() => {
              if (isApplied) return;
              if (activeTab === "box") onApplyBoxPreset(preset);
              else if (activeTab === "text") onApplyTextPreset(preset);
              else onApplyGradientPreset(preset as GradientPreset);
            }}
            disabled={isApplied}
            title={isApplied ? "Already applied" : ""}
          >
            <div
              className="h-16 rounded-md flex items-center justify-center text-[11px] mx-auto relative"
              style={
                activeTab === "box"
                  ? { boxShadow: preset.value, width: "80%" }
                  : activeTab === "text"
                    ? { textShadow: preset.value, width: "80%" }
                    : { backgroundImage: preset.value, width: "80%" }
              }
            >
              {activeTab === "text" && "Webflow"}
              {isApplied && <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
            <div className="mt-1 text-[11px] text-center px-1">{preset.name}</div>
          </button>
        </div>
      );
    })}
  </div>
));


const App: React.FC = () => {
  const [currentAppliedStyle, setCurrentAppliedStyle] = useState<string>("");
  const [hasSelectedElement, setHasSelectedElement] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"box" | "text" | "background">("box");
  const [activeSubTab, setActiveSubTab] = useState<"presets" | "custom">("presets");

  
  const [boxControls, setBoxControls] = useState<BoxShadowControls>(DEFAULT_BOX_CONTROLS);
  const [textControls, setTextControls] = useState<ShadowControls>(DEFAULT_TEXT_CONTROLS);
  const [gradientControls, setGradientControls] = useState<GradientControls>(DEFAULT_GRADIENT_CONTROLS);

  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApplyHovered, setIsApplyHovered] = useState(false);

  const [lastApplied, setLastApplied] = useState<{ box: string; text: string; background: string }>({ box: "", text: "", background: "" });

  const [customArmed, setCustomArmed] = useState<{ box: boolean; text: boolean; background: boolean }>({
    box: false, text: false, background: false,
  });

  const [customPresetString, setCustomPresetString] = useState<{ box: string; text: string; background: string }>({
    box: "", text: "", background: "",
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);        
  const elementCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);    
  const boxDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleApiError = useCallback(async (error: any, context: string) => {
    
    if (error?.status === 404 || error?.code === 404) return;
    try {
      if (typeof webflow !== "undefined" && webflow.notify) {
        await webflow.notify({ type: "Error", message: `Failed to ${context}. Please try again.` });
      }
    } catch { }
  }, []);

  const checkApiReady = useCallback(() => {
    try {
      return typeof webflow !== "undefined" && webflow && typeof webflow.getSelectedElement === "function";
    } catch {
      return false;
    }
  }, []);


  useEffect(() => {
    let isMounted = true;
    let checks = 0;
    const MAX_CHECKS = 10;

    const step = async () => {
      if (!isMounted || checks >= MAX_CHECKS) return;
      try {
        if (!checkApiReady()) {
          checks++;
          elementCheckTimeoutRef.current = setTimeout(step, 2000);
          return;
        }
        const element = await webflow.getSelectedElement();
        const hasElement = !!element;
        if (!isMounted) return;
        setHasSelectedElement(hasElement);
        setSelectedElement(hasElement ? element : null);
        if (!hasElement && checks < MAX_CHECKS) {
          checks++;
          elementCheckTimeoutRef.current = setTimeout(step, 2000);
        }
      } catch {
        checks++;
        elementCheckTimeoutRef.current = setTimeout(step, 2000);
      }
    };

    step();
    return () => {
      isMounted = false;
      if (elementCheckTimeoutRef.current) clearTimeout(elementCheckTimeoutRef.current);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (boxDebounceRef.current) clearTimeout(boxDebounceRef.current);
      if (textDebounceRef.current) clearTimeout(textDebounceRef.current);
    };
  }, [checkApiReady]);


  const applyStyle = useCallback(
    async (property: "box-shadow" | "text-shadow" | "background-image", value: string) => {
      if (!checkApiReady()) {
        try {
          await webflow.notify({ type: "Error", message: "Webflow API is not available. Please try again." });
        } catch { }
        return;
      }

      let element: any;
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 10000));
        element = await Promise.race([webflow.getSelectedElement(), timeoutPromise]);
        if (!element) {
          try {
            await webflow.notify({ type: "Error", message: "No element selected. Please select an element in the Webflow Designer." });
          } catch { }
          return;
        }
      } catch (error: any) {
        try {
          await webflow.notify({ type: "Error", message: error?.message === "Request timeout" ? "Request timeout. Please try again." : "Failed to get selected element. Please try again." });
        } catch { }
        return;
      }

      setIsApplying(true);

      try {
        const currentStyles = await element.getStyles();
        let allStyles = Array.isArray(currentStyles) ? currentStyles : Array.from(currentStyles as any);

        const validClassInfo: any[] = [];
        const allClassNames: string[] = [];
        for (const style of allStyles) {
          try {
            const styleName = await style.getName();
            const properties = await style.getProperties();
            if (styleName) {
              validClassInfo.push({ style, name: styleName, properties });
              allClassNames.push(styleName);
            }
          } catch { }
        }

        let targetClass: any = null;

     
        if (allClassNames.length === 0) {
          try {
            const classType = property === "text-shadow" ? "text" : property === "box-shadow" ? "box" : "gradient";
            const basePrefix = `${classType}-effect-`;

            const takenNums = new Set<number>();
            for (const name of allClassNames) {
              if (name.startsWith(basePrefix)) {
                const n = parseInt(name.slice(basePrefix.length), 10);
                if (!Number.isNaN(n)) takenNums.add(n);
              }
            }
            for (let probe = 1; probe <= 50; probe++) {
              try {
                const maybe = await webflow.getStyleByName(`${basePrefix}${probe}`);
                if (maybe) takenNums.add(probe);
              } catch { }
            }

            let nextIndex = 1;
            while (takenNums.has(nextIndex)) nextIndex++;
            const newClassName = `${basePrefix}${nextIndex}`;

            const newStyle = await webflow.createStyle(newClassName);
            await element.setStyles([newStyle]);

            const updatedStyles = await element.getStyles();
            allStyles = Array.isArray(updatedStyles) ? updatedStyles : Array.from(updatedStyles as any);

            for (const style of allStyles) {
              try {
                const styleName = await style.getName();
                if (styleName === newClassName) {
                  const properties = await style.getProperties();
                  targetClass = { style, name: styleName, properties };
                  validClassInfo.push(targetClass);
                  allClassNames.push(styleName);
                  break;
                }
              } catch { }
            }
          } catch (createError) {
           
          }
        }

      
        for (const classInfo of validClassInfo) {
          try {
            const { style, properties } = classInfo;
            if (properties && property in properties) {
              const { [property]: _removed, ...cleanProperties } = properties;
              await style.setProperties(cleanProperties);
            }
          } catch { }
        }

      
        if (!targetClass) {
          if (allClassNames.length === 1) targetClass = validClassInfo[0];
          else if (allClassNames.length > 1) {
            targetClass = validClassInfo.find((cls: any) => cls.name === allClassNames[1]) || validClassInfo[0];
          }
        }

        
        if (targetClass) {
          const { style, properties } = targetClass;
          const newProperties = { ...properties, [property]: value };
          await style.setProperties(newProperties);
        } else if (validClassInfo.length > 0) {
          const fallbackClass = validClassInfo[0];
          const newProperties = { ...fallbackClass.properties, [property]: value };
          await fallbackClass.style.setProperties(newProperties);
        } else {
          throw new Error("No classes available to apply style");
        }

        setCurrentAppliedStyle(value);
      } catch (error) {
        
        await handleApiError(error, `apply ${property}`);
      } finally {
        setIsApplying(false);
      }
    },
    [checkApiReady, handleApiError]
  );

 
  const hexToRgb = useCallback((color: string) => {
    try {
      if (!color) return { r: 0, g: 0, b: 0, a: 1, hex: "#000000" };
      if (color.startsWith("rgb")) {
        const parts = color.match(/(\d+\.?\d*)/g);
        if (!parts || parts.length < 3) return { r: 0, g: 0, b: 0, a: 1, hex: "#000000" };
        const r = parseInt(parts[0], 10);
        const g = parseInt(parts[1], 10);
        const b = parseInt(parts[2], 10);
        const a = parts.length >= 4 ? parseFloat(parts[3]) : 1;
        return { r, g, b, a, hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}` };
      }
      if (color.startsWith("#") && color.length === 9) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const a = parseInt(color.slice(7, 9), 16) / 255;
        return { r, g, b, a, hex: color.slice(0, 7) };
      }
      if (color.startsWith("#")) {
        const h = color.replace("#", "");
        let r = 0, g = 0, b = 0;
        if (h.length === 3) {
          r = parseInt(h[0] + h[0], 16);
          g = parseInt(h[1] + h[1], 16);
          b = parseInt(h[2] + h[2], 16);
        } else {
          r = parseInt(h.substring(0, 2), 16);
          g = parseInt(h.substring(2, 4), 16);
          b = parseInt(h.substring(4, 6), 16);
        }
        return { r, g, b, a: 1, hex: `#${h.substring(0, 6)}` };
      }
      return { r: 0, g: 0, b: 0, a: 1, hex: "#000000" };
    } catch {
      return { r: 0, g: 0, b: 0, a: 1, hex: "#000000" };
    }
  }, []);

  const getHexColor = useCallback((color: string): string => {
    if (!color) return "#000000";
    if (color.startsWith("#")) return color.length === 7 || color.length === 9 ? color.slice(0, 7) : "#000000";
    if (color.startsWith("rgb")) return hexToRgb(color).hex;
    return "#000000";
  }, [hexToRgb]);


  const buildBoxShadowRaw = useCallback(() => {
    if (!customArmed.box && activeTab === "box" && activeSubTab === "custom" && customPresetString.box) {
      return customPresetString.box;
    }
    const { x, y, blur, spread, color, opacity, inset } = boxControls;
    if (color.startsWith("rgb")) {
      const m = color.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const parts = m[1].split(",").map((p) => p.trim());
        if (parts.length >= 3) {
          const [r, g, b] = parts;
          return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      }
    }
    const rgb = hexToRgb(color);
    return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }, [boxControls, hexToRgb, customArmed.box, activeTab, activeSubTab, customPresetString.box]);

  const buildTextShadowRaw = useCallback(() => {
    if (!customArmed.text && activeTab === "text" && activeSubTab === "custom" && customPresetString.text) {
      return customPresetString.text;
    }
    const { x, y, blur, color, opacity } = textControls;
    const rgb = hexToRgb(color);
    return `${x}px ${y}px ${blur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }, [textControls, hexToRgb, customArmed.text, activeTab, activeSubTab, customPresetString.text]);

  const buildGradientRaw = useCallback(() => {
    if (!customArmed.background && activeTab === "background" && activeSubTab === "custom" && customPresetString.background) {
      return customPresetString.background;
    }
    const { type, angle, colors } = gradientControls;
    const stops = colors.map((c) => `${c.color} ${c.position}%`).join(", ");
    return `${type}-gradient(${type === "linear" ? `${angle}deg` : "circle"}, ${stops})`;
  }, [gradientControls, customArmed.background, activeTab, activeSubTab, customPresetString.background]);

  const pendingStyleForTab = useCallback(() => {
    if (activeTab === "box") {
      const raw = activeSubTab === "custom" ? buildBoxShadowRaw() : currentAppliedStyle;
      return canon(raw || "");
    }
    if (activeTab === "text") {
      const raw = activeSubTab === "custom" ? buildTextShadowRaw() : currentAppliedStyle;
      return canon(raw || "");
    }
    const raw = activeSubTab === "custom" ? buildGradientRaw() : currentAppliedStyle;
    return canon(raw || "");
  }, [activeTab, activeSubTab, buildBoxShadowRaw, buildTextShadowRaw, buildGradientRaw, currentAppliedStyle]);

  const isSameAsApplied =
    activeTab === "box"
      ? pendingStyleForTab() !== "" && pendingStyleForTab() === lastApplied.box
      : activeTab === "text"
        ? pendingStyleForTab() !== "" && pendingStyleForTab() === lastApplied.text
        : pendingStyleForTab() !== "" && pendingStyleForTab() === lastApplied.background;

  const applyDisabledBecauseSame = isSameAsApplied;
  const applyDisabled = isApplying || applyDisabledBecauseSame || !hasSelectedElement;

  const safeApplyStyle = useCallback(
    async (property: "box-shadow" | "text-shadow" | "background-image", value: string, tabKey?: "box" | "text" | "background") => {
      try {
        await applyStyle(property, value);
        if (tabKey) {
          setLastApplied((p) => ({ ...p, [tabKey]: canon(value) }));
        }
      } catch (error) {
        try {
          if (typeof webflow !== "undefined" && webflow.notify) {
            await webflow.notify({ type: "Error", message: `Failed to apply ${property}. Please try again.` });
          }
        } catch { }
      }
    },
    [applyStyle]
  );

 
  const applyBoxPreset = useCallback(
    async (preset: ShadowPreset) => {
      const v = canon(preset.value);
      if (v === lastApplied.box) return;
      await safeApplyStyle("box-shadow", preset.value, "box");
      setCurrentAppliedStyle(preset.value);
      const firstLayer = splitShadowLayers(preset.value)[0] || preset.value;
      const parsed = parseBoxLayer(firstLayer);
      setBoxControls(parsed);
      setCustomPresetString((prev) => ({ ...prev, box: preset.value }));
      setCustomArmed((prev) => ({ ...prev, box: false }));
    },
    [lastApplied.box, safeApplyStyle]
  );

  const applyTextPreset = useCallback(
    async (preset: ShadowPreset) => {
      const v = canon(preset.value);
      if (v === lastApplied.text) return;
      await safeApplyStyle("text-shadow", preset.value, "text");
      setCurrentAppliedStyle(preset.value);
      const firstLayer = splitShadowLayers(preset.value)[0] || preset.value;
      let { x, y, blur, color, opacity } = parseTextLayer(firstLayer);
      if (preset.id === "outline") { x = 1; y = 1; blur = 0; opacity = Math.max(opacity, 0.8); }
      setTextControls({ x, y, blur, color, opacity });
      setCustomPresetString((prev) => ({ ...prev, text: preset.value }));
      setCustomArmed((prev) => ({ ...prev, text: false }));
    },
    [lastApplied.text, safeApplyStyle]
  );

  const applyGradientPreset = useCallback(
    async (preset: GradientPreset) => {
      const v = canon(preset.value);
      if (v === lastApplied.background) return;
      await safeApplyStyle("background-image", preset.value, "background");
      setCurrentAppliedStyle(preset.value);
      const g = parseGradient(preset.value);
      setGradientControls(g);
      setCustomPresetString((prev) => ({ ...prev, background: preset.value }));
      setCustomArmed((prev) => ({ ...prev, background: false }));
    },
    [lastApplied.background, safeApplyStyle]
  );

  
  const applyCustomBoxShadow = useCallback(async () => {
    setIsApplying(true);
    try {
      const raw = buildBoxShadowRaw();
      const v = canon(raw);
      if (v === lastApplied.box) return;
      await safeApplyStyle("box-shadow", raw, "box");
      setCurrentAppliedStyle(raw);
    } finally {
      setIsApplying(false);
    }
  }, [buildBoxShadowRaw, lastApplied.box, safeApplyStyle]);

  const applyCustomTextShadow = useCallback(async () => {
    const raw = buildTextShadowRaw();
    const v = canon(raw);
    if (v === lastApplied.text) return;
    await safeApplyStyle("text-shadow", raw, "text");
    setCurrentAppliedStyle(raw);
  }, [buildTextShadowRaw, lastApplied.text, safeApplyStyle]);

  const applyCustomGradient = useCallback(async () => {
    const raw = buildGradientRaw();
    const v = canon(raw);
    if (v === lastApplied.background) return;
    await safeApplyStyle("background-image", raw, "background");
    setCurrentAppliedStyle(raw);
  }, [buildGradientRaw, lastApplied.background, safeApplyStyle]);

  useEffect(() => {
    if (activeTab !== "box" || activeSubTab !== "custom" || !customArmed.box) return;
    if (boxDebounceRef.current) clearTimeout(boxDebounceRef.current);
    boxDebounceRef.current = setTimeout(() => {
      const v = canon(buildBoxShadowRaw());
      if (v !== lastApplied.box) applyCustomBoxShadow();
    }, 300);
    return () => { if (boxDebounceRef.current) clearTimeout(boxDebounceRef.current); };
  }, [boxControls, activeTab, activeSubTab, customArmed.box, buildBoxShadowRaw, lastApplied.box, applyCustomBoxShadow]);

  useEffect(() => {
    if (activeTab !== "text" || activeSubTab !== "custom" || !customArmed.text) return;
    if (textDebounceRef.current) clearTimeout(textDebounceRef.current);
    textDebounceRef.current = setTimeout(() => {
      const v = canon(buildTextShadowRaw());
      if (v !== lastApplied.text) applyCustomTextShadow();
    }, 300);
    return () => { if (textDebounceRef.current) clearTimeout(textDebounceRef.current); };
  }, [textControls, activeTab, activeSubTab, customArmed.text, buildTextShadowRaw, lastApplied.text, applyCustomTextShadow]);

  useEffect(() => {
    if (!(activeTab === "background" && activeSubTab === "custom" && customArmed.background)) return;
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      const v = canon(buildGradientRaw());
      if (v !== lastApplied.background) applyCustomGradient();
    }, 500);
    return () => { if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current); };
  }, [gradientControls, activeTab, activeSubTab, customArmed.background, buildGradientRaw, lastApplied.background, applyCustomGradient]);

  
  const touchCustom = useCallback((tab: "box" | "text" | "background") => {
    setCustomArmed((p) => ({ ...p, [tab]: true }));
    setCustomPresetString((p) => ({ ...p, [tab]: "" }));
  }, []);

  const updateBoxControl = useCallback((key: keyof BoxShadowControls, value: string | number | boolean) => {
    touchCustom("box");
    setBoxControls((prev) => ({ ...prev, [key]: value } as BoxShadowControls));
  }, [touchCustom]);

  const updateTextControl = useCallback((key: keyof ShadowControls, value: string | number) => {
    touchCustom("text");
    setTextControls((prev) => ({ ...prev, [key]: value } as ShadowControls));
  }, [touchCustom]);

  const updateGradientControl = useCallback((key: keyof GradientControls, value: any) => {
    touchCustom("background");
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    setGradientControls((prev) => ({ ...prev, [key]: value } as GradientControls));
  }, [touchCustom]);

  const updateGradientColor = useCallback((index: number, color: string) => {
    touchCustom("background");
    const newColors = [...gradientControls.colors];
    newColors[index].color = color;
    setGradientControls((prev) => ({ ...prev, colors: newColors }));
  }, [gradientControls.colors, touchCustom]);

  const addGradientColor = useCallback(() => {
    touchCustom("background");
    const newColors = [...gradientControls.colors, { color: "#000000", position: 100 }];
    setGradientControls((prev) => ({ ...prev, colors: newColors }));
  }, [gradientControls.colors, touchCustom]);

  const removeGradientColor = useCallback((index: number) => {
    if (gradientControls.colors.length <= 2) return;
    touchCustom("background");
    const newColors = [...gradientControls.colors];
    newColors.splice(index, 1);
    setGradientControls((prev) => ({ ...prev, colors: newColors }));
  }, [gradientControls.colors, touchCustom]);

  const updateGradientPosition = useCallback((index: number, position: number) => {
    touchCustom("background");
    const newColors = [...gradientControls.colors];
    newColors[index].position = Math.max(0, Math.min(100, position));
    setGradientControls((prev) => ({ ...prev, colors: newColors }));
  }, [gradientControls.colors, touchCustom]);

  
  const resetControls = useCallback(async () => {
    if (!selectedElement || !checkApiReady()) return;
    setIsApplying(true);
    try {
      if (activeTab === "box") {
        setBoxControls(DEFAULT_BOX_CONTROLS);
        await safeApplyStyle("box-shadow", "none", "box");
        setLastApplied((p) => ({ ...p, box: "" }));
        setCustomPresetString((p) => ({ ...p, box: "" }));
        setCustomArmed((p) => ({ ...p, box: false }));
      } else if (activeTab === "text") {
        setTextControls(DEFAULT_TEXT_CONTROLS);
        await safeApplyStyle("text-shadow", "none", "text");
        setLastApplied((p) => ({ ...p, text: "" }));
        setCustomPresetString((p) => ({ ...p, text: "" }));
        setCustomArmed((p) => ({ ...p, text: false }));
      } else if (activeTab === "background") {
        setGradientControls(DEFAULT_GRADIENT_CONTROLS);
        await safeApplyStyle("background-image", "none", "background");
        setLastApplied((p) => ({ ...p, background: "" }));
        setCustomPresetString((p) => ({ ...p, background: "" }));
        setCustomArmed((p) => ({ ...p, background: false }));
      }
      setCurrentAppliedStyle("");
    } catch (error) {
      await handleApiError(error, "reset controls");
    } finally {
      setIsApplying(false);
    }
  }, [selectedElement, checkApiReady, activeTab, safeApplyStyle, handleApiError]);

 
  const copyCSSCode = useCallback(() => {
    let cssCode = "";
    try {
      if (activeTab === "box") cssCode = `box-shadow: ${buildBoxShadowRaw()};`;
      else if (activeTab === "text") cssCode = `text-shadow: ${buildTextShadowRaw()};`;
      else cssCode = `background-image: ${buildGradientRaw()};`;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(cssCode).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          const textArea = document.createElement("textarea");
          textArea.value = cssCode;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    } catch { }
  }, [activeTab, buildBoxShadowRaw, buildTextShadowRaw, buildGradientRaw]);

 
  const generatePreview = useCallback(() => {
    try {
      if (activeSubTab === "custom") {
        if (activeTab === "box") {
          const style = { boxShadow: buildBoxShadowRaw(), backgroundImage: "none", textShadow: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        } else if (activeTab === "text") {
          const style = { textShadow: buildTextShadowRaw(), boxShadow: "none", backgroundImage: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        } else {
          const style = { backgroundImage: buildGradientRaw(), boxShadow: "none", textShadow: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        }
      }

      if (currentAppliedStyle && activeSubTab === "presets") {
        if (activeTab === "box") {
          const style = { boxShadow: currentAppliedStyle, backgroundImage: "none", textShadow: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        } else if (activeTab === "text") {
          const style = { textShadow: currentAppliedStyle, boxShadow: "none", backgroundImage: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        } else {
          const style = { backgroundImage: currentAppliedStyle, boxShadow: "none", textShadow: "none" } as React.CSSProperties;
          return { style, text: "Webflow" };
        }
      }

      if (activeTab === "box") {
        const style = { boxShadow: buildBoxShadowRaw(), backgroundImage: "none", textShadow: "none" } as React.CSSProperties;
        return { style, text: "Webflow" };
      } else if (activeTab === "text") {
        const style = { textShadow: buildTextShadowRaw(), boxShadow: "none", backgroundImage: "none" } as React.CSSProperties;
        return { style, text: "Webflow" };
      } else {
        const style = { backgroundImage: buildGradientRaw(), boxShadow: "none", textShadow: "none" } as React.CSSProperties;
        return { style, text: "Webflow" };
      }
    } catch {
      return { style: {}, text: "Webflow" };
    }
  }, [activeTab, activeSubTab, buildBoxShadowRaw, buildTextShadowRaw, buildGradientRaw, currentAppliedStyle]);

  useEffect(() => {
    if (activeSubTab !== "custom") return;
    if (!currentAppliedStyle) return;

    if (activeTab === "box") {
      const first = splitShadowLayers(currentAppliedStyle)[0] || currentAppliedStyle;
      const next = parseBoxLayer(first);
      setBoxControls(next);
      setCustomPresetString((p) => ({ ...p, box: currentAppliedStyle }));
      setCustomArmed((p) => ({ ...p, box: false }));
    } else if (activeTab === "text") {
      const first = splitShadowLayers(currentAppliedStyle)[0] || currentAppliedStyle;
      const next = parseTextLayer(first);
      setTextControls(next);
      setCustomPresetString((p) => ({ ...p, text: currentAppliedStyle }));
      setCustomArmed((p) => ({ ...p, text: false }));
    } else {
      const g = parseGradient(currentAppliedStyle);
      setGradientControls(g);
      setCustomPresetString((p) => ({ ...p, background: currentAppliedStyle }));
      setCustomArmed((p) => ({ ...p, background: false }));
    }
  }, [activeSubTab, activeTab, currentAppliedStyle]);

  useEffect(() => {
    if (!currentAppliedStyle) setCurrentAppliedStyle("");
  }, [activeTab, activeSubTab]);

  const { style: previewStyle, text: previewTextContent } = generatePreview();
  const currentPresets = activeTab === "box" ? BOX_PRESETS : activeTab === "text" ? TEXT_PRESETS : GRADIENT_PRESETS;

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

  return (
    <div className="h-[460px] bg-white shadow-xl overflow-hidden flex flex-col">
      <div className="p-1 bg-gray-100">
        <div className="grid grid-cols-3 gap-1">
          {(["box", "text", "background"] as const).map((tab) => (
            <button
              key={tab}
              className={`tab-btn py-1 text-xs rounded-md transition-colors ${activeTab === tab ? "bg-blue-200 text-blue-700 font-semibold" : "text-gray-500 hover:text-blue-600"
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
          ref={previewRef}
          className="w-24 h-24 bg-white rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-semibold"
          style={previewStyle}
        >
          <span>{previewTextContent}</span>
        </div>
      </div>

      <div className="flex gap-1 m-2">
        {(["presets", "custom"] as const).map((subTab) => (
          <button
            key={subTab}
            className={`flex-1 py-1 text-xs rounded shadow transition-colors ${activeSubTab === subTab ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-blue-600"
              }`}
            onClick={() => setActiveSubTab(subTab)}
          >
            {subTab === "presets" ? "Presets" : "Custom"}
          </button>
        ))}
      </div>

      <section className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
        {activeSubTab === "presets" ? (
          <PresetGrid
            presets={currentPresets}
            activeTab={activeTab}
            onApplyBoxPreset={applyBoxPreset}
            onApplyTextPreset={applyTextPreset}
            onApplyGradientPreset={applyGradientPreset}
            currentAppliedStyle={currentAppliedStyle}
          />
        ) : (
          <div className="space-y-2">
            {activeTab === "box" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-12 text-[11px] text-center">Outset</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={boxControls.inset}
                      onChange={(e) => updateBoxControl("inset", e.target.checked)}
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
                    { id: "spread", label: "Spread", key: "spread" as const, min: -50, max: 50, value: boxControls.spread },
                  ].map(({ id, label, key, min, max, value }) => (
                    <div key={id} className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                      <label className="slider-label w-[55px] text-[11px]">{label}</label>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => updateBoxControl(key, parseInt(e.target.value, 10))}
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
                      onChange={(e) => updateBoxControl("opacity", parseFloat(e.target.value))}
                      className="slider-input flex-1"
                    />
                    <div className="slider-value w-[30px] text-right text-[11px]">{boxControls.opacity.toFixed(2)}</div>
                  </div>

                  <div className="slider-container flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="slider-label text-[11px] w-[55px]">Color</label>
                      <input
                        type="color"
                        value={getHexColor(boxControls.color)}
                        onChange={(e) => updateBoxControl("color", e.target.value)}
                        className="color-input w-8 h-8"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={boxControls.color}
                          onChange={(e) => updateBoxControl("color", e.target.value)}
                          placeholder="#000000 or rgba(0,0,0,0.5) or currentColor"
                          className="w-full text-xs border rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "text" && (
              <div className="space-y-2">
                {[
                  { id: "textX", label: "X Offset", key: "x" as const, min: -20, max: 20, value: textControls.x },
                  { id: "textY", label: "Y Offset", key: "y" as const, min: -20, max: 20, value: textControls.y },
                  { id: "textBlur", label: "Blur", key: "blur" as const, min: 0, max: 20, value: textControls.blur },
                ].map(({ id, label, key, min, max, value }) => (
                  <div key={id} className="slider-container bg-gray-50 p-1 rounded shadow-sm flex items-center gap-2">
                    <label className="slider-label w-[55px] text-[11px]">{label}</label>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={value}
                      onChange={(e) => updateTextControl(key, parseInt(e.target.value, 10))}
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
                    onChange={(e) => updateTextControl("opacity", parseFloat(e.target.value))}
                    className="slider-input flex-1"
                  />
                  <div className="slider-value w-[30px] text-right text-[11px]">{textControls.opacity.toFixed(2)}</div>
                </div>

                <div className="slider-container flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="slider-label text-[11px] w-[55px]">Color</label>
                    <input
                      type="color"
                      value={getHexColor(textControls.color)}
                      onChange={(e) => updateTextControl("color", e.target.value)}
                      className="color-input w-8 h-8"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={textControls.color}
                        onChange={(e) => updateTextControl("color", e.target.value)}
                        placeholder="#000000 or rgba(0,0,0,0.5) or currentColor"
                        className="w-full text-xs border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "background" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded shadow-sm">
                  <label className="w-[90px] text-[11px] font-medium text-gray-700">Gradient Type</label>
                  <select
                    className="flex-1 text-xs border rounded px-2 py-1 bg-white"
                    value={gradientControls.type}
                    onChange={(e) => updateGradientControl("type", e.target.value)}
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {gradientControls.type === "linear" && (
                  <div className="slider-container bg-gray-50 p-2 rounded shadow-sm flex items-center gap-2">
                    <label className="w-[90px] text-[11px] font-medium text-gray-700">Angle</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={gradientControls.angle}
                      onChange={(e) => updateGradientControl("angle", parseInt(e.target.value, 10))}
                      className="slider-input flex-1"
                    />
                    <div className="slider-value w-[35px] text-center text-[11px] font-medium">{gradientControls.angle}°</div>
                  </div>
                )}

                <div className="space-y-2">
                  {gradientControls.colors.map((colorStop, index) => (
                    <div key={index} className="flex flex-col gap-2 bg-gray-50 p-2 rounded shadow-sm">
                      <div className="flex items-center gap-2">
                        <label className="w-[90px] text-[11px] font-medium text-gray-700">Color {index + 1}</label>
                        <input
                          type="color"
                          value={getHexColor(colorStop.color)}
                          onChange={(e) => updateGradientColor(index, e.target.value)}
                          className="color-input w-8 h-8 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={colorStop.color}
                            onChange={(e) => updateGradientColor(index, e.target.value)}
                            placeholder="#000000 or rgba(0,0,0,0.5) or currentColor"
                            className="w-full text-xs border rounded px-2 py-1 bg-white"
                          />
                        </div>
                        {gradientControls.colors.length > 2 && (
                          <button
                            className="text-[11px] px-2 py-1 rounded border hover:bg-red-50 transition-colors flex-shrink-0"
                            onClick={() => removeGradientColor(index)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <div className="slider-container bg-gray-100 p-2 rounded flex items-center gap-2">
                        <label className="w-[90px] text-[11px] font-medium text-gray-700">Position</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={colorStop.position}
                          onChange={(e) => updateGradientPosition(index, parseInt(e.target.value, 10))}
                          className="slider-input flex-1"
                        />
                        <div className="slider-value w-[35px] text-center text-[11px] font-medium">{colorStop.position}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    className="w-full text-xs py-2 rounded border hover:bg-gray-100 transition-colors font-medium"
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
        <button className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600" onClick={resetControls} disabled={isApplying}>
          Reset
        </button>
        <button
          className={`flex-1 py-1 text-xs rounded transition-colors ${copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={copyCSSCode}
          title="Copy current CSS"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          className={`flex-1 py-1 text-xs rounded transition-colors flex items-center justify-center gap-1 ${applyDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          onMouseEnter={() => setIsApplyHovered(true)}
          onMouseLeave={() => setIsApplyHovered(false)}
          onClick={() => {
            if (applyDisabled) return;
            if (activeTab === "box") applyCustomBoxShadow();
            else if (activeTab === "text") applyCustomTextShadow();
            else applyCustomGradient();
          }}
          disabled={applyDisabled}
          title={
            !hasSelectedElement
              ? "No element selected"
              : applyDisabledBecauseSame
                ? "Not applicable: style already applied"
                : "Apply style"
          }
        >
          {applyDisabled && isApplyHovered ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.404 4.99l9.606 9.606a6 6 0 00-9.606-9.606zm-1.3 1.3a6 6 0 009.606 9.606L4.104 6.29z" />
            </svg>
          ) : isApplying ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
              Applying...
            </span>
          ) : (
            "Apply"
          )}
        </button>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
