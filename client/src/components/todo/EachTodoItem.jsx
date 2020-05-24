import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";

export default class EachTodoItem extends Component {
  constructor() {
    super();
    this.state = {
      entering: true,
    };
  }

  onDelete = (e) => {
    console.log("deleting");
    this.setState(
      {
        entering: false,
      },
      () => {
        setTimeout(() => {
          this.props.onClick();
        }, 200);
      }
    );
    setTimeout(() => {
      this.setState({
        entering: true,
      });
    }, 200);
  };

  render() {
    return (
      <div>
        <Spring
          from={
            this.state.entering
              ? {
                  opacity: 0,
                  transform: "translate3d(0,0,0) scale(1.1)",
                }
              : { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
          }
          to={
            this.state.entering
              ? {
                  opacity: 1,
                  transform: "translate3d(0px,0,0) scale(1) ",
                }
              : { opacity: 0.5, transform: "translate3d(0px,0,0) scale(1.1) " }
          }
        >
          {(props) => (
            <div style={props}>
              <div className="row">
                <div className="col-10 col-sm-8 col-md-8 col-lg-8">
                  <input
                    style={{ marginBottom: 6 }}
                    className="form-control"
                    required
                    placeholder={this.props.placeholder}
                    type="text"
                    name="itemName"
                    onChange={this.props.onChange}
                    value={this.props.value}
                  />
                </div>

                {/* delete todo btn */}
                <div className="col mr-4">
                  <i
                    className="fa fa-times"
                    style={{
                      fontSize: 30,
                      marginBottom: 0,
                      cursor: "pointer",
                      color: "#E83350",
                    }}
                    onClick={this.onDelete}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}
