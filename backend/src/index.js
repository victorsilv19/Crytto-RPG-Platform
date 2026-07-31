const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Banco de dados ---
const db = new Database(path.join(__dirname, "crytto.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    user_type TEXT DEFAULT 'player',
    balance INTEGER DEFAULT 1250,
    avatar_url TEXT,
    banner_type TEXT DEFAULT 'gradient',
    banner_colors TEXT DEFAULT '["#7f1d1d","#374151"]',
    created_at TEXT DEFAULT (datetime('now'))
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
    stats TEXT DEFAULT '{}',
    skills TEXT DEFAULT '[]',
    backstory TEXT,
    status TEXT DEFAULT 'active',
    player_name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
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
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    item_id TEXT,
    price INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
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
    players TEXT DEFAULT '[]',
    max_players INTEGER DEFAULT 5,
    is_recurring INTEGER DEFAULT 0,
    recurring_type TEXT,
    status TEXT DEFAULT 'scheduled',
    reminder INTEGER DEFAULT 1,
    is_public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed de dados iniciais se o marketplace estiver vazio
const itemCount = db.prepare("SELECT COUNT(*) as count FROM marketplace_items").get();
if (itemCount.count === 0) {
  const insertItem = db.prepare(`
    INSERT INTO marketplace_items (id, title, description, price, category, rating, reviews, downloads, author, author_id, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertItem.run("1", "Mapa: Castelo Sombrio", "Um castelo gótico abandonado perfeito para aventuras de horror.", 50, "Mapas", 4.8, 124, 567, "MestreEpico", "master1", '["gótico","castelo","horror"]');
  insertItem.run("2", "Aventura: O Tesouro Perdido", "Uma aventura completa para 4-6 jogadores de nível 3-5.", 120, "Aventuras", 4.9, 89, 234, "DragonMaster", "master2", '["aventura","tesouro","exploração"]');
  insertItem.run("3", "Trilha Sonora: Floresta Mística", "12 faixas ambientais para florestas encantadas.", 30, "Trilha Sonora", 4.7, 67, 890, "SoundMaster", "master3", '["floresta","ambiente","loops"]');
  insertItem.run("4", "Token Set: Criaturas Místicas", "50+ tokens de alta qualidade de criaturas místicas.", 25, "Tokens", 4.6, 156, 1023, "ArtisticGuru", "master4", '["tokens","criaturas","fadas"]');
}

// --- Rotas: Usuários ---
app.get("/api/users/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  user.banner_colors = JSON.parse(user.banner_colors);
  res.json(user);
});

app.post("/api/users", (req, res) => {
  const { id, username, display_name, user_type } = req.body;
  try {
    db.prepare(`
      INSERT INTO users (id, username, display_name, user_type)
      VALUES (?, ?, ?, ?)
    `).run(id, username, display_name || username, user_type || "player");
    res.status(201).json({ id, username });
  } catch {
    // Usuário já existe, retorna ele
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    res.json(user);
  }
});

app.put("/api/users/:id", (req, res) => {
  const { display_name, bio, user_type, avatar_url, banner_type, banner_colors } = req.body;
  db.prepare(`
    UPDATE users SET
      display_name = COALESCE(?, display_name),
      bio = COALESCE(?, bio),
      user_type = COALESCE(?, user_type),
      avatar_url = COALESCE(?, avatar_url),
      banner_type = COALESCE(?, banner_type),
      banner_colors = COALESCE(?, banner_colors)
    WHERE id = ?
  `).run(display_name, bio, user_type, avatar_url, banner_type,
    banner_colors ? JSON.stringify(banner_colors) : null,
    req.params.id);
  res.json({ success: true });
});

app.put("/api/users/:id/balance", (req, res) => {
  const { balance } = req.body;
  db.prepare("UPDATE users SET balance = ? WHERE id = ?").run(balance, req.params.id);
  res.json({ balance });
});

// --- Rotas: Personagens ---
app.get("/api/characters/:userId", (req, res) => {
  const characters = db.prepare("SELECT * FROM characters WHERE user_id = ?").all(req.params.userId);
  res.json(characters.map(c => ({
    ...c,
    stats: JSON.parse(c.stats),
    skills: JSON.parse(c.skills),
    hp: { current: c.hp_current, max: c.hp_max }
  })));
});

app.post("/api/characters", (req, res) => {
  const { id, user_id, name, class: cls, level, race, background, avatar_url,
    hp, ac, stats, skills, backstory, status, player_name } = req.body;
  db.prepare(`
    INSERT INTO characters (id, user_id, name, class, level, race, background, avatar_url,
      hp_current, hp_max, ac, stats, skills, backstory, status, player_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, user_id, name, cls, level, race, background, avatar_url,
    hp?.current || 10, hp?.max || 10, ac,
    JSON.stringify(stats || {}), JSON.stringify(skills || []),
    backstory, status || "active", player_name);
  res.status(201).json({ id });
});

app.put("/api/characters/:id", (req, res) => {
  const { name, class: cls, level, race, background, avatar_url,
    hp, ac, stats, skills, backstory, status } = req.body;
  db.prepare(`
    UPDATE characters SET
      name = COALESCE(?, name),
      class = COALESCE(?, class),
      level = COALESCE(?, level),
      race = COALESCE(?, race),
      background = COALESCE(?, background),
      avatar_url = COALESCE(?, avatar_url),
      hp_current = COALESCE(?, hp_current),
      hp_max = COALESCE(?, hp_max),
      ac = COALESCE(?, ac),
      stats = COALESCE(?, stats),
      skills = COALESCE(?, skills),
      backstory = COALESCE(?, backstory),
      status = COALESCE(?, status)
    WHERE id = ?
  `).run(name, cls, level, race, background, avatar_url,
    hp?.current, hp?.max, ac,
    stats ? JSON.stringify(stats) : null,
    skills ? JSON.stringify(skills) : null,
    backstory, status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/characters/:id", (req, res) => {
  db.prepare("DELETE FROM characters WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// --- Rotas: Marketplace ---
app.get("/api/marketplace", (req, res) => {
  const { category, search } = req.query;
  let query = "SELECT * FROM marketplace_items WHERE 1=1";
  const params = [];
  if (category && category !== "all") {
    query += " AND category = ?";
    params.push(category);
  }
  if (search) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  const items = db.prepare(query).all(...params);
  res.json(items.map(i => ({ ...i, tags: JSON.parse(i.tags) })));
});

app.post("/api/marketplace", (req, res) => {
  const { id, title, description, price, category, author, author_id, tags } = req.body;
  db.prepare(`
    INSERT INTO marketplace_items (id, title, description, price, category, author, author_id, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, description, price, category, author, author_id, JSON.stringify(tags || []));
  res.status(201).json({ id });
});

app.post("/api/marketplace/:id/purchase", (req, res) => {
  const { user_id } = req.body;
  const item = db.prepare("SELECT * FROM marketplace_items WHERE id = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item não encontrado" });

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
  if (!user || user.balance < item.price)
    return res.status(400).json({ error: "Saldo insuficiente" });

  db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(item.price, user_id);
  db.prepare("UPDATE marketplace_items SET downloads = downloads + 1 WHERE id = ?").run(req.params.id);
  db.prepare("INSERT INTO purchases (id, user_id, item_id, price) VALUES (?, ?, ?, ?)")
    .run(Date.now().toString(), user_id, req.params.id, item.price);

  res.json({ success: true, new_balance: user.balance - item.price });
});

app.get("/api/purchases/:userId", (req, res) => {
  const purchases = db.prepare("SELECT item_id FROM purchases WHERE user_id = ?").all(req.params.userId);
  res.json(purchases.map(p => p.item_id));
});

// --- Rotas: Calendário ---
app.get("/api/calendar/:userId", (req, res) => {
  const events = db.prepare("SELECT * FROM calendar_events WHERE user_id = ? OR is_public = 1").all(req.params.userId);
  res.json(events.map(e => ({
    ...e,
    players: JSON.parse(e.players),
    isRecurring: !!e.is_recurring,
    isPublic: !!e.is_public,
    reminder: !!e.reminder
  })));
});

app.post("/api/calendar", (req, res) => {
  const { id, user_id, title, description, date, time, duration, type,
    players, max_players, is_recurring, recurring_type, is_public, reminder } = req.body;
  db.prepare(`
    INSERT INTO calendar_events (id, user_id, title, description, date, time, duration, type,
      players, max_players, is_recurring, recurring_type, is_public, reminder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, user_id, title, description, date, time, duration || 180, type || "session",
    JSON.stringify(players || []), max_players || 5,
    is_recurring ? 1 : 0, recurring_type, is_public ? 1 : 0, reminder ? 1 : 0);
  res.status(201).json({ id });
});

app.put("/api/calendar/:id", (req, res) => {
  const { title, description, date, time, duration, status } = req.body;
  db.prepare(`
    UPDATE calendar_events SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      date = COALESCE(?, date),
      time = COALESCE(?, time),
      duration = COALESCE(?, duration),
      status = COALESCE(?, status)
    WHERE id = ?
  `).run(title, description, date, time, duration, status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/calendar/:id", (req, res) => {
  db.prepare("DELETE FROM calendar_events WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
