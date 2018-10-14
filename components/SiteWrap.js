// @flow
import Head from 'next/head'
import css from 'styled-jsx/css'
import Type from '../components/Typography'

const appStyles = css`
  :global(html) {
    box-sizing: border-box;
  }
  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: inherit;
  }
  :global(:root) {
    --baseFontSize: 20px;
    --black: #222;
    --darkGray: #444;
    --brown: #91847a;
    --spacerStandard: 10px;
    --tomato: tomato;
    --veryLightYellow: #fcfbf2;
  }
  :global(body) {
    margin: 0;
  }
  :global(h1, h2, h3, h4, h5, h6) {
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
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto 1fr;
    box-sizing: border-box;
    display: grid;
    line-height: 1.3;
    height: 100vh;
    padding: 5vmin;
  }
  @media (max-width: 800px) {
    .app {
      grid-template-columns: 1fr auto;
    }
  }
  header {
    grid-column: 1/6;
    grid-row: 1/2;
  }
  .dot {
    animation: blink 3s linear infinite;
  }
`

export default ({ render, children, chatIsReady }: { render: Function }) => (
  <div className='app'>
    <style jsx>{appStyles}</style>
    <Head>
      <title>once.chat</title>
    </Head>
    <header>
      <h1>
        chat
        <span className='dot'>.</span>
        once
      </h1>
      <Type
        {...{
          level: 'h2',
          type: 'Small',
          style: {}
        }}
      >
        <em>Encrypted, anonymous by default, self-destructing.</em>
      </Type>
    </header>
    {children}
  </div>
)
