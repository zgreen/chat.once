import React, { Component } from "react";
import { chatWindowStyles, msgContainerStyles } from "./styles";

const Message = ({ aliases, messages, msgKey, nacl }) => {
  const message = messages[msgKey];
  const alias = aliases[message.value.username];
  const { publicKey } = message.value;
  const msg = nacl.decode_utf8(
    nacl.crypto_sign_open(nacl.from_hex(message.value.message), publicKey)
  );
  return (
    <p className="container" key={msgKey}>
      <style jsx>{msgContainerStyles}</style>
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
        <style jsx>{chatWindowStyles}</style>
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
