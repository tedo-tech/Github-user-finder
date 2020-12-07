import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import "./App.css";
import Users from "./components/User/Users";
import User from "./components/User/User";
import Search from "./components/User/Search";
import Alert from "./components/layout/Alert";
import About from "./components/Pages/About";
import axios from "axios";

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
  };

  //search git users
  searchusers = async (text) => {
    this.setState({ loading: true }); // for the spinner
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=c3ca0b81676e8cfb9b0a&client_secret=786a22da9b1cff526a10a751a7bb484cf898eb41`
    );

    this.setState({ users: res.data.items, loading: false });
  };
  //Get single git User
  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=c3ca0b81676e8cfb9b0a&client_secret=786a22da9b1cff526a10a751a7bb484cf898eb41`
    );

    this.setState({ user: res.data, loading: false });
  };

  //Clear user from state
  clearUsers = () => this.setState({ users: [], loading: false });

  //Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg: msg, type: type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {
    //Distruction area

    return (
      <Router>
        <div>
          <Navbar title="GitHub User Finder" icon="fab fa-github" />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                path="/"
                exact
                render={(props) => (
                  <React.Fragment>
                    <Search
                      searchusers={this.searchusers}
                      clearUsers={this.clearUsers}
                      showClear={this.state.users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users
                      loading={this.state.loading}
                      users={this.state.users}
                    />
                  </React.Fragment>
                )}
              />
              <Route path="/about" exact component={About} />
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    user={this.state.user}
                    loading={this.state.loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
