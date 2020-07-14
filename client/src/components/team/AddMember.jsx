import React, { Component } from "react";
import axios from "axios";
import classnames from "classnames";
import { Consumer } from "../../context";

export default class AddMember extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      removeEmail: "",
      alert: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      alert: "",
    });
  };

  addMember = async (user) => {
    const fromEmail = user.email;
    const toEmail = this.state.email;
    const taskId = this.props.match.params.taskId;

    // send invite
    try {
      const res = await axios.post("/users/invite", {
        fromEmail,
        toEmail,
        taskId,
      });

      console.log("inviteted: ", res.data);

      // clear email field
      this.setState({ email: "", alert: "Invited successfully" });
    } catch (e) {
      this.setState({ alert: e.response.data.msg });
      console.log("error: ", e.response.data.msg);
    }
  };

  removeMember = async () => {
    const emailToRemove = this.state.removeEmail;
    const taskId = this.props.match.params.taskId;

    try {
      const res = await axios.post("/users/removeTaskId", {
        emailToRemove,
        taskId,
      });
      console.log("removed: ", res.data);

      // clear email field
      this.setState({ removeEmail: "", alert: "Removed successfully" });
    } catch (e) {
      this.setState({ alert: e.response.data.msg });
      console.log("error: ", e.response.data.msg);
    }
  };

  submit = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          return (
            <div className="container">
              {/* display alerts if any */}
              {this.state.alert ? (
                <div
                  className={classnames("my-2 alert ", {
                    "alert-success":
                      this.state.alert === "Invited successfully" ||
                      this.state.alert === "Removed successfully",
                    "alert-danger":
                      this.state.alert === "User not found" ||
                      this.state.alert === "User already invited/present",
                  })}
                >
                  {this.state.alert}
                </div>
              ) : null}

              {/* add team member */}
              <div>
                <div className="col mb-1">
                  <h1 className="mt-5">Add members to this team</h1>
                  <input
                    required
                    className="form-control"
                    name="email"
                    type="text"
                    placeholder="Enter email id to invite them to this team"
                    onChange={this.onChange}
                    value={this.state.email}
                  />
                  <button
                    className="btn btn-success mt-3 mr-3"
                    onClick={this.addMember.bind(this, user)}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* remove team member */}
              <div>
                <div className="col mb-1">
                  <h1>Remove members from this team</h1>
                  <input
                    required
                    className="form-control"
                    name="removeEmail"
                    type="text"
                    placeholder="enter email id of member to remove from this team"
                    onChange={this.onChange}
                    value={this.state.removeEmail}
                  />
                  <button
                    className="btn btn-success mt-3 mr-3"
                    onClick={this.removeMember}
                  >
                    Remove
                  </button>

                  <button
                    className="btn btn-primary mt-3"
                    onClick={this.submit}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
