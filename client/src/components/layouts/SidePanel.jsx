import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SidePanel extends Component {
  render() {
    const currLocation = window.location.href.split("#/")[1];

    const { todos, user } = this.props;

    if (user) {
      if (user.history === undefined) user.history = [];

      return (
        <div className="sidePanel container">
          {/* All tasks*/}
          <ul className="list-group">
            <Link to="/" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold ">
                {currLocation === "" ? (
                  <i
                    className="fa fa-circle text-dark"
                    style={{ fontSize: "10px" }}
                  ></i>
                ) : null}{" "}
                All{" "}
                <div className="badge badge-dark">
                  {todos ? todos.length : null}
                </div>
              </li>
            </Link>

            {/* Completed tasks*/}
            <Link to="/completed" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold">
                {currLocation === "completed" ? (
                  <i
                    className="fa fa-circle text-dark"
                    style={{ fontSize: "10px" }}
                  ></i>
                ) : null}{" "}
                Completed{" "}
                <div className="badge badge-dark">
                  {todos
                    ? todos.filter((todoItem) => todoItem.finished).length
                    : null}
                </div>
              </li>
            </Link>

            {/* incompleted tasks */}
            <Link to="/incomplete" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold">
                {currLocation === "incomplete" ? (
                  <i
                    className="fa fa-circle text-dark"
                    style={{ fontSize: "10px" }}
                  ></i>
                ) : null}{" "}
                Incomplete{" "}
                <div className="badge badge-dark">
                  {todos
                    ? todos.filter((todoItem) => !todoItem.finished).length
                    : null}
                </div>
              </li>
            </Link>

            {/* History of tasks*/}
            <Link to="/history" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold">
                {currLocation === "history" ? (
                  <i
                    className="fa fa-circle text-dark"
                    style={{ fontSize: "10px" }}
                  ></i>
                ) : null}{" "}
                History{" "}
                <div className="badge badge-dark">
                  {user ? user.history.length : null}
                </div>
              </li>
            </Link>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}
