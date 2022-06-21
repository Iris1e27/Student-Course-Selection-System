class Footer extends React.Component {
  render() {
    return (
      <footer>
        <a href="/index.html">Home</a> | <a href="/log.html">Log</a> |{" "}
        <a href="/qa.html">FAQ</a> | <a href="/ack.html">Ack</a> | <a href="/other.html">Other</a>
        <br />
        Created by{" "}
        <a href="https://blog.csdn.net/zjt1027?type=blog">Jingtian Zhang</a>
        <br />
      </footer>
    );
  }
}

ReactDOM.render(<Footer />, document.querySelector("#footer"));
