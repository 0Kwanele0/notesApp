const express = require("express");
const Note = require("../models/Note");
const noterouter = express.Router();

noterouter.get("/", async (req, res) => {
  try {
    Note.find({ userId: req.header("user-id") }).then((data) => {
      res.send(data);
    });
  } catch (err) {
    res.status(409).send("Unable to get notes");
  }
});
noterouter.post("/create", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      note: req.body.note,
      userId: req.body.userId,
    };
    const note = new Note(data);
    note.save().then((mynote) => {
      res.send(mynote);
    });
  } catch (err) {
    res.status(409).send("Unable to create note");
  }
});
noterouter.get("/:id", async (req, res) => {
  try {
    Note.findById(req.params.id, (err, details) => {
      if (details) {
        res.send(details.title);
      } else {
        res.send(err);
      }
    });
  } catch (err) {
    res.status(409).send("can't find note");
  }
});
noterouter.put("/:id", async (req, res) => {
  try {
    Note.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
      if (data) {
        data.save().then((done) => res.send(done));
      } else {
        res.send(err);
      }
    });
  } catch (err) {
    res.status(409).send("can't find note");
  }
});
noterouter.delete("/:id", async (req, res) => {
  try {
    Note.findByIdAndDelete(req.params.id, (err, data) => {
      if (data) {
        res.send("Note deleted");
      } else {
        res.send(err);
      }
    });
  } catch (err) {
    res.status(409).send("can't find note");
  }
});

module.exports = noterouter;
