import { describe, it, expect, beforeEach } from "vitest";
import { saveCurrentScreen, getLastScreen, clearNavigationState } from "../app/lib/navigation";

describe("navigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve salvar e recuperar a última tela", () => {
    saveCurrentScreen("dashboard");
    expect(getLastScreen("landing")).toBe("dashboard");
  });

  it("deve retornar a tela padrão quando nada foi salvo", () => {
    expect(getLastScreen("landing")).toBe("landing");
  });

  it("não deve persistir telas transitórias", () => {
    saveCurrentScreen("user-type-selection");
    expect(getLastScreen("dashboard")).toBe("dashboard");
  });

  it("não deve persistir a tela de ficha de personagem", () => {
    saveCurrentScreen("character-sheet");
    expect(getLastScreen("dashboard")).toBe("dashboard");
  });

  it("deve limpar o estado de navegação", () => {
    saveCurrentScreen("profile");
    clearNavigationState();
    expect(getLastScreen("dashboard")).toBe("dashboard");
  });

  it("deve retornar a tela padrão para valores inválidos no localStorage", () => {
    localStorage.setItem("crytto-current-screen", "tela-inexistente");
    expect(getLastScreen("dashboard")).toBe("dashboard");
  });
});