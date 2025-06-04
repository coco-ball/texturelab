import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTextures } from "../context/TextureContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { textures, loading } = useTextures();
  const [content, setContent] = useState<"home" | "blendmode" | "info">("home");

  const handleClick = (id: string) => {
    navigate(`/texture/${id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left column: thumbnails */}
      <div className="w-1/2 bg-black overflow-y-scroll p-4 space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          textures.map((texture) => (
            <img
              key={texture.id}
              src={`/textures/${texture.thumbnail.replace(/^\.\/|^\/+/, "")}`}
              alt={texture.title}
              className="w-full cursor-pointer filter grayscale hover:grayscale-0 transition duration-200"
              onClick={() => handleClick(texture.id)}
            />
          ))
        )}
      </div>

      {/* Right column: header + content */}
      <div className="w-1/2 p-[0.5rem]">
        {/* Header */}
        <header className="flex items-center justify-between mb-[2rem]">
          <p onClick={() => setContent("home")} className="cursor-pointer">
            Texture Lab
          </p>
          <div className="flex space-x-4 gap-[1.5rem]">
            <p
              onClick={() => setContent("blendmode")}
              className="cursor-pointer"
            >
              All About BlendMode
            </p>
            <p onClick={() => setContent("info")} className="cursor-pointer">
              Info
            </p>
          </div>
        </header>

        {/* Content area */}
        <div className="mt-8 space-y-3 text-sm text-gray-800 font-mono">
          {content === "home" &&
            textures.map((texture) => (
              <p
                key={texture.id}
                className="pb-[0.25rem] cursor-pointer"
                onClick={() => handleClick(texture.id)}
              >
                {texture.id} &nbsp;&nbsp; {texture.title}
              </p>
            ))}

          {content === "blendmode" && (
            <div>
              <h2 className="text-lg font-bold mb-2">What is Blend Mode?</h2>
              <p className="mb-1">
                Blend modes determine how layers visually interact with each
                other.
              </p>
              <p className="mb-1">
                Examples: <code>multiply</code>, <code>screen</code>,{" "}
                <code>overlay</code>, etc.
              </p>
              <p className="text-gray-500">
                Try hovering each thumbnail to compare blend effects.
              </p>
            </div>
          )}

          {content === "info" && (
            <div>
              <h2 className="text-lg font-bold mb-2">Project Info</h2>
              <p className="mb-1">Created by Chaewon Yu</p>
              <p className="mb-1">
                GitHub: https://github.com/coco-ball/texturelab
              </p>
              <p className="text-gray-500">Credit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
