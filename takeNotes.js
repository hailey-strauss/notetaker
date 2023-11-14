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
app.delete("/:id", (req, res) => {
  const deleteId = parseInt(req.params.id);
  fs.readFile("./db.db.json", "UTF-8").then(function (data) {
    const notesEl = JSON.parse(data);
    const notesNewEl = notesEl.filter((note) => note.id !== deleteId);
    fs.writeFile("./db/db.json", notesNewEl);
    res.json("Your note has been deleted.");
  });
});

module.exports = express;
