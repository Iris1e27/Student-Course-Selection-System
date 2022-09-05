class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: "student",
      username: "",
      password: "",
    };
    this.changeIdentity = this.changeIdentity.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }


  changeIdentity = (event) => {
    let tmp = event.target.value;
    this.setState({
      identity: tmp,
    });
    console.log(this.state.identity);
  };

  changeUsername = (event) => {
    let tmp = event.target.value;
    this.setState({
      username: tmp,
    });
    console.log(this.state.username);
  };

  changePassword = (event) => {
    let tmp = event.target.value;
    this.setState({
      password: tmp,
    });
    console.log(this.state.password);
  };

  submitForm = (event) => {
    event.preventDefault();
    const ids = JSON.parse(localStorage.getItem("ids", JSON)) || {
      "ids": [
        {
          "identity": "student",
          "username": "zjt",
          "password": "1027"
        },
        {
          "identity": "admin",
          "username": "admin",
          "password": "admin"
        }
      ]
    };
    let login = false;
    localStorage.setItem('ids', JSON.stringify(ids))
    ids["ids"].forEach((element) => {
      if (
        element["identity"] == this.state.identity &&
        element["username"] == this.state.username &&
        element["password"] == this.state.password
      ) {
        localStorage.setItem("username", this.state.username);
        alert("Success: Hello " + element["identity"] + ": " + element["username"] + " . ");
        login = true;
        window.location.href="./"+element["identity"]+".html";
      } 
    });
    if (!login) alert("Error: Your identity or username or password cannot be wrong. Try again.");
  };

  render() {
    const { identity, username, password } = this.state;
    return (
      <form onSubmit={this.submitForm}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={this.changeUsername}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="text"
          name="password"
          id="password"
          value={password}
          onChange={this.changePassword}
        />
        <br />
        <select name="identity" value={identity} onChange={this.changeIdentity}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <input type="submit" value="Login" />
      </form>
    );
  }
}

ReactDOM.render(<Login />, document.querySelector("#login_container"));
