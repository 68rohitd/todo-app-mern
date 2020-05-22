import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Consumer } from "../../context";
import "../../assets/header-styles/header.css";

class Header extends Component {
  OnLogout = (dispatch) => {
    localStorage.setItem("auth-token", "");
    console.log("Logged out!");

    dispatch({
      type: "LOGGED_OUT",
    });
  };

  render() {
    const { branding } = this.props;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";

          return (
            <nav className="myNavBar navbar sticky-top navbar-expand-lg navbar-light">
              <Link to="/" className="navbar-brand text-light block">
                <span style={{ display: "block", fontFamily: "Yesteryear" }}>
                  {branding}
                </span>
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                style={{
                  background: "white",
                  position: "fixed",
                  right: "10px",
                  top: "10px",
                }}
              >
                <i className="fa fa-bars"></i>
              </button>

              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
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
                  {token ? (
                    <li className="nav-item ">
                      <span
                        onClick={this.OnLogout.bind(this, dispatch)}
                        className="nav-link text-light "
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        Logout
                      </span>
                    </li>
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
          );
        }}
      </Consumer>
    );
  }
}

export default Header;
