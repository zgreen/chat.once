// @flow
import Head from 'next/head'
import css from 'styled-jsx/css'

const appStyles = css`
  :root {
    --baseFontSize: 20px;
    --darkGray: #444;
    --brown: #91847a;
    --tomato: tomato;
    --veryLightYellow: #fcfbf2;
  }
  .app {
    background-color: var(--veryLightYellow);
    box-sizing: border-box;
  }
  .app *,
  .app *::before,
  .app *::after {
    box-sizing: inherit;
  }
`
export default ({ render, children }: { render: Function }) => (
  <div className='app'>
    <Head>
      <title>once.chat</title>
    </Head>
    <style jsx global>{`
      body {
        margin: 0;
      }
    `}</style>
    <style jsx global>
      {appStyles}
    </style>
    {children}
  </div>
)
