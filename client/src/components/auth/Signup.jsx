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

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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
                            {/* email */}
                            <input
                              type="email"
                              name="email"
                              className="form-control mb-3 mt-4"
                              placeholder="Email id"
                              onChange={this.onChange}
                              required
                            />
                            {/* password */}
                            <input
                              name="password"
                              type="password"
                              className="form-control mb-3"
                              placeholder="password"
                              onChange={this.onChange}
                              required
                            />
                            {/* re-enter password */}
                            <input
                              name="passwordCheck"
                              type="password"
                              className="form-control mb-3"
                              placeholder="re-enter password"
                              onChange={this.onChange}
                              required
                            />
                            {/* display name */}
                            <input
                              name="displayName"
                              type="text"
                              className="form-control mb-3"
                              placeholder="display name"
                              onChange={this.onChange}
                            />
                            {/* submit */}
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Signup"
                              className="btn btn-success btn-block mt-5"
                            />
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
