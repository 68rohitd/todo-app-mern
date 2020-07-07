const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let User = require("../models/user.model");
let Todos = require("../models/todos.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    // validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter the same password twice" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      taskId: [],
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        history: user.history,
        taskId: user.taskId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: delete a user account
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);

    // delete this users todos too
    await Todos.deleteMany({ userId: req.user }).catch(function (err) {
      console.log(err);
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: verify a user against token
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get username and id of logged in user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
    history: user.history,
  });
});

// @desc: update users history
router.put("/updateHistory/", auth, async (req, res) => {
  User.findOneAndUpdate({ _id: req.user }, { history: req.body }, function (
    err,
    result
  ) {
    if (err) {
      res.status(400).json("Error: " + err);
    } else {
      res.json(result);
    }
  });
});

// @desc: add task id to id list of the user
router.post("/addTaskId", async (req, res) => {
  const email = req.body.email;
  const taskId = req.body.taskId;

  const user = await User.findOne({ email: email });
  let taskList = user.taskId;

  if (user) {
    taskList.push(taskId);
  }

  User.findOneAndUpdate(
    { email },
    { taskId: taskList },
    { new: true }, //to get updated doc
    (err, result) => {
      if (err) {
        res.status(400).json("Error: " + err);
      } else {
        res.json(result);
      }
    }
  );
});

// @desc: get team todos
router.post("/getTeamTodos/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  const taskIds = user.taskId;
  let teamTodos = [];

  for (const taskId of taskIds) {
    const todo = await Todos.findById(taskId);
    //check if todo actually exists or not
    if (todo) {
      teamTodos.push(todo);
    }
    //@ else part you could delete the todo. hi haaa
  }

  res.json(teamTodos);
});

module.exports = router;
