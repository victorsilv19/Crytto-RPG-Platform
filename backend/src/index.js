const { app, initDb } = require("./app");
const { ensureBucket } = require("./storage");

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
    // Não bloqueia o boot: se o storage falhar, só o upload de avatar fica indisponível.
    ensureBucket().catch((err) => console.error("[storage] falha ao preparar bucket:", err.message));
  })
  .catch((err) => {
    console.error("Falha ao inicializar o banco:", err);
    process.exit(1);
  });