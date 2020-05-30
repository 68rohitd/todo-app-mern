import React, { Component } from "react";
import axios from "axios";
import HistoryTodo from "./HistoryTodo";

export default class History extends Component {
  constructor() {
    super();

    this.state = {
      history: [],
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("auth-token");
    let userRes = await axios.get("/users", {
      headers: { "x-auth-token": token },
    });

    this.setState({
      history: userRes.data.history.reverse(),
    });
  }

  render() {
    return (
      <>
        {/* back btn */}
        <button
          onClick={() => this.props.history.push("/")}
          className="backBtn btn btn-dark mt-3"
        >
          <i style={{ fontSize: 25 }} className="fa fa-arrow-circle-left"></i>
        </button>

        {/* history list */}
        <h1 className="display-3 text-center mt-5 pt-4">History</h1>
        <div className="container mt-5">
          {this.state.history.map((todoItem) => (
            <HistoryTodo key={todoItem.historyId} todoItem={todoItem} />
          ))}
        </div>
      </>
    );
  }
}
