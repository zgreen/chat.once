import css from 'styled-jsx/css'

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

export { chatWindowStyles, msgContainerStyles }
