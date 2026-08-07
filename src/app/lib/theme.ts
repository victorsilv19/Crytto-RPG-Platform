// Tema centralizado: definições, aplicação nas CSS variables e restauração via localStorage.
// Antes o tema só era aplicado quando a tela ThemeCustomizer era montada, então ao dar F5
// as cores voltavam ao padrão. Agora `applyStoredTheme()` roda no boot do app (main.tsx).

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  muted: string;
  accent: string;
  border: string;
  card: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  isCustom?: boolean;
}

export const THEME_KEY = "crytto-theme";
export const CUSTOM_COLORS_KEY = "crytto-custom-colors";

export const defaultCustomColors: ThemeColors = {
  background: "#0a0a0a",
  foreground: "#e5e5e5",
  primary: "#b91c1c",
  primaryForeground: "#ffffff",
  secondary: "#262626",
  muted: "#262626",
  accent: "#404040",
  border: "rgba(185, 28, 28, 0.2)",
  card: "#1a1a1a",
};

export const predefinedThemes: Theme[] = [
  {
    id: "default",
    name: "Crytto Clássico",
    description: "Tema vermelho sangue padrão",
    colors: { ...defaultCustomColors },
  },
  {
    id: "dragon",
    name: "Fúria do Dragão",
    description: "Vermelho intenso com dourado",
    colors: {
      background: "#0f0f0f",
      foreground: "#fbbf24",
      primary: "#dc2626",
      primaryForeground: "#fbbf24",
      secondary: "#451a03",
      muted: "#451a03",
      accent: "#92400e",
      border: "rgba(220, 38, 38, 0.3)",
      card: "#1c1917",
    },
  },
  {
    id: "mystic",
    name: "Místico Roxo",
    description: "Tons de púrpura e violeta",
    colors: {
      background: "#0c0a15",
      foreground: "#e4d4f7",
      primary: "#7c3aed",
      primaryForeground: "#ffffff",
      secondary: "#2e1065",
      muted: "#2e1065",
      accent: "#5b21b6",
      border: "rgba(124, 58, 237, 0.2)",
      card: "#1e1b31",
    },
  },
  {
    id: "forest",
    name: "Guardião da Floresta",
    description: "Verde natural e terroso",
    colors: {
      background: "#0a0f0a",
      foreground: "#dcfce7",
      primary: "#16a34a",
      primaryForeground: "#ffffff",
      secondary: "#14532d",
      muted: "#14532d",
      accent: "#166534",
      border: "rgba(22, 163, 74, 0.2)",
      card: "#1a251a",
    },
  },
  {
    id: "ocean",
    name: "Profundezas do Oceano",
    description: "Azul profundo e aquático",
    colors: {
      background: "#020617",
      foreground: "#dbeafe",
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#0c4a6e",
      muted: "#0c4a6e",
      accent: "#0369a1",
      border: "rgba(14, 165, 233, 0.2)",
      card: "#0f172a",
    },
  },
  {
    id: "shadow",
    name: "Reino das Sombras",
    description: "Preto e prata minimalista",
    colors: {
      background: "#000000",
      foreground: "#f1f5f9",
      primary: "#64748b",
      primaryForeground: "#ffffff",
      secondary: "#1e293b",
      muted: "#1e293b",
      accent: "#334155",
      border: "rgba(100, 116, 139, 0.2)",
      card: "#0f172a",
    },
  },
  {
    id: "gold",
    name: "Tesouro Dourado",
    description: "Dourado luxuoso com marrom",
    colors: {
      background: "#1c1917",
      foreground: "#fbbf24",
      primary: "#f59e0b",
      primaryForeground: "#1c1917",
      secondary: "#451a03",
      muted: "#451a03",
      accent: "#92400e",
      border: "rgba(245, 158, 11, 0.2)",
      card: "#292524",
    },
  },
];

// Escreve as cores do tema nas CSS variables do <html>.
export function applyThemeColors(colors: ThemeColors): void {
  const root = document.documentElement;
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--card-foreground", colors.foreground);
  root.style.setProperty("--popover", colors.card);
  root.style.setProperty("--popover-foreground", colors.foreground);
  root.style.setProperty("--muted-foreground", colors.foreground + "99");
  root.style.setProperty("--accent-foreground", colors.foreground);
  root.style.setProperty("--input-background", colors.secondary);
  root.style.setProperty("--ring", colors.primary);
}

// Restaura o tema salvo em localStorage. Chamado no boot para que o F5 mantenha o tema.
export function applyStoredTheme(): void {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY) || "default";
    if (savedTheme === "custom") {
      const savedColors = localStorage.getItem(CUSTOM_COLORS_KEY);
      applyThemeColors(savedColors ? JSON.parse(savedColors) : defaultCustomColors);
      return;
    }
    const theme = predefinedThemes.find((t) => t.id === savedTheme) || predefinedThemes[0];
    applyThemeColors(theme.colors);
  } catch {
    applyThemeColors(predefinedThemes[0].colors);
  }
}
