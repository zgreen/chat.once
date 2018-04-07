import querystring from "querystring";
import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import uniqueString from "unique-string";
import escape from "lodash.escape";
import * as firebase from "firebase";
import "firebase/database";
import ChatWindow from "../components/ChatWindow";
import css from "styled-jsx/css";
// import nacl from "../util/nacl";
import naclFactory from "js-nacl";

const appStyles = css`
  :root {
    --baseFontSize: 20px;
    --darkGray: #444;
    --brown: #91847a;
    --tomato: tomato;
    --veryLightYellow: #fcfbf2;
  }
  * {
    box-sizing: border-box;
  }
  body {
    background-color: var(--veryLightYellow);
    margin: 0;
  }
`;

const actionsStyles = css`
  .action {
    margin-bottom: 20px;
  }
  .actions {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }
  .app {
    display: flex;
    font-family: monospace;
  }
  .button {
    appearance: none;
    background-color: var(--tomato);
    border: 0;
    border-radius: 5px;
    color: #f7f7f7;
    font-family: monospace;
    font-size: 16px;
    letter-spacing: 1px;
    padding: 10px;
    text-decoration: none;
    text-transform: uppercase;
  }
  .linkDisplay {
    display: block;
  }
  .userNameInput {
    background-color: var(--veryLightYellow);
    border: 0;
    border-bottom: 2px solid var(--darkGray);
    display: block;
    font-size: 18px;
    font-family: monospace;
  }

  .userNameNote {
    color: var(--brown);
    margin: 5px 0 20px;
  }
`;

class Home extends Component {
  static async getInitialProps(req) {
    if (req.query) {
      const { query } = req;
      const id = escape(query.id) || uniqueString();
      return { id, isNew: !query.id };
      // return { id, isNew: !query.id };
    }
    return {};
  }
  constructor(props) {
    super(props);
    this.handleCommand = this.handleCommand.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.state = {
      inputVal: "",
      messages: {},
      username: "",
      aliases: {}
    };
  }
  componentDidMount() {
    naclFactory.instantiate(nacl => {
      this.nacl = nacl;
      this.keyPair = this.nacl.crypto_sign_keypair();
    });

    console.log("did mount");
    const { id } = this.props;
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
    this.database.ref(`chats/${id}/command`).on("value", snapshot => {
      if (snapshot.val()) {
        switch (snapshot.val().value) {
          case "destory":
            console.log("destroy!");
            break;
          // no default
        }
      }
    });
    // this.database
    //   .ref(`chats/${this.props.id}/connections`)
    //   .on("child_removed", snapshot => {
    //     this.setState({ connections: snapshot.val() }, () => {
    //       console.log(this.state.connections);
    //       if (!this.props.isNew) {
    //         // console.log("destory!");
    //       }
    //     });
    //   });
    this.database
      .ref(`chats/${this.props.id}/connections/${this.username}`)
      .onDisconnect()
      .remove();
    this.database
      .ref(`chats/${this.props.id}/connections/${this.username}`)
      .set({
        value: true
      });
    this.database
      .ref("chats/" + this.props.id + `/aliases/${this.username}`)
      .set({
        value: this.username
      });
    this.database.ref(`chats/${this.props.id}/chat`).on("value", snapshot => {
      this.setState({ messages: snapshot.val() });
    });
    this.database
      .ref(`chats/${this.props.id}/aliases/`)
      .on("value", snapshot => {
        if (snapshot.val()) {
          console.log(snapshot.val());
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
  handleChange(e, inputCase = "message") {
    switch (inputCase) {
      case "message":
        this.setState({ inputVal: e.target.value });
        break;
      // no default
      case "username":
        this.setState({ username: e.target.value });
        break;
      // no default
    }
  }
  handleCommand(e, command = "destroy") {
    console.log(command);
    e.preventDefault();
    const { id } = this.props;
    this.database.ref(`chats/${id}/command`).set({
      value: command
    });
  }
  handleUsernameSubmit(e) {
    console.log("handleUsernameSubmit", this.state.username);
    e.preventDefault();
    if (this.state.username === this.username) {
      this.usernameInput.focus();
      return;
    }
    this.database
      .ref("chats/" + this.props.id + `/aliases/${this.username}`)
      .set({
        value: this.state.username
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { nacl } = this;
    this.database.ref(`chats/${this.props.id}/chat`).push({
      value: {
        username: this.username,
        message: nacl.to_hex(
          nacl.crypto_sign(
            nacl.encode_utf8(this.state.inputVal),
            this.keyPair.signSk
          )
        ),
        publicKey: this.keyPair.signPk
      }
    });
    this.setState({ inputVal: "" });
  }
  render() {
    const {
      handleUsernameSubmit,
      handleChange,
      handleSubmit,
      username,
      handleCommand,
      nacl
    } = this;
    const { url } = this.props;
    const { aliases, messages, inputVal } = this.state;
    return (
      <div className="app">
        <ChatWindow
          {...{
            aliases,
            messages,
            nacl,
            handleChange,
            handleSubmit,
            inputVal
          }}
        />
        <style jsx global>
          {appStyles}
        </style>
        <style jsx>{actionsStyles}</style>
        <section className="actions">
          <h2>Actions</h2>
          <a className="action button" href="/">
            Start a new chat
          </a>
          <button
            className="action button"
            onClick={e => handleCommand(e, "destroy")}
          >
            Destroy this chat
          </button>
          <form className="action" onSubmit={e => e.preventDefault()}>
            <label className="linkDisplay">
              Your link is <code>{url.asPath}</code>
            </label>
            <button className="button">Click to copy</button>
          </form>
          {!aliases[username] ||
            (aliases[username].value === username && (
              <form className="action" onSubmit={handleUsernameSubmit}>
                <div className="userNameFields">
                  <label>
                    Your username is:{" "}
                    <input
                      ref={input => {
                        this.usernameInput = input;
                      }}
                      className="userNameInput"
                      placeholder={this.state.username}
                      onChange={e => handleChange(e, "username")}
                    />
                  </label>
                  <p className="userNameNote">
                    You may change it, but only once.
                  </p>
                </div>
                <button className="button">Change username</button>
              </form>
            ))}
        </section>
      </div>
    );
  }
}
export default Home;
