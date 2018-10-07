// @flow
import { CopyToClipboard } from 'react-copy-to-clipboard'
import About from './About'

const Break = () => (
  <div>
    <style jsx>{`
      div {
        font-size: 24px;
        margin: 16px;
        text-align: center;
      }
    `}</style>
    * * *
  </div>
)
export default ({
  alias,
  users,
  handleChange,
  handleCommand,
  handleUsernameSubmit,
  username,
  uuid
}: {
  alias: string,
  users: Object,
  handleChange: Function,
  handleCommand: Function,
  handleUsernameSubmit: Function,
  username: string,
  uuid: string
}) => (
  <aside>
    <style jsx>{`
      aside {
        background-color: var(--black);
        color: var(--veryLightYellow);
        border: 10px double var(--veryLightYellow);
        grid-column: 3/4;
        grid-row: 1/5;
        overflow: scroll;
        padding: 10px;
      }
      a {
        text-decoration: none;
      }
      h2 {
        text-align: center;
      }
      input {
        background-color: transparent;
        border: 0;
        border-bottom: 3px solid var(--tomato);
        color: var(--tomato);
      }
      p {
        font-size: 16px;
      }
      .button {
        appearance: none;
        background-color: transparent;
        border: 0;
        font-family: monospace;
      }
      .action {
        border: 2px solid currentColor;
        border-radius: 10px;
        color: var(--tomato);
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        line-height: 1;
        padding: 10px;
      }
      input,
      .action:first-child {
        margin-right: 5px;
      }
      .actionCopy {
        flex: 1 0 100%;
        margin-top: 10px;
        width: 100%;
      }
      .actionsContainer {
        flex-wrap: wrap;
        padding: 10px;
      }
      .actionsContainer,
      .usernameWrapper {
        display: flex;
      }
    `}</style>
    <section className='actions'>
      <h2>Actions</h2>
      <div className='actionsContainer'>
        <a className='action button' href='/'>
          Start a new chat
        </a>
        <button
          className='action button'
          onClick={e => handleCommand(e, 'destroy')}
        >
          Destroy this chat
        </button>
        <CopyToClipboard
          text={typeof window !== 'undefined' ? window.location.href : ''}
          onCopy={() => this.setState({ copied: true })}
        >
          <button className='action button actionCopy'>
            Copy chat link to clipboard
          </button>
        </CopyToClipboard>
      </div>
      <Break />
      {alias.length === 0 && (
        <form onSubmit={handleUsernameSubmit}>
          <div className='userNameFields'>
            <p>
              Your random username is: <strong>{username}</strong>
            </p>
            <label className='userNameNote'>
              <p>You may change it, but only once.</p>
              <div className='usernameWrapper'>
                <input
                  className='userNameInput'
                  placeholder='Enter new username'
                  onChange={e => handleChange(e, 'aliasInput')}
                />
                <button className='action button'>Change username</button>
              </div>
            </label>
          </div>
          <Break />
        </form>
      )}
    </section>
    <About />
  </aside>
)
