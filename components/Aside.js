// @flow
import { CopyToClipboard } from 'react-copy-to-clipboard'
import About from './About'
import Screen from './Screen'
import Type from './Typography'

const Break = () => (
  <div>
    <style jsx>{`
      div {
        color: var(--brown);
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
  mobileScreen,
  style,
  username,
  uuid
}: {
  alias: string,
  users: Object,
  handleChange: Function,
  handleCommand: Function,
  handleUsernameSubmit: Function,
  style: Object,
  username: string,
  uuid: string
}) => (
  <aside style={style}>
    <style jsx>{`
      aside {
        grid-column: 5/6;
        grid-row: 2/6;
        overflow: scroll;
      }
      .isMobile a {
        text-decoration: none;
      }
      input {
        background-color: transparent;
        border: 0;
        border-bottom: 3px solid currentColor;
        color: var(--black);
        margin-bottom: 10px;
        width: 100%;
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
        color: var(--black);
        cursor: pointer;
        display: block;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: var(--spacerStandard);
        padding: var(--spacerStandard);
        text-align: center;
        text-decoration: none;
        width: 100%;
      }
      .actionCopy {
        flex: 1 0 100%;
        margin-top: 10px;
        width: 100%;
      }
      .actionsContainer {
        padding: 10px;
      }
    `}</style>
    <section className='actions'>
      <Type {...{ level: 'h2', type: 'SmallCentered' }}>Actions</Type>
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
              Your random username is: <strong>{username}</strong>.
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
