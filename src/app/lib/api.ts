// Cliente REST único do frontend. Em produção VITE_API_URL aponta para o Cloud Run;
// em dev/docker-compose ficamos com string vazia e usamos o proxy /api do nginx/vite.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* corpo não-JSON */ }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// --- Identidade anônima persistente (sem login para esta entrega) ---
const USER_ID_KEY = "crytto-user-id";
const USERNAME_KEY = "crytto-username";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "u-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function getOrCreateUsername(): string {
  let username = localStorage.getItem(USERNAME_KEY);
  if (!username) {
    username = "crytto_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(USERNAME_KEY, username);
  }
  return username;
}

// --- Tipos que atravessam a API ---
export interface ApiUser {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  user_type: "master" | "player";
  balance: number;
  avatar_url: string | null;
  banner_type: string;
  banner_colors: string[];
  settings: Record<string, unknown>;
}

export interface ApiCharacter {
  id: string;
  user_id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  avatar_url?: string;
  hp: { current: number; max: number };
  ac: number;
  stats: Record<string, number>;
  skills: string[];
  backstory: string;
  status: "active" | "inactive" | "dead";
  player_name?: string;
}

export interface ApiMarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  downloads: number;
  author: string;
  author_id: string;
  tags: string[];
  images: string[];
  created_at: string;
}

export interface ApiCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: "session" | "planning" | "oneshot" | "campaign";
  players: string[];
  max_players: number;
  maxPlayers: number;
  is_recurring: boolean;
  isRecurring: boolean;
  recurring_type?: string;
  recurringType?: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  reminder: boolean;
  is_public: boolean;
  isPublic: boolean;
}

// --- Users ---
export const usersApi = {
  ensure(id: string, username: string, user_type: "master" | "player" = "player") {
    return request<ApiUser>("/api/users", {
      method: "POST",
      body: JSON.stringify({ id, username, display_name: username, user_type }),
    });
  },
  get(id: string) {
    return request<ApiUser>(`/api/users/${id}`);
  },
  update(id: string, patch: Partial<ApiUser> & { settings?: Record<string, unknown> }) {
    return request<ApiUser>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  setBalance(id: string, balance: number) {
    return request<{ balance: number }>(`/api/users/${id}/balance`, {
      method: "PUT",
      body: JSON.stringify({ balance }),
    });
  },
};

// --- Characters ---
export const charactersApi = {
  list(userId: string) {
    return request<ApiCharacter[]>(`/api/characters/${userId}`);
  },
  create(character: Partial<ApiCharacter> & { user_id: string; name: string }) {
    const id = character.id || uuid();
    return request<ApiCharacter>("/api/characters", {
      method: "POST",
      body: JSON.stringify({ ...character, id }),
    });
  },
  update(id: string, patch: Partial<ApiCharacter>) {
    return request<ApiCharacter>(`/api/characters/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  remove(id: string) {
    return request<{ success: boolean }>(`/api/characters/${id}`, { method: "DELETE" });
  },
};

// --- Marketplace ---
export const marketplaceApi = {
  list(params: { category?: string; search?: string } = {}) {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.search) qs.set("search", params.search);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<ApiMarketplaceItem[]>(`/api/marketplace${suffix}`);
  },
  create(item: Partial<ApiMarketplaceItem>) {
    const id = item.id || uuid();
    return request<ApiMarketplaceItem>("/api/marketplace", {
      method: "POST",
      body: JSON.stringify({ ...item, id }),
    });
  },
  update(id: string, patch: Partial<ApiMarketplaceItem>) {
    return request<ApiMarketplaceItem>(`/api/marketplace/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  remove(id: string) {
    return request<{ success: boolean }>(`/api/marketplace/${id}`, { method: "DELETE" });
  },
  purchase(id: string, userId: string) {
    return request<{ success: boolean; new_balance: number }>(`/api/marketplace/${id}/purchase`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },
  purchases(userId: string) {
    return request<string[]>(`/api/purchases/${userId}`);
  },
};

// --- Calendar ---
export const calendarApi = {
  list(userId: string) {
    return request<ApiCalendarEvent[]>(`/api/calendar/${userId}`);
  },
  create(event: Partial<ApiCalendarEvent> & { user_id: string; title: string }) {
    const id = event.id || uuid();
    return request<ApiCalendarEvent>("/api/calendar", {
      method: "POST",
      body: JSON.stringify({ ...event, id }),
    });
  },
  update(id: string, patch: Partial<ApiCalendarEvent>) {
    return request<ApiCalendarEvent>(`/api/calendar/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  remove(id: string) {
    return request<{ success: boolean }>(`/api/calendar/${id}`, { method: "DELETE" });
  },
};

export function apiHealth() {
  return request<{ status: string; db: string }>("/health");
}
