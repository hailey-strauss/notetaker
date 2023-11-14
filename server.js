const express = require("express");
const path = require("path");
const { readFromFile, writeToFile } = require("./helpers");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await readFromFile("db/db.json");
    const parsedNotes = JSON.parse(notes);
    res.json(parsedNotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to read notes." });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const notes = await readFromFile("db/db.json");
    const parsedNotes = JSON.parse(notes);
    const { title, text } = req.body;
    const newNote = { id: uuid.v4(), title, text };
    const updatedNotes = [...parsedNotes, newNote];
    await writeToFile("db/db.json", JSON.stringify(updatedNotes));
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a new note." });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const notes = await readFromFile("db/db.json");
    const parsedNotes = JSON.parse(notes);
    const deleteId = req.params.id;
    const filteredNotes = parsedNotes.filter((note) => note.id !== deleteId);
    await writeToFile("db/db.json", JSON.stringify(filteredNotes));
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the note." });
  }
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
