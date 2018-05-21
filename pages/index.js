import "firebase/database";
import querystring from "querystring";
import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import uniqueString from "unique-string";
import escape from "lodash.escape";
import * as firebase from "firebase";
import moment from "moment";
import naclFactory from "js-nacl";
import axios from "axios";
import ChatWindow from "../components/ChatWindow";
import Destroyer from "../components/Destroyer";

import { actionsStyles, appStyles } from "../components/styles";

class Home extends Component {
  static async getInitialProps({ req, res, query }) {
    if (query) {
      //const { query } = req;
      const id = escape(query.id) || uniqueString();
      return {
        id,
        isNew: !query.id
      };
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
      aliases: {},
      remainingTime: ""
    };
  }
  componentDidMount() {
    // if (this.props.remainingLifetime) {
    //   console.log("yep");
    //   console.log(this.props.remainingLifetime());
    // } else {
    //   console.log("nope");
    // }

    naclFactory.instantiate(nacl => {
      this.nacl = nacl;
      this.keyPair = this.nacl.crypto_sign_keypair();
    });
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
    setTimeout(() => {
      this.database.ref(`chats/${id}/command`).set({
        value: "destroy"
      });
    }, 1000 * 60 * 60 * 24);
    const curDate = Date.now();
    const endTime = curDate + 1000 * 60 * 60 * 24;
    const endDur = new moment(Date.now() + 1000 * 60 * 60 * 24);

    // setInterval(() => {
    //   const nowDur = new moment(Date.now());
    //   const diff = moment.duration(endDur.diff(nowDur));
    //   console.log(moment(diff));
    //   this.setState(({ remainingTime }) => ({
    //     remainingTime: diff.format("HH:mm:ss")
    //     // remainingTime: `${differenceInHours(
    //     //   endTime,
    //     //   curTime
    //     // )}:${differenceInMinutes(endTime, curTime)}:${differenceInSeconds(
    //     //   endTime,
    //     //   curTime
    //     // )}`
    //   }));
    // }, 1000);
    this.database.ref(`chats/${id}/command`).on("value", snapshot => {
      console.log(snapshot.val());
      if (snapshot.val()) {
        switch (snapshot.val().value) {
          case "destroy":
            Router.push({
              pathname: "/destroy"
              // query: { id: this.props.id }
            });
            this.database.ref(`chats/${this.props.id}`).remove();
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
      case "username":
        this.setState({ username: e.target.value });
        break;
      // no default
    }
  }
  handleCommand(e, command = "destroy") {
    e.preventDefault();
    const { id } = this.props;
    this.database.ref(`chats/${id}/command`).set({
      value: command
    });
  }
  handleUsernameSubmit(e) {
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
    console.log("handleSubmit", this.props);
    e.preventDefault();
    const { nacl } = this;
    if (!nacl) {
      console.log("bailing");
      return;
    }
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
      database,
      handleUsernameSubmit,
      handleChange,
      handleSubmit,
      username,
      handleCommand,
      nacl
    } = this;
    const { id, url } = this.props;
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
            inputVal,
            username
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
          {/* {database && (
            <Destroyer
              href="/destroy"
              dbRef={database.ref(`chats/${id}`)}
              nextID={uniqueString()}
            />
          )} */}
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
          <p>This chat will be destroyed in {this.state.remainingTime}</p>
        </section>
      </div>
    );
  }
}
export default Home;
