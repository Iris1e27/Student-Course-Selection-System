class Other extends React.Component {
    constructor() {
        super();
        this.state = {
            db: null,
            courses: null,
        };
    }

    componentDidMount() {
        this.DBFun();
    }

    // 组件被卸载和销毁之前立刻调用。也就是离开页面
    componentWillUnmount() {
        this.addData();
    }

    //初始化加载数据
    DBFun = () => {
        let request = window.indexedDB.open("test", 1),
            db;
        let that = this;

        request.onsuccess = function (e) {
            console.log("数据库打开成功");
            that.readData(request.result);
        };
        //这个方法就第一次会执行
        request.onupgradeneeded = function (event) {
            /**
             * 数据库新建成功以后，新增一张叫做data的表格，主键是id。更好的写法是先判断一下，这张表是否存在，如果不存在再新建。
             * data其实就是键值对
             * ex：data：{id：1，name："1"}
             */
            db = event.target.result;
            if (!db.objectStoreNames.contains("data")) {
                console.log("第一次创建一个字段，即表");
                db.createObjectStore("data", { keyPath: "id" });
            } else {
                console.log(db);
            }
        };

        request.onerror = function (e) {
            console.log("Error");
            console.log(e);
        };
    };

    //删除缓存
    handleClickDelete = () => {
        // 删除表库的
        // let DBDeleteRequest = window.indexedDB.deleteDatabase("test");
        //删除字段的
        let DBDeleteRequest = window.indexedDB.open("test", 1);
        DBDeleteRequest.onsuccess = function (event) {
            let transaction = DBDeleteRequest.result.transaction(["data"], "readwrite");
            let objectStore = transaction.objectStore("data");
            let request = objectStore.delete(1);
            request.onsuccess = function (event) {
                console.log("数据删除成功");
            };
        };
    };

    //新增数据
    addData = () => {
        /*
            transaction()方法接受两个参数：第一个参数是一个数组，里面是所涉及的对象仓库，通常是只有一个；第二个参数是一个表示操作类型的字符串。
            目前，操作类型只有两种：readonly（只读）和readwrite（读写）。添加数据使用readwrite，读取数据使用readonly。第二个参数是可选的，省略时默认为readonly模式。
            objectStore():包含了当前对象仓库的所有索引,也就是哪张表存入了什么数据
        */
        let DBAddRequest = window.indexedDB.open("test");
        DBAddRequest.onsuccess = function (event) {
            let transaction = DBAddRequest.result.transaction(["data"], "readwrite");
            let objectStore = transaction.objectStore("data");
            let request = objectStore.get(1);
            request.onsuccess = function (event) {
                //离开页面时看当前有误数据，有的话就说明上一次存过，只需要更新最新的，没有的话就插入
                if (request.result) {
                    console.log("更新最新的值");
                    let objectStoreRequest = objectStore.put({ id: 1, name: "李四", age: 35, email: "lisi@example.com" });
                    objectStoreRequest.onsuccess = function (event) {
                        console.log("数据更新写入成功");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("数据更新写入失败");
                    };
                } else {
                    //这里可以对这个对象进行判断，看有无数据，如果有的话插入，没有就不插入
                    let objectStoreRequest = objectStore.add({ id: 1, name: "张三", age: 24, email: "zhangsan@example.com" });
                    objectStoreRequest.onsuccess = function (event) {
                        console.log("数据写入成功");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("数据写入失败");
                    };
                }
            };
        };
    };

    //读取数据
    readData = (result) => {
        let transaction = result.transaction(["data"]);
        let objectStore = transaction.objectStore("data");
        let request = objectStore.get(1);
        request.onsuccess = function (event) {
            if (request.result) {
                console.log(request.result);
            } else {
                console.log("未获得数据记录");
            }
        };
    };

    render() {
        return (
            <div className="main-box">
                <button onClick={this.handleClickDelete}>提交-意味着删除DB缓存</button>
                <button onClick={this.addData}>新增数据，在推出当前页面的情况下</button>
                <br />
                
            </div>
        );
    }
}
ReactDOM.render(<Other />, document.getElementById("here"))