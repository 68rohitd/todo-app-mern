import React, { Component } from "react";
import { Consumer } from "../../context";
import EachTodoItem from "./EachTodoItem";
import axios from "axios";
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
    };
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

    let { title, dueDate, label, inputFields } = this.state;
    if (dueDate === "") dueDate = "0000-00-00";
    const newTodo = {
      userId: user.id,
      title,
      finished: false,
      collapsed: false,
      todoName: inputFields,
      dueDate,
      label,
      status: "new",
    };

    const res = await axios.post("http://localhost:5000/todos/add", newTodo);
    console.log("Added: ", res.data);
    dispatch({
      type: "ADD_TODO",
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
                  <div className="col-md-7 col-lg-7">
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
                              Add New Task
                            </h3>
                            {/* title */}
                            <div className="form-group">
                              <div className="row">
                                <div className="col">
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
                                    style={{
                                      marginBottom: 0,
                                      paddingBottom: 0,
                                    }}
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
