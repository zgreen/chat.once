import React, { Component } from "react";

const Message = ({ aliases, messages, msgKey, nacl }) => {
  const message = messages[msgKey];
  const alias = aliases[message.value.username];
  const { publicKey } = message.value;
  const msg = nacl.decode_utf8(
    nacl.crypto_sign_open(nacl.from_hex(message.value.message), publicKey)
  );
  return (
    <p className="container" key={msgKey}>
      <style jsx>{`
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
        }
        .container {
          display: flex;
        }
        .container::before {
          align-self: center;
          animation: new 0.5s forwards;
          border-radius: 50%;
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 10px;
          background-color: tomato;
        }
        .message {
          display: inline-block;
          margin-left: 10px;
          max-width: 300px;
        }
      `}</style>
      {alias && <em className="alias">{alias.value}</em>}
      {`: `}
      <span className="message">{msg}</span>
    </p>
  );
};

class ChatWindow extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.messages &&
      this.props.messages &&
      Object.keys(prevProps.messages).length !==
        Object.keys(this.props.messages).length
    ) {
      this.messagesContainer.scrollTo(0, this.messagesContainer.scrollHeight);
    }
  }
  render() {
    const {
      aliases,
      messages,
      nacl,
      handleChange,
      handleSubmit,
      inputVal
    } = this.props;
    return (
      <div className="chatWindow">
        <style jsx>{`
          .chatWindow {
            justify-content: flex-end;
            display: flex;
            font-size: var(--baseFontSize);
            flex-direction: column;
            height: 90vh;
            margin: 0 auto 10vh;
          }
          .input {
            background-color: var(--veryLightYellow);
            border: 0;
            border-bottom: 3px solid #21b6c4;
            font-family: monospace;
            font-size: var(--baseFontSize);
            height: 40px;
            margin: 0;
            padding: 0 10px;
          }
          .input:focus {
            outline: 0;
            width: 100%;
          }
          .messages {
            overflow: scroll;
          }
          .noMessages {
            color: var(--brown);
          }
        `}</style>
        <div
          className="messages"
          ref={div => {
            this.messagesContainer = div;
          }}
        >
          {messages ? (
            Object.keys(messages).map((msgKey, idx, arr) => (
              <Message {...{ aliases, msgKey, messages, nacl, key: msgKey }} />
            ))
          ) : (
            <p className="noMessages">
              <em>No one has written anything.</em>
            </p>
          )}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" value={inputVal} onChange={handleChange} />
        </form>
      </div>
    );
  }
}

export default ChatWindow;
