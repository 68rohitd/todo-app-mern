import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import "../../assets/header-styles/header.css";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      deleteAccount: false,
    };
  }

  OnLogout = (dispatch) => {
    localStorage.setItem("auth-token", "");
    localStorage.setItem("userId", "");
    console.log("Logged out!");

    dispatch({
      type: "LOGGED_OUT",
    });
  };

  OnDeleteAccount = async (dispatch) => {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete(`/users/delete/${userId}`, {
        headers: { "x-auth-token": token },
      });

      localStorage.setItem("auth-token", "");
      localStorage.setItem("userId", "");

      dispatch({
        type: "LOGGED_OUT",
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };

  getInfo = (todos) => {
    let completed = 0;
    todos.forEach((todoItem) => {
      if (todoItem.finished) completed++;
    });
    return completed;
  };

  render() {
    const { branding } = this.props;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token, user, todos } = value;

          if (token === undefined) token = "";
          if (user === undefined) user = "";
          if (todos === undefined) todos = [];

          // getting token from localstorage for removing delay
          const localToken = localStorage.getItem("auth-token");

          return (
            <>
              <nav className="myNavBar navbar sticky-top navbar-expand-lg navbar-light">
                <Link to="/" className="navbar-brand text-light block mx-4">
                  <span
                    style={{
                      display: "block",
                      fontFamily: "Pacifico, cursive",
                    }}
                  >
                    {branding}
                  </span>
                </Link>

                <button
                  className="hamIcon navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavAltMarkup"
                  style={{
                    position: "fixed",
                    right: "10px",
                    top: "10px",
                  }}
                >
                  <i className="fa fa-bars"></i>
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarNavAltMarkup"
                >
                  <div className="navbar-nav">
                    {/* about  */}
                    <li className="nav-item ">
                      <Link
                        to="/about"
                        className="nav-link text-light "
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        About
                      </Link>
                    </li>
                    {/* logout */}
                    {localToken ? (
                      <>
                        <li className="nav-item ">
                          <span
                            onClick={this.OnLogout.bind(this, dispatch)}
                            className="nav-link text-light mb-2"
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Logout
                          </span>
                        </li>
                        {/* delete account */}
                        <li className="nav-item ">
                          <span
                            onClick={() =>
                              this.setState({
                                deleteAccount: false,
                              })
                            }
                            className="nav-link text-light mb-2"
                            style={{ cursor: "pointer", fontSize: 16 }}
                            data-toggle="modal"
                            data-target="#staticBackdrop"
                          >
                            {user.displayName}
                          </span>
                        </li>
                      </>
                    ) : (
                      // signup or sign in
                      <>
                        <li className="nav-item ">
                          <Link
                            to="/signup"
                            className="nav-link text-light "
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            SignUp
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link
                            to="/login"
                            className="nav-link text-light "
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Login
                          </Link>
                        </li>
                      </>
                    )}
                  </div>
                </div>
              </nav>

              {/* modal */}
              <div
                className="modal fade"
                id="staticBackdrop"
                data-backdrop="static"
                data-keyboard="false"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Account Info
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="mb-0">Name: {user.displayName}</p>
                      <p className="mb-0">Total Tasks: {todos.length}</p>
                      <p className="mb-0">
                        Completed Tasks: {this.getInfo(todos)}
                      </p>
                      <p className="mb-0">
                        Remaining Tasks: {todos.length - this.getInfo(todos)}
                      </p>
                      <p
                        onClick={() =>
                          this.setState({
                            deleteAccount: !this.state.deleteAccount,
                          })
                        }
                      >
                        <span
                          className="text-secondary"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Delete my account
                        </span>
                      </p>
                      {this.state.deleteAccount ? (
                        <>
                          <p className="text-secondary">
                            Are you sure? There's no going back!
                          </p>
                          <button
                            onClick={this.OnDeleteAccount.bind(this, dispatch)}
                            type="button"
                            className="btn btn-danger"
                            data-dismiss="modal"
                          >
                            Delete my account
                          </button>
                        </>
                      ) : null}
                    </div>
                    <div className="modal-footer">
                      <button
                        onClick={() =>
                          this.setState({
                            deleteAccount: false,
                          })
                        }
                        type="button"
                        className="btn btn-primary"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Consumer>
    );
  }
}

export default Header;
