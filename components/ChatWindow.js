// @flow
import React, { Component } from 'react'
import Router from 'next/router'
import { chatWindowStyles, msgContainerStyles } from './styles'

const Waiting = ({ isReady }: { isReady: boolean }) =>
  isReady ? (
    <p className='noMessages'>
      <em>The chat is ready! But no one has written anything.</em>
    </p>
  ) : (
    <p>
      <strong>
        You're the only one here. Invite someone to start chatting.
      </strong>
    </p>
  )

const Message = ({
  boxSk,
  users,
  messages,
  msgKey,
  nacl,
  uuid
}: {
  users: Object,
  messages: Object,
  msgKey: string,
  nacl: Function,
  uuid: string
}) => {
  const message = messages[msgKey]
  const matchedUser = Object.keys(users)
    .map(key => users[key])
    .find(user => user.value.uuid === message.value.uuid)
  const name =
    matchedUser && matchedUser.value.alias.length
      ? matchedUser.value.alias
      : message.value.username
  const packetMatch = message.value.packets.find(packet => {
    return message.value && packet.uuid === uuid
  })
  if (typeof packetMatch === 'undefined') {
    Router.push({
      pathname: '/nope'
    })
  }
  const msg = nacl.decode_utf8(
    nacl.crypto_box_open(
      packetMatch.packet,
      message.value.nonce,
      message.value.boxPk,
      boxSk
    )
  )
  return (
    <p className='container'>
      <style jsx>{msgContainerStyles}</style>
      {name && <em className='alias'>{name}: </em>}
      <span className='message'>{msg}</span>
    </p>
  )
}

type ChatWindowProps = {
  handleChange: Function,
  handleSubmit: Function,
  inputVal: string,
  messages: Object,
  nacl: Object,
  status: string,
  users: Object,
  uuid: string
}

class ChatWindow extends Component<ChatWindowProps> {
  componentDidUpdate (prevProps) {
    const { messagesContainer } = this
    const { messages } = this.props
    if (
      prevProps.messages &&
      messages &&
      Object.keys(prevProps.messages).length !== Object.keys(messages).length
    ) {
      messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
    }
  }
  render () {
    const {
      boxSk,
      users,
      messages,
      nacl,
      handleChange,
      handleSubmit,
      inputVal,
      status,
      uuid
    } = this.props
    const isPending = status === 'pending'
    const isReady = Object.keys(users).length > 1
    return (
      <div className='chatWindow'>
        <style jsx>{chatWindowStyles}</style>
        <div
          className='messages'
          ref={div => {
            this.messagesContainer = div
          }}
        >
          {messages ? (
            Object.keys(messages).map((msgKey, idx, arr) => (
              <Message
                {...{ boxSk, users, msgKey, messages, nacl, key: msgKey, uuid }}
              />
            ))
          ) : (
            <Waiting {...{ isReady }} />
          )}
        </div>
        <form className='form' onSubmit={handleSubmit}>
          <label
            className={`label ${inputVal.length ? 'labelActiveText' : ''}`}
          >
            Type something &#9660;
          </label>
          <input
            className='input'
            style={isPending ? { borderBottomColor: '#111' } : {}}
            disabled={!isReady || isPending}
            value={inputVal}
            onChange={handleChange}
            placeholder={!isReady ? 'Add a person to start chatting.' : ''}
          />
        </form>
      </div>
    )
  }
}

export default ChatWindow
