import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import classNames from "classnames";
import Todo from "./Todo";
import AdvnacedFilter from "./AdvnacedFilter";
import { Consumer } from "../../context";
import "../../assets/todos-styles/todos.css";
import SidePanel from "../layouts/SidePanel";

class Todos extends Component {
  constructor() {
    super();

    this.state = {
      currList: "All",

      label: "All Labels",
      status: "All Status",
      dueDate: "",
      searchRes: [],

      showAdvancedFilterOptions: false,
    };
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

  render() {
    return (
      <Consumer>
        {(value) => {
          let { todos, user } = value;
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
          console.log(listToDisplay);
          if (token) {
            return (
              <React.Fragment>
                <div className="row p-0 m-0 topRow">
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
                          "btn btn-success mt-1 mb-1 mr-1 p-1 font-weight-bold",
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
                        className={classNames(
                          "btn btn-primary m-1 p-1 font-weight-bold",
                          {
                            activeLabel: this.state.currList === "Personal",
                          }
                        )}
                        onClick={() => this.setState({ currList: "Personal" })}
                      >
                        Personal{" "}
                        <span className="badge badge-light">
                          {personalCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={classNames(
                          "btn btn-danger m-1 p-1 font-weight-bold",
                          {
                            activeLabel: this.state.currList === "Shopping",
                          }
                        )}
                        onClick={() => this.setState({ currList: "Shopping" })}
                      >
                        Shopping{" "}
                        <span className="badge badge-light">
                          {shoppingCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={classNames(
                          "btn btn-dark m-1 p-1 font-weight-bold",
                          {
                            activeLabel: this.state.currList === "Work",
                          }
                        )}
                        onClick={() => this.setState({ currList: "Work" })}
                      >
                        Work{" "}
                        <span className="badge badge-light">{workCount}</span>
                      </button>

                      <button
                        type="button"
                        className={classNames(
                          "btn btn-warning mt-1 mb-1 ml-1 p-1 font-weight-bold text-light",
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
                        Add Task
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
                    <div className="row m-0 p-0">
                      {/* side panel */}
                      <div
                        className="col-12 order-2 col-sm-12 order-sm-2 col-md-2 order-md-1 col-lg-2 order-md-1"
                        style={{
                          marginTop: "140px",
                          paddingLeft: 0,
                        }}
                      >
                        <SidePanel />
                      </div>

                      {/* todo list */}
                      <div className="col order-1">
                        {listToDisplay.length > 0 ? (
                          <div className="container todoContainer">
                            {listToDisplay.map((todoItem) => (
                              <Todo key={todoItem._id} todoItem={todoItem} />
                            ))}
                          </div>
                        ) : (
                          <div className="container caughtUpContainer">
                            <h3 className="text-secondary">
                              You're all caught up! 😇
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
