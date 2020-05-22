import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Todo from "./Todo";
import AdvnacedFilter from "./AdvnacedFilter";
import { Consumer } from "../../context";
import "../../assets/todos-styles/todos.css";

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

          if (token) {
            return (
              <React.Fragment>
                <div className="row p-0 m-0">
                  {/* welcome msg */}
                  <div className="col-10">
                    <h6 style={{ marginTop: "34px", fontWeight: "normal" }}>
                      {user ? (
                        <span>
                          Welcome <b>{user.displayName}</b>!
                        </span>
                      ) : null}
                    </h6>
                  </div>
                  {/* add tobo btn */}
                  <div className="col-2 p-0 m-0">
                    <Link to="/add">
                      <button
                        type="button"
                        className="addBtn btn btn-secondary my-2"
                        style={{
                          float: "right",
                          borderRadius: "12px 0 0 12px",
                          height: "50px",
                          width: "50px",
                        }}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </Link>
                  </div>
                </div>
                {/* badges */}
                <div
                  className="badgeContainer container"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    type="button"
                    className="btn btn-success mt-1 mb-1 mr-1 p-1"
                    onClick={() => this.setState({ currList: "All" })}
                  >
                    All{" "}
                    <span className="badge badge-light">
                      {personalCount + workCount + shoppingCount + otherCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary m-1 p-1"
                    onClick={() => this.setState({ currList: "Personal" })}
                  >
                    Personal{" "}
                    <span className="badge badge-light">{personalCount}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-1 p-1"
                    onClick={() => this.setState({ currList: "Shopping" })}
                  >
                    Shopping{" "}
                    <span className="badge badge-light">{shoppingCount}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark m-1 p-1"
                    onClick={() => this.setState({ currList: "Work" })}
                  >
                    Work <span className="badge badge-light">{workCount}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning mt-1 mb-1 ml-1 p-1"
                    onClick={() => this.setState({ currList: "Others" })}
                  >
                    Others{" "}
                    <span className="badge badge-light ">{otherCount}</span>
                  </button>
                </div>
                {/* search btn */}
                <button
                  className="searchBtn btn btn-secondary mt-2"
                  style={{
                    borderRadius: "0 12px 12px 0",
                    height: "50px",
                    width: "50px",
                  }}
                  onClick={this.onToggleAdvancedFilterOptions}
                >
                  {this.state.showAdvancedFilterOptions ? (
                    <i
                      className="fa fa-arrow-circle-left"
                      style={{ fontSize: 25 }}
                    ></i>
                  ) : (
                    <i className="fa fa-search" style={{ fontSize: 25 }}></i>
                  )}
                </button>

                {/* advanced filter component */}
                {this.state.showAdvancedFilterOptions ? (
                  <AdvnacedFilter
                    user={user}
                    todos={todos}
                    currList={this.state.currList}
                  />
                ) : (
                  <>
                    <hr style={{ width: "90%" }} />
                    <div className="container">
                      {listToDisplay.map((todoItem) => (
                        <Todo key={todoItem._id} todoItem={todoItem} />
                      ))}
                    </div>
                  </>
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
