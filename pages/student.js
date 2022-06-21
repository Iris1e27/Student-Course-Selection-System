const DB = "DB";
const MYDB = "MYDB";
const DBVERSION = 1;
const MYDBVERSION =
  JSON.parse(localStorage.getItem("ids", JSON)).ids.length || 1;
const TABLE = "courses";
const MYTABLE = localStorage.getItem("username");

class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: "",
      selectedCourses: "",
      selectedNames: "",
    };
  }

  componentDidMount() {
    this.DBLoad();
    this.MYDBLoad();
  }

  DBLoad = () => {
    let request = window.indexedDB.open(DB, DBVERSION);
    let that = this;

    request.onsuccess = (event) => {
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
        console.log("create successfully " + TABLE);
      } else {
        console.log("there is an existing table called " + TABLE);
      }
    };

    request.onerror = (event) => {
      console.log("error: " + event);
    };
  };

  MYDBLoad = () => {
    let request = window.indexedDB.open(MYDB, MYDBVERSION);
    let that = this;

    request.onsuccess = (event) => {
      console.log("open MYDB successfully");
      that.readAllSelections();
    };

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains(MYTABLE)) {
        console.log("this is the first time create a table called " + MYTABLE);
        var objectStore = db.createObjectStore(MYTABLE, {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("name", "name", { unique: true });
        objectStore.createIndex("teacher", "teacher", { unique: false });
        console.log("create successfully " + MYTABLE);
      } else {
        console.log("there is an existing table called " + MYTABLE);
      }
    };

    request.onerror = (event) => {
      console.log("error: " + event);
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

  readAllSelections = () => {
    let DBReadRequest = window.indexedDB.open(MYDB);
    DBReadRequest.onsuccess = () => {
      let transaction = DBReadRequest.result.transaction([MYTABLE], "readonly");
      let objectStore = transaction.objectStore(MYTABLE);
      let request = objectStore.getAll();
      request.onsuccess = (event) => {
        if (request.result) {
          this.setState({
            selectedCourses: event.target.result,
          });
          console.log(this.state.selectedCourses);
          let newSelectedNames = [];
          for (
            let index = 0;
            index < this.state.selectedCourses.length;
            index++
          ) {
            let element = this.state.selectedCourses[index].name;
            newSelectedNames.push(element);
          }
          this.setState({
            selectedNames: newSelectedNames,
          });
          console.log(this.state.selectedNames);
        } else {
          console.log(request.result);
        }
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("readAllSelections " + DBReadRequest.result);
    };
  };

  addSelection = (value) => {
    let DBAddRequest = window.indexedDB.open(MYDB);
    DBAddRequest.onsuccess = () => {
      let transaction = DBAddRequest.result.transaction([MYTABLE], "readwrite");
      let objectStore = transaction.objectStore(MYTABLE);
      let request = objectStore.add(value);
      request.onsuccess = (event) => {
        this.handleSelectionChange();
        console.log("addSelection successfully: " + value.toString());
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("addSelection " + DBAddRequest.result);
    };
  };

  delSelection = (id) => {
    let DBDeleteRequest = window.indexedDB.open(MYDB);
    DBDeleteRequest.onsuccess = () => {
      let transaction = DBDeleteRequest.result.transaction(
        [MYTABLE],
        "readwrite"
      );
      let objectStore = transaction.objectStore(MYTABLE);
      let request = objectStore.delete(id);
      request.onsuccess = (event) => {
        this.handleSelectionChange();
        console.log("delSelection successfully: " + id);
      };
      transaction.onerror = (event) => {
        console.error("error is " + event.target.error.message);
      };
      console.log("delSelection " + DBDeleteRequest.result);
    };
  };

  handleSelectionChange = () => {
    this.readAllSelections();
  };

  handleCourseSelect = (event) => {
    let dataset = event.target.dataset;
    let selectedCourse = {
      name: dataset.name,
      teacher: dataset.teacher,
      time: dataset.time,
    };
    this.addSelection(selectedCourse);
    console.log("Add Selction ok " + selectedCourse);
  };

  handleCourseCancel = (event) => {
    let dataset = event.target.dataset;
    this.delSelection(parseInt(dataset.id));
    console.log("Del Selction: " + parseInt(dataset.id));
  };

  render() {
    const { courses, selectedCourses, selectedNames } = this.state;
    const hintHello = <h2>Hello, {MYTABLE} !</h2>;
    const hintCheck = <h2>Check existing courses: </h2>;
    const hintSelection = <h2>Check your selections: </h2>;
    const hintLogOut = <h2>All things done? </h2>;
    const tableHeader = (
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Teacher</th>
        <th>Time</th>
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
            {!selectedNames.includes(name) && (
              <button
                type="button"
                id={name}
                className="select"
                data-name={name}
                data-teacher={teacher}
                data-time={time}
                onClick={this.handleCourseSelect}
              >
                Select
              </button>
            )}
          </td>
        </tr>
      )
    );
    const coursesSelection = Object.entries(selectedCourses).map(
      ([numNow, { id, name, teacher, time }]) => (
        <tr key={numNow}>
          <td>{numNow}</td>
          <td>{name}</td>
          <td>{teacher}</td>
          <td>{time}</td>
          <td>
            <button
              type="button"
              id={name}
              className="cancel"
              data-id={id}
              data-name={name}
              onClick={this.handleCourseCancel}
            >
              Cancel
            </button>
          </td>
        </tr>
      )
    );

    return (
      <div>
        <div>{hintHello}</div>
        <div>{hintCheck}</div>
        <table>
          <thead>{tableHeader}</thead>
          <tbody>{coursesTable}</tbody>
        </table>
        <div>{hintSelection}</div>
        <table>
          <thead>{tableHeader}</thead>
          <tbody>{coursesSelection}</tbody>
        </table>
        <div>{hintLogOut}</div>
        <div id="other_container">
          Nothing to do? Click <a href="/index.html">here</a> to Log Out <br />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Student />, document.querySelector("#student_container"));
