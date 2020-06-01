import React, { Component } from "react";
import { Consumer } from "../../context";
import axios from "axios";
import HistoryTodo from "./HistoryTodo";
import SidePanel from "../layouts/SidePanel";
import { Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";

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

  onClearHistory = async (user, dispatch) => {
    const token = localStorage.getItem("auth-token");

    const clearedHistory = [];
    try {
      await axios.put("/users/updateHistory", clearedHistory, {
        headers: { "x-auth-token": token },
      });
    } catch (err) {
      console.log("ERROR: ", err.response);
    }
    this.setState({ history: [] });

    // clearing user's history
    let updatedUser = user;
    updatedUser.history = [];

    dispatch({
      type: "UPDATE_TODO",
      payload: updatedUser,
    });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          const { todos, user, dispatch } = value;

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
                            <h1 className="display-4 text-right text-dark font-weight-bold">
                              History
                            </h1>
                          </div>

                          {/* clear history btn */}
                          <div className="col-3 my-auto">
                            <button
                              style={{ float: "right" }}
                              className="btn btn-danger"
                              onClick={() =>
                                this.onClearHistory(user, dispatch)
                              }
                            >
                              Clear History
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Spring>

                <div className="container">
                  <div className="row">
                    {/* side panel */}
                    <div className="col-12 order-2 col-sm-12 order-sm-2 col-md-3 order-md-1 col-lg-3 order-md-1">
                      <SidePanel todos={todos} user={user} />
                    </div>

                    {/* history list */}
                    <div className="col order-1 todoContainer">
                      {this.state.history.length > 0 ? (
                        this.state.history.map((todoItem) => (
                          <HistoryTodo key={todoItem._id} todoItem={todoItem} />
                        ))
                      ) : (
                        <h3 className="emptyResult text-secondary">
                          No result to display!
                        </h3>
                      )}
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
