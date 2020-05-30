import React, { Component } from "react";
import classNames from "classnames";
import { Spring } from "react-spring/renderprops";
import "../../assets/todo-styles/todo.css";

class Todo extends Component {
  constructor() {
    super();

    this.state = {
      playing: false,
      collapsed: true,
    };
  }

  onGetTime = (info) => {
    const date = new Date(info);
    return date.toDateString() + ", " + date.toLocaleTimeString();
  };

  render() {
    const { todoItem } = this.props;

    // style
    let colors = {
      Work: "#292b2c",
      Personal: "#0275d8",
      Shopping: "#d9534f",
      Others: "#f0ad4e",
    };
    let styles = {
      card: {
        borderLeftWidth: 10,
        borderRadius: 10,
        borderLeftColor: colors[todoItem.label],
        marginBottom: 5,
      },
    };
    return (
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ duration: 200 }}
      >
        {(props) => (
          <div style={props}>
            <div className="myCard card pb-1" style={{ ...styles.card }}>
              <div className="card-header pt-2 pb-2">
                <div className="row">
                  {/* collapse icon */}
                  <div className="col-1">
                    <i
                      className={classNames("myIcon collapseIcon fa", {
                        "fa-angle-down": this.state.collapsed,
                        "fa-angle-up": !this.state.collapsed,
                      })}
                      onClick={() =>
                        this.setState({
                          collapsed: !this.state.collapsed,
                        })
                      }
                    ></i>
                  </div>

                  {/* date info */}
                  <div className="col-12 order-10 col-sm-12 order-sm-10 col-md-5 order-md-1 col-lg-5 order-lg-1">
                    <small className="text-muted">
                      {this.onGetTime(todoItem.createdAt)}
                    </small>
                  </div>
                </div>
              </div>

              <div
                className="card-body pb-0 pt-1 mb-0 mt-1"
                style={styles.card}
              >
                <div className="row">
                  <div className="taskCol col-12 col-sm-8 col-md-8">
                    {/* todo title */}
                    <p className="font-weight-bold mb-2 p-0">
                      {todoItem.title[0].toUpperCase() +
                        todoItem.title.slice(1)}
                    </p>

                    {/* task name */}
                    {this.state.collapsed
                      ? null
                      : todoItem.todoName.map((item, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col m-0">
                                <div className="row">
                                  <div className="col-1">
                                    <div className="pretty p-icon p-round p-jelly">
                                      <input type="checkbox" disabled={true} />
                                      <div className="state p-success">
                                        <i className="icon mdi mdi-check"></i>
                                        <label></label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col">
                                    <label>{item.itemName}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Spring>
    );
  }
}
export default Todo;
