import { describe, it, expect, beforeEach } from "vitest";
import { userKey, migrateUserKeys } from "../app/lib/userStorage";

describe("userStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve separar o estado por conta", () => {
    localStorage.setItem(userKey("userTypeSelected", "a"), "master");
    expect(localStorage.getItem(userKey("userTypeSelected", "b"))).toBeNull();
  });

  it("deve migrar o estado quando o id do usuário muda", () => {
    localStorage.setItem(userKey("userTypeSelected", "old"), "player");
    migrateUserKeys("old", "new");
    expect(localStorage.getItem(userKey("userTypeSelected", "new"))).toBe("player");
  });

  it("não deve sobrescrever o estado já existente do novo id", () => {
    localStorage.setItem(userKey("userTypeSelected", "old"), "player");
    localStorage.setItem(userKey("userTypeSelected", "new"), "master");
    migrateUserKeys("old", "new");
    expect(localStorage.getItem(userKey("userTypeSelected", "new"))).toBe("master");
  });
});
