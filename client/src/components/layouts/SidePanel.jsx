import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SidePanel extends Component {
  render() {
    return (
      <div>
        <ul>
          <Link to="/history">
            <li style={{ cursor: "pointer" }}>History</li>
          </Link>
        </ul>
      </div>
    );
  }
}
