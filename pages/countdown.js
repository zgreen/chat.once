import React, { Component } from "react";
import escape from "lodash.escape";
import axios from "axios";

class Countdown extends Component {
  static async getInitialProps({ query }) {
    if (query && query.id) {
      const id = escape(query.id);
      setTimeout(() => {
        axios
          .get("http://localhost:3000/", { params: { id, destroy: 1 } })
          .catch(err => console.log(err));
      }, 1000);
    }
    return {};
  }
  render() {
    return <h1>this is the countdown</h1>;
  }
}

export default Countdown;
