import Link from "next/link";
import { appStyles } from "../components/styles";
const Destroy = () => (
  <div className="app">
    <style jsx global>
      {appStyles}
    </style>
    <h1>This chat was destroyed.</h1>
    <Link href="/">
      <a>Start a new chat</a>
    </Link>
  </div>
);

export default Destroy;
