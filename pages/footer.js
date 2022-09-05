let root = "/Student-Course-Selction-System/pages";
class Footer extends React.Component {
  render() {
    return (
      <footer>
        <a href=root+"/index.html">Home</a> | <a href=root+"/log.html">Log</a> |{" "}
        <a href=root+"/qa.html">FAQ</a> | <a href=root+"/ack.html">Ack</a> | <a href=root+"/other.html">Other</a>
        <br />
        Created by{" "}
        <a href="https://blog.csdn.net/zjt1027?type=blog">Jingtian Zhang</a>
        <br />
      </footer>
    );
  }
}

ReactDOM.render(<Footer />, document.querySelector("#footer"));
