const express = require("express");
const path = require("path");
const { readFromFile, writeToFile } = require("./helpers");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// get notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  let notes = await readFromFile("db/db.json");
  let parsedNotes = JSON.parse(notes);
  res.json(parsedNotes);
});

app.post("/api/notes", async (req, res) => {
  let notes = await readFromFile("db/db.json");
  let parsedNotes = JSON.parse(notes);
  let { title, text } = req.body;
  let newNote = { id: uuid.v4(), title, text };
  let updatedNotes = [...parsedNotes, newNote];
  await writeToFile("db/db.json", JSON.stringify(updatedNotes));
  let overwrittenNotes = await readFromFile("db/db.json");
  res.json(overwrittenNotes);
});

app.listen(PORT, () =>
  console.log("Serving static asset routes at port http://localhost:${PORT}")
);

module.exports = express;
