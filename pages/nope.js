import SiteWrap from '../components/SiteWrap'

export default () => (
  <SiteWrap>
    <style jsx>{`
      h2 {
        grid-column: 1/4;
      }
    `}</style>
    <h2>
      Sorry. That chat is already in progress, or there was an error. ¯\_(ツ)_/¯
    </h2>
    <h3>
      <a href='/'>Start a new chat.</a>
    </h3>
  </SiteWrap>
)
