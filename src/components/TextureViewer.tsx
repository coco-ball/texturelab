import { useEffect, useState } from "react";
import "./TextureViewer.css";

interface ImageLayer {
  type: "img";
  src: string;
  name: string;
  blendMode: React.CSSProperties["mixBlendMode"];
  opacity: number;
}

interface ColorLayer {
  type: "color";
  baseColor: string;
}

type TextureLayer = ImageLayer | ColorLayer;

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
  const [showGridView, setShowGridView] = useState(false);

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
      <button
        className="toggle-grid-btn"
        onClick={() => setShowGridView((prev) => !prev)}
      >
        {showGridView ? "Back" : "Layers"}
      </button>

      {showGridView ? (
        <div className="grid-view">
          {texture.layers
            .filter((l) => l.type === "img")
            .map((layer, i) => (
              <img
                key={i}
                src={`/textures/${(layer as ImageLayer).src.replace(
                  /^\.\/|^\/+/,
                  ""
                )}`}
                alt={(layer as ImageLayer).name}
                style={{
                  width: "300px",
                  objectFit: "cover",
                  // borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                  mixBlendMode: "normal",
                  opacity: 1,
                }}
              />
            ))}
        </div>
      ) : (
        <>
          <div
            className="texture-wrapper"
            style={{
              backgroundColor: texture.baseColor || "#000",
              width: texture.size[0],
              height: texture.size[1],
              position: "relative",
              overflow: "visible",
            }}
          >
            {texture.layers.map((layer, i) => {
              const commonStyle: React.CSSProperties = {
                position: "absolute",
                boxShadow: "10px 30px 8px rgba(0, 0, 0, 0.15)",
                top: "50%",
                left: "50%",
                width: `${texture.size[0]}px`,
                height: `${texture.size[1]}px`,
                filter: `blur(${i * offset * 0.03}px)`,
                transform: `
                  translate(-50%, -50%)
                  translate(${i * offset * 5}px, 0)
                `,
                transition: "transform 0.3s ease, filter 0.3s ease",
                pointerEvents: "none",
              };

              if (layer.type === "color") {
                return (
                  <div
                    key={i}
                    style={{
                      ...commonStyle,
                      backgroundColor: layer.baseColor,
                    }}
                  />
                );
              }

              return (
                <img
                  key={i}
                  src={`/textures/${layer.src.replace(/^\.\/|^\/+/, "")}`}
                  alt={layer.name}
                  style={{
                    ...commonStyle,
                    mixBlendMode: layer.blendMode,
                    opacity: layer.opacity,
                    objectFit: "cover",
                  }}
                />
              );
            })}
          </div>

          <div className="slider-caption">
            <ul className="caption-list">
              {texture.layers.map((layer, i) => (
                <li key={i}>
                  {layer.type === "img" ? (
                    <>
                      {i} {layer.name} {layer.blendMode?.replace("-", " ")}
                    </>
                  ) : layer.type === "color" ? (
                    <>
                      base color
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.6em",
                          height: "0.6em",
                          backgroundColor: layer.baseColor,
                          borderRadius: "1px",
                          marginLeft: "0.5em",
                          border: "1px solid black",
                        }}
                      />
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
            <input
              className="slider"
              type="range"
              min="0"
              max="20"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </div>

          <div className="nav-buttons">
            <button onClick={handlePrev}>{"<"}</button>
            <button onClick={handleNext}>{">"}</button>
          </div>
        </>
      )}
    </div>
  );
}
