import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import axios from "axios";
import classNames from "classnames";
import { Redirect } from "react-router-dom";
import EachTodoItem from "../todo/EachTodoItem";
import { Spring } from "react-spring/renderprops";
import "../../assets/addTodo-styles/addTodo.css";

class EditTeamTodo extends Component {
  constructor() {
    super();

    this.state = {
      userId: "",
      title: "",
      inputFields: [],
      dueDate: "",
      label: "",
      status: "",
      finished: false,
      important: "false",

      // google calender
      setReminder: false,
      reminderId: "",

      prevTitle: "",
      prevDueDate: "",
      prevSetReminder: false,
      prevTime: "",
      time: "",

      // history
      history: [],

      // attachment
      attachFile: false,
      attachmentName: "",
      file: "",
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    let fetchedData = await axios.get(`/todos/${id}`);

    console.log("fetched data: ", fetchedData.data);

    if (fetchedData.data.dueDate === "0000-00-00")
      fetchedData.data.dueDate = "Due date (if any)";

    if (fetchedData.data.attachmentName) this.setState({ attachFile: true });
    setTimeout(() => {
      this.setState({
        userId: fetchedData.data.userId, //to avoid changin owner problem
        title: fetchedData.data.title,
        inputFields: fetchedData.data.todoName,
        dueDate: fetchedData.data.dueDate,
        label: fetchedData.data.label,
        status: fetchedData.data.status,
        finished: fetchedData.data.finished,
        important: fetchedData.data.important,
        attachmentName: fetchedData.data.attachmentName,
        reminderId: fetchedData.data.reminderId,
        setReminder: fetchedData.data.reminderId ? true : false,
        prevTitle: fetchedData.data.title,
        prevDueDate: fetchedData.data.dueDate,
        prevSetReminder: fetchedData.data.reminderId ? true : false,
        time: fetchedData.data.time,
        prevTime: fetchedData.data.time,
      });
    }, 300);

    // getting history of user
    const token = localStorage.getItem("auth-token");
    const userHistory = await axios.get("/users", {
      headers: { "x-auth-token": token },
    });

    let historyList = userHistory.data.history;
    if (historyList === null) historyList = [];
    this.setState({ history: historyList });
  }

  onChangeInputFields = (index) => (e) => {
    let newArr = [...this.state.inputFields];
    newArr[index].itemName = e.target.value;

    this.setState({
      inputFields: newArr,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onToggleMarkAsImp = (e) => {
    e.preventDefault();
    this.setState({
      important: this.state.important === "true" ? "false" : "true",
    });
  };

  onSetLabel = (label, e) => {
    e.preventDefault();
    this.setState({ label });
  };

  onAddInputField = (e) => {
    e.preventDefault();
    this.setState({
      inputFields: [
        ...this.state.inputFields,
        { finished: false, itemName: "" },
      ],
    });
  };

  onDeleteInputField = (index, e) => {
    // e.preventDefault();
    console.log("index: ", index);
    let fieldList = this.state.inputFields;
    fieldList.splice(index, 1);
    console.log("Updeted list: ", fieldList);
    this.setState({ inputFields: fieldList });
  };

  _onFocus = (e) => {
    e.currentTarget.type = "date";
  };

  _onBlur = (e) => {
    e.currentTarget.type = "text";
  };

  onFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
      attachmentName: e.target.files[0].name,
    });
  };

  clearFile = (e) => {
    e.preventDefault();
    this.fileInput.value = "";
    this.setState({ file: "", attachmentName: "" });
  };

  addToGoogleCalender = (user, todoItem, dispatch) => {
    if (this.state.title && this.state.dueDate) {
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
            var event = {
              summary: this.state.title,
              start: {
                dateTime: `${this.state.dueDate}T${this.state.time}:00`,
                timeZone: "Asia/Kolkata",
              },
              end: {
                dateTime: `${this.state.dueDate}T${this.state.time}:00`,
                timeZone: "Asia/Kolkata",
              },
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "email", minutes: 24 * 60 },
                  { method: "popup", minutes: 10 },
                ],
              },
            };

            // update event
            if (this.state.reminderId && this.state.setReminder) {
              console.log("upadating evet...");
              var request = gapi.client.calendar.events.update({
                calendarId: "primary",
                eventId: this.state.reminderId,
                resource: event,
              });
            }
            // add new event
            if (
              this.state.setReminder &&
              (this.state.reminderId === "" || this.state.reminderId === null)
            ) {
              console.log("adding new event from editTodo");
              var request = gapi.client.calendar.events.insert({
                calendarId: "primary",
                resource: event,
              });
            }

            // delete event
            if (this.state.setReminder === false && this.state.reminderId) {
              console.log("deleting event...");
              var request = gapi.client.calendar.events.delete({
                calendarId: "primary",
                eventId: this.state.reminderId,
              });
            }

