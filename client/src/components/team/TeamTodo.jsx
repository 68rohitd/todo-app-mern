import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Consumer } from "../../context";
import axios from "axios";
import classNames from "classnames";
import { Spring } from "react-spring/renderprops";
import "../../assets/todo-styles/todo.css";

class TeamTodo extends Component {
  constructor() {
    super();

    this.state = {
      playing: false,
    };

    this.synth = window.speechSynthesis;
    this.dueAlert = false;
  }

  onDelete(todoItem, dispatch, updateTeamTodos) {
    console.log("todoitem: ", todoItem);
    axios
      .delete(`/todos/${todoItem._id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response));

    // delete google calender event if added
    if (todoItem.reminderId) {
      var gapi = window.gapi;
      var CLIENT_ID =
        "487679379915-7rvf2ror46e4bbsj8t8obali4heq5qjm.apps.googleusercontent.com";
      var API_KEY = "AIzaSyB_HYziuQ7j6s9CiqSgXV3YiGTzr5nc0xE";
      var DISCOVERY_DOCS = [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ];
      var SCOPES = "https://www.googleapis.com/auth/calendar.events";

      gapi.load("client:auth2", () => {
        console.log("loaded client");

        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });

        gapi.client.load("calendar", "v3", () =>
          console.log("loaded calender")
        );

        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(() => {
            // delete event
            console.log("deleting event...");
            var request = gapi.client.calendar.events.delete({
              calendarId: "primary",
              eventId: todoItem.reminderId,
            });

            request.execute((event) => {
              console.log(event);

              // send event id to db
              axios.post("/todos/updateReminderId", {
                eventId: event.id,
                taskId: todoItem._id,
              });
            });
          });
      });
    }

    dispatch({
      type: "DELETE_TEAMTODO",
      payload: todoItem._id,
    });

    // to refresh TeamTodos page.
    updateTeamTodos();
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

  onSpeak = (todoItem) => {
    if (!this.synth.speaking) {
      const speed = 1.3;
      this.setState(
        {
          playing: true,
        },
        () => {
          const sent = new SpeechSynthesisUtterance(todoItem.title);
          sent.rate = speed;

          this.synth.speak(sent);

          const end = todoItem.todoName.length - 1;
          todoItem.todoName.forEach((task, index) => {
            const sent = new SpeechSynthesisUtterance(task.itemName);
            sent.rate = speed;
            this.synth.speak(sent);

            sent.onend = () => {
              if (index === end) {
                const sent = new SpeechSynthesisUtterance(
                  "That's all for now!"
                );
                sent.rate = speed;
                this.synth.speak(sent);
                this.setState({
                  playing: false,
                });
              }
            };
          });
        }
      );
    } else {
      if (this.state.playing === true) {
        this.synth.cancel();
        this.setState({
          playing: false,
        });
      }
    }
  };

  componentWillUnmount() {
    if (this.state.playing) {
      this.synth.cancel();
    }
  }

  getDateDiff = (dueDate) => {
    let today = new Date();
    today = new Date(today.toLocaleDateString());
    let due = dueDate.replace(/-/g, "/");
    let future = new Date(due);

    const Difference_In_Time = future.getTime() - today.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days >= 0 && Difference_In_Days <= 1)
      this.dueAlert = true;
  };

  downloadAttachment = async (attachmentName) => {
    axios({
      url: `/todos/download/${attachmentName}`,
      method: "POST",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachmentName);
      document.body.appendChild(link);
      link.click();
    });
  };

  onGetProgress = (todoItem) => {
    const len = todoItem.todoName.length;
    let remaining = 0;
    todoItem.todoName.forEach((item) => {
      if (item.finished === false) remaining++;
    });
    const progress = ((len - remaining) / len) * 100;
    return progress.toFixed(0);
  };

  render() {
    const { todoItem } = this.props;

    // get date diff to set alert
    if (todoItem.dueDate !== "0000-00-00") this.getDateDiff(todoItem.dueDate);

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
                    <div className="card-header pt-1 pb-1">
                      <div className="row">
                        {/* collapse icon */}
                        <div className="col-1 order-1 col-sm-3 order-sm-1 col-md-1 order-md-1 col-lg-1 order-lg-1">
                          <i
                            className={classNames("myIcon collapseIcon fa", {
                              "fa-chevron-circle-down": todoItem.collapsed,
                              "fa-chevron-circle-up": !todoItem.collapsed,
                            })}
                            onClick={() => this.onCollapsed(todoItem, dispatch)}
                          ></i>
                        </div>

                        {/* date info */}
                        <div className="col-12 order-10 col-sm-12 order-sm-10 col-md-5 order-md-1 col-lg-5 order-lg-1">
                          <small className="text-muted">
                            {this.onGetTime(todoItem.createdAt)}
                          </small>
                        </div>

                        {/* todo status */}
                        <div className="col-5 order-3 col-sm-5 order-sm-3 col-md-2 order-md-3 col-lg-2 order-lg-3">
                          <span
                            style={{ float: "right" }}
                            className="badge badge-success"
                          >
                            <p className="mb-1">{todoItem.status}</p>
                          </span>
                        </div>

                        {/* speech syn */}
                        <div className="col-1 order-4 col-sm-1 order-sm-4 col-md-1 order-md-4 col-lg-1 order-lg-4">
                          <i
                            data-tip="speak out loud"
                            className={classNames("myIcon fa", {
                              "fa-play-circle": this.state.playing === false,
                              "fa-stop-circle": this.state.playing === true,
                            })}
                            onClick={() => this.onSpeak(todoItem)}
                          ></i>
                        </div>

                        {/* mark as complete icon */}
                        <div className="col-1 order-5 col-sm-1 order-sm-5 col-md-1 order-md-5 col-lg-1 order-lg-5">
                          <ReactTooltip place="bottom" delayShow={1000} />

                          <i
                            data-tip="mark all tasks as completed"
                            className={classNames("myIcon fa fa-check-circle", {
                              "text-success": todoItem.finished,
                              "text-dark": !todoItem.finished,
                            })}
                            onClick={() =>
                              this.onMarkAsComplete(todoItem, dispatch)
                            }
                          ></i>
                        </div>

                        {/* edit icon */}
                        <div className="col-1 order-6 col-sm-1 order-sm-6 col-md-1 order-md-6 col-lg-1 order-lg-6">
                          <Link to={`/editTeamTodo/${todoItem._id}`}>
                            <i
                              data-tip="edit task"
                              className={"myIcon fa fa-edit text-dark"}
                            ></i>
                          </Link>
                        </div>

                        {/* delete icon */}
                        <div className="col-1 order-7 col-sm-1 order-sm-7 col-md-1 order-md-7 col-lg-1 order-lg-7">
                          <i
                            className="myIcon fa fa-times-circle text-danger"
                            onClick={this.onDelete.bind(
                              this,
                              todoItem,
                              dispatch,
                              this.props.updateTeamTodos
                            )}
                          ></i>
                        </div>
                      </div>
                    </div>

                    <div
                      className="card-body pb-0 pt-1 mb-0 mt-1"
                      style={styles.card}
                    >
                      <div className="row cardBodyRow">
                        <div className="taskCol col-12">
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-8 col-lg-8 pr-0">
                              {/* todo title */}
                              <p
                                className="font-weight-bold my-auto pb-2"
                                style={{ fontSize: "16px" }}
                              >
                                {todoItem.title[0].toUpperCase() +
                                  todoItem.title.slice(1) +
                                  "(teamtask)"}
                                {/* imp mark */}
                                {todoItem.important === "true" ? (
                                  <span
                                    className="badge badge-danger ml-1 my-auto"
                                    style={{ fontSize: "13px" }}
                                  >
                                    Imp
                                  </span>
                                ) : null}
                              </p>
                            </div>
                            {/* progress bar : show only if there are multi tasks*/}
                            <div className="col-3  my-auto">
                              {todoItem.todoName.length > 0 ? (
                                <div
                                  className="progress"
                                  style={{ height: "7px", width: "100px" }}
                                >
                                  <div
                                    className="progress-bar bg-primary"
                                    role="progressbar"
                                    style={{
                                      width: `${this.onGetProgress(todoItem)}%`,
                                    }}
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              ) : null}
                            </div>

                            {/* reminder icon */}
                            {todoItem.reminderId ? (
                              <div className="col-5 col-sm-5 col-md-1 col-lg-1">
                                <i
                                  className="fa fa-bell"
                                  style={{
                                    float: "right",
                                    marginTop: "5px",
                                    color: "#37454d",
                                  }}
                                ></i>
                              </div>
                            ) : null}
                          </div>

                          {/* task name */}
                          {todoItem.collapsed
                            ? null
                            : todoItem.todoName.map((item, index) => {
                                return (
                                  <div className="row" key={index}>
                                    <div className="col m-0">
                                      <div className="row">
                                        <div className="col-1 ">
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
                                        <div className="col ">
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
                      </div>

                      {/* divider */}
                      {(todoItem.dueDate !== "0000-00-00" ||
                        todoItem.attachmentName) &&
                      todoItem.collapsed === false ? (
                        <hr style={{ margin: "10px 0 10px 0" }} />
                      ) : null}

                      <div
                        className="row mx-1"
                        style={{ justifyContent: "space-between" }}
                      >
                        {/* attachments */}
                        {todoItem.attachmentName &&
                        todoItem.collapsed === false ? (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              this.downloadAttachment(todoItem.attachmentName)
                            }
                          >
                            <i
                              className="fa fa-paperclip mb-2"
                              style={{ fontSize: "22px" }}
                            ></i>{" "}
                            {todoItem.attachmentName.slice(13)}
                          </span>
                        ) : null}

                        {/* due date */}
                        {todoItem.dueDate !== "0000-00-00" &&
                        todoItem.collapsed === false &&
                        todoItem.dueDate !== "Due date (if any)" ? (
                          <div className="dateDiv">
                            <p className="font-weight-bold m-0 p-0">Due Date</p>
                            <p
                              className={classNames({
                                "text-danger font-weight-bold": this.dueAlert,
                              })}
                            >
                              {todoItem.dueDate}
                            </p>
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
export default TeamTodo;
