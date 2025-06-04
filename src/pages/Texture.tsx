import { useParams } from "react-router-dom";
import { useTextures } from "../context/TextureContext";
import { useEffect, useState } from "react";
import TextureViewer from "../components/TextureViewer";

const STEP_HEIGHT = 600;
const VIEWER_TRIGGER_OFFSET = 100;

export default function TexturePage() {
  const { id } = useParams();
  const { textures } = useTextures();
  const texture = textures.find((t) => t.id === id);

  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [inViewerMode, setInViewerMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!texture) return;

      const maxIndex = texture.layers.length - 1;
      const scrollTop = window.scrollY;
      const viewerTriggerPoint =
        STEP_HEIGHT * texture.layers.length + VIEWER_TRIGGER_OFFSET;

      // 진입: Viewer 모드
      if (!inViewerMode && scrollTop >= viewerTriggerPoint) {
        setInViewerMode(true);
        return;
      }

      // 복귀: 스크롤을 위로 올리면 다시 레이어 모드로
      if (inViewerMode && scrollTop < viewerTriggerPoint) {
        setInViewerMode(false);
      }

      // 레이어 인덱스 업데이트는 ViewerMode 아닐 때만
      if (!inViewerMode) {
        const step = Math.floor(scrollTop / STEP_HEIGHT);
        setCurrentLayerIndex(Math.min(step, maxIndex));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [texture, inViewerMode]);

  if (!texture) return <div>Texture not found</div>;

  const baseColor = texture.baseColor || "#ffffff";
  const totalHeight = STEP_HEIGHT * texture.layers.length + 1000;

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: baseColor,
        height: `${totalHeight}px`,
      }}
    >
      {/* inViewerMode */}
      {inViewerMode && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999]">
          <TextureViewer selectedTexture={texture} />
        </div>
      )}

      {!inViewerMode &&
        texture.layers.map((layer, idx) => {
          const isVisible = idx <= currentLayerIndex;

          const commonStyle: React.CSSProperties = {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: idx,
            transition: "opacity 0.3s ease",
          };

          if (layer.type === "color") {
            return (
              <div
                key={idx}
                style={{
                  ...commonStyle,
                  backgroundColor: layer.baseColor,
                  opacity: isVisible ? 1 : 0,
                }}
              />
            );
          }

          return (
            <img
              key={idx}
              src={`/textures/${layer.src.replace(/^\.\/|^\/+/, "")}`}
              alt={layer.name}
              style={{
                ...commonStyle,
                objectFit: "cover",
                mixBlendMode: layer.blendMode ?? "normal",
                opacity: isVisible ? layer.opacity ?? 1 : 0,
              }}
            />
          );
        })}
    </div>
  );
}
