// Persistência de rota/navegação em localStorage
type Screen = "landing" | "dashboard" | "stream" | "profile" | "marketplace" | "profile-edit" | "immersive-intro" | "character-sheet" | "audio-center" | "customizer" | "character-manager" | "replay-player" | "enhanced-marketplace" | "crytts-shop" | "calendar" | "theme-customizer" | "user-type-selection" | "achievements";

const CURRENT_SCREEN_KEY = "crytto-current-screen";

// Telas que não devem ser persistidas (transitórias)
const UNPERSISTABLE_SCREENS: Screen[] = ["user-type-selection", "immersive-intro", "character-sheet"];

export function saveCurrentScreen(screen: Screen): void {
  if (!UNPERSISTABLE_SCREENS.includes(screen)) {
    localStorage.setItem(CURRENT_SCREEN_KEY, screen);
  }
}

export function getLastScreen(defaultScreen: Screen): Screen {
  const saved = localStorage.getItem(CURRENT_SCREEN_KEY);
  if (saved && isValidScreen(saved)) {
    return saved as Screen;
  }
  return defaultScreen;
}

function isValidScreen(value: string): value is Screen {
  const validScreens: Screen[] = [
    "landing", "dashboard", "stream", "profile", "marketplace", "profile-edit",
    "immersive-intro", "character-sheet", "audio-center", "customizer", "character-manager",
    "replay-player", "enhanced-marketplace", "crytts-shop", "calendar", "theme-customizer",
    "user-type-selection", "achievements"
  ];
  return validScreens.includes(value as Screen);
}

export function clearNavigationState(): void {
  localStorage.removeItem(CURRENT_SCREEN_KEY);
}
