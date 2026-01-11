import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const filmsPath = path.join(__dirname, "data_base", "films.json");
const usersPath = path.join(__dirname, "data_base", "users.json");

app.get("/api/films", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));
  res.json(data.films);
});

app.get("/api/films/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));
  const film = Object.values(data.films).find(f => f.id == req.params.id);
  film ? res.json(film) : res.status(404).json({ error: "Фильм не найден" });
});

app.post("/api/films", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));
  const filmId = Object.keys(data.films).length + 1;
  const newFilm = { id: filmId, ...req.body };
  data.films[`film_${filmId}`] = newFilm;
  fs.writeFileSync(filmsPath, JSON.stringify(data, null, 2), "utf-8");
  res.json({ success: true, film: newFilm });
});

app.put("/api/films/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));
  const filmKey = Object.keys(data.films).find(key => data.films[key].id == req.params.id);
  if (filmKey) {
    data.films[filmKey] = { ...data.films[filmKey], ...req.body };
    fs.writeFileSync(filmsPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, film: data.films[filmKey] });
  } else {
    res.status(404).json({ error: "Фильм не найден" });
  }
});

app.delete("/api/films/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filmsPath, "utf-8"));
  const filmKey = Object.keys(data.films).find(key => data.films[key].id == req.params.id);
  if (filmKey) {
    const deletedFilm = data.films[filmKey];
    delete data.films[filmKey];
    fs.writeFileSync(filmsPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, film: deletedFilm });
  } else {
    res.status(404).json({ error: "Фильм не найден" });
  }
});

app.get("/api/users", (req, res) => {
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  res.json(data.users);
});

app.get("/api/users/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const user = Object.values(data.users).find(u => String(u.id) === req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "Пользователь не найден" });
});

app.post("/api/users", (req, res) => {
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const userId = Object.keys(data.users).length + 1;
  const newUser = { id: userId, ...req.body };
  data.users[`user_${userId}`] = newUser;
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), "utf-8");
  res.json({ success: true, user: newUser });
});

app.put("/api/users/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const userKey = Object.keys(data.users).find(key => String(data.users[key].id) === req.params.id);
  if (userKey) {
    data.users[userKey] = { ...data.users[userKey], ...req.body };
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, user: data.users[userKey] });
  } else {
    res.status(404).json({ error: "Пользователь не найден" });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const userKey = Object.keys(data.users).find(key => String(data.users[key].id) === req.params.id);
  if (userKey) {
    const deletedUser = data.users[userKey];
    delete data.users[userKey];
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, user: deletedUser });
  } else {
    res.status(404).json({ error: "Пользователь не найден" });
  }
});

app.put("/api/users/:id/favorites", (req, res) => {
  const { films_id } = req.body;
  const data = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const userKey = Object.keys(data.users).find(key => String(data.users[key].id) === req.params.id);
  if (userKey) {
    data.users[userKey].favorite = { films_id };
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ success: true, user: data.users[userKey] });
  } else {
    res.status(404).json({ error: "Пользователь не найден" });
  }
});

app.use(express.static(path.join(__dirname, "../dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
