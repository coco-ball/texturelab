import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { TextureData } from "../types";

const TextureContext = createContext<{
  textures: TextureData[];
  loading: boolean;
}>({
  textures: [],
  loading: true,
});

export const TextureProvider = ({ children }: { children: ReactNode }) => {
  const [textures, setTextures] = useState<TextureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/textures/meta.json")
      .then((res) => res.json())
      .then((data) => {
        setTextures(data.textures);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <TextureContext.Provider value={{ textures, loading }}>
      {children}
    </TextureContext.Provider>
  );
};

export const useTextures = () => useContext(TextureContext);
