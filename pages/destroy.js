import Link from 'next/link'
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
      <Link href='/'>
        <a>Start a new chat</a>
      </Link>
    </div>
  </SiteWrap>
)

export default Destroy
