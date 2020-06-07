import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import classNames from "classnames";
import Todo from "./Todo";
import AdvnacedFilter from "./AdvnacedFilter";
import { Consumer } from "../../context";
import "../../assets/todos-styles/todos.css";
import SidePanel from "../layouts/SidePanel";
import axios from "axios";

class Todos extends Component {
  constructor() {
    super();

    this.state = {
      // quick add
      title: "",

      // user history
      history: [],

      currList: "All",
      label: "All Labels",
      status: "All Status",
      dueDate: "",
      searchRes: [],

      showAdvancedFilterOptions: false,
    };
  }
  // for loading history
  async componentDidMount() {
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

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSetLabel = (value, e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: value,
    });
  };

  onToggleAdvancedFilterOptions = () => {
    this.setState({
      showAdvancedFilterOptions: !this.state.showAdvancedFilterOptions,
    });
  };

  onAddQuickTask = async (dispatch, user, e) => {
    e.preventDefault();
    console.log("submitting");

    const { title, history } = this.state;

    if (title.trim()) {
      // adding new todo to db
      const newTodo = {
        userId: user.id,
        title,
        finished: false,
        collapsed: false,
        todoName: [],
        dueDate: "0000-00-00",
        label: "Others",
        status: "new",
        important: "false",
        attachmentName: "",
        reminderId: "",
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

      this.setState({ title: "" });
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { todos, user, dispatch } = value;
          if (user === undefined) user = "";

          // getting token from localstorage to avoid flicker
          let token = localStorage.getItem("auth-token");

          let personalCount = 0,
            workCount = 0,
            shoppingCount = 0,
            otherCount = 0;

          todos.forEach((todo) => {
            if (todo.label === "Personal") personalCount++;
            else if (todo.label === "Work") workCount++;
            else if (todo.label === "Shopping") shoppingCount++;
            else if (todo.label === "Others") otherCount++;
          });

          // filter list
          let listToDisplay = [];
          if (this.state.currList === "All") {
            listToDisplay = todos;
          } else if (this.state.currList === "Personal") {
            listToDisplay = todos.filter((todo) => todo.label === "Personal");
          } else if (this.state.currList === "Work") {
            listToDisplay = todos.filter((todo) => todo.label === "Work");
          } else if (this.state.currList === "Shopping") {
            listToDisplay = todos.filter((todo) => todo.label === "Shopping");
          } else {
            listToDisplay = todos.filter((todo) => todo.label === "Others");
          }

          if (token) {
            return (
              <React.Fragment>
                <div className="row mx-0 topRow">
                  {/* search btn */}
                  <div className="col-6 order-2 col-sm-6 order-sm-2 col-md-2 order-md-1 p-0 m-0">
                    <button
                      className="searchBtn btn btn-secondary mt-3"
                      onClick={this.onToggleAdvancedFilterOptions}
                    >
                      {this.state.showAdvancedFilterOptions ? (
                        <i
                          className="fa fa-arrow-circle-left"
                          style={{ fontSize: 25 }}
                        ></i>
                      ) : (
                        <i
                          className="fa fa-search"
                          style={{ fontSize: 25 }}
                        ></i>
                      )}
                    </button>
                  </div>

                  {/* badge stack */}
                  <div className="col-12 order-1 col-sm-12 order-sm-1 col-md-8 order-md-1 badgeCol">
                    <div className="badgeContainer mt-3">
                      <button
                        type="button"
                        className={classNames(
                          "btn btn-success mt-1 mb-1 mr-1 p-1",
                          {
                            activeLabel: this.state.currList === "All",
                          }
                        )}
                        onClick={() => this.setState({ currList: "All" })}
                      >
                        All{" "}
                        <span className="badge badge-light">
                          {personalCount +
                            workCount +
                            shoppingCount +
                            otherCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={classNames("btn btn-primary m-1 p-1", {
                          activeLabel: this.state.currList === "Personal",
                        })}
                        onClick={() => this.setState({ currList: "Personal" })}
                      >
                        Personal{" "}
                        <span className="badge badge-light">
                          {personalCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={classNames("btn btn-danger m-1 p-1", {
                          activeLabel: this.state.currList === "Shopping",
                        })}
                        onClick={() => this.setState({ currList: "Shopping" })}
                      >
                        Shopping{" "}
                        <span className="badge badge-light">
                          {shoppingCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={classNames("btn btn-dark m-1 p-1", {
                          activeLabel: this.state.currList === "Work",
                        })}
                        onClick={() => this.setState({ currList: "Work" })}
                      >
                        Work{" "}
                        <span className="badge badge-light">{workCount}</span>
                      </button>

                      <button
                        type="button"
                        className={classNames(
                          "btn btn-warning mt-1 mb-1 ml-1 p-1 text-light",
                          {
                            activeLabel: this.state.currList === "Others",
                          }
                        )}
                        onClick={() => this.setState({ currList: "Others" })}
                      >
                        Others{" "}
                        <span className="badge badge-light ">{otherCount}</span>
                      </button>
                    </div>
                  </div>

                  {/* add tobo btn */}
                  <div className="col-6 order-2 col-sm-6 order-sm-2 col-md-2 order-md-1 p-0 m-0">
                    <Link to="/add">
                      <button
                        type="button"
                        className="addBtn btn btn-secondary font-weight-bold mt-3"
                      >
                        <i
                          className="fa fa-plus"
                          style={{ fontSize: 25, marginTop: "4px" }}
                        ></i>
                      </button>
                    </Link>
                  </div>

                  <hr
                    style={{
                      width: "90%",
                      order: 4,
                      marginBottom: 0,
                    }}
                  />
                </div>

                {/* advanced filter component */}
                {this.state.showAdvancedFilterOptions ? (
                  <AdvnacedFilter
                    user={user}
                    todos={todos}
                    currList={this.state.currList}
                  />
                ) : (
                  <div className="container">
                    <div className="row">
                      {/* side panel */}
                      <div className="col-12 order-2 col-sm-12 order-sm-2 col-md-3 order-md-1 col-lg-3 order-md-1">
                        <SidePanel todos={todos} user={user} />
                      </div>

                      <div className="col order-1">
                        {/* quick add */}
                        <form
                          onSubmit={this.onAddQuickTask.bind(
                            this,
                            dispatch,
                            user
                          )}
                        >
                          <div className="col-12 ">
                            <div className="input-group mt-2">
                              <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="Quick add"
                                onChange={this.onChange}
                                value={this.state.title}
                              />
                              <div className="input-group-append">
                                <button type="submit" className="btn btn-dark">
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>

                        {/* todo list */}
                        {listToDisplay.length > 0 ? (
                          <div className="container todoContainer">
                            {listToDisplay.map((todoItem) => (
                              <Todo key={todoItem._id} todoItem={todoItem} />
                            ))}
                          </div>
                        ) : (
                          <div className="container caughtUpContainer">
                            <h3 className="text-secondary">
                              You're all caught up!{" "}
                              <span role="img" aria-label="smile">
                                😇
                              </span>
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default Todos;
