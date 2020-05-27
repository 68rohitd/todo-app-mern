import React, { Component } from "react";
import axios from "axios";
import Todo from "./Todo";
import { Spring } from "react-spring/renderprops";
import classNames from "classnames";
import "../../assets/todos-styles/todos.css";

class AdvnacedFilter extends Component {
  constructor() {
    super();

    this.state = {
      label: "All Labels",
      status: "All Status",
      important: "false",
      dueDate: "",
    };

    this.searchRes = [];
  }

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

  onSetLabel = (value, e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: value,
    });
  };

  onSubmit = async (user, e) => {
    e.preventDefault();

    let { label, status, dueDate, important } = this.state;

    try {
      const res = await axios.post("/todos/search", {
        id: user.id,
        label,
        status,
        important,
        dueDate,
      });

      this.searchRes = [...res.data];
      this.setState({
        label: "All Labels",
        status: "All Status",
        important: "false",
        dueDate: "",
      });
    } catch (err) {
      console.log("Error: ", err.response.data);
    }
  };

  _onFocus = (e) => {
    e.currentTarget.type = "date";
  };
  _onBlur = (e) => {
    e.currentTarget.type = "text";
  };

  render() {
    const { user, todos, currList } = this.props;

    let prevSearchRes = [...this.searchRes];
    let updatedSearchRes = [];
    todos.forEach((todoItem) => {
      prevSearchRes.forEach((prevItem) => {
        if (prevItem._id === todoItem._id) {
          updatedSearchRes.push(todoItem);
        }
      });
    });
    this.searchRes = [...updatedSearchRes];

    // filter the searchRes list based on label clicked
    let listToDisplay = [];
    if (currList === "All") {
      listToDisplay = this.searchRes;
    } else if (currList === "Personal") {
      listToDisplay = this.searchRes.filter(
        (todo) => todo.label === "Personal"
      );
    } else if (currList === "Work") {
      listToDisplay = this.searchRes.filter((todo) => todo.label === "Work");
    } else if (currList === "Shopping") {
      listToDisplay = this.searchRes.filter(
        (todo) => todo.label === "Shopping"
      );
    } else {
      listToDisplay = this.searchRes.filter((todo) => todo.label === "Others");
    }

    return (
      <>
        <hr style={{ width: "90%" }} />
        <div className="container advancedFilterContainer">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 d-flex justify-content-center">
              <Spring
                from={{ marginLeft: -500 }}
                to={{ marginLeft: 0 }}
                config={{ friction: 18 }}
              >
                {(props) => (
                  <div style={props}>
                    <form
                      className="searchForm"
                      onSubmit={this.onSubmit.bind(this, user)}
                    >
                      {/* label */}
                      <div className="btn-group mb-2">
                        <button
                          className="btn dropdown-toggle btn-outline-secondary mr-1"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.label}
                        </button>

                        <div className="dropdown-menu">
                          <button
                            name="label"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "All Labels")}
                          >
                            All Labels
                          </button>
                          <button
                            name="label"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "Personal")}
                          >
                            Personal
                          </button>
                          <button
                            name="label"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "Work")}
                          >
                            Work
                          </button>
                          <button
                            name="label"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "Shopping")}
                          >
                            Shopping
                          </button>
                          <button
                            name="label"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "Others")}
                          >
                            Others
                          </button>
                        </div>
                      </div>

                      {/* status */}
                      <div className="btn-group mb-2">
                        <button
                          className="btn dropdown-toggle btn-outline-secondary ml-3"
                          // style={{ marginRight: "10px" }}
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.status}
                        </button>

                        <div className="dropdown-menu">
                          <button
                            name="status"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "All Status")}
                          >
                            All Status
                          </button>
                          <button
                            name="status"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "new")}
                          >
                            New
                          </button>
                          <button
                            name="status"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "in progress")}
                          >
                            In Progress
                          </button>
                          <button
                            name="status"
                            className="dropdown-item btn btn-secondary"
                            onClick={this.onSetLabel.bind(this, "completed")}
                          >
                            Completed
                          </button>
                        </div>
                      </div>

                      {/* important */}
                      <div className="form-group m-0">
                        <div className="row m-0">
                          <div className="col p-0">
                            <button
                              className={classNames("btn btn-block", {
                                "btn-secondary":
                                  this.state.important === "true",
                                "btn-outline-secondary":
                                  this.state.important === "false",
                              })}
                              onClick={this.onToggleMarkAsImp}
                            >
                              Marked as Important
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* due date */}
                      <div className="form-group m-0">
                        <div className="row m-0">
                          <div className="col p-0">
                            <input
                              onFocus={this._onFocus}
                              onBlur={this._onBlur}
                              placeholder="Due date"
                              name="dueDate"
                              type="text"
                              style={{
                                borderColor: "#47535E",
                                backgroundColor: "#eceff1",
                              }}
                              className="form-control mt-2"
                              value={this.state.dueDate}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                      <input
                        type="submit"
                        value="Search"
                        className="btn btn-outline-secondary btn-block mb-3"
                      />
                    </form>
                  </div>
                )}
              </Spring>
            </div>
            <div className="col-12 col-sm-12 col-md-8">
              {/* display results */}
              {listToDisplay.length > 0 ? (
                <>
                  {listToDisplay.map((todoItem) => (
                    <Todo key={todoItem._id} todoItem={todoItem} />
                  ))}
                </>
              ) : (
                <div className="d-flex justify-content-center">
                  <span className="text-muted">No result to display</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AdvnacedFilter;
