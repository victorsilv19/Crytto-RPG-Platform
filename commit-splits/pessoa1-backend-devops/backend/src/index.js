const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

// Managed Postgres (Neon/Supabase) requires TLS; local docker Postgres does not.
const dbUrl = process.env.DATABASE_URL || "";
const useSSL = process.env.PGSSL !== "false" && !/localhost|127\.0\.0\.1|@db[:/]/.test(dbUrl);
const pool = new Pool({
  connectionString: dbUrl,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: "1mb" }));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT,
      bio TEXT,
      user_type TEXT DEFAULT 'player',
      balance INTEGER DEFAULT 1250,
      avatar_url TEXT,
      banner_type TEXT DEFAULT 'gradient',
      banner_colors JSONB DEFAULT '["#7f1d1d","#374151"]'::jsonb,
      settings JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      class TEXT,
      level INTEGER DEFAULT 1,
      race TEXT,
      background TEXT,
      avatar_url TEXT,
      hp_current INTEGER DEFAULT 10,
      hp_max INTEGER DEFAULT 10,
      ac INTEGER DEFAULT 10,
      stats JSONB DEFAULT '{}'::jsonb,
      skills JSONB DEFAULT '[]'::jsonb,
      backstory TEXT,
      status TEXT DEFAULT 'active',
      player_name TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS marketplace_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      category TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      author TEXT,
      author_id TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      images JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      item_id TEXT,
      price INTEGER,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      time TEXT,
      duration INTEGER DEFAULT 180,
      type TEXT DEFAULT 'session',
      players JSONB DEFAULT '[]'::jsonb,
      max_players INTEGER DEFAULT 5,
      is_recurring BOOLEAN DEFAULT false,
      recurring_type TEXT,
      status TEXT DEFAULT 'scheduled',
      reminder BOOLEAN DEFAULT true,
      is_public BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM marketplace_items");
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO marketplace_items (id, title, description, price, category, rating, reviews, downloads, author, author_id, tags)
      VALUES
        ('seed-1','Mapa: Castelo Sombrio','Um castelo gótico abandonado perfeito para aventuras de horror.',50,'Mapas',4.8,124,567,'MestreEpico','master1','["gótico","castelo","horror"]'::jsonb),
        ('seed-2','Aventura: O Tesouro Perdido','Uma aventura completa para 4-6 jogadores de nível 3-5.',120,'Aventuras',4.9,89,234,'DragonMaster','master2','["aventura","tesouro","exploração"]'::jsonb),
        ('seed-3','Trilha Sonora: Floresta Mística','12 faixas ambientais para florestas encantadas.',30,'Trilha Sonora',4.7,67,890,'SoundMaster','master3','["floresta","ambiente","loops"]'::jsonb),
        ('seed-4','Token Set: Criaturas Místicas','50+ tokens de alta qualidade de criaturas místicas.',25,'Tokens',4.6,156,1023,'ArtisticGuru','master4','["tokens","criaturas","fadas"]'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `);
  }
}

// --- Users ---
app.get("/api/users/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

app.post("/api/users", async (req, res, next) => {
  const { id, username, display_name, user_type } = req.body;
  if (!id || !username) return res.status(400).json({ error: "id e username são obrigatórios" });
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (id, username, display_name, user_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username
       RETURNING *`,
      [id, username, display_name || username, user_type || "player"]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (rows.length) return res.json(rows[0]);
    }
    next(err);
  }
});

app.put("/api/users/:id", async (req, res, next) => {
  const { display_name, bio, user_type, avatar_url, banner_type, banner_colors, settings } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET
         display_name = COALESCE($1, display_name),
         bio = COALESCE($2, bio),
         user_type = COALESCE($3, user_type),
         avatar_url = COALESCE($4, avatar_url),
         banner_type = COALESCE($5, banner_type),
         banner_colors = COALESCE($6::jsonb, banner_colors),
         settings = COALESCE($7::jsonb, settings)
       WHERE id = $8
       RETURNING *`,
      [
        display_name ?? null,
        bio ?? null,
        user_type ?? null,
        avatar_url ?? null,
        banner_type ?? null,
        banner_colors ? JSON.stringify(banner_colors) : null,
        settings ? JSON.stringify(settings) : null,
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

app.put("/api/users/:id/balance", async (req, res, next) => {
  const { balance } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance",
      [balance, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// --- Characters ---
app.get("/api/characters/:userId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM characters WHERE user_id = $1 ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(rows.map(c => ({
      ...c,
      hp: { current: c.hp_current, max: c.hp_max },
    })));
  } catch (err) { next(err); }
});

app.post("/api/characters", async (req, res, next) => {
  const {
    id, user_id, name, class: cls, level, race, background, avatar_url,
    hp, ac, stats, skills, backstory, status, player_name,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO characters
         (id, user_id, name, class, level, race, background, avatar_url,
          hp_current, hp_max, ac, stats, skills, backstory, status, player_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14,$15,$16)
       RETURNING *`,
      [
        id, user_id, name, cls, level ?? 1, race, background, avatar_url,
        hp?.current ?? 10, hp?.max ?? 10, ac ?? 10,
        JSON.stringify(stats || {}), JSON.stringify(skills || []),
        backstory, status || "active", player_name,
      ]
    );
    const c = rows[0];
    res.status(201).json({ ...c, hp: { current: c.hp_current, max: c.hp_max } });
  } catch (err) { next(err); }
});

