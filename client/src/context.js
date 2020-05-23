import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        todos: action.payload.todos,
      };

    case "LOGGED_OUT":
      return {
        ...state,
        todos: [],
        token: undefined,
        user: undefined,
      };

    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter(
          (todoItem) => todoItem._id !== action.payload
        ),
      };

    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo._id === action.payload._id) return action.payload;
          return todo;
        }),
      };

    default:
      return state;
  }
};

export class Provider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      token: undefined,
      user: undefined,

      dispatch: (action) => this.setState((state) => reducer(state, action)),
    };
  }

  async componentDidMount() {
    // check if logged in
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }
    try {
      const tokenRes = await axios.post("/users/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        //logged in
        const userRes = await axios.get("/users", {
          headers: { "x-auth-token": token },
        });

        // token valid, so get logged in users todos...
        const userTodos = await axios.get(`/todos/user/${userRes.data.id}`);
        this.setState({
          token,
          user: userRes.data,
          todos: userTodos.data.reverse(),
        });
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
