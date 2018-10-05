// @flow
import 'firebase/database'
import axios from 'axios'
import React, { Component } from 'react'
import Router from 'next/router'
import uniqueString from 'unique-string'
import escape from 'lodash.escape'
import * as firebase from 'firebase'
import naclFactory from 'js-nacl'
import ChatWindow from '../components/ChatWindow'
import Destroyer from '../components/Destroyer'
import { actionsStyles, appStyles } from '../components/styles'
import SiteWrap from '../components/SiteWrap'

type HomeProps = {
  id: String,
  isNew: Boolean,
  url: Object
}

class Home extends Component<HomeProps> {
  static async getInitialProps ({ req, res, query }) {
    if (query) {
      const id = escape(query.id) || uniqueString()
      setTimeout(() => {
        axios.delete(`https://oncechat-22dac.firebaseio.com/chats/${id}.json`)
      }, this.lifetime)
      return {
        id,
        isNew: !query.id
      }
    }
    return {}
  }
  constructor (props) {
    super(props)
    this.username = uniqueString()
    this.state = {
      inputVal: '',
      messages: {},
      username: this.username,
      aliases: { [this.username]: { value: this.username } },
      status: 'ready'
    }
  }
  componentDidMount () {
    const { id, isNew } = this.props
    this.initFirebase()
    naclFactory.instantiate(nacl => {
      this.nacl = nacl
      this.keyPair = this.nacl.crypto_sign_keypair()
    })
    if (isNew) {
      Router.push({
        pathname: '/',
        query: { id }
      })
    }
  }
  lifetime = 1000 * 60 * 60
  handleChange = (e, inputCase = 'message') => {
    switch (inputCase) {
      case 'message':
        this.setState({ inputVal: e.target.value })
        break
      case 'username':
        this.setState({ username: e.target.value })
        break
      // no default
    }
  }
  handleCommand = (e = { preventDefault: () => null }, command = 'destroy') => {
    e.preventDefault()
    const { id } = this.props
    this.database.ref(`chats/${id}/command`).set({
      value: command
    })
  }
  handleUsernameSubmit = e => {
    e.preventDefault()
    if (this.state.username === this.username) {
      this.usernameInput.focus()
      return
    }
    this.database
      .ref('chats/' + this.props.id + `/aliases/${this.username}`)
      .set({
        value: this.state.username
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { nacl } = this
    if (!nacl) {
      window.alert(`This message could not be signed, and wasn't sent.`)
      return
    }
    this.setState({ status: 'pending' }, () => {
      this.database.ref(`chats/${this.props.id}/chat`).push(
        {
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
        },
        () => this.setState({ inputVal: '', status: 'ready' })
      )
    })
  }
  initFirebase = () => {
    const { id } = this.props
    firebase.initializeApp({
      apiKey: 'AIzaSyCmV_xvYmfs8Yk-NmgDxKZsnMujMy_jSJ4',
      authDomain: 'oncechat-22dac.firebaseapp.com',
      databaseURL: 'https://oncechat-22dac.firebaseio.com',
      projectId: 'oncechat-22dac',
      storageBucket: 'oncechat-22dac.appspot.com',
      messagingSenderId: '250112620252'
    })
    this.database = firebase.database()

    // Commands
    this.database.ref(`chats/${id}/command`).on('value', snapshot => {
      console.log(snapshot.val())
      if (snapshot.val()) {
        switch (snapshot.val().value) {
          case 'destroy':
            Router.push({
              pathname: '/destroy'
              // query: { id: this.props.id }
            })
            this.database.ref(`chats/${this.props.id}`).remove()
            console.log('destroyed!')
            break
          // no default
        }
      }
    })

    this.database
      .ref(`chats/${id}/connections/${this.username}`)
      .onDisconnect()
      .remove()
    this.database.ref(`chats/${id}/connections/${this.username}`).set({
      value: true
    })
    this.database.ref(`chats/${id}/aliases/${this.username}`).set({
      value: this.username
    })
    this.database.ref(`chats/${id}/chat`).on('value', snapshot => {
      this.setState({ messages: snapshot.val() })
    })
    this.database.ref(`chats/${id}/aliases/`).on('value', snapshot => {
      if (snapshot.val()) {
        this.setState({ aliases: snapshot.val() })
      }
    })
  }
  render () {
    const {
      handleUsernameSubmit,
      handleChange,
      handleSubmit,
      username,
      handleCommand,
      nacl
    } = this
    const { aliases, messages, inputVal, status } = this.state
    return (
      <SiteWrap>
        <style jsx global>
          {appStyles}
        </style>
        <h1>chat.once</h1>
        <div>
          <ChatWindow
            {...{
              aliases,
              messages,
              nacl,
              handleChange,
              handleSubmit,
              inputVal,
              username,
              status
            }}
          />

          <style jsx>{actionsStyles}</style>
          <section className='actions'>
            <h2>Actions</h2>
            <a className='action button' href='/'>
              Start a new chat
            </a>
            <button
              className='action button'
              onClick={e => handleCommand(e, 'destroy')}
            >
              Destroy this chat
            </button>
            <form className='action' onSubmit={e => e.preventDefault()}>
              <button className='button'>Click to copy chat url</button>
            </form>
            {!aliases[username] ||
              (aliases[username].value === username && (
                <form className='action' onSubmit={handleUsernameSubmit}>
                  <div className='userNameFields'>
                    <label>
                      Your username is:{' '}
                      <input
                        ref={input => {
                          this.usernameInput = input
                        }}
                        className='userNameInput'
                        placeholder={this.state.username}
                        onChange={e => handleChange(e, 'username')}
                      />
                    </label>
                    <p className='userNameNote'>
                      You may change it, but only once.
                    </p>
                  </div>
                  <button className='button'>Change username</button>
                </form>
              ))}
          </section>
        </div>
        <small>
          <ul>
            <li>All chats are destroyed within on hour of their creation.</li>
          </ul>
        </small>
      </SiteWrap>
    )
  }
}
export default Home
