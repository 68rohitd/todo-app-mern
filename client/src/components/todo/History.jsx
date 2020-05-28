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
        <h1 className="display-2 text-center">History</h1>
        <div className="container mt-5">
          {this.state.history.map((todoItem, index) => (
            <HistoryTodo key={todoItem.historyId} todoItem={todoItem} />
          ))}
        </div>
      </>
    );
  }
}
