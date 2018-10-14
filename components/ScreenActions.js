// @flow
export default ({
  handleScreenAction,
  mobileScreen
}: {
  handleScreenAction: Function,
  mobileScreen: string
}) => (
  <div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: column;
        grid-column: 2/3;
        grid-row: 2/3;
      }
      button {
        appearance: none;
        background-color: transparent;
        border: 3px solid var(--black);
        border-radius: 50%;
        display: block;
        height: 60px;
        margin-bottom: var(--spacerStandard);
        width: 60px;
      }
      .buttonActive {
        background-color: var(--black);
        color: var(--veryLightYellow);
      }
    `}</style>
    {['', 'actions', 'users'].map(screen => (
      <button
        onClick={() => handleScreenAction(screen)}
        className={`${mobileScreen === screen ? 'buttonActive' : ''}`}
      >
        {screen === '' ? 'chat' : screen}
      </button>
    ))}
  </div>
)
