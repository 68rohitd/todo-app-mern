const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todosSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    todoName: { type: Array, required: true },
    dueDate: { type: String },
    label: { type: String, required: true },
    status: { type: String, required: true },
    finished: { type: Boolean },
    important: { type: String }, //setting type string as regex cannot match boolean
    collapsed: { type: Boolean },
    attachmentName: { type: String },
    reminderId: { type: String },
    time: { type: String },
    memberList: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Todos = mongoose.model("Todos", todosSchema);

module.exports = Todos;