            request.execute((event) => {
              console.log(event);

              // send event id to db
              axios
                .post("/todos/updateReminderId", {
                  eventId: event.id,
                  taskId: todoItem._id,
                })
                .then((res) => {
                  dispatch({
                    type: "UPDATE_TODO",
                    payload: res.data,
                  });
                });
            });
          });
      });
    }
  };

  onSubmit = async (dispatch, user, e) => {
    e.preventDefault();

    // upload file if selected
    if (this.state.file) {
      const data = new FormData();
      data.append("file", this.state.file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      try {
        const fileUploadRes = await axios.post(
          "/todos/uploadfile",
          data,
          config
        );
        console.log(fileUploadRes.data.filename);
        this.setState({ attachmentName: fileUploadRes.data.filename });
      } catch (err) {
        console.log(err);
      }
    }

    let {
      title,
      inputFields,
      dueDate,
      label,
      status,
      finished,
      important,
      history,
      attachmentName,
      reminderId,
      time,
    } = this.state;

    const { id } = this.props.match.params;

    if (dueDate === "" || dueDate === "Due date (if any)")
      dueDate = "0000-00-00";

    // check if added new item, if so set status to 'in Progress'
    status = "in progress";
    finished = false;
    if (inputFields.every((item) => item.finished === true)) {
      status = "completed";
      finished = true;
    }
    if (inputFields.every((item) => item.finished === false)) {
      status = "new";
      finished = false;
    }

    // updating the todo
    const updatedTodo = {
      userId: "000",
      title,
      todoName: inputFields,
      dueDate,
      label,
      status,
      finished,
      collapsed: false,
      important,
      attachmentName,
      reminderId,
      time,
    };

    const res = await axios.post(`/todos/update/${id}`, updatedTodo);
    console.log("updated todo: ", updatedTodo);

    // goto google calender only if title or duedate or time has been changed!
    if (
      this.state.prevTitle !== this.state.title ||
      this.state.prevDueDate !== this.state.dueDate ||
      this.state.prevSetReminder !== this.state.setReminder ||
      this.state.time !== this.state.prevTime
    ) {
      // set/update/delete reminder to google calender
      if (this.state.setReminder || this.state.reminderId)
        this.addToGoogleCalender(user, res.data, dispatch);
    }

    // updating user's history todo too
    const token = localStorage.getItem("auth-token");

    history.forEach((item) => {
      if (item._id === res.data._id) {
        item.userId = user.id;
        item.title = title;
        item.todoName = inputFields;
        item.dueDate = dueDate;
        item.label = label;
        item.status = status;
        item.finished = finished;
        item.collapsed = false;
        item.important = important;
      }
    });

    try {
      axios.put("/users/updateHistory", history, {
        headers: { "x-auth-token": token },
      });
    } catch (err) {
      console.log("ERROR: ", err.response);
    }

    dispatch({
      type: "UPDATE_TEAMTODO",
      payload: res.data,
    });

    this.props.history.push(`/addMember/${res.data._id}`);
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, user, token } = value;
          if (token === undefined) token = "";

          if (token) {
            return (
              <>
                {/* back btn */}
                <button
                  style={{ position: "fixed" }}
                  onClick={() => this.props.history.push("/")}
                  className="backBtn btn btn-dark mt-3"
                >
                  <i
                    style={{ fontSize: 25 }}
                    className="fa fa-arrow-circle-left"
                  ></i>
                </button>

                {/* form */}
                <div className="container mt-5 pt-4">
                  <div
                    className="row m-0"
                    style={{ flexDirection: "column", alignContent: "center" }}
                  >
                    <div className="col-12 col-sm-12 col-md-8 col-lg-7">
                      <Spring
                        from={{
                          transform: "translate3d(-1000px,0,0) ",
                        }}
                        to={{
                          transform: "translate3d(0px,0,0) ",
                        }}
                        config={{ friction: 20 }}
                      >
                        {(props) => (
                          <div style={props}>
                            <form
                              className="addTodoForm"
                              onSubmit={this.onSubmit.bind(
                                this,
                                dispatch,
                                user
                              )}
                            >
                              <h3 className="headingText text-center">
                                Update Team Task
                              </h3>
                              {/* title */}
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-12 col-sm-8 col-md-8 col-lg-8 mb-1">
                                    <input
                                      required
                                      name="title"
                                      className="form-control"
                                      type="text"
                                      placeholder="Task title"
                                      onChange={this.onChange}
                                      value={this.state.title}
                                    />
                                  </div>
                                  {/* mark as imp */}
                                  <div className="col">
                                    <button
                                      className={classNames("btn btn-block", {
                                        "btn-danger":
                                          this.state.important === "true",
                                        "btn-outline-danger":
                                          this.state.important === "false",
                                      })}
                                      onClick={this.onToggleMarkAsImp}
                                    >
                                      Important
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* each todo */}
                              <div className="form-group">
                                {this.state.inputFields.map((data, index) => (
                                  <EachTodoItem
                                    key={index}
                                    placeholder={`Task No. ${index + 1}`}
                                    onChange={this.onChangeInputFields(index)}
                                    value={data.itemName}
                                    onClick={this.onDeleteInputField.bind(
                                      this,
                                      index
                                    )}
                                  />
                                ))}
                              </div>

                              {/* add extra todo btn */}
                              <div className="form-group">
                                <div className="row">
                                  <div className="col">
                                    <button
                                      className="btn btn-danger"
                                      onClick={this.onAddInputField.bind(this)}
                                    >
                                      Add another task
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* due date */}
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-6">
                                    <input
                                      onFocus={this._onFocus}
                                      onBlur={this._onBlur}
                                      name="dueDate"
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter Due date"
                                      value={this.state.dueDate}
                                      onChange={this.onChange}
                                    />
                                  </div>
                                  {/* set reminder only if due-date is set*/}
                                  {this.state.dueDate &&
                                  this.state.dueDate !== "Due date (if any)" ? (
                                    <>
                                      <div className="col-1 m-0 p-0">
                                        <i
                                          style={{
                                            fontSize: "22px",
                                            cursor: "pointer",
                                            color: "#37454d",
                                            marginTop: "8px",
                                          }}
                                          onClick={() =>
                                            this.setState({
                                              setReminder: !this.state
                                                .setReminder,
                                            })
                                          }
                                          className={classNames("fa", {
                                            "fa-bell": this.state.setReminder,
                                            "fa-bell-slash": !this.state
                                              .setReminder,
                                          })}
                                        ></i>
                                      </div>
                                      <div className="col-4 p-0">
                                        {this.state.setReminder ? (
                                          <input
                                            className="form-control p-0"
                                            name="time"
                                            type="time"
                                            required
                                            value={this.state.time}
                                            onChange={this.onChange}
                                          />
                                        ) : null}
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              {/* label */}
                              <div className="btn-group mb-4">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                >
                                  {this.state.label}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger dropdown-toggle dropdown-toggle-split"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <span className="sr-only">
                                    Toggle Dropdown
                                  </span>
                                </button>
                                <div className="dropdown-menu">
                                  <button
                                    name="Personal"
                                    className="dropdown-item btn btn-danger"
                                    onClick={this.onSetLabel.bind(
                                      this,
                                      "Personal"
                                    )}
                                  >
                                    Personal
                                  </button>
                                  <button
                                    name="Personal"
                                    className="dropdown-item btn btn-danger"
                                    onClick={this.onSetLabel.bind(this, "Work")}
                                  >
                                    Work
                                  </button>
                                  <button
                                    name="Personal"
                                    className="dropdown-item btn btn-danger"
                                    onClick={this.onSetLabel.bind(
                                      this,
                                      "Shopping"
                                    )}
                                  >
                                    Shopping
                                  </button>
                                  <button
                                    name="Personal"
                                    className="dropdown-item btn btn-danger"
                                    onClick={this.onSetLabel.bind(
                                      this,
                                      "Others"
                                    )}
                                  >
                                    Others
                                  </button>
                                </div>
                              </div>

                              {/* attachment */}
                              <div className="form-group">
                                <div className="row">
                                  <div className="col">
                                    <p
                                      className="text-secondary"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        this.setState({
                                          attachFile: !this.state.attachFile,
                                        })
                                      }
                                    >
                                      Attachment (if any){" "}
                                      <i
                                        className={classNames("fa", {
                                          "fa-caret-down": !this.state
                                            .attachFile,
                                          "fa-caret-up": this.state.attachFile,
                                        })}
                                      ></i>
                                    </p>

                                    {this.state.attachFile ? (
                                      <div className="input-group mb-3">
                                        <div className="custom-file">
                                          <input
                                            type="file"
                                            id="file"
                                            className="custom-file-input"
                                            onChange={this.onFileChange}
                                            ref={(ref) =>
                                              (this.fileInput = ref)
                                            }
                                          />
                                          <label
                                            className="custom-file-label"
                                            htmlFor="file"
                                          >
                                            {this.state.attachmentName
                                              ? this.state.attachmentName
                                              : "Upload file"}
                                          </label>
                                        </div>
                                        <div className="input-group-append">
                                          <span
                                            style={{ cursor: "pointer" }}
                                            onClick={this.clearFile}
                                            className="input-group-text"
                                            id="file"
                                          >
                                            Clear
                                          </span>
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>

                              <br />
                              <input
                                type="submit"
                                value="Continue to add/remove members"
                                className="btn btn-danger btn-block"
                              />
                            </form>
                          </div>
                        )}
                      </Spring>
                    </div>
                  </div>
                </div>
              </>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default EditTeamTodo;
