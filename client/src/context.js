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
        teamTodos: action.payload.teamTodos,
        inviteList: action.payload.inviteList,
      };

    case "LOGGED_OUT":
      return {
        ...state,
        todos: [],
        teamTodos: [],
        inviteList: [],
        token: undefined,
        user: undefined,
      };

    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
      };

    case "ADD_TEAMTODO":
      return {
        ...state,
        teamTodos: [action.payload, ...state.teamTodos],
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter(
          (todoItem) => todoItem._id !== action.payload
        ),
      };

    case "DELETE_TEAMTODO":
      return {
        ...state,
        teamTodos: state.teamTodos.filter(
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

    case "UPDATE_TEAMTODO":
      return {
        ...state,
        teamTodos: state.teamTodos.map((todo) => {
          if (todo._id === action.payload._id) return action.payload;
          return todo;
        }),
      };

    case "UPDATE_INVITELIST":
      return {
        ...state,
        inviteList: action.payload.inviteList,
        teamTodos: action.payload.teamTodos,
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
      teamTodos: [],
      inviteList: [],
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

        // now get team todos
        const teamTodos = await axios.post("/users/getTeamTodos", null, {
          headers: { "x-auth-token": token },
        });

        // now get inviteList
        const inviteList = await axios.post("/users/getInviteList", null, {
          headers: { "x-auth-token": token },
        });

        // filter invite list
        let filteredInviteList = [];
        inviteList.data.forEach((invite) => {
          if (invite.accepted === false) {
            filteredInviteList.push(invite);
          }
        });

        this.setState({
          token,
          user: userRes.data,
          todos: userTodos.data.reverse(),
          teamTodos: teamTodos.data,
          inviteList: filteredInviteList,
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
