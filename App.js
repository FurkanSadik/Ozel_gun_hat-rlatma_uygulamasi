import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
