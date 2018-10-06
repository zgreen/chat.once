// @flow
import 'firebase/database'
import axios from 'axios'
import Chance from 'chance'
import React, { Component } from 'react'
import Router from 'next/router'
import uniqueString from 'unique-string'
import escape from 'lodash.escape'
import * as firebase from 'firebase'
import naclFactory from 'js-nacl'
import Aside from '../components/Aside'
import ChatWindow from '../components/ChatWindow'
import { actionsStyles, appStyles } from '../components/styles'
import SiteWrap from '../components/SiteWrap'

const chance = new Chance()

type HomeProps = {
  id: String,
  isNew: Boolean,
  lifetime: number,
  url: Object
}

class Home extends Component<HomeProps> {
  static async getInitialProps ({ req, res, query }) {
    const lifetime = 1000 * 60 * 60
    if (query) {
      const id = escape(query.id) || Date.now() + uniqueString()
      setTimeout(() => {
        axios.delete(`https://oncechat-22dac.firebaseio.com/chats/${id}.json`)
      }, lifetime)
      return {
        id,
        isNew: !query.id,
        lifetime
      }
    }
    return {}
  }
  constructor (props) {
    super(props)
    this.username = chance.name()
    this.state = {
      inputVal: '',
      messages: {},
      username: this.username,
      aliases: { [this.username]: { value: this.username } },
      status: 'ready'
    }
  }
  componentDidMount () {
    const { id, isNew, lifetime } = this.props
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
    setTimeout(() => {
      Router.push({
        pathname: '/destroy'
      })
    }, lifetime)
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
    this.database
      .ref('chats/' + this.props.id + `/aliases/${this.username}`)
      .set({
        value: this.state.username
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { database, keyPair, nacl, username } = this
    const { id } = this.props
    const { inputVal } = this.state
    if (!nacl) {
      window.alert(`This message could not be signed, and wasn't sent.`)
      return
    }
    if (inputVal.trim().length === 0) {
      return
    }
    this.setState({ status: 'pending' }, () => {
      database.ref(`chats/${id}/chat`).push(
        {
          value: {
            username: username,
            message: nacl.to_hex(
              nacl.crypto_sign(nacl.encode_utf8(inputVal), keyPair.signSk)
            ),
            publicKey: keyPair.signPk
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
            })
            this.database.ref(`chats/${id}`).remove()
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
        <Aside
          {...{
            aliases,
            handleChange,
            handleCommand,
            handleUsernameSubmit,
            username
          }}
        />
      </SiteWrap>
    )
  }
}
export default Home
