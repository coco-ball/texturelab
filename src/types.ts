export interface ImageLayer {
  type: "img";
  src: string;
  name: string;
  blendMode: React.CSSProperties["mixBlendMode"];
  opacity: number;
}

export interface ColorLayer {
  type: "color";
  baseColor: string;
}

export type TextureLayer = ImageLayer | ColorLayer;

export interface TextureData {
  id: string;
  title: string;
  description: string;
  size: [number, number];
  baseColor?: string;
  thumbnail: string;
  layers: TextureLayer[];
}
