import React, { Component } from "react";
import { Consumer } from "../../context";
import EachTodoItem from "./EachTodoItem";
import axios from "axios";
import classNames from "classnames";
import { Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
import "../../assets/addTodo-styles/addTodo.css";

class AddTodo extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      inputFields: [{ finished: false, itemName: "" }],
      dueDate: "",
      label: "Others",
      important: "false",

      // user history
      history: [],

      // attachment
      attachFile: false,
      attachmentName: "",
      file: "",
    };
  }

  async componentDidMount() {
    // const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("auth-token");

    try {
      let userRes = await axios.get("/users", {
        headers: { "x-auth-token": token },
      });

      if (userRes.data.history === null) userRes.data.history = [];

      this.setState({ history: userRes.data.history });
    } catch (err) {
      console.log(err);
    }
  }

  onChangeInputFields = (index) => (e) => {
    let newArr = [...this.state.inputFields];
    newArr[index].itemName = e.target.value;

    this.setState({
      inputFields: newArr,
    });
  };

  onToggleMarkAsImp = (e) => {
    e.preventDefault();
    this.setState({
      important: this.state.important === "true" ? "false" : "true",
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
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

    let fieldList = this.state.inputFields;
    fieldList.splice(index, 1);

    this.setState({ inputFields: fieldList });
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
      dueDate,
      label,
      inputFields,
      important,
      history,
      attachmentName,
    } = this.state;

    if (dueDate === "" || dueDate === "Due date (if any)")
      dueDate = "0000-00-00";

    // adding new todo to db
    const newTodo = {
      userId: user.id,
      title,
      finished: false,
      collapsed: false,
      todoName: inputFields,
      dueDate,
      label,
      status: "new",
      important,
      attachmentName,
    };

    const res = await axios.post("/todos/add", newTodo);
    console.log("Added: ", res.data);

    // updating to history
    const token = localStorage.getItem("auth-token");

    let updatedHistory = [...history];
    updatedHistory.push(res.data);

    try {
      await axios.put("/users/updateHistory", updatedHistory, {
        headers: { "x-auth-token": token },
      });
    } catch (err) {
      console.log("ERROR: ", err.response);
    }

    dispatch({
      type: "ADD_TODO",
      payload: res.data,
    });

    let updatedUser = user;
    updatedUser.history.push(res.data);

    dispatch({
      type: "UPDATE_USER",
      payload: updatedUser,
    });

    this.props.history.push("/");
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
                                Add New Task
                              </h3>
                              {/* title */}
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-12 col-sm-8 col-md-8 col-lg-8 mb-1">
                                    <input
                                      required
                                      className="form-control"
                                      name="title"
                                      type="text"
                                      placeholder="Task title"
                                      onChange={this.onChange}
                                      value={this.state.title}
                                    />
                                  </div>
                                  {/* mark as imp */}
                                  <div className="col">
                                    <button
                                      className={classNames("btn ", {
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

                              {/* each todo  */}
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
                                  <div className="col-8">
                                    <input
                                      onFocus={this._onFocus}
                                      onBlur={this._onBlur}
                                      name="dueDate"
                                      type="text"
                                      className="form-control"
                                      placeholder="Due date (if any)"
                                      value={this.state.dueDate}
                                      onChange={this.onChange}
                                    />
                                  </div>
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
                              <div className="row">
                                <div className="col">
                                  <input
                                    type="submit"
                                    value="Add"
                                    className="btn btn-danger btn-block"
                                  />
                                </div>
                              </div>
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

export default AddTodo;
