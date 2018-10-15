import Link from 'next/link'
import config from '../config'
export default () => (
  <small>
    <style jsx>{`
      small {
        font-size: 16px;
        overflow: scroll;
      }
      a {
        color: var(--brown);
      }
      h3 {
        text-align: center;
      }
      li {
        margin-bottom: 5px;
      }
      strong {
        color: var(--tomato);
      }
      ul {
        padding: 0 0 0 var(--spacerStandard);
      }
    `}</style>
    <h3>About</h3>
    <ul>
      <li>
        <strong>HOLD UP!</strong> This app is an experiment; use at your own
        risk! I make no claims about its safety or integrity. Please use Signal
        or Wire :)
      </li>
      <li>
        All chat messages are encrypted using{' '}
        <a href='https://github.com/tonyg/js-nacl'>
          <code>js-nacl</code>
        </a>
        .
      </li>
      <li>
        Encrypted messages are stored in{' '}
        <a href='https://firebase.google.com/'>Google Firebase</a>.
      </li>
      <li>
        Any user may destroy their current chat at any time. This erases the
        entire chat.
      </li>
      <li>All chats are destroyed within one hour of their creation.</li>
      <li>
        This software is covered by the MIT License.{' '}
        <Link href='/license'>
          <a>View license.</a>
        </Link>
      </li>
      <li>
        <a href=''>GitHub</a>.
      </li>
      <li>{config.version}</li>
    </ul>
  </small>
)
