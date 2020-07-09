import React, { Component } from "react";
import { Consumer } from "../../context";
import TeamTodo from "../team/TeamTodo";
import SidePanel from "../layouts/SidePanel";
import { Redirect, Link } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
import axios from "axios";

export default class TeamTodos extends Component {
  constructor() {
    super();

    this.state = {
      teamTodos: [],
    };
  }

  render() {
    return (
      <Consumer>
        {(value) => {
          const { todos, user, teamTodos } = value;
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

                <Spring
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ duration: 200 }}
                >
                  {(props) => (
                    <div style={props}>
                      {/* heading */}
                      <div className="container mt-2">
                        <div className="row mx-0">
                          <div className="col">
                            <h3 className="display-4 text-right text-dark font-weight-bold">
                              Team Tasks
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Spring>

                <div className="container">
                  <div className="row">
                    {/* side panel */}
                    <div className="col-3">
                      <SidePanel todos={todos} user={user} />
                    </div>

                    {/* main content */}
                    <div className="col">
                      <Link to="/addTeam">
                        <button
                          type="button"
                          className=" btn btn-primary font-weight-bold my-3"
                        >
                          Add new Team Task
                        </button>
                      </Link>

                      {teamTodos.map((todoItem) => (
                        <TeamTodo key={todoItem._id} todoItem={todoItem} />
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
