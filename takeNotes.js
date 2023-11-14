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
  const deleteId = req.params.id; // Assuming the ID in the request is a string
  fs.readFile("./db/db.json", "UTF-8").then(function (data) {
    const notesEl = JSON.parse(data);
    const notesNewEl = notesEl.filter((note) => note.id !== deleteId);
    fs.writeFile("./db/db.json", JSON.stringify(notesNewEl), (err) => {
      if (err) throw err;
      res.json("Your note has been deleted.");
    });
  });
});

module.exports = express;
