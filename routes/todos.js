const router = require("express").Router();
const express = require("express");
let Todos = require("../models/todos.model");
const multer = require("multer");
const path = require("path");

// @desc: file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});

router.post("/uploadfile", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please uplad a file");
    error.httpStatusCode = 400;
    return next();
  }
  console.log(file);
  res.send(file);
});

// @desc: file download (attachment)
router.post("/download/:attachmentName", function (req, res, next) {
  const attachmentName = req.params.attachmentName;
  console.log(attachmentName);

  var filePath = `public/${attachmentName}`; // Or format the path using the `id` rest param
  var fileName = `attachmentName`; // The default name the browser will use

  res.download(filePath, fileName);
  // return next();
});

// @desc: fetch todos of logged in user
router.route("/user/:id").get((req, res) => {
  Todos.find({ userId: req.params.id })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: search todos
router.route("/search/").post((req, res) => {
  let l = req.body.label,
    s = req.body.status;
  i = req.body.important;
  d = req.body.dueDate;

  // if fields are empty, match everything
  if (l === "All Labels") l = new RegExp(/.+/s);
  if (s === "All Status") s = new RegExp(/.+/s);
  if (i === "false") i = new RegExp(/.+/s);
  if (d === "") d = new RegExp(/.+/s);

  // console.log(l, s, i, d);

  Todos.find({
    userId: req.body.id,
    label: new RegExp(l),
    status: new RegExp(s),
    important: new RegExp(i),
    dueDate: new RegExp(d),
  })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: add a todo
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const todoName = req.body.todoName;
  const dueDate = req.body.dueDate;
  const label = req.body.label;
  const status = req.body.status;
  const finished = req.body.finished;
  const important = req.body.important;
  const collapsed = req.body.collapsed;
  const attachmentName = req.body.attachmentName;

  const newTodo = new Todos({
    userId,
    title,
    todoName,
    dueDate,
    label,
    status,
    finished,
    important,
    collapsed,
    attachmentName,
  });

  newTodo
    .save()
    .then(() => res.json(newTodo))
    .catch((err) => res.status(400).json("Error: ", +err));
});

// @desc: fetch a particular todo
router.route("/:id").get((req, res) => {
  Todos.findById(req.params.id)
    .then((todo) => res.json(todo))
    .catch((err) => res.status(400).json("Error: ", err));
});

// @desc: delete a particular todo
router.route("/:id").delete((req, res) => {
  Todos.findByIdAndDelete(req.params.id)
    .then(() => res.json("Todo Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @desc: update a particular todo
router.route("/update/:id").post((req, res) => {
  Todos.findById(req.params.id)
    .then((todo) => {
      todo.userId = req.body.userId;
      todo.title = req.body.title;
      todo.todoName = req.body.todoName;
      todo.dueDate = req.body.dueDate;
      todo.label = req.body.label;
      todo.status = req.body.status;
      todo.finished = req.body.finished;
      todo.important = req.body.important;
      todo.collapsed = req.body.collapsed;
      todo.attachmentName = req.body.attachmentName;

      todo
        .save()
        .then(() => res.json(todo))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
