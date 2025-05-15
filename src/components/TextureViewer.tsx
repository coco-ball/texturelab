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
          overflow: "visible",
          // perspective: "1000px",
        }}
      >
        {texture.layers.map((layer, i) => (
          <img
            key={i}
            src={`/textures/${layer.src.replace(/^\.\/|^\/+/, "")}`}
            alt={layer.name}
            style={{
              mixBlendMode: layer.blendMode,
              opacity: layer.opacity,
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${texture.size[0]}px`,
              height: `${texture.size[1]}px`,
              objectFit: "cover",
              transform: `
          translate(-50%, -50%)
          translate(${offset * i * 5}px, ${offset * i * 0}px)
        `,
              //       transform: `
              //   translate(-50%, -50%)
              //   translateZ(${offset * i}px)
              //   translate(${offset * i * 2}px, ${offset * i * 0}px)
              //   scale(${1 - i * 0.02})
              // `,
              // filter: `blur(${i * offset * 0.05}px)`,
              transition: "transform 0.3s ease, filter 0.3s ease",
              transformStyle: "preserve-3d",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      <div className="slider-caption">
        <input
          type="range"
          min="0"
          max="50"
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
