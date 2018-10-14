// @flow
import React, { Component } from 'react'
import Router from 'next/router'
import css from 'styled-jsx/css'

const Waiting = ({ isReady }: { isReady: boolean }) =>
  isReady ? (
    <p className='noMessages'>
      <em>The chat is ready! But no one has written anything.</em>
    </p>
  ) : (
    <p>
      <strong>
        You're the only one here. Share this link with someone to start
        chatting.
      </strong>
    </p>
  )

const msgContainerStyles = css`
  @keyframes new {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .alias {
    color: var(--brown);
    display: inline-block;
    position: relative;
  }
  .alias::after {
    animation: new 0.5s forwards;
    background-color: tomato;
    bottom: 0;
    content: '';
    display: inline-block;
    height: 1px;
    left: 0;
    position: absolute;
    width: 100%;
  }
  .container {
    display: flex;
  }
  .message {
    display: inline-block;
    margin-left: 10px;
    max-width: 300px;
  }
`

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
  style: Object,
  users: Object,
  uuid: string
}

const chatWindowStyles = css`
  .chatWindow {
    align-content: flex-end;
    display: flex;
    flex-direction: column;
    grid-column: 1/4;
    grid-row: 2/6;
  }
  @media (max-width: 800px) {
    .chatWindow {
      grid-column: 1/2;
      grid-row: 2/3;
      margin-right: var(--spacerStandard);
    }
  }
  .input {
    background-color: var(--veryLightYellow);
    border: 0;
    box-sizing: border-box;
    ${''} border: 1px solid black;
    font-family: monospace;
    font-size: var(--baseFontSize);
    height: 40px;
    margin: 0;
    padding: 0 10px;
    width: 100%;
  }
  .input:disabled {
    opacity: 0.5;
  }
  .label {
    display: block;
    font-style: italic;
  }
  .labelActiveText {
    opacity: 0.5;
  }
  .messages,
  .noMessages {
    margin-bottom: 20px;
    margin-top: auto;
  }
  .messages {
    overflow-x: visible;
    overflow-y: scroll;
  }
  .noMessages {
    color: var(--brown);
  }
  .send {
    border: 0;
    border-radius: 0;
    background-color: var(--black);
    bottom: 0;
    color: var(--veryLightYellow);
    height: 30px;
    font-weight: bold;
    left: 0;
    letter-spacing: 3px;
    position: fixed;
    text-transform: uppercase;
    width: 100%;
    z-index: 1;
  }
`

class ChatWindow extends Component<ChatWindowProps> {
  state = {
    showSendButton: false
  }
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
      isMobile,
      status,
      style,
      uuid
    } = this.props
    const isPending = status === 'pending'
    const isReady = Object.keys(users).length > 1
    const { showSendButton } = this.state
    return (
      <div style={style} className='chatWindow'>
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
            // onFocus={() => this.setState({ showSendButton: true })}
            // onBlur={() => this.setState({ showSendButton: false })}
            onChange={handleChange}
            placeholder={!isReady ? 'Add a person to start chatting.' : ''}
          />
          {isMobile &&
            showSendButton && (
            <button
              className='send'
              disabled={!isReady || isPending}
              type='submit'
            >
                send
            </button>
          )}
        </form>
      </div>
    )
  }
}

export default ChatWindow
