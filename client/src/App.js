import React, { Component } from "react";

import Todos from "./components/todo/Todos";
import Header from "./components/layouts/Header";
import AddTodo from "./components/todo/AddTodo";
import EditTodo from "./components/todo/EditTodo";
import AdvnacedFilter from "./components/todo/AdvnacedFilter";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PageNotFound from "./components/layouts/PageNotFound";
import About from "./components/layouts/About";

import { Provider } from "./context";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import History from "./components/todo/History";
import CompletedTodos from "./components/todo/CompletedTodos";
import IncompletedTodos from "./components/todo/IncompletedTodos";
import TeamTodos from "./components/team/TeamTodos";
import AddTeamTodo from "./components/team/AddTeamTodo";
import AddMember from "./components/team/AddMember";
import EditTeamTodo from "./components/team/EditTeamTodo";

export default class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <div>
            <Header branding="clear.mind" />
            <Switch>
              <Route exact path="/" component={Todos} />
              <Route exact path="/add" component={AddTodo} />
              <Route exact path="/addTeam" component={AddTeamTodo} />
              <Route exact path="/addMember/:taskId" component={AddMember} />
              <Route exact path="/history" component={History} />
              <Route exact path="/completed" component={CompletedTodos} />
              <Route exact path="/incomplete" component={IncompletedTodos} />
              <Route exact path="/team" component={TeamTodos} />
              <Route exact path="/editTeamTodo/:id" component={EditTeamTodo} />
              <Route exact path="/edit/:id" component={EditTodo} />
              <Route exact path="/advancedFilter" component={AdvnacedFilter} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
