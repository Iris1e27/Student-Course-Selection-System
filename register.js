class Register extends React.Component {
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
    if (this.state.username == "" || this.state.password == "") {
      alert("Error: Your username or password cannot be empty. Try again.");
    }
    const ids = JSON.parse(localStorage.getItem("ids", JSON));
    var register = true;
    
    ids["ids"].forEach((element) => {
      if (
        element["identity"] == this.state.identity &&
        element["username"] == this.state.username
      ) {
        alert("Error: This username has already been created. You should change your username and try again. ");
        register = false;
      }
    });
    if (register === true) {
        alert("Success: Your account has been saved successfully. ");
        const id = {
          "identity": this.state.identity,
          "username": this.state.username,
          "password": this.state.password,
        }
        ids["ids"].push(id);
        localStorage.setItem('ids', JSON.stringify(ids))
        localStorage.setItem("username", this.state.username);
        window.location.href = "./" + this.state.identity + ".html";
    }
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
        <input type="submit" value="Register" />
      </form>
    );
  }
}

ReactDOM.render(<Register />, document.querySelector("#register_container"));
