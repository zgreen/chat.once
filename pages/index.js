// @flow
import 'firebase/database'
import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import escape from 'lodash.escape'
import * as firebase from 'firebase'
import naclFactory from 'js-nacl'
import Aside from '../components/Aside'
import ChatWindow from '../components/ChatWindow'
import Loading from '../components/Loading'
import SiteWrap from '../components/SiteWrap'

type HomeProps = {
  id: String,
  isNew: Boolean,
  lifetime: number,
  username: string,
  uuid: string
}

class Home extends Component<HomeProps> {
  static async getInitialProps ({ req, res, query }) {
    const lifetime = 1000 * 60 * 60
    if (req) {
      const axios = require('axios')
      const Chance = require('chance')
      const uuidv4 = require('uuid/v4')
      const chance = new Chance()
      const uuid = uuidv4()
      const id = escape(query.id) || uuidv4()
      const username = chance.name()
      setTimeout(() => {
        axios.delete(`https://oncechat-22dac.firebaseio.com/chats/${id}.json`)
      }, lifetime)
      return {
        id,
        isNew: !query.id,
        lifetime,
        uuid,
        username
      }
    }
    return {}
  }
  constructor (props) {
    super(props)
    console.log('props', props)
  }
  state = {
    inputVal: '',
    messages: {},
    alias: '',
    aliasInput: '',
    status: 'ready',
    users: {}
  }
  componentDidCatch (err) {
    console.error(err)
    Router.push({
      pathname: '/nope'
    })
  }
  componentDidMount () {
    const { id, isNew, lifetime } = this.props
    this.initFirebase()
    naclFactory.instantiate(nacl => {
      this.nacl = nacl
      this.keyPair = this.nacl.crypto_box_keypair()
    })
    if (isNew) {
      console.log('is new!')
      Router.push(`/?id=${id}`, `/?id=${id}`, { shallow: true })
    }
    this.handleUsernameSubmit()
    setTimeout(() => {
      Router.push({
        pathname: '/destroy'
      })
    }, lifetime)
  }
  handleChange = (e, inputVal = 'inputVal') => {
    this.setState({ [inputVal]: e.target.value })
  }
  handleCommand = (e = { preventDefault: () => null }, command = 'destroy') => {
    e.preventDefault()
    const { id } = this.props
    this.database.ref(`chats/${id}/command`).set({
      value: command
    })
  }
  handleUsernameSubmit = (e = { preventDefault: () => null }) => {
    e.preventDefault()
    const { aliasInput: alias } = this.state
    const { id, username, uuid } = this.props
    this.database.ref(`chats/${id}/users/${uuid}`).set({
      value: {
        alias,
        username,
        uuid,
        boxPk: this.keyPair.boxPk
      }
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { database, keyPair, nacl } = this
    const { id, username, uuid } = this.props
    const { inputVal } = this.state
    if (!nacl) {
      window.alert(`This message could not be signed, and wasn't sent.`)
      return
    }
    if (inputVal.trim().length === 0) {
      return
    }
    this.setState({ status: 'pending' }, () => {
      const { users } = this.state
      const nonce = nacl.crypto_box_random_nonce()
      database.ref(`chats/${id}/chat`).push(
        {
          value: {
            username,
            uuid,
            nonce,
            packets: Object.keys(users).map(key => {
              console.log('USER', users[key])
              return {
                uuid: users[key].value.uuid,
                packet: nacl.crypto_box(
                  nacl.encode_utf8(inputVal),
                  nonce,
                  users[key].value.boxPk,
                  keyPair.boxSk
                )
              }
            }),
            boxPk: keyPair.boxPk
          }
        },
        () => this.setState({ inputVal: '', status: 'ready' })
      )
    })
  }
  initFirebase = () => {
    const { id, uuid } = this.props
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
      if (snapshot.val()) {
        switch (snapshot.val().value) {
          case 'destroy':
            Router.push({
              pathname: '/destroy'
            })
            this.database.ref(`chats/${id}`).remove()
            break
          // no default
        }
      }
    })

    this.database.ref(`chats/${id}/chat`).on('value', snapshot => {
      this.setState({ messages: snapshot.val() })
    })
    this.database.ref(`chats/${id}/users`).on('value', snapshot => {
      const users = snapshot.val()
      if (users) {
        this.setState({
          users,
          alias: Object.keys(users).reduce(
            (acc, key) =>
              acc === '' && users[key].value.uuid === uuid
                ? users[key].value.alias
                : '',
            ''
          )
        })
      }
    })
  }
  render () {
    const {
      handleUsernameSubmit,
      handleChange,
      handleSubmit,
      handleCommand,
      nacl
    } = this
    const { username, uuid } = this.props
    const { alias, users, messages, inputVal, status } = this.state
    const userRecordExists = Object.keys(users).find(
      key => users[key].value.uuid === uuid
    )
    return (
      <SiteWrap>
        {this.keyPair && userRecordExists ? (
          <Fragment>
            <ChatWindow
              {...{
                alias,
                boxSk: this.keyPair.boxSk,
                users,
                messages,
                nacl,
                handleChange,
                handleSubmit,
                inputVal,
                username,
                status,
                uuid
              }}
            />
            <Aside
              {...{
                alias,
                users,
                handleChange,
                handleCommand,
                handleUsernameSubmit,
                username,
                uuid
              }}
            />
          </Fragment>
        ) : (
          <Loading />
        )}
      </SiteWrap>
    )
  }
}
export default Home
