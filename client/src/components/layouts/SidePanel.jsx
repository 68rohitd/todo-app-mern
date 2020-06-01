import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SidePanel extends Component {
  render() {
    const { todos, user } = this.props;

    if (user) {
      if (user.history === undefined) user.history = [];

      return (
        <div className="sidePanel container">
          {/* All */}
          <ul className="list-group">
            <Link to="/" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold ">
                All{" "}
                <div className="badge badge-dark">
                  {todos ? todos.length : null}
                </div>
              </li>
            </Link>

            {/* Completed */}
            <Link to="/completed" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold">
                Completed{" "}
                <div className="badge badge-dark">
                  {todos
                    ? todos.filter((todoItem) => todoItem.finished).length
                    : null}
                </div>
              </li>
            </Link>

            {/* History */}
            <Link to="/history" style={{ textDecoration: "none" }}>
              <li className="list-group-item text-dark font-weight-bold">
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
