import React, { Component } from "react";
import axios from "axios";

export default class AddMember extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addMember = async () => {
    const email = this.state.email;
    const taskId = this.props.match.params.taskId;

    const res = await axios.post("/users/addTaskId", { email, taskId });
    console.log(res.data);

    // clear email field
    this.setState({ email: "" });
  };

  submit = () => {
    this.props.history.push("/");
  };

  render() {
    return (
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
          <button className="btn btn-success" onClick={this.addMember}>
            Add
          </button>
          <button className="btn btn-success" onClick={this.submit}>
            done
          </button>
        </div>
      </div>
    );
  }
}
