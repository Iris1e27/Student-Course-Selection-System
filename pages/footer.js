class Footer extends React.Component {
  render() {
    return (
      <footer>
        <a href="/Student-Course-Selction-System/pages/index.html">Home</a> | <a href="/Student-Course-Selction-System/pages/log.html">Log</a> |{" "}
        <a href="/Student-Course-Selction-System/pages/qa.html">FAQ</a> | <a href="/Student-Course-Selction-System/pages/ack.html">Ack</a> | <a href="/Student-Course-Selction-System/pages/other.html">Other</a>
        <br />
        Created by{" "}
        <a href="https://blog.csdn.net/zjt1027?type=blog">Jingtian Zhang</a>
        <br />
      </footer>
    );
  }
}

ReactDOM.render(<Footer />, document.querySelector("#footer"));
