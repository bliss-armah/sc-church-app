import { createSlice } from "@reduxjs/toolkit";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  systemTheme: "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const getStoredTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored;
    }
  }
  return "system";
};

const initialState: ThemeState = {
  theme: getStoredTheme(),
  systemTheme: getSystemTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
    setSystemTheme: (state, action) => {
      state.systemTheme = action.payload;
    },
  },
});

export const { setTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
