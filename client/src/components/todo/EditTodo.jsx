import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import axios from "axios";
import classNames from "classnames";
import { Redirect } from "react-router-dom";
import EachTodoItem from "./EachTodoItem";
import { Spring } from "react-spring/renderprops";
import "../../assets/addTodo-styles/addTodo.css";

class AddTodo extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      inputFields: [],
      dueDate: "",
      label: "",
      status: "",
      finished: false,
      important: "false",
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const fetchedData = await axios.get(`/todos/${id}`);
    console.log("fetched data: ", fetchedData.data);

    setTimeout(() => {
      this.setState({
        title: fetchedData.data.title,
        inputFields: fetchedData.data.todoName,
        dueDate: fetchedData.data.dueDate,
        label: fetchedData.data.label,
        status: fetchedData.data.status,
        finished: fetchedData.data.finished,
        important: fetchedData.data.important,
      });
    }, 350);
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

  onSubmit = async (dispatch, user, e) => {
    e.preventDefault();

    let {
      title,
      inputFields,
      dueDate,
      label,
      status,
      finished,
      important,
    } = this.state;
    const { id } = this.props.match.params;
    if (dueDate === "") dueDate = "0000-00-00";

    // check if added new item, if so set status to 'in Progress'
    status = "in progress";
    if (inputFields.every((item) => item.finished === true))
      status = "completed";
    if (inputFields.every((item) => item.finished === false)) status = "new";

    const updatedTodo = {
      userId: user.id,
      title,
      todoName: inputFields,
      dueDate,
      label,
      status,
      finished,
      collapsed: false,
      important,
    };

    const res = await axios.post(`/todos/update/${id}`, updatedTodo);
    console.log("updated todo: ", updatedTodo);
    dispatch({
      type: "UPDATE_TODO",
      payload: res.data,
    });

    this.props.history.push("/");
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, user, token } = value;
          if (token === undefined) token = "";

          if (token) {
            return (
              <div className="container mt-5">
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
                            onSubmit={this.onSubmit.bind(this, dispatch, user)}
                          >
                            <h3 className="headingText text-center">
                              Update Your Task
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
                                <div className="col-8">
                                  <label
                                    htmlFor="dueDate"
                                    style={{ marginBottom: 0 }}
                                  >
                                    Due Date
                                  </label>
                                  <small className="form-text text-muted mb-2">
                                    If any
                                  </small>
                                  <input
                                    name="dueDate"
                                    type="date"
                                    className="form-control"
                                    placeholder="Enter Due date"
                                    value={this.state.dueDate}
                                    onChange={this.onChange}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* label */}
                            <div className="btn-group mb-4">
                              <button type="button" className="btn btn-danger">
                                {this.state.label}
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger dropdown-toggle dropdown-toggle-split"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                <span className="sr-only">Toggle Dropdown</span>
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
                                  onClick={this.onSetLabel.bind(this, "Others")}
                                >
                                  Others
                                </button>
                              </div>
                            </div>
                            <br />
                            <input
                              type="submit"
                              value="Update"
                              className="btn btn-danger btn-block"
                            />
                          </form>
                        </div>
                      )}
                    </Spring>
                  </div>
                </div>
              </div>
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
