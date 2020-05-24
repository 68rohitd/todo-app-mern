import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Consumer } from "../../context";
import axios from "axios";
import classNames from "classnames";
import { Spring } from "react-spring/renderprops";
import "../../assets/todo-styles/todo.css";

class Todo extends Component {
  onDelete(id, dispatch) {
    axios
      .delete(`/todos/${id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    dispatch({
      type: "DELETE_TODO",
      payload: id,
    });
  }

  onGetTime = (info) => {
    const date = new Date(info);
    return date.toDateString() + ", " + date.toLocaleTimeString();
  };

  onEachItemFinished = (todo, item, index, dispatch) => {
    todo.todoName[index].finished = !todo.todoName[index].finished;

    // by default, status will be in progress
    todo.status = "in progress";
    if (todo.todoName.every((item) => item.finished === true)) {
      todo.finished = true;
      todo.status = "completed";
    } else todo.finished = false;

    if (todo.todoName.every((item) => item.finished === false)) {
      todo.status = "new";
    }
    axios
      .post(`/todos/update/${todo._id}`, todo)
      // .then((res) => console.log("updated todo: ", res.data))
      .catch((err) => console.log(err));

    dispatch({
      type: "UPDATE_TODO",
      payload: todo,
    });
  };

  onMarkAsComplete = (todo, dispatch) => {
    if (todo.finished) {
      //if todo is already checked
      todo.finished = false;
      todo.status = "new";
      todo.todoName.map((task) => {
        return (task.finished = false);
      });
    } else {
      //if todo is not checked
      todo.finished = true;
      todo.status = "completed";
      todo.todoName.map((task) => {
        return (task.finished = true);
      });
    }

    axios
      .post(`/todos/update/${todo._id}`, todo)
      .then((res) => console.log("updated todo: ", res.data))
      .catch((err) => console.log(err));

    dispatch({
      type: "UPDATE_TODO",
      payload: todo,
    });
  };

  onCollapsed = (todo, dispatch) => {
    todo.collapsed = !todo.collapsed;

    axios
      .post(`/todos/update/${todo._id}`, todo)
      .catch((err) => console.log(err));

    dispatch({
      type: "UPDATE_TODO",
      payload: todo,
    });
  };

  render() {
    const { todoItem } = this.props;

    // style
    let colors = {
      Work: "#292b2c",
      Personal: "#0275d8",
      Shopping: "#d9534f",
      Others: "#f0ad4e",
    };
    let styles = {
      card: {
        borderLeftWidth: 10,
        borderRadius: 10,
        borderLeftColor: colors[todoItem.label],
        marginBottom: 5,
      },
    };
    return (
      <Consumer>
        {(value) => {
          const { dispatch } = value;
          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 200 }}
            >
              {(props) => (
                <div style={props}>
                  <div className="myCard card pb-1" style={{ ...styles.card }}>
                    <div className="card-header pt-2 pb-2">
                      <div className="row">
                        <div className="col-1">
                          {/* collapse icon */}
                          <i
                            className={classNames("myIcon", {
                              "fa fa-angle-down": todoItem.collapsed,
                              "fa fa-angle-up": !todoItem.collapsed,
                            })}
                            onClick={() => this.onCollapsed(todoItem, dispatch)}
                          ></i>
                        </div>

                        <div className="col">
                          {/* date info */}
                          <small className="text-muted">
                            {this.onGetTime(todoItem.createdAt)}
                          </small>
                        </div>

                        <div className="col-3">
                          {/* status of task: new, in progress, completed */}
                          <span
                            className="badge badge-success"
                            style={{ borderRadius: "7px" }}
                          >
                            {todoItem.status}
                          </span>
                        </div>

                        <div className="col-1">
                          {/* mark as complete icon */}
                          <ReactTooltip place="bottom" delayShow={1000} />

                          <i
                            data-tip="mark all tasks as completed"
                            className={classNames("myIcon fa fa-check", {
                              "text-success": todoItem.finished,
                              "text-dark": !todoItem.finished,
                            })}
                            onClick={() =>
                              this.onMarkAsComplete(todoItem, dispatch)
                            }
                          ></i>
                        </div>

                        <div className="col-1">
                          {/* edit icon */}
                          <Link to={`/edit/${todoItem._id}`}>
                            <i
                              data-tip="edit task"
                              className={"myIcon fa fa-pencil text-dark"}
                            ></i>
                          </Link>
                        </div>

                        <div className="col-1">
                          {/* delete icon */}
                          <i
                            className="myIcon fa fa-times text-danger"
                            onClick={this.onDelete.bind(
                              this,
                              todoItem._id,
                              dispatch
                            )}
                          ></i>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body pb-0 pt-1 mb-0 mt-1"
                      style={styles.card}
                    >
                      <div className="row">
                        <div className="taskCol col-12 col-sm-8 col-md-8">
                          {/* todo title */}
                          <p className="font-weight-bold mb-2 p-0">
                            {todoItem.title[0].toUpperCase() +
                              todoItem.title.slice(1)}
                            {/* imp mark */}
                            {todoItem.important === "true" ? (
                              <span className="badge badge-danger ml-1">
                                Imp
                              </span>
                            ) : null}
                          </p>

                          {/* task name */}
                          {todoItem.collapsed
                            ? null
                            : todoItem.todoName.map((item, index) => {
                                return (
                                  <div className="row" key={index}>
                                    <div className="col m-0">
                                      <div className="row">
                                        <div className="col-1">
                                          <div className="pretty p-icon p-round p-jelly">
                                            <input
                                              type="checkbox"
                                              checked={
                                                item.finished ? true : false
                                              }
                                              onChange={() =>
                                                this.onEachItemFinished(
                                                  todoItem,
                                                  item,
                                                  index,
                                                  dispatch
                                                )
                                              }
                                            />
                                            <div className="state p-success">
                                              <i className="icon mdi mdi-check"></i>
                                              <label></label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col">
                                          <label
                                            style={
                                              item.finished
                                                ? {
                                                    textDecorationLine:
                                                      "line-through",
                                                  }
                                                : null
                                            }
                                          >
                                            {item.itemName}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                        {/* due date */}
                        {todoItem.dueDate !== "0000-00-00" &&
                        todoItem.collapsed === false ? (
                          <div className="dateCol col-12 col-sm-4 col-md-4">
                            <div className="dateInfo">
                              <p className="text-muted m-0 p-0">Due Date</p>
                              <p>{todoItem.dueDate}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
export default Todo;
