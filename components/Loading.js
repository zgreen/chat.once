export default () => (
  <h2>
    <style jsx>{`
      @keyframes loading {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      h2 {
        align-items: center;
        display: flex;
        grid-column: 1/4;
      }
      .loading {
        animation: loading 3s linear infinite;
        margin-left: 10px;
      }
    `}</style>
    Hang on, it's loading
    {` `}
    <div className='loading'>-</div>
  </h2>
)
