// @flow
import React, { Component } from 'react'
import { chatWindowStyles, msgContainerStyles } from './styles'

const Message = ({
  aliases,
  messages,
  msgKey,
  nacl
}: {
  aliases: Object,
  messages: Object,
  msgKey: String,
  nacl: Function
}) => {
  const message = messages[msgKey]
  const alias = aliases[message.value.username]
  const { publicKey } = message.value
  const msg = nacl.decode_utf8(
    nacl.crypto_sign_open(nacl.from_hex(message.value.message), publicKey)
  )
  return (
    <p className='container' key={msgKey}>
      <style jsx>{msgContainerStyles}</style>
      {alias && <em className='alias'>{alias.value}</em>}
      {`: `}
      <span className='message'>{msg}</span>
    </p>
  )
}

type ChatWindowProps = {
  messages: Object,
  status: String
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
      aliases,
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
              <Message {...{ aliases, msgKey, messages, nacl, key: msgKey }} />
            ))
          ) : (
            <p className='noMessages'>
              <em>No one has written anything.</em>
            </p>
          )}
        </div>
        <form className='form' onSubmit={handleSubmit}>
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
