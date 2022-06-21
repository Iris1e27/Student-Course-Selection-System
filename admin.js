const DB = "DB";
const DBVERSION = 1;
const TABLE = "courses";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: "",
      addCourse: { name: "", teacher: "", time: "" },
    };
  }

  componentDidMount() {
    this.DBLoad();
  }

  DBLoad = () => {
    let request = window.indexedDB.open(DB, DBVERSION);
    let that = this;

    request.onsuccess = () => {
      console.log("open DB successfully");
      that.readAllData();
    };

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains(TABLE)) {
        console.log("this is the first time create a table called " + TABLE);
        var objectStore = db.createObjectStore(TABLE, {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("name", "name", { unique: true });
        objectStore.createIndex("teacher", "teacher", { unique: false });
        that.addData({
          name: "CSE103",
          teacher: "zjt",
          time: "10:00-12:00",
        });
        that.addData({
          name: "CSE204",
          teacher: "zjt",
          time: "16:00-18:00",
        });
        console.log("create successfully " + TABLE);
      } else {
        console.log("there is an existing table called " + TABLE);
      }
    };

    request.onerror = (event) => {
      console.log("error: " + event);
    };
  };

  addData = (value) => {
    let DBAddRequest = window.indexedDB.open(DB);
    DBAddRequest.onsuccess = () => {
      let transaction = DBAddRequest.result.transaction([TABLE], "readwrite");
      let objectStore = transaction.objectStore(TABLE);
      let request = objectStore.add(value);
      request.onsuccess = (event) => {
        this.handleCourseChange();
        console.log("addData successfully: " + value.toString());
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("addData " + DBAddRequest.result);
    };
  };

  readAllData = () => {
    let DBReadRequest = window.indexedDB.open(DB);
    DBReadRequest.onsuccess = () => {
      let transaction = DBReadRequest.result.transaction([TABLE], "readonly");
      let objectStore = transaction.objectStore(TABLE);
      let request = objectStore.getAll();
      request.onsuccess = (event) => {
        if (request.result) {
          this.setState({
            courses: event.target.result,
            addCourse: { name: "", teacher: "", time: "" },
          });
          console.log(this.state.courses);
        } else {
          console.log(request.result);
        }
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("readAllData " + DBReadRequest.result);
    };
  };

  delData = (id) => {
    let DBDeleteRequest = window.indexedDB.open(DB);
    DBDeleteRequest.onsuccess = () => {
      let transaction = DBDeleteRequest.result.transaction(
        [TABLE],
        "readwrite"
      );
      let objectStore = transaction.objectStore(TABLE);
      let request = objectStore.delete(id);
      request.onsuccess = (event) => {
        this.handleCourseChange();
        console.log("delData successfully: " + id);
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("delData " + DBDeleteRequest.result);
    };
  };

  handleCourseChange = () => {
    this.readAllData();
  };

  handleCourseDelete = (event) => {
    console.log("Del Course: " + parseInt(event.target.dataset.id));
    console.log("Del Course type: " + typeof event.target.dataset.id);
    console.log("all courses: " + this.state.courses);
    this.delData(parseInt(event.target.dataset.id));
  };

  handleCourseUpdate = (event) => {
    let dataset = event.target.dataset;
    document.getElementById("name").value = dataset.name;
    document.getElementById("teacher").value = dataset.teacher;
    document.getElementById("time").value = dataset.time;
    this.delData(parseInt(dataset.id));
    console.log("Del Course: " + parseInt(dataset.id));
  };

  changeName = (event) => {
    this.state.addCourse.name = event.target.value;
    console.log(this.state.addCourse.name);
  };

  changeTeacher = (event) => {
    this.state.addCourse.teacher = event.target.value;
    console.log(this.state.addCourse.teacher);
  };

  changeTime = (event) => {
    this.state.addCourse.time = event.target.value;
    console.log(this.state.addCourse.time);
  };

  handleCourseAdd = (event) => {
    if (this.state.addCourse.name == "" || this.state.addCourse.teacher == "" || this.state.addCourse.time == "") {
      alert("Error: Check if name, teacher or time is empty. Try again. ");
    } else {
      console.log("all courses: " + this.state.courses);
      this.addData(this.state.addCourse);
      console.log("Add ok");
      document.getElementById("name").value = "";
      document.getElementById("teacher").value = "";
      document.getElementById("time").value = "";
    }
    
  };

  handleCourseClear = (event) => {
    this.setState({
      addCourse: {
        name: "",
        teacher: "",
        time: "",
      }
    });
    document.getElementById("name").value = "";
    document.getElementById("teacher").value = "";
    document.getElementById("time").value = "";
    console.log("clear");
  };

  render() {
    const { courses, addCourse } = this.state;
    const { addName, addTeacher, addTime } = addCourse;
    const hintCheck = <h2>Check existing courses: </h2>;
    const hintAdd = <h2>Add a new course: </h2>;
    const hintLogOut = <h2>All things done? </h2>;
    const tableHeader = (
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Teacher</th>
        <th>Time</th>
        <th>Button</th>
        <th>Button</th>
      </tr>
    );
    const coursesTable = Object.entries(courses).map(
      ([numNow, { id, name, teacher, time }]) => (
        <tr key={numNow}>
          <td>{numNow}</td>
          <td>{name}</td>
          <td>{teacher}</td>
          <td>{time}</td>
          <td>
            <button
              type="button"
              data-id={id}
              onClick={this.handleCourseDelete}
            >
              Delete
            </button>
          </td>
          <td>
            <button
              type="button"
              data-id={id}
              data-name={name}
              data-teacher={teacher}
              data-time={time}
              onClick={this.handleCourseUpdate}
            >
              Update
            </button>
          </td>
        </tr>
      )
    );
    const coursesAdd = (
      <tr>
        <td>{courses.length}</td>
        <td>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Name"
            value={addName}
            onBlur={this.changeName}
          />
        </td>
        <td>
          <input
            type="text"
            name="teacher"
            id="teacher"
            placeholder="Enter Teacher"
            value={addTeacher}
            onBlur={this.changeTeacher}
          />
        </td>
        <td>
          <input
            type="text"
            name="time"
            id="time"
            placeholder="Enter Time"
            value={addTime}
            onBlur={this.changeTime}
          />
        </td>
        <td>
          <button type="button" onClick={this.handleCourseAdd}>
            Add
          </button>
        </td>
        <td>
          <button type="button" onClick={this.handleCourseClear}>
            Clear
          </button>
        </td>
      </tr>
    );
    return (
      <div>
        <div>{hintCheck}</div>
        <table>
          <thead>{tableHeader}</thead>
          <tbody>{coursesTable}</tbody>
        </table>
        <div>{hintAdd}</div>
        <table>
          <thead>{tableHeader}</thead>
          <tbody>{coursesAdd}</tbody>
        </table>
        <div>{hintLogOut}</div>
        <div id="other_container">
          Nothing to do? Click <a href="/index.html">here</a> to Log Out <br />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Admin />, document.querySelector("#admin_container"));
