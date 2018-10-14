// @flow
import Type from './Typography'
export default (
  { style, users, uuid }: { users: Object, uuid: string } = {
    users: {},
    uuid: ''
  }
) => (
  <div style={style} className='container'>
    <style jsx>{`
      .container {
        grid-column: 4/5;
      }
      ul {
        padding: 0;
      }
    `}</style>
    <Type {...{ level: 'h2', type: 'SmallCentered' }}>Users</Type>
    <ul>
      {Object.keys(users).map(key => {
        const user = users[key].value
        return (
          <li>
            {user.alias || user.username}{' '}
            {uuid && uuid === user.uuid ? <em>(you)</em> : null}
          </li>
        )
      })}
    </ul>
  </div>
)
