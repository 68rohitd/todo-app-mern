import React, { Component } from "react";
import { Consumer } from "../../context";
import Todo from "./Todo";
import SidePanel from "../layouts/SidePanel";
import { Redirect } from "react-router-dom";

export default class History extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          const { todos, user } = value;
          let completedTodos = todos.filter((todoItem) => todoItem.finished);

          // getting token from localstorage to avoid flicker
          let token = localStorage.getItem("auth-token");

          if (token) {
            return (
              <>
                {/* back btn */}
                <button
                  style={{ position: "fixed", zIndex: 100 }}
                  onClick={() => this.props.history.push("/")}
                  className="backBtn btn btn-dark mt-3"
                >
                  <i
                    style={{ fontSize: 25 }}
                    className="fa fa-arrow-circle-left"
                  ></i>
                </button>

                {/* heading */}
                <div className="container mt-2">
                  <div className="row mx-0">
                    <div className="col">
                      <h3 className="display-4 text-right text-dark font-weight-bold">
                        Completed Tasks
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="container">
                  <div className="row">
                    {/* side panel */}
                    <div className="col-12 order-2 col-sm-12 order-sm-2 col-md-3 order-md-1 col-lg-3 order-md-1">
                      <SidePanel todos={todos} user={user} />
                    </div>

                    {/* Completed list */}
                    <div className="col order-1 todoContainer">
                      {completedTodos.map((todoItem) => (
                        <Todo key={todoItem._id} todoItem={todoItem} />
                      ))}
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
