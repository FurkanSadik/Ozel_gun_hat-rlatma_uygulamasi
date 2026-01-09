import React, { createContext, useContext, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../theme/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const value = useMemo(() => {
    const theme = mode === "dark" ? darkTheme : lightTheme;
    return {
      mode,
      theme,
      setMode,
      toggleTheme: () => setMode((p) => (p === "dark" ? "light" : "dark"))
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeContext.Provider yok. App.js içinde ThemeProvider sarmaladığından emin ol.");
  return ctx;
}
