// @flow
import React, { Component } from 'react'
import { chatWindowStyles, msgContainerStyles } from './styles'

const Message = ({
  boxSk,
  users,
  messages,
  msgKey,
  nacl
}: {
  users: Object,
  messages: Object,
  msgKey: string,
  nacl: Function
}) => {
  const message = messages[msgKey]
  const matchedUser = Object.keys(users)
    .map(key => users[key])
    .find(user => user.value.uuid === message.value.uuid)
  const name =
    matchedUser && matchedUser.value.alias.length
      ? matchedUser.value.alias
      : message.value.username
  // const { publicKey } = message.value
  // const msg = nacl.decode_utf8(
  //   nacl.crypto_sign_open(nacl.from_hex(message.value.message), publicKey)
  // )
  console.log('boxSk!', boxSk)
  console.log('message!', message.value)
  console.log('packets!', message.value.packets)
  const packetMatch = message.value.packets.find(packet => {
    console.log('pkt', packet.user.value.uuid, message.uuid)
    return message.value && packet.user.value.uuid === message.value.uuid
  })
  if (!packetMatch) {
    return
  }
  const msg = nacl.decode_utf8(
    nacl.crypto_box_open(
      packetMatch.packet,
      message.value.nonce,
      message.value.boxPk,
      boxSk
    )
  )
  console.log('MSG', msg)
  return (
    <p className='container'>
      <style jsx>{msgContainerStyles}</style>
      {name && <em className='alias'>{name}: </em>}
      <span className='message'>{msg}</span>
    </p>
  )
}

type ChatWindowProps = {
  messages: Object,
  status: string,
  users: Object
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
      status
    } = this.props
    const isPending = status === 'pending'
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
                {...{ boxSk, users, msgKey, messages, nacl, key: msgKey }}
              />
            ))
          ) : (
            <p className='noMessages'>
              <em>No one has written anything.</em>
            </p>
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
            disabled={isPending}
            value={inputVal}
            onChange={handleChange}
          />
        </form>
      </div>
    )
  }
}

export default ChatWindow
