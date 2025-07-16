import { Button, ConfigBarHeading, StrokeColorLayout } from "./common";
import { useConfig } from "@/context/useConfigContext";
import { AlignCenter, AlignLeft, AlignRight, Code, Pen } from "lucide-react";
import { Alphabet } from "../Icon/Alphabet";

export const TextConfig = () => {

  return (
    <>
      <StrokeColorLayout></StrokeColorLayout>
      <FontFamily></FontFamily>
      <FontSize></FontSize>
      <TextAlign></TextAlign>
    </>
  );
};
type FontType = "Arial" | "Poppins" | "Source Code Pro";
const FontFamily = () => {
  const { config, handleConfigChange } = useConfig();
  const buttons = [
    {
      component: <Pen size={12} />,
      altText: "Hand-draw",
      fontFamily: "Arial",
    },
    {
      component: <Alphabet size={12} />,
      altText: "Normal",
      fontFamily: "Poppins",
    },
    {
      component: <Code size={12} />,
      altText: "code",
      fontFamily: "Source Code Pro",
    },
  ];

  const handleFontChange = (data: FontType) => {
    handleConfigChange({ ...config, fontFamily: data });
  };
  return (
    <div className="flex flex-col gap-2">
      <ConfigBarHeading>Font Family</ConfigBarHeading>
      <div className="flex items-center gap-2">
        {buttons.map((data) => {
          const Component = data.component;
          return (
            <Button
              className={`${
                config.fontFamily === data.fontFamily
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground"
              } `}
              altText={data.altText}
              key={data.fontFamily}
              onClick={() => handleFontChange(data.fontFamily as FontType)}
            >
              {Component}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
type FontSizeType = "12" | "16" | "24" | "32";
const FontSize = () => {
  const { config, handleConfigChange } = useConfig();
  const handleFontSizeChange = (data: FontSizeType) => {
    handleConfigChange({ ...config, fontSize: data });
  };

  const buttons = [
    {
      component: "S",
      altText: "small",
      fontSize: "12",
    },
    {
      component: "M",
      altText: "Medium",
      fontSize: "16",
    },
    {
      component: "L",
      altText: "large",
      fontSize: "24",
    },
    {
      component: "XL",
      altText: "extra large",
      fontSize: "32",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <ConfigBarHeading>Font Size</ConfigBarHeading>
      <div className="flex items-center gap-2">
        {buttons.map((data) => {
          const Component = data.component;
          return (
            <Button
              onClick={() =>
                handleFontSizeChange(data.fontSize as FontSizeType)
              }
              className={`${
                data.fontSize === config.fontSize
                  ? "bg-sidebar-accent text-sidebar-accent-foreground text-xs shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground text-xs"
              } `}
              altText={data.altText}
              key={data.fontSize}
            >
              {Component}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
type TextAlignType = "left" | "center" | "right";
const TextAlign = () => {
  const { config, handleConfigChange } = useConfig();

  const handleTextAlign = (data: TextAlignType) => {
    handleConfigChange({ ...config, textAlignment: data });
  };

  const buttons = [
    {
      component: AlignLeft,
      altText: "align-left",
      align: "left",
    },
    {
      component: AlignCenter,
      altText: "align center",
      align: "center",
    },
    {
      component: AlignRight,
      altText: "align-right",
      align: "right",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <ConfigBarHeading>Text Align</ConfigBarHeading>
      <div className="flex items-center gap-2">
        {buttons.map((data) => {
          const Component = data.component;
          return (
            <Button
              className={`${
                data.align === config.textAlignment
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground"
              } `}
              altText={data.altText}
              key={data.align}
              onClick={() => handleTextAlign(data.align as TextAlignType)}
            >
              {<Component size={12} />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
