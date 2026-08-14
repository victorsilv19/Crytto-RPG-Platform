import { describe, it, expect, beforeEach } from "vitest";
import {
  listCharacters,
  upsertCharacter,
  removeCharacter,
  uuid,
  type StoredCharacter,
} from "../app/lib/characterStore";

const makeCharacter = (id: string, name: string): StoredCharacter => ({
  id,
  name,
  class: "Guerreiro",
  level: 1,
  race: "Humano",
  background: "Soldado",
  hp: { current: 10, max: 10 },
  ac: 10,
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  skills: [],
  backstory: "",
  status: "active",
});

describe("characterStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve retornar lista vazia para usuário sem personagens", () => {
    expect(listCharacters("user-1")).toEqual([]);
  });

  it("deve retornar lista vazia para userId vazio", () => {
    expect(listCharacters("")).toEqual([]);
  });

  it("deve adicionar um personagem", () => {
    const char = makeCharacter("char-1", "Aragorn");
    const list = upsertCharacter("user-1", char);

    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("Aragorn");
    expect(listCharacters("user-1")).toHaveLength(1);
  });

  it("deve atualizar um personagem existente", () => {
    const char = makeCharacter("char-1", "Aragorn");
    upsertCharacter("user-1", char);

    const updated = { ...char, level: 5 };
    const list = upsertCharacter("user-1", updated);

    expect(list).toHaveLength(1);
    expect(list[0].level).toBe(5);
  });

  it("deve manter personagens de usuários diferentes isolados", () => {
    upsertCharacter("user-1", makeCharacter("char-1", "Aragorn"));
    upsertCharacter("user-2", makeCharacter("char-2", "Legolas"));

    expect(listCharacters("user-1")).toHaveLength(1);
    expect(listCharacters("user-2")).toHaveLength(1);
    expect(listCharacters("user-1")[0].name).toBe("Aragorn");
    expect(listCharacters("user-2")[0].name).toBe("Legolas");
  });

  it("deve remover um personagem", () => {
    upsertCharacter("user-1", makeCharacter("char-1", "Aragorn"));
    upsertCharacter("user-1", makeCharacter("char-2", "Legolas"));

    const list = removeCharacter("user-1", "char-1");

    expect(list).toHaveLength(1);
    expect(list[0].id).toBe("char-2");
  });

  it("deve gerar UUIDs únicos", () => {
    const id1 = uuid();
    const id2 = uuid();
    expect(id1).not.toBe(id2);
  });

  it("deve lidar com dados corrompidos no localStorage", () => {
    localStorage.setItem("crytto-characters:user-1", "{invalid json");
    expect(listCharacters("user-1")).toEqual([]);
  });
});