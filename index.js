const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the RevBoost Solutions server!");
});

app.listen(PORT, () => {
  console.log(`RevBoost Solutions server running on port ${PORT}`);
});
