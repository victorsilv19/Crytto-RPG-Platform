// Persistência local de personagens (fonte de verdade), garantindo que os dados
// sobrevivam ao refresh mesmo sem o backend rodando. As chamadas à API continuam
// existentes no app como sincronização "best-effort", mas não são obrigatórias.

export interface StoredCharacter {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  avatarUrl?: string;
  hp: { current: number; max: number };
  ac: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  backstory: string;
  playerName?: string;
  status: "active" | "inactive" | "dead";
}

const keyFor = (userId: string) => `crytto-characters:${userId}`;

export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "c-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function listCharacters(userId: string): StoredCharacter[] {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId)) || "[]");
  } catch {
    return [];
  }
}

function writeAll(userId: string, characters: StoredCharacter[]): void {
  localStorage.setItem(keyFor(userId), JSON.stringify(characters));
}

// Insere ou atualiza um personagem e devolve a lista atualizada.
export function upsertCharacter(userId: string, character: StoredCharacter): StoredCharacter[] {
  const list = listCharacters(userId);
  const idx = list.findIndex((c) => c.id === character.id);
  if (idx >= 0) list[idx] = character;
  else list.unshift(character);
  writeAll(userId, list);
  return list;
}

export function removeCharacter(userId: string, id: string): StoredCharacter[] {
  const list = listCharacters(userId).filter((c) => c.id !== id);
  writeAll(userId, list);
  return list;
}
