const express=require("express")
const router= express.Router()                        // create router obj
const stdControl= require("../controllers/stdControl")  

// view all reco
router.get("/",stdControl.homePage);              // ("/goPage","fileName.funName")

// addNew user
router.get("/adduser",stdControl.adduser);
router.post("/adduser",stdControl.saveNewUser);

// edit user
router.get("/edituser/:id",stdControl.userEdit);
router.post("/edituser/:id",stdControl.userUpdate);

// delete user
router.get("/deleteuser/:id",stdControl.delete)

module.exports = router    // export router page