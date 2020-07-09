import React, { Component } from "react";
import axios from "axios";
import { Consumer } from "../../context";

export default class AddMember extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      removeEmail: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addMember = async (user) => {
    const fromEmail = user.email;
    const toEmail = this.state.email;
    const taskId = this.props.match.params.taskId;

    // send invite
    const res = await axios.post("/users/invite", {
      fromEmail,
      toEmail,
      taskId,
    });
    console.log("inviteted: ", res.data);

    // clear email field
    this.setState({ email: "" });
  };

  removeMember = async () => {
    console.log("removing : ", this.state.removeEmail);

    const emailToRemove = this.state.removeEmail;
    const taskId = this.props.match.params.taskId;

    const res = await axios.post("/users/removeTaskId", {
      emailToRemove,
      taskId,
    });
    console.log("removed: ", res.data);

    // clear email field
    this.setState({ removeEmail: "" });
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
            <>
              {/* add team member */}
              <div>
                <h1>add members</h1>
                <div className="col-12 col-sm-8 col-md-8 col-lg-8 mb-1">
                  <input
                    required
                    className="form-control"
                    name="email"
                    type="text"
                    placeholder="member email"
                    onChange={this.onChange}
                    value={this.state.email}
                  />
                  <button
                    className="btn btn-success"
                    onClick={this.addMember.bind(this, user)}
                  >
                    Add
                  </button>
                  <button className="btn btn-success" onClick={this.submit}>
                    done
                  </button>
                </div>
              </div>

              {/* remove team member */}
              <div>
                <h1>Remove members</h1>
                <div className="col-12 col-sm-8 col-md-8 col-lg-8 mb-1">
                  <input
                    required
                    className="form-control"
                    name="removeEmail"
                    type="text"
                    placeholder="member email to remove"
                    onChange={this.onChange}
                    value={this.state.removeEmail}
                  />
                  <button
                    className="btn btn-success"
                    onClick={this.removeMember}
                  >
                    Remove
                  </button>
                  <button className="btn btn-success" onClick={this.submit}>
                    done
                  </button>
                </div>
              </div>
            </>
          );
        }}
      </Consumer>
    );
  }
}
