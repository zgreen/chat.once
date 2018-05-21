import css from "styled-jsx/css";

const appStyles = css`
  :root {
    --baseFontSize: 20px;
    --darkGray: #444;
    --brown: #91847a;
    --tomato: tomato;
    --veryLightYellow: #fcfbf2;
  }
  * {
    box-sizing: border-box;
  }
  body {
    background-color: var(--veryLightYellow);
    margin: 0;
  }
`;

const actionsStyles = css`
  .action {
    margin-bottom: 20px;
  }
  .actions {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }
  .app {
    display: flex;
    font-family: monospace;
  }
  .button {
    appearance: none;
    background-color: var(--tomato);
    border: 0;
    border-radius: 5px;
    color: #f7f7f7;
    font-family: monospace;
    font-size: 16px;
    letter-spacing: 1px;
    padding: 10px;
    text-decoration: none;
    text-transform: uppercase;
  }
  .button:hover {
    background-color: var(--darkGray);
    cursor: pointer;
  }
  .linkDisplay {
    display: block;
  }
  .userNameInput {
    background-color: var(--veryLightYellow);
    border: 0;
    border-bottom: 2px solid var(--darkGray);
    display: block;
    font-size: 18px;
    font-family: monospace;
  }

  .userNameNote {
    color: var(--brown);
    margin: 5px 0 20px;
  }
`;

const chatWindowStyles = css`
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
`;

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
`;

export { actionsStyles, appStyles, chatWindowStyles, msgContainerStyles };
