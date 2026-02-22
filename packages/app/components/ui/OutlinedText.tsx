import React from "react";
import { View } from "react-native";
import { Defs, LinearGradient, Stop, Svg, Text } from "react-native-svg";

type FontWeights = {
  // Values
  "100": "100";
  "200": "200";
  "300": "300";
  "400": "400";
  "500": "500";
  "600": "600";
  "700": "700";
  "800": "800";
  "900": "900";
  // Words
  thin: "100";
  extraLight: "200";
  ultraLight: "200";
  light: "300";
  normal: "400";
  regular: "400";
  medium: "500";
  semiBold: "600";
  bold: "700";
  extraBold: "800";
  black: "900";
};

export type OutlinedTextProps = {
  // Font characteristics
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: keyof FontWeights;
  letterSpacing?: number;
  fontStyle?: "normal" | "italic";
  // Positioning and size
  x?: number;
  y?: number;
  width: number;
  height?: number;
  textAnchor?: "start" | "middle" | "end";
  // Appearance
  opacity?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowBlur?: number;
  // Contents
  children?: React.ReactNode | undefined;
};

const buildFillGradient = (fillColor: string) => {
  const match = fillColor.match(/^linear-gradient\(([^,]+),(.+)\)$/i);

  // If fillColor contains "linear-gradient", then iterate on it and build a gradient
  const colors: Array<string> = [];

  // fillColor is a linear-gradient
  if (match) {
    // const direction = match[1].trim();
    match[2]
      .split(",")
      .map((s) => s.trim())
      .map((s) => colors.push(s));
  } else {
    colors.push(fillColor);
  }

  return (
    <LinearGradient id="grad" x1="0.50" y1="0" x2="0.50" y2="1">
      {colors.map((color, index) => {
        return (
          <Stop key={index} offset={index} stopColor={color} stopOpacity={1} />
        );
      })}
    </LinearGradient>
  );
};

// Helper function to generate blur layers (from @donkasun)
const generateBlurLayers = (
  shadowBlur: number,
): Array<{ offsetX: number; offsetY: number; opacity: number }> => {
  if (shadowBlur <= 0) return [];

  const layers: Array<{ offsetX: number; offsetY: number; opacity: number }> =
    [];
  const maxLayers = Math.min(Math.floor(shadowBlur / 2), 8); // Limit to 8 layers for performance

  for (let i = 1; i <= maxLayers; i++) {
    const progress = i / maxLayers;
    const offset = (shadowBlur * progress) / 2;
    const opacity = (1 - progress) * 0.3; // Fade out as we go further

    // Create multiple offset positions around the main shadow
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    angles.forEach((angle) => {
      const rad = (angle * Math.PI) / 180;
      layers.push({
        offsetX: Math.cos(rad) * offset,
        offsetY: Math.sin(rad) * offset,
        opacity: opacity / angles.length,
      });
    });
  }

  return layers;
};

export function OutlinedText({
  // Font characteristics
  fontSize = 16,
  fontFamily,
  fontWeight = "400",
  letterSpacing,
  fontStyle = "normal",
  // Positioning and size
  x,
  y,
  width,
  height,
  textAnchor = "middle",
  // Appearance
  opacity = 1,
  fillColor = "#000000",
  strokeColor = "#FFFFFF",
  strokeWidth = 1,
  shadowColor = "#000000",
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  shadowBlur = 1,
  shadowOpacity = 0,
  // Contents
  children,
}: OutlinedTextProps) {
  const computedX =
    textAnchor === "start" ? 0 : textAnchor === "end" ? width : width / 2;
  const computedY = 30;

  const baseTextProps = {
    x: computedX,
    y: computedY,
    opacity,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    textAnchor,
    ...(letterSpacing && { letterSpacing }),
  };

  const blurLayers = generateBlurLayers(shadowBlur);

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <Svg width={width} height={height ?? 100}>
        <Defs>
          {/* Linear Gradient for the text color. If only one color is given, then there's only one line. */}
          {buildFillGradient(fillColor)}
        </Defs>
        {/* Blur shadow layers */}
        {blurLayers.map((layer, layerIndex) => (
          <Text
            key={`blur-${layerIndex}`}
            {...baseTextProps}
            fill={shadowColor}
            opacity={shadowOpacity * layer.opacity}
            x={computedX + shadowOffsetX + layer.offsetX}
            y={computedY + shadowOffsetY + layer.offsetY}
          >
            {children}
          </Text>
        ))}
        {/* Stroke Text */}
        {strokeColor && strokeWidth && (
          <Text
            fill="none"
            {...baseTextProps}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          >
            {children}
          </Text>
        )}
        {/* Fill Text */}
        <Text fill="url(#grad)" {...baseTextProps}>
          {children}
        </Text>
      </Svg>
    </View>
  );
}
