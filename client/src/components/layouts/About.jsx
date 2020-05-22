import React from "react";
import { Spring } from "react-spring/renderprops";
import loginSVG from "../../assets/login-signup-styles/login.svg";
import "../../assets/about-styles/about.css";

export default function About() {
  // document.body.style.backgroundColor = "#eceff1";
  return (
    <div className="container mt-5">
      <div className="row m-0">
        <div className="col ">
          <Spring
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={{ duration: 800 }}
          >
            {(props) => (
              <div style={props}>
                <h1 style={{ fontWeight: "lighter mt-5" }}>
                  <span className="font-italic">About</span>{" "}
                  <span style={{ fontFamily: "Yesteryear" }}>Todo</span>
                </h1>
                <p className="lead font-italic">
                  Simple App to Manage Your Todos
                </p>

                <h1 className="font-italic">Features</h1>
                <p className="mb-1 font-italic">In-built categories</p>
                <p className="mb-1 font-italic">One click Filter todos</p>
                <p className="mb-1 font-italic">
                  Search todos by date, category, status
                </p>
                <p className="mb-1 font-italic">
                  Login/Register feature, so you can access your todos anytime,
                  anywhere!
                </p>

                <p className="text-secondary font-italic mt-5">Version 1.0.0</p>
              </div>
            )}
          </Spring>
        </div>

        <div className="col">
          <img className="aboutSVG" src={loginSVG} alt="login.svg" />
        </div>
      </div>
    </div>
  );
}
