const express = require ('express');
const Note = require ('../models/note');
const {authenticate} = require ('../middlewares/authenticate');
const {body, validationResult} = require ('express-validator');
const router = express.Router ();

// Create a new note
router.post (
  '/',
  [
    authenticate,
    body ('title').notEmpty ().withMessage ('Title is required'),
    body ('content').notEmpty ().withMessage ('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    try {
      const {title, content} = req.body;
      const newNote = new Note ({
        title,
        content,
        author: req.userId,
      });
      await newNote.save ();

      res.status (201).json (newNote);
    } catch (error) {
      res.status (500).json ({message: error.message});
    }
  }
);

// Get all notes
router.get ('/', authenticate, async (req, res) => {
  try {
    const notes = await Note.find ({author: req.userId});
    res.json (notes);
  } catch (error) {
    res.status (500).json ({message: error.message});
  }
});

// Get a single note
router.get ('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findById (req.params.id);
    if (!note) {
      return res.status (404).json ({message: 'Note not found'});
    }
    if (note.author.toString () !== req.userId) {
      return res.status (403).json ({message: 'Unauthorized'});
    }
    res.json (note);
  } catch (error) {
    res.status (500).json ({message: error.message});
  }
});

// Update a note
router.patch (
  '/:id',
  [
    authenticate,
    body ('title').optional ().isString (),
    body ('content').optional ().isString (),
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    try {
      const note = await Note.findById (req.params.id);
      if (!note) {
        return res.status (404).json ({message: 'Note not found'});
      }
      if (note.author.toString () !== req.userId) {
        return res.status (403).json ({message: 'Unauthorized'});
      }

      const {title, content} = req.body;
      if (title) note.title = title;
      if (content) note.content = content;

      await note.save ();
      res.json (note);
    } catch (error) {
      res.status (500).json ({message: error.message});
    }
  }
);

// Delete a note
router.delete ('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findById (req.params.id);
    if (!note) {
      return res.status (404).json ({message: 'Note not found'});
    }
    if (note.author.toString () !== req.userId) {
      return res.status (403).json ({message: 'Unauthorized'});
    }

    await Note.findByIdAndDelete (req.params.id);
    res.status (200).json ({message: 'Note is Deleted'});
  } catch (error) {
    res.status (500).json ({message: error.message});
  }
});

module.exports = router;