app.put("/api/characters/:id", async (req, res, next) => {
  const {
    name, class: cls, level, race, background, avatar_url,
    hp, ac, stats, skills, backstory, status,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE characters SET
         name = COALESCE($1, name),
         class = COALESCE($2, class),
         level = COALESCE($3, level),
         race = COALESCE($4, race),
         background = COALESCE($5, background),
         avatar_url = COALESCE($6, avatar_url),
         hp_current = COALESCE($7, hp_current),
         hp_max = COALESCE($8, hp_max),
         ac = COALESCE($9, ac),
         stats = COALESCE($10::jsonb, stats),
         skills = COALESCE($11::jsonb, skills),
         backstory = COALESCE($12, backstory),
         status = COALESCE($13, status)
       WHERE id = $14
       RETURNING *`,
      [
        name ?? null, cls ?? null, level ?? null, race ?? null, background ?? null, avatar_url ?? null,
        hp?.current ?? null, hp?.max ?? null, ac ?? null,
        stats ? JSON.stringify(stats) : null,
        skills ? JSON.stringify(skills) : null,
        backstory ?? null, status ?? null, req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Personagem não encontrado" });
    const c = rows[0];
    res.json({ ...c, hp: { current: c.hp_current, max: c.hp_max } });
  } catch (err) { next(err); }
});

app.delete("/api/characters/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM characters WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// --- Marketplace ---
app.get("/api/marketplace", async (req, res, next) => {
  const { category, search } = req.query;
  const params = [];
  let query = "SELECT * FROM marketplace_items WHERE 1=1";
  if (category && category !== "all") {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }
  query += " ORDER BY created_at DESC";
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

app.post("/api/marketplace", async (req, res, next) => {
  const { id, title, description, price, category, author, author_id, tags, images } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO marketplace_items (id, title, description, price, category, author, author_id, tags, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb)
       RETURNING *`,
      [id, title, description, price, category, author, author_id,
        JSON.stringify(tags || []), JSON.stringify(images || [])]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

app.put("/api/marketplace/:id", async (req, res, next) => {
  const { title, description, price, category, tags, images } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE marketplace_items SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         category = COALESCE($4, category),
         tags = COALESCE($5::jsonb, tags),
         images = COALESCE($6::jsonb, images)
       WHERE id = $7
       RETURNING *`,
      [
        title ?? null, description ?? null, price ?? null, category ?? null,
        tags ? JSON.stringify(tags) : null,
        images ? JSON.stringify(images) : null,
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Item não encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

app.delete("/api/marketplace/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM marketplace_items WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.post("/api/marketplace/:id/purchase", async (req, res, next) => {
  const { user_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const itemRes = await client.query("SELECT * FROM marketplace_items WHERE id = $1 FOR UPDATE", [req.params.id]);
    if (itemRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Item não encontrado" });
    }
    const item = itemRes.rows[0];

    const userRes = await client.query("SELECT balance FROM users WHERE id = $1 FOR UPDATE", [user_id]);
    if (userRes.rows.length === 0 || userRes.rows[0].balance < item.price) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    const newBalance = userRes.rows[0].balance - item.price;
    await client.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, user_id]);
    await client.query("UPDATE marketplace_items SET downloads = downloads + 1 WHERE id = $1", [req.params.id]);
    await client.query(
      "INSERT INTO purchases (id, user_id, item_id, price) VALUES ($1,$2,$3,$4)",
      [Date.now().toString(), user_id, req.params.id, item.price]
    );
    await client.query("COMMIT");
    res.json({ success: true, new_balance: newBalance });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

app.get("/api/purchases/:userId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT item_id FROM purchases WHERE user_id = $1",
      [req.params.userId]
    );
    res.json(rows.map(p => p.item_id));
  } catch (err) { next(err); }
});

// --- Calendar ---
app.get("/api/calendar/:userId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM calendar_events WHERE user_id = $1 OR is_public = true ORDER BY date, time",
      [req.params.userId]
    );
    res.json(rows.map(e => ({
      ...e,
      isRecurring: e.is_recurring,
      isPublic: e.is_public,
      recurringType: e.recurring_type,
      maxPlayers: e.max_players,
    })));
  } catch (err) { next(err); }
});

app.post("/api/calendar", async (req, res, next) => {
  const {
    id, user_id, title, description, date, time, duration, type,
    players, max_players, is_recurring, recurring_type, is_public, reminder,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO calendar_events
         (id, user_id, title, description, date, time, duration, type,
          players, max_players, is_recurring, recurring_type, is_public, reminder)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        id, user_id, title, description, date, time, duration ?? 180, type || "session",
        JSON.stringify(players || []), max_players ?? 5,
        !!is_recurring, recurring_type, is_public !== false, reminder !== false,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

app.put("/api/calendar/:id", async (req, res, next) => {
  const { title, description, date, time, duration, status, players, max_players, is_public, reminder } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE calendar_events SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         date = COALESCE($3, date),
         time = COALESCE($4, time),
         duration = COALESCE($5, duration),
         status = COALESCE($6, status),
         players = COALESCE($7::jsonb, players),
         max_players = COALESCE($8, max_players),
         is_public = COALESCE($9, is_public),
         reminder = COALESCE($10, reminder)
       WHERE id = $11
       RETURNING *`,
      [
        title ?? null, description ?? null, date ?? null, time ?? null,
        duration ?? null, status ?? null,
        players ? JSON.stringify(players) : null,
        max_players ?? null,
        typeof is_public === "boolean" ? is_public : null,
        typeof reminder === "boolean" ? reminder : null,
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Evento não encontrado" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

app.delete("/api/calendar/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM calendar_events WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

app.get("/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "up" });
  } catch {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});

app.use((err, _req, res, _next) => {
  console.error("[api-error]", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Falha ao inicializar o banco:", err);
    process.exit(1);
  });
