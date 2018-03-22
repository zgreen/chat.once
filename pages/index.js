import querystring from "querystring";
import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import uniqueString from "unique-string";
import * as firebase from "firebase";
import "firebase/database";

class Home extends Component {
  static async getInitialProps({ query }) {
    const id = query.id || uniqueString();
    return { id };
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.state = {
      inputVal: "",
      messages: {},
      username: "",
      aliases: {}
    };
  }
  componentDidMount() {
    console.log("did mount");
    this.username = uniqueString();
    this.setState({
      username: this.username,
      aliases: { [this.username]: { value: this.username } }
    });
    firebase.initializeApp({
      apiKey: "AIzaSyCmV_xvYmfs8Yk-NmgDxKZsnMujMy_jSJ4",
      authDomain: "oncechat-22dac.firebaseapp.com",
      databaseURL: "https://oncechat-22dac.firebaseio.com",
      projectId: "oncechat-22dac",
      storageBucket: "oncechat-22dac.appspot.com",
      messagingSenderId: "250112620252"
    });
    this.database = firebase.database();
    this.database.ref(`chats/${this.props.id}/chat`).on("value", snapshot => {
      this.setState({ messages: snapshot.val() });
    });
    this.database
      .ref(`chats/${this.props.id}/aliases/`)
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({ aliases: snapshot.val() });
        }
      });
    if (!querystring.parse(window.location.search)["?id"]) {
      Router.push({
        pathname: "/",
        query: { id: this.props.id }
      });
    }
  }
  handleChange(e) {
    this.setState({ inputVal: e.target.value });
  }
  handleUsernameChange(e) {
    this.database
      .ref("chats/" + this.props.id + `/aliases/${this.username}`)
      .set({
        value: e.target.value
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.database.ref(`chats/${this.props.id}/chat`).push({
      value: { username: this.username, message: this.state.inputVal }
    });
    this.setState({ inputVal: "" });
  }
  render() {
    const { handleUsernameChange } = this;
    const { aliases, messages } = this.state;
    return (
      <div>
        id is {this.props.id}{" "}
        <label>
          Your username is:{" "}
          <input
            placeholder={this.state.username}
            onChange={handleUsernameChange}
          />
        </label>
        {messages &&
          Object.keys(messages).map((key, idx, arr) => (
            <p>
              {aliases[messages[key].value.username] && (
                <em>{aliases[messages[key].value.username].value}</em>
              )}
              {`: `}
              {messages[key].value.message}
            </p>
          ))}
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.inputVal} onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}
export default Home;
