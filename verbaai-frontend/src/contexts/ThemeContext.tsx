import {
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./theme.context";
import type { Theme } from "./theme.context";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove(
      "light",
      "dark"
    );

    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
