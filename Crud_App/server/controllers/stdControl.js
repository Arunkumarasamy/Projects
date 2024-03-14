const mysql = require("mysql")


const con = mysql.createPool({    //it's placed where the connection will'e stored
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})



exports.homePage = (req, res) => {

  con.getConnection(function (err, connect) {
    if (err) throw err;
    //  console.log("DB has connected")
    connect.query("SELECT * FROM student_datas", function (err, rows) {
      connect.release()  // release the connect
      console.log(rows)
      if (!err) {
        //console.log("good")
        res.render("home", { rows })   // rows-->add new data in display
      }
      else {
        console.log("error in render")
      }
    })
  })
};


exports.adduser = (req, res) => {
  res.render("adduser")
}


exports.saveNewUser = (req, res) => {

  con.getConnection(function (err, connect) {
    if (err) throw err;
    //  console.log("DB has connected")
    const { name, age, city } = req.body;               //{in createPage the "form"tag given "name" value must be same}

    connect.query("INSERT INTO student_datas(Name,Age,City) VALUES(?,?,?)", [name, age, city], function (err, rows) {
      connect.release()  // release the connect

      if (!err) {
        //console.log("good")
        res.render("adduser", { msg: "User detail add Success" })   // rows-->add new data in display
      }
      else {
        console.log("error in render")
      }
    })
  })
};


exports.userEdit = (req, res) => {

  con.getConnection(function (err, connect) {
    if (err) throw err;

    let id = req.params.id;                   // get the "parameter" value from the req object

    connect.query("SELECT * FROM student_datas WHERE id=?", [id], function (err, rows) {
      connect.release();  // release the connect
      //console.log(rows)
      if (!err) {
        //console.log("good")
        res.render("edituser", { rows })   // rows-->add new data in display
      }
      else {
        console.log("error in render")
      }
    })
  })
};



exports.userUpdate = (req, res) => {
  con.getConnection(function (err, connect) {
    if (err) throw err;

    const { name, age, city } = req.body
    let id = req.params.id;
    connect.query("update student_datas set Name=?,Age=?,City=? where ID=?", [name, age, city, id], function (err, rows) {     //id-->set id because page refersh stay that page
      connect.release()

      if (!err) {
        // console.log("SuccessFully Update")

        // if incase refresh the page
        con.getConnection(function (err, connect) {
          if (err) throw err;

          let id = req.params.id;                   // get ID from url

          connect.query("SELECT * FROM student_datas WHERE id=?", [id], function (err, rows) {
            connect.release();  // release the connect
            console.log(rows)
            if (!err) {
              //console.log("good")

              res.render("edituser", { rows, msg: "User detail Updated Success" })
            }
            else {
              console.log("error in render")
            }
          })
        })
      }
      else {
        console.log("update error")
      }
    })
  })
}

// delete

exports.delete = (req, res) => {
  con.getConnection(function (err, connect) {
    if (err) throw err

    // get id from URL
    let id = req.params.id;
    connect.query("delete from student_datas where id=?", [id], function (err, rows) {
      connect.release()

      if (!err) {
        res.redirect("/");
      }
      else {
        console.log("Delete Error")
      }
    })

    res.render
  })
}