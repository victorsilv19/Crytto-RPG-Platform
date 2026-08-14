const { app, initDb } = require("./app");

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Falha ao inicializar o banco:", err);
    process.exit(1);
  });