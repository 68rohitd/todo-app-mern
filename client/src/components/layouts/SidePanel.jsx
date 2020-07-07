import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../assets/sidePanel-styles/sidePanel.css";

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
              <li className="myListItem list-group-item text-dark font-weight-bold">
                {currLocation === "" ? <b>All </b> : "All"}{" "}
                <div className="badge badge-dark">
                  {todos ? todos.length : null}
                </div>
              </li>
            </Link>

            {/* Completed tasks*/}
            <Link to="/completed" style={{ textDecoration: "none" }}>
              <li className="myListItem list-group-item text-dark font-weight-bold">
                {currLocation === "completed" ? <b>Completed </b> : "Completed"}{" "}
                <div className="badge badge-dark">
                  {todos
                    ? todos.filter((todoItem) => todoItem.finished).length
                    : null}
                </div>
              </li>
            </Link>

            {/* incompleted tasks */}
            <Link to="/incomplete" style={{ textDecoration: "none" }}>
              <li className="myListItem list-group-item text-dark font-weight-bold">
                {currLocation === "incomplete" ? (
                  <b>Incomplete </b>
                ) : (
                  "Incomplete"
                )}{" "}
                <div className="badge badge-dark">
                  {todos
                    ? todos.filter((todoItem) => !todoItem.finished).length
                    : null}
                </div>
              </li>
            </Link>

            {/* team tasks */}
            <Link to="/team" style={{ textDecoration: "none" }}>
              <li className="myListItem list-group-item text-dark font-weight-bold">
                {currLocation === "team" ? <b>Team </b> : "Team"}{" "}
              </li>
            </Link>

            {/* History of tasks*/}
            <Link to="/history" style={{ textDecoration: "none" }}>
              <li className="myListItem list-group-item text-dark font-weight-bold">
                {currLocation === "history" ? <b>History </b> : "History"}{" "}
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
