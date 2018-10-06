import css from 'styled-jsx/css'

const appStyles = css`
  :global(:root) {
    --baseFontSize: 20px;
    --black: #222;
    --darkGray: #444;
    --brown: #91847a;
    --tomato: tomato;
    --veryLightYellow: #fcfbf2;
  }
  :global(body) {
    margin: 0;
  }
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .app {
    background-color: var(--veryLightYellow);
    border: 20px double var(--black);
    font-family: monospace;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    box-sizing: border-box;
    display: grid;
    font-family: monospace;
    line-height: 1.3;
    height: 100vh;
    padding: 5vmin;
  }
  .app *,
  .app *::before,
  .app *::after {
    box-sizing: inherit;
  }
  h1 {
    grid-column: 1/3;
    grid-row: 1/2;
    margin: 0;
  }
  .dot {
    animation: blink 3s linear infinite;
  }
`

const actionsStyles = css`
  .action {
    margin-bottom: 20px;
  }
  .actions {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
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
`

const chatWindowStyles = css`
  .chatWindow {
    align-content: flex-end;
    display: flex;
    flex-direction: column;
    grid-column: 1/3;
    grid-row: 2/5;
    margin-right: 40px;
    ${'' /* justify-content: flex-end;
    display: flex;
    font-size: var(--baseFontSize);
    flex-direction: column;
    height: 90vh;
    margin: 0 auto 10vh; */};
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
    overflow: scroll;
  }
  .noMessages {
    color: var(--brown);
  }
`

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
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    margin-left: -20px;
    background-color: tomato;
  }
  .message {
    display: inline-block;
    margin-left: 10px;
    max-width: 300px;
  }
`

export { actionsStyles, appStyles, chatWindowStyles, msgContainerStyles }
