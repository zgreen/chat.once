import SiteWrap from '../components/SiteWrap'
const Destroy = () => (
  <SiteWrap>
    <style jsx>{`
      div {
        grid-row: 2/3;
      }
    `}</style>
    <div>
      <h2>Your chat was destroyed.</h2>
      <h3>
        <a href='/'>Start a new chat</a>
      </h3>
    </div>
  </SiteWrap>
)

export default Destroy
