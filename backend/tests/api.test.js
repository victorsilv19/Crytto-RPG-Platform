const request = require("supertest");

// Mock do pool do pg antes de importar o app
const mockQuery = jest.fn();
const mockConnect = jest.fn();

jest.mock("pg", () => {
  const { Pool } = jest.requireActual("pg");
  return {
    Pool: jest.fn().mockImplementation(() => ({
      query: mockQuery,
      connect: mockConnect,
    })),
  };
});

const { app } = require("../src/app");

describe("API Crytto RPG Platform", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /health", () => {
    it("deve retornar status ok quando o banco está acessível", async () => {
      mockQuery.mockResolvedValue({ rows: [{ "?column?": 1 }] });

      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "ok", db: "up" });
    });

    it("deve retornar 503 quando o banco está indisponível", async () => {
      mockQuery.mockRejectedValue(new Error("connection refused"));

      const res = await request(app).get("/health");

      expect(res.status).toBe(503);
      expect(res.body).toEqual({ status: "degraded", db: "down" });
    });
  });

  describe("GET /api/users/:id", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const user = { id: "user-1", username: "mestre", balance: 1250 };
      mockQuery.mockResolvedValue({ rows: [user] });

      const res = await request(app).get("/api/users/user-1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = $1",
        ["user-1"]
      );
    });

    it("deve retornar 404 quando o usuário não existe", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const res = await request(app).get("/api/users/nao-existe");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Usuário não encontrado" });
    });
  });

  describe("POST /api/users", () => {
    it("deve criar um usuário com sucesso", async () => {
      const created = { id: "user-1", username: "mestre", balance: 1250 };
      mockQuery.mockResolvedValue({ rows: [created] });

      const res = await request(app)
        .post("/api/users")
        .send({ id: "user-1", username: "mestre" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
    });

    it("deve retornar 400 quando id ou username estão ausentes", async () => {
      const res = await request(app).post("/api/users").send({ id: "user-1" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "id e username são obrigatórios" });
    });
  });

  describe("GET /api/marketplace", () => {
    it("deve listar itens do marketplace", async () => {
      const items = [
        { id: "item-1", title: "Mapa", price: 50 },
        { id: "item-2", title: "Aventura", price: 120 },
      ];
      mockQuery.mockResolvedValue({ rows: items });

      const res = await request(app).get("/api/marketplace");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe("Mapa");
    });

    it("deve filtrar por categoria", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await request(app).get("/api/marketplace?category=Mapas");

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("category = $1"),
        ["Mapas"]
      );
    });

    it("deve buscar por texto", async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await request(app).get("/api/marketplace?search=castelo");

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("ILIKE"),
        ["%castelo%"]
      );
    });
  });

  describe("POST /api/marketplace/:id/purchase", () => {
    it("deve retornar 404 quando o item não existe", async () => {
      const client = {
        query: jest
          .fn()
          .mockResolvedValueOnce({ rows: [] }) // BEGIN
          .mockResolvedValueOnce({ rows: [] }) // SELECT item
          .mockResolvedValueOnce({ rows: [] }), // ROLLBACK
        release: jest.fn(),
      };
      mockConnect.mockResolvedValue(client);

      const res = await request(app)
        .post("/api/marketplace/item-inexistente/purchase")
        .send({ user_id: "user-1" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Item não encontrado" });
    });

    it("deve retornar 400 quando o saldo é insuficiente", async () => {
      const client = {
        query: jest
          .fn()
          .mockResolvedValueOnce({ rows: [] }) // BEGIN
          .mockResolvedValueOnce({ rows: [{ id: "item-1", price: 500 }] }) // SELECT item
          .mockResolvedValueOnce({ rows: [{ balance: 100 }] }) // SELECT balance
          .mockResolvedValueOnce({ rows: [] }), // ROLLBACK
        release: jest.fn(),
      };
      mockConnect.mockResolvedValue(client);

      const res = await request(app)
        .post("/api/marketplace/item-1/purchase")
        .send({ user_id: "user-1" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Saldo insuficiente" });
    });

    it("deve concluir a compra com sucesso", async () => {
      const client = {
        query: jest
          .fn()
          .mockResolvedValueOnce({ rows: [] }) // BEGIN
          .mockResolvedValueOnce({ rows: [{ id: "item-1", price: 50 }] }) // SELECT item
          .mockResolvedValueOnce({ rows: [{ balance: 1250 }] }) // SELECT balance
          .mockResolvedValueOnce({ rows: [] }) // UPDATE users
          .mockResolvedValueOnce({ rows: [] }) // UPDATE marketplace
          .mockResolvedValueOnce({ rows: [] }) // INSERT purchases
          .mockResolvedValueOnce({ rows: [] }), // COMMIT
        release: jest.fn(),
      };
      mockConnect.mockResolvedValue(client);

      const res = await request(app)
        .post("/api/marketplace/item-1/purchase")
        .send({ user_id: "user-1" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, new_balance: 1200 });
    });
  });

  describe("POST /api/characters", () => {
    it("deve criar um personagem com valores padrão", async () => {
      const created = {
        id: "char-1",
        user_id: "user-1",
        name: "Aragorn",
        hp_current: 10,
        hp_max: 10,
        ac: 10,
      };
      mockQuery.mockResolvedValue({ rows: [created] });

      const res = await request(app)
        .post("/api/characters")
        .send({ id: "char-1", user_id: "user-1", name: "Aragorn" });

      expect(res.status).toBe(201);
      expect(res.body.hp).toEqual({ current: 10, max: 10 });
    });
  });

  describe("POST /api/calendar", () => {
    it("deve criar um evento com valores padrão", async () => {
      const created = {
        id: "event-1",
        user_id: "user-1",
        title: "Sessão 1",
        duration: 180,
        type: "session",
      };
      mockQuery.mockResolvedValue({ rows: [created] });

      const res = await request(app)
        .post("/api/calendar")
        .send({ id: "event-1", user_id: "user-1", title: "Sessão 1" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
    });
  });
});