import { useEffect, useState } from "react";
import "./TextureViewer.css";

interface TextureLayer {
  src: string;
  name: string;
  blendMode: React.CSSProperties["mixBlendMode"];
  opacity: number;
}

interface TextureData {
  id: string;
  title: string;
  description: string;
  size: [number, number];
  baseColor?: string;
  layers: TextureLayer[];
}

export default function TextureViewer() {
  const [textures, setTextures] = useState<TextureData[]>([]);
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetch("../../public/textures/meta.json")
      .then((res) => res.json())
      .then((data) => setTextures(data.textures))
      .catch((err) => console.error("Failed to load meta.json", err));
  }, []);

  if (textures.length === 0) return <p>Loading...</p>;

  const texture = textures[index];

  const handlePrev = () =>
    setIndex((i) => (i - 1 + textures.length) % textures.length);
  const handleNext = () => setIndex((i) => (i + 1) % textures.length);

  return (
    <div className="viewer-container">
      <div
        className="texture-wrapper"
        style={{
          backgroundColor: texture.baseColor || "#000",
          width: texture.size[0],
          height: texture.size[1],
          position: "relative",
        }}
      >
        {texture.layers.map((layer, i) => (
          <img
            key={i}
            src={`/textures/${layer.src.replace(/^\.\/|^\/+/, "")}`}
            alt={layer.name}
            className="texture-layer"
            style={{
              mixBlendMode: layer.blendMode,
              opacity: layer.opacity,
              transform: `translate(${offset * i}px, ${offset * i}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <div className="slider-caption">
        <input
          type="range"
          min="0"
          max="30"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
        />
        <ul className="caption-list">
          {texture.layers.map((layer, i) => (
            <li key={i}>
              {layer.name} — <code>{layer.blendMode}</code>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-buttons">
        <button onClick={handlePrev}>{"<"}</button>
        <button onClick={handleNext}>{">"}</button>
      </div>
    </div>
  );
}
