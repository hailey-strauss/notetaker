// Packages
const path = require("path");
const express = require("express");
const fs = require("fs");
var newId = require("newId");

const app = express();

// Add notes
app.get("/notes", (req, res) => {
  fs.readFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// Save notes
app.post("/", (req, res) => {
  const newNote = req.body;
  newNote.id = newId();

  const createdNote = JSON.parse(fs.readFile("./db/db.json", "utf-8"));
  createdNote.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(createdNote));
  res.json(newNote);
});

// Delete notes
app.delete("/notes/:id", (req, res) => {
  const deleteId = req.params.id;

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== deleteId);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json({ message: "Note deleted successfully" });
    });
  });
});

module.exports = app;

module.exports = express;
