import { useState } from "react";
import type { TextureData } from "../types";
import "./TextureViewer.css";

export default function TextureViewer({
  selectedTexture,
}: {
  selectedTexture: TextureData;
}) {
  const [offset, setOffset] = useState(0);
  const [showGridView, setShowGridView] = useState(false);

  const texture = selectedTexture;

  return (
    <div className="viewer-container">
      <button
        className="toggle-grid-btn"
        onClick={() => setShowGridView(!showGridView)}
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
                src={`/textures/${layer.src?.replace(/^\.\/|^\/+/, "")}`}
                alt={layer.name}
                style={{
                  width: "300px",
                  objectFit: "cover",
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
              width: texture.size?.[0] || 960,
              height: texture.size?.[1] || 540,
              position: "relative",
              overflow: "visible",
              margin: "0 auto",
            }}
          >
            {texture.layers.map((layer, i) => {
              const commonStyle: React.CSSProperties = {
                position: "absolute",
                boxShadow: "10px 30px 8px rgba(0, 0, 0, 0.15)",
                top: "50%",
                left: "50%",
                width: `${texture.size?.[0] || 960}px`,
                height: `${texture.size?.[1] || 540}px`,
                filter: `blur(${i * offset * 0.03}px)`,
                transform: `translate(-50%, -50%) translate(${
                  i * offset * 5
                }px, 0)`,
                transition: "transform 0.3s ease, filter 0.3s ease",
                pointerEvents: "none",
              };

              if (layer.type === "color") {
                return (
                  <div
                    key={i}
                    style={{ ...commonStyle, backgroundColor: layer.baseColor }}
                  />
                );
              }

              return (
                <img
                  key={i}
                  src={`/textures/${layer.src?.replace(/^\.\/|^\/+/, "")}`}
                  alt={layer.name}
                  style={{
                    ...commonStyle,
                    mixBlendMode: layer.blendMode ?? "normal",
                    opacity: layer.opacity ?? 1,
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
                  ) : (
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
                  )}
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
        </>
      )}
    </div>
  );
}
