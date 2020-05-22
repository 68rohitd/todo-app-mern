import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import { Spring } from "react-spring/renderprops";
import loginSVG from "../../assets/login-signup-styles/login3.svg";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      disabled: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable loggin btn
    this.setState({
      disabled: true,
    });

    const { email, password } = this.state;

    try {
      const loggedInUser = await axios.post(
        "http://localhost:5000/users/login",
        { email, password }
      );
      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user.id);

      // getting user todos
      const userTodos = await axios.get(
        `http://localhost:5000/todos/user/${loggedInUser.data.user.id}`
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
      // enable login btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";
          const { error } = this.state;

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
                            className="loginForm "
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                            style={{ marginTop: "85px" }}
                          >
                            <img
                              className="loginAvatar"
                              src={loginAvatar}
                              alt=""
                            />
                            <h3 className="loginText text-center mt-3">
                              Login to Your Account
                            </h3>
                            {error.length ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}
                            <input
                              type="email"
                              name="email"
                              className="form-control mb-3 mt-4"
                              placeholder="Email id"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              name="password"
                              type="password"
                              className="form-control"
                              placeholder="password"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Login"
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

export default Login;
