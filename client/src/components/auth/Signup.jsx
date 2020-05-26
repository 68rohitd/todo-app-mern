import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import loginSVG from "../../assets/login-signup-styles/login3.svg";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      displayName: "",
      error: "",
      disabled: false,

      // validation
      emailCheck: false,
      password1Check: false,
      password2Check: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const { email, password, passwordCheck, displayName } = this.state;

    try {
      const newUser = await axios.post("/users/register", {
        email,
        password,
        passwordCheck,
        displayName,
      });
      console.log("created acc successfully: ", newUser.data);
      // now login the user
      const loggedInUser = await axios.post("/users/login", {
        email,
        password,
      });
      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user.id);

      // getting user todos
      const userTodos = await axios.get(
        `/todos/user/${loggedInUser.data.user.id}`
      );
      console.log("logged in users todos: ", userTodos.data);
      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
          todos: userTodos.data.reverse(),
        },
      });
      this.props.history.push("/");
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (name === "email") {
        if (this.state.email.includes("@")) {
          if (this.state.email.includes(".")) {
            this.setState({ emailCheck: true });
          }
        } else this.setState({ emailCheck: false });
      } else if (name === "password") {
        if (this.state.password.length >= 6) {
          this.setState({ password1Check: true });
        } else this.setState({ password1Check: false });
      } else if (name === "passwordCheck") {
        if (this.state.password === this.state.passwordCheck) {
          this.setState({ password2Check: true });
        } else this.setState({ password2Check: false });
      }
    });
  };

  render() {
    const { error } = this.state;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";

          if (!token) {
            return (
              <div className="row m-0">
                <div className="col">
                  <img className="loginSVG" src={loginSVG} alt="login.svg" />
                </div>
                <div className="col-12 col-sm-12 col-md-4">
                  <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                    {(props) => (
                      <div style={props}>
                        <div className="container">
                          <form
                            className="signUpForm "
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                            style={{ marginTop: "85px" }}
                          >
                            <img
                              className="signUpAvatar"
                              src={loginAvatar}
                              alt=""
                            />
                            <h3 className="signUpText text-center mt-3">
                              Create your new Account!
                            </h3>

                            {error.length ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}

                            <div className="col">
                              <div className="row">
                                {/* email */}
                                <div className="col">
                                  <input
                                    type="email"
                                    name="email"
                                    className="form-control mb-3 mt-4"
                                    placeholder="Email id"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                <div className="col-1 correctContainer">
                                  {this.state.emailCheck ? (
                                    <i className="fa fa-check"></i>
                                  ) : null}
                                </div>
                              </div>

                              {/* password */}
                              <div className="row">
                                <div className="col">
                                  <input
                                    name="password"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                <div className="col-1 correctContainer">
                                  {this.state.password1Check ? (
                                    <i className="fa fa-check"></i>
                                  ) : null}
                                </div>
                              </div>

                              {/* re-enter password */}
                              <div className="row">
                                <div className="col">
                                  <input
                                    name="passwordCheck"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Re-enter password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                <div className="col-1 correctContainer">
                                  {this.state.password2Check ? (
                                    <i className="fa fa-check"></i>
                                  ) : null}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col">
                                  {/* display name */}
                                  <input
                                    name="displayName"
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Display name (optional)"
                                    onChange={this.onChange}
                                  />
                                </div>
                                <div className="col-1 correctContainer"></div>
                              </div>

                              <div className="row">
                                {/* submit */}
                                <input
                                  disabled={this.state.disabled}
                                  type="submit"
                                  value="Signup"
                                  className="btn btn-success btn-block mt-5"
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </Spring>
                </div>
                <div className="col-1"></div>
              </div>
            );
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Consumer>
    );
  }
}

export default Signup;
