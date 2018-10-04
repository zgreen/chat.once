// @flow
import 'firebase/database'
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
      const remainingTime = parseInt(query.lifetime, 10) || 10000
      return {
        id,
        isNew: !query.id,
        remainingTime
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
      status: 'ready',
      remainingTime: this.props.remainingTime,
      didSetLifetime: false,
      remainingTimeInterval: null
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
    this.setState({ remainingTimeInterval: this.updateRemainingTime() })
  }
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
    this.database.ref(`chats/${id}/lifetime`).on('value', snapshot => {
      if (snapshot.val()) {
        clearInterval(this.state.remainingTimeInterval)
        this.setState(
          { remainingTime: snapshot.val(), didSetLifetime: true },
          this.updateRemainingTime
        )
      }
    })
  }
  updateRemainingTime = () => {
    setInterval(() => {
      this.setState(({ remainingTime, id }) => {
        if (remainingTime - 1000 <= 0) {
          console.log('destroy!')
          this.database.ref(`chats/${id}/command`).set({
            value: 'destroy'
          })
          return {}
        }
        return {
          remainingTime: remainingTime - 1000
        }
      })
    }, 1000)
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
    const { url } = this.props
    const { aliases, messages, inputVal, status } = this.state
    return (
      <SiteWrap>
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
          <style jsx global>
            {appStyles}
          </style>
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
            {/* {database && (
              <Destroyer
                href="/destroy"
                dbRef={database.ref(`chats/${id}`)}
                nextID={uniqueString()}
              />
            )} */}
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
            <p>
              This chat will be destroyed in {this.state.remainingTime / 1000}{' '}
              seconds.
            </p>
          </section>
        </div>
      </SiteWrap>
    )
  }
}
export default Home
